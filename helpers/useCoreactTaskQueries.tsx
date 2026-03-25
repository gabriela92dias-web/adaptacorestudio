import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCoreactActivityList } from "../endpoints/coreact/activity/list_GET.schema";
import { getCoreactTaskActionsList } from "../endpoints/coreact/task-actions/list_GET.schema";
import { postCoreactTaskActionsCreate } from "../endpoints/coreact/task-actions/create_POST.schema";
import { postCoreactTaskActionsUpdate } from "../endpoints/coreact/task-actions/update_POST.schema";
import { getCoreactTaskParticipantsList } from "../endpoints/coreact/task-participants/list_GET.schema";
import { postCoreactTaskParticipantsCreate } from "../endpoints/coreact/task-participants/create_POST.schema";
import { postCoreactTaskParticipantsDelete } from "../endpoints/coreact/task-participants/delete_POST.schema";
import { postCoreactTasksBatchCreate } from "../endpoints/coreact/tasks/batch-create_POST.schema";
import { getCoreactReportsProject } from "../endpoints/coreact/reports/project_GET.schema";

export const useCoreactActivities = (projectId?: string) => {
  return useQuery({
    queryKey: ["coreact", "activities", projectId],
    queryFn: () => getCoreactActivityList({ projectId, limit: 50 }),
    enabled: !!projectId,
  });
};

export const useCoreactTaskActions = (taskId?: string) => {
  return useQuery({
    queryKey: ["coreact", "task-actions", taskId],
    queryFn: () => getCoreactTaskActionsList({ taskId }),
    enabled: !!taskId,
  });
};

export const useCreateTaskAction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCoreactTaskActionsCreate,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["coreact", "task-actions", data.taskAction.taskId],
      });
      queryClient.invalidateQueries({ queryKey: ["coreact", "activities"] });
      queryClient.invalidateQueries({ queryKey: ["coreact", "tasks"] });
    },
  });
};

export const useUpdateTaskAction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCoreactTaskActionsUpdate,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["coreact", "task-actions", data.taskAction.taskId],
      });
      queryClient.invalidateQueries({ queryKey: ["coreact", "activities"] });
      queryClient.invalidateQueries({ queryKey: ["coreact", "tasks"] });
    },
  });
};

export const useCoreactTaskParticipants = (taskId?: string) => {
  return useQuery({
    queryKey: ["coreact", "task-participants", taskId],
    queryFn: () => getCoreactTaskParticipantsList({ taskId: taskId! }),
    enabled: !!taskId,
  });
};

export const useCreateTaskParticipant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCoreactTaskParticipantsCreate,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["coreact", "task-participants", data.taskParticipant.taskId],
      });
      queryClient.invalidateQueries({ queryKey: ["coreact", "activities"] });
    },
  });
};

export const useDeleteTaskParticipant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCoreactTaskParticipantsDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coreact", "task-participants"] });
    },
  });
};

export const useBatchCreateTasks = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCoreactTasksBatchCreate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coreact", "tasks"] });
      queryClient.invalidateQueries({ queryKey: ["coreact", "reports"] });
    },
  });
};

export const useCoreactProjectReport = (projectId?: string) => {
  return useQuery({
    queryKey: ["coreact", "reports", projectId],
    queryFn: () => getCoreactReportsProject({ projectId: projectId! }),
    enabled: !!projectId,
  });
};