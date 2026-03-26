import React from "react";
import { usePermissions } from "../helpers/usePermissions";
import { PermissionWall } from "../components/PermissionWall";

export default function CoreactAcoes() {
  const { hasPermission } = usePermissions();

  if (!hasPermission("coreactAcoes")) {
    return <PermissionWall moduleName="Ações" />;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Ações</h2>
      <p>Building the checklist UI and dot matrix tracker.</p>
    </div>
  );
}
