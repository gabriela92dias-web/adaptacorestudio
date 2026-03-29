/**
 * ═══════════════════════════════════════════════════════════════
 * REGRAS DE LAYOUT — CLÁUSULA PÉTREA (NÃO MODIFICAR SEM APROVAÇÃO)
 * ═══════════════════════════════════════════════════════════════
 * 1. ZERO SCROLL — Nenhum overflow-x/y: auto/scroll em NENHUM container.
 *    Board, painéis, sectorsContainer: height: 100% + overflow: hidden.
 * 2. SINGLE EXPAND — Apenas UM setor expandido por vez no painel esquerdo.
 *    Expandir um setor deve colapsar o anterior automaticamente.
 * 3. LEFT PANEL — Largura auto (shrink-to-fit), NUNCA percentual fixo.
 *    Colunas colapsadas: max 2.5rem. Gap: spacing-2.
 * 4. RIGHT PANEL — overflow: hidden. Conteúdo que excede deve ser
 *    reestruturado (tabs, sheets), NUNCA scroll.
 * 5. Se conteúdo excede espaço visível → REESTRUTURAR, nunca scroll.
 * ═══════════════════════════════════════════════════════════════
 */
import React, { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Edit,
  Plus,
  Trash,
  Target,
  FolderOpen,
  Layers,
  CheckSquare,
  Users,
  X,
  ChevronRight,
  ChevronDown
} from "lucide-react";

import {
  useCreateCoreactTeamGroupMember,
  useDeleteCoreactTeamGroupMember,
  useTeamMembers,
} from "../helpers/useCoreActApi";
import { useSectors } from "../helpers/useSectors";
import { useSectorMembers } from "../helpers/useSectorMembers";
import { useCoreactTeamsContexts } from "../helpers/useCoreactTeamsContexts";
import { getSectorSortWeight, getSectorIcon } from "../helpers/getSectorIcon";
import { useAdaptiveLevel } from "../helpers/useAdaptiveLevel";

import { Badge } from "./Badge";
import { Button } from "./Button";
import { Skeleton } from "./Skeleton";

import { MemberCard } from "./TeamKanbanBoardMemberCard";
import { EditTeamModal, DeleteTeamModal } from "./TeamKanbanBoardModals";
import styles from "./TeamKanbanBoard.module.css";

type DraggedItem = {
  memberId: string;
  sourceTeamId?: string;
};

type ActivePanel = 'equipes' | 'times';

const getEntityIcon = (entityType: string) => {
  switch (entityType) {
    case "initiative": return <Target size={12} />;
    case "project": return <FolderOpen size={12} />;
    case "stage": return <Layers size={12} />;
    case "task": return <CheckSquare size={12} />;
    default: return <Target size={12} />;
  }
};

const getEntityLabel = (entityType: string) => {
  switch (entityType) {
    case "initiative": return "Iniciativa";
    case "project": return "Projeto";
    case "stage": return "Etapa";
    case "task": return "Tarefa";
    default: return "Entidade";
  }
};

const getInitials = (name: string) => {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export function TeamKanbanBoard({ onMemberClick }: { onMemberClick?: (memberId: string) => void }) {
  const { data: teamsData, isLoading: isTeamsLoading } = useCoreactTeamsContexts();
  const { data: membersData, isLoading: isMembersLoading } = useTeamMembers();
  const { data: sectorsData, isLoading: isSectorsLoading } = useSectors();
  const { data: sectorMembersData, isLoading: isSectorMembersLoading } = useSectorMembers();

  const addMemberMutation = useCreateCoreactTeamGroupMember();
  const removeMemberMutation = useDeleteCoreactTeamGroupMember();

  const [activePanel, setActivePanel] = useState<ActivePanel>('equipes');
  const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const [editingTeam, setEditingTeam] = useState<{ id: string; name: string; sectorId?: string | null } | null>(null);
  const [deletingTeam, setDeletingTeam] = useState<{ id: string; name: string } | null>(null);

  const [expandedSector, setExpandedSector] = useState<string | null>(null);
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);

  const teams = teamsData?.teams || [];
  const allMembers = membersData?.teamMembers || [];
  const sectors = sectorsData || [];
  const sectorMembers = sectorMembersData || [];

  const sortedSectors = useMemo(() => {
    return [...sectors].sort((a, b) => getSectorSortWeight(a.name) - getSectorSortWeight(b.name));
  }, [sectors]);

  const membersMap = useMemo(() => {
    return new Map(allMembers.map((m) => [m.id, m]));
  }, [allMembers]);

  const membersBySector = useMemo(() => {
    const map = new Map<string, typeof allMembers>();
    sectorMembers.forEach(sm => {
      const list = map.get(sm.sectorId) || [];
      const fullMember = membersMap.get(sm.memberId);
      if (fullMember && !list.some(m => m.id === fullMember.id)) {
        list.push(fullMember);
      }
      map.set(sm.sectorId, list);
    });
    return map;
  }, [sectorMembers, membersMap]);

  const membersWithoutSector = useMemo(() => {
    const membersWithSectorIds = new Set(sectorMembers.map(sm => sm.memberId));
    return allMembers.filter(m => !membersWithSectorIds.has(m.id));
  }, [allMembers, sectorMembers]);

  const activeItemCount = useMemo(() => {
    return activePanel === 'equipes'
      ? sortedSectors.length + (membersWithoutSector.length > 0 ? 1 : 0)
      : teams.length;
  }, [activePanel, sortedSectors.length, membersWithoutSector.length, teams.length]);

  const activeMaxPerGroup = useMemo(() => {
    if (activePanel === 'equipes') {
      const sectorCounts = Array.from(membersBySector.values()).map(m => m.length);
      return Math.max(0, membersWithoutSector.length, ...sectorCounts);
    }
    return Math.max(0, ...teams.map(t => t.members.length));
  }, [activePanel, membersWithoutSector.length, membersBySector, teams]);

  const { ref, level } = useAdaptiveLevel({
    itemCount: activeItemCount,
    maxPerGroup: activeMaxPerGroup
  });

  const handleDragStart = useCallback((e: React.DragEvent, memberId: string, sourceTeamId?: string) => {
    const payload = JSON.stringify({ memberId, sourceTeamId });
    e.dataTransfer.setData("application/json", payload);
    e.dataTransfer.effectAllowed = "move";
    setDraggedItem({ memberId, sourceTeamId });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, teamId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(teamId);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverColumn(null);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetTeamId: string) => {
      e.preventDefault();
      setDragOverColumn(null);
      setDraggedItem(null);

      try {
        const payload = e.dataTransfer.getData("application/json");
        if (!payload) return;

        const { memberId } = JSON.parse(payload) as DraggedItem;

        const targetTeam = teams.find((t) => t.id === targetTeamId);
        if (targetTeam && !targetTeam.members.some((m) => m.id === memberId)) {
          addMemberMutation.mutate({ teamId: targetTeamId, memberId });
          toast.success(`Membro adicionado ao time ${targetTeam.name}`);
        } else if (targetTeam) {
          toast.info(`Membro já está no time ${targetTeam.name}`);
        }
      } catch (err) {
        console.error("Failed to parse drag payload", err);
      }
    },
    [addMemberMutation, teams]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
    setDragOverColumn(null);
  }, []);

  const isLoading = isTeamsLoading || isMembersLoading || isSectorsLoading || isSectorMembersLoading;

  if (isLoading) {
    return (
      <div ref={ref} className={`${styles.board} ${styles[`level${level}`]}`}>
        <div className={`${styles.leftPanel} ${styles.panelActive}`}>
          <Skeleton className={styles.skeletonHeader} />
          <Skeleton className={styles.skeletonCard} />
        </div>
        <div className={`${styles.rightPanel} ${styles.panelInactive}`}>
          <Skeleton className={styles.skeletonHeader} />
          <Skeleton className={styles.skeletonCard} />
        </div>
      </div>
    );
  }

  return (
    <>
      <div ref={ref} className={`${styles.board} ${styles[`level${level}`]}`}>
        {/* Left Panel: Equipes */}
        <div className={`${styles.leftPanel} ${activePanel === 'equipes' ? styles.panelActive : styles.panelInactive}`}>
          <div 
            className={`${styles.panelHeader} ${activePanel !== 'equipes' ? styles.clickableHeader : ''}`}
            onClick={() => setActivePanel('equipes')}
          >
            <div>
              <h2 className={styles.panelTitle}>Equipes</h2>
              {activePanel === 'equipes' && (
                <p className={styles.panelDescription}>Acione membros externos ou permanentes</p>
              )}
            </div>
          </div>

          {activePanel === 'equipes' ? (
            <div className={styles.sectorsContainer}>
              {sortedSectors.map((sector, idx) => {
                const sectorMems = membersBySector.get(sector.id) || [];
                const isExpanded = expandedSector === sector.id;

                return (
                  <div 
                    key={sector.id} 
                    className={`${styles.sectorColumn} ${isExpanded ? styles.sectorColumnExpanded : styles.sectorColumnCollapsed}`}
                    onClick={() => setExpandedSector(isExpanded ? null : sector.id)}
                    title={level >= 2 ? sector.name : undefined}
                  >
                    <div className={styles.sectorColumnHeader}>
                      {(() => { const Icon = getSectorIcon(sector.name, idx); return <Icon size={14} />; })()}
                    </div>
                    
                    {isExpanded ? (
                      <div className={styles.expandedMemberList}>
                        {sectorMems.length === 0 && <div className={styles.emptyState}>Nenhum membro</div>}
                        {sectorMems.map((member) => (
                          <MemberCard
                            key={`sector-${sector.id}-${member.id}`}
                            member={member}
                            variant="micro"
                            isDragging={draggedItem?.memberId === member.id && draggedItem?.sourceTeamId === `sector-${sector.id}`}
                            onDragStart={(e) => handleDragStart(e, member.id, `sector-${sector.id}`)}
                            onDragEnd={handleDragEnd}
                            onClick={() => onMemberClick?.(member.id)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className={styles.collapsedMemberList}>
                        {sectorMems.map(member => (
                          <div
                            key={`collapsed-${member.id}`}
                            className={`${styles.memberNameBlock} ${draggedItem?.memberId === member.id ? styles.memberDragging : ""}`}
                            draggable
                            onDragStart={(e) => handleDragStart(e, member.id, `sector-${sector.id}`)}
                            onDragEnd={handleDragEnd}
                            onClick={(e) => { e.stopPropagation(); onMemberClick?.(member.id); }}
                            title={member.name}
                          >
                            {level >= 2 ? (member.initials || getInitials(member.name).substring(0, 2)) : member.name.split(' ')[0]}
                          </div>
                        ))}
                      </div>
                    )}

                    {level < 2 && (
                      <div className={styles.sectorColumnFooter}>
                        <span className={styles.sectorNameVertical}>{sector.name}</span>
                      </div>
                    )}
                  </div>
                );
              })}

              {membersWithoutSector.length > 0 && (
                <div 
                  className={`${styles.sectorColumn} ${expandedSector === 'sem-setor' ? styles.sectorColumnExpanded : styles.sectorColumnCollapsed}`}
                  onClick={() => setExpandedSector(expandedSector === 'sem-setor' ? null : 'sem-setor')}
                  title={level >= 2 ? "Sem Setor" : undefined}
                >
                  <div className={styles.sectorColumnHeader}>
                    <Users size={14} />
                  </div>
                  
                  {expandedSector === 'sem-setor' ? (
                    <div className={styles.expandedMemberList}>
                      {membersWithoutSector.map((member) => (
                        <MemberCard
                          key={`no-sector-${member.id}`}
                          member={member}
                          variant="micro"
                          isDragging={draggedItem?.memberId === member.id && !draggedItem?.sourceTeamId}
                          onDragStart={(e) => handleDragStart(e, member.id)}
                          onDragEnd={handleDragEnd}
                          onClick={() => onMemberClick?.(member.id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className={styles.collapsedMemberList}>
                      {membersWithoutSector.map(member => (
                        <div
                          key={`collapsed-no-sector-${member.id}`}
                          className={`${styles.memberNameBlock} ${draggedItem?.memberId === member.id ? styles.memberDragging : ""}`}
                          draggable
                          onDragStart={(e) => handleDragStart(e, member.id)}
                          onDragEnd={handleDragEnd}
                          onClick={(e) => { e.stopPropagation(); onMemberClick?.(member.id); }}
                          title={member.name}
                        >
                          {level >= 2 ? (member.initials || getInitials(member.name).substring(0, 2)) : member.name.split(' ')[0]}
                        </div>
                      ))}
                    </div>
                  )}

                  {level < 2 && (
                    <div className={styles.sectorColumnFooter}>
                      <span className={styles.sectorNameVertical}>Sem Setor</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className={styles.inactiveList}>
              {sortedSectors.map((sector, idx) => {
                const sectorMems = membersBySector.get(sector.id) || [];
                const Icon = getSectorIcon(sector.name, idx);
                return (
                  <div key={sector.id} className={styles.inactiveItem}>
                    <div className={styles.inactiveItemLeft}>
                      <Icon size={14} className={styles.inactiveItemIcon} />
                      <span className={styles.inactiveItemName}>{sector.name}</span>
                    </div>
                    <Badge variant="secondary" className={styles.inactiveItemBadge}>{sectorMems.length}</Badge>
                  </div>
                );
              })}
              {membersWithoutSector.length > 0 && (
                <div className={styles.inactiveItem}>
                  <div className={styles.inactiveItemLeft}>
                    <Users size={14} className={styles.inactiveItemIcon} />
                    <span className={styles.inactiveItemName}>Sem Setor</span>
                  </div>
                  <Badge variant="secondary" className={styles.inactiveItemBadge}>{membersWithoutSector.length}</Badge>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Panel: Times */}
        <div 
          className={`${styles.rightPanel} ${activePanel === 'times' ? styles.panelActive : styles.panelInactive} ${draggedItem ? styles.rightPanelDragActive : ''}`}
          onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }}
          onDrop={(e) => {
            if (teams.length > 0) {
              handleDrop(e, teams[0].id);
            }
          }}
        >
          <div 
            className={`${styles.panelHeader} ${activePanel !== 'times' ? styles.clickableHeader : ''}`}
            onClick={() => setActivePanel('times')}
          >
            <div>
              <h2 className={styles.panelTitle}>Times</h2>
              {activePanel === 'times' && (
                <p className={styles.panelDescription}>Arraste membros para compor times estratégicos</p>
              )}
            </div>
          </div>

          <div className={styles.teamsList}>
            {teams.length === 0 && (
              <div className={styles.emptyState}>
                Nenhum time. Crie para começar.
              </div>
            )}
            
            {teams.map((team) => {
              const firstContext = team.contexts?.[0];
              const isExpanded = expandedTeam === team.id;
              return (
                <div 
                  key={team.id}
                  className={`${styles.teamRow} ${isExpanded ? styles.teamRowExpanded : ""} ${dragOverColumn === team.id ? styles.teamRowDropTarget : ""} ${draggedItem && dragOverColumn !== team.id ? styles.teamRowDroppable : ""}`}
                  onDragOver={(e) => handleDragOver(e, team.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, team.id)}
                >
                  <div className={styles.teamRowHeader} onClick={() => setExpandedTeam(isExpanded ? null : team.id)}>
                    <div className={styles.teamRowInfo}>
                      <div className={styles.teamHeaderGroup}>
                        {isExpanded ? <ChevronDown size={14} className={styles.teamChevron} /> : <ChevronRight size={14} className={styles.teamChevron} />}
                        <span className={styles.teamName}>{team.name}</span>
                        {level < 3 && firstContext && (
                          <Badge variant="secondary" className={styles.contextBadge}>
                            {getEntityIcon(firstContext.entityType)}
                            <span className={styles.contextBadgeText}>{getEntityLabel(firstContext.entityType)}: {firstContext.entityName}</span>
                          </Badge>
                        )}
                      </div>
                    </div>
                                        {draggedItem ? (
                      <div className={styles.dropHint}>Solte aqui</div>
                    ) : activePanel === 'times' ? (
                      <div className={styles.teamRowActions}>
                        <Button 
                          variant="ghost" 
                          size="icon-sm"
                          onClick={(e) => { e.stopPropagation(); setEditingTeam({ id: team.id, name: team.name, sectorId: team.sectorId }); }}
                        >
                          <Edit size={12} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon-sm"
                          className={styles.actionBtnHoverDestructive}
                          onClick={(e) => { e.stopPropagation(); setDeletingTeam({ id: team.id, name: team.name }); }}
                        >
                          <Trash size={12} />
                        </Button>
                      </div>
                    ) : null}
                  </div>
                  
                  {isExpanded && (
                    <div className={styles.teamMembersContent}>
                      {team.members.length === 0 ? (
                        <div className={styles.noTeamsMessage}>Arraste membros para cá</div>
                      ) : (
                        <div className={styles.teamMembersList}>
                          {team.members.map(member => (
                            <div 
                              key={member.id} 
                              className={styles.teamMemberRow}
                              draggable
                              onDragStart={(e) => handleDragStart(e, member.id, team.id)}
                              onDragEnd={handleDragEnd}
                            >
                              <span className={styles.teamMemberName}>
                                {member.name}
                              </span>
                              <Button 
                                variant="ghost" 
                                size="icon-sm" 
                                className={styles.teamMemberRemove}
                                draggable={false}
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeMemberMutation.mutate({ teamId: team.id, memberId: member.id });
                                }}
                              >
                                <X size={12} />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditTeamModal 
        team={editingTeam} 
        open={!!editingTeam} 
        onOpenChange={(isOpen) => !isOpen && setEditingTeam(null)} 
        sectors={sectors} 
      />
      
      <DeleteTeamModal 
        team={deletingTeam} 
        open={!!deletingTeam} 
        onOpenChange={(isOpen) => !isOpen && setDeletingTeam(null)} 
      />
    </>
  );
}