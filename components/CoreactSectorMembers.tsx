import React, { useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import {
  useSectorMembers,
  useCreateSectorMember,
  useDeleteSectorMember,
} from "../helpers/useSectorMembers";
import { PERMISSION_KEYS } from "../helpers/usePermissions";
import { Input } from "./Input";
import { Badge } from "./Badge";
import { Checkbox } from "./Checkbox";
import { useUpdateSectorMember } from "../helpers/useUpdateSectorMember";
import { Avatar, AvatarFallback } from "./Avatar";
import { Button } from "./Button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./Select";
import { Skeleton } from "./Skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./Dialog";
import styles from "./CoreactSectorMembers.module.css";

const getInitials = (name: string) => {
  if (!name) return "??";
  const parts = name.split(" ");
  if (parts.length > 1) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export const CoreactSectorMembers = ({ sectorId }: { sectorId: string }) => {
  const { data: members, isLoading: membersLoading } = useSectorMembers(sectorId);
  const createMutation = useCreateSectorMember();
  const deleteMutation = useDeleteSectorMember();
  const updateMutation = useUpdateSectorMember();

  const [email, setEmail] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("agente");
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  
  const [memberToDelete, setMemberToDelete] = useState<{ id: string; name: string } | null>(null);

  const handleAdd = async () => {
    if (!email.trim() || !selectedRole) return;
    try {
      await createMutation.mutateAsync({
        sectorId,
        email: email.trim(),
        role: selectedRole as any,
        permissions: selectedRole === "agente" ? permissions : undefined,
      });
      setEmail("");
      setPermissions({});
      toast.success("Membro adicionado ao setor!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao adicionar membro");
    }
  };

  const handleTogglePermission = (key: string) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleRoleChange = async (memberId: string, newRole: string) => {
    if (newRole === "_empty") return;
    try {
      await updateMutation.mutateAsync({
        id: memberId,
        role: newRole as any,
      });
      toast.success("Papel atualizado com sucesso!");
    } catch (err) {
      toast.error("Erro ao atualizar papel do membro");
    }
  };

  const handleDelete = async () => {
    if (!memberToDelete) return;
    try {
      await deleteMutation.mutateAsync({ id: memberToDelete.id });
      toast.success("Membro removido do setor!");
      setMemberToDelete(null);
    } catch (err) {
      toast.error("Erro ao remover membro");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.listContainer}>
        {membersLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className={styles.skeletonRow} />
          ))
        ) : members?.length === 0 ? (
          <div className={styles.emptyState}>Nenhum membro associado a este setor.</div>
        ) : (
          members?.map((m) => (
            <div key={m.id} className={styles.memberRow}>
              <div className={styles.memberInfo}>
                <Avatar>
                  <AvatarFallback>{getInitials(m.memberName)}</AvatarFallback>
                </Avatar>
                <div className={styles.memberDetails}>
                  <div className={styles.memberNameRow}>
                    <span className={styles.memberName}>{m.memberName}</span>
                    {m.memberStatus === "pending_registration" && (
                      <Badge variant="warning">Pendente</Badge>
                    )}
                  </div>
                  {m.memberEmail && (
                    <span className={styles.memberEmail}>{m.memberEmail}</span>
                  )}
                </div>
              </div>
              <div className={styles.memberActions}>
                <Select
                  value={m.role}
                  onValueChange={(val) => handleRoleChange(m.id, val)}
                >
                  <SelectTrigger className={styles.roleSelect}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agente">Agente</SelectItem>
                    <SelectItem value="responsavel">Responsável</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon-md"
                  onClick={() => setMemberToDelete({ id: m.id, name: m.memberName })}
                  aria-label="Remover membro"
                >
                  <X size={16} />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className={styles.addSection}>
        <h4 className={styles.addTitle}>Adicionar Membro</h4>
        <div className={styles.addForm}>
          <div className={styles.addSelectFlex}>
            <Input
              type="email"
              placeholder="E-mail do membro..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd();
              }}
            />
          </div>
          <div className={styles.addRoleFlex}>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agente">Agente</SelectItem>
                <SelectItem value="responsavel">Responsável</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleAdd}
            disabled={!email.trim() || createMutation.isPending}
          >
            Adicionar
          </Button>
        </div>
        {selectedRole === "agente" ? (
          <details className={styles.permissionsCollapsible}>
            <summary className={styles.permissionsSummary}>
              Configurar Permissões
            </summary>
            <div className={styles.permissionsContent}>
              {Object.entries(PERMISSION_KEYS).map(([group, keys]) => (
                <div key={group} className={styles.permissionGroup}>
                  <h6 className={styles.permissionGroupTitle}>
                    {group.toUpperCase()}
                  </h6>
                  <div className={styles.permissionList}>
                    {Object.entries(keys).map(([key, label]) => (
                      <label key={key} className={styles.permissionItem}>
                        <Checkbox
                          checked={!!permissions[key]}
                          onChange={() => handleTogglePermission(key)}
                        />
                        <span className={styles.permissionLabel}>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </details>
        ) : (
          <div className={styles.responsavelNote}>Acesso total por padrão</div>
        )}
      </div>

      <Dialog open={!!memberToDelete} onOpenChange={(open) => !open && setMemberToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover Membro</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover <strong>{memberToDelete?.name}</strong> deste setor?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setMemberToDelete(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "Removendo..." : "Remover"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};