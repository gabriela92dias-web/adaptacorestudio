import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Activity, LayoutGrid, Zap, Blocks, ArrowRight, Construction, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./campanhas.module.css";
import { Button } from "../components/Button";

interface V8Campaign {
  id: string;
  objetivo_primario: string;
  direcao: string;
  experiencia: string;
  segmento_publico: string;
  created_at: string;
  modulos?: any[];
  gates?: any[];
}

export default function Campanhas() {
  const [campaigns, setCampaigns] = useState<V8Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCampaigns = () => {
    setLoading(true);
    fetch("/_api/v8/list")
      .then(res => res.json())
      .then(data => {
        setCampaigns(data.campaigns || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return (
    <div className={styles.container}>
      <Helmet>
        <title>Central de Campanhas V8 | CoreStudio</title>
      </Helmet>

      {/* Hero Header Area */}
      <header className={styles.header}>
        <div className={styles.headerGlow} />
        <div className={styles.headerContent}>
          <div className={styles.titleWrapper}>
            <div className={styles.iconBox}>
              <Zap size={28} className={styles.titleIcon} />
            </div>
            <div>
              <h1 className={styles.title}>Motor de Campanhas V8</h1>
              <p className={styles.subtitle}>Gerencie o ciclo de vida, módulos e hard gates das suas ativações.</p>
            </div>
          </div>
          
          <div className={styles.actions}>
            <Button variant="outline" onClick={fetchCampaigns} className={styles.btnOutline}>
              <RefreshCw size={16} className={loading ? styles.spin : ""} />
            </Button>
            <Button onClick={() => navigate("/coreact")} className={styles.btnPrimary}>
              <Zap size={16} /> Construir Nova
            </Button>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <main className={styles.main}>
        {loading ? (
          <div className={styles.loadingGrid}>
            {[1, 2, 3].map(i => (
              <div key={i} className={styles.skeletonCard} />
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <div className={styles.emptyState}>
            <LayoutGrid size={64} className={styles.emptyIcon} />
            <h2>Nenhuma campanha ativa no Motor V8</h2>
            <p>Inicie o Coreact para desenhar seu primeiro escopo.</p>
            <Button onClick={() => navigate("/coreact")} className={styles.btnPrimaryLg}>
              Abrir Construtor
            </Button>
          </div>
        ) : (
          <div className={styles.grid}>
            {campaigns.map((camp) => {
              const dateObj = new Date(camp.created_at);
              const formattedDate = !isNaN(dateObj.getTime()) 
                ? new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(dateObj)
                : "Recente";

              const activeMods = (camp.modulos || []).filter(m => m.status === 'on').length;
              const pendingGates = (camp.gates || []).filter(g => !g.ok).length;
              const isReady = activeMods > 0 && pendingGates === 0 && (camp.modulos || []).every(m => m.status !== 'on' || m.ok);

              return (
                <article key={camp.id} className={styles.card}>
                  <div className={styles.cardGlow} />
                  
                  <div className={styles.cardHeader}>
                    <div>
                      <span className={styles.badgeLabel}>V8 NATIVE</span>
                      <h3 className={styles.campTitle}>{camp.objetivo_primario || "Campanha sem Título"}</h3>
                    </div>
                    <div className={styles.statusBadge} data-ready={isReady}>
                      {isReady ? "READY" : "BLOCKED"}
                    </div>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Direção</span>
                      <span className={styles.infoValue}>{camp.direcao || "---"}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Experiência</span>
                      <span className={styles.infoValue}>{camp.experiencia || "---"}</span>
                    </div>
                    
                    <div className={styles.metricsGrid}>
                      <div className={styles.metricBox}>
                        <Blocks size={16} />
                        <div>
                          <strong>{activeMods}</strong>
                          <span>Módulos Ativos</span>
                        </div>
                      </div>
                      <div className={styles.metricBox} data-alert={pendingGates > 0}>
                        <Activity size={16} />
                        <div>
                          <strong>{pendingGates}</strong>
                          <span>Gates Pendentes</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.cardFooter}>
                    <div className={styles.dateMeta}>Criado em {formattedDate}</div>
                    <button 
                      className={styles.dashboardBtn}
                      onClick={() => navigate('/v8-dashboard')}
                    >
                      HUD Dashboard <ArrowRight size={14} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}