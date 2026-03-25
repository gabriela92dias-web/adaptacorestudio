import React, { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTasks, useProjects, useCreateTask, useCreateTaskAction } from "../helpers/useCoreActApi";
import { toast } from "sonner";
import styles from "./CronogramaQuickAdd.module.css";
import { getCoreactTasksList } from "../endpoints/coreact/tasks/list_GET.schema";
import { getCoreactProjectsList } from "../endpoints/coreact/projects/list_GET.schema";

interface CronogramaQuickAddProps {
  date: Date;
  shift?: string;
  onClose: () => void;
}

export function CronogramaQuickAdd({ date, shift, onClose }: CronogramaQuickAddProps) {
  const [text, setText] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionType, setMentionType] = useState<"none" | "task" | "project">("none");
  const [mentionStartIndex, setMentionStartIndex] = useState(-1);
  const [selectedMention, setSelectedMention] = useState<{ id: string; type: "task" | "project"; name: string } | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);

  const { data: tasksData } = useTasks();
  const { data: projectsData } = useProjects();
  const createTask = useCreateTask();
  const createAction = useCreateTaskAction();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const tasks = tasksData?.tasks || [];
  const projects = projectsData?.projects || [];

  const filteredMentions = React.useMemo(() => {
    if (!showMentions) return [];
    const query = mentionQuery.toLowerCase().trim();
    if (!query) return [];
    
    const words = query.split(" ").filter(w => w.length > 2);
    const searchStr = words.length > 0 ? words : [query];

    const matchFn = (name: string) => searchStr.some(w => name.toLowerCase().includes(w));

    const matchedTasks = tasks
      .filter(t => matchFn(t.name))
      .map(t => ({ id: t.id, type: "task" as const, name: t.name, subtitle: "Tarefa" }));
      
    const matchedProjects = projects
      .filter(p => matchFn(p.name))
      .map(p => ({ id: p.id, type: "project" as const, name: p.name, subtitle: "Projeto/Etapa" }));

    return [...matchedTasks, ...matchedProjects].slice(0, 8);
  }, [showMentions, mentionQuery, tasks, projects]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setText(val);

    // Only allow one mention for simplicity
    if (selectedMention) {
        if (!val.includes(`@${selectedMention.name}`)) {
            setSelectedMention(null);
        } else {
            return; // Mention intact
        }
    }

    const lastAtPos = val.lastIndexOf("@");
    if (lastAtPos !== -1) {
      // Find if we are still typing the mention
      const queryStr = val.substring(lastAtPos + 1);
      if (!queryStr.includes(" ")) {
        setShowMentions(true);
        setMentionQuery(queryStr);
        setMentionStartIndex(lastAtPos);
        setHighlightedIndex(0); // Auto-highlight first for explicit @
        return;
      }
    } else if (val.trim().length > 2) {
      // Implicit mention suggestions based on typed text
      setShowMentions(true);
      setMentionQuery(val);
      setMentionStartIndex(-1);
      setHighlightedIndex(-1); // No auto-highlight by default, require arrow keys
      return;
    }
    
    setShowMentions(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      onClose();
      return;
    }

    if (showMentions && filteredMentions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prev) => prev < filteredMentions.length - 1 ? prev + 1 : 0);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prev) => prev > 0 ? prev - 1 : filteredMentions.length - 1);
        return;
      }
      if ((e.key === "Enter" || e.key === "Tab") && highlightedIndex >= 0) {
        e.preventDefault();
        insertMention(filteredMentions[highlightedIndex]);
        return;
      }
    }

    if (e.key === "Enter") {
      e.preventDefault();
      saveActivity();
    }
  };

  const insertMention = (item: { id: string; type: "task" | "project"; name: string }) => {
    setSelectedMention(item);
    let newText = "";
    if (!text.includes('@')) {
        if (text.trim().toLowerCase() === item.name.toLowerCase()) {
            newText = `@${item.name} `;
        } else {
            newText = `@${item.name} ${text.trim()} `;
        }
    } else {
        const beforeAt = text.substring(0, mentionStartIndex);
        newText = `${beforeAt}@${item.name} `;
    }
    setText(newText);
    setShowMentions(false);
    setHighlightedIndex(-1);
    if (inputRef.current) {
        inputRef.current.focus();
    }
  };

  const saveActivity = () => {
    if (!text.trim()) {
      onClose();
      return;
    }

    const cleanName = selectedMention 
        ? text.replace(`@${selectedMention.name}`, "").trim() 
        : text.trim();

    if (!cleanName) {
        toast.error("O nome da atividade não pode ser vazio.");
        return;
    }

    try {
        if (selectedMention?.type === "task") {
          // Add as action
          createAction.mutate({
            taskId: selectedMention.id,
            title: cleanName,
            type: "custom"
          }, {
            onSuccess: () => {
                toast.success("Ação adicionada à tarefa citada!");
                onClose();
            }
          });
        } else if (selectedMention?.type === "project") {
          // Add as task in project
          createTask.mutate({
            name: cleanName,
            projectId: selectedMention.id,
            stageId: "temp-stage", // Temporary workaround for required stageId
            startDate: date,
            endDate: date,
            shift: shift as any || "morning",
            priority: "medium",
            status: "open",
            progress: 0
          }, {
            onSuccess: () => {
                toast.success("Tarefa adicionada ao projeto citado!");
                onClose();
            }
          });
        } else {
          // Standalone task
          createTask.mutate({
            name: cleanName,
            projectId: projects[0]?.id || "temp-project",
            stageId: "temp-stage", 
            startDate: date,
            endDate: date,
            shift: shift as any || "morning",
            priority: "medium",
            status: "open",
            progress: 0
          }, {
            onSuccess: () => {
                toast.success("Atividade avulsa adicionada!");
                onClose();
            }
          });
        }
    } catch (err) {
        toast.error("Erro ao tentar adicionar.");
    }
  };

  return (
    <div className={styles.container}>
      <input
        ref={inputRef}
        type="text"
        className={styles.input}
        placeholder="Escreva algo... (use @ para citar)"
        value={text}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(() => !showMentions && onClose(), 150)}
      />
      {showMentions && filteredMentions.length > 0 && (
        <div className={styles.mentionsDropdown}>
          {filteredMentions.map((m, idx) => (
            <button
              key={m.id}
              className={`${styles.mentionItem} ${idx === highlightedIndex ? styles.mentionActive : ""}`}
              onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  insertMention(m);
              }}
            >
              <div className={styles.mentionName}>{m.name}</div>
              <div className={styles.mentionSub}>{m.subtitle}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
