/**
 * ═══════════════════════════════════════════════════════════════════
 * ADAPTA CORE STUDIO - CONTEXTS BARREL EXPORT
 * ═══════════════════════════════════════════════════════════════════
 * Build: v0.0.12-PHASE-3
 */

// Language Context
export { LanguageProvider, useLanguage } from './language-context';
export type { LanguageContextValue } from './language-context';

// Modules Context
export { ModulesProvider, useModules } from './modules-context';
export type {
  ModuleType,
  ModuleStatus,
  ModuleConfig,
  ModulesState,
  ModulesContextValue,
} from './modules-context';

// Brand Context
export { BrandProvider, useBrand } from './brand-context';
export type {
  BrandColor,
  BrandTypography,
  BrandAsset,
  Brand,
  BrandState,
  BrandContextValue,
} from './brand-context';

// Campaigns Context
export { CampaignsProvider, useCampaigns } from './campaigns-context';
export type {
  CampaignStatus,
  CampaignChannel,
  CampaignMetrics,
  Campaign,
  CampaignTemplate,
  CampaignsState,
  CampaignsContextValue,
} from './campaigns-context';
