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
  HelpCircle,
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
import styles from "./AppSidebar.module.css";

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

export const AppSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { authState } = useAuth();
  const location = useLocation();
  const { locale, setLocale } = useGoogleTranslate();
  const { hasPermission } = usePermissions();
  const sidebarRef = useRef<HTMLElement>(null);

  // State for collapsible sections
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  // Handle auto-minimize on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | PointerEvent) => {
      const path = event.composedPath();
      const target = event.target as Element;
      
      if (!target) return;

      // Ensure we don't collapse if clicking on anything inside a radix portal
      // like dropdown menus, tooltips, dialogs, etc.
      const isPortalClick = path.some((node) => {
        if (node instanceof Element) {
          return (
            node.matches("[data-radix-popper-content-wrapper], [data-radix-menu-content], [data-radix-dropdown-menu-content], [role='menu'], [role='dialog'], [role='tooltip'], [data-state='open']") ||
            node.closest("[data-radix-dropdown-menu-trigger]") !== null
          );
        }
        return false;
      });

      if (isPortalClick) {
        return;
      }

      if (!isCollapsed && sidebarRef.current) {
        // Use composedPath() to prevent bugs with React 18 detaching nodes mid-render
        const isSidebarClick = path.includes(sidebarRef.current);
        if (!isSidebarClick) {
          setIsCollapsed(true);
        }
      }
    };
    document.addEventListener("pointerdown", handleClickOutside);
    return () => document.removeEventListener("pointerdown", handleClickOutside);
  }, [isCollapsed]);

  // Handle responsive auto-collapse
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };
    window.addEventListener("resize", handleResize);
    if (window.innerWidth < 1280) {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
    }
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => {
      const isCurrentlyOpen = prev[id];
      const allClosed = Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {} as Record<string, boolean>);
      return { ...allClosed, [id]: !isCurrentlyOpen };
    });
  };

  const baseNavGroups: NavGroup[] = [
    {
      id: "coreact",
      label: "CoreAct",
      icon: FolderKanban,
      path: "/coreact",
    },
    {
      id: "brand",
      label: "Brand",
      icon: Palette,
      subItems: [
        { label: "Identidade", disabled: true, badge: { text: "Em breve", variant: "outline" } },
        { label: "Guidelines", disabled: true },
        { label: "Cartilhas", disabled: true },
      ],
    },
    {
      id: "marketing",
      label: "Marketing",
      icon: Megaphone,
      subItems: [
        { label: "Campanhas", path: "/campanhas" },
        { label: "Relatórios", path: "/relatorios" },
      ],
    },
    {
      id: "biblioteca",
      label: "Biblioteca",
      icon: BookOpen,
      path: "/marketing-comunicacao",
    },
    {
      id: "tools",
      label: "Tools",
      icon: Wrench,
      subItems: [
        { label: "Logo Studio", path: "/tools/logo-cores" },
        { label: "Documentos", path: "/documentos-corporativos" },
        { label: "Produtos & Embalagens", path: "/tools/produtos" },
        { label: "Comunicação Visual", disabled: true, badge: { text: "Em breve", variant: "outline" } },
        { label: "Cores", path: "/tools/colors" },
        { label: "Gradientes", path: "/tools/gradients" },
        { label: "Mascotes", path: "/tools/mascots" },
        { label: "Preview do Insta", disabled: true, badge: { text: "Em breve", variant: "outline" } },
        { label: "Análise Gráfica", path: "/tools/analysis" },
        { label: "Roda Cromática", path: "/tools/color-wheel", badge: { text: "Novo!", variant: "success" } },
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
            if (sub.label === "Documentos") return hasPermission("tools_documentos" as Parameters<typeof hasPermission>[0]);
            return true;
          }),
        };
      }
      return group;
    })
    .filter((group) => {
      if (group.id === "coreact") return hasPermission("module_coreact" as Parameters<typeof hasPermission>[0]);
      if (group.id === "brand") return hasPermission("module_brand" as Parameters<typeof hasPermission>[0]);
      if (group.id === "marketing") return hasPermission("module_marketing" as Parameters<typeof hasPermission>[0]);
      if (group.id === "biblioteca") return hasPermission("module_marketing" as Parameters<typeof hasPermission>[0]);
      if (group.id === "tools") return hasPermission("module_tools" as Parameters<typeof hasPermission>[0]);
      return true;
    });

  const handleSidebarClick = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
    }
  };

  return (
    <aside 
      ref={sidebarRef}
      className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}
      onClick={handleSidebarClick}
    >
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.logo}>
          <Sparkles className={styles.sparkleIcon} size={20} />
          {!isCollapsed && (
            <div className={styles.logoTextContainer}>
              <span className={styles.logoTextBold}>ADAPTA</span>
              <span className={styles.logoTextLight}>CORE STUDIO</span>
            </div>
          )}
        </div>
      </div>

      <div className={styles.scrollArea}>
        {!isCollapsed && <div className={styles.sectionLabel}>{"Navegação"}</div>}

        <div className={styles.navContainer}>
          {navGroups.map((group, index) => {
            const GroupIcon = group.icon;
            const isGroupActive =
              group.path === location.pathname ||
              group.subItems?.some((sub) => sub.path === location.pathname);

            if (!group.subItems) {
              // Standalone link
              const linkContent = (
                <Link
                  to={group.path || "#"}
                  className={`${styles.navItem} ${
                    location.pathname === group.path ? styles.active : ""
                  }`}
                >
                  <GroupIcon size={18} className={styles.navIcon} />
                  {!isCollapsed && <span className={styles.navLabel}>{group.label}</span>}
                </Link>
              );

              return (
                <React.Fragment key={group.id}>
                  {index > 0 && isCollapsed && <div className={styles.collapsedSeparator} />}
                  {isCollapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                      <TooltipContent side="right">{group.label}</TooltipContent>
                    </Tooltip>
                  ) : (
                    linkContent
                  )}
                </React.Fragment>
              );
            }

            // Collapsible group
            const isOpen = openGroups[group.id];
            const buttonContent = (
              <button
                className={`${styles.groupTrigger} ${
                  isGroupActive && !isOpen ? styles.groupTriggerActive : ""
                }`}
              >
                <div className={styles.groupTriggerInner}>
                  <GroupIcon size={18} className={styles.navIcon} />
                  {!isCollapsed && <span className={styles.navLabel}>{group.label}</span>}
                </div>
                {!isCollapsed && (
                  <ChevronDown
                    size={16}
                    className={`${styles.chevron} ${isOpen ? styles.open : ""}`}
                  />
                )}
              </button>
            );

            return (
              <React.Fragment key={group.id}>
                {index > 0 && isCollapsed && <div className={styles.collapsedSeparator} />}
                <Collapsible.Root
                  open={isCollapsed ? false : isOpen}
                  onOpenChange={() => toggleGroup(group.id)}
                  className={styles.collapsibleRoot}
                >
                  {isCollapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Collapsible.Trigger asChild>
                          {buttonContent}
                        </Collapsible.Trigger>
                      </TooltipTrigger>
                      <TooltipContent side="right">{group.label}</TooltipContent>
                    </Tooltip>
                  ) : (
                    <Collapsible.Trigger asChild>
                      {buttonContent}
                    </Collapsible.Trigger>
                  )}
                  
                  {!isCollapsed && (
                    <Collapsible.Content className={styles.collapsibleContent}>
                      <div className={styles.subItemsContainer}>
                        {group.subItems.map((sub, idx) => {
                          const isSubActive = sub.path === location.pathname + location.search;
                          // Also match exact path if no search params are present
                          const isPathMatch = sub.path === location.pathname;
                          const active = isSubActive || (isPathMatch && !location.search && !sub.path?.includes('?'));

                          if (sub.disabled) {
                            return (
                              <div key={idx} className={`${styles.subItem} ${styles.disabled}`}>
                                <span className={styles.subLabel}>{sub.label}</span>
                                {sub.badge && (
                                  <Badge
                                    variant={sub.badge.variant}
                                    className={styles.badge}
                                  >
                                    {sub.badge.text}
                                  </Badge>
                                )}
                              </div>
                            );
                          }

                          return (
                            <Link
                              key={idx}
                              to={sub.path || "#"}
                              className={`${styles.subItem} ${active ? styles.active : ""}`}
                            >
                              <span className={styles.subLabel}>{sub.label}</span>
                              {sub.badge && (
                                <Badge
                                  variant={sub.badge.variant}
                                  className={styles.badge}
                                >
                                  {sub.badge.text}
                                </Badge>
                              )}
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
      <div className={styles.footer}>
        {/* User Profile */}
        <div className={styles.userProfile}>
          {authState.type === "loading" ? (
            <div className={styles.userSkeleton}>
              <Skeleton className={styles.avatarSkeleton} />
              {!isCollapsed && (
                <div className={styles.userDetails}>
                  <Skeleton className={styles.nameSkeleton} />
                  <Skeleton className={styles.emailSkeleton} />
                </div>
              )}
            </div>
          ) : authState.type === "unauthenticated" ? (
            <Link to="/login" className={styles.loginLink}>
              {isCollapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar className={styles.avatar}>
                      <AvatarFallback>?</AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent side="right">Entrar</TooltipContent>
                </Tooltip>
              ) : (
                <>
                  <Avatar className={styles.avatar}>
                    <AvatarFallback>?</AvatarFallback>
                  </Avatar>
                  <span className={styles.loginText}>{"ENTRAR"}</span>
                </>
              )}
            </Link>
          ) : (
            <div 
              className={isCollapsed ? styles.userInfoCollapsed : styles.userInfo}
              onClick={() => toast.info("Menu do perfil em desenvolvimento")}
              style={{ cursor: "pointer" }}
            >
              {isCollapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={styles.avatarWrapper}>
                      <Avatar className={styles.avatar}>
                        {authState.user.avatarUrl && (
                          <AvatarImage src={authState.user.avatarUrl} alt={authState.user.displayName} />
                        )}
                        <AvatarFallback>
                          {authState.user.displayName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">Menu do Usuário</TooltipContent>
                </Tooltip>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-3)", width: "100%" }}>
                      <Avatar className={styles.avatar}>
                        {authState.user.avatarUrl && (
                          <AvatarImage src={authState.user.avatarUrl} alt={authState.user.displayName} />
                        )}
                        <AvatarFallback>
                          {authState.user.displayName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className={styles.userDetails}>
                        <span className={styles.userName}>
                          {authState.user.displayName.toUpperCase()}
                        </span>
                        <span className={styles.userEmail}>
                          {authState.user.email}
                        </span>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Opções da Conta</TooltipContent>
                </Tooltip>
              )}
            </div>
          )}
        </div>

        {/* Icon Bar */}
        <div className={styles.iconBar}>
          {!isCollapsed && (
            <Button 
              variant="ghost" 
              size="icon-sm" 
              className={styles.iconButton} 
              aria-label={"Acessibilidade"}
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

          <div className={styles.iconButtonWrapper}>
            {isCollapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={styles.interactiveElement}>
                    <ThemeModeSwitch className={styles.themeSwitch} />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">Tema</TooltipContent>
              </Tooltip>
            ) : (
              <ThemeModeSwitch className={styles.themeSwitch} />
            )}
          </div>

          {!isCollapsed ? (
            <>
              <CoreactHelpModal isCollapsed={false} />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon-sm" 
                    className={styles.iconButton} 
                    aria-label={"Documentação"}
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
                    className={styles.iconButton} 
                    aria-label={"Documentação"}
                    onClick={() => toast.info("Central de Documentação em breve")}
                    style={{ marginTop: "var(--spacing-2)" }}
                  >
                    <BookOpen size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Documentação</TooltipContent>
              </Tooltip>
            </>
          )}

          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild variant="ghost" size="icon-sm" className={`${styles.iconButton} ${styles.interactiveElement}`}>
                  <Link to="/configuracoes">
                    <Settings size={16} />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Configurações</TooltipContent>
            </Tooltip>
          ) : (
            <Button asChild variant="ghost" size="icon-sm" className={styles.iconButton} aria-label={"Configurações"}>
              <Link to="/configuracoes">
                <Settings size={16} />
              </Link>
            </Button>
          )}
        </div>

        <Button
          variant="ghost"
          className={styles.collapseButton}
          onClick={(e) => {
            e.stopPropagation();
            setIsCollapsed(!isCollapsed);
          }}
          title={isCollapsed ? "Expandir menu" : "Recolher menu"}
          aria-label="Alternar menu"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>
    </aside>
  );
};