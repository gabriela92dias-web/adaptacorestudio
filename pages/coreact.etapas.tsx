import React from "react";
import { usePermissions } from "../helpers/usePermissions";
import { PermissionWall } from "../components/PermissionWall";

export default function CoreactEtapas() {
  const { hasPermission } = usePermissions();

  if (!hasPermission("coreactEtapas")) {
    return <PermissionWall moduleName="Etapas" />;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Etapas</h2>
      <p>Building the new clean Milestone Gantt view.</p>
    </div>
  );
}
