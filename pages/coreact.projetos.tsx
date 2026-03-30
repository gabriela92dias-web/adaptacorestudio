import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { usePermissions } from "../helpers/usePermissions";
import { PermissionWall } from "../components/PermissionWall";
import { useProjects } from "../helpers/useCoreActApi";
import { CoreActProjectDetailSheet } from "../components/CoreActProjectDetailSheet";
import { Search, FolderGit2, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import styles from "./coreact.projetos.module.css";

export default function CoreactProjetos() {
  const { hasPermission } = usePermissions();
  const { data: projectsData, isLoading } = useProjects();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  if (!hasPermission("coreactProjetos")) {
    return <PermissionWall moduleName="Projetos" />;
  }

  const allProjects = projectsData?.projects || [];
  
  const filteredProjects = allProjects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.initiativeName || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <Helmet><title>CoreStudio | Projetos</title></Helmet>
      <header className={styles.header}>
        <h1 className={styles.title}>Projetos</h1>
        <div className={styles.searchContainer}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Buscar projetos..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </header>

      {isLoading ? (
        <div style={{ padding: "2rem" }}>Carregando projetos...</div>
      ) : (
        <div className={styles.grid}>
          {filteredProjects.map((project) => {
            const tasksCount = React.useMemo(() => {
              if(!project.tasks) return { completed: 0, total: 0 };
              const completed = project.tasks.filter((t: any) => t.status === 'completed').length;
              return { completed, total: project.tasks.length };
            }, [project.tasks]);
            
            const progressPercent = tasksCount.total > 0 ? Math.round((tasksCount.completed / tasksCount.total) * 100) : 0;
            
            const Icon = project.status === 'completed' ? CheckCircle2 : 
                         project.status === 'paused' ? AlertTriangle : 
                         project.status === 'active' ? Clock : FolderGit2;

            return (
              <div 
                key={project.id} 
                className={styles.card}
                onClick={() => setSelectedProjectId(project.id)}
                style={{ cursor: "pointer" }}
              >
                <div className={styles.cardOverlay} />
                
                <Icon size={240} className={styles.giantGraphic} strokeWidth={1} style={{ opacity: 0.05 }} />

                <div className={styles.cardContent}>
                  <div className={styles.cardTop}>
                    <div className={styles.avatarGroup}>
                      <div className={styles.avatar}>
                        <div style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                          {project.ownerName ? project.ownerName.charAt(0) : '?'}
                        </div>
                      </div>
                    </div>
                    <span className={styles.tag}>{project.category || "Sem Categoria"}</span>
                  </div>

                  <div className={styles.cardBottom}>
                    <div className={styles.meta}>
                      {tasksCount.completed}/{tasksCount.total} tasks &bull; {progressPercent}%
                    </div>
                    <h3 className={styles.projectName}>{project.name}</h3>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedProjectId && (
        <CoreActProjectDetailSheet 
          projectId={selectedProjectId} 
          onClose={() => setSelectedProjectId(null)} 
        />
      )}
    </div>
  );
}
