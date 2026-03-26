import React from "react";
import { usePermissions } from "../helpers/usePermissions";
import { PermissionWall } from "../components/PermissionWall";

export default function CoreactTarefas() {
  const { hasPermission } = usePermissions();

  if (!hasPermission("coreactTarefas")) {
    return <PermissionWall moduleName="Tarefas" />;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Tarefas</h2>
      <p>Building the new Master Kanban board.</p>
    </div>
  );
}
