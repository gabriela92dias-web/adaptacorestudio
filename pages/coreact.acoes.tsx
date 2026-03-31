import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { usePermissions } from "../helpers/usePermissions";
import { PermissionWall } from "../components/PermissionWall";
import { useTasks, useUpdateTaskAction } from "../helpers/useCoreActApi";
import { useCreateTaskAction } from "../helpers/useCoreactTaskQueries";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/Dialog";
import { Input } from "../components/Input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/Select";
import { Button } from "../components/Button";
import { toast } from "sonner";
import styles from "./coreact.acoes.module.css";
import { Activity, Plus, Check } from "lucide-react";

export default function CoreactAcoes() {
  const { hasPermission } = usePermissions();
  const { data: tasksData, isLoading } = useTasks({ includeActions: true });
  const updateAction = useUpdateTaskAction();
  const createAction = useCreateTaskAction();

  const [localClicksToday, setLocalClicksToday] = useState(0); 

  // Modal states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newActionTitle, setNewActionTitle] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState("");

  if (!hasPermission("coreactAcoes")) {
    return <PermissionWall moduleName="Ações" />;
  }

  const allTasks = tasksData?.tasks || [];
  const tasksWithActions = allTasks.filter(t => t.actions && t.actions.length > 0);

  const toggleItem = (actionId: string, currentStatus: string) => {
    const isCompleted = currentStatus === 'completed';
    const newStatus = isCompleted ? 'pending' : 'completed';
    
    // Optimistic UI interaction Tracker
    if (!isCompleted) setLocalClicksToday(prev => Math.min(prev + 1, 10));
    else setLocalClicksToday(prev => Math.max(prev - 1, 0));

    updateAction.mutate({
      id: actionId,
      status: newStatus,
      completedAt: newStatus === 'completed' ? new Date() : null
    });
  };

  const handleCreateChecklist = () => {
    if (!newActionTitle.trim() || !selectedTaskId) {
      toast.error("Preencha o título e selecione uma tarefa correspondente.");
      return;
    }
    createAction.mutate({
      taskId: selectedTaskId,
      title: newActionTitle.trim(),
    }, {
      onSuccess: () => {
        toast.success("Checklist criado com sucesso!");
        setIsDialogOpen(false);
        setNewActionTitle("");
        setSelectedTaskId("");
      },
      onError: (err) => toast.error("Erro: " + err.message)
    });
  };

  // Matrix generation logic (7 days, 10 dots max height per day)
  const MAX_DOTS = 10;
  const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];
  const weeklyData = [4, 6, 2, 8, 5, 0, localClicksToday]; 

  return (
    <div className={styles.container}>
      <Helmet><title>CoreStudio | Ações</title></Helmet>
      <header className={styles.header}>
        <h1 className={styles.title}>Ações & Lembretes</h1>
        <button 
          onClick={() => setIsDialogOpen(true)}
          style={{
           display: "flex", alignItems: "center", gap: "0.5rem",
           padding: "0.75rem 1.5rem", background: "var(--text-primary)", 
           color: "var(--bg-primary)", borderRadius: "999px",
           border: "none", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer"
          }}>
          <Plus size={16} /> Novo Checklist
        </button>
      </header>

      <div className={styles.layout}>
        {/* Left Column: Checklist Cards */}
        <div className={styles.cardsList}>
          {isLoading && <p>Carregando checklists...</p>}
          {!isLoading && tasksWithActions.length === 0 && (
            <p className={styles.emptyState}>Nenhuma ação pendente encontrada.</p>
          )}
          {tasksWithActions.map(task => {
            const actions = task.actions || [];
            const totalItems = actions.length;
            const completedItems = actions.filter(a => a.status === 'completed').length;
            const isFullyCompleted = totalItems > 0 && completedItems === totalItems;

            return (
              <div key={task.id} className={`${styles.actionCard} ${isFullyCompleted ? styles.collapsed : ''}`}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{task.name}</h3>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)'}}>
                    {completedItems}/{totalItems}
                  </span>
                </div>

                <div className={styles.checklist}>
                  {actions.map(action => {
                    const isCompleted = action.status === 'completed';
                    
                    return (
                      <div 
                        key={action.id} 
                        className={styles.checklistItem}
                        onClick={() => toggleItem(action.id, action.status)}
                      >
                        <div className={`${styles.checkbox} ${isCompleted ? styles.checked : ''}`}>
                          {isCompleted && <Check size={14} />}
                        </div>
                        <span className={`${styles.itemLabel} ${isCompleted ? styles.checked : ''}`}>
                          {action.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Tracker Widget */}
        <aside className={styles.trackerWidget}>
          <div className={styles.trackerHeader}>
            <div className={styles.trackerTitle}>
              <Activity size={20} /> Tracker
            </div>
            <div className={styles.trackerStats}>
              Esta semana
            </div>
          </div>

          <div className={styles.matrixGrid}>
            {weeklyData.map((actionsCount, dayIndex) => {
              // Generate array of 10 dots for each column (bottom-up is handled by flex-direction-reverse in CSS)
              const dots = Array.from({ length: MAX_DOTS }).map((_, dotIndex) => {
                const isActive = dotIndex < actionsCount;
                return (
                  <div key={dotIndex} className={`${styles.dot} ${isActive ? styles.active : ''}`} />
                );
              });

              return (
                <div key={dayIndex} className={styles.matrixCol}>
                  {dots}
                </div>
              );
            })}
          </div>
          
          <div className={styles.matrixLabels}>
            {days.map(day => <div key={day}>{day}</div>)}
          </div>
        </aside>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Checklist</DialogTitle>
          </DialogHeader>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
            <Input 
              placeholder="Ex: Revisar documentação" 
              value={newActionTitle}
              onChange={(e) => setNewActionTitle(e.target.value)}
              autoFocus
            />
            <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a tarefa vinculada" />
              </SelectTrigger>
              <SelectContent>
                {allTasks.map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter style={{ marginTop: "1.5rem" }}>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreateChecklist} disabled={createAction.isPending}>
              {createAction.isPending ? "Criando..." : "Criar Checklist"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
