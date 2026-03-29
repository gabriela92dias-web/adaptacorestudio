import React, { useState } from "react";
import { usePermissions } from "../helpers/usePermissions";
import { PermissionWall } from "../components/PermissionWall";
import styles from "./coreact.acoes.module.css";
import { Activity, Plus, Check } from "lucide-react";

type ActionItem = {
  id: string;
  label: string;
  checked: boolean;
};

type ActionCard = {
  id: string;
  title: string;
  items: ActionItem[];
};

const MOCK_ACTIONS: ActionCard[] = [
  {
    id: "a1",
    title: "Revisão de Qualidade: Landing Page",
    items: [
      { id: "i1", label: "Verificar contraste de cores W3C.", checked: true },
      { id: "i2", label: "Testar responsividade em dispositivos mobile.", checked: true },
      { id: "i3", label: "Comprimir imagens WebP e SVG.", checked: false },
      { id: "i4", label: "Revisar cópia contra guidelines da marca.", checked: false },
    ]
  },
  {
    id: "a2",
    title: "Onboarding Novo Cliente",
    items: [
      { id: "i5", label: "Criar pasta no Drive.", checked: false },
      { id: "i6", label: "Enviar forms de briefing.", checked: false },
      { id: "i7", label: "Agendar kickoff meeting.", checked: false },
    ]
  }
];

export default function CoreactAcoes() {
  const { hasPermission } = usePermissions();
  const [cards, setCards] = useState<ActionCard[]>(MOCK_ACTIONS);
  const [clicksToday, setClicksToday] = useState(2); // Fake base value for demo

  if (!hasPermission("coreactAcoes")) {
    return <PermissionWall moduleName="Ações" />;
  }

  const toggleItem = (cardId: string, itemId: string) => {
    setCards(prevCards => 
      prevCards.map(c => {
        if (c.id === cardId) {
          return {
            ...c,
            items: c.items.map(i => {
              if (i.id === itemId) {
                const newChecked = !i.checked;
                // Add to tracker when checked
                if (newChecked) setClicksToday(prev => Math.min(prev + 1, 10));
                // Remove from tracker if unchecked (optional realism)
                else setClicksToday(prev => Math.max(prev - 1, 0));
                return { ...i, checked: newChecked };
              }
              return i;
            })
          };
        }
        return c;
      })
    );
  };

  // Matrix generation logic (7 days, 10 dots max height per day)
  const MAX_DOTS = 10;
  const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];
  // Fake weekly data structure: array of 7 integers (actions completed that day)
  const weeklyData = [4, 6, 2, 8, 5, 0, clicksToday]; 

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Ações & Lembretes</h1>
        <button style={{
          display: "flex", alignItems: "center", gap: "0.5rem",
          padding: "0.75rem 1.5rem", background: "var(--text-primary)", 
          color: "var(--bg-primary)", borderRadius: "999px",
          border: "none", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer"
        }}>
          <Plus size={16} /> Novo Checklist
        </button>
      </header>

      <div className={styles.layout}>
        {/* Left Column: Checklist Cards */}
        <div className={styles.cardsList}>
          {cards.map(card => {
            const totalItems = card.items.length;
            const completedItems = card.items.filter(i => i.checked).length;
            const isFullyCompleted = totalItems > 0 && completedItems === totalItems;

            return (
              <div key={card.id} className={`${styles.actionCard} ${isFullyCompleted ? styles.collapsed : ''}`}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)'}}>
                    {completedItems}/{totalItems}
                  </span>
                </div>

                <div className={styles.checklist}>
                  {card.items.map(item => (
                    <div 
                      key={item.id} 
                      className={styles.checklistItem}
                      onClick={() => toggleItem(card.id, item.id)}
                    >
                      <div className={`${styles.checkbox} ${item.checked ? styles.checked : ''}`}>
                        {item.checked && <Check size={14} />}
                      </div>
                      <span className={`${styles.itemLabel} ${item.checked ? styles.checked : ''}`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Tracker Widget */}
        <aside className={styles.trackerWidget}>
          <div className={styles.trackerHeader}>
            <div className={styles.trackerTitle}>
              <Activity size={20} /> Tracker
            </div>
            <div className={styles.trackerStats}>
              Esta semana
            </div>
          </div>

          <div className={styles.matrixGrid}>
            {weeklyData.map((actionsCount, dayIndex) => {
              // Generate array of 10 dots for each column (bottom-up is handled by flex-direction-reverse in CSS)
              const dots = Array.from({ length: MAX_DOTS }).map((_, dotIndex) => {
                const isActive = dotIndex < actionsCount;
                return (
                  <div key={dotIndex} className={`${styles.dot} ${isActive ? styles.active : ''}`} />
                );
              });

              return (
                <div key={dayIndex} className={styles.matrixCol}>
                  {dots}
                </div>
              );
            })}
          </div>
          
          <div className={styles.matrixLabels}>
            {days.map(day => <div key={day}>{day}</div>)}
          </div>
        </aside>
      </div>
    </div>
  );
}
