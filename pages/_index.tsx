import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { 
  Palette, 
  FileText, 
  Megaphone, 
  Settings, 
  ArrowRight, 
  LayoutDashboard, 
  Briefcase, 
  CheckSquare 
} from "lucide-react";
import { useAuth } from "../helpers/useAuth";
import { useProjects, useTasks } from "../helpers/useCoreActApi";
import { useAdaptiveLevel } from "../helpers/useAdaptiveLevel";
import { Skeleton } from "../components/Skeleton";
import { Button } from "../components/Button";
import styles from "./_index.module.css";

const MODULES = [
  {
    title: "Marketing & Comunicação",
    description: "Gere campanhas, posts e anúncios automatizados.",
    icon: Megaphone,
    path: "/marketing-comunicacao",
    active: true,
  },
  {
    title: "Documentos Corporativos",
    description: "Crie papéis, assinaturas de e-mail, fotos de perfil corporativas e design de embalagens.",
    icon: FileText,
    path: "/documentos-corporativos",
    active: true,
  },
  {
    title: "Identidade Visual",
    description: "Personalize logos, cores e elementos essenciais da sua marca.",
    icon: Palette,
    path: "/identidade-visual",
    active: true,
  },
  {
    title: "Brand Studio & Tools",
    description: "Gestão unificada da sua marca e ativos digitais e novos módulos.",
    icon: LayoutDashboard,
    path: "/tools",
    active: true,
  },
];

export default function Home() {
  const { authState } = useAuth();
  const { ref, level, className: adaptiveClass } = useAdaptiveLevel();
  
  const { data: projectsData, isLoading: isLoadingProjects } = useProjects();
  const { data: tasksData, isLoading: isLoadingTasks } = useTasks();

  const activeProjectsCount = projectsData?.projects.filter(p => p.status === 'active').length ?? 0;
  const activeTasksCount = tasksData?.tasks.filter(t => t.status === 'open' || t.status === 'in_progress').length ?? 0;
  
  const todayStr = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(new Date());

  if (authState.type === 'loading') {
    return (
      <div className={styles.container}>
        <Skeleton style={{ height: 60, maxWidth: 300 }} />
        <Skeleton style={{ height: 200 }} />
        <Skeleton style={{ height: 300 }} />
      </div>
    );
  }

  const userName = authState.type === 'authenticated' ? authState.user.displayName : 'Usuário';

  return (
    <>
      <Helmet>
        <title>Adapta Studio | Hub</title>
      </Helmet>

      <div ref={ref} className={`${styles.container} ${adaptiveClass} ${styles[`level${level}`]}`}>
        <header className={styles.header}>
          <h1 className={styles.title}>Boas-vindas, {userName}</h1>
          <p className={styles.subtitle}>{todayStr}</p>
        </header>

        <section className={styles.heroCard}>
          <div className={styles.heroContent}>
            <h2 className={styles.heroTitle}>CoreAct</h2>
            <p className={styles.heroDesc}>
              Gestão inteligente de projetos, tarefas, cronogramas e orçamentos para sua equipe.
            </p>
          </div>

          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <Briefcase size={20} className={styles.heroStatIcon} />
              <div>
                {isLoadingProjects ? (
                  <Skeleton style={{ width: 40, height: 24, backgroundColor: 'rgba(255,255,255,0.2)' }} />
                ) : (
                  <div className={styles.heroStatValue}>{activeProjectsCount}</div>
                )}
                <div className={styles.heroStatLabel}>Projetos ativos</div>
              </div>
            </div>
            
            <div className={styles.heroStat}>
              <CheckSquare size={20} className={styles.heroStatIcon} />
              <div>
                {isLoadingTasks ? (
                  <Skeleton style={{ width: 40, height: 24, backgroundColor: 'rgba(255,255,255,0.2)' }} />
                ) : (
                  <div className={styles.heroStatValue}>{activeTasksCount}</div>
                )}
                <div className={styles.heroStatLabel}>Tarefas em andamento</div>
              </div>
            </div>
          </div>

          <div className={styles.heroActions}>
            <Button asChild variant="secondary" size="lg">
              <Link to="/coreact">
                Acessar CoreAct <ArrowRight size={18} />
              </Link>
            </Button>
          </div>
        </section>

        <section className={styles.modulesSection}>
          <h2 className={styles.sectionTitle}>Módulos</h2>
          <div className={styles.grid}>
            {MODULES.map((mod, idx) => (
              mod.active ? (
                <Link key={idx} to={mod.path} className={styles.card}>
                  <div className={styles.cardIconWrapper}>
                    <mod.icon size={24} />
                  </div>
                  <h3 className={styles.cardTitle}>{mod.title}</h3>
                  <p className={styles.cardDescription}>{mod.description}</p>
                </Link>
              ) : (
                <div key={idx} className={`${styles.card} ${styles.cardDisabled}`}>
                  <div className={styles.cardIconWrapper}>
                    <mod.icon size={24} />
                  </div>
                  <h3 className={styles.cardTitle}>{mod.title}</h3>
                  <p className={styles.cardDescription}>{mod.description}</p>
                  <div className={styles.comingSoon}>Em breve</div>
                </div>
              )
            ))}
          </div>
        </section>

        <div className={styles.quickActions}>
          <Link to="/configuracoes" className={styles.actionLink}>
            <Settings size={16} /> Configurações
          </Link>
        </div>
      </div>
    </>
  );
}