import React, { useEffect, useMemo } from "react";
import {
  useProjectChecklist,
  useSeedProjectChecklist,
  useToggleChecklistItem,
} from "../helpers/useProjectChecklist";
import { useMyRole } from "../helpers/useSectorMembers";
import { useAdaptiveLevel } from "../helpers/useAdaptiveLevel";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./Accordion";
import { Checkbox } from "./Checkbox";
import { Progress } from "./Progress";
import { Skeleton } from "./Skeleton";
import { ProjectChecklistItems } from "../helpers/schema";
import { Selectable } from "kysely";
import styles from "./ProjectChecklistPanel.module.css";

export interface ProjectChecklistPanelProps {
  projectId: string;
  className?: string;
}

export const ProjectChecklistPanel: React.FC<ProjectChecklistPanelProps> = ({
  projectId,
  className,
}) => {
  const { data, isLoading, isError } = useProjectChecklist(projectId);
  const { mutate: seed, isPending: isSeeding } = useSeedProjectChecklist();
  const { mutate: toggle } = useToggleChecklistItem();
  const { data: roleData } = useMyRole();

  const items = data?.checklistItems || [];

  // Seed checklist if empty on first load
  useEffect(() => {
    if (data && items.length === 0 && !isSeeding) {
      seed({ projectId });
    }
  }, [data, items.length, isSeeding, projectId, seed]);

  // Group items by categoryKey
  const groupedItems = useMemo(() => {
    return items.reduce((acc, item) => {
      if (!acc[item.categoryKey]) {
        acc[item.categoryKey] = [];
      }
      acc[item.categoryKey].push(item);
      return acc;
    }, {} as Record<string, Selectable<ProjectChecklistItems>[]>);
  }, [items]);

  const categories = Object.entries(groupedItems).sort((a, b) => {
    // Basic sorting to keep sections stable. Could use sortOrder if we aggregated it.
    return a[0].localeCompare(b[0]);
  });

  // Calculate overall progress
  const totalItems = items.length;
  const completedItems = items.filter((i) => i.isCompleted).length;
  const overallProgress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  // Setup adaptive level for zero-scroll sovereignty
  const { ref: containerRef, level, className: adaptiveClass } = useAdaptiveLevel({
    itemCount: totalItems,
    maxPerGroup: Math.max(...categories.map(([, group]) => group.length), 0),
  });

  const handleToggle = (item: Selectable<ProjectChecklistItems>) => {
    toggle({
      id: item.id,
      isCompleted: !item.isCompleted,
      completedBy: roleData?.teamMemberId || null,
    });
  };

  if (isLoading || isSeeding) {
    return (
      <div className={`${styles.container} ${className || ""}`}>
        <div className={styles.header}>
          <Skeleton className={styles.skeletonTitle} />
          <Skeleton className={styles.skeletonProgress} />
        </div>
        <div className={styles.accordionWrapper}>
          <Skeleton className={styles.skeletonAccordionItem} />
          <Skeleton className={styles.skeletonAccordionItem} />
          <Skeleton className={styles.skeletonAccordionItem} />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`${styles.container} ${styles.error} ${className || ""}`}>
        <p>Não foi possível carregar o checklist.</p>
      </div>
    );
  }

  if (categories.length === 0) {
    // Empty state (should rarely happen due to seeding, but good to handle)
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`
        ${styles.container} 
        ${styles[`level${level}`]} 
        ${adaptiveClass} 
        ${className || ""}
      `}
    >
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h3 className={styles.title}>Checklist</h3>
          <span className={styles.counter}>
            {completedItems}/{totalItems} concluídos
          </span>
        </div>
        <Progress value={overallProgress} className={styles.mainProgress} />
      </div>

      <div className={styles.accordionWrapper}>
        <Accordion type="single" collapsible className={styles.accordion}>
          {categories.map(([categoryKey, categoryItems]) => {
            if (categoryItems.length === 0) return null; // Design rule: empty sections collapse/hide

            const catTotal = categoryItems.length;
            const catCompleted = categoryItems.filter((i) => i.isCompleted).length;
            const catProgress = catTotal > 0 ? (catCompleted / catTotal) * 100 : 0;

            // Sort items within category by their sortOrder
            const sortedItems = [...categoryItems].sort((a, b) => a.sortOrder - b.sortOrder);

            return (
              <AccordionItem
                key={categoryKey}
                value={categoryKey}
                className={styles.accordionItem}
              >
                <AccordionTrigger className={styles.accordionTrigger}>
                  <div className={styles.triggerContent}>
                    <span className={styles.categoryTitle}>{categoryKey}</span>
                    <div className={styles.categoryStats}>
                      <span className={styles.categoryCounter}>
                        {catCompleted}/{catTotal}
                      </span>
                      <Progress
                        value={catProgress}
                        className={styles.miniProgress}
                      />
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className={styles.accordionContent}>
                  <div className={styles.itemList}>
                    {sortedItems.map((item) => (
                      <label
                        key={item.id}
                        className={`${styles.itemRow} ${
                          item.isCompleted ? styles.itemCompleted : ""
                        }`}
                      >
                        <Checkbox
                          checked={item.isCompleted}
                          onChange={() => handleToggle(item)}
                          className={styles.checkbox}
                        />
                        <span className={styles.itemTitle}>{item.title}</span>
                      </label>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
};