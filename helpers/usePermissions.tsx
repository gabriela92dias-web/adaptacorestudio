import { useCallback, useMemo } from "react";
import { useMyRole } from "./useSectorMembers";

export const PERMISSION_KEYS = {
  modules: {
    moduleCoreact: "CoreAct",
    moduleBrand: "Brand",
    moduleMarketing: "Marketing",
    moduleTools: "Tools",
  },
  coreact: {
    coreactIniciativas: "Iniciativas",
    coreactProjetos: "Projetos",
    coreactEtapas: "Etapas",
    coreactTarefas: "Tarefas",
    coreactAcoes: "Ações",
    coreactCronograma: "Cronograma",
    coreactVisaoDiaria: "Visão Diária",
    coreactExecucoes: "Execuções",
    coreactOrcamento: "Orçamento",
    coreactTime: "Time",
    coreactSetores: "Setores",
  },
  tools: {
    toolsLogoStudio: "Logo Studio",
    toolsDocumentos: "Documentos",
  },
  dashboard: {
    dashboardVisaoDiaria: "Visão Diária",
    dashboardExecucoes: "Execuções",
    dashboardCronograma: "Cronograma",
    dashboardOrcamento: "Orçamento",
  },
} as const;

export type PermissionGroup = typeof PERMISSION_KEYS;

export type PermissionKey =
  | keyof PermissionGroup["modules"]
  | keyof PermissionGroup["coreact"]
  | keyof PermissionGroup["tools"]
  | keyof PermissionGroup["dashboard"];

export type PermissionsMap = Record<string, boolean>;

export const usePermissions = () => {
  const { data, isLoading } = useMyRole();

  const roles = data?.sectorRoles || [];
  
  // If the user has 'responsavel' in ANY sector, they have full access.
  const isResponsavel = useMemo(() => {
    return roles.some((r) => r.role === "responsavel");
  }, [roles]);

  const permissions = useMemo(() => {
    const map: PermissionsMap = {};
    roles.forEach((r) => {
      // We safely cast here to support aggregation in case the backend 
      // my-role endpoint is updated to return the permissions JSON payload.
      const p = (r as any).permissions as Record<string, boolean> | undefined;
      if (p && typeof p === "object") {
        Object.entries(p).forEach(([k, v]) => {
          if (v) {
            map[k] = true;
          }
        });
      }
    });
    return map;
  }, [roles]);

  const hasPermission = useCallback(
    (key: PermissionKey) => {
      // Mocked to true for preview/development
      return true;
    },
    []
  );

  return {
    permissions,
    hasPermission,
    isResponsavel,
    isLoading,
  };
};