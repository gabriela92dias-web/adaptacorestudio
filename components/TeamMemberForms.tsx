import React from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Form, FormItem, FormLabel, FormControl, FormMessage, useForm } from "./Form";
import { Input } from "./Input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./Select";
import { Button } from "./Button";
import { useCreateTeamMember, useUpdateTeamMember } from "../helpers/useCoreActApi";
import { InputType as TeamCreateInput } from "../endpoints/coreact/team/create_POST.schema";
import { InputType as TeamUpdateInput } from "../endpoints/coreact/team/update_POST.schema";
import { EmploymentTypeArrayValues } from "../helpers/schema";
import styles from "./TeamMemberForms.module.css";

const teamMemberSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  fullName: z.string().optional(),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  nickname: z.string().optional(),
  phone: z.string().optional(),
  role: z.string().optional(),
  initials: z.string().max(3, "Máx 3 letras").optional(),
  capacityHours: z.coerce.number().min(0, "Capacidade deve ser maior ou igual a 0").default(40),
  employmentType: z.enum(EmploymentTypeArrayValues).default("clt"),
});

export function CreateTeamMemberForm({ onSuccess }: { onSuccess: () => void }) {
  const createMember = useCreateTeamMember();
  const form = useForm({
    schema: teamMemberSchema,
    defaultValues: {
      name: "",
      fullName: "",
      email: "",
      nickname: "",
      phone: "",
      role: "",
      initials: "",
      capacityHours: 40,
      employmentType: "clt",
    }
  });

  const onSubmit = (data: z.infer<typeof teamMemberSchema>) => {
    createMember.mutate(data as TeamCreateInput, {
      onSuccess: () => {
        toast.success("Membro adicionado com sucesso!");
        onSuccess();
      },
      onError: (err) => {
        toast.error(`Erro ao adicionar membro: ${err.message}`);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={styles.formContent}>
        <FormItem name="name">
          <FormLabel>Nome</FormLabel>
          <FormControl>
            <Input
              placeholder="Ex: Ana Silva"
              value={form.values.name}
              onChange={e => form.setValues(prev => ({ ...prev, name: e.target.value }))}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
        <FormItem name="fullName">
          <FormLabel>Nome Completo (Registro)</FormLabel>
          <FormControl>
            <Input
              placeholder="Ex: Ana Maria da Silva"
              value={form.values.fullName || ""}
              onChange={e => form.setValues(prev => ({ ...prev, fullName: e.target.value }))}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
        <FormItem name="email">
          <FormLabel>E-mail (Para vincular conta futura)</FormLabel>
          <FormControl>
            <Input
              type="email"
              placeholder="Ex: ana@empresa.com"
              value={form.values.email || ""}
              onChange={e => form.setValues(prev => ({ ...prev, email: e.target.value }))}
            />
          </FormControl>
          <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "4px" }}>
            Se preenchido, o membro receberá acesso automático às tarefas quando criar a conta com este e-mail.
          </p>
          <FormMessage />
        </FormItem>
        <div className={styles.formRow}>
          <FormItem name="nickname">
            <FormLabel>Apelido</FormLabel>
            <FormControl>
              <Input
                placeholder="Ex: Aninha"
                value={form.values.nickname || ""}
                onChange={e => form.setValues(prev => ({ ...prev, nickname: e.target.value }))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
          <FormItem name="phone">
            <FormLabel>Telefone</FormLabel>
            <FormControl>
              <Input
                placeholder="Ex: (11) 99999-9999"
                value={form.values.phone || ""}
                onChange={e => form.setValues(prev => ({ ...prev, phone: e.target.value }))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </div>
        <div className={styles.formRow}>
          <FormItem name="role">
            <FormLabel>Cargo</FormLabel>
            <FormControl>
              <Input
                placeholder="Ex: Designer"
                value={form.values.role || ""}
                onChange={e => form.setValues(prev => ({ ...prev, role: e.target.value }))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
          <FormItem name="initials">
            <FormLabel>Iniciais</FormLabel>
            <FormControl>
              <Input
                placeholder="Ex: AS"
                maxLength={3}
                value={form.values.initials || ""}
                onChange={e => form.setValues(prev => ({ ...prev, initials: e.target.value.toUpperCase() }))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </div>
        <div className={styles.formRow}>
          <FormItem name="employmentType">
            <FormLabel>Tipo de Contrato</FormLabel>
            <FormControl>
              <Select
                value={form.values.employmentType}
                onValueChange={(val) => form.setValues(prev => ({ ...prev, employmentType: val as typeof EmploymentTypeArrayValues[number] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="clt">CLT</SelectItem>
                    <SelectItem value="hourly_contractor">Prestador por Hora</SelectItem>
                    <SelectItem value="contract_service">Serviço Contratado</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
          <FormItem name="capacityHours">
            <FormLabel>Capacidade Semanal (h)</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="40"
                value={form.values.capacityHours}
                onChange={e => form.setValues(prev => ({ ...prev, capacityHours: e.target.value === "" ? 0 : Number(e.target.value) }))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </div>
        <div className={styles.formActions}>
          <Button type="submit" disabled={createMember.isPending}>
            {createMember.isPending ? "Adicionando..." : "Adicionar Membro"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

const editTeamMemberSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  fullName: z.string().optional().nullable(),
  nickname: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  role: z.string().optional().nullable(),
  initials: z.string().max(3, "Máx 3 letras").optional().nullable(),
  capacityHours: z.coerce.number().min(0, "Capacidade deve ser maior ou igual a 0").default(40),
  employmentType: z.enum(EmploymentTypeArrayValues).optional(),
});

export function EditTeamMemberForm({
  member,
  onSuccess,
  onCancel,
}: {
  member: any;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const updateMember = useUpdateTeamMember();
  const form = useForm({
    schema: editTeamMemberSchema,
    defaultValues: {
      id: member.id,
      name: member.name,
      fullName: member.fullName || "",
      nickname: member.nickname || "",
      phone: member.phone || "",
      role: member.role || "",
      initials: member.initials || "",
      capacityHours: Number(member.capacityHours || 40),
      employmentType: member.employmentType || "clt",
    }
  });

  const onSubmit = (data: z.infer<typeof editTeamMemberSchema>) => {
    updateMember.mutate(data as TeamUpdateInput, {
      onSuccess: () => {
        toast.success("Membro atualizado com sucesso!");
        onSuccess();
      },
      onError: (err) => {
        toast.error(`Erro ao atualizar membro: ${err.message}`);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={styles.formContent}>
        <FormItem name="name">
          <FormLabel>Nome</FormLabel>
          <FormControl>
            <Input
              placeholder="Ex: Ana Silva"
              value={form.values.name}
              onChange={e => form.setValues(prev => ({ ...prev, name: e.target.value }))}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
        <FormItem name="fullName">
          <FormLabel>Nome Completo (Registro)</FormLabel>
          <FormControl>
            <Input
              placeholder="Ex: Ana Maria da Silva"
              value={form.values.fullName || ""}
              onChange={e => form.setValues(prev => ({ ...prev, fullName: e.target.value }))}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
        <div className={styles.formRow}>
          <FormItem name="nickname">
            <FormLabel>Apelido</FormLabel>
            <FormControl>
              <Input
                placeholder="Ex: Aninha"
                value={form.values.nickname || ""}
                onChange={e => form.setValues(prev => ({ ...prev, nickname: e.target.value }))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
          <FormItem name="phone">
            <FormLabel>Telefone</FormLabel>
            <FormControl>
              <Input
                placeholder="Ex: (11) 99999-9999"
                value={form.values.phone || ""}
                onChange={e => form.setValues(prev => ({ ...prev, phone: e.target.value }))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </div>
        <div className={styles.formRow}>
          <FormItem name="role">
            <FormLabel>Cargo</FormLabel>
            <FormControl>
              <Input
                placeholder="Ex: Designer"
                value={form.values.role || ""}
                onChange={e => form.setValues(prev => ({ ...prev, role: e.target.value }))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
          <FormItem name="initials">
            <FormLabel>Iniciais</FormLabel>
            <FormControl>
              <Input
                placeholder="Ex: AS"
                maxLength={3}
                value={form.values.initials || ""}
                onChange={e => form.setValues(prev => ({ ...prev, initials: e.target.value.toUpperCase() }))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </div>
        <div className={styles.formRow}>
          <FormItem name="employmentType">
            <FormLabel>Tipo de Contrato</FormLabel>
            <FormControl>
              <Select
                value={form.values.employmentType}
                onValueChange={(val) => form.setValues(prev => ({ ...prev, employmentType: val as typeof EmploymentTypeArrayValues[number] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="clt">CLT</SelectItem>
                    <SelectItem value="hourly_contractor">Prestador por Hora</SelectItem>
                    <SelectItem value="contract_service">Serviço Contratado</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
          <FormItem name="capacityHours">
            <FormLabel>Capacidade Semanal (h)</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="40"
                value={form.values.capacityHours}
                onChange={e => form.setValues(prev => ({ ...prev, capacityHours: e.target.value === "" ? 0 : Number(e.target.value) }))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </div>
        <div className={styles.formActions}>
          <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button type="submit" disabled={updateMember.isPending}>
            {updateMember.isPending ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}