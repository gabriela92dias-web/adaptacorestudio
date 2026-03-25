/**
 * ADAPTA CORE STUDIO - CAMPAIGNS CONTEXT
 * =======================================================================
 * Gerencia estado do módulo MARKETING (campanhas, templates, publicações)
 * Controla criação, agendamento e análise de campanhas de marketing
 * 
 * Build: v0.0.12-PHASE-3
 * =======================================================================
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

// =====================================================================
// TYPES & INTERFACES
// =====================================================================

export type CampaignStatus = 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'archived';

export type CampaignChannel = 'email' | 'social' | 'web' | 'paid' | 'organic' | 'multi';

export interface CampaignMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  conversionRate: number;
  roi: number;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  status: CampaignStatus;
  channel: CampaignChannel;
  brandId: string;
  startDate: string;
  endDate?: string;
  budget?: number;
  metrics: CampaignMetrics;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CampaignTemplate {
  id: string;
  name: string;
  description: string;
  channel: CampaignChannel;
  content: Record<string, any>;
  thumbnail?: string;
  createdAt: string;
}

export interface CampaignsState {
  campaigns: Campaign[];
  templates: CampaignTemplate[];
  currentCampaign: Campaign | null;
  filters: {
    status?: CampaignStatus;
    channel?: CampaignChannel;
    brandId?: string;
  };
  isLoading: boolean;
  error: string | null;
}

export interface CampaignsContextValue {
  state: CampaignsState;
  setCurrentCampaign: (campaignId: string) => void;
  createCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt' | 'metrics'>) => void;
  updateCampaign: (campaignId: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (campaignId: string) => void;
  updateCampaignStatus: (campaignId: string, status: CampaignStatus) => void;
  setFilters: (filters: CampaignsState['filters']) => void;
  getFilteredCampaigns: () => Campaign[];
  createTemplate: (template: Omit<CampaignTemplate, 'id' | 'createdAt'>) => void;
}

// =====================================================================
// INITIAL STATE & MOCK DATA
// =====================================================================

const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'campaign-1',
    name: 'Lançamento ADAPTA 2026',
    description: 'Campanha de lançamento da nova versão da plataforma',
    status: 'active',
    channel: 'multi',
    brandId: 'adapta-main',
    startDate: '2026-03-01T00:00:00.000Z',
    endDate: '2026-03-31T23:59:59.000Z',
    budget: 50000,
    metrics: {
      impressions: 125000,
      clicks: 8750,
      conversions: 523,
      ctr: 7.0,
      conversionRate: 5.98,
      roi: 3.45,
    },
    tags: ['launch', 'platform', '2026'],
    createdAt: '2026-02-15T00:00:00.000Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'campaign-2',
    name: 'Email Marketing - Q1',
    description: 'Campanha de email marketing para Q1 2026',
    status: 'scheduled',
    channel: 'email',
    brandId: 'adapta-main',
    startDate: '2026-04-01T00:00:00.000Z',
    budget: 15000,
    metrics: {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      ctr: 0,
      conversionRate: 0,
      roi: 0,
    },
    tags: ['email', 'q1', 'automation'],
    createdAt: '2026-03-10T00:00:00.000Z',
    updatedAt: new Date().toISOString(),
  },
];

const MOCK_TEMPLATES: CampaignTemplate[] = [
  {
    id: 'template-1',
    name: 'Product Launch Email',
    description: 'Template para emails de lançamento de produto',
    channel: 'email',
    content: {
      subject: 'Novidade! {{product_name}}',
      preheader: 'Descubra o que preparamos para você',
      sections: ['hero', 'features', 'cta', 'footer'],
    },
    createdAt: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'template-2',
    name: 'Social Media Post',
    description: 'Template para posts em redes sociais',
    channel: 'social',
    content: {
      platforms: ['instagram', 'linkedin', 'twitter'],
      format: 'carousel',
      slides: 3,
    },
    createdAt: '2026-01-20T00:00:00.000Z',
  },
];

const INITIAL_STATE: CampaignsState = {
  campaigns: MOCK_CAMPAIGNS,
  templates: MOCK_TEMPLATES,
  currentCampaign: null,
  filters: {},
  isLoading: false,
  error: null,
};

// =====================================================================
// CONTEXT
// =====================================================================

const CampaignsContext = createContext<CampaignsContextValue | undefined>(undefined);

// =====================================================================
// PROVIDER
// =====================================================================

interface CampaignsProviderProps {
  children: ReactNode;
}

export function CampaignsProvider({ children }: CampaignsProviderProps) {
  const [state, setState] = useState<CampaignsState>(INITIAL_STATE);

  // Define campanha atual
  const setCurrentCampaign = (campaignId: string) => {
    const campaign = state.campaigns.find((c) => c.id === campaignId);
    if (campaign) {
      setState((prev) => ({
        ...prev,
        currentCampaign: campaign,
      }));
    }
  };

  // Cria nova campanha
  const createCampaign = (
    campaign: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt' | 'metrics'>
  ) => {
    const newCampaign: Campaign = {
      ...campaign,
      id: `campaign-${Date.now()}`,
      metrics: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        ctr: 0,
        conversionRate: 0,
        roi: 0,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      campaigns: [...prev.campaigns, newCampaign],
    }));
  };

  // Atualiza campanha existente
  const updateCampaign = (campaignId: string, updates: Partial<Campaign>) => {
    setState((prev) => ({
      ...prev,
      campaigns: prev.campaigns.map((campaign) =>
        campaign.id === campaignId
          ? { ...campaign, ...updates, updatedAt: new Date().toISOString() }
          : campaign
      ),
      currentCampaign:
        prev.currentCampaign?.id === campaignId
          ? { ...prev.currentCampaign, ...updates, updatedAt: new Date().toISOString() }
          : prev.currentCampaign,
    }));
  };

  // Remove campanha
  const deleteCampaign = (campaignId: string) => {
    setState((prev) => ({
      ...prev,
      campaigns: prev.campaigns.filter((campaign) => campaign.id !== campaignId),
      currentCampaign: prev.currentCampaign?.id === campaignId ? null : prev.currentCampaign,
    }));
  };

  // Atualiza status de uma campanha
  const updateCampaignStatus = (campaignId: string, status: CampaignStatus) => {
    updateCampaign(campaignId, { status });
  };

  // Define filtros
  const setFilters = (filters: CampaignsState['filters']) => {
    setState((prev) => ({
      ...prev,
      filters,
    }));
  };

  // Retorna campanhas filtradas
  const getFilteredCampaigns = (): Campaign[] => {
    let filtered = state.campaigns;

    if (state.filters.status) {
      filtered = filtered.filter((c) => c.status === state.filters.status);
    }

    if (state.filters.channel) {
      filtered = filtered.filter((c) => c.channel === state.filters.channel);
    }

    if (state.filters.brandId) {
      filtered = filtered.filter((c) => c.brandId === state.filters.brandId);
    }

    return filtered;
  };

  // Cria novo template
  const createTemplate = (template: Omit<CampaignTemplate, 'id' | 'createdAt'>) => {
    const newTemplate: CampaignTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      templates: [...prev.templates, newTemplate],
    }));
  };

  const value: CampaignsContextValue = {
    state,
    setCurrentCampaign,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    updateCampaignStatus,
    setFilters,
    getFilteredCampaigns,
    createTemplate,
  };

  return <CampaignsContext.Provider value={value}>{children}</CampaignsContext.Provider>;
}

// =====================================================================
// HOOK
// =====================================================================

export function useCampaigns(): CampaignsContextValue {
  const context = useContext(CampaignsContext);
  if (!context) {
    throw new Error('useCampaigns must be used within CampaignsProvider');
  }
  return context;
}
