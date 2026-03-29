/**
 * ADAPTA CORE STUDIO - Color Confirmation System
 * Sistema de confirmação obrigatória de cores (Lei 004)
 * Versão: 2026.1.1 | Build: 1.0.5-color-confirmation
 */

export interface ColorConfirmation {
  id: string;
  timestamp: string;
  project: string;
  component: string;
  colors: Array<{
    name: string;
    hex: string;
    variable: string;
    doubt?: string;
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
  notes?: string;
}

export class ColorConfirmationSystem {
  private confirmations: Map<string, ColorConfirmation> = new Map();
  private storageKey = 'adapta-color-confirmations';

  constructor() {
    this.loadFromStorage();
  }

  /**
   * LEI 004: Valida se implementação tem confirmação
   */
  validateWithConfirmation(
    project: string,
    component: string,
    hasDoubt: boolean = false
  ): {
    valid: boolean;
    reason?: string;
    confirmationRequired: boolean;
    confirmationId?: string;
  } {
    // LEI 004: Na dúvida, DEVE ser confirmada
    if (hasDoubt) {
      return {
        valid: false,
        reason:
          'LEI 004: Na dúvida sobre cores - DEVE ser confirmada antes de conclusão',
        confirmationRequired: true,
      };
    }

    // Verifica se existe confirmação aprovada
    const confirmation = this.findApprovedConfirmation(project, component);

    if (!confirmation) {
      return {
        valid: false,
        reason: 'Cores não têm confirmação aprovada. Crie formulário de confirmação.',
        confirmationRequired: true,
      };
    }

    return {
      valid: true,
      confirmationRequired: false,
      confirmationId: confirmation.id,
    };
  }

  /**
   * Cria nova solicitação de confirmação
   */
  createConfirmation(
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
      colors,
      requester: {
        name: requester.name,
        email: requester.email,
        date: new Date().toISOString(),
      },
      approver: {
        name: '',
        email: '',
        signature: '',
        date: '',
        approved: false,
      },
      status: 'PENDING',
    };

    this.confirmations.set(confirmation.id, confirmation);
    this.saveToStorage();

    return confirmation;
  }

  /**
   * Design Lead aprova confirmação
   */
  approveConfirmation(
    confirmationId: string,
    approver: {
      name: string;
      email: string;
    },
    approved: boolean,
    notes?: string
  ): ColorConfirmation | null {
    const confirmation = this.confirmations.get(confirmationId);

    if (!confirmation) {
      console.error(`Confirmação ${confirmationId} não encontrada`);
      return null;
    }

    confirmation.approver = {
      name: approver.name,
      email: approver.email,
      signature: this.generateSignature(approver.name, approver.email),
      date: new Date().toISOString(),
      approved,
    };

    confirmation.status = approved ? 'APPROVED' : 'REJECTED';
    confirmation.notes = notes;

    this.confirmations.set(confirmationId, confirmation);
    this.saveToStorage();

    return confirmation;
  }

  /**
   * Busca confirmação aprovada
   */
  findApprovedConfirmation(
    project: string,
    component: string
  ): ColorConfirmation | undefined {
    return Array.from(this.confirmations.values()).find(
      (c) =>
        c.project === project &&
        c.component === component &&
        c.status === 'APPROVED'
    );
  }

  /**
   * Lista todas as confirmações
   */
  getAllConfirmations(): ColorConfirmation[] {
    return Array.from(this.confirmations.values());
  }

  /**
   * Lista confirmações pendentes
   */
  getPendingConfirmations(): ColorConfirmation[] {
    return Array.from(this.confirmations.values()).filter(
      (c) => c.status === 'PENDING'
    );
  }

  /**
   * Lista confirmações aprovadas
   */
  getApprovedConfirmations(): ColorConfirmation[] {
    return Array.from(this.confirmations.values()).filter(
      (c) => c.status === 'APPROVED'
    );
  }

  /**
   * Deleta confirmação
   */
  deleteConfirmation(confirmationId: string): boolean {
    const deleted = this.confirmations.delete(confirmationId);
    if (deleted) {
      this.saveToStorage();
    }
    return deleted;
  }

  /**
   * Gera relatório
   */
  generateReport(): string {
    const all = this.getAllConfirmations();
    const pending = this.getPendingConfirmations();
    const approved = this.getApprovedConfirmations();
    const rejected = all.filter((c) => c.status === 'REJECTED');

    return `
╔════════════════════════════════════════════════════════════════════╗
║        RELATÓRIO DE CONFIRMAÇÕES DE CORES                          ║
╚════════════════════════════════════════════════════════════════════╝

RESUMO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Aprovadas:        ${approved.length}
⏳ Pendentes:        ${pending.length}
❌ Rejeitadas:       ${rejected.length}
📊 Total:            ${all.length}

DETALHES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${all.map((c) => `
📋 ${c.project} > ${c.component}
   Status: ${c.status}
   ID: ${c.id}
   Cores: ${c.colors.map((col) => col.variable).join(', ')}
   Solicitante: ${c.requester.name} (${new Date(c.requester.date).toLocaleDateString()})
   ${c.approver.approved ? `✅ Aprovado por: ${c.approver.name} em ${new Date(c.approver.date).toLocaleDateString()}` : '⏳ Aguardando aprovação'}
   ${c.notes ? `Notas: ${c.notes}` : ''}
`).join('\n')}

RECOMENDAÇÕES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${pending.length > 0 ? `⚠️  ${pending.length} confirmação(ões) pendente(s) - Contate Design Lead` : '✅ Todas as cores foram confirmadas'}

Data do Relatório: ${new Date().toISOString()}
    `;
  }

  /**
   * Gera ID único
   */
  private generateId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 10);
    return `COLOR-CONF-${timestamp}-${random}`.toUpperCase();
  }

  /**
   * Gera assinatura digital
   */
  private generateSignature(name: string, email: string): string {
    const data = `${name}:${email}:${new Date().toISOString()}`;
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).toUpperCase().padStart(16, '0');
  }

  /**
   * Salva no localStorage
   */
  private saveToStorage(): void {
    try {
      const data = Array.from(this.confirmations.entries());
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar confirmações:', error);
    }
  }

  /**
   * Carrega do localStorage
   */
  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const entries = JSON.parse(data);
        this.confirmations = new Map(entries);
      }
    } catch (error) {
      console.error('Erro ao carregar confirmações:', error);
    }
  }

  /**
   * Limpa todas as confirmações
   */
  clearAll(): void {
    this.confirmations.clear();
    this.saveToStorage();
  }
}

// Singleton global
export const colorConfirmationSystem = new ColorConfirmationSystem();
