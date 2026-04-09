import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Megaphone, RefreshCw, Zap, Blocks, Activity, LayoutGrid, ArrowRight, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CriarCampanha } from "../components/brand-studio/criar-campanha";
import { useCampaigns } from "../helpers/useApi";
import styles from "./campanhas.module.css";

export default function Campanhas() {
  const { data, isLoading: loading, refetch } = useCampaigns();
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const campaigns = data?.campaigns || [];
  const totalAtivas = campaigns.filter(c => c.status === "active" || c.status === "approved").length;
  const totalRascunhos = campaigns.filter(c => c.status === "draft").length;

  return (
    <div className={styles.page}>
      <Helmet><title>CoreStudio | Campanhas V8</title></Helmet>

      {/* ── Header ── */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.iconBox}>
            <Megaphone size={22} />
          </div>
          <div>
            <h1 className={styles.title}>Campanhas</h1>
            <p className={styles.subtitle}>
              Gerencie o ciclo de vida e a governança das suas ativações V8.
            </p>
          </div>
        </div>

        <div className={styles.headerActions}>
          <button
            className={styles.refreshBtn}
            onClick={() => refetch()}
            disabled={loading}
            title="Atualizar lista"
          >
            <RefreshCw size={15} className={loading ? styles.spinning : ""} />
          </button>
          <button className={styles.newBtn} onClick={() => setIsCreating(true)}>
            <Plus size={15} />
            Nova Campanha
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><Megaphone size={18} /></div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Total de Campanhas</span>
            <span className={styles.statValue}>{campaigns.length}</span>
            <span className={styles.statHint}>Motor V8 ativo</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}><Activity size={18} /></div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Ativas / Aprovadas</span>
            <span className={styles.statValue}>{totalAtivas}</span>
            <span className={styles.statHint}>Em execução</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}><Zap size={18} /></div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Rascunhos</span>
            <span className={styles.statValue}>{totalRascunhos}</span>
            <span className={styles.statHint}>Requer governança</span>
          </div>
        </div>
      </div>

      {/* ── Campaign List ── */}
      {loading ? (
        <div className={styles.skeletonList}>
          {[1, 2, 3].map(i => <div key={i} className={styles.skeletonCard} />)}
        </div>
      ) : campaigns.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <LayoutGrid size={24} />
          </div>
          <div>
            <h2 className={styles.emptyTitle}>Nenhuma campanha registrada</h2>
            <p className={styles.emptyText}>
              Inicie o Motor V8 para desenhar o blueprint da sua primeira ativação estratégica.
            </p>
          </div>
          <button className={styles.emptyBtn} onClick={() => setIsCreating(true)}>
            <Zap size={15} />
            Abrir Construtor
          </button>
        </div>
      ) : (
        <>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <LayoutGrid size={16} />
              Todas as Campanhas
              <span className={styles.sectionCount}>{campaigns.length}</span>
            </h2>
          </div>

          <div className={styles.campaignList}>
            {campaigns.map((camp) => {
              const dateObj = new Date(camp.createdAt || "");
              const formattedDate = !isNaN(dateObj.getTime())
                ? new Intl.DateTimeFormat("pt-BR", {
                    day: "2-digit", month: "short", year: "numeric",
                  }).format(dateObj)
                : "Recente";

              const activeModsCount = camp.dna_modulos
                ? Object.values(camp.dna_modulos).filter(v => v === true).length
                : 0;

              const isDraft = camp.status === "draft";

              return (
                <div key={camp.id} className={styles.campaignCard}>
                  <div className={styles.campaignIcon}>
                    <Megaphone size={16} />
                  </div>

                  <div className={styles.campaignMain}>
                    <div className={styles.campaignNameRow}>
                      <span className={styles.campaignName}>
                        {camp.name || "Campanha sem título"}
                      </span>
                      {camp.type && (
                        <span className={styles.campaignBadge}>{camp.type}</span>
                      )}
                    </div>

                    <div className={styles.campaignMeta}>
                      {camp.dna_direcao && (
                        <span>
                          Direção:{" "}
                          <span className={styles.metaHighlight}>{camp.dna_direcao}</span>
                        </span>
                      )}
                      {camp.dna_experiencia && (
                        <span>
                          Exp.:{" "}
                          <span className={styles.metaHighlight}>{camp.dna_experiencia}</span>
                        </span>
                      )}
                      {camp.objective && (
                        <span style={{ maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {camp.objective}
                        </span>
                      )}
                      <span>{formattedDate}</span>
                    </div>
                  </div>

                  <div className={styles.campaignActions}>
                    <div className={styles.metaModules} style={{ display: "flex" }}>
                      <Blocks size={13} style={{ marginRight: 4 }} />
                      <span>{activeModsCount} módulos</span>
                    </div>

                    <span className={`${styles.statusBadge} ${isDraft ? styles.statusDraft : styles.statusPublished}`}>
                      {isDraft ? "Rascunho" : "Publicada"}
                    </span>

                    <button
                      className={styles.govBtn}
                      onClick={() => navigate("/coreact")}
                    >
                      Governança <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <CriarCampanha isOpen={isCreating} onClose={() => setIsCreating(false)} />
    </div>
  );
}