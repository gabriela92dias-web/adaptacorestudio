import type { TaskWithDetails } from "../endpoints/coreact/tasks/list_GET.schema";
import type { TaskDependencyWithDetails } from "../endpoints/coreact/dependencies/list_GET.schema";

export type ComputedTaskState = "completed" | "in_progress" | "blocked" | "ready";
export type ShiftId = "morning" | "afternoon" | "night";

export const SHIFTS = [
  { id: "morning" as ShiftId, label: "Manhã", startHour: 6, endHour: 12 },
  { id: "afternoon" as ShiftId, label: "Tarde", startHour: 12, endHour: 18 },
  { id: "night" as ShiftId, label: "Noite", startHour: 18, endHour: 24 }
];

export function isTaskOnDay(task: TaskWithDetails, date: Date): boolean {
  if (!task.startDate && !task.endDate) return false;
  
  const start = task.startDate ? new Date(task.startDate) : new Date(task.endDate!);
  const end = task.endDate ? new Date(task.endDate) : new Date(task.startDate!);

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  const target = new Date(date);
  target.setHours(12, 0, 0, 0);

  return target >= start && target <= end;
}

export function getTaskShift(task: TaskWithDetails): ShiftId {
  return (task.shift as ShiftId) || "morning";
}

export function computeTaskStatuses(
  tasks: TaskWithDetails[],
  dependencies?: TaskDependencyWithDetails[]
): Map<string, ComputedTaskState> {
  const map = new Map<string, ComputedTaskState>();
  
  tasks.forEach((t) => {
    if (t.progress === 100 || t.status === "completed") {
      map.set(t.id, "completed");
    } else if ((t.progress && t.progress > 0) || t.status === "in_progress") {
      map.set(t.id, "in_progress");
    } else {
      map.set(t.id, "ready");
    }
  });

  if (dependencies) {
    dependencies.forEach((dep) => {
      const targetStatus = map.get(dep.taskId);
      if (targetStatus === "completed") return;
      
      const sourceStatus = map.get(dep.dependsOnTaskId);
      
      if (dep.dependencyType === "finish_to_start" && sourceStatus !== "completed") {
        map.set(dep.taskId, "blocked");
      }
    });
  }

  return map;
}

export function filterTasksForDay(tasks: TaskWithDetails[], date: Date): TaskWithDetails[] {
  return tasks.filter(t => isTaskOnDay(t, date));
}

const PRIORITY_WEIGHT = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export function sortTasksByPriority(tasks: TaskWithDetails[]): TaskWithDetails[] {
  return [...tasks].sort((a, b) => {
    const wA = PRIORITY_WEIGHT[a.priority as keyof typeof PRIORITY_WEIGHT] || 0;
    const wB = PRIORITY_WEIGHT[b.priority as keyof typeof PRIORITY_WEIGHT] || 0;
    return wB - wA;
  });
}