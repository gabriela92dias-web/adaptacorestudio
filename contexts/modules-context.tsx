/**
 * ADAPTA CORE STUDIO - MODULES CONTEXT
 * =======================================================================
 * Sistema de orquestração global dos módulos BRAND, MARKETING e TOOLS
 * Gerencia status, permissões, configurações e comunicação entre módulos
 * 
 * Build: v0.0.12-PHASE-3
 * =======================================================================
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

// =====================================================================
// TYPES & INTERFACES
// =====================================================================

export type ModuleType = 'brand' | 'marketing' | 'tools';

export type ModuleStatus = 'active' | 'inactive' | 'loading' | 'error';

export interface ModuleConfig {
  id: ModuleType;
  name: string;
  version: string;
  status: ModuleStatus;
  enabled: boolean;
  permissions: string[];
  lastSync?: string;
}

export interface ModulesState {
  modules: Record<ModuleType, ModuleConfig>;
  activeModule: ModuleType | null;
  isLoading: boolean;
  error: string | null;
}

export interface ModulesContextValue {
  state: ModulesState;
  setActiveModule: (moduleId: ModuleType) => void;
  toggleModule: (moduleId: ModuleType) => void;
  updateModuleStatus: (moduleId: ModuleType, status: ModuleStatus) => void;
  syncModule: (moduleId: ModuleType) => Promise<void>;
  hasPermission: (moduleId: ModuleType, permission: string) => boolean;
}

// =====================================================================
// INITIAL STATE & MOCK DATA
// =====================================================================

const INITIAL_MODULES: Record<ModuleType, ModuleConfig> = {
  brand: {
    id: 'brand',
    name: 'ADAPTA BRAND',
    version: '2.0.0',
    status: 'active',
    enabled: true,
    permissions: ['view', 'edit', 'create', 'delete', 'export'],
    lastSync: new Date().toISOString(),
  },
  marketing: {
    id: 'marketing',
    name: 'ADAPTA MARKETING',
    version: '2.0.0',
    status: 'active',
    enabled: true,
    permissions: ['view', 'edit', 'create', 'publish'],
    lastSync: new Date().toISOString(),
  },
  tools: {
    id: 'tools',
    name: 'ADAPTA TOOLS',
    version: '2.0.0',
    status: 'active',
    enabled: true,
    permissions: ['view', 'use', 'configure'],
    lastSync: new Date().toISOString(),
  },
};

const INITIAL_STATE: ModulesState = {
  modules: INITIAL_MODULES,
  activeModule: null,
  isLoading: false,
  error: null,
};

// =====================================================================
// CONTEXT
// =====================================================================

const ModulesContext = createContext<ModulesContextValue | undefined>(undefined);

// =====================================================================
// PROVIDER
// =====================================================================

interface ModulesProviderProps {
  children: ReactNode;
}

export function ModulesProvider({ children }: ModulesProviderProps) {
  const [state, setState] = useState<ModulesState>(INITIAL_STATE);

  // Ativa um módulo específico
  const setActiveModule = (moduleId: ModuleType) => {
    setState((prev) => ({
      ...prev,
      activeModule: moduleId,
    }));
  };

  // Toggle enable/disable de um módulo
  const toggleModule = (moduleId: ModuleType) => {
    setState((prev) => ({
      ...prev,
      modules: {
        ...prev.modules,
        [moduleId]: {
          ...prev.modules[moduleId],
          enabled: !prev.modules[moduleId].enabled,
          status: !prev.modules[moduleId].enabled ? 'active' : 'inactive',
        },
      },
    }));
  };

  // Atualiza status de um módulo
  const updateModuleStatus = (moduleId: ModuleType, status: ModuleStatus) => {
    setState((prev) => ({
      ...prev,
      modules: {
        ...prev.modules,
        [moduleId]: {
          ...prev.modules[moduleId],
          status,
        },
      },
    }));
  };

  // Simula sincronização de um módulo (mock)
  const syncModule = async (moduleId: ModuleType): Promise<void> => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    updateModuleStatus(moduleId, 'loading');

    try {
      // Simula delay de rede
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setState((prev) => ({
        ...prev,
        modules: {
          ...prev.modules,
          [moduleId]: {
            ...prev.modules[moduleId],
            status: 'active',
            lastSync: new Date().toISOString(),
          },
        },
        isLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: `Erro ao sincronizar ${moduleId}`,
        isLoading: false,
      }));
      updateModuleStatus(moduleId, 'error');
    }
  };

  // Verifica se módulo tem permissão específica
  const hasPermission = (moduleId: ModuleType, permission: string): boolean => {
    return state.modules[moduleId]?.permissions.includes(permission) || false;
  };

  const value: ModulesContextValue = {
    state,
    setActiveModule,
    toggleModule,
    updateModuleStatus,
    syncModule,
    hasPermission,
  };

  return (
    <ModulesContext.Provider value={value}>
      {children}
    </ModulesContext.Provider>
  );
}

// =====================================================================
// HOOK
// =====================================================================

export function useModules(): ModulesContextValue {
  const context = useContext(ModulesContext);
  if (!context) {
    throw new Error('useModules must be used within ModulesProvider');
  }
  return context;
}
