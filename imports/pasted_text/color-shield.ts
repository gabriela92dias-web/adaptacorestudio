// shield-config.ts
import { colorPalette } from './adapta-colors';

interface ColorViolation {
  timestamp: string;
  location: string;
  foundColor: string;
  severity: 'CRITICAL' | 'WARNING';
  rule: string;
}

class ChromaticPurityShield {
  private violations: ColorViolation[] = [];
  private shieldActivated: string = '2026-03-11T03:45:00Z';
  
  constructor() {
    this.initializeShield();
  }

  private initializeShield(): void {
    console.log(`%c🛡️ CHROMATIC PURITY SHIELD ACTIVATED`, 'color: #455A4F; font-weight: bold');
    console.log(`Last Updated: 2026-03-11T03:45:00Z`);
    console.log(`Status: ENFORCING ABSOLUTE COLOR CONFORMITY`);
  }

  // Layer 1: Regex Validation
  validateColorFormat(value: string): boolean {
    const adapataColors = Object.values(colorPalette).flat();
    
    // Apenas CSS variables são permitidas
    const cssVarPattern = /^var\(--[a-z0-9-]+\)$/i;
    if (cssVarPattern.test(value)) {
      return true;
    }

    // Se encontrou uma cor hardcoded, falha
    const colorPatterns = [
      /^#[0-9A-Fa-f]{6}$/,
      /^rgb\([\d\s,]+\)$/,
      /^hsl\([\d\s,%]+\)$/
    ];

    for (const pattern of colorPatterns) {
      if (pattern.test(value)) {
        this.reportViolation({
          timestamp: new Date().toISOString(),
          location: 'Color Format Validation',
          foundColor: value,
          severity: 'CRITICAL',
          rule: 'RULE_001_ABSOLUTE_CONFORMITY'
        });
        return false;
      }
    }

    return true;
  }

  // Layer 3: Component Validator
  validateComponentStyles(element: HTMLElement): void {
    const computedStyle = window.getComputedStyle(element);
    const colorProperties = [
      'color',
      'backgroundColor',
      'borderColor',
      'fill',
      'stroke'
    ];

    colorProperties.forEach(prop => {
      const value = computedStyle.getPropertyValue(prop);
      if (value && !this.isValidAdaptaColor(value)) {
        this.reportViolation({
          timestamp: new Date().toISOString(),
          location: `${element.tagName}.${element.className}`,
          foundColor: value,
          severity: 'CRITICAL',
          rule: 'RULE_001_ABSOLUTE_CONFORMITY'
        });
      }
    });
  }

  // Layer 4: Runtime Monitor
  monitorDOMColors(): void {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName?.includes('style')) {
          const element = mutation.target as HTMLElement;
          this.validateComponentStyles(element);
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ['style']
    });
  }

  // Layer 5: Dependency Audit
  auditDependencies(): void {
    // Verifica se bibliotecas externas estão injetando cores
    const stylesheets = Array.from(document.styleSheets);
    
    stylesheets.forEach(sheet => {
      try {
        const rules = sheet.cssRules || [];
        Array.from(rules).forEach(rule => {
          if (rule instanceof CSSStyleRule) {
            const style = rule.style;
            ['color', 'backgroundColor', 'borderColor'].forEach(prop => {
              const value = style.getPropertyValue(prop);
              if (value && !this.isValidAdaptaColor(value)) {
                this.reportViolation({
                  timestamp: new Date().toISOString(),
                  location: `External Stylesheet: ${rule.selectorText}`,
                  foundColor: value,
                  severity: 'CRITICAL',
                  rule: 'RULE_005_THIRD_PARTY_FALLBACK'
                });
              }
            });
          }
        });
      } catch (e) {
        // CORS protection
      }
    });
  }

  // Validar contra paleta Adapta
  private isValidAdaptaColor(color: string): boolean {
    const allValidColors = Object.values(colorPalette).flat();
    
    // Normalize color para HEX
    const hexColor = this.rgbToHex(color) || color;
    
    return allValidColors.some(valid => 
      valid.hex.toUpperCase() === hexColor.toUpperCase()
    );
  }

  // Helper para converter RGB para HEX
  private rgbToHex(rgb: string): string | null {
    const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!match) return null;
    
    const r = parseInt(match[1]).toString(16).padStart(2, '0');
    const g = parseInt(match[2]).toString(16).padStart(2, '0');
    const b = parseInt(match[3]).toString(16).padStart(2, '0');
    
    return `#${r}${g}${b}`;
  }

  // Reportar violações
  private reportViolation(violation: ColorViolation): void {
    this.violations.push(violation);
    
    console.error(
      `%c❌ COLOR VIOLATION DETECTED`,
      'color: #CF6E9B; font-weight: bold; font-size: 14px'
    );
    console.error(`Rule: ${violation.rule}`);
    console.error(`Location: ${violation.location}`);
    console.error(`Found Color: ${violation.foundColor}`);
    console.error(`Timestamp: ${violation.timestamp}`);

    if (violation.severity === 'CRITICAL') {
      throw new Error(`CHROMATIC PURITY VIOLATION: ${violation.rule}`);
    }
  }

  // Gerar relatório
  generateAuditReport(): string {
    return `
CHROMATIC PURITY SHIELD AUDIT REPORT
=====================================
Generated: ${new Date().toISOString()}
Shield Activated: ${this.shieldActivated}

Total Violations: ${this.violations.length}

${this.violations.map(v => `
  ❌ ${v.rule}
     Location: ${v.location}
     Color: ${v.foundColor}
     Time: ${v.timestamp}
`).join('\n')}

Status: ${this.violations.length === 0 ? '✅ COMPLIANT' : '❌ NON-COMPLIANT'}
    `;
  }
}

export const shield = new ChromaticPurityShield();