import React from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useTeamMembers, useSectors, useCreateInitiative } from "../helpers/useCoreActApi";
import { InitiativeStatusArrayValues } from "../helpers/schema";
import { Button } from "./Button";
import { Input } from "./Input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./Select";
import { Form, FormItem, FormLabel, FormControl, FormMessage, useForm } from "./Form";
import { initiativeSchema, InitiativeFormData, statusMap } from "../helpers/coreactInitiativesUtils";
import styles from "../pages/coreact.iniciativas.module.css";

export function CoreActInitiativeCreateForm({ 
  onSuccess, 
  onCancel 
}: { 
  onSuccess: () => void; 
  onCancel: () => void;
}) {
  const { data: teamData } = useTeamMembers();
  const { data: sectorsData } = useSectors();
  const createMutation = useCreateInitiative();

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
      onSuccess();
    } catch (err) {
      toast.error("Erro ao criar iniciativa: " + (err instanceof Error ? err.message : "Falha desconhecida"));
    }
  };

  return (
    <div className={styles.createFormSection}>
      <div className={styles.createFormHeader}>
        <h3 className={styles.createFormTitle}>Nova Iniciativa</h3>
        <Button variant="ghost" size="icon-sm" onClick={onCancel}>
          <X size={16} />
        </Button>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={styles.createFormBody}>
          <FormItem name="name">
            <FormLabel>Nome</FormLabel>
            <FormControl>
              <Input 
                placeholder="Nome da iniciativa" 
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

          <Button type="submit" disabled={createMutation.isPending} style={{ marginTop: "var(--spacing-2)" }}>
            {createMutation.isPending ? "Criando..." : "Criar Iniciativa"}
          </Button>
        </form>
      </Form>
    </div>
  );
}