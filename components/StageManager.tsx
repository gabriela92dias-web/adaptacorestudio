import React, { useState } from "react";
import { z } from "zod";
import { ChevronUp, ChevronDown, Edit2, Trash2, CalendarIcon, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { 
  useStages, 
  useCreateStage, 
  useUpdateStage, 
  useDeleteStage 
} from "../helpers/useCoreactHierarchyHooks";
import { StageStatusArrayValues } from "../helpers/schema";
import { Button } from "./Button";
import { Input } from "./Input";
import { Badge } from "./Badge";
import { Skeleton } from "./Skeleton";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./Select";
import { Form, FormItem, FormLabel, FormControl, FormMessage, useForm } from "./Form";
import styles from "./StageManager.module.css";

const statusMap: Record<string, { label: string; variant: "primary" | "secondary" | "outline" | "success" }> = {
  pending: { label: "Pendente", variant: "outline" },
  in_progress: { label: "Em andamento", variant: "primary" },
  completed: { label: "Concluída", variant: "success" },
};

const stageSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  status: z.enum(StageStatusArrayValues).default("pending"),
  startDate: z.string().optional().nullable().transform(val => val || null),
  endDate: z.string().optional().nullable().transform(val => val || null),
});

type StageFormData = z.infer<typeof stageSchema>;

function StageInlineForm({ 
  initialData, 
  projectId, 
  onSuccess, 
  onCancel,
  mode = "create",
  sortOrder = 0
}: { 
  initialData?: any; 
  projectId: string; 
  onSuccess: () => void; 
  onCancel: () => void;
  mode?: "create" | "edit";
  sortOrder?: number;
}) {
  const createMutation = useCreateStage();
  const updateMutation = useUpdateStage();

  const form = useForm({
    schema: stageSchema,
    defaultValues: {
      name: initialData?.name || "",
      status: initialData?.status || "pending",
      // Using native date inputs which accept and return YYYY-MM-DD
      startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : "",
      endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : "",
    },
  });

  const onSubmit = async (data: StageFormData) => {
    try {
      const payload = {
        name: data.name,
        status: data.status,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
      };

      if (mode === "create") {
        await createMutation.mutateAsync({
          ...payload,
          projectId,
          sortOrder
        });
        toast.success("Estágio criado!");
      } else {
        await updateMutation.mutateAsync({
          id: initialData.id,
          ...payload
        });
        toast.success("Estágio atualizado!");
      }
      onSuccess();
    } catch (err) {
      toast.error(`Erro ao ${mode === "create" ? "criar" : "atualizar"} estágio`);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className={styles.editForm}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className={styles.formGrid}>
            <FormItem name="name">
              <FormLabel>Nome do Estágio</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: Briefing, Desenvolvimento..." 
                  value={form.values.name}
                  onChange={e => form.setValues(p => ({ ...p, name: e.target.value }))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem name="status">
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select
                  value={form.values.status}
                  onValueChange={(val: any) => form.setValues(p => ({ ...p, status: val }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {StageStatusArrayValues.map(s => (
                      <SelectItem key={s} value={s}>{statusMap[s].label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </div>

          <div className={styles.formDates}>
            <FormItem name="startDate">
              <FormLabel>Início (Opcional)</FormLabel>
              <FormControl>
                <Input 
                  type="date"
                  value={form.values.startDate || ""}
                  onChange={e => form.setValues(p => ({ ...p, startDate: e.target.value }))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem name="endDate">
              <FormLabel>Fim (Opcional)</FormLabel>
              <FormControl>
                <Input 
                  type="date"
                  value={form.values.endDate || ""}
                  onChange={e => form.setValues(p => ({ ...p, endDate: e.target.value }))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </div>

          <div className={styles.formActions}>
            <Button variant="ghost" type="button" onClick={onCancel}>Cancelar</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export function StageManager({ projectId }: { projectId: string }) {
  const { data, isLoading } = useStages(projectId);
  const deleteMutation = useDeleteStage();
  const updateMutation = useUpdateStage();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleDelete = async (id: string) => {
    if (confirm("Deseja realmente excluir este estágio? Tarefas atreladas podem ser impactadas.")) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success("Estágio excluído");
      } catch (err) {
        toast.error("Erro ao excluir estágio");
      }
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (!data?.stages) return;
    
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= data.stages.length) return;

    const currentStage = data.stages[index];
    const targetStage = data.stages[targetIndex];

    try {
      // Opting for sequential mutation to avoid race conditions in concurrent DB transactions if unsupported
      await updateMutation.mutateAsync({ id: currentStage.id, sortOrder: targetStage.sortOrder });
      await updateMutation.mutateAsync({ id: targetStage.id, sortOrder: currentStage.sortOrder });
    } catch (err) {
      toast.error("Erro ao reordenar estágios");
    }
  };

  const stages = data?.stages || [];
  const nextSortOrder = stages.length > 0 ? Math.max(...stages.map(s => s.sortOrder || 0)) + 1 : 0;

  return (
    <div className={styles.container}>
      <h3 className={styles.header}>Estágios do Projeto</h3>

      {isLoading ? (
        <div className={styles.list}>
          <Skeleton style={{ height: "48px" }} />
          <Skeleton style={{ height: "48px" }} />
        </div>
      ) : stages.length === 0 && !isCreating ? (
        <div className={styles.emptyState}>
          Nenhum estágio configurado neste projeto.
        </div>
      ) : (
        <div className={styles.list}>
          {stages.map((stage, index) => {
            if (editingId === stage.id) {
              return (
                <StageInlineForm 
                  key={stage.id}
                  initialData={stage}
                  projectId={projectId}
                  mode="edit"
                  onSuccess={() => setEditingId(null)}
                  onCancel={() => setEditingId(null)}
                />
              );
            }

            return (
              <div key={stage.id} className={styles.stageRow}>
                <div className={styles.reorderButtons}>
                  <button 
                    className={styles.reorderBtn} 
                    disabled={index === 0 || updateMutation.isPending}
                    onClick={() => handleMove(index, 'up')}
                    aria-label="Mover para cima"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button 
                    className={styles.reorderBtn} 
                    disabled={index === stages.length - 1 || updateMutation.isPending}
                    onClick={() => handleMove(index, 'down')}
                    aria-label="Mover para baixo"
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>

                <div className={styles.stageInfo}>
                  <span className={styles.stageName}>{stage.name}</span>
                  <div className={styles.stageMeta}>
                    <Badge variant={statusMap[stage.status as string]?.variant || "default"} className={styles.badge}>
                      {statusMap[stage.status as string]?.label || stage.status}
                    </Badge>
                    {(stage.startDate || stage.endDate) && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <CalendarIcon size={12} />
                        {stage.startDate ? new Intl.DateTimeFormat("pt-BR").format(new Date(stage.startDate)) : "-"} 
                        {" até "} 
                        {stage.endDate ? new Intl.DateTimeFormat("pt-BR").format(new Date(stage.endDate)) : "-"}
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.stageActions}>
                  <Button variant="ghost" size="icon-sm" onClick={() => setEditingId(stage.id)}>
                    <Edit2 size={16} />
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(stage.id)} className={styles.deleteBtn}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isCreating ? (
        <div style={{ marginTop: "var(--spacing-2)" }}>
          <StageInlineForm 
            projectId={projectId}
            mode="create"
            sortOrder={nextSortOrder}
            onSuccess={() => setIsCreating(false)}
            onCancel={() => setIsCreating(false)}
          />
        </div>
      ) : (
        <Button 
          variant="outline" 
          className={styles.addBtn}
          onClick={() => setIsCreating(true)}
        >
          <Plus size={16} /> Adicionar Estágio
        </Button>
      )}
    </div>
  );
}