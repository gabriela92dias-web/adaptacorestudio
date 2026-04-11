import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  Palette,
  Megaphone,
  Wrench,
  Globe,
  BookOpen,
  Settings,
  Sparkles
} from "lucide-react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { Button } from "./Button";
import { Badge } from "./Badge";
import { Avatar, AvatarFallback, AvatarImage } from "./Avatar";
import { Skeleton } from "./Skeleton";
import { ThemeModeSwitch } from "./ThemeModeSwitch";
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";
import { useAuth } from "../helpers/useAuth";
import { useGoogleTranslate } from "../helpers/useTranslation";
import { usePermissions } from "../helpers/usePermissions";
import { CoreactHelpModal } from "./CoreactHelpModal";
import { toast } from "sonner";

/* ─── tipos ─────────────────────────────────────────── */
type NavSubItem = {
  label: string;
  path?: string;
  disabled?: boolean;
  badge?: {
    text: string;
    variant: "primary" | "secondary" | "outline" | "destructive" | "warning" | "success";
    color?: string;
  };
};

type NavGroup = {
  id: string;
  label: string;
  icon: React.ElementType;
  path?: string;
  subItems?: NavSubItem[];
};

/* ─── constantes de layout ───────────────────────────── */
const SIDEBAR_EXPANDED  = "16rem";
const SIDEBAR_COLLAPSED = "3.5rem";
const BREAKPOINT_LG     = 1024; // px — canônico da Regra #2

/* ─── estilos inline via ColdFlora tokens ────────────── */
// Usamos style objects para valores dinâmicos e className para estrutura estática.
// Nenhuma classe Tailwind hardcoded. Sem CSS Module.

const S = {
  sidebar: (collapsed: boolean, isMobileDrawerOpen: boolean): React.CSSProperties => ({
    width: collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED,
    height: "100dvh",               // dvh: respeita teclado mobile (Regra #2)
    backgroundColor: "var(--sidebar)",
    borderRight: "1px solid var(--border)",
    display: "flex",
    flexDirection: "column",
    transition: "width var(--animation-duration-normal) cubic-bezier(0.2,0,0,1), transform var(--animation-duration-normal) cubic-bezier(0.2,0,0,1)",
    flexShrink: 0,
    zIndex: 50,
    color: "var(--sidebar-foreground)",
    // Em mobile: sidebar vira drawer posicionado
    position: "relative" as const,
  }),

  // Overlay escuro atrás do drawer em mobile
  overlay: {
    position: "fixed" as const,
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 49,
    backdropFilter: "blur(2px)",
  },

  header: (collapsed: boolean): React.CSSProperties => ({
    height: "4.5rem",
    minHeight: "4.5rem",
    display: "flex",
    alignItems: "center",
    padding: collapsed ? "0" : "0 var(--spacing-4)",
    justifyContent: collapsed ? "center" : "flex-start",
    borderBottom: "1px solid var(--border)",
    overflow: "hidden",
    flexShrink: 0,
  }),

  logo: (collapsed: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    gap: collapsed ? 0 : "var(--spacing-3)",
    color: "var(--foreground)",
    textDecoration: "none",
    whiteSpace: "nowrap",
    justifyContent: collapsed ? "center" : "flex-start",
  }),

  scrollArea: {
    flex: 1,
    overflowY: "auto" as const,
    overflowX: "hidden" as const,
    padding: "var(--spacing-5) var(--spacing-3)",
  },

  sectionLabel: {
    fontSize: "var(--font-size-2xs)",
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
    color: "var(--muted-foreground)",
    marginBottom: "var(--spacing-3)",
    padding: "0 var(--spacing-3)",
  },

  navContainer: (collapsed: boolean): React.CSSProperties => ({
    display: "flex",
    flexDirection: "column",
    gap: collapsed ? "2px" : "var(--spacing-1)",
    alignItems: collapsed ? "center" : "stretch",
  }),

  navItem: (collapsed: boolean, active: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    justifyContent: collapsed ? "center" : "space-between",
    width: collapsed ? "2.25rem" : "100%",
    minHeight: "2.75rem",               // ≥44px touch target (Regra #2)
    padding: collapsed ? 0 : "var(--spacing-3)",
    background: active
      ? "color-mix(in srgb, var(--foreground) 5%, transparent)"
      : "transparent",
    border: "none",
    borderLeft: collapsed ? "none" : `2px solid ${active ? "var(--primary)" : "transparent"}`,
    borderRadius: collapsed ? "var(--radius-md)" : "var(--radius-sm)",
    color: "var(--sidebar-foreground)",
    textDecoration: "none",
    transition: "all var(--animation-duration-fast) ease",
    cursor: "pointer",
    whiteSpace: "nowrap",
    fontWeight: active ? 600 : 400,
    position: "relative" as const,
    margin: collapsed ? "0 auto" : undefined,
  }),

  groupTriggerInner: {
    display: "flex",
    alignItems: "center",
    gap: "var(--spacing-3)",
  },

  chevron: (open: boolean): React.CSSProperties => ({
    transition: "transform var(--animation-duration-normal) ease",
    opacity: 0.7,
    transform: open ? "rotate(180deg)" : "rotate(0deg)",
  }),

  subItemsContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "2px",
    padding: "var(--spacing-1) 0 var(--spacing-1) var(--spacing-8)",
    position: "relative" as const,
  },

  subItem: (active: boolean, disabled: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: "2.75rem",              // ≥44px touch target (Regra #2)
    padding: "var(--spacing-2) var(--spacing-3)",
    color: active ? "var(--foreground)" : "var(--sidebar-foreground)",
    textDecoration: "none",
    borderRadius: "var(--radius-sm)",
    transition: "all var(--animation-duration-fast) ease",
    fontSize: "var(--font-size-base)",
    gap: "var(--spacing-2)",
    borderLeft: `2px solid ${active ? "var(--primary)" : "transparent"}`,
    fontWeight: active ? 500 : 400,
    background: active ? "color-mix(in srgb, var(--foreground) 5%, transparent)" : "transparent",
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? "not-allowed" : "pointer",
  }),

  footer: (collapsed: boolean): React.CSSProperties => ({
    padding: collapsed ? "var(--spacing-3) 0" : "var(--spacing-4) var(--spacing-3)",
    borderTop: "1px solid var(--border)",
    display: "flex",
    flexDirection: "column",
    gap: collapsed ? "var(--spacing-2)" : "var(--spacing-4)",
    backgroundColor: "var(--sidebar)",
    alignItems: collapsed ? "center" : "stretch",
  }),

  iconBar: (collapsed: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    justifyContent: collapsed ? "center" : "space-between",
    flexDirection: collapsed ? "column" : "row",
    gap: collapsed ? "4px" : undefined,
    padding: collapsed ? 0 : "0 var(--spacing-1)",
  }),

  collapseButton: (collapsed: boolean): React.CSSProperties => ({
    width: collapsed ? "2rem" : "100%",
    height: "2rem",
    minHeight: "2rem",
    padding: 0,
    border: collapsed ? "none" : "1px solid var(--border)",
    borderRadius: collapsed ? "var(--radius-full)" : "var(--radius-sm)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: collapsed ? "0 auto" : undefined,
    background: "transparent",
    color: "var(--sidebar-foreground)",
    cursor: "pointer",
    transition: "all var(--animation-duration-fast) ease",
  }),
};

/* ─── componente ─────────────────────────────────────── */
export const AppSidebar = () => {
  const [isCollapsed, setIsCollapsed]         = useState(false);
  const [isMobile, setIsMobile]               = useState(false);
  const [mobileOpen, setMobileOpen]           = useState(false);
  const { authState }                         = useAuth();
  const location                              = useLocation();
  const { locale, setLocale }                 = useGoogleTranslate();
  const { hasPermission }                     = usePermissions();
  const sidebarRef                            = useRef<HTMLElement>(null);
  const [openGroups, setOpenGroups]           = useState<Record<string, boolean>>({});

  /* ── responsividade (Regra #2) ── */
  useEffect(() => {
    const update = () => {
      const mobile = window.innerWidth < BREAKPOINT_LG;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
        setMobileOpen(false);
      } else {
        setIsCollapsed(window.innerWidth < 1280);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* ── fechar drawer ao clicar fora ── */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | PointerEvent) => {
      const path = event.composedPath();
      const target = event.target as Element;
      if (!target) return;

      const isPortalClick = path.some((node) => {
        if (node instanceof Element) {
          return (
            node.matches("[data-radix-popper-content-wrapper], [data-radix-menu-content], [data-radix-dropdown-menu-content], [role='menu'], [role='dialog'], [role='tooltip'], [data-state='open']") ||
            node.closest("[data-radix-dropdown-menu-trigger]") !== null
          );
        }
        return false;
      });
      if (isPortalClick) return;

      // Mobile: fechar drawer
      if (isMobile && mobileOpen && sidebarRef.current) {
        const isSidebarClick = path.includes(sidebarRef.current);
        if (!isSidebarClick) setMobileOpen(false);
        return;
      }

      // Desktop: colapsar sidebar expandida
      if (!isMobile && !isCollapsed && sidebarRef.current) {
        const isSidebarClick = path.includes(sidebarRef.current);
        if (!isSidebarClick) setIsCollapsed(true);
      }
    };
    document.addEventListener("pointerdown", handleClickOutside);
    return () => document.removeEventListener("pointerdown", handleClickOutside);
  }, [isCollapsed, isMobile, mobileOpen]);

  /* ── fechar drawer ao navegar ── */
  useEffect(() => {
    if (isMobile) setMobileOpen(false);
  }, [location.pathname, isMobile]);

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => {
      const isCurrentlyOpen = prev[id];
      const allClosed = Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {} as Record<string, boolean>);
      return { ...allClosed, [id]: !isCurrentlyOpen };
    });
  };

  const baseNavGroups: NavGroup[] = [
    { id: "coreact",   label: "CoreAct",   icon: FolderKanban, path: "/coreact" },
    {
      id: "brand", label: "Brand", icon: Palette,
      subItems: [
        { label: "Identidade", path: "/brand#identidade" },
        { label: "Cartilha",   path: "/brand#cartilha" },
        { label: "Guidelines", path: "/brand#guidelines" },
      ],
    },
    {
      id: "marketing", label: "Marketing", icon: Megaphone,
      subItems: [
        { label: "Dashboard V8", path: "/v8-dashboard", badge: { text: "LIVE", variant: "success" } },
        { label: "Campanhas", path: "/campanhas" },
        { label: "Relatórios", path: "/relatorios" },
      ],
    },
    { id: "biblioteca", label: "Biblioteca", icon: BookOpen, path: "/marketing-comunicacao" },
    {
      id: "tools", label: "Tools", icon: Wrench,
      subItems: [
        { label: "Logo Studio",   path: "/tools/logo-cores" },
        { label: "Gerar Doc",     path: "/tools/gerar-doc" },
        { label: "Cores",         path: "/tools/colors" },
        { label: "Gradientes",    path: "/tools/gradients" },
        { label: "Mascotes",      path: "/tools/mascots" },
        { label: "Análise Gráfica", path: "/tools/analysis" },
        { label: "Roda Cromática",  path: "/tools/color-wheel", badge: { text: "Novo!", variant: "success" } },
      ],
    },
  ];

  const navGroups = baseNavGroups
    .map((group) => {
      if (group.id === "tools" && group.subItems) {
        return {
          ...group,
          subItems: group.subItems.filter((sub) => {
            if (sub.disabled) return true;
            if (sub.label === "Logo Studio") return hasPermission("tools_logo_studio" as Parameters<typeof hasPermission>[0]);
            if (sub.label === "Gerar Doc")   return hasPermission("tools_documentos"  as Parameters<typeof hasPermission>[0]);
            return true;
          }),
        };
      }
      return group;
    })
    .filter((group) => {
      if (group.id === "coreact")   return hasPermission("module_coreact"    as Parameters<typeof hasPermission>[0]);
      if (group.id === "brand")     return hasPermission("module_brand"      as Parameters<typeof hasPermission>[0]);
      if (group.id === "marketing") return hasPermission("module_marketing"  as Parameters<typeof hasPermission>[0]);
      if (group.id === "biblioteca")return hasPermission("module_marketing"  as Parameters<typeof hasPermission>[0]);
      if (group.id === "tools")     return hasPermission("module_tools"      as Parameters<typeof hasPermission>[0]);
      return true;
    });

  /* ── lógica de visibilidade ── */
  const collapsed = isMobile ? true : isCollapsed;  // no mobile sempre ícones
  const showSidebar = isMobile ? mobileOpen : true;

  const handleSidebarClick = () => {
    if (isMobile) return; // mobile usa o botão hamburguer externo
    if (isCollapsed) setIsCollapsed(false);
  };

  /* ── render ── */
  return (
    <>
      {/* Overlay mobile */}
      {isMobile && mobileOpen && (
        <div
          style={S.overlay}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Botão hamburguer flutuante (mobile) */}
      {isMobile && !mobileOpen && (
        <button
          aria-label="Abrir menu"
          onClick={() => setMobileOpen(true)}
          style={{
            position: "fixed",
            top: "var(--spacing-4)",
            left: "var(--spacing-4)",
            zIndex: 51,
            width: "2.75rem",
            height: "2.75rem",
            minHeight: "2.75rem",    // ≥44px (Regra #2)
            minWidth: "2.75rem",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border)",
            backgroundColor: "var(--sidebar)",
            color: "var(--sidebar-foreground)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          <ChevronRight size={18} />
        </button>
      )}

      {/* Sidebar */}
      {showSidebar && (
        <aside
          ref={sidebarRef}
          style={{
            ...S.sidebar(collapsed, mobileOpen),
            // Mobile drawer: posição fixed na esquerda
            ...(isMobile ? {
              position: "fixed",
              top: 0,
              left: 0,
              height: "100dvh",
              width: "16rem",          // sempre expandida quando aberta no mobile
              zIndex: 50,
              boxShadow: "4px 0 24px rgba(0,0,0,0.2)",
            } : {}),
          }}
          onClick={handleSidebarClick}
        >
          {/* Header */}
          <div style={S.header(isMobile ? false : collapsed)}>
            <div style={S.logo(isMobile ? false : collapsed)}>
              <Sparkles size={20} style={{ color: "var(--foreground)", flexShrink: 0 }} />
              {!(isMobile ? false : collapsed) && (
                <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
                  <span style={{
                    fontFamily: "var(--font-family-heading)",
                    fontWeight: 800,
                    fontSize: "var(--font-size-md)",
                    letterSpacing: "0.05em",
                  }}>ADAPTA</span>
                  <span style={{
                    fontFamily: "var(--font-family-base)",
                    fontWeight: 400,
                    fontSize: "var(--font-size-xs)",
                    letterSpacing: "0.1em",
                    color: "var(--muted-foreground)",
                  }}>CORE STUDIO</span>
                </div>
              )}
            </div>
          </div>

          {/* Nav */}
          <div style={S.scrollArea}>
            {!(isMobile ? false : collapsed) && (
              <div style={S.sectionLabel}>Navegação</div>
            )}

            <div style={S.navContainer(isMobile ? false : collapsed)}>
              {navGroups.map((group, index) => {
                const GroupIcon = group.icon;
                const isGroupActive =
                  group.path === location.pathname ||
                  group.subItems?.some((sub) => sub.path === location.pathname);
                const col = isMobile ? false : collapsed;

                if (!group.subItems) {
                  const linkContent = (
                    <Link
                      to={group.path || "#"}
                      style={S.navItem(col, location.pathname === group.path)}
                    >
                      <div style={S.groupTriggerInner}>
                        <GroupIcon size={18} style={{ flexShrink: 0 }} />
                        {!col && <span style={{ fontSize: "var(--font-size-base)" }}>{group.label}</span>}
                      </div>
                    </Link>
                  );
                  return (
                    <React.Fragment key={group.id}>
                      {index > 0 && col && (
                        <div style={{ width: "60%", height: 1, backgroundColor: "var(--border)", margin: "6px auto" }} />
                      )}
                      {col ? (
                        <Tooltip>
                          <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                          <TooltipContent side="right">{group.label}</TooltipContent>
                        </Tooltip>
                      ) : linkContent}
                    </React.Fragment>
                  );
                }

                const isOpen = openGroups[group.id];
                const buttonContent = (
                  <button
                    style={{
                      ...S.navItem(col, !!isGroupActive && !isOpen),
                      justifyContent: col ? "center" : "space-between",
                    }}
                  >
                    <div style={S.groupTriggerInner}>
                      <GroupIcon size={18} style={{ flexShrink: 0 }} />
                      {!col && <span style={{ fontSize: "var(--font-size-base)" }}>{group.label}</span>}
                    </div>
                    {!col && <ChevronDown size={16} style={S.chevron(isOpen || false)} />}
                  </button>
                );

                return (
                  <React.Fragment key={group.id}>
                    {index > 0 && col && (
                      <div style={{ width: "60%", height: 1, backgroundColor: "var(--border)", margin: "6px auto" }} />
                    )}
                    <Collapsible.Root
                      open={col ? false : (isOpen || false)}
                      onOpenChange={() => toggleGroup(group.id)}
                      style={{ display: "flex", flexDirection: "column" }}
                    >
                      {col ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Collapsible.Trigger asChild>{buttonContent}</Collapsible.Trigger>
                          </TooltipTrigger>
                          <TooltipContent side="right">{group.label}</TooltipContent>
                        </Tooltip>
                      ) : (
                        <Collapsible.Trigger asChild>{buttonContent}</Collapsible.Trigger>
                      )}

                      {!col && (
                        <Collapsible.Content style={{ overflow: "hidden" }}>
                          <div style={{ ...S.subItemsContainer, borderLeft: "1px solid var(--border)", marginLeft: "1.25rem" }}>
                            {group.subItems.map((sub, idx) => {
                              const isSubActive = sub.path === location.pathname + location.search;
                              const isPathMatch = sub.path === location.pathname;
                              const active = isSubActive || (isPathMatch && !location.search && !sub.path?.includes("?"));
                              if (sub.disabled) {
                                return (
                                  <div key={idx} style={S.subItem(false, true)}>
                                    <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sub.label}</span>
                                    {sub.badge && <Badge variant={sub.badge.variant} style={{ fontSize: "var(--font-size-2xs)" }}>{sub.badge.text}</Badge>}
                                  </div>
                                );
                              }
                              return (
                                <Link key={idx} to={sub.path || "#"} style={S.subItem(active, false)}>
                                  <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sub.label}</span>
                                  {sub.badge && <Badge variant={sub.badge.variant} style={{ fontSize: "var(--font-size-2xs)" }}>{sub.badge.text}</Badge>}
                                </Link>
                              );
                            })}
                          </div>
                        </Collapsible.Content>
                      )}
                    </Collapsible.Root>
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div style={S.footer(isMobile ? false : collapsed)}>
            {/* User Profile */}
            <div style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: (isMobile ? false : collapsed) ? "center" : "flex-start" }}>
              {authState.type === "loading" ? (
                <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-3)", width: "100%" }}>
                  <Skeleton style={{ width: "2rem", height: "2rem", borderRadius: "var(--radius-full)" }} />
                  {!(isMobile ? false : collapsed) && (
                    <div style={{ flex: 1 }}>
                      <Skeleton style={{ width: "100%", height: "0.875rem" }} />
                      <Skeleton style={{ width: "80%", height: "0.75rem", marginTop: 2 }} />
                    </div>
                  )}
                </div>
              ) : authState.type === "unauthenticated" ? (
                <Link to="/login" style={{ display: "flex", alignItems: "center", gap: "var(--spacing-3)", color: "var(--foreground)", textDecoration: "none", width: "100%" }}>
                  <Avatar style={{ width: "2rem", height: "2rem" }}>
                    <AvatarFallback>?</AvatarFallback>
                  </Avatar>
                  {!(isMobile ? false : collapsed) && <span style={{ fontSize: "var(--font-size-base)", fontWeight: 600 }}>ENTRAR</span>}
                </Link>
              ) : (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "var(--spacing-3)", width: "100%", cursor: "pointer", overflow: "hidden" }}
                  onClick={() => toast.info("Menu do perfil em desenvolvimento")}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Avatar style={{ width: "2rem", height: "2rem", flexShrink: 0 }}>
                        {authState.user.avatarUrl && (
                          <AvatarImage src={authState.user.avatarUrl} alt={authState.user.displayName} />
                        )}
                        <AvatarFallback>
                          {authState.user.displayName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent side={(isMobile ? false : collapsed) ? "right" : "top"}>Opções da Conta</TooltipContent>
                  </Tooltip>
                  {!(isMobile ? false : collapsed) && (
                    <div style={{ display: "flex", flexDirection: "column", overflow: "hidden", flex: 1 }}>
                      <span style={{ fontSize: "var(--font-size-base)", fontWeight: 600, letterSpacing: "0.05em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {authState.user.displayName.toUpperCase()}
                      </span>
                      <span style={{ fontSize: "var(--font-size-xs)", color: "var(--muted-foreground)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {authState.user.email}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Icon bar */}
            <div style={S.iconBar(isMobile ? false : collapsed)}>
              {!(isMobile ? false : collapsed) && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  style={{ color: "var(--sidebar-foreground)", minHeight: "2.75rem", minWidth: "2.75rem" }}
                  aria-label="Idioma"
                  onClick={() => {
                    const nextLocale = locale === "pt" ? "en" : locale === "en" ? "de" : "pt";
                    setLocale(nextLocale);
                  }}
                >
                  <Globe size={16} />
                  <span style={{ fontSize: "var(--font-size-2xs)", fontWeight: "bold", marginLeft: "4px" }}>
                    {locale.toUpperCase()}
                  </span>
                </Button>
              )}

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                {(isMobile ? false : collapsed) ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div style={{ minHeight: "2.75rem", display: "flex", alignItems: "center" }}>
                        <ThemeModeSwitch />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">Tema</TooltipContent>
                  </Tooltip>
                ) : (
                  <ThemeModeSwitch />
                )}
              </div>

              {!(isMobile ? false : collapsed) ? (
                <>
                  <CoreactHelpModal isCollapsed={false} />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        style={{ color: "var(--sidebar-foreground)", minHeight: "2.75rem", minWidth: "2.75rem" }}
                        aria-label="Documentação"
                        onClick={() => toast.info("Central de Documentação em breve")}
                      >
                        <BookOpen size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Documentação</TooltipContent>
                  </Tooltip>
                </>
              ) : (
                <>
                  <CoreactHelpModal isCollapsed={true} />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        style={{ color: "var(--sidebar-foreground)", minHeight: "2.75rem", minWidth: "2.75rem", marginTop: "var(--spacing-2)" }}
                        aria-label="Documentação"
                        onClick={() => toast.info("Central de Documentação em breve")}
                      >
                        <BookOpen size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">Documentação</TooltipContent>
                  </Tooltip>
                </>
              )}

              {(isMobile ? false : collapsed) ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button asChild variant="ghost" size="icon-sm" style={{ color: "var(--sidebar-foreground)", minHeight: "2.75rem", minWidth: "2.75rem" }}>
                      <Link to="/configuracoes"><Settings size={16} /></Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Configurações</TooltipContent>
                </Tooltip>
              ) : (
                <Button asChild variant="ghost" size="icon-sm" style={{ color: "var(--sidebar-foreground)", minHeight: "2.75rem", minWidth: "2.75rem" }} aria-label="Configurações">
                  <Link to="/configuracoes"><Settings size={16} /></Link>
                </Button>
              )}
            </div>

            {/* Collapse button (desktop only) */}
            {!isMobile && (
              <button
                style={S.collapseButton(isCollapsed)}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCollapsed(!isCollapsed);
                }}
                title={isCollapsed ? "Expandir menu" : "Recolher menu"}
                aria-label="Alternar menu"
              >
                {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>
            )}

            {/* Fechar drawer (mobile) */}
            {isMobile && (
              <button
                style={{ ...S.collapseButton(false), justifyContent: "center" }}
                onClick={() => setMobileOpen(false)}
                aria-label="Fechar menu"
              >
                <ChevronLeft size={16} />
                <span style={{ fontSize: "var(--font-size-xs)", marginLeft: "var(--spacing-2)" }}>Fechar</span>
              </button>
            )}
          </div>
        </aside>
      )}
    </>
  );
};