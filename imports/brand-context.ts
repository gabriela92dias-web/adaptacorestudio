import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface LayerState {
  color: string;
  opacity: number;
}

export interface BrandData {
  companyName: string;
  contactName: string;
  role: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  city: string;
  zip: string;
  primaryColor: string;
  secondaryColor: string;
}

interface BrandContextType {
  brand: BrandData;
  setBrand: React.Dispatch<React.SetStateAction<BrandData>>;
  updateBrand: (field: keyof BrandData, value: string) => void;
  layers: Record<string, LayerState>;
  setLayers: React.Dispatch<React.SetStateAction<Record<string, LayerState>>>;
  updateLayersWithHistory: (newLayers: Record<string, LayerState>) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  layerColors: Record<string, string>;
  customLogo: string | null;
  setCustomLogo: React.Dispatch<React.SetStateAction<string | null>>;
}

const INITIAL_BRAND: BrandData = {
  companyName: "Adapta",
  contactName: "João Silva",
  role: "Diretor de Comunicação",
  phone: "(11) 99999-9999",
  email: "contato@adapta.com.br",
  website: "www.adapta.com.br",
  address: "Rua Exemplo, 123",
  city: "São Paulo - SP",
  zip: "01000-000",
  primaryColor: "",
  secondaryColor: "",
};

const INITIAL_LAYERS: Record<string, LayerState> = {
  fundo: { color: "#E5E5E5", opacity: 1 },
  "+": { color: "#666666", opacity: 1 },
  AD: { color: "#999999", opacity: 1 },
};

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : { r: 0, g: 0, b: 0 };
}

function buildLayerColors(layers: Record<string, LayerState>) {
  const result: Record<string, string> = {};
  for (const [id, state] of Object.entries(layers)) {
    if (state.color === "transparent") {
      result[id] = "transparent";
    } else {
      const rgb = hexToRgb(state.color);
      result[id] = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${state.opacity})`;
    }
  }
  return result;
}

const BrandContext = createContext<BrandContextType | null>(null);

export function BrandProvider({ children }: { children: ReactNode }) {
  const [brand, setBrand] = useState<BrandData>(INITIAL_BRAND);
  const [layers, setLayers] = useState<Record<string, LayerState>>(INITIAL_LAYERS);
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  
  // Undo/Redo system
  const [history, setHistory] = useState<Record<string, LayerState>[]>([INITIAL_LAYERS]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const updateBrand = useCallback((field: keyof BrandData, value: string) => {
    setBrand((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateLayersWithHistory = useCallback((newLayers: Record<string, LayerState>) => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newLayers);
      // Limitar histórico a 50 itens
      if (newHistory.length > 50) {
        newHistory.shift();
        setHistoryIndex((i) => i);
        return newHistory;
      }
      setHistoryIndex(newHistory.length - 1);
      return newHistory;
    });
    setLayers(newLayers);
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setLayers(history[newIndex]);
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setLayers(history[newIndex]);
    }
  }, [historyIndex, history]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const layerColors = buildLayerColors(layers);

  return (
    <BrandContext.Provider
      value={{ 
        brand, 
        setBrand, 
        updateBrand, 
        layers, 
        setLayers, 
        updateLayersWithHistory,
        undo,
        redo,
        canUndo,
        canRedo,
        layerColors, 
        customLogo, 
        setCustomLogo 
      }}
    >
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const ctx = useContext(BrandContext);
  if (!ctx) throw new Error("useBrand must be used within BrandProvider");
  return ctx;
}

export { INITIAL_BRAND, INITIAL_LAYERS };