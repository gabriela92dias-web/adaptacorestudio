import React, { useState } from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import { Textarea } from "./Textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./Select";
import { useCreateModule } from "../helpers/useModulesApi";
import { PlusIcon, XIcon, ArrowLeftIcon, InfoIcon } from "lucide-react";
import { toast } from "sonner";
import styles from "./BatchImportModuleBuilder.module.css";
import { TaskPriority } from "../helpers/schema";

export function BatchImportModuleBuilder({ onSuccess, onCancel }: { onSuccess: () => void, onCancel: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [stages, setStages] = useState<{ name: string; tasks: { name: string; priority: TaskPriority }[] }[]>([
    { name: "", tasks: [{ name: "", priority: "medium" }] }
  ]);
  const createModule = useCreateModule();

  const handleAddStage = () => setStages([...stages, { name: "", tasks: [] }]);
  
  const handleRemoveStage = (sIdx: number) => setStages(stages.filter((_, i) => i !== sIdx));
  
  const handleStageChange = (sIdx: number, val: string) => {
    const newStages = [...stages];
    newStages[sIdx].name = val;
    setStages(newStages);
  };

  const handleAddTask = (sIdx: number) => {
    const newStages = [...stages];
    newStages[sIdx].tasks.push({ name: "", priority: "medium" });
    setStages(newStages);
  };
  
  const handleRemoveTask = (sIdx: number, tIdx: number) => {
    const newStages = [...stages];
    newStages[sIdx].tasks = newStages[sIdx].tasks.filter((_, i) => i !== tIdx);
    setStages(newStages);
  };
  
  const handleTaskChange = (sIdx: number, tIdx: number, field: string, val: any) => {
    const newStages = [...stages];
    newStages[sIdx].tasks[tIdx] = { ...newStages[sIdx].tasks[tIdx], [field]: val };
    setStages(newStages);
  };

  const handleSubmit = async () => {
    if (!name.trim()) return toast.error("Nome do módulo é obrigatório");
    
    try {
       await createModule.mutateAsync({
         name,
         description,
         stages: stages.filter(s => s.name.trim()).map(s => ({
           name: s.name,
           tasks: s.tasks.filter(t => t.name.trim())
         }))
       });
       toast.success("Módulo criado com sucesso!");
       onSuccess();
    } catch(e: any) {
       toast.error(e.message || "Erro ao criar módulo");
    }
  };

  return (
    <div className={styles.container}>
       <div className={styles.header}>
         <Button variant="ghost" onClick={onCancel}><ArrowLeftIcon size={16}/> Voltar</Button>
         <div className={styles.note}><InfoIcon size={16}/> Módulos contêm apenas etapas e tarefas. Sem responsáveis ou datas.</div>
       </div>
       <div className={styles.form}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Nome do Módulo</label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Evento Padrão" />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Descrição (Opcional)</label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Descreva o propósito deste módulo..." />
          </div>

          <div className={styles.stages}>
            <label className={styles.label}>Etapas e Tarefas</label>
            {stages.map((stage, sIdx) => (
              <div key={sIdx} className={styles.stage}>
                 <div className={styles.stageHeader}>
                   <Input placeholder="Nome da etapa" value={stage.name} onChange={e => handleStageChange(sIdx, e.target.value)} />
                   <Button variant="ghost" size="icon" onClick={() => handleRemoveStage(sIdx)}><XIcon size={16}/></Button>
                 </div>
                 <div className={styles.tasks}>
                    {stage.tasks.map((task, tIdx) => (
                      <div key={tIdx} className={styles.task}>
                         <div className={styles.taskInputWrapper}>
                           <Input placeholder="Nome da tarefa" value={task.name} onChange={e => handleTaskChange(sIdx, tIdx, 'name', e.target.value)} />
                         </div>
                         <Select value={task.priority} onValueChange={v => handleTaskChange(sIdx, tIdx, 'priority', v)}>
                           <SelectTrigger className={styles.prioritySelect}><SelectValue/></SelectTrigger>
                           <SelectContent>
                             <SelectItem value="critical">Crítica</SelectItem>
                             <SelectItem value="high">Alta</SelectItem>
                             <SelectItem value="medium">Média</SelectItem>
                             <SelectItem value="low">Baixa</SelectItem>
                           </SelectContent>
                         </Select>
                         <Button variant="ghost" size="icon" onClick={() => handleRemoveTask(sIdx, tIdx)}><XIcon size={16}/></Button>
                      </div>
                    ))}
                    <Button variant="secondary" size="sm" onClick={() => handleAddTask(sIdx)} className={styles.addTaskBtn}><PlusIcon size={16}/> Adicionar Tarefa</Button>
                 </div>
              </div>
            ))}
            <Button variant="outline" onClick={handleAddStage} className={styles.addStageBtn}><PlusIcon size={16}/> Adicionar Etapa</Button>
          </div>
       </div>
       <div className={styles.footer}>
          <Button onClick={handleSubmit} disabled={createModule.isPending}>
            {createModule.isPending ? "Criando..." : "Criar Módulo"}
          </Button>
       </div>
    </div>
  )
}