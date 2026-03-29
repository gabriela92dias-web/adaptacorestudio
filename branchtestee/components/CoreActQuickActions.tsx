import React, { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import {
  Plus,
  Target,
  FolderOpen,
  CheckSquare,
  Layers,
  UploadIcon,
  CalendarIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./DropdownMenu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./Dialog";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "./Form";
import { Button } from "./Button";
import { Input } from "./Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./Select";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { Calendar } from "./Calendar";

import {
  useProjects,
  useTeamMembers,
  useCreateInitiative,
  useCreateTask,
  useCreateStage,
  useStages,
} from "../helpers/useCoreActApi";
import {
  InitiativeStatusArrayValues,
  TaskStatusArrayValues,
  StageStatusArrayValues,
  TaskShiftArrayValues,
} from "../helpers/schema";

import { CoreActCreateProjectDialog } from "./CoreActCreateProjectDialog";
import { BatchImportDialog } from "./BatchImportDialog";

import styles from "./CoreActQuickActions.module.css";

// --- Schemas ---
const initiativeSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  status: z.enum(InitiativeStatusArrayValues).default("solicitada"),
});

const taskSchema = z.object({
  projectId: z.string().min(1, "Projeto é obrigatório"),
  stageId: z.string().min(1, "Etapa é obrigatória"),
  name: z.string().min(1, "Nome é obrigatório"),
  assigneeId: z.string().optional().nullable(),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
  status: z.enum(TaskStatusArrayValues).default("open"),
  progress: z.number().min(0).max(100).default(0),
  shift: z.enum(TaskShiftArrayValues).default("morning"),
});

const stageSchema = z.object({
  projectId: z.string().min(1, "Projeto é obrigatório"),
  name: z.string().min(1, "Nome é obrigatório"),
  status: z.enum(StageStatusArrayValues).default("pending"),
});

type DialogType = "initiative" | "project" | "task" | "stage" | "import" | null;

export function CoreActQuickActions() {
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);

  const closeDialogs = () => setActiveDialog(null);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Plus size={16} />
            Ações
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações Rápidas</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuGroup>
            <DropdownMenuLabel className={styles.groupLabel}>Estratégia</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setActiveDialog("initiative")}>
              <Target className={styles.menuIcon} />
              Nova Iniciativa
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveDialog("project")}>
              <FolderOpen className={styles.menuIcon} />
              Novo Projeto
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuLabel className={styles.groupLabel}>Operacional</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setActiveDialog("task")}>
              <CheckSquare className={styles.menuIcon} />
              Nova Tarefa
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveDialog("stage")}>
              <Layers className={styles.menuIcon} />
              Nova Etapa
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuLabel className={styles.groupLabel}>Importação</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setActiveDialog("import")}>
              <UploadIcon className={styles.menuIcon} />
              Importar em Lote
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Controlled Dialogs Rendered Outside Dropdown */}
      <CreateInitiativeModal open={activeDialog === "initiative"} onOpenChange={(val) => !val && closeDialogs()} />
      <CreateTaskModal open={activeDialog === "task"} onOpenChange={(val) => !val && closeDialogs()} />
      <CreateStageModal open={activeDialog === "stage"} onOpenChange={(val) => !val && closeDialogs()} />
      <CoreActCreateProjectDialog open={activeDialog === "project"} onOpenChange={(val) => !val && closeDialogs()} />
      <BatchImportDialog open={activeDialog === "import"} onOpenChange={(val) => !val && closeDialogs()} />
    </>
  );
}

// --- Minimal Modals ---

function CreateInitiativeModal({ open, onOpenChange }: { open: boolean; onOpenChange: (val: boolean) => void }) {
  const createMutation = useCreateInitiative();
  
  const form = useForm({
    schema: initiativeSchema,
    defaultValues: {
      name: "",
      status: "solicitada",
    },
  });

  const handleSubmit = async (values: z.infer<typeof initiativeSchema>) => {
    try {
      await createMutation.mutateAsync(values as any);
      toast.success("Iniciativa criada com sucesso!");
      onOpenChange(false);
      form.setValues({ name: "", status: "solicitada" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao criar iniciativa");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Iniciativa</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className={styles.formContainer}>
            <FormItem name="name">
              <FormLabel>Nome da Iniciativa *</FormLabel>
              <FormControl>
                <Input
                  value={form.values.name}
                  onChange={(e) => form.setValues((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Expansão Q4"
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem name="status">
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select
                  value={form.values.status}
                  onValueChange={(val: any) => form.setValues((prev) => ({ ...prev, status: val }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planejamento</SelectItem>
                    <SelectItem value="active">Ativa</SelectItem>
                    <SelectItem value="completed">Concluída</SelectItem>
                    <SelectItem value="cancelled">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>

            <div className={styles.formActions}>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
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

export function CreateTaskModal({ open, onOpenChange, defaultDate }: { open: boolean; onOpenChange: (val: boolean) => void; defaultDate?: Date }) {
  const createMutation = useCreateTask();
  const { data: projectsData } = useProjects();
  const { data: teamData } = useTeamMembers();

  const form = useForm({
    schema: taskSchema,
    defaultValues: {
      projectId: "",
      stageId: "",
      name: "",
      status: "open",
      progress: 0,
      shift: "morning",
      startDate: defaultDate || null,
      endDate: defaultDate || null,
    },
  });

  const selectedProjectId = form.values.projectId;
  const { data: stagesData } = useStages(selectedProjectId);

  const handleSubmit = async (values: z.infer<typeof taskSchema>) => {
    try {
      await createMutation.mutateAsync(values as any);
      toast.success("Tarefa criada com sucesso!");
      onOpenChange(false);
      form.setValues({ projectId: "", stageId: "", name: "", status: "open", assigneeId: null, startDate: null, endDate: null, progress: 0, shift: "morning" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao criar tarefa");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Tarefa</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className={styles.formContainer}>
            <FormItem name="projectId">
              <FormLabel>Projeto *</FormLabel>
              <FormControl>
                <Select
                  value={form.values.projectId || "__empty"}
                  onValueChange={(val) => form.setValues((prev) => ({ ...prev, projectId: val === "__empty" ? "" : val, stageId: "" }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um projeto" />
                  </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__empty">Selecione...</SelectItem>
                      {projectsData?.projects
                        .filter(p => !p.name.toUpperCase().startsWith('[MOD') && p.status !== 'cancelled' && p.status !== 'completed')
                        .map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem name="stageId">
              <FormLabel>Etapa *</FormLabel>
              <FormControl>
                <Select
                  value={form.values.stageId || "__empty"}
                  onValueChange={(val) => form.setValues((prev) => ({ ...prev, stageId: val === "__empty" ? "" : val }))}
                  disabled={!selectedProjectId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma etapa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__empty">Selecione...</SelectItem>
                    {stagesData?.stages.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem name="name">
              <FormLabel>Nome da Tarefa *</FormLabel>
              <FormControl>
                <Input
                  value={form.values.name}
                  onChange={(e) => form.setValues((prev) => ({ ...prev, name: e.target.value }))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            <div className={styles.formGrid}>
              <FormItem name="assigneeId">
                <FormLabel>Responsável</FormLabel>
                <FormControl>
                  <Select
                    value={form.values.assigneeId || "__empty"}
                    onValueChange={(val) => form.setValues((prev) => ({ ...prev, assigneeId: val === "__empty" ? null : val }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sem responsável" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__empty">Sem responsável</SelectItem>
                      {teamData?.teamMembers.map((m) => (
                        <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>

              <FormItem name="status">
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select
                    value={form.values.status}
                    onValueChange={(val: any) => form.setValues((prev) => ({ ...prev, status: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Aberta</SelectItem>
                      <SelectItem value="in_progress">Em Andamento</SelectItem>
                      <SelectItem value="completed">Concluída</SelectItem>
                      <SelectItem value="standby">Em Espera</SelectItem>
                      <SelectItem value="blocked">Bloqueada</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>

            <div className={styles.formGrid}>
              <FormItem name="startDate">
                <FormLabel>Data de Início</FormLabel>
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
                        selected={form.values.startDate || undefined}
                        onSelect={(date) => {
                          if (date) form.setValues((prev) => ({ ...prev, startDate: date as Date }));
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
                        selected={form.values.endDate || undefined}
                        onSelect={(date) => {
                          if (date) form.setValues((prev) => ({ ...prev, endDate: date as Date }));
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>

            <div className={styles.formActions}>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Criando..." : "Criar Tarefa"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function CreateStageModal({ open, onOpenChange }: { open: boolean; onOpenChange: (val: boolean) => void }) {
  const createMutation = useCreateStage();
  const { data: projectsData } = useProjects();

  const form = useForm({
    schema: stageSchema,
    defaultValues: {
      projectId: "",
      name: "",
      status: "pending",
    },
  });

  const handleSubmit = async (values: z.infer<typeof stageSchema>) => {
    try {
      await createMutation.mutateAsync(values as any);
      toast.success("Etapa criada com sucesso!");
      onOpenChange(false);
      form.setValues({ projectId: "", name: "", status: "pending" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao criar etapa");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Etapa</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className={styles.formContainer}>
            <FormItem name="projectId">
              <FormLabel>Projeto *</FormLabel>
              <FormControl>
                <Select
                  value={form.values.projectId || "__empty"}
                  onValueChange={(val) => form.setValues((prev) => ({ ...prev, projectId: val === "__empty" ? "" : val }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um projeto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__empty">Selecione...</SelectItem>
                    {projectsData?.projects.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem name="name">
              <FormLabel>Nome da Etapa *</FormLabel>
              <FormControl>
                <Input
                  value={form.values.name}
                  onChange={(e) => form.setValues((prev) => ({ ...prev, name: e.target.value }))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem name="status">
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select
                  value={form.values.status}
                  onValueChange={(val: any) => form.setValues((prev) => ({ ...prev, status: val }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="in_progress">Em Andamento</SelectItem>
                    <SelectItem value="completed">Concluída</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>

            <div className={styles.formActions}>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Criando..." : "Criar Etapa"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}