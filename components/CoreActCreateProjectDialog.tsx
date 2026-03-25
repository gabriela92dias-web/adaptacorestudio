import React, { useState } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./Dialog";
import { Button } from "./Button";
import { Input } from "./Input";
import { Textarea } from "./Textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./Select";
import { Form, FormItem, FormLabel, FormControl, FormMessage, useForm } from "./Form";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { Calendar } from "./Calendar";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { useCreateProject, useTeamMembers, useInitiatives } from "../helpers/useCoreActApi";

const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  category: z.enum(["custom", "event", "implementation", "infrastructure", "maintenance", "operational", "strategic", "travel"]).optional(),
  startDate: z.date({ required_error: "Data de início é obrigatória" }),
  endDate: z.date().optional(),
  budget: z.number().optional(),
  ownerId: z.string().optional(),
  initiativeId: z.string().optional(),
  priority: z.enum(["critical", "high", "low", "medium"]).optional(),
});

export function CoreActCreateProjectDialog({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  defaultInitiativeId,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultInitiativeId?: string;
} = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const createProject = useCreateProject();
  const { data: teamData } = useTeamMembers();
  const { data: initiativesData } = useInitiatives();

  const form = useForm({
    schema,
    defaultValues: {
      name: "",
      description: "",
      startDate: new Date(),
      initiativeId: defaultInitiativeId,
    },
  });

  const handleOpenChange = (isOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(isOpen);
    }
    if (controlledOnOpenChange) {
      controlledOnOpenChange(isOpen);
    }
  };

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      await createProject.mutateAsync(values as any);
      handleOpenChange(false);
      form.setValues({ name: "", description: "", startDate: new Date() });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button>
            <Plus size={16} />
            Novo Projeto
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Projeto</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <FormItem name="name">
              <FormLabel>Nome do Projeto *</FormLabel>
              <FormControl>
                <Input
                  value={form.values.name}
                  onChange={(e) => form.setValues((prev) => ({ ...prev, name: e.target.value }))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem name="description">
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  value={form.values.description || ""}
                  onChange={(e) => form.setValues((prev) => ({ ...prev, description: e.target.value }))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
              <FormItem name="category">
                <FormLabel>Categoria</FormLabel>
                <FormControl>
                  <Select
                    value={form.values.category || "__empty"}
                    onValueChange={(val) => form.setValues((prev) => ({ ...prev, category: val === "__empty" ? undefined : val as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__empty">Selecione...</SelectItem>
                      <SelectItem value="implementation">Implementação</SelectItem>
                      <SelectItem value="operational">Operacional</SelectItem>
                      <SelectItem value="event">Evento</SelectItem>
                      <SelectItem value="travel">Viagem</SelectItem>
                      <SelectItem value="infrastructure">Infraestrutura</SelectItem>
                      <SelectItem value="strategic">Estratégico</SelectItem>
                      <SelectItem value="maintenance">Manutenção</SelectItem>
                      <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>

              <FormItem name="priority">
                <FormLabel>Prioridade</FormLabel>
                <FormControl>
                  <Select
                    value={form.values.priority || "__empty"}
                    onValueChange={(val) => form.setValues((prev) => ({ ...prev, priority: val === "__empty" ? undefined : val as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__empty">Selecione...</SelectItem>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="critical">Crítica</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
              <FormItem name="startDate">
                <FormLabel>Data de Início *</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" style={{ width: "100%", justifyContent: "flex-start" }}>
                        <CalendarIcon size={16} />
                        {form.values.startDate ? form.values.startDate.toLocaleDateString('pt-BR') : "Selecione"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent removeBackgroundAndPadding>
                      <Calendar
                        mode="single"
                        selected={form.values.startDate}
                        onSelect={(date) => {
                          if (date) form.setValues(prev => ({ ...prev, startDate: date }));
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>

              <FormItem name="endDate">
                <FormLabel>Data de Término</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" style={{ width: "100%", justifyContent: "flex-start" }}>
                        <CalendarIcon size={16} />
                        {form.values.endDate ? form.values.endDate.toLocaleDateString('pt-BR') : "Selecione"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent removeBackgroundAndPadding>
                      <Calendar
                        mode="single"
                        selected={form.values.endDate}
                        onSelect={(date) => {
                          if (date) form.setValues(prev => ({ ...prev, endDate: date }));
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
              <FormItem name="budget">
                <FormLabel>Orçamento (R$)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.values.budget || ""}
                    onChange={(e) => form.setValues((prev) => ({ ...prev, budget: e.target.value ? parseFloat(e.target.value) : undefined }))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>

              <FormItem name="ownerId">
                <FormLabel>Responsável</FormLabel>
                <FormControl>
                  <Select
                    value={form.values.ownerId || "__empty"}
                    onValueChange={(val) => form.setValues((prev) => ({ ...prev, ownerId: val === "__empty" ? undefined : val }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__empty">Nenhum</SelectItem>
                      {teamData?.teamMembers?.map(m => (
                        <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
              <FormItem name="initiativeId">
                <FormLabel>Iniciativa</FormLabel>
                <FormControl>
                  <Select
                    value={form.values.initiativeId || "__empty"}
                    onValueChange={(val) => form.setValues((prev) => ({ ...prev, initiativeId: val === "__empty" ? undefined : val }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__empty">Nenhuma</SelectItem>
                      {initiativesData?.initiatives?.map(i => (
                        <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-4)' }}>
              <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>Cancelar</Button>
              <Button type="submit" disabled={createProject.isPending}>
                {createProject.isPending ? "Salvando..." : "Criar Projeto"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}