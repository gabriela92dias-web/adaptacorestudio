import React from "react";
import { Briefcase, X } from "lucide-react";
import { Avatar, AvatarFallback } from "./Avatar";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { EmploymentType } from "../helpers/schema";
import styles from "./TeamKanbanBoard.module.css";

const getInitials = (name: string) => {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getEmploymentLabel = (type: string) => {
  switch (type as EmploymentType) {
    case "clt": return "CLT";
    case "contract_service": return "PJ";
    case "hourly_contractor": return "Horista";
    default: return type;
  }
};

const getEmploymentBadgeVariant = (type: string) => {
  switch (type as EmploymentType) {
    case "clt": return "primary";
    case "contract_service": return "secondary";
    case "hourly_contractor": return "outline";
    default: return "outline";
  }
};

export type MemberCardProps = {
  member: any;
  memberTeams?: { id: string; name: string }[];
  teamId?: string;
  isDragging?: boolean;
  onRemove?: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onClick?: () => void;
  variant?: "default" | "compact" | "micro";
};

export function MemberCard({
  member,
  memberTeams,
  teamId,
  isDragging,
  onRemove,
  onDragStart,
  onDragEnd,
  onClick,
  variant = "default",
}: MemberCardProps) {
  const initials = member.initials || getInitials(member.name);

  if (variant === "micro") {
    return (
      <div
        className={`${styles.cardMicro} ${isDragging ? styles.cardDragging : ""} ${onClick ? styles.cardClickable : ""}`}
        draggable
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onClick={onClick}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        title={member.name}
      >
        <span className={styles.cardMicroName}>{member.name}</span>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div
        className={`${styles.cardCompact} ${isDragging ? styles.cardDragging : ""} ${onClick ? styles.cardClickable : ""}`}
        draggable
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onClick={onClick}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
      >
        <Avatar className={styles.cardCompactAvatar}>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className={styles.cardCompactInfo}>
          <span className={styles.cardCompactName} title={member.name}>{member.name}</span>
          <span className={styles.cardCompactRole} title={member.role || "Membro"}>{member.role || "Membro"}</span>
        </div>
        <Badge variant={getEmploymentBadgeVariant(member.employmentType)} className={styles.cardCompactBadge}>
          {getEmploymentLabel(member.employmentType)}
        </Badge>
        {onRemove && (
          <Button
            variant="ghost"
            size="icon-sm"
            className={styles.removeBtn}
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            title="Remover do time"
          >
            <X size={12} />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`${styles.card} ${isDragging ? styles.cardDragging : ""} ${onClick ? styles.cardClickable : ""}`}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className={styles.cardHeader}>
        <Avatar className={styles.cardAvatar}>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className={styles.cardInfo}>
          <div className={styles.cardName} title={member.name}>{member.name}</div>
          <div className={styles.cardRole} title={member.role || "Membro"}>
            <Briefcase size={10} className={styles.cardIcon} />
            {member.role || "Membro"}
          </div>
        </div>
        {onRemove && (
          <Button
            variant="ghost"
            size="icon-sm"
            className={styles.removeBtn}
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            title="Remover do time"
          >
            <X size={14} />
          </Button>
        )}
      </div>
      <div className={styles.cardFooter}>
        <Badge variant={getEmploymentBadgeVariant(member.employmentType)} className={styles.employmentBadge}>
          {getEmploymentLabel(member.employmentType)}
        </Badge>
        {memberTeams && memberTeams.length > 0 && (
          <div className={styles.memberTeamBadges}>
            {memberTeams.map(t => (
              <Badge key={t.id} variant="secondary" className={styles.memberTeamBadge} title={t.name}>
                {t.name}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}