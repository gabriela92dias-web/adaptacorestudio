import React, { useState, useMemo, useEffect } from "react";
import { UserPlus, Edit2, Trash2, CheckCircle2, Clock, PlayCircle, AlertCircle, Ban, Plus } from "lucide-react";
import { useAdaptiveLevel } from "../helpers/useAdaptiveLevel";
import { 
  useTeamMembers, useDeleteTeamMember, useTasks
} from "../helpers/useCoreActApi";
import { useSectors } from "../helpers/useSectors";
import { TeamKanbanBoard } from "../components/TeamKanbanBoard";
import { Skeleton } from "../components/Skeleton";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { Avatar, AvatarFallback } from "../components/Avatar";
import { Progress } from "../components/Progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/Tabs";
import { CoreActExecutionsTab } from "../components/CoreActExecutionsTab";
import { CoreactGlobalPermissionsTab } from "../components/CoreactGlobalPermissionsTab";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../components/Sheet";
import { CreateTeamMemberForm, EditTeamMemberForm } from "../components/TeamMemberForms";
import { CreateTeamModal } from "../components/TeamKanbanBoardModals";
import styles from "./coreact.time.module.css";

const employmentTypeLabels: Record<string, string> = {
  clt: "CLT",
  hourly_contractor: "Prestador por Hora",
  contract_service: "Serviço Contratado"
};

type SheetMode = "closed" | "add" | "detail" | "edit";

export default function CoreActTime() {
  const { data: teamData, isLoading } = useTeamMembers();
  const { data: tasksData } = useTasks();
  const { data: sectorsData } = useSectors();
  
  const deleteMember = useDeleteTeamMember();

  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [sheetMode, setSheetMode] = useState<SheetMode>("closed");
  const [activeTab, setActiveTab] = useState<string>("equipe");
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);

  const { ref, level, className: adaptiveClass } = useAdaptiveLevel({
    itemCount: teamData?.teamMembers?.length || 0,
  });

  useEffect(() => {
    if (sheetMode === "closed") {
      setSelectedMemberId(null);
    }
  }, [sheetMode]);

  const stats = useMemo(() => {
    if (!teamData) return null;
    
    const members = teamData.teamMembers;
    const totalMembers = members.length;
    
    // KPI members exclude 'contract_service'
    const kpiMembers = members.filter(m => m.employmentType !== "contract_service");
    
    const totalCapacity = kpiMembers.reduce((acc, m) => acc + Number(m.capacityHours || 0), 0);
    
    let totalUtilizedPct = 0;
    let overloadCount = 0;

    kpiMembers.forEach(m => {
      const cap = Math.max(Number(m.capacityHours || 0), 1);
      const allocated = m.totalAllocatedHours ?? 0;
      const pct = (allocated / cap) * 100;
      totalUtilizedPct += pct;
      if (pct > 100) overloadCount++;
    });

    const avgUtil = kpiMembers.length > 0 ? totalUtilizedPct / kpiMembers.length : 0;

    return { totalMembers, totalCapacity, avgUtil: Math.round(avgUtil), overloadCount };
  }, [teamData]);

  const handleDeleteMember = () => {
    if (!selectedMemberId) return;
    if (window.confirm("Tem certeza que deseja remover este membro da equipe?")) {
      deleteMember.mutate({ id: selectedMemberId }, {
        onSuccess: () => {
          toast.success("Membro removido com sucesso.");
          setSheetMode("closed");
        },
        onError: (err) => {
          toast.error(`Erro ao remover: ${err.message}`);
        }
      });
    }
  };

  const handleMemberClick = (memberId: string) => {
    setSelectedMemberId(memberId);
    setSheetMode("detail");
  };

  if (isLoading || !stats || !teamData) {
    return (
      <div ref={ref} className={`${styles.container} ${adaptiveClass} ${styles[`level${level}`]}`}>
         <div className={styles.header}>
            <Skeleton style={{ width: 250, height: 32 }} />
         </div>
         <Skeleton style={{ width: "100%", height: 60 }} />
         <Skeleton style={{ width: "100%", height: 400 }} />
      </div>
    );
  }

  const selectedMember = selectedMemberId ? teamData.teamMembers.find(m => m.id === selectedMemberId) : null;

  const renderTaskStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="primary" className={styles.taskBadge}><Clock size={12} /> Aberta</Badge>;
      case "in_progress":
        return <Badge variant="secondary" className={styles.taskBadge}><PlayCircle size={12} /> Em andamento</Badge>;
      case "completed":
        return <Badge variant="success" className={styles.taskBadge}><CheckCircle2 size={12} /> Concluída</Badge>;
      case "overdue":
        return <Badge variant="warning" className={styles.taskBadge}><AlertCircle size={12} /> Atrasada</Badge>;
      case "blocked":
        return <Badge variant="destructive" className={styles.taskBadge}><Ban size={12} /> Bloqueada</Badge>;
      default:
        return <Badge variant="outline" className={styles.taskBadge}>{status}</Badge>;
    }
  };

  return (
    <div ref={ref} className={`${styles.container} ${adaptiveClass} ${styles[`level${level}`]}`}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className={styles.tabsContainer}>
        <header className={styles.header}>
          <div className={styles.headerText}>
            <h1 className={styles.title}>Equipe</h1>
            <p className={styles.subtitle}>Gestão de time, carga de trabalho e execuções</p>
          </div>
          <div className={styles.headerActions}>
            <TabsList>
              <TabsTrigger value="equipe">Equipe</TabsTrigger>
              <TabsTrigger value="execucoes">Execuções</TabsTrigger>
              <TabsTrigger value="permissoes">Permissões</TabsTrigger>
            </TabsList>
            {activeTab === "equipe" && (
              <>
                <Button onClick={() => setSheetMode("add")}>
                  <UserPlus size={16} /> {level < 2 && "Adicionar Membro"}
                </Button>
                <Button variant="secondary" onClick={() => setIsCreateTeamOpen(true)}>
                  <Plus size={16} /> {level < 2 && "Novo Time"}
                </Button>
              </>
            )}
          </div>
        </header>

        <TabsContent value="equipe" className={styles.tabContent}>
          <TeamKanbanBoard onMemberClick={handleMemberClick} />
        </TabsContent>

        <TabsContent value="execucoes" className={styles.tabContent}>
          <CoreActExecutionsTab />
        </TabsContent>

        <TabsContent value="permissoes" className={styles.tabContent}>
          <CoreactGlobalPermissionsTab />
        </TabsContent>
      </Tabs>

      <Sheet open={sheetMode !== "closed"} onOpenChange={(open) => !open && setSheetMode("closed")}>
        <SheetContent side="right">
          {sheetMode === "add" && (
            <>
              <SheetHeader>
                <SheetTitle>Adicionar Membro</SheetTitle>
                <SheetDescription>Preencha os dados do novo membro.</SheetDescription>
              </SheetHeader>
              <div className={styles.sheetBody}>
                <CreateTeamMemberForm onSuccess={() => setSheetMode("closed")} />
              </div>
            </>
          )}

          {sheetMode === "detail" && selectedMember && (
            <>
              <SheetHeader>
                <SheetTitle>Detalhes do Membro</SheetTitle>
              </SheetHeader>
              <div className={styles.sheetBody}>
                <div className={styles.detailHeaderActions}>
                  <Button variant="outline" size="sm" onClick={() => setSheetMode("edit")}>
                    <Edit2 size={14} /> Editar
                  </Button>
                  <Button variant="destructive" size="sm" className={styles.removeBtn} onClick={handleDeleteMember} disabled={deleteMember.isPending}>
                    <Trash2 size={14} /> Remover
                  </Button>
                </div>

                <div className={styles.detailHeader}>
                    <Avatar className={styles.detailAvatar}>
                      <AvatarFallback>{selectedMember.initials || (selectedMember.name?.substring(0,2).toUpperCase() ?? "?")}</AvatarFallback>
                    </Avatar>
                    <div className={styles.detailHeaderInfo}>
                      <h3 className={styles.detailName}>{selectedMember.name}</h3>
                      <span className={styles.detailRole}>{selectedMember.role || 'Membro'} &bull; {employmentTypeLabels[selectedMember.employmentType]}</span>
                    </div>
                </div>

                {selectedMember.employmentType !== "contract_service" && (
                  <div className={styles.detailUtilization}>
                    {(() => {
                      const cap = Math.max(Number(selectedMember.capacityHours || 0), 1);
                      const allocated = selectedMember.totalAllocatedHours ?? 0;
                      const utilPct = cap > 0 ? (allocated / cap) * 100 : 0;
                      const isOverloaded = utilPct > 100;
                      return (
                        <>
                          <div className={styles.utilizationSection}>
                            <div className={styles.utilizationHeader}>
                              <span className={styles.utilizationLabel}>Utilização</span>
                              <span className={styles.utilizationPct}>{Math.round(utilPct)}%</span>
                            </div>
                            <Progress value={Math.min(utilPct, 100)} className={isOverloaded ? styles.progressOverload : ''} />
                          </div>
                          <div className={styles.memberStatsRow}>
                            <div className={styles.memberStat}>
                              <span className={styles.statLabel}>Capacidade</span>
                              <span className={styles.statValue}>{Number(selectedMember.capacityHours || 0)}h</span>
                            </div>
                            <div className={styles.memberStat}>
                              <span className={styles.statLabel}>Alocado</span>
                              <span className={styles.statValue}>{allocated}h</span>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}
                
                <div className={styles.assignedTasksSection}>
                  <h4 className={styles.assignedTasksTitle}>Tarefas Atribuídas ({selectedMember.taskCount ?? 0})</h4>
                  <div className={styles.assignedTasksList}>
                      {(selectedMember.assignedTasks?.length ?? 0) === 0 ? (
                        <div className={styles.emptyTasks}>Nenhuma tarefa atribuída no momento.</div>
                      ) : (
                        (selectedMember.assignedTasks ?? []).map(task => {
                          const fullTask = tasksData?.tasks?.find(t => t.id === task.id);
                          const status = fullTask?.status || "open";
                          const progress = fullTask?.progress || 0;

                          return (
                            <div key={task.id} className={styles.assignedTaskCard}>
                              <div className={styles.taskCardTop}>
                                <span className={styles.assignedTaskName}>{task.name}</span>
                                {renderTaskStatusBadge(status)}
                              </div>
                              <span className={styles.assignedTaskProject}>{task.projectName}</span>
                              <div className={styles.taskProgressRow}>
                                <Progress value={progress} className={styles.taskProgressBar} />
                                <span className={styles.taskProgressText}>{progress}%</span>
                              </div>
                            </div>
                          );
                        })
                      )}
                  </div>
                </div>
              </div>
            </>
          )}

          {sheetMode === "edit" && selectedMember && (
            <>
              <SheetHeader>
                <SheetTitle>Editar Membro</SheetTitle>
              </SheetHeader>
              <div className={styles.sheetBody}>
                <EditTeamMemberForm 
                  member={selectedMember} 
                  onSuccess={() => setSheetMode("detail")} 
                  onCancel={() => setSheetMode("detail")} 
                />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <CreateTeamModal 
        open={isCreateTeamOpen} 
        onOpenChange={setIsCreateTeamOpen} 
        sectors={sectorsData || []} 
      />
    </div>
  );
}