import React, { useState, useEffect } from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import { Textarea } from "./Textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./Select";
import { usePlanningBases, useCreatePlanningBase, useActivatePlanningBase } from "../helpers/usePlanningBasesApi";
import { PlusIcon, XIcon, ArrowLeftIcon } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "./Skeleton";
import styles from "./BatchImportPlanningBaseManager.module.css";
import { PlanningBaseType } from "../helpers/schema";

export function BatchImportPlanningBaseManager({ onSuccess, onCancel }: { onSuccess: () => void, onCancel: () => void }) {
  const { data, isLoading } = usePlanningBases();
  const createBase = useCreatePlanningBase();
  const activateBase = useActivatePlanningBase();

  const hasBases = data?.planningBases && data.planningBases.length > 0;
  const [view, setView] = useState<'list' | 'create'>('list');

  useEffect(() => {
    if (!isLoading && !hasBases) {
      setView('create');
    }
  }, [isLoading, hasBases]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<PlanningBaseType>("annual");
  const [items, setItems] = useState([{ name: "", description: "", projectIdea: "" }]);

  const [activatingId, setActivatingId] = useState<string | null>(null);
  const [prefix, setPrefix] = useState("");

  const handleAddItem = () => setItems([...items, { name: "", description: "", projectIdea: "" }]);
  const handleRemoveItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));
  const handleItemChange = (idx: number, field: string, val: string) => {
    const newItems = [...items];
    newItems[idx] = { ...newItems[idx], [field]: val };
    setItems(newItems);
  };

  const handleCreate = async () => {
     if (!name.trim()) return toast.error("Nome da base é obrigatório");
     try {
       await createBase.mutateAsync({
         name,
         description,
         type,
         items: items.filter(i => i.name.trim())
       });
       toast.success("Base criada com sucesso!");
       setView('list');
       setName(""); setDescription(""); setItems([{ name: "", description: "", projectIdea: "" }]);
     } catch(e: any) {
       toast.error(e.message || "Erro ao criar base");
     }
  };

  const handleActivate = async (id: string) => {
     try {
        const res = await activateBase.mutateAsync({ planningBaseId: id, namePrefix: prefix });
        toast.success(`${res.initiativesCreated} iniciativas criadas com sucesso!`);
        onSuccess();
     } catch(e: any) {
        toast.error(e.message || "Erro ao ativar base");
     }
  };

  if (isLoading) return <div className={styles.container}><Skeleton style={{ height: 200 }} /></div>;

  if (view === 'create') {
     return (
       <div className={styles.container}>
         <div className={styles.header}>
           <Button variant="ghost" onClick={() => hasBases ? setView('list') : onCancel()}>
             <ArrowLeftIcon size={16}/> Voltar
           </Button>
         </div>
         <div className={styles.form}>
           <div className={styles.fieldGroup}>
             <label className={styles.label}>Nome da Base</label>
             <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Planejamento 2024" />
           </div>
           <div className={styles.row}>
             <div className={styles.fieldGroup} style={{ flex: 1 }}>
               <label className={styles.label}>Tipo</label>
               <Select value={type} onValueChange={(v: PlanningBaseType) => setType(v)}>
                 <SelectTrigger><SelectValue/></SelectTrigger>
                 <SelectContent>
                   <SelectItem value="annual">Anual</SelectItem>
                   <SelectItem value="quarterly">Trimestral</SelectItem>
                   <SelectItem value="custom">Personalizado</SelectItem>
                 </SelectContent>
               </Select>
             </div>
           </div>
           <div className={styles.fieldGroup}>
             <label className={styles.label}>Descrição (Opcional)</label>
             <Textarea value={description} onChange={e => setDescription(e.target.value)} />
           </div>

           <div className={styles.items}>
             <label className={styles.label}>Itens da Base (Iniciativas)</label>
             {items.map((item, idx) => (
               <div key={idx} className={styles.itemCard}>
                 <div className={styles.itemHeader}>
                   <Input placeholder="Nome do item" value={item.name} onChange={e => handleItemChange(idx, 'name', e.target.value)} />
                   <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(idx)}><XIcon size={16}/></Button>
                 </div>
                 <Input placeholder="Ideia de projeto associada (opcional)" value={item.projectIdea} onChange={e => handleItemChange(idx, 'projectIdea', e.target.value)} />
                 <Textarea placeholder="Descrição (opcional)" value={item.description} onChange={e => handleItemChange(idx, 'description', e.target.value)} rows={2} />
               </div>
             ))}
             <Button variant="outline" onClick={handleAddItem} className={styles.addBtn}><PlusIcon size={16}/> Adicionar Item</Button>
           </div>
         </div>
         <div className={styles.footer}>
           <Button onClick={handleCreate} disabled={createBase.isPending}>
             {createBase.isPending ? "Criando..." : "Criar Base"}
           </Button>
         </div>
       </div>
     );
  }

  return (
    <div className={styles.container}>
       <div className={styles.header}>
         <Button variant="ghost" onClick={onCancel}><ArrowLeftIcon size={16}/> Voltar</Button>
         <Button variant="outline" onClick={() => setView('create')}><PlusIcon size={16}/> Criar nova base</Button>
       </div>
       <div className={styles.list}>
         {data?.planningBases.map(base => (
           <div key={base.id} className={styles.baseCard}>
             <div className={styles.baseInfo}>
               <h4>{base.name} <span className={styles.badge}>{base.type}</span></h4>
               {base.description && <p>{base.description}</p>}
               <div className={styles.meta}>{base.items.length} itens</div>
             </div>
             <div className={styles.baseActions}>
               {activatingId === base.id ? (
                 <div className={styles.activateForm}>
                   <Input placeholder="Prefixo (ex: 2024 - )" value={prefix} onChange={e => setPrefix(e.target.value)} className={styles.prefixInput} />
                   <Button onClick={() => handleActivate(base.id)} disabled={activateBase.isPending}>Confirmar</Button>
                   <Button variant="ghost" onClick={() => setActivatingId(null)}>Cancelar</Button>
                 </div>
               ) : (
                 <Button onClick={() => setActivatingId(base.id)}>Ativar</Button>
               )}
             </div>
           </div>
         ))}
       </div>
    </div>
  );
}