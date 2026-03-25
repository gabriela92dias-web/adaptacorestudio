/**
 * ADAPTA CORE STUDIO - Chromatic Purity Shield
 * Sistema de validação de cores em 6 camadas
 * Versão: 2026.1.1 | Build: 1.0.5-chromatic-shield
 */

import { ADAPTA_PALETTE } from './palette-registry';

export interface ColorViolation {
  timestamp: string;
  location: string;
  foundColor: string;
  severity: 'CRITICAL' | 'WARNING';
  rule: string;
  details?: string;
}

export class ChromaticPurityShield {
  private violations: ColorViolation[] = [];
  private shieldActivated: string = '2026-03-11T04:45:00Z';
  private monitoringEnabled: boolean = false;
  
  constructor() {
    this.initializeShield();
  }

  private initializeShield(): void {
    console.log(
      '%c🛡️ CHROMATIC PURITY SHIELD ACTIVATED',
      'color: #8FA89B; font-weight: bold; font-size: 14px; background: #141A17; padding: 8px;'
    );
    console.log(
      '%cLast Updated: 2026-03-11T04:45:00Z',
      'color: #6A8A7A; font-size: 12px;'
    );
    console.log(
      '%cStatus: ENFORCING ABSOLUTE COLOR CONFORMITY',
      'color: #455A4F; font-weight: bold; font-size: 12px;'
    );
  }

  /**
   * LAYER 1: Regex Validation
   * Valida formato de cores antes de uso
   */
  validateColorFormat(value: string): boolean {
    // Permitir CSS variables
    const cssVarPattern = /^var\(--[a-z0-9-]+\)$/i;
    if (cssVarPattern.test(value)) {
      return true;
    }

    // Detectar cores hardcoded
    const colorPatterns = [
      { pattern: /^#[0-9A-Fa-f]{6}$/, name: 'HEX' },
      { pattern: /^rgb\([\d\s,]+\)$/, name: 'RGB' },
      { pattern: /^rgba\([\d\s,]+\)$/, name: 'RGBA' },
      { pattern: /^hsl\([\d\s,%]+\)$/, name: 'HSL' },
      { pattern: /^hsla\([\d\s,%]+\)$/, name: 'HSLA' },
    ];

    for (const { pattern, name } of colorPatterns) {
      if (pattern.test(value)) {
        this.reportViolation({
          timestamp: new Date().toISOString(),
          location: 'Color Format Validation',
          foundColor: value,
          severity: 'CRITICAL',
          rule: 'LAW_001_ABSOLUTE_COLOR_CONFORMITY',
          details: `Formato ${name} hardcoded detectado. Use var(--color-name).`,
        });
        return false;
      }
    }

    return true;
  }

  /**
   * LAYER 2: CSS Variable Validator
   * Valida se CSS variable existe na paleta
   */
  validateCSSVariable(varName: string): boolean {
    const cleanVarName = varName.replace(/^var\(--/, '').replace(/\)$/, '');
    
    // Verifica se existe na paleta
    const exists = ADAPTA_PALETTE.some(
      (color) => color.cssVar === `--${cleanVarName}`
    );

    if (!exists) {
      this.reportViolation({
        timestamp: new Date().toISOString(),
        location: 'CSS Variable Validation',
        foundColor: varName,
        severity: 'WARNING',
        rule: 'LAW_001_ABSOLUTE_COLOR_CONFORMITY',
        details: `CSS Variable --${cleanVarName} não encontrada na paleta Adapta.`,
      });
    }

    return exists;
  }

  /**
   * LAYER 3: Component Validator
   * Valida estilos computados de elementos
   */
  validateComponentStyles(element: HTMLElement): void {
    if (!element) return;

    const computedStyle = window.getComputedStyle(element);
    const colorProperties = [
      'color',
      'backgroundColor',
      'borderColor',
      'borderTopColor',
      'borderRightColor',
      'borderBottomColor',
      'borderLeftColor',
      'fill',
      'stroke',
    ];

    colorProperties.forEach((prop) => {
      const value = computedStyle.getPropertyValue(prop);
      if (value && value !== 'transparent' && value !== 'rgba(0, 0, 0, 0)') {
        const hexColor = this.rgbToHex(value);
        if (hexColor && !this.isValidAdaptaColor(hexColor)) {
          this.reportViolation({
            timestamp: new Date().toISOString(),
            location: `${element.tagName}.${element.className || 'no-class'}`,
            foundColor: `${prop}: ${value} (${hexColor})`,
            severity: 'CRITICAL',
            rule: 'LAW_001_ABSOLUTE_COLOR_CONFORMITY',
            details: 'Cor computada não pertence à paleta Adapta.',
          });
        }
      }
    });
  }

  /**
   * LAYER 4: Runtime Monitor
   * Monitora mudanças no DOM em tempo real
   */
  startRuntimeMonitor(): void {
    if (this.monitoringEnabled) return;

    this.monitoringEnabled = true;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName?.includes('style')
        ) {
          const element = mutation.target as HTMLElement;
          this.validateComponentStyles(element);
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ['style', 'class'],
    });

    console.log(
      '%c🔍 Runtime Monitor ATIVO',
      'color: #8FA89B; font-size: 12px;'
    );
  }

  stopRuntimeMonitor(): void {
    this.monitoringEnabled = false;
    console.log(
      '%c⏸️ Runtime Monitor PAUSADO',
      'color: #6A8A7A; font-size: 12px;'
    );
  }

  /**
   * LAYER 5: Dependency Audit
   * Audita folhas de estilo externas
   */
  auditDependencies(): void {
    const stylesheets = Array.from(document.styleSheets);
    let externalViolations = 0;

    stylesheets.forEach((sheet) => {
      try {
        const rules = sheet.cssRules || [];
        Array.from(rules).forEach((rule) => {
          if (rule instanceof CSSStyleRule) {
            const style = rule.style;
            ['color', 'backgroundColor', 'borderColor'].forEach((prop) => {
              const value = style.getPropertyValue(prop);
              if (value && !this.validateColorFormat(value)) {
                externalViolations++;
              }
            });
          }
        });
      } catch (e) {
        // CORS protection - stylesheet externa
      }
    });

    if (externalViolations > 0) {
      console.warn(
        `⚠️ ${externalViolations} violações detectadas em stylesheets externas`
      );
    }
  }

  /**
   * Verifica se cor está na paleta Adapta
   */
  private isValidAdaptaColor(hexColor: string): boolean {
    return ADAPTA_PALETTE.some(
      (color) => color.hex.toUpperCase() === hexColor.toUpperCase()
    );
  }

  /**
   * Converte RGB para HEX
   */
  private rgbToHex(rgb: string): string | null {
    const match = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!match) return null;

    const r = parseInt(match[1]).toString(16).padStart(2, '0');
    const g = parseInt(match[2]).toString(16).padStart(2, '0');
    const b = parseInt(match[3]).toString(16).padStart(2, '0');

    return `#${r}${g}${b}`.toUpperCase();
  }

  /**
   * Reporta violação
   */
  private reportViolation(violation: ColorViolation): void {
    this.violations.push(violation);

    console.error(
      '%c❌ COLOR VIOLATION DETECTED',
      'color: #FFA3B1; font-weight: bold; font-size: 14px; background: #141A17; padding: 8px;'
    );
    console.error(`Rule: ${violation.rule}`);
    console.error(`Location: ${violation.location}`);
    console.error(`Found Color: ${violation.foundColor}`);
    console.error(`Details: ${violation.details || 'N/A'}`);
    console.error(`Timestamp: ${violation.timestamp}`);

    // Não lançar erro para não quebrar app, apenas registrar
    if (violation.severity === 'CRITICAL') {
      console.error(
        '%c⚠️ VIOLAÇÃO CRÍTICA - Revisar imediatamente',
        'color: #FFA3B1; font-weight: bold;'
      );
    }
  }

  /**
   * Gera relatório completo
   */
  generateAuditReport(): string {
    const critical = this.violations.filter((v) => v.severity === 'CRITICAL');
    const warnings = this.violations.filter((v) => v.severity === 'WARNING');

    return `
╔════════════════════════════════════════════════════════════════════╗
║        CHROMATIC PURITY SHIELD - AUDIT REPORT                      ║
╚════════════════════════════════════════════════════════════════════╝

Generated: ${new Date().toISOString()}
Shield Activated: ${this.shieldActivated}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESUMO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Violations: ${this.violations.length}
Critical: ${critical.length}
Warnings: ${warnings.length}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DETALHES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${this.violations.map((v, i) => `
${i + 1}. [${v.severity}] ${v.rule}
   Location: ${v.location}
   Color: ${v.foundColor}
   Details: ${v.details || 'N/A'}
   Time: ${v.timestamp}
`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STATUS FINAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${this.violations.length === 0 ? '✅ COMPLIANT - Nenhuma violação detectada' : '❌ NON-COMPLIANT - Ação necessária'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;
  }

  /**
   * Limpa violações
   */
  clearViolations(): void {
    this.violations = [];
  }

  /**
   * Retorna violações
   */
  getViolations(): ColorViolation[] {
    return [...this.violations];
  }
}

// Singleton global
export const chromaticShield = new ChromaticPurityShield();
