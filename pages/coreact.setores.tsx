import React, { useState, useEffect, useRef } from "react";
import { Plus, ChevronLeft, ChevronRight, Building2, Settings } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { useSectors, useCreateSector } from "../helpers/useCoreActApi";

import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Skeleton } from "../components/Skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/Tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/Dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/Sheet";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  useForm,
} from "../components/Form";
import { Tooltip, TooltipContent, TooltipTrigger } from "../components/Tooltip";
import { getSectorIcon, getSectorSortWeight } from "../helpers/getSectorIcon";

import { CoreactSectorGeneral } from "../components/CoreactSectorGeneral";
import { CoreactSectorMembers } from "../components/CoreactSectorMembers";
import { CoreactSectorPermissions } from "../components/CoreactSectorPermissions";
import { CoreactSectorDashboard } from "../components/CoreactSectorDashboard";
import { useAdaptiveLevel } from "../helpers/useAdaptiveLevel";

import styles from "./coreact.setores.module.css";

const createSectorSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional().nullable(),
});

type CreateSectorFormData = z.infer<typeof createSectorSchema>;

export default function CoreActSetores() {
  const { data: sectors, isLoading } = useSectors();
  const { ref, level, className: adaptiveClass } = useAdaptiveLevel({
    itemCount: sectors?.length ?? 0,
  });
  const createMutation = useCreateSector();

  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState("membros");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const sidebarRef = useRef<HTMLDivElement>(null);

  const form = useForm({
    schema: createSectorSchema,
    defaultValues: { name: "", description: "" },
  });

  const sortedSectors = React.useMemo(() => {
    if (!sectors) return undefined;
    return [...sectors].sort((a, b) => getSectorSortWeight(a.name) - getSectorSortWeight(b.name));
  }, [sectors]);

  // Handle auto-minimize on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !isSidebarCollapsed &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsSidebarCollapsed(true);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarCollapsed]);

  const handleCreateSubmit = async (data: CreateSectorFormData) => {
    try {
      const result = await createMutation.mutateAsync(data);
      toast.success("Setor criado com sucesso!");
      setIsCreateModalOpen(false);
      form.setValues({ name: "", description: "" });
      if (result.sector) {
        setSelectedSectorId(result.sector.id);
      }
    } catch (err) {
      toast.error("Erro ao criar setor");
    }
  };

  const selectedSector = sectors?.find((s) => s.id === selectedSectorId);

  const handleSidebarClick = () => {
    if (isSidebarCollapsed) {
      setIsSidebarCollapsed(false);
    }
  };

  return (
    <div ref={ref} className={`${styles.layout} ${adaptiveClass} ${styles[`level${level}`]}`}>
      {/* Left Sidebar / List */}
      <div 
        ref={sidebarRef}
        className={`${styles.sidebar} ${selectedSectorId ? styles.hiddenOnMobile : ""} ${isSidebarCollapsed ? styles.collapsed : ""}`}
        onClick={handleSidebarClick}
      >
        <div className={styles.sidebarHeader}>
          {!isSidebarCollapsed && (
            <div className={styles.headerText}>
              <h1 className={styles.title}>Setores</h1>
              <p className={styles.subtitle}>Gerencie os departamentos</p>
            </div>
          )}
          <Button 
            size={isSidebarCollapsed ? "icon-sm" : "icon"} 
            onClick={(e) => {
              e.stopPropagation();
              setIsCreateModalOpen(true);
            }} 
            title="Novo Setor"
            className={isSidebarCollapsed ? styles.addButtonCollapsed : undefined}
          >
            <Plus size={isSidebarCollapsed ? 16 : 18} />
          </Button>
        </div>

        <div className={styles.sectorList}>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className={styles.skeletonItem} />
            ))
          ) : sortedSectors?.length === 0 ? (
            <div className={styles.emptyList}>
              {!isSidebarCollapsed && <p>Nenhum setor cadastrado.</p>}
            </div>
          ) : (
            sortedSectors?.map((sector, index) => {
              const isActive = selectedSectorId === sector.id;
              const SectorIcon = getSectorIcon(sector.name, index);
              
              const buttonContent = (
                <button
                  className={`${styles.sectorItem} ${
                    isActive ? styles.sectorItemActive : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSectorId(sector.id);
                  }}
                >
                  <SectorIcon size={16} className={styles.sectorIcon} />
                  {!isSidebarCollapsed && <span className={styles.sectorName}>{sector.name}</span>}
                </button>
              );

              if (isSidebarCollapsed) {
                return (
                  <Tooltip key={sector.id}>
                    <TooltipTrigger asChild>
                      {buttonContent}
                    </TooltipTrigger>
                    <TooltipContent side="right">{sector.name}</TooltipContent>
                  </Tooltip>
                );
              }

              return <React.Fragment key={sector.id}>{buttonContent}</React.Fragment>;
            })
          )}
        </div>

        <div className={styles.sidebarFooter}>
          <Button
            variant="ghost"
            className={styles.collapseButton}
            onClick={(e) => {
              e.stopPropagation();
              setIsSidebarCollapsed(!isSidebarCollapsed);
            }}
            title={isSidebarCollapsed ? "Expandir painel" : "Recolher painel"}
            aria-label="Alternar painel"
          >
            {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Button>
        </div>
      </div>

      {/* Right Panel / Detail */}
      <div className={`${styles.mainPanel} ${!selectedSectorId ? styles.hiddenOnMobile : ""}`}>
        {selectedSectorId && selectedSector ? (
          <div className={styles.detailContainer}>
            <div className={styles.detailHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-3)" }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className={styles.backButton}
                  onClick={() => setSelectedSectorId(null)}
                >
                  <ChevronLeft size={20} />
                </Button>
                <h2 className={styles.detailTitle}>{selectedSector.name}</h2>
              </div>
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className={styles.settingsButton}>
                    <Settings size={16} />
                    Configurações
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className={activeSettingsTab === "permissoes" ? styles.wideSheet : undefined}
                >
                  <SheetHeader>
                    <SheetTitle>Configurações do Setor</SheetTitle>
                  </SheetHeader>
                  <div style={{ flex: 1, overflowY: "auto", padding: "var(--spacing-4)" }}>
                    <Tabs
                      defaultValue="membros"
                      key={selectedSector.id}
                      className={styles.tabsRoot}
                      onValueChange={setActiveSettingsTab}
                    >
                      <TabsList>
                        <TabsTrigger value="membros">Membros</TabsTrigger>
                        <TabsTrigger value="permissoes">Permissões</TabsTrigger>
                        <TabsTrigger value="dados">Dados</TabsTrigger>
                      </TabsList>

                      <TabsContent value="dados" className={styles.tabContent}>
                        <CoreactSectorGeneral
                          sector={selectedSector}
                          onDeleted={() => setSelectedSectorId(null)}
                        />
                      </TabsContent>

                      <TabsContent value="membros" className={styles.tabContent}>
                        <CoreactSectorMembers sectorId={selectedSector.id} />
                      </TabsContent>

                      <TabsContent value="permissoes" className={styles.tabContent}>
                        <CoreactSectorPermissions sectorId={selectedSector.id} />
                      </TabsContent>
                    </Tabs>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <div className={styles.dashboardContainer}>
              <CoreactSectorDashboard sector={selectedSector} />
            </div>
          </div>
        ) : (
          <div className={styles.noSelection}>
            <Building2 size={48} className={styles.noSelectionIcon} />
            <h3>Nenhum setor selecionado</h3>
            <p>Selecione um setor na lista ao lado ou crie um novo.</p>
            <Button onClick={() => setIsCreateModalOpen(true)} className={styles.mt4}>
              <Plus size={16} /> Novo Setor
            </Button>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Setor</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateSubmit)}>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)", margin: "var(--spacing-4) 0" }}>
                <FormItem name="name">
                  <FormLabel>Nome do Setor</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Recursos Humanos"
                      value={form.values.name}
                      onChange={(e) => form.setValues((p) => ({ ...p, name: e.target.value }))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>
              <DialogFooter>
                <Button variant="secondary" type="button" onClick={() => setIsCreateModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Criando..." : "Criar Setor"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}