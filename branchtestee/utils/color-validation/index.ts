/**
 * ADAPTA CORE STUDIO - Color Validation System
 * Sistema completo de validação e confirmação de cores
 * Versão: 2026.1.1 | Build: 1.0.5-color-validation-index
 */

export { ChromaticPurityShield, chromaticShield } from './chromatic-shield';
export type { ColorViolation } from './chromatic-shield';

export {
  ColorConfirmationSystem,
  colorConfirmationSystem,
} from './color-confirmation-system';
export type { ColorConfirmation } from './color-confirmation-system';

export {
  ADAPTA_PALETTE,
  getColorByCSSVar,
  getColorByHex,
  getColorsBySpectrum,
  isValidAdaptaColor,
} from './palette-registry';
export type { AdaptaColor } from './palette-registry';

/**
 * Inicializa o sistema de validação
 */
export function initializeColorValidation(options?: {
  enableRuntimeMonitor?: boolean;
  enableConsoleLogging?: boolean;
}) {
  const { enableRuntimeMonitor = false, enableConsoleLogging = true } =
    options || {};

  if (!enableConsoleLogging) {
    // Silencia logs do shield
    console.log = () => {};
  }

  if (enableRuntimeMonitor) {
    chromaticShield.startRuntimeMonitor();
  }

  console.log(
    '%c🛡️ Color Validation System Initialized',
    'color: #8FA89B; font-weight: bold;'
  );
}

/**
 * Gera relatório completo
 */
export function generateFullReport(): string {
  const shieldReport = chromaticShield.generateAuditReport();
  const confirmationReport = colorConfirmationSystem.generateReport();

  return `
╔════════════════════════════════════════════════════════════════════╗
║        ADAPTA CORE STUDIO - RELATÓRIO COMPLETO                     ║
║        Sistema de Validação de Cores                               ║
╚════════════════════════════════════════════════════════════════════╝

${shieldReport}

${confirmationReport}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LEIS DO DESIGN SYSTEM ADAPTA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LAW 001: Conformidade Cromática Absoluta
         Nenhuma cor fora da paleta em nenhuma circunstância.

LAW 002: Implementação com Conformidade
         Novos recursos devem usar APENAS cores da paleta.

LAW 003: Confirmação de Ferramentas Externas
         Ferramentas externas DEVEM ter cores confirmadas.

LAW 004: Resolução de Dúvidas
         Na dúvida sobre cores - CONFIRME antes de implementar.

LAW 005: Zero Assunção
         NUNCA assuma ou suponha qual cor usar. SEMPRE confirme.

LAW 006: Tratamento Especial de FAB
         FABs DEVEM ter cores confirmadas explicitamente.

LAW 007: Cores de Bibliotecas Externas
         Se biblioteca usar cores, DEVE ser confirmado mapeamento.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `;
}
