import React, { useMemo } from "react";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { useSectorMembers } from "../helpers/useSectorMembers";
import { useUpdateSectorMember } from "../helpers/useUpdateSectorMember";
import { PERMISSION_KEYS } from "../helpers/usePermissions";
import { Button } from "./Button";
import { Checkbox } from "./Checkbox";
import { Badge } from "./Badge";
import { Avatar, AvatarFallback } from "./Avatar";
import { Skeleton } from "./Skeleton";
import styles from "./CoreactSectorPermissions.module.css";

const getInitials = (name: string) => {
  if (!name) return "??";
  const parts = name.split(" ");
  if (parts.length > 1) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export const CoreactSectorPermissions = ({ sectorId }: { sectorId: string }) => {
  const { data: members, isLoading } = useSectorMembers(sectorId);
  const updateMutation = useUpdateSectorMember();

  const flatPermissions = useMemo(() => {
    const list: { groupKey: string; key: string; label: string }[] = [];
    Object.entries(PERMISSION_KEYS).forEach(([groupKey, perms]) => {
      Object.entries(perms).forEach(([key, label]) => {
        list.push({ groupKey, key, label });
      });
    });
    return list;
  }, []);

  const permissionGroups = useMemo(() => {
    return Object.entries(PERMISSION_KEYS).map(([groupKey, perms]) => ({
      groupKey,
      count: Object.keys(perms).length,
    }));
  }, []);

  const agents = members?.filter((m) => m.role === "agente") || [];
  const responsaveis = members?.filter((m) => m.role === "responsavel") || [];

  const handleTogglePermission = async (memberId: string, permissionKey: string, currentVal: boolean) => {
    const member = members?.find((m) => m.id === memberId);
    if (!member) return;

    const rawPerms = member.permissions;
    const existingPerms: Record<string, boolean> =
      typeof rawPerms === "string" ? JSON.parse(rawPerms) : (rawPerms ?? {});

    const newPermissions = {
      ...existingPerms,
      [permissionKey]: !currentVal,
    };

    try {
      await updateMutation.mutateAsync({
        id: memberId,
        permissions: newPermissions,
      });
    } catch (err) {
      toast.error("Erro ao atualizar permissão");
    }
  };

  const handleBatchApplyAll = async () => {
    if (agents.length === 0) return;

    const allPermsTrue: Record<string, boolean> = {};
    flatPermissions.forEach((p) => {
      allPermsTrue[p.key] = true;
    });

    try {
      await Promise.all(
        agents.map((agent) =>
          updateMutation.mutateAsync({
            id: agent.id,
            permissions: allPermsTrue,
          })
        )
      );
      toast.success("Todas as permissões foram concedidas aos agentes!");
    } catch (err) {
      toast.error("Erro ao aplicar permissões em lote");
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Skeleton style={{ height: "200px" }} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.description}>
          Configure as permissões granulares para os agentes deste setor. Responsáveis possuem acesso total por padrão.
        </p>
        <Button onClick={handleBatchApplyAll} variant="secondary" size="sm" disabled={agents.length === 0 || updateMutation.isPending}>
          <Check size={16} /> Ativar todas para agentes
        </Button>
      </div>

      <div className={styles.matrixWrapper}>
        <table className={styles.matrixTable}>
          <thead>
            <tr>
              <th className={styles.stickyCol} rowSpan={2}>Membro</th>
              {permissionGroups.map((group) => (
                <th key={group.groupKey} colSpan={group.count} className={styles.groupHeader}>
                  {group.groupKey === "modules" ? "Módulos" :
                   group.groupKey === "coreact" ? "CoreAct" :
                   group.groupKey === "tools" ? "Tools" : "Dashboard"}
                </th>
              ))}
            </tr>
            <tr>
              {flatPermissions.map((perm) => (
                <th key={perm.key} className={styles.permHeader}>
                  <div className={styles.verticalText}>{perm.label}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {responsaveis.map((resp) => (
              <tr key={resp.id} className={styles.row}>
                <td className={styles.stickyCol}>
                  <div className={styles.memberCell}>
                    <Avatar className={styles.avatar}>
                      <AvatarFallback>{getInitials(resp.memberName)}</AvatarFallback>
                    </Avatar>
                    <div className={styles.memberInfo}>
                      <span className={styles.memberName}>{resp.memberName}</span>
                      <Badge variant="outline">Responsável</Badge>
                    </div>
                  </div>
                </td>
                <td colSpan={flatPermissions.length} className={styles.fullAccessCell}>
                  Acesso Total
                </td>
              </tr>
            ))}
            
            {agents.map((agent) => {
              const activeCount = flatPermissions.filter((p) => agent.permissions?.[p.key]).length;
              
              return (
                <tr key={agent.id} className={styles.row}>
                  <td className={styles.stickyCol}>
                    <div className={styles.memberCell}>
                      <Avatar className={styles.avatar}>
                        <AvatarFallback>{getInitials(agent.memberName)}</AvatarFallback>
                      </Avatar>
                      <div className={styles.memberInfo}>
                        <span className={styles.memberName}>{agent.memberName}</span>
                        {activeCount === 0 && <Badge variant="warning">Sem permissões</Badge>}
                      </div>
                    </div>
                  </td>
                  {flatPermissions.map((perm) => {
                    const isChecked = !!agent.permissions?.[perm.key];
                    return (
                      <td key={perm.key} className={styles.cell}>
                        <Checkbox
                          checked={isChecked}
                          onChange={() => handleTogglePermission(agent.id, perm.key, isChecked)}
                          disabled={updateMutation.isPending}
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}

            {members?.length === 0 && (
              <tr>
                <td colSpan={flatPermissions.length + 1} className={styles.emptyState}>
                  Nenhum membro no setor para configurar permissões.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};