import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Link } from "../components/ui/link";
import { motion, AnimatePresence } from "motion/react";
import { 
  Palette,
  FileText,
  Package,
  Megaphone,
  BarChart3,
  Calendar,
  FileDown, 
  Map, 
  ClipboardCheck, 
  Settings,
  Plus,
  Menu,
  X,
  ChevronDown,
  HelpCircle,
  PanelLeftOpen,
  PanelLeftClose,
} from "lucide-react";
import { Button } from "./ui/button";
import { CriarCampanha } from "./criar-campanha";
import { OnboardingTour } from "./onboarding-tour";
import { LogoViewModes } from "./logo-view-modes";

interface NavSection {
  id: string;
  label: string;
  icon: any;
  items: NavItem[];
}

interface NavItem {
  path: string;
  label: string;
}

const NAV_SECTIONS: NavSection[] = [
  {
    id: "campanhas",
    label: "Campanhas",
    icon: Calendar,
    items: [
      { path: "/campanhas/passadas", label: "Passadas" },
      { path: "/campanhas/ativas", label: "Ativas" },
      { path: "/campanhas/futuras", label: "Futuras" },
    ]
  },
  {
    id: "materiais",
    label: "Materiais",
    icon: Palette,
    items: [
      { path: "/", label: "Identidade Visual" },
      { path: "/documentos", label: "Documentos Corporativos" },
      { path: "/marketing", label: "Marketing & Comunicação" },
      { path: "/produtos", label: "Produtos & Embalagens" },
      { path: "/comunicacao-visual", label: "Comunicação Visual" },
    ]
  }
];

export function Layout() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [isCampanhaModalOpen, setIsCampanhaModalOpen] = useState(false);
  const [isPaletaOpen, setIsPaletaOpen] = useState(false);

  const toggleSection = (sectionId: string) => {
    if (isSidebarCollapsed) {
      // Se minimizado, expandir automaticamente ao clicar em uma seção
      setIsSidebarCollapsed(false);
      setExpandedSections([sectionId]);
    } else {
      setExpandedSections(prev => 
        prev.includes(sectionId) 
          ? prev.filter(id => id !== sectionId)
          : [...prev, sectionId]
      );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--page-bg)' }}>
      {/* Sidebar - Desktop */}
      <motion.aside 
        className="flex flex-col shadow-sm relative z-20"
        style={{ 
          backgroundColor: 'var(--nav-bg)', 
          borderRight: '1px solid var(--nav-border)' 
        }}
        animate={{ width: isSidebarCollapsed ? "5rem" : "16rem" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3 top-20 z-50 w-6 h-6 rounded-full flex items-center justify-center transition-all shadow-md"
          style={{
            backgroundColor: 'var(--nav-bg)',
            border: '2px solid var(--nav-border)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--nav-item-hover)';
            e.currentTarget.style.borderColor = 'var(--nav-dot)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--nav-bg)';
            e.currentTarget.style.borderColor = 'var(--nav-border)';
          }}
          title={isSidebarCollapsed ? "Expandir menu" : "Minimizar menu"}
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen className="w-3 h-3" style={{ color: 'var(--nav-text)' }} />
          ) : (
            <PanelLeftClose className="w-3 h-3" style={{ color: 'var(--nav-text)' }} />
          )}
        </button>

        {/* Logo */}
        <div className="p-6 overflow-hidden" style={{ borderBottom: '1px solid var(--nav-border)' }}>
          {!isSidebarCollapsed ? (
            <>
              <h1 
                className="font-bold text-xl whitespace-nowrap bg-clip-text text-transparent"
                style={{ 
                  backgroundImage: 'linear-gradient(to right, var(--nav-logo-from), var(--nav-logo-to))' 
                }}
              >
                Adapta Brand Studio
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Identidade Visual Inteligente
              </p>
            </>
          ) : (
            <div className="w-full flex justify-center">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: 'var(--nav-item-active)' }}
              >
                A
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto overflow-x-hidden">
          {NAV_SECTIONS.map((section) => {
            const isExpanded = expandedSections.includes(section.id);
            return (
              <div key={section.id} className="space-y-1">
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className={`w-full flex items-center gap-3 rounded-lg transition-all ${
                    isSidebarCollapsed ? "px-2 py-3 justify-center" : "px-4 py-3"
                  }`}
                  style={{ color: 'var(--nav-text)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--nav-item-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  title={isSidebarCollapsed ? section.label : undefined}
                >
                  <section.icon className="w-5 h-5 flex-shrink-0" />
                  {!isSidebarCollapsed && (
                    <>
                      <span className="font-medium flex-1 text-left">{section.label}</span>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    </>
                  )}
                </button>

                {/* Sub-items */}
                {!isSidebarCollapsed && (
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 space-y-1">
                          {section.items.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                              <Link
                                key={item.path}
                                to={item.path}
                              >
                                <motion.div
                                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm"
                                  style={{
                                    backgroundColor: isActive ? 'var(--nav-item-active)' : 'transparent',
                                    color: isActive ? 'var(--nav-text-active)' : 'var(--nav-text)'
                                  }}
                                  onMouseEnter={(e) => {
                                    if (!isActive) e.currentTarget.style.backgroundColor = 'var(--nav-item-hover)';
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                                  }}
                                  whileHover={{ scale: 1.02, x: 4 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <div 
                                    className="w-1.5 h-1.5 rounded-full" 
                                    style={{ backgroundColor: isActive ? 'var(--nav-dot-active)' : 'var(--nav-dot)' }}
                                  />
                                  <span className="font-medium">{item.label}</span>
                                </motion.div>
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            );
          })}

          {/* Configurações - standalone item */}
          <div className="pt-2 mt-2" style={{ borderTop: '1px solid var(--nav-border)' }}>
            <Link to="/configuracoes">
              <motion.div
                className={`flex items-center gap-3 rounded-lg transition-all ${
                  isSidebarCollapsed ? "px-2 py-3 justify-center" : "px-4 py-3"
                }`}
                style={{
                  backgroundColor: location.pathname === "/configuracoes" ? 'var(--nav-item-active)' : 'transparent',
                  color: location.pathname === "/configuracoes" ? 'var(--nav-text-active)' : 'var(--nav-text)'
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== "/configuracoes") {
                    e.currentTarget.style.backgroundColor = 'var(--nav-item-hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== "/configuracoes") {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
                whileHover={{ scale: 1.02, x: isSidebarCollapsed ? 0 : 4 }}
                whileTap={{ scale: 0.98 }}
                title={isSidebarCollapsed ? "Configurações" : undefined}
              >
                <Settings className="w-5 h-5 flex-shrink-0" />
                {!isSidebarCollapsed && <span className="font-medium">Configurações</span>}
              </motion.div>
            </Link>
          </div>
        </nav>

        {/* Footer */}
        {!isSidebarCollapsed && (
          <div className="p-4 border-t" style={{ borderColor: 'var(--gray-100)' }}>
            <p className="text-xs text-muted-foreground text-center">
              v1.0.0 • Powered by React Router
            </p>
          </div>
        )}
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header 
          className="h-16 flex items-center justify-between px-6 shadow-sm z-10"
          style={{
            backgroundColor: 'var(--header-bg)',
            borderBottom: '1px solid var(--header-border)'
          }}
        >
          {/* Desktop Spacer */}
          <div className="flex-1" />

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsCampanhaModalOpen(true)}
              style={{
                backgroundColor: 'var(--btn-primary-bg)',
                color: 'var(--btn-primary-text)'
              }}
              className="shadow-md"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--btn-primary-bg-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--btn-primary-bg)'}
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Campanha
            </Button>

            {/* Botão de Paleta/Cores */}
            <Button
              onClick={() => setIsPaletaOpen(true)}
              variant="ghost"
              size="icon"
              style={{ color: 'var(--nav-text)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--nav-item-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              title="Editor de Logo e Cores"
            >
              <Palette className="w-5 h-5" />
            </Button>

            {/* Botão de Ajuda */}
            <Button
              variant="ghost"
              size="icon"
              style={{ color: 'var(--nav-text)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--nav-item-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              onClick={() => {
                // Abre o onboarding tour
                if ((window as any).__openOnboardingTour) {
                  (window as any).__openOnboardingTour();
                }
              }}
              title="Ajuda e tutorial"
            >
              <HelpCircle className="w-5 h-5" />
            </Button>

            <Link to="/configuracoes">
              <Button
                variant="ghost"
                size="icon"
                style={{ color: 'var(--nav-text)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--nav-item-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Settings className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </header>

        {/* Mobile Sidebar Overlay - Removed for desktop view */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25 }}
              className="w-64 h-full bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Logo */}
              <div className="p-6 border-b" style={{ borderColor: 'var(--gray-100)' }}>
                <h1 className="font-bold text-xl" style={{ color: 'var(--gray-900)' }}>
                  Adapta Brand Studio
                </h1>
                <p className="text-xs text-muted-foreground mt-1">
                  Identidade Visual Inteligente
                </p>
              </div>

              {/* Navigation */}
              <nav className="p-4 space-y-1">
                {NAV_SECTIONS.map((section) => {
                  const isExpanded = expandedSections.includes(section.id);
                  return (
                    <div key={section.id} className="space-y-1">
                      {/* Section Header */}
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all"
                        style={{ color: 'var(--gray-700)' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--gray-100)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <section.icon className="w-5 h-5" />
                        <span className="font-medium flex-1 text-left">{section.label}</span>
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </motion.div>
                      </button>

                      {/* Sub-items */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 space-y-1">
                              {section.items.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                  <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                  >
                                    <div
                                      className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm"
                                      style={{
                                        backgroundColor: isActive ? 'var(--gray-800)' : 'transparent',
                                        color: isActive ? '#ffffff' : 'var(--gray-600)'
                                      }}
                                      onMouseEnter={(e) => {
                                        if (!isActive) {
                                          e.currentTarget.style.backgroundColor = 'var(--gray-100)';
                                          e.currentTarget.style.color = 'var(--gray-900)';
                                        }
                                      }}
                                      onMouseLeave={(e) => {
                                        if (!isActive) {
                                          e.currentTarget.style.backgroundColor = 'transparent';
                                          e.currentTarget.style.color = 'var(--gray-600)';
                                        }
                                      }}
                                    >
                                      <div 
                                        className="w-1.5 h-1.5 rounded-full" 
                                        style={{ backgroundColor: isActive ? '#ffffff' : 'var(--gray-400)' }} 
                                      />
                                      <span className="font-medium">{item.label}</span>
                                    </div>
                                  </Link>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

                {/* Configurações - standalone item */}
                <div className="pt-2 mt-2 border-t" style={{ borderColor: 'var(--gray-200)' }}>
                  <Link to="/configuracoes">
                    <motion.div
                      className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all"
                      style={{
                        backgroundColor: location.pathname === "/configuracoes" ? 'var(--gray-800)' : 'transparent',
                        color: location.pathname === "/configuracoes" ? '#ffffff' : 'var(--gray-700)'
                      }}
                      onMouseEnter={(e) => {
                        if (location.pathname !== "/configuracoes") {
                          e.currentTarget.style.backgroundColor = 'var(--gray-100)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (location.pathname !== "/configuracoes") {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Settings className="w-5 h-5" />
                      <span className="font-medium">Configurações</span>
                    </motion.div>
                  </Link>
                </div>
              </nav>
            </motion.aside>
          </motion.div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Criar Campanha Modal */}
      <CriarCampanha
        isOpen={isCampanhaModalOpen}
        onClose={() => setIsCampanhaModalOpen(false)}
      />

      {/* Onboarding Tour */}
      <OnboardingTour />

      {/* Logo View Modes - Apenas quando aberto */}
      {isPaletaOpen && (
        <LogoViewModes 
          defaultMode="sidebar"
          onClose={() => setIsPaletaOpen(false)}
          controlled={true}
        />
      )}
    </div>
  );
}
