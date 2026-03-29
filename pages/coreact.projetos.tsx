import React from "react";
import { usePermissions } from "../helpers/usePermissions";
import { PermissionWall } from "../components/PermissionWall";
import { Search, Rocket, Monitor, Megaphone, Smartphone, UserCircle } from "lucide-react";
import styles from "./coreact.projetos.module.css";

// Mock Data
const MOCK_PROJECTS = [
  {
    id: "proj-1",
    name: "Brand Studio Expansion",
    tasksCompleted: 12,
    tasksTotal: 12,
    status: "Completed",
    icon: Rocket,
    bgImage: "", // URL could go here
    avatars: ["https://i.pravatar.cc/150?u=1", "https://i.pravatar.cc/150?u=2"],
    extraUsers: 0,
    tag: "Product",
  },
  {
    id: "proj-2",
    name: "Executive Dashboard",
    tasksCompleted: 42,
    tasksTotal: 60,
    status: "In Progress",
    icon: Monitor,
    bgImage: "",
    avatars: ["https://i.pravatar.cc/150?u=3", "https://i.pravatar.cc/150?u=4", "https://i.pravatar.cc/150?u=5"],
    extraUsers: 2,
    tag: "Design",
  },
  {
    id: "proj-3",
    name: "SMM Masterclass",
    tasksCompleted: 4,
    tasksTotal: 7,
    status: "At Risk",
    icon: Megaphone,
    bgImage: "",
    avatars: ["https://i.pravatar.cc/150?u=6"],
    extraUsers: 0,
    tag: "Marketing",
  },
  {
    id: "proj-4",
    name: "Mobile App Wireframe",
    tasksCompleted: 0,
    tasksTotal: 24,
    status: "Backlog",
    icon: Smartphone,
    bgImage: "",
    avatars: ["https://i.pravatar.cc/150?u=7", "https://i.pravatar.cc/150?u=8"],
    extraUsers: 1,
    tag: "UX/UI",
  }
];

export default function CoreactProjetos() {
  const { hasPermission } = usePermissions();

  if (!hasPermission("coreactProjetos")) {
    return <PermissionWall moduleName="Projetos" />;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Projetos</h1>
        <div className={styles.searchContainer}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Buscar projetos..." 
            className={styles.searchInput}
          />
        </div>
      </header>

      <div className={styles.grid}>
        {MOCK_PROJECTS.map((project) => {
          const Icon = project.icon;
          const progressPercent = Math.round((project.tasksCompleted / project.tasksTotal) * 100);

          return (
            <div 
              key={project.id} 
              className={styles.card}
              style={project.bgImage ? { backgroundImage: `url(${project.bgImage})` } : {}}
            >
              {project.bgImage && <div className={styles.cardOverlay} />}
              
              <Icon size={240} className={styles.giantGraphic} strokeWidth={1} />

              <div className={styles.cardContent}>
                <div className={styles.cardTop}>
                  <div className={styles.avatarGroup}>
                    {project.avatars.map((url, i) => (
                      <div key={i} className={styles.avatar}>
                        <img src={url} alt="Team member" />
                      </div>
                    ))}
                    {project.extraUsers > 0 && (
                      <div className={`${styles.avatar} ${styles.avatarMore}`}>
                        +{project.extraUsers}
                      </div>
                    )}
                  </div>
                  <span className={styles.tag}>{project.tag}</span>
                </div>

                <div className={styles.cardBottom}>
                  <div className={styles.meta}>
                    {project.tasksCompleted}/{project.tasksTotal} tasks &bull; {progressPercent}%
                  </div>
                  <h3 className={styles.projectName}>{project.name}</h3>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
