import React from "react";
import { BookOpen, Target, Folder, Layers, ListTodo, Zap, ShieldCheck, Flag } from "lucide-react";
import styles from "../pages/coreact.iniciativas.module.css";

export function CoreActInitiativeDocs() {
  return (
    <div className={styles.docsContainer}>
      <div style={{ maxWidth: "800px", margin: "0 auto", paddingBottom: "var(--spacing-10)" }}>
        
        <header style={{ marginBottom: "var(--spacing-8)", borderBottom: "1px solid var(--border)", paddingBottom: "var(--spacing-4)" }}>
          <h2 style={{ fontSize: "var(--font-size-3xl)", fontFamily: "var(--font-family-heading)", margin: "0 0 var(--spacing-2)", display: "flex", alignItems: "center", gap: "var(--spacing-3)" }}>
            <BookOpen size={28} color="var(--primary)" />
            Manual de Governança
          </h2>
          <p style={{ color: "var(--muted-foreground)", fontSize: "var(--font-size-lg)", margin: 0 }}>
            Entenda como a Adapta estrutura, prioriza e executa sua estratégia através do CoreAct.
          </p>
        </header>

        <section style={{ marginBottom: "var(--spacing-8)" }}>
          <h3 style={{ fontSize: "var(--font-size-xl)", fontWeight: 600, display: "flex", alignItems: "center", gap: "var(--spacing-2)", marginBottom: "var(--spacing-4)" }}>
            <Flag size={20} /> O Ciclo de Vida da Estratégia
          </h3>
          <div style={{ display: "grid", gap: "var(--spacing-4)" }}>
            {[
              {
                step: "1", title: "Iniciação (Setores & Iniciativas)", bg: "var(--surface)",
                desc: "Diretores definem os Setores de atuação e criam Iniciativas macro (ex: 'Novo LMS'). Estas são as grandes apostas trimestrais ou anuais da Adapta."
              },
              {
                step: "2", title: "Planejamento (Projetos & Etapas)", bg: "var(--background)",
                desc: "Líderes quebram as Iniciativas em Projetos concretos. Cada projeto é dividido em Etapas (Milestones) para balizar entregas mensais."
              },
              {
                step: "3", title: "Execução (Tarefas & Ações)", bg: "var(--surface)",
                desc: "A equipe de execução assume as Tarefas nas sprints semanais. As Tarefas contêm checklists de Ações menores, que alimentam o termômetro diário de progresso."
              },
              {
                step: "4", title: "Monitoramento & Encerramento", bg: "var(--background)",
                desc: "Liderança acompanha o avanço das barras de progresso (%) no Painel Operacional. Ao finalizar 100%, a Iniciativa vai para o estado de Concluída."
              }
            ].map(item => (
              <div key={item.step} style={{ 
                display: "flex", gap: "var(--spacing-4)", background: item.bg, 
                padding: "var(--spacing-4)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" 
              }}>
                <div style={{ 
                  width: 32, height: 32, borderRadius: "50%", background: "var(--primary)", color: "var(--primary-foreground)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flexShrink: 0
                }}>
                  {item.step}
                </div>
                <div>
                  <h4 style={{ margin: "0 0 var(--spacing-1)", fontSize: "var(--font-size-md)", fontWeight: 600 }}>{item.title}</h4>
                  <p style={{ margin: 0, color: "var(--muted-foreground)", fontSize: "var(--font-size-sm)", lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 style={{ fontSize: "var(--font-size-xl)", fontWeight: 600, display: "flex", alignItems: "center", gap: "var(--spacing-2)", marginBottom: "var(--spacing-4)" }}>
            <ShieldCheck size={20} /> Glossário Hierárquico
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "var(--spacing-4)" }}>
            {[
              { icon: Target, title: "Iniciativa", desc: "Agrupador macro (Big Bet). Não é executável e serve para organizar e prever orçamentos grandes." },
              { icon: Folder, title: "Projeto", desc: "Entrega com escopo, orçamento e prazo definidos. Ex: 'Desenvolvimento do Dashboard'." },
              { icon: Layers, title: "Etapa", desc: "Milestone de um projeto. Ponto de checagem. Ex: 'Design Finalizado'." },
              { icon: ListTodo, title: "Tarefa", desc: "Card de trabalho atribuído a alguém. Medido em horas ou dias (Sprint)." },
              { icon: Zap, title: "Ação", desc: "Item de checklist microscópico dentro de uma Tarefa." }
            ].map(term => {
              const Icon = term.icon;
              return (
                <div key={term.title} style={{ 
                  padding: "var(--spacing-4)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)",
                  background: "var(--surface)"
                }}>
                  <Icon size={24} color="var(--primary)" style={{ marginBottom: "var(--spacing-2)" }} />
                  <h4 style={{ margin: "0 0 var(--spacing-1)", fontWeight: 600 }}>{term.title}</h4>
                  <p style={{ margin: 0, fontSize: "var(--font-size-sm)", color: "var(--muted-foreground)" }}>{term.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}
