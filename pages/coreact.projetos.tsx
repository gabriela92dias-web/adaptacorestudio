import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { usePermissions } from "../helpers/usePermissions";
import { PermissionWall } from "../components/PermissionWall";
import { useProjects } from "../helpers/useCoreActApi";
import { CoreActProjectDetailSheet } from "../components/CoreActProjectDetailSheet";
import { Search, FolderGit2, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { Skeleton } from "../components/Skeleton";
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
        /* ── Eixo 1: Skeleton state (UX Soberana) ── */
        <div className={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.card} style={{ cursor: "default", pointerEvents: "none" }}>
              <div style={{ padding: "var(--spacing-5)", display: "flex", flexDirection: "column", gap: "var(--spacing-3)", height: "100%" }}>
                <Skeleton style={{ width: "40%", height: "0.875rem" }} />
                <Skeleton style={{ width: "70%", height: "1.25rem" }} />
                <Skeleton style={{ width: "30%", height: "0.75rem", marginTop: "auto" }} />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        /* ── Eixo 1: Empty state orientado (UX Soberana) ── */
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "var(--spacing-3)",
          color: "var(--muted-foreground)",
          padding: "var(--spacing-10)",
          textAlign: "center",
        }}>
          <FolderGit2 size={48} style={{ opacity: 0.2 }} />
          <h3 style={{ margin: 0, color: "var(--foreground)", fontSize: "var(--font-size-xl)" }}>
            {searchQuery ? "Nenhum projeto encontrado" : "Nenhum projeto cadastrado"}
          </h3>
          <p style={{ margin: 0, fontSize: "var(--font-size-sm)", maxWidth: 360, lineHeight: 1.6 }}>
            {searchQuery
              ? `Nenhum projeto corresponde a "${searchQuery}". Tente outro termo de busca.`
              : "Crie o primeiro projeto em Iniciativas para começar a organizar o trabalho da equipe."}
          </p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredProjects.map((project) => {
            /* ── useMemo fora do map (hooks só no topo do componente) ── */
            const tasks = project.tasks || [];
            const completedCount = tasks.filter((t: any) => t.status === 'completed').length;
            const progressPercent = tasks.length > 0
              ? Math.round((completedCount / tasks.length) * 100)
              : 0;

            const Icon = project.status === 'completed' ? CheckCircle2
              : project.status === 'paused' ? AlertTriangle
              : project.status === 'active' ? Clock
              : FolderGit2;

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
                        <div style={{
                          background: 'var(--text-primary)',
                          color: 'var(--bg-primary)',
                          width: '100%', height: '100%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '12px', fontWeight: 'bold',
                        }}>
                          {project.ownerName ? project.ownerName.charAt(0) : '?'}
                        </div>
                      </div>
                    </div>
                    <span className={styles.tag}>{project.category || "Sem Categoria"}</span>
                  </div>

                  <div className={styles.cardBottom}>
                    <div className={styles.meta}>
                      {completedCount}/{tasks.length} tasks &bull; {progressPercent}%
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
