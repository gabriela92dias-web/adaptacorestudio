/**
 * ADAPTA CORE STUDIO - BRAND CONTEXT
 * =======================================================================
 * Gerencia estado do módulo BRAND (identidades visuais, assets, guias)
 * Controla marcas, paletas de cores, tipografia, logos e guidelines
 * 
 * Build: v0.0.12-PHASE-3
 * =======================================================================
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

// =====================================================================
// TYPES & INTERFACES
// =====================================================================

export interface BrandColor {
  id: string;
  name: string;
  hex: string;
  rgb: string;
  usage: 'primary' | 'secondary' | 'accent' | 'neutral';
}

export interface BrandTypography {
  id: string;
  name: string;
  family: string;
  weights: number[];
  usage: 'heading' | 'body' | 'caption';
}

export interface BrandAsset {
  id: string;
  name: string;
  type: 'logo' | 'icon' | 'image' | 'pattern';
  url: string;
  variants?: string[];
  createdAt: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string;
  colors: BrandColor[];
  typography: BrandTypography[];
  assets: BrandAsset[];
  status: 'active' | 'archived' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export interface BrandState {
  brands: Brand[];
  currentBrand: Brand | null;
  isLoading: boolean;
  error: string | null;
}

export interface BrandContextValue {
  state: BrandState;
  setCurrentBrand: (brandId: string) => void;
  createBrand: (brand: Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBrand: (brandId: string, updates: Partial<Brand>) => void;
  deleteBrand: (brandId: string) => void;
  addColor: (brandId: string, color: Omit<BrandColor, 'id'>) => void;
  addAsset: (brandId: string, asset: Omit<BrandAsset, 'id' | 'createdAt'>) => void;
}

// =====================================================================
// BRAND STUDIO CONTEXT VALUE
// =====================================================================

export interface BrandStudioLayer {
  color: string;
  opacity: number;
  visible: boolean;
}

export interface BrandStudioContextValue {
  brand: Brand | null;
  updateBrand: (brandId: string, updates: Partial<Brand>) => void;
  layers: Record<string, BrandStudioLayer>;
  updateLayersWithHistory: (newLayers: Record<string, BrandStudioLayer>) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

// =====================================================================
// INITIAL STATE & MOCK DATA
// =====================================================================

const MOCK_BRANDS: Brand[] = [
  {
    id: 'adapta-main',
    name: 'ADAPTA Core',
    slug: 'adapta-core',
    description: 'Identidade visual principal da ADAPTA CORE STUDIO',
    colors: [
      {
        id: 'color-1',
        name: 'Teal Primary',
        hex: '#00D9A3',
        rgb: 'rgb(0, 217, 163)',
        usage: 'primary',
      },
      {
        id: 'color-2',
        name: 'Deep Teal',
        hex: '#141A17',
        rgb: 'rgb(20, 26, 23)',
        usage: 'neutral',
      },
    ],
    typography: [
      {
        id: 'typo-1',
        name: 'Inter',
        family: 'Inter, sans-serif',
        weights: [400, 500, 600, 700],
        usage: 'body',
      },
    ],
    assets: [
      {
        id: 'asset-1',
        name: 'ADAPTA Logo',
        type: 'logo',
        url: '/assets/logo.svg',
        variants: ['horizontal', 'vertical', 'icon'],
        createdAt: new Date().toISOString(),
      },
    ],
    status: 'active',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString(),
  },
];

const INITIAL_STATE: BrandState = {
  brands: MOCK_BRANDS,
  currentBrand: MOCK_BRANDS[0],
  isLoading: false,
  error: null,
};

// =====================================================================
// CONTEXT
// =====================================================================

const BrandContext = createContext<BrandContextValue | undefined>(undefined);
const BrandStudioContext = createContext<BrandStudioContextValue | undefined>(undefined);

// =====================================================================
// PROVIDER
// =====================================================================

interface BrandProviderProps {
  children: ReactNode;
}

export function BrandProvider({ children }: BrandProviderProps) {
  const [state, setState] = useState<BrandState>(INITIAL_STATE);

  // Define marca atual
  const setCurrentBrand = (brandId: string) => {
    const brand = state.brands.find((b) => b.id === brandId);
    if (brand) {
      setState((prev) => ({
        ...prev,
        currentBrand: brand,
      }));
    }
  };

  // Cria nova marca
  const createBrand = (brand: Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBrand: Brand = {
      ...brand,
      id: `brand-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      brands: [...prev.brands, newBrand],
    }));
  };

  // Atualiza marca existente
  const updateBrand = (brandId: string, updates: Partial<Brand>) => {
    setState((prev) => ({
      ...prev,
      brands: prev.brands.map((brand) =>
        brand.id === brandId
          ? { ...brand, ...updates, updatedAt: new Date().toISOString() }
          : brand
      ),
      currentBrand:
        prev.currentBrand?.id === brandId
          ? { ...prev.currentBrand, ...updates, updatedAt: new Date().toISOString() }
          : prev.currentBrand,
    }));
  };

  // Remove marca
  const deleteBrand = (brandId: string) => {
    setState((prev) => ({
      ...prev,
      brands: prev.brands.filter((brand) => brand.id !== brandId),
      currentBrand: prev.currentBrand?.id === brandId ? null : prev.currentBrand,
    }));
  };

  // Adiciona cor a uma marca
  const addColor = (brandId: string, color: Omit<BrandColor, 'id'>) => {
    const newColor: BrandColor = {
      ...color,
      id: `color-${Date.now()}`,
    };

    setState((prev) => ({
      ...prev,
      brands: prev.brands.map((brand) =>
        brand.id === brandId
          ? {
              ...brand,
              colors: [...brand.colors, newColor],
              updatedAt: new Date().toISOString(),
            }
          : brand
      ),
    }));
  };

  // Adiciona asset a uma marca
  const addAsset = (brandId: string, asset: Omit<BrandAsset, 'id' | 'createdAt'>) => {
    const newAsset: BrandAsset = {
      ...asset,
      id: `asset-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      brands: prev.brands.map((brand) =>
        brand.id === brandId
          ? {
              ...brand,
              assets: [...brand.assets, newAsset],
              updatedAt: new Date().toISOString(),
            }
          : brand
      ),
    }));
  };

  const value: BrandContextValue = {
    state,
    setCurrentBrand,
    createBrand,
    updateBrand,
    deleteBrand,
    addColor,
    addAsset,
  };

  // ===================================
  // BRAND STUDIO STATE (Layers history)
  // ===================================
  const [layersHistory, setLayersHistory] = useState<Record<string, BrandStudioLayer>[]>([{
    "fundo": { color: "#E5E5E5", opacity: 1, visible: true },
    "+": { color: "#FFFFFF", opacity: 1, visible: true },
    "AD": { color: "#777777", opacity: 1, visible: true }
  }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const updateLayersWithHistory = (newLayers: Record<string, BrandStudioLayer>) => {
    const newHistory = layersHistory.slice(0, historyIndex + 1);
    newHistory.push(newLayers);
    setLayersHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < layersHistory.length - 1) {
      setHistoryIndex(historyIndex + 1);
    }
  };

  const brandStudioValue: BrandStudioContextValue = {
    brand: state.currentBrand,
    updateBrand,
    layers: layersHistory[historyIndex],
    updateLayersWithHistory,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < layersHistory.length - 1,
  };

  return (
    <BrandContext.Provider value={value}>
      <BrandStudioContext.Provider value={brandStudioValue}>
        {children}
      </BrandStudioContext.Provider>
    </BrandContext.Provider>
  );
}

// =====================================================================
// HOOK
// =====================================================================

export function useBrand(): BrandContextValue {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrand must be used within BrandProvider');
  }
  return context;
}

export function useBrandStudio(): BrandStudioContextValue {
  const context = useContext(BrandStudioContext);
  if (!context) {
    throw new Error('useBrandStudio must be used within BrandProvider');
  }
  return context;
}
