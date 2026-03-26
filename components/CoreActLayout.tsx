import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { 
  Users, DollarSign, 
  Target, Building2, Folder, Layers, ListTodo, Zap
} from "lucide-react";
import { usePermissions, PermissionKey } from "../helpers/usePermissions";
import { useAdaptiveLevel } from "../helpers/useAdaptiveLevel";
import { AgendaSidebar } from "./AgendaSidebar";
import { CoreActQuickActions } from "./CoreActQuickActions";
import styles from "./CoreActLayout.module.css";

export const CoreActLayout = ({ children }: { children?: React.ReactNode }) => {
  const { hasPermission } = usePermissions();
  const { ref, level } = useAdaptiveLevel();

  const navItems = [
    { path: "/coreact/setores", label: "Setores", icon: Building2, permission: "coreact_setores" },
    { path: "/coreact/iniciativas", label: "Iniciativas", icon: Target, permission: "coreact_iniciativas" },
    { path: "/coreact/projetos", label: "Projetos", icon: Folder, permission: "coreact_projetos" },
    { path: "/coreact/etapas", label: "Etapas", icon: Layers, permission: "coreact_etapas" },
    { path: "/coreact/tarefas", label: "Tarefas", icon: ListTodo, permission: "coreact_tarefas" },
    { path: "/coreact/acoes", label: "Ações", icon: Zap, permission: "coreact_acoes" },
    { path: "/coreact/orcamento", label: "Orçamento", icon: DollarSign, permission: "coreact_orcamento" },
    { path: "/coreact/time", label: "Equipe", icon: Users, permission: "coreact_time" },
  ];

  const filteredNavItems = navItems.filter(item => {
    if (!item.permission) return true;
    return hasPermission(item.permission as PermissionKey);
  });

  return (
    <div ref={ref} className={`${styles.layout} ${styles[`level${level}`]}`}>
      <header className={styles.header}>
        <NavLink 
          to="/coreact" 
          end 
          className={({ isActive }) => 
            `${styles.titleLink} ${isActive ? styles.titleActive : ""}`
          }
        >
          CoreAct
        </NavLink>
        <nav className={styles.tabBar}>
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
                }
                title={item.label}
              >
                <Icon size={16} className={styles.navIcon} />
                                {level < 2 && <span className={styles.navLabel}>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
        <div className={styles.quickActionsWrapper}>
          <CoreActQuickActions />
        </div>
      </header>

      <div className={styles.body}>
        <main className={styles.main}>
          {children || <Outlet />}
        </main>
        <AgendaSidebar />
      </div>
    </div>
  );
};