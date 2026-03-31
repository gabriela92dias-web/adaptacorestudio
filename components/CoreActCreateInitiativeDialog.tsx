import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./Dialog";
import { Button } from "./Button";
import { Input } from "./Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./Select";
import { Form, FormItem, FormLabel, FormControl, FormMessage, useForm } from "./Form";
import { Plus } from "lucide-react";
import { useCreateInitiative, useTeamMembers, useSectors } from "../helpers/useCoreActApi";
import { initiativeSchema, InitiativeFormData, statusMap } from "../helpers/coreactInitiativesUtils";
import { InitiativeStatusArrayValues } from "../helpers/schema";
import { toast } from "sonner";

export function CoreActCreateInitiativeDialog({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
} = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const createMutation = useCreateInitiative();
  const { data: teamData } = useTeamMembers();
  const { data: sectorsData } = useSectors();

  const form = useForm({
    schema: initiativeSchema,
    defaultValues: {
      name: "",
      description: "",
      status: "solicitada",
      responsibleId: "_empty",
      sectorId: "_empty",
      solicitanteId: "_empty",
      type: "_empty",
      context: "_empty",
      startDate: null,
      endDate: null,
    },
  });

  const handleOpenChange = (isOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(isOpen);
    }
    if (controlledOnOpenChange) {
      controlledOnOpenChange(isOpen);
    }
    if (!isOpen) {
      form.setValues({
        name: "",
        description: "",
        status: "solicitada",
        responsibleId: "_empty",
        sectorId: "_empty",
        solicitanteId: "_empty",
        type: "_empty",
        context: "_empty",
        startDate: null,
        endDate: null,
      });
    }
  };

  const onSubmit = async (data: InitiativeFormData) => {
    try {
      await createMutation.mutateAsync({
        ...data,
        responsibleId: data.responsibleId === "_empty" ? null : data.responsibleId,
        sectorId: data.sectorId === "_empty" ? null : data.sectorId,
        solicitanteId: data.solicitanteId === "_empty" ? null : data.solicitanteId,
        type: data.type === "_empty" ? null : data.type,
        context: data.context === "_empty" ? null : data.context,
      });
      toast.success("Iniciativa criada com sucesso!");
      handleOpenChange(false);
    } catch (err) {
      toast.error("Erro ao criar iniciativa: " + (err instanceof Error ? err.message : "Falha desconhecida"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button>
            <Plus size={16} />
            Nova Iniciativa
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Iniciativa</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <FormItem name="name">
              <FormLabel>Nome da Iniciativa *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: Reconstrução do Core"
                  value={form.values.name}
                  onChange={(e) => form.setValues((prev) => ({ ...prev, name: e.target.value }))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
              <FormItem name="status">
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select
                    value={form.values.status}
                    onValueChange={(val: any) => form.setValues(p => ({ ...p, status: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      {InitiativeStatusArrayValues.map(s => (
                        <SelectItem key={s} value={s}>{statusMap[s].label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>

              <FormItem name="type">
                <FormLabel>Tipo</FormLabel>
                <FormControl>
                  <Select
                    value={form.values.type || "_empty"}
                    onValueChange={val => form.setValues(p => ({ ...p, type: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_empty">Sem tipo</SelectItem>
                      <SelectItem value="Operação">Operação</SelectItem>
                      <SelectItem value="Evento">Evento</SelectItem>
                      <SelectItem value="Campanha">Campanha</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
              <FormItem name="context">
                <FormLabel>Contexto</FormLabel>
                <FormControl>
                  <Select
                    value={form.values.context || "_empty"}
                    onValueChange={val => form.setValues(p => ({ ...p, context: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um contexto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_empty">Sem contexto</SelectItem>
                      <SelectItem value="Interno">Interno</SelectItem>
                      <SelectItem value="Externo">Externo</SelectItem>
                      <SelectItem value="Híbrido">Híbrido</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>

              <FormItem name="solicitanteId">
                <FormLabel>Quem solicitou</FormLabel>
                <FormControl>
                  <Select
                    value={form.values.solicitanteId || "_empty"}
                    onValueChange={val => form.setValues(p => ({ ...p, solicitanteId: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um solicitante" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_empty">Sem solicitante</SelectItem>
                      {teamData?.teamMembers.map(tm => (
                        <SelectItem key={tm.id} value={tm.id}>{tm.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
              <FormItem name="sectorId">
                <FormLabel>Setor</FormLabel>
                <FormControl>
                  <Select
                    value={form.values.sectorId || "_empty"}
                    onValueChange={val => form.setValues(p => ({ ...p, sectorId: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o setor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_empty">Nenhum Setor</SelectItem>
                      {sectorsData?.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>

              <FormItem name="responsibleId">
                <FormLabel>Responsável</FormLabel>
                <FormControl>
                  <Select
                    value={form.values.responsibleId || "_empty"}
                    onValueChange={val => form.setValues(p => ({ ...p, responsibleId: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o responsável" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_empty">Sem responsável</SelectItem>
                      {teamData?.teamMembers.map(tm => (
                        <SelectItem key={tm.id} value={tm.id}>{tm.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-4)' }}>
              <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>Cancelar</Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Criando..." : "Criar Iniciativa"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
