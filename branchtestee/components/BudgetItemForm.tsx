import React from "react";
import { z } from "zod";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  useForm,
} from "./Form";
import { Input } from "./Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./Select";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { Calendar } from "./Calendar";
import { Button } from "./Button";
import {
  useProjects,
  useCreateBudgetItem,
  useUpdateBudgetItem,
} from "../helpers/useCoreActApi";
import { InputType as BudgetCreateInput } from "../endpoints/coreact/budget/create_POST.schema";
import { InputType as BudgetUpdateInput } from "../endpoints/coreact/budget/update_POST.schema";
import styles from "./BudgetItemForm.module.css";

const createBudgetSchema = z.object({
  projectId: z.string().min(1, "Projeto obrigatório"),
  category: z.string().min(1, "Categoria obrigatória"),
  description: z.string().optional(),
  vendor: z.string().optional(),
  predictedAmount: z.coerce.number().optional(),
  contractedAmount: z.coerce.number().optional(),
  paidAmount: z.coerce.number().optional(),
  status: z.enum(["contracted", "paid", "pending"]).default("pending"),
  dueDate: z.date().optional(),
});

function CreateBudgetItemForm({ onSuccess }: { onSuccess: () => void }) {
  const { data: projectsData } = useProjects();
  const createBudget = useCreateBudgetItem();

  const form = useForm({
    schema: createBudgetSchema,
    defaultValues: {
      projectId: "",
      category: "",
      status: "pending",
    },
  });

  const onSubmit = (data: z.infer<typeof createBudgetSchema>) => {
    createBudget.mutate(data as BudgetCreateInput, {
      onSuccess: () => {
        toast.success("Item de orçamento criado!");
        onSuccess();
      },
      onError: (err) => {
        toast.error(`Erro: ${err instanceof Error ? err.message : "Desconhecido"}`);
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={styles.formContent}>
        <div className={styles.formRow}>
          <FormItem name="projectId">
            <FormLabel>Projeto</FormLabel>
            <Select
              value={form.values.projectId}
              onValueChange={(val) =>
                form.setValues((prev) => ({ ...prev, projectId: val }))
              }
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {projectsData?.projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
          <FormItem name="category">
            <FormLabel>Categoria</FormLabel>
            <FormControl>
              <Input
                placeholder="Ex: Infraestrutura"
                value={form.values.category}
                onChange={(e) =>
                  form.setValues((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </div>

        <div className={styles.formRow}>
          <FormItem name="status">
            <FormLabel>Status</FormLabel>
            <Select
              value={form.values.status}
              onValueChange={(val) =>
                form.setValues((prev) => ({ ...prev, status: val as any }))
              }
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="contracted">Contratado</SelectItem>
                <SelectItem value="paid">Pago</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
          <FormItem name="dueDate">
            <FormLabel>Data de Vencimento</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button variant="outline" className={styles.datePickerButton}>
                    {form.values.dueDate
                      ? form.values.dueDate.toLocaleDateString("pt-BR")
                      : "Selecione uma data"}
                    <CalendarIcon size={16} className={styles.datePickerIcon} />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent removeBackgroundAndPadding>
                <Calendar
                  mode="single"
                  selected={form.values.dueDate}
                  onSelect={(date) =>
                    form.setValues((prev) => ({
                      ...prev,
                      dueDate: date || undefined,
                    }))
                  }
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        </div>

        <div className={styles.formRow}>
          <FormItem name="description">
            <FormLabel>Descrição</FormLabel>
            <FormControl>
              <Input
                placeholder="Ex: Contratação de serviço"
                value={form.values.description || ""}
                onChange={(e) =>
                  form.setValues((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
          <FormItem name="vendor">
            <FormLabel>Fornecedor</FormLabel>
            <FormControl>
              <Input
                placeholder="Ex: Fornecedor X"
                value={form.values.vendor || ""}
                onChange={(e) =>
                  form.setValues((prev) => ({ ...prev, vendor: e.target.value }))
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </div>

        <div className={styles.formRow}>
          <FormItem name="predictedAmount">
            <FormLabel>Valor Previsto (R$)</FormLabel>
            <FormControl>
              <Input
                type="number"
                value={form.values.predictedAmount || ""}
                onChange={(e) =>
                  form.setValues((prev) => ({
                    ...prev,
                    predictedAmount: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  }))
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
          <FormItem name="contractedAmount">
            <FormLabel>Valor Contratado (R$)</FormLabel>
            <FormControl>
              <Input
                type="number"
                value={form.values.contractedAmount || ""}
                onChange={(e) =>
                  form.setValues((prev) => ({
                    ...prev,
                    contractedAmount: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  }))
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
          <FormItem name="paidAmount">
            <FormLabel>Valor Pago (R$)</FormLabel>
            <FormControl>
              <Input
                type="number"
                value={form.values.paidAmount || ""}
                onChange={(e) =>
                  form.setValues((prev) => ({
                    ...prev,
                    paidAmount: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  }))
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </div>

        <div className={styles.formActions}>
          <Button type="submit" disabled={createBudget.isPending}>
            {createBudget.isPending ? "Salvando..." : "Salvar Item"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

const editBudgetSchema = z.object({
  id: z.string(),
  category: z.string().min(1, "Categoria obrigatória"),
  description: z.string().optional(),
  vendor: z.string().optional(),
  predictedAmount: z.coerce.number().optional(),
  contractedAmount: z.coerce.number().optional(),
  paidAmount: z.coerce.number().optional(),
  status: z.enum(["contracted", "paid", "pending"]).default("pending"),
  dueDate: z.date().optional(),
});

function EditBudgetItemForm({
  item,
  onSuccess,
}: {
  item: any;
  onSuccess: () => void;
}) {
  const updateBudget = useUpdateBudgetItem();

  const form = useForm({
    schema: editBudgetSchema,
    defaultValues: {
      id: item.id,
      category: item.category,
      description: item.description || "",
      vendor: item.vendor || "",
      predictedAmount: item.predictedAmount
        ? Number(item.predictedAmount)
        : undefined,
      contractedAmount: item.contractedAmount
        ? Number(item.contractedAmount)
        : undefined,
      paidAmount: item.paidAmount ? Number(item.paidAmount) : undefined,
      status: item.status || "pending",
      dueDate: item.dueDate ? new Date(item.dueDate) : undefined,
    },
  });

  const onSubmit = (data: z.infer<typeof editBudgetSchema>) => {
    updateBudget.mutate(data as BudgetUpdateInput, {
      onSuccess: () => {
        toast.success("Item de orçamento atualizado!");
        onSuccess();
      },
      onError: (err) => {
        toast.error(`Erro: ${err instanceof Error ? err.message : "Desconhecido"}`);
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={styles.formContent}>
        <div className={styles.formRow}>
          <FormItem name="category">
            <FormLabel>Categoria</FormLabel>
            <FormControl>
              <Input
                placeholder="Ex: Infraestrutura"
                value={form.values.category}
                onChange={(e) =>
                  form.setValues((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
          <FormItem name="status">
            <FormLabel>Status</FormLabel>
            <Select
              value={form.values.status}
              onValueChange={(val) =>
                form.setValues((prev) => ({ ...prev, status: val as any }))
              }
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="contracted">Contratado</SelectItem>
                <SelectItem value="paid">Pago</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </div>

        <div className={styles.formRow}>
          <FormItem name="dueDate">
            <FormLabel>Data de Vencimento</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button variant="outline" className={styles.datePickerButton}>
                    {form.values.dueDate
                      ? form.values.dueDate.toLocaleDateString("pt-BR")
                      : "Selecione uma data"}
                    <CalendarIcon size={16} className={styles.datePickerIcon} />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent removeBackgroundAndPadding>
                <Calendar
                  mode="single"
                  selected={form.values.dueDate}
                  onSelect={(date) =>
                    form.setValues((prev) => ({
                      ...prev,
                      dueDate: date || undefined,
                    }))
                  }
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        </div>

        <div className={styles.formRow}>
          <FormItem name="description">
            <FormLabel>Descrição</FormLabel>
            <FormControl>
              <Input
                placeholder="Ex: Contratação de serviço"
                value={form.values.description || ""}
                onChange={(e) =>
                  form.setValues((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
          <FormItem name="vendor">
            <FormLabel>Fornecedor</FormLabel>
            <FormControl>
              <Input
                placeholder="Ex: Fornecedor X"
                value={form.values.vendor || ""}
                onChange={(e) =>
                  form.setValues((prev) => ({ ...prev, vendor: e.target.value }))
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </div>

        <div className={styles.formRow}>
          <FormItem name="predictedAmount">
            <FormLabel>Valor Previsto (R$)</FormLabel>
            <FormControl>
              <Input
                type="number"
                value={form.values.predictedAmount || ""}
                onChange={(e) =>
                  form.setValues((prev) => ({
                    ...prev,
                    predictedAmount: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  }))
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
          <FormItem name="contractedAmount">
            <FormLabel>Valor Contratado (R$)</FormLabel>
            <FormControl>
              <Input
                type="number"
                value={form.values.contractedAmount || ""}
                onChange={(e) =>
                  form.setValues((prev) => ({
                    ...prev,
                    contractedAmount: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  }))
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
          <FormItem name="paidAmount">
            <FormLabel>Valor Pago (R$)</FormLabel>
            <FormControl>
              <Input
                type="number"
                value={form.values.paidAmount || ""}
                onChange={(e) =>
                  form.setValues((prev) => ({
                    ...prev,
                    paidAmount: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  }))
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </div>

        <div className={styles.formActions}>
          <Button type="submit" disabled={updateBudget.isPending}>
            {updateBudget.isPending ? "Atualizando..." : "Atualizar Item"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export type BudgetItemFormProps = {
  mode: "create" | "edit";
  item?: any;
  onSuccess: () => void;
};

export function BudgetItemForm({ mode, item, onSuccess }: BudgetItemFormProps) {
  if (mode === "create") {
    return <CreateBudgetItemForm onSuccess={onSuccess} />;
  }
  
  if (mode === "edit" && item) {
    return <EditBudgetItemForm item={item} onSuccess={onSuccess} />;
  }

  return null;
}