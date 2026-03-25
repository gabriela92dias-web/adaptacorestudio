import React, { useState, useEffect } from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./Select";
import { Popover, PopoverTrigger, PopoverContent } from "./Popover";
import { Calendar } from "./Calendar";
import { Trash2, Save, Calendar as CalendarIcon, Unlink } from "lucide-react";
import { useUpdateProject, useDeleteProject, useUpdateInitiative } from "../helpers/useCoreActApi";
import { ProjectStatusArrayValues, ProjectCategoryArrayValues, TaskPriorityArrayValues } from "../helpers/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./Dialog";
import { toast } from "sonner";
import { formatDate } from "../helpers/coreactInitiativesUtils";

export function CoreActInlineProjectEditor({ project, onUnlink, teamMembers, sectors, initiativeSectorId }: { project: any, onUnlink?: () => void, teamMembers: any[], sectors?: any[], initiativeSectorId?: string }) {
  const [values, setValues] = useState({
    name: project.name || "",
    status: project.status || "_empty",
    category: project.category || "_empty",
    priority: project.priority || "_empty",
    ownerId: project.ownerId || "_empty",
    sectorId: initiativeSectorId || "_empty",
    startDate: project.startDate ? new Date(project.startDate) : null,
    endDate: project.endDate ? new Date(project.endDate) : null,
  });

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const updateMutation = useUpdateProject();
  const deleteMutation = useDeleteProject();
  const updateInitiativeMutation = useUpdateInitiative();

  useEffect(() => {
    setValues({
      name: project.name || "",
      status: project.status || "_empty",
      category: project.category || "_empty",
      priority: project.priority || "_empty",
      ownerId: project.ownerId || "_empty",
      sectorId: initiativeSectorId || "_empty",
      startDate: project.startDate ? new Date(project.startDate) : null,
      endDate: project.endDate ? new Date(project.endDate) : null,
    });
  }, [project]);

  const isDirty = 
    values.name !== project.name ||
    values.sectorId !== (initiativeSectorId || "_empty") ||
    values.status !== (project.status || "_empty") ||
    values.category !== (project.category || "_empty") ||
    values.priority !== (project.priority || "_empty") ||
    values.ownerId !== (project.ownerId || "_empty") ||
    (values.startDate?.getTime() || 0) !== (project.startDate ? new Date(project.startDate).getTime() : 0) ||
    (values.endDate?.getTime() || 0) !== (project.endDate ? new Date(project.endDate).getTime() : 0);

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({
        id: project.id,
        name: values.name,
        status: values.status === "_empty" ? undefined : values.status as any,
        category: values.category === "_empty" ? undefined : values.category as any,
        priority: values.priority === "_empty" ? null : values.priority as any,
        ownerId: values.ownerId === "_empty" ? null : values.ownerId,
        startDate: values.startDate || undefined,
      endDate: values.endDate,
    });
    
    if (values.sectorId !== (initiativeSectorId || "_empty") && project.initiativeId) {
      await updateInitiativeMutation.mutateAsync({
        id: project.initiativeId,
        sectorId: values.sectorId === "_empty" ? null : values.sectorId
      });
    }

    toast.success("Projeto atualizado com sucesso!");
    } catch (err) {
      toast.error("Erro ao atualizar projeto");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync({ id: project.id });
      toast.success("Projeto excluído!");
    } catch (err) {
      toast.error("Erro ao excluir projeto");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-3)" }}>
        <div>
          <label style={{ fontSize: "var(--font-size-xs)", color: "var(--muted-foreground)", fontWeight: 500 }}>Nome</label>
          <Input 
            value={values.name} 
            onChange={(e) => setValues(p => ({ ...p, name: e.target.value }))} 
          />
        </div>
        <div>
          <label style={{ fontSize: "var(--font-size-xs)", color: "var(--muted-foreground)", fontWeight: 500 }}>Status</label>
          <Select value={values.status} onValueChange={(v) => setValues(p => ({...p, status: v}))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="_empty">Sem status</SelectItem>
              {ProjectStatusArrayValues.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label style={{ fontSize: "var(--font-size-xs)", color: "var(--muted-foreground)", fontWeight: 500 }}>Categoria</label>
          <Select value={values.category} onValueChange={(v) => setValues(p => ({...p, category: v}))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="_empty">Sem categoria</SelectItem>
              {ProjectCategoryArrayValues.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label style={{ fontSize: "var(--font-size-xs)", color: "var(--muted-foreground)", fontWeight: 500 }}>Prioridade</label>
          <Select value={values.priority} onValueChange={(v) => setValues(p => ({...p, priority: v}))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="_empty">Sem prioridade</SelectItem>
              {TaskPriorityArrayValues.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label style={{ fontSize: "var(--font-size-xs)", color: "var(--muted-foreground)", fontWeight: 500 }}>Setor</label>
          <Select value={values.sectorId} onValueChange={(v) => setValues(p => ({...p, sectorId: v}))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="_empty">Sem setor</SelectItem>
              {sectors?.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label style={{ fontSize: "var(--font-size-xs)", color: "var(--muted-foreground)", fontWeight: 500 }}>Responsável</label>
          <Select value={values.ownerId} onValueChange={(v) => setValues(p => ({...p, ownerId: v}))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="_empty">Sem responsável</SelectItem>
              {teamMembers?.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div style={{ display: "flex", gap: "var(--spacing-2)" }}>
           <div style={{ flex: 1 }}>
             <label style={{ fontSize: "var(--font-size-xs)", color: "var(--muted-foreground)", fontWeight: 500 }}>Início</label>
             <Popover>
               <PopoverTrigger asChild>
                 <Button variant="outline" style={{ width: "100%", justifyContent: "flex-start", padding: "0 var(--spacing-2)" }}>
                   <CalendarIcon size={14} style={{ marginRight: 4 }} />
                   {values.startDate ? formatDate(values.startDate) : "Selecione"}
                 </Button>
               </PopoverTrigger>
               <PopoverContent removeBackgroundAndPadding>
                 <Calendar mode="single" selected={values.startDate || undefined} onSelect={d => setValues(p => ({...p, startDate: d || null}))} />
               </PopoverContent>
             </Popover>
           </div>
           <div style={{ flex: 1 }}>
             <label style={{ fontSize: "var(--font-size-xs)", color: "var(--muted-foreground)", fontWeight: 500 }}>Término</label>
             <Popover>
               <PopoverTrigger asChild>
                 <Button variant="outline" style={{ width: "100%", justifyContent: "flex-start", padding: "0 var(--spacing-2)" }}>
                   <CalendarIcon size={14} style={{ marginRight: 4 }} />
                   {values.endDate ? formatDate(values.endDate) : "Selecione"}
                 </Button>
               </PopoverTrigger>
               <PopoverContent removeBackgroundAndPadding>
                 <Calendar mode="single" selected={values.endDate || undefined} onSelect={d => setValues(p => ({...p, endDate: d || null}))} />
               </PopoverContent>
             </Popover>
           </div>
        </div>
      </div>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "var(--spacing-2)" }}>
        <div style={{ display: "flex", gap: "var(--spacing-2)" }}>
          {onUnlink && (
            <Button variant="outline" size="sm" onClick={onUnlink}>
              <Unlink size={14} /> Desvincular
            </Button>
          )}
          <Button variant="destructive" size="sm" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash2 size={14} /> Excluir
          </Button>
        </div>
        {isDirty && (
          <Button size="sm" onClick={handleSave} disabled={updateMutation.isPending}>
            <Save size={14} style={{ marginRight: 4 }} />
            {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
          </Button>
        )}
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Projeto</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o projeto "{project.name}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "Excluindo..." : "Sim, Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}