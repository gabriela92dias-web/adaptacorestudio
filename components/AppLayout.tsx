import React from "react";
import { AppSidebar } from "./AppSidebar";
import { useDragScroll } from "../helpers/useDragScroll";
import { UserRoute } from "./ProtectedRoute";
import styles from "./AppLayout.module.css";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { ref, isGrabbing, isSpacePressed } = useDragScroll<HTMLElement>();

  return (
    <UserRoute>
      <div className={styles.container}>
        <AppSidebar />
        <main 
          ref={ref} 
          className={`${styles.mainContent} ${isGrabbing ? styles.isGrabbing : ""} ${isSpacePressed && !isGrabbing ? styles.spaceHeld : ""}`}
        >
          <div className={styles.contentWrapper}>{children}</div>
        </main>
      </div>
    </UserRoute>
  );
};