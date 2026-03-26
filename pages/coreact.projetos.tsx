import React from "react";
import { usePermissions } from "../helpers/usePermissions";
import { PermissionWall } from "../components/PermissionWall";

export default function CoreactProjetos() {
  const { hasPermission } = usePermissions();

  if (!hasPermission("coreactProjetos")) {
    return <PermissionWall moduleName="Projetos" />;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Projetos</h2>
      <p>Building the new high-fidelity project gallery.</p>
    </div>
  );
}
