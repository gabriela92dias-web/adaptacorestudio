// color-confirmation-validator.ts
/**
 * SISTEMA DE VALIDAÇÃO COM CONFIRMAÇÃO OBRIGATÓRIA DE CORES
 * Lei 004: Na dúvida, deve ser confirmada antes de conclusão
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

interface ColorConfirmation {
  id: string;
  timestamp: string;
  project: string;
  component: string;
  colors: Array<{
    name: string;
    hex: string;
    variable: string;
    doubts?: string;
  }>;
  requester: {
    name: string;
    email: string;
    date: string;
  };
  approver: {
    name: string;
    email: string;
    signature: string;
    date: string;
    approved: boolean;
  };
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'AWAITING_CONFIRMATION';
}

class ColorConfirmationValidator {
  private confirmations: ColorConfirmation[] = [];
  private confirmationDir = '.adapta-color-confirmations';

  constructor() {
    this.ensureConfirmationDir();
    this.loadConfirmations();
  }

  /**
   * REGRA: Na dúvida, deve ser confirmada
   * Se qualquer dúvida for detectada, bloqueia
   */
  validateWithConfirmation(
    project: string,
    component: string,
    colors: Array<{ name: string; hex: string; variable: string }>,
    hasDoubt: boolean = false
  ): { valid: boolean; reason?: string; confirmationRequired: boolean } {
    // ========== LEI 004: NA DÚVIDA, CONFIRME ==========
    
    if (hasDoubt) {
      return {
        valid: false,
        reason: 'LAW_004: Na dúvida sobre cores - DEVE ser confirmada antes de conclusão',
        confirmationRequired: true
      };
    }

    // Verifica se existe confirmação prévia
    const hasConfirmation = this.confirmations.some(c =>
      c.project === project &&
      c.component === component &&
      c.status === 'APPROVED'
    );

    if (!hasConfirmation) {
      return {
        valid: false,
        reason: 'Cores não têm confirmação aprovada. Use createConfirmationForm()',
        confirmationRequired: true
      };
    }

    return {
      valid: true,
      confirmationRequired: false
    };
  }

  /**
   * Cria formulário de confirmação de cores
   */
  createConfirmationForm(
    project: string,
    component: string,
    colors: Array<{
      name: string;
      hex: string;
      variable: string;
      doubt?: string;
    }>,
    requester: { name: string; email: string }
  ): ColorConfirmation {
    const confirmation: ColorConfirmation = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      project,
      component,
      colors: colors.map(c => ({
        name: c.name,
        hex: c.hex,
        variable: c.variable,
        doubts: c.doubt
      })),
      requester: {
        name: requester.name,
        email: requester.email,
        date: new Date().toISOString()
      },
      approver: {
        name: '',
        email: '',
        signature: '',
        date: '',
        approved: false
      },
      status: 'PENDING'
    };

    this.confirmations.push(confirmation);
    this.saveConfirmation(confirmation);

    return confirmation;
  }

  /**
   * Design Lead aprova cores
   */
  approveColors(
    confirmationId: string,
    approver: {
      name: string;
      email: string;
    },
    approved: boolean,
    notes?: string
  ): ColorConfirmation | null {
    const confirmation = this.confirmations.find(c => c.id === confirmationId);

    if (!confirmation) {
      console.error(`Confirmação ${confirmationId} não encontrada`);
      return null;
    }

    confirmation.approver = {
      name: approver.name,
      email: approver.email,
      signature: this.generateSignature(approver.name, approver.email),
      date: new Date().toISOString(),
      approved
    };

    confirmation.status = approved ? 'APPROVED' : 'REJECTED';

    this.saveConfirmation(confirmation);

    return confirmation;
  }

  /**
   * Obtém status de confirmação para FAB
   */
  getFABColorStatus(project: string, fabName: string): {
    confirmed: boolean;
    colors: any[];
    status: string;
    approver?: string;
  } {
    const confirmation = this.confirmations.find(c =>
      c.project === project &&
      c.component === fabName &&
      c.status === 'APPROVED'
    );

    if (!confirmation) {
      return {
        confirmed: false,
        colors: [],
        status: 'UNCONFIRMED - Bloqueia deploy'
      };
    }

    return {
      confirmed: true,
      colors: confirmation.colors,
      status: 'CONFIRMED',
      approver: confirmation.approver.name
    };
  }

  /**
   * Valida antes de fazer merge
   */
  validatePreMerge(project: string, components: string[]): {
    canMerge: boolean;
    missingConfirmations: string[];
    issues: string[];
  } {
    const missingConfirmations: string[] = [];
    const issues: string[] = [];

    for (const component of components) {
      const hasConfirmation = this.confirmations.some(c =>
        c.project === project &&
        c.component === component &&
        c.status === 'APPROVED'
      );

      if (!hasConfirmation) {
        missingConfirmations.push(component);
        issues.push(
          `[LEI 004] Componente "${component}" sem confirmação de cores. ` +
          `Crie e obtenha aprovação antes de fazer merge.`
        );
      }
    }

    return {
      canMerge: missingConfirmations.length === 0,
      missingConfirmations,
      issues
    };
  }

  /**
   * Gera relatório de confirmações
   */
  generateConfirmationReport(): string {
    const pending = this.confirmations.filter(c => c.status === 'PENDING').length;
    const approved = this.confirmations.filter(c => c.status === 'APPROVED').length;
    const rejected = this.confirmations.filter(c => c.status === 'REJECTED').length;

    return `
╔════════════════════════════════════════════════════════════════════╗
║        RELATÓRIO DE CONFIRMAÇÕES DE CORES                          ║
╚════════════════════════════════════════════════════════════════════╝

RESUMO
─────────────────────────────────────────────────────────────────────
✅ Aprovadas:        ${approved}
⏳ Pendentes:        ${pending}
❌ Rejeitadas:       ${rejected}
📊 Total:            ${this.confirmations.length}

DETALHES
─────────────────────────────────────────────────────────────────────

${this.confirmations.map(c => `
📋 ${c.project} > ${c.component}
   Status: ${c.status}
   Cores:  ${c.colors.map(col => col.variable).join(', ')}
   Solicitante: ${c.requester.name} (${c.requester.date})
   ${c.approver.approved ? `✅ Aprovado por: ${c.approver.name}` : '⏳ Aguardando aprovação'}
`).join('\n')}

RECOMENDAÇÕES
─────────────────────────────────────────────────────────────────────
${pending > 0 ? `⚠️  ${pending} confirmação(ões) pendente(s) - Contate Design Lead` : '✅ Todas as cores foram confirmadas'}

Data do Relatório: ${new Date().toISOString()}
    `;
  }

  // ========== UTILITÁRIOS ==========

  private ensureConfirmationDir(): void {
    if (!fs.existsSync(this.confirmationDir)) {
      fs.mkdirSync(this.confirmationDir, { recursive: true });
    }
  }

  private generateId(): string {
    return `COLOR-CONF-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
  }

  private generateSignature(name: string, email: string): string {
    return crypto
      .createHash('sha256')
      .update(`${name}:${email}:${new Date().toISOString()}`)
      .digest('hex')
      .substring(0, 16)
      .toUpperCase();
  }

  private saveConfirmation(confirmation: ColorConfirmation): void {
    const filePath = path.join(
      this.confirmationDir,
      `${confirmation.id}.json`
    );
    fs.writeFileSync(filePath, JSON.stringify(confirmation, null, 2));
  }

  private loadConfirmations(): void {
    if (!fs.existsSync(this.confirmationDir)) {
      return;
    }

    const files = fs.readdirSync(this.confirmationDir);
    files.forEach(file => {
      if (file.endsWith('.json')) {
        const data = fs.readFileSync(
          path.join(this.confirmationDir, file),
          'utf-8'
        );
        this.confirmations.push(JSON.parse(data));
      }
    });
  }
}

export { ColorConfirmationValidator, ColorConfirmation };
