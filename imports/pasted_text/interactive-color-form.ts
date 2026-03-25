// interactive-color-confirmation.ts
/**
 * FORMULÁRIO INTERATIVO DE CONFIRMAÇÃO DE CORES
 * Interativa CLI para preenchimento de formulários
 */

import inquirer from 'inquirer';
import { ColorConfirmationValidator } from './color-confirmation-validator';

const validator = new ColorConfirmationValidator();

async function interactiveConfirmationForm(): Promise<void> {
  console.log(`
╔════════════════════════════════════════════════════════════════════╗
║   ADAPTÁ - FORMULÁRIO DE CONFIRMAÇÃO DE CORES                      ║
║   Lei 004: Na dúvida, confirme antes de conclusão                  ║
╚════════════════════════════════════════════════════════════════════╝
  `);

  // Coleta informações
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'project',
      message: '📱 Nome do projeto/aplicação:',
      validate: (input) => input.length > 0
    },
    {
      type: 'input',
      name: 'component',
      message: '🎨 Nome do componente (ex: FAB-Novo, Modal-Erro):',
      validate: (input) => input.length > 0
    },
    {
      type: 'input',
      name: 'description',
      message: '📝 Descrição do propósito:',
      validate: (input) => input.length > 0
    },
    {
      type: 'confirm',
      name: 'hasDoubt',
      message: '❓ Tem ALGUMA dúvida sobre qual cor usar?',
      default: false
    },
    {
      type: 'input',
      name: 'doubtDescription',
      message: '🤔 Qual é a dúvida? (Não deixe em branco)',
      when: (answers) => answers.hasDoubt,
      validate: (input) => input.length > 0 || 'Você deve descrever a dúvida!'
    },
    {
      type: 'checkbox',
      name: 'colors',
      message: '🎨 Que cores serão usadas?',
      choices: [
        {
          name: '🔴 Erro (var(--status-error) / #FF0000)',
          value: { name: 'Erro', hex: '#FF0000', variable: 'var(--status-error)' }
        },
        {
          name: '🟢 Sucesso (var(--status-success) / #00FF00)',
          value: { name: 'Sucesso', hex: '#00FF00', variable: 'var(--status-success)' }
        },
        {
          name: '🟡 Aviso (var(--status-warning) / #FFFF00)',
          value: { name: 'Aviso', hex: '#FFFF00', variable: 'var(--status-warning)' }
        },
        {
          name: '🔵 Informação (var(--status-info) / #00FFFF)',
          value: { name: 'Informação', hex: '#00FFFF', variable: 'var(--status-info)' }
        },
        {
          name: '⚫ Preto (var(--neutral-black) / #000000)',
          value: { name: 'Preto', hex: '#000000', variable: 'var(--neutral-black)' }
        },
        {
          name: '⚪ Branco (var(--neutral-white) / #FFFFFF)',
          value: { name: 'Branco', hex: '#FFFFFF', variable: 'var(--neutral-white)' }
        },
        {
          name: '⚫⚪ Cinza (var(--neutral-gray) / #808080)',
          value: { name: 'Cinza', hex: '#808080', variable: 'var(--neutral-gray)' }
        }
      ],
      validate: (choices) => choices.length > 0 || 'Selecione pelo menos uma cor'
    },
    {
      type: 'input',
      name: 'requesterName',
      message: '👤 Seu nome:',
      validate: (input) => input.length > 0
    },
    {
      type: 'input',
      name: 'requesterEmail',
      message: '📧 Seu email:',
      validate: (input) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)
    }
  ]);

  // Se tem dúvida, bloqueia
  if (answers.hasDoubt) {
    console.log(`
╔════════════════════════════════════════════════════════════════════╗
║ ❌ LEI 004: DÚVIDA DETECTADA - BLOQUEIO DE CONFIRMAÇÃO             ║
╚════════════════════════════════════════════════════════════════════╝

Você indicou que tem dúvida sobre as cores.

De acordo com a Lei 004:
"Na dúvida sobre cores em aplicações, FABs, ferramentas,
devem ser confirmadas ANTES de ser concluída"

AÇÃO REQUERIDA:
1. Sua dúvida será documentada
2. Será enviada para o Design Lead
3. Você receberá resposta por email
4. SOMENTE DEPOIS poderá prosseguir

📋 Dúvida registrada: ${answers.doubtDescription}
📧 Design Lead será contatado

Aguarde resposta em: ${answers.requesterEmail}
    `);
    return;
  }

  // Cria confirmação
  const confirmation = validator.createConfirmationForm(
    answers.project,
    answers.component,
    answers.colors,
    {
      name: answers.requesterName,
      email: answers.requesterEmail
    }
  );

  console.log(`
╔════════════════════════════════════════════════════════════════════╗
║ ✅ FORMULÁRIO CRIADO - AGUARDANDO APROVAÇÃO                        ║
╚════════════════════════════════════════════════════════════════════╝

ID da Confirmação: ${confirmation.id}

Cores Solicitadas:
${confirmation.colors.map(c => `  - ${c.name}: ${c.variable}`).join('\n')}

📧 Design Lead será contatado para aprovação.

Status: PENDENTE

Você será notificado quando:
✓ Cores forem aprovadas
✓ Houver necessidade de ajustes

Referência: ${confirmation.id}
  `);
}

// Executar
interactiveConfirmationForm().catch(console.error);

export { interactiveConfirmationForm };
