import React from "react";
import { Helmet } from "react-helmet";
import { CoreactExecutiveHome } from "../components/CoreactExecutiveHome";
import { useMyRole } from "../helpers/useSectorMembers";
import { useAuth } from "../helpers/useAuth";
import { Skeleton } from "../components/Skeleton";
import styles from "./coreact.module.css";

export default function CoreActOverview() {
  const { authState } = useAuth();
  const { isLoading: isLoadingRole } = useMyRole();

  if (isLoadingRole || authState.type === "loading") {
    return (
      <div style={{ padding: "var(--spacing-5)" }}>
        <Skeleton style={{ height: 100 }} />
      </div>
    );
  }

  if (authState.type !== "authenticated") return null;

  return (
    <div className={styles.coreactContainer}>
      <Helmet>
        <title>CoreStudio | Dashboard</title>
      </Helmet>
      <CoreactExecutiveHome
        userName={authState.user.displayName}
      />
    </div>
  );
}