import React, { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useUpdateSector, useDeleteSector } from "../helpers/useCoreActApi";
import { useSectorMembers } from "../helpers/useSectorMembers";
import { Button } from "./Button";
import { Input } from "./Input";
import { Textarea } from "./Textarea";
import { Badge } from "./Badge";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  useForm,
} from "./Form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./Dialog";
import styles from "./CoreactSectorGeneral.module.css";

const sectorSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional().nullable(),
});

type SectorFormData = z.infer<typeof sectorSchema>;

export const CoreactSectorGeneral = ({
  sector,
  onDeleted,
}: {
  sector: any;
  onDeleted: () => void;
}) => {
  const updateMutation = useUpdateSector();
  const deleteMutation = useDeleteSector();
  const { data: members } = useSectorMembers(sector.id);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfirmName, setDeleteConfirmName] = useState("");

  const form = useForm({
    schema: sectorSchema,
    defaultValues: {
      name: sector.name,
      description: sector.description || "",
    },
  });

  const onSubmit = async (data: SectorFormData) => {
    try {
      await updateMutation.mutateAsync({
        id: sector.id,
        ...data,
      });
      toast.success("Setor atualizado com sucesso!");
    } catch (err) {
      toast.error("Erro ao atualizar setor");
    }
  };

  const handleDelete = async () => {
    if (deleteConfirmName !== sector.name) return;
    try {
      await deleteMutation.mutateAsync({ id: sector.id });
      toast.success("Setor excluído!");
      setIsDeleteDialogOpen(false);
      onDeleted();
    } catch (err) {
      toast.error("Erro ao excluir setor");
    }
  };

  const responsaveisCount =
    members?.filter((m) => m.role === "responsavel").length || 0;
  const agentesCount = members?.filter((m) => m.role === "agente").length || 0;

  return (
    <div className={styles.container}>
      <div className={styles.summary}>
        <h3 className={styles.sectionTitle}>Resumo do Setor</h3>
        <div className={styles.badges}>
          <Badge variant="secondary">
            {responsaveisCount} Responsáve{responsaveisCount === 1 ? "l" : "is"}
          </Badge>
          <Badge variant="outline">
            {agentesCount} Agente{agentesCount === 1 ? "" : "s"}
          </Badge>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
          <FormItem name="name">
            <FormLabel>Nome do Setor</FormLabel>
            <FormControl>
              <Input
                placeholder="Ex: Marketing"
                value={form.values.name}
                onChange={(e) =>
                  form.setValues((p) => ({ ...p, name: e.target.value }))
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>

          <FormItem name="description">
            <FormLabel>Descrição</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Descreva as responsabilidades da área..."
                value={form.values.description || ""}
                onChange={(e) =>
                  form.setValues((p) => ({ ...p, description: e.target.value }))
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>

          <div className={styles.formActions}>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </Form>

      <div className={styles.dangerZone}>
        <div className={styles.dangerZoneHeader}>
          <h3 className={styles.dangerTitle}>Zona de Perigo</h3>
          <p className={styles.dangerDescription}>
            A exclusão do setor removerá permanentemente suas configurações e
            associações de membros.
          </p>
        </div>
        <Button
          variant="destructive"
          onClick={() => {
            setDeleteConfirmName("");
            setIsDeleteDialogOpen(true);
          }}
        >
          Excluir Setor
        </Button>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Setor</DialogTitle>
            <DialogDescription>
              Esta ação é irreversível. Para confirmar a exclusão, digite o nome
              do setor (<strong>{sector.name}</strong>) abaixo:
            </DialogDescription>
          </DialogHeader>
          <div className={styles.deleteConfirmInput}>
            <Input
              value={deleteConfirmName}
              onChange={(e) => setDeleteConfirmName(e.target.value)}
              placeholder={sector.name}
            />
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              disabled={
                deleteConfirmName !== sector.name || deleteMutation.isPending
              }
              onClick={handleDelete}
            >
              {deleteMutation.isPending ? "Excluindo..." : "Confirmar Exclusão"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};