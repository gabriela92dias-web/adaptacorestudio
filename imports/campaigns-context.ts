import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface CampaignPost {
  id: number;
  format: string;
  title: string;
  copy: string;
  cta: string;
}

export interface CampaignAction {
  id: string;
  title: string;
  responsible: string;
  deadline: string;
  status: "pending" | "in-progress" | "completed";
}

export interface CampaignGuideline {
  id: string;
  category: string;
  description: string;
}

export interface SavedCampaign {
  id: string;
  name: string;
  type: string;
  duration: number;
  channels: string[];
  posts: CampaignPost[];
  
  // Strategic fields
  objective?: string;
  targetAudience?: string;
  budget?: number;
  briefing?: string;
  guidelines?: CampaignGuideline[];
  actions?: CampaignAction[];
  startDate?: string;
  endDate?: string;
  kpis?: string[];
  references?: string;
  status?: "draft" | "approved" | "active" | "completed";
  approvedBy?: string;
  
  createdAt: string;
  updatedAt: string;
}

interface CampaignsContextType {
  campaigns: SavedCampaign[];
  saveCampaign: (campaign: Omit<SavedCampaign, "id" | "createdAt" | "updatedAt">) => void;
  updateCampaign: (id: string, updates: Partial<SavedCampaign>) => void;
  deleteCampaign: (id: string) => void;
  getCampaign: (id: string) => SavedCampaign | undefined;
}

const CampaignsContext = createContext<CampaignsContextType | null>(null);

const STORAGE_KEY = "adapta-campaigns";

export function CampaignsProvider({ children }: { children: ReactNode }) {
  const [campaigns, setCampaigns] = useState<SavedCampaign[]>([]);

  // Load campaigns from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setCampaigns(parsed);
      }
    } catch (error) {
      console.error("Error loading campaigns:", error);
    }
  }, []);

  // Save campaigns to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
    } catch (error) {
      console.error("Error saving campaigns:", error);
    }
  }, [campaigns]);

  const saveCampaign = (campaign: Omit<SavedCampaign, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const newCampaign: SavedCampaign = {
      ...campaign,
      id: `campaign-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now,
    };
    setCampaigns((prev) => [newCampaign, ...prev]);
  };

  const updateCampaign = (id: string, updates: Partial<SavedCampaign>) => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, ...updates, updatedAt: new Date().toISOString() }
          : c
      )
    );
  };

  const deleteCampaign = (id: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
  };

  const getCampaign = (id: string) => {
    return campaigns.find((c) => c.id === id);
  };

  return (
    <CampaignsContext.Provider
      value={{
        campaigns,
        saveCampaign,
        updateCampaign,
        deleteCampaign,
        getCampaign,
      }}
    >
      {children}
    </CampaignsContext.Provider>
  );
}

export function useCampaigns() {
  const ctx = useContext(CampaignsContext);
  if (!ctx) throw new Error("useCampaigns must be used within CampaignsProvider");
  return ctx;
}