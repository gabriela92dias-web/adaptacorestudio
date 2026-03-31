import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import { Plus, Target, ChevronRight, Building } from "lucide-react";
import { InitiativesAreaChart } from "../components/InitiativesAreaChart";
import { useInitiatives, useTeamMembers } from "../helpers/useCoreActApi";
import { InitiativeStatusArrayValues } from "../helpers/schema";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { Skeleton } from "../components/Skeleton";
import { BatchImportDialog } from "../components/BatchImportDialog";
import { useAdaptiveLevel } from "../helpers/useAdaptiveLevel";
import { CoreActInitiativeCreateForm } from "../components/CoreActInitiativeCreateForm";
import { CoreActInitiativeDetailPanel } from "../components/CoreActInitiativeDetailPanel";
import { CoreActInitiativeDocs } from "../components/CoreActInitiativeDocs";
import { statusMap } from "../helpers/coreactInitiativesUtils";
import styles from "./coreact.iniciativas.module.css";

const CoreActInitiativeMindMap = React.lazy(() => import("../components/CoreActInitiativeMindMap"));

export default function CoreActIniciativas() {
  const [activeTab, setActiveTab] = useState<"operacional" | "mapa" | "docs">("operacional");
  const [filter, setFilter] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [collapsedSectors, setCollapsedSectors] = useState<Set<string>>(new Set());

  const { data, isLoading, error } = useInitiatives(filter as any);
  const { data: teamData } = useTeamMembers();

  const groupedInitiatives = useMemo(() => {
    if (!data?.initiatives) return {};
    const groups: Record<string, typeof data.initiatives> = {};
    data.initiatives.forEach(init => {
      const sectorName = init.sectorName || "Sem setor";
      if (!groups[sectorName]) groups[sectorName] = [];
      groups[sectorName].push(init);
    });
    return groups;
  }, [data?.initiatives]);

  const toggleSector = (sector: string) => {
    setCollapsedSectors(prev => {
      const next = new Set(prev);
      if (next.has(sector)) next.delete(sector);
      else next.add(sector);
      return next;
    });
  };

  const { ref, level, className: adaptiveClass } = useAdaptiveLevel({
    itemCount: isLoading ? 0 : (data?.initiatives?.length ?? 0),
  });

  const handleFilterClick = (status: string | null) => {
    setFilter(status);
    setSelectedId(null);
    setIsCreating(false);
  };

  const selectedInitiative = data?.initiatives?.find(i => i.id === selectedId);

  return (
    <div ref={ref} className={`${styles.pageWrapper} ${adaptiveClass} ${styles[`level${level}`]}`}>
      <Helmet><title>CoreStudio | Iniciativas</title></Helmet>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div>
            <h1 className={styles.title}>Iniciativas</h1>
            <p className={styles.subtitle}>Gerencie os agrupamentos estratégicos de projetos</p>
          </div>
          <div style={{ display: "flex", gap: "var(--spacing-2)" }}>
            <BatchImportDialog defaultEntityType="hierarchical" defaultInitiativeId={selectedId ?? undefined} />
            <Button onClick={() => { setIsCreating(true); setSelectedId(null); }}>
              <Plus size={16} /> Nova Iniciativa
            </Button>
          </div>
        </div>

        <div className={styles.tabsBar}>
          <button 
            className={`${styles.tabButton} ${activeTab === "operacional" ? styles.tabButtonActive : ""}`}
            onClick={() => setActiveTab("operacional")}
          >
            Operacional
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === "mapa" ? styles.tabButtonActive : ""}`}
            onClick={() => setActiveTab("mapa")}
          >
            Mapa Mental
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === "docs" ? styles.tabButtonActive : ""}`}
            onClick={() => setActiveTab("docs")}
          >
            Documentação
          </button>
        </div>

        {activeTab === "operacional" && (
          <div className={styles.filterBar}>
          <button 
            className={`${styles.filterPill} ${filter === null ? styles.filterPillActive : ""}`}
            onClick={() => handleFilterClick(null)}
          >
            Todas
          </button>
          {InitiativeStatusArrayValues.map(s => (
            <button 
              key={s}
              className={`${styles.filterPill} ${filter === s ? styles.filterPillActive : ""}`}
              onClick={() => handleFilterClick(s)}
            >
              {statusMap[s].label}
            </button>
          ))}
        </div>
        )}
      </header>

      {activeTab === "operacional" && (
        <div className={styles.mainContainer}>
        {/* Left Panel - Master List */}
        <div className={styles.leftPanel}>
          {isCreating && (
            <CoreActInitiativeCreateForm 
              onSuccess={() => setIsCreating(false)} 
              onCancel={() => setIsCreating(false)} 
            />
          )}

          {error ? (
            <div className={styles.emptyState}>
              <p style={{ color: 'var(--color-muted-foreground)', fontSize: '0.9rem' }}>
                Não foi possível carregar as iniciativas. Verifique sua conexão e tente novamente.
              </p>
            </div>
          ) : isLoading ? (
            <div className={styles.listSkeleton}>
              {[1,2,3,4].map(i => (
                <Skeleton key={i} style={{ height: "80px", marginBottom: "var(--spacing-2)" }} />
              ))}
            </div>
          ) : data?.initiatives.length === 0 && !isCreating ? (
            <div className={styles.emptyState}>
              <p>Nenhuma iniciativa encontrada.</p>
            </div>
          ) : (
            <div className={styles.initiativeList}>
              {Object.entries(groupedInitiatives).map(([sector, initiativesInSector]) => {
                const isCollapsed = collapsedSectors.has(sector);
                return (
                  <div key={sector} className={styles.sectorGroup}>
                    <div 
                      className={`${styles.sectorHeader} ${!isCollapsed ? styles.sectorHeaderExpanded : ""}`}
                      onClick={() => toggleSector(sector)}
                    >
                      <ChevronRight size={14} className={styles.sectorHeaderIcon} />
                      <span>{sector}</span>
                      <span className={styles.sectorCount}>({initiativesInSector.length})</span>
                    </div>
                    {!isCollapsed && initiativesInSector.map((initiative) => {
                      const isSelected = selectedId === initiative.id;
                      return (
                        <div 
                          key={initiative.id} 
                          className={`${styles.listItem} ${isSelected ? styles.listItemSelected : ""}`}
                          onClick={() => {
                            setIsCreating(false);
                            setSelectedId(initiative.id);
                          }}
                        >
                          <div className={styles.listItemHeader}>
                            <Target size={16} className={styles.listItemIcon} />
                            <span className={styles.listItemName}>{initiative.name}</span>
                            <div style={{ display: 'flex', gap: 'var(--spacing-1)' }}>
                              {initiative.type && (
                                <Badge variant="outline" className={styles.listItemBadge} style={{ fontWeight: 'normal', opacity: 0.8 }}>
                                  {initiative.type}
                                </Badge>
                              )}
                              <Badge variant={statusMap[initiative.status as string]?.variant || "secondary"} className={styles.listItemBadge}>
                                {statusMap[initiative.status as string]?.label || initiative.status}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className={styles.listItemMeta}>
                            {initiative.projectCount || 0} projetos · {initiative.progressPercent || 0}% progresso
                          </div>
                          {initiative.sectorName && (
                            <div className={styles.listItemSector}>
                              <Building size={12} /> {initiative.sectorName}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Panel - Detail View */}
        <div className={styles.rightPanel}>
          {selectedInitiative ? (
            <CoreActInitiativeDetailPanel 
              initiative={selectedInitiative} 
              onDeleted={() => setSelectedId(null)}
            />
          ) : (
            <InitiativesAreaChart
              initiatives={data?.initiatives || []}
              teamMembers={teamData?.teamMembers || []}
              onInitiativeClick={(id) => {
                setSelectedId(id);
                setIsCreating(false);
              }}
              className={styles.areaChartFill}
            />
          )}
        </div>
      </div>
      )}

      {activeTab === "mapa" && (
        <React.Suspense fallback={<div className={styles.emptyState}>Carregando Motor Gráfico...</div>}>
          <CoreActInitiativeMindMap />
        </React.Suspense>
      )}

      {activeTab === "docs" && (
        <CoreActInitiativeDocs />
      )}
    </div>
  );
}