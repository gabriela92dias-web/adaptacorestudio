import React, { useMemo } from "react";
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  AlertTriangle,
  Clock3,
  AlertCircle,
  CreditCard,
  Users,
  MessageSquare,
  CheckSquare,
  Plus,
  Trash,
  Edit2,
  Activity,
  RefreshCw,
  CheckCircle2
} from "lucide-react";
import { useProjects, useTasks, useBudgetItems, useTeamMembers, useAllActivities } from "../helpers/useCoreActApi";
import { Skeleton } from "../components/Skeleton";
import { Progress } from "../components/Progress";
import { Badge } from "../components/Badge";
import { Avatar, AvatarFallback } from "../components/Avatar";
import { Link } from "react-router-dom";
import { CoreActCreateProjectDialog } from "../components/CoreActCreateProjectDialog";
import { CoreActProjectReportsMenu } from "../components/CoreActProjectReportsMenu";
import { useMyRole } from "../helpers/useSectorMembers";
import { useAuth } from "../helpers/useAuth";
import { useAdaptiveLevel } from "../helpers/useAdaptiveLevel";
import { CoreactExecutiveHome } from "../components/CoreactExecutiveHome";
import styles from "./coreact.module.css";

function CoreActMacroDashboard({ userName }: { userName: string }) {
  const { data: projectsData, isLoading: isLoadingProjects } = useProjects();
  const { data: tasksData, isLoading: isLoadingTasks } = useTasks();
  const { data: budgetData, isLoading: isLoadingBudget } = useBudgetItems();
  const { data: teamData, isLoading: isLoadingTeam } = useTeamMembers();
  const { data: activitiesData, isLoading: isLoadingActivities } = useAllActivities();

  const isLoading = isLoadingProjects || isLoadingTasks || isLoadingBudget || isLoadingTeam || isLoadingActivities;

  const stats = useMemo(() => {
    if (!projectsData || !tasksData || !budgetData || !teamData) return null;

    const activeProjectsCount = projectsData.projects.filter(p => p.status !== 'completed' && p.status !== 'cancelled').length;
    const completedProjectsCount = projectsData.projects.filter(p => p.status === 'completed').length;
    
    const allTasks = tasksData.tasks;
    const avgProgress = allTasks.length > 0 
      ? allTasks.reduce((acc, t) => acc + (t.progress || 0), 0) / allTasks.length 
      : 0;

    const budgetTotalPredicted = budgetData.budgetItems.reduce((acc, b) => acc + Number(b.predictedAmount || 0), 0);
    const budgetTotalPaid = budgetData.budgetItems.reduce((acc, b) => acc + Number(b.paidAmount || 0), 0);
    const budgetUtilized = budgetTotalPredicted > 0 ? (budgetTotalPaid / budgetTotalPredicted) * 100 : 0;

    const criticalTasks = allTasks.filter(t => t.status === 'overdue' || t.status === 'blocked').length;

    const taskStatusCounts = {
      abertas: allTasks.filter(t => t.status === 'open').length,
      andamento: allTasks.filter(t => t.status === 'in_progress').length,
      concluidas: allTasks.filter(t => t.status === 'completed').length,
      atrasadas: allTasks.filter(t => t.status === 'overdue').length,
      standby: allTasks.filter(t => t.status === 'standby').length,
    };

    // Generate some contextual alerts based on data
    const alerts = [];
    const overdueTasksList = allTasks.filter(t => t.status === 'overdue');
    if (overdueTasksList.length > 0) {
      alerts.push({
        id: 'overdue',
        title: 'Tarefa atrasada',
        desc: `${overdueTasksList[0].name} deveria ter sido concluída.`,
        icon: Clock3,
        type: 'warning'
      });
    }

    projectsData.projects.forEach(p => {
      const pBudgetItems = budgetData.budgetItems.filter(b => b.projectId === p.id);
      const predicted = pBudgetItems.reduce((acc, b) => acc + Number(b.predictedAmount || 0), 0);
      const paid = pBudgetItems.reduce((acc, b) => acc + Number(b.paidAmount || 0), 0);
      if (predicted > 0 && (paid / predicted) >= 0.9) {
        alerts.push({
          id: `budget-${p.id}`,
          title: 'Orçamento estourado',
          desc: `${p.name} consumiu ${Math.round((paid / predicted) * 100)}% do orçamento.`,
          icon: DollarSign,
          type: 'error'
        });
      }
    });

    const pendingPayments = budgetData.budgetItems.filter(b => b.status === 'pending' && b.dueDate);
    if (pendingPayments.length > 0) {
      const p = pendingPayments[0];
      const days = Math.ceil((new Date(p.dueDate!).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
      if (days >= 0 && days <= 30) {
        alerts.push({
          id: 'payment',
          title: 'Pagamento pendente',
          desc: `${p.category} vence em ${days} dias.`,
          icon: CreditCard,
          type: 'warning'
        });
      }
    }

    const blockedTasksList = allTasks.filter(t => t.status === 'blocked');
    if (blockedTasksList.length > 0) {
      alerts.push({
        id: 'blocked',
        title: 'Tarefa bloqueada',
        desc: `${blockedTasksList[0].name} aguardando aprovação.`,
        icon: AlertCircle,
        type: 'error'
      });
    }

    if (teamData && teamData.teamMembers) {
      const overloaded = teamData.teamMembers.filter(tm => tm.totalAllocatedHours > Number(tm.capacityHours || 40));
      if (overloaded.length > 0) {
        const excess = overloaded[0].totalAllocatedHours - Number(overloaded[0].capacityHours || 40);
        alerts.push({
          id: 'overload',
          title: 'Sobrecarga detectada',
          desc: `${overloaded[0].name} com ${excess}h extras.`,
          icon: Users,
          type: 'error'
        });
      }
    }

    return {
      activeProjectsCount,
      completedProjectsCount,
      avgProgress: Math.round(avgProgress),
      budgetUtilized: Math.round(budgetUtilized),
      criticalTasks,
      taskStatusCounts,
      alerts
    };
  }, [projectsData, tasksData, budgetData, teamData]);

  const { ref, level, className: adaptiveClass } = useAdaptiveLevel({
    itemCount: (projectsData?.projects?.length || 0) + (stats?.alerts?.length || 0)
  });

  const hour = new Date().getHours();
  let greeting = "Bom dia";
  if (hour >= 12 && hour < 18) greeting = "Boa tarde";
  else if (hour >= 18) greeting = "Boa noite";

  const summarySentence = useMemo(() => {
    if (!stats) return "";
    const parts = [];
    if (stats.activeProjectsCount > 0) parts.push(`${stats.activeProjectsCount} projetos ativos`);
    if (stats.taskStatusCounts.atrasadas > 0) parts.push(`${stats.taskStatusCounts.atrasadas} tarefas atrasadas`);
    const overBudgetCount = stats.alerts.filter(a => a.id.startsWith('budget-')).length;
    if (overBudgetCount > 0) parts.push(`${overBudgetCount} orçamento${overBudgetCount > 1 ? 's' : ''} no limite`);

    if (parts.length === 0) return "Tudo sob controle — seus projetos estão progredindo bem.";
    
    if (parts.length === 1) return `Você tem ${parts[0]}.`;
    if (parts.length === 2) return `Você tem ${parts[0]} e ${parts[1]}.`;
    
    const last = parts.pop();
    return `Você tem ${parts.join(', ')} e ${last}.`;
  }, [stats]);

  if (isLoading || !stats || !projectsData) {
    return (
      <div ref={ref} className={`${styles.container} ${adaptiveClass} ${styles[`level${level}`]}`}>
        <div className={styles.header}>
          <Skeleton style={{ width: 300, height: 40 }} />
          <Skeleton style={{ width: 120, height: 40 }} />
        </div>
        <div className={styles.kpiGrid}>
          {[1,2,3,4].map(i => <Skeleton key={i} style={{ height: 60 }} />)}
        </div>
        <div className={styles.mainGrid}>
          <div className={styles.gridColumn}>
            <Skeleton style={{ height: "100%" }} />
          </div>
          <div className={styles.gridColumn}>
            <Skeleton style={{ height: "50%" }} />
            <Skeleton style={{ height: "50%" }} />
          </div>
        </div>
      </div>
    );
  }

  const topTeamMembers = teamData?.teamMembers?.slice(0, 5) || [];

  return (
    <div ref={ref} className={`${styles.container} ${adaptiveClass} ${styles[`level${level}`]}`}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
            <h1 className={styles.title}>{greeting}, {userName.split(' ')[0]}</h1>
          <p className={styles.subtitle}>{summarySentence}</p>
        </div>
        <CoreActCreateProjectDialog />
      </header>

      <section className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeaderRow}>
            <span className={styles.kpiLabel}>Projetos</span>
            <span className={styles.kpiValue}>{stats.activeProjectsCount}</span>
          </div>
          <p className={styles.kpiMicroText}>{stats.completedProjectsCount} concluídos</p>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeaderRow}>
            <span className={styles.kpiLabel}>Progresso</span>
            <span className={styles.kpiValue}>{stats.avgProgress}%</span>
          </div>
          <p className={styles.kpiMicroText}>
            {stats.avgProgress < 30 ? "Fase inicial" : stats.avgProgress < 70 ? "Bom ritmo" : "Quase lá"}
          </p>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeaderRow}>
            <span className={styles.kpiLabel}>Orçamento</span>
            <span className={`${styles.kpiValue} ${stats.budgetUtilized > 90 ? styles.textDanger : ''}`}>
              {stats.budgetUtilized}%
            </span>
          </div>
          <p className={styles.kpiMicroText} style={{ color: stats.budgetUtilized > 90 ? 'var(--error)' : 'inherit' }}>
            {stats.budgetUtilized > 90 ? "Próximo ao limite" : "Dentro do previsto"}
          </p>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeaderRow}>
            <span className={styles.kpiLabel}>Alertas</span>
            <span className={styles.kpiValue}>
              {stats.alerts.length === 0 ? <CheckCircle2 size={20} className={styles.successIcon} /> : stats.alerts.length}
            </span>
          </div>
          <p className={styles.kpiMicroText}>
            {stats.alerts.length === 0 ? "Tudo limpo" : "Requer atenção"}
          </p>
        </div>
      </section>

      {stats.alerts.length > 0 && (
        <div className={styles.alertsBanner}>
          <AlertTriangle size={16} className={styles.alertBannerIcon} />
          <span className={styles.alertBannerText}>
            <strong>{stats.alerts.length} alertas:</strong> {stats.alerts.map(a => a.title).join(", ")}
          </span>
        </div>
      )}

      <div className={styles.mainGrid}>
        <div className={styles.gridColumn}>
          <section className={styles.card}>
            <div className={styles.cardHeaderRow}>
              <h2 className={styles.cardTitle}>Pulso da Equipe</h2>
              <Link to="/coreact/time" className={styles.linkText}>Ver equipe completa &rarr;</Link>
            </div>
            
            <div className={styles.teamList}>
              {topTeamMembers.length === 0 ? (
                <div className={styles.emptyState}>Nenhum membro na equipe ainda.</div>
              ) : (
                topTeamMembers.map(member => {
                  const capacity = Number(member.capacityHours || 40);
                  const allocated = member.totalAllocatedHours || 0;
                  const workloadPercent = capacity > 0 ? Math.min(100, (allocated / capacity) * 100) : 0;
                  
                  return (
                    <div key={member.id} className={styles.teamMemberRow}>
                      <Avatar className={styles.teamAvatar}>
                        <AvatarFallback>{member.initials || '?'}</AvatarFallback>
                      </Avatar>
                      <div className={styles.teamMemberInfo}>
                        <span className={styles.teamMemberName}>{member.name}</span>
                        <span className={styles.teamMemberTasks}>{member.taskCount} tarefas ativas</span>
                      </div>
                      <div className={styles.teamMemberWorkload}>
                        <div className={styles.workloadHeader}>
                          <span className={styles.workloadLabel}>Carga</span>
                          <span className={styles.workloadValue}>{allocated}h / {capacity}h</span>
                        </div>
                        <Progress value={workloadPercent} className={workloadPercent >= 100 ? styles.progressDanger : ''} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>

        <div className={styles.gridColumn}>
          <section className={styles.card}>
            <div className={styles.cardHeaderRow}>
              <h2 className={styles.cardTitle}>Projetos Ativos</h2>
              <Link to="/coreact/cronograma" className={styles.linkText}>Ver todos &rarr;</Link>
            </div>
            
            <div className={styles.projectsList}>
              {projectsData.projects.filter(p => p.status !== 'completed').slice(0, 4).map(project => {
                const projectProgress = project.tasks.length > 0 
                  ? project.tasks.reduce((acc, t) => acc + (t.progress || 0), 0) / project.tasks.length 
                  : 0;

                return (
                  <div key={project.id} className={styles.projectRow}>
                    <div className={styles.projectInfo}>
                      <div className={styles.projectNameRow}>
                        <h3 className={styles.projectName}>{project.name}</h3>
                        {project.initiativeName && (
                          <Badge variant="outline" className={styles.initiativeTag}>{project.initiativeName}</Badge>
                        )}
                      </div>
                      <span className={styles.projectTasksMeta}>{project.tasks.length} tarefas</span>
                    </div>
                    <div className={styles.projectProgressWrapper}>
                      <Progress value={projectProgress} className={styles.progressBar} />
                    </div>
                    <div className={styles.projectActions}>
                      <CoreActProjectReportsMenu projectId={project.id} projectName={project.name} />
                    </div>
                  </div>
                );
              })}
              {projectsData.projects.filter(p => p.status !== 'completed').length === 0 && (
                <div className={styles.emptyState}>Nenhum projeto ativo no momento.</div>
              )}
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.cardHeaderRow}>
              <h2 className={styles.cardTitle}>Atividade Recente</h2>
            </div>
            
            <div className={styles.activitiesList}>
              {!activitiesData?.activityLogs || activitiesData.activityLogs.length === 0 ? (
                <div className={styles.emptyState}>Nenhuma atividade registrada ainda.</div>
              ) : (
                activitiesData.activityLogs.slice(0, 5).map(log => {
                  const entityMap: Record<string, string> = {
                    tasks: 'Tarefa',
                    projects: 'Projeto',
                    budget_items: 'Item de orçamento',
                    team_members: 'Membro da equipe'
                  };
                  const entityName = log.entityType ? (entityMap[log.entityType] || log.entityType) : 'Item';
                  
                  let text = `${entityName} atualizado(a)`;
                  let Icon = Activity;
                  
                  switch(log.action) {
                    case 'created': text = `Novo(a) ${entityName.toLowerCase()}`; Icon = Plus; break;
                    case 'completed': text = `${entityName} concluído(a)`; Icon = CheckSquare; break;
                    case 'deleted': text = `${entityName} removido(a)`; Icon = Trash; break;
                    case 'commented': text = `Comentário em ${entityName.toLowerCase()}`; Icon = MessageSquare; break;
                    case 'assigned': text = `Atribuição em ${entityName.toLowerCase()}`; Icon = Users; break;
                    case 'status_changed': text = `Status alterado`; Icon = RefreshCw; break;
                    case 'updated': text = `${entityName} atualizado(a)`; Icon = Edit2; break;
                  }

                  const rtf = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' });
                  const date = new Date(log.performedAt || new Date());
                  const daysDiff = Math.round((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  const hoursDiff = Math.round((date.getTime() - new Date().getTime()) / (1000 * 60 * 60));
                  const minsDiff = Math.round((date.getTime() - new Date().getTime()) / (1000 * 60));
                  
                  let timeStr = rtf.format(minsDiff, 'minute');
                  if (Math.abs(daysDiff) > 0) timeStr = rtf.format(daysDiff, 'day');
                  else if (Math.abs(hoursDiff) > 0) timeStr = rtf.format(hoursDiff, 'hour');

                  return (
                    <div key={log.id} className={styles.activityItem}>
                      <div className={styles.activityIconWrapper}>
                        <Icon size={14} />
                      </div>
                      <div className={styles.activityContent}>
                        <span className={styles.activityText}>
                          <strong>{log.performerName || 'Sistema'}</strong> {text.toLowerCase()}
                        </span>
                        <span className={styles.activityTime}>{timeStr}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function CoreActOverview() {
  const { authState } = useAuth();
  const { data: roleData, isLoading: isLoadingRole } = useMyRole();

  if (isLoadingRole || authState.type === 'loading') {
    return (
      <div className={styles.container}>
        <Skeleton style={{ height: 100 }} />
        <Skeleton style={{ height: 300 }} />
      </div>
    );
  }

  if (authState.type !== 'authenticated') {
    return null; 
  }

  if (!roleData?.teamMemberId) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <h3>Boas-vindas</h3>
          <p>Seu perfil ainda não foi vinculado a um membro da equipe. Solicite ao administrador para configurar seu acesso.</p>
        </div>
      </div>
    );
  }

  const isManager = roleData.sectorRoles.some(r => r.role === 'responsavel');

  if (isManager) {
    return <CoreactExecutiveHome userName={authState.user.displayName} />;
  }

  return (
    <CoreActAgentDashboard 
      teamMemberId={roleData.teamMemberId} 
      userName={authState.user.displayName} 
    />
  );
}