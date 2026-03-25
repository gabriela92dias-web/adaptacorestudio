import React, { useState } from "react";
import Papa from "papaparse";
import { UploadIcon, CheckCircle2, AlertCircle, AlertTriangle, LayersIcon, CompassIcon, ArrowLeftIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
// Lightweight name normalization for frontend duplicate check
function normalizeName(name: string): string {
  if (!name) return "";
  let n = name.toLowerCase();
  n = n.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  n = n.replace(
    /\b(de|do|da|dos|das|o|a|os|as|e|em|no|na|nos|nas|para|por|com)\b/g,
    " "
  );
  n = n.replace(/\s+/g, " ").trim();
  return n;
}
import { Button } from "./Button";
import { Textarea } from "./Textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./Dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./Select";
import { useBatchImport } from "../helpers/useBatchImport";
import { BatchImportModuleBuilder } from "./BatchImportModuleBuilder";
import { BatchImportPlanningBaseManager } from "./BatchImportPlanningBaseManager";
import styles from "./BatchImportDialog.module.css";

type EntityType = "hierarchical" | "teamMembers" | "initiatives" | "projects" | "stages" | "tasks";
type Mode = "menu" | "import" | "module" | "planning_base";

const ENTITY_OPTIONS: { value: EntityType; label: string; cols: string; note?: string }[] = [
  {
    value: "hierarchical",
    label: "Hierárquico (Tudo)",
    cols: "Tipo, Nome, Projeto, Etapa, Tarefa, Descrição, Categoria, Responsável, Operador, Prioridade, Status, Início, Fim, Ordem, Horas Estimadas, Tipo Ação, Fornecedor, Valor Previsto, Valor Contratado, Valor Pago, Status Pagamento",
    note: 'A coluna "Tipo" determina o que cada linha cria. Valores aceitos: Projeto, Etapa, Tarefa, Ação, Orçamento. As linhas são processadas nessa ordem, permitindo que projetos criados neste mesmo arquivo sejam referenciados nas etapas e tarefas abaixo.',
  },
  { value: "teamMembers", label: "Equipe (Time)", cols: "Nome, Cargo, Iniciais, Capacidade" },
  { value: "initiatives", label: "Iniciativas", cols: "Nome, Descrição, Status, Início, Fim, Responsável" },
  { value: "projects", label: "Projetos", cols: "Nome, Iniciativa, Categoria, Dono, Início, Fim, Status, Prioridade" },
  { value: "stages", label: "Etapas", cols: "Nome, Projeto, Ordem, Status, Início, Fim" },
  { value: "tasks", label: "Tarefas", cols: "Nome, Projeto, Etapa, Responsável, Prioridade, Status, Início, Fim" },
];

export function BatchImportDialog({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  defaultEntityType = "tasks",
  defaultInitiativeId,
  defaultProjectId,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultEntityType?: EntityType;
  defaultInitiativeId?: string;
  defaultProjectId?: string;
} = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const initialMode = defaultEntityType !== "tasks" ? "import" : "menu";
  const [mode, setMode] = useState<Mode>(initialMode);

  const [entityType, setEntityType] = useState<EntityType>(defaultEntityType);
  const [inputText, setInputText] = useState("");
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [duplicateWarnings, setDuplicateWarnings] = useState<Array<{ importName: string; existingName: string; type: string; context?: string }>>([]);
  const [skipDuplicateCheck, setSkipDuplicateCheck] = useState(false);
  
  const queryClient = useQueryClient();
  const importMutation = useBatchImport();

  const handleOpenChange = (isOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(isOpen);
    }
    if (controlledOnOpenChange) {
      controlledOnOpenChange(isOpen);
    }
    if (!isOpen) {
      resetState();
    }
  };

  const resetState = () => {
    setMode(initialMode);
    setInputText("");
    setPreviewData([]);
    setHeaders([]);
    setEntityType(defaultEntityType);
    setDuplicateWarnings([]);
    setSkipDuplicateCheck(false);
  };

  const handlePreview = () => {
    setDuplicateWarnings([]);
    setSkipDuplicateCheck(false);

    if (!inputText.trim()) {
      toast.error("Por favor, cole os dados antes de pré-visualizar.");
      return;
    }

    Papa.parse(inputText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.meta.fields) {
          setHeaders(results.meta.fields);
        }
        setPreviewData(results.data);
      },
      error: (error: Error) => {
        toast.error(`Erro ao analisar os dados: ${error.message}`);
      },
    });
  };

  const isRowValid = (row: any) => {
    // The main validation is that it must have a name
    const name = row.nome || row.Nome || row.name || row.Name;
    return Boolean(name && String(name).trim() !== "");
  };

  const handleImport = async (forceSkipCheck = false) => {
    const validRows = previewData.filter(isRowValid);
    if (validRows.length === 0) {
      toast.error("Nenhuma linha válida encontrada para importação.");
      return;
    }

    if (!forceSkipCheck && !skipDuplicateCheck) {
      const warnings: Array<{ importName: string; existingName: string; type: string; context?: string }> = [];
      const existingNames = new Map<string, { name: string, type: string, context?: string }>();

      const projectsData = queryClient.getQueriesData({ queryKey: ["coreact", "projects"] });
      const tasksData = queryClient.getQueriesData({ queryKey: ["coreact", "tasks"] });

      projectsData.forEach(([_, data]: any) => {
        if (data?.projects) {
          data.projects.forEach((p: any) => {
            if (p.name) existingNames.set(normalizeName(p.name), { name: p.name, type: "Projeto" });
            if (p.tasks) {
              p.tasks.forEach((t: any) => {
                if (t.name) existingNames.set(normalizeName(t.name), { name: t.name, type: "Tarefa", context: p.name });
              });
            }
          });
        }
      });

      tasksData.forEach(([_, data]: any) => {
        if (data?.tasks) {
          data.tasks.forEach((t: any) => {
            if (t.name) existingNames.set(normalizeName(t.name), { name: t.name, type: "Tarefa", context: t.projectName });
          });
        }
      });

      for (const row of validRows) {
        const rawName = row.nome || row.Nome || row.name || row.Name;
        if (!rawName) continue;
        const normName = normalizeName(String(rawName));
        const existing = existingNames.get(normName);
        if (existing) {
          warnings.push({
            importName: String(rawName),
            existingName: existing.name,
            type: existing.type,
            context: existing.context
          });
        }
      }

      if (warnings.length > 0) {
        setDuplicateWarnings(warnings);
        return;
      }
    }

    try {
      const result = await importMutation.mutateAsync({
        entityType,
        rows: validRows,
        defaultProjectId,
        defaultInitiativeId,
      });

      if (result.errors.length > 0) {
        result.errors.forEach(err => toast.error(err));
      }

      if (result.created > 0) {
        toast.success(`${result.created} itens importados com sucesso!`);
        handleOpenChange(false);
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Erro desconhecido";
      toast.error(`Erro na importação: ${msg}`);
    }
  };

  const handleContinueAnyway = () => {
    setSkipDuplicateCheck(true);
    handleImport(true);
  };

  const selectedConfig = ENTITY_OPTIONS.find((opt) => opt.value === entityType);
  const validCount = previewData.filter(isRowValid).length;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button variant="secondary" size="md">
            <UploadIcon size={16} />
            Importar em Lote
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className={styles.dialogContent}>
        <DialogHeader>
          <DialogTitle>
            {mode === 'menu' ? 'Importação e Criação em Lote' :
             mode === 'import' ? 'Importação em Lote' :
             mode === 'module' ? 'Criar Módulo Reutilizável' : 'Base de Planejamento'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'menu' ? 'O que você deseja fazer?' :
             mode === 'import' ? 'Cole dados copiados do Excel ou Planilhas (separados por tabulação ou vírgula). A primeira linha deve conter os cabeçalhos.' : ''}
          </DialogDescription>
        </DialogHeader>

        {mode === 'menu' && (
          <div className={styles.menuGrid}>
            <button className={styles.menuCard} onClick={() => setMode('import')}>
              <UploadIcon size={32} />
              <div className={styles.menuCardTitle}>Upar dados reais</div>
              <div className={styles.menuCardDesc}>Inserir dados operacionais no sistema</div>
            </button>
            <button className={styles.menuCard} onClick={() => setMode('module')}>
              <LayersIcon size={32} />
              <div className={styles.menuCardTitle}>Criar bloco reutilizável (módulo)</div>
              <div className={styles.menuCardDesc}>Criar estrutura de execução genérica reutilizável</div>
            </button>
            <button className={styles.menuCard} onClick={() => setMode('planning_base')}>
              <CompassIcon size={32} />
              <div className={styles.menuCardTitle}>Gerar a partir de base de planejamento</div>
              <div className={styles.menuCardDesc}>Ativar uma estrutura estratégica de planejamento</div>
            </button>
          </div>
        )}

        {mode === 'import' && (
          <>
            <div className={styles.container}>
              {initialMode !== 'import' && (
                 <div className={styles.backButton}>
                   <Button variant="ghost" size="sm" onClick={() => setMode('menu')}>
                     <ArrowLeftIcon size={16} /> Voltar
                   </Button>
                 </div>
              )}
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Tipo de Entidade</label>
                <Select
                  value={entityType}
                  onValueChange={(val) => setEntityType(val as EntityType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ENTITY_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className={styles.helperText}>
                  <strong>Colunas Esperadas (exemplo):</strong> {selectedConfig?.cols}
                </p>
                {selectedConfig?.note && (
                  <p className={styles.helperNote}>
                    {selectedConfig.note}
                  </p>
                )}
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Dados para Importação</label>
                <Textarea
                  className={styles.textarea}
                  placeholder="Cole seus dados aqui..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </div>

              {previewData.length === 0 ? (
                <Button variant="outline" onClick={handlePreview}>
                  Pré-visualizar
                </Button>
              ) : (
                <div className={styles.previewSection}>
                                {duplicateWarnings.length > 0 && (
                    <div className={styles.warningSection}>
                      <div className={styles.warningHeader}>
                        <AlertTriangle size={18} />
                        <span>Possíveis duplicatas encontradas</span>
                      </div>
                      <p className={styles.warningDescription}>
                        Encontramos <strong>{duplicateWarnings.length} {duplicateWarnings.length === 1 ? 'item' : 'itens'}</strong> com nomes semelhantes a registros que já existem no sistema. Importar novamente pode gerar duplicação.
                      </p>
                      <div className={styles.warningExamples}>
                        <span className={styles.warningExamplesLabel}>Exemplos encontrados:</span>
                        <ul className={styles.warningList}>
                          {duplicateWarnings.slice(0, 5).map((w, i) => (
                            <li key={i} className={styles.warningListItem}>
                              <span className={styles.warningBadge}>{w.type}</span>
                              <span>"{w.existingName}"{w.context ? <span className={styles.warningContext}> em {w.context}</span> : ''}</span>
                            </li>
                          ))}
                        </ul>
                        {duplicateWarnings.length > 5 && (
                          <span className={styles.warningMore}>
                            + {duplicateWarnings.length - 5} {duplicateWarnings.length - 5 === 1 ? 'outro item semelhante' : 'outros itens semelhantes'}
                          </span>
                        )}
                      </div>
                      <div className={styles.warningActions}>
                        <Button variant="outline" size="sm" onClick={() => setDuplicateWarnings([])}>
                          Voltar e revisar
                        </Button>
                        <Button onClick={handleContinueAnyway} variant="secondary" size="sm">
                          Importar mesmo assim
                        </Button>
                      </div>
                    </div>
                  )}
                  <div className={styles.previewHeader}>
                    <span className={styles.previewTitle}>
                      Pré-visualização ({validCount} válidos de {previewData.length})
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => setPreviewData([])}>
                      Limpar / Editar
                    </Button>
                  </div>

                  <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th className={styles.thStatus}></th>
                          {headers.map((h, i) => (
                            <th key={i} className={styles.th}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.map((row, i) => {
                          const valid = isRowValid(row);
                          return (
                            <tr
                              key={i}
                              className={`${styles.tr} ${valid ? "" : styles.trInvalid}`}
                            >
                              <td className={styles.tdStatus}>
                                {valid ? (
                                  <CheckCircle2 size={16} className={styles.iconValid} />
                                ) : (
                                  <AlertCircle size={16} className={styles.iconInvalid} />
                                )}
                              </td>
                              {headers.map((h, j) => (
                                <td key={j} className={styles.td}>
                                  {row[h]}
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="ghost" onClick={() => handleOpenChange(false)}>
                Cancelar
              </Button>
              <Button
                onClick={() => handleImport()}
                disabled={previewData.length === 0 || validCount === 0 || importMutation.isPending || duplicateWarnings.length > 0}
              >
                {importMutation.isPending
                  ? "Importando..."
                  : `Importar ${validCount} itens`}
              </Button>
            </DialogFooter>
          </>
        )}

        {mode === 'module' && (
          <BatchImportModuleBuilder
            onCancel={() => setMode('menu')}
            onSuccess={() => handleOpenChange(false)}
          />
        )}

        {mode === 'planning_base' && (
          <BatchImportPlanningBaseManager
            onCancel={() => setMode('menu')}
            onSuccess={() => handleOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}