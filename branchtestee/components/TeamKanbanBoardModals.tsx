import React from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./Dialog";
import { Form, FormItem, FormLabel, FormControl, FormMessage, useForm } from "./Form";
import { Input } from "./Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./Select";
import { Button } from "./Button";
import { useCreateCoreactTeam, useUpdateCoreactTeam, useDeleteCoreactTeam } from "../helpers/useCoreActApi";
import styles from "./TeamKanbanBoard.module.css";

export const teamFormSchema = z.object({
  name: z.string().min(1, "O nome do time é obrigatório"),
  sectorId: z.string().nullable().optional(),
});

export function CreateTeamModal({
  open,
  onOpenChange,
  sectors,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sectors: { id: string; name: string }[];
}) {
  const createTeam = useCreateCoreactTeam();
  const form = useForm({
    schema: teamFormSchema,
    defaultValues: { name: "", sectorId: null },
  });

  const onSubmit = (values: z.infer<typeof teamFormSchema>) => {
    createTeam.mutate(
      {
        name: values.name,
        sectorId: values.sectorId === "__empty" ? null : values.sectorId,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          form.setValues({ name: "", sectorId: null });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Novo Time</DialogTitle>
          <DialogDescription>
            Adicione um novo time e opcionalmente vincule-o a um setor.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={styles.formLayout}>
            <FormItem name="name">
              <FormLabel>Nome do Time</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: Squad Alpha"
                  value={form.values.name}
                  onChange={(e) => form.setValues((prev) => ({ ...prev, name: e.target.value }))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem name="sectorId">
              <FormLabel>Setor (Opcional)</FormLabel>
              <FormControl>
                <Select
                  value={form.values.sectorId || "__empty"}
                  onValueChange={(val) => form.setValues((prev) => ({ ...prev, sectorId: val }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um setor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__empty">Nenhum setor</SelectItem>
                    {sectors.map((sector) => (
                      <SelectItem key={sector.id} value={sector.id}>
                        {sector.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createTeam.isPending}>
                {createTeam.isPending ? "Criando..." : "Criar Time"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function EditTeamModal({
  team,
  open,
  onOpenChange,
  sectors,
}: {
  team: { id: string; name: string; sectorId?: string | null } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sectors: { id: string; name: string }[];
}) {
  const updateTeam = useUpdateCoreactTeam();
  
  const form = useForm({
    schema: teamFormSchema,
    defaultValues: { 
      name: team?.name || "", 
      sectorId: team?.sectorId || null 
    },
  });

  React.useEffect(() => {
    if (team && open) {
      form.setValues({
        name: team.name,
        sectorId: team.sectorId || null,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [team, open]);

  if (!team) return null;

  const onSubmit = (values: z.infer<typeof teamFormSchema>) => {
    updateTeam.mutate(
      {
        id: team.id,
        name: values.name,
        sectorId: values.sectorId === "__empty" ? null : values.sectorId,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Time</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={styles.formLayout}>
            <FormItem name="name">
              <FormLabel>Nome do Time</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: Squad Alpha"
                  value={form.values.name}
                  onChange={(e) => form.setValues((prev) => ({ ...prev, name: e.target.value }))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem name="sectorId">
              <FormLabel>Setor</FormLabel>
              <FormControl>
                <Select
                  value={form.values.sectorId || "__empty"}
                  onValueChange={(val) => form.setValues((prev) => ({ ...prev, sectorId: val }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um setor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__empty">Nenhum setor</SelectItem>
                    {sectors.map((sector) => (
                      <SelectItem key={sector.id} value={sector.id}>
                        {sector.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={updateTeam.isPending}>
                {updateTeam.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteTeamModal({
  team,
  open,
  onOpenChange,
}: {
  team: { id: string; name: string } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const deleteTeam = useDeleteCoreactTeam();

  if (!team) return null;

  const handleConfirm = () => {
    deleteTeam.mutate(
      { id: team.id },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir Time</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir o time <strong>{team.name}</strong>?
            Os membros deste time não serão excluídos do sistema, apenas perderão a vinculação com este time.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={deleteTeam.isPending}>
            {deleteTeam.isPending ? "Excluindo..." : "Excluir Time"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}