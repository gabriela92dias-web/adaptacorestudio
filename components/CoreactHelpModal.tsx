import React, { useState } from "react";
import { HelpCircle } from "lucide-react";
import { Button } from "./Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./Dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";
import styles from "./AppSidebar.module.css";

export function CoreactHelpModal({ isCollapsed }: { isCollapsed?: boolean }) {
  const [open, setOpen] = useState(false);

  const button = (
    <Button 
      variant="ghost" 
      size="icon-sm" 
      className={isCollapsed ? `${styles.iconButton} ${styles.interactiveElement}` : styles.iconButton} 
      aria-label="Ajuda e Manuais"
      onClick={() => setOpen(true)}
    >
      <HelpCircle size={16} />
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isCollapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              {button}
            </TooltipTrigger>
            <TooltipContent side="right">Ajuda do CoreAct</TooltipContent>
          </Tooltip>
        ) : (
          button
        )}
      </DialogTrigger>
      <DialogContent style={{ maxWidth: '800px', maxHeight: '85vh', overflowY: 'auto' }}>
        <DialogHeader>
          <DialogTitle style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
            📕 Cartilha de Onboarding: Adapta CoreAct
          </DialogTitle>
        </DialogHeader>
        <div style={{ lineHeight: '1.6', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          <p style={{ marginBottom: '1rem' }}>
            Bem-vindo(a) ao <strong>CoreAct</strong>, o coração operacional do <strong>Adapta CoreStudio</strong>. 
            Este manual foi desenhado para ajudar você a liderar, executar e acompanhar projetos com o máximo de clareza e eficiência.
          </p>

          <div style={{ marginBottom: '1.5rem' }}>
            <Button variant="outline" size="sm" onClick={() => window.open('/pitch', '_blank')}>
              🎤 Abrir Pitch Oficial
            </Button>
          </div>

          <hr style={{ margin: '1.5rem 0', borderColor: 'var(--border)' }} />

          <h3 style={{ color: 'var(--text-primary)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
            1. Primeiros Passos: Seu Primeiro Acesso
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            Como o CoreAct é um sistema blindado para segurança da empresa, o seu primeiro login funciona assim:
          </p>
          <ol style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>Acesse o nosso painel principal e crie sua conta (Sign Up) com seu e-mail de trabalho.</li>
            <li>Ao entrar pela primeira vez, você verá uma tela de <strong>"Acesso Negado aos Setores"</strong>. Isso é normal e esperado! O sistema está protegendo os dados.</li>
            <li><strong>O que fazer?</strong> Avise a Administração. A gestão vai acessar a aba <strong>"Equipe"</strong>, encontrar o seu nome recém-criado na listagem, e designar a qual <strong>Setor</strong> você tem permissão de acessar.</li>
            <li>Assim que a gestão confirmar, basta dar F5 (Atualizar a página) e todos os projetos do seu Setor aparecerão!</li>
          </ol>

          <hr style={{ margin: '1.5rem 0', borderColor: 'var(--border)' }} />

          <h3 style={{ color: 'var(--text-primary)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
            2. A Hierarquia do CoreAct: Como o Trabalho se Divide
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            O CoreAct organiza o trabalho do maior (A Estratégia) para o menor (A Execução de fato). É fundamental entender essa escada:
          </p>

          <div style={{ 
            padding: '1rem', 
            backgroundColor: 'var(--bg-secondary)', 
            borderRadius: 'var(--radius-md)',
            marginBottom: '1rem'
          }}>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.25rem' }}>🎯 Nível 1: Iniciativas</h4>
            <p style={{ marginBottom: '0.5rem' }}>A Iniciativa é o grande "Guarda-Chuva" estratégico. (Ex: "Lançamento Coleção 2026")</p>
            <p style={{ fontSize: '0.85rem' }}>Aqui não se coloca a mão na massa. A Iniciativa serve para agrupar vários projetos sob um mesmo teto e mostrar o progresso global à diretoria.</p>
          </div>

          <div style={{ 
            padding: '1rem', 
            backgroundColor: 'var(--bg-secondary)', 
            borderRadius: 'var(--radius-md)',
            marginBottom: '1rem'
          }}>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.25rem' }}>📁 Nível 2: Projetos</h4>
            <p style={{ marginBottom: '0.5rem' }}>Debaixo de uma Iniciativa, nascem os Projetos. O Projeto tem um dono responsável, orçamento e prazos. (Ex: "Produção do Vídeo Promocional")</p>
            <p style={{ fontSize: '0.85rem' }}>Projetos também podem ter Checklists rápidos (ex: "Assinar contrato da locação de estúdio").</p>
          </div>

          <div style={{ 
            padding: '1rem', 
            backgroundColor: 'var(--bg-secondary)', 
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem'
          }}>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.25rem' }}>📋 Nível 3: Etapas (Stages) e Tarefas (Tasks)</h4>
            <p style={{ marginBottom: '0.5rem' }}>O Projeto é dividido em Etapas (ex: "Pré-Produção do Vídeo"). E dentro das Etapas moram as Tarefas, que é onde a execução individual acontece de verdade.</p>
            <p style={{ fontSize: '0.85rem' }}>Exemplo da Tarefa: "Definir paleta de cores do cenário" (Atribuída diretamente para você, com Urgência Média).</p>
          </div>

          <hr style={{ margin: '1.5rem 0', borderColor: 'var(--border)' }} />

          <h3 style={{ color: 'var(--text-primary)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
            3. O Fluxo de Trabalho (Boas Práticas Diárias)
          </h3>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li><strong>Cheque seu Kanban (Meu CoreAct):</strong> Tudo que for atribuído a você aparece aqui! Mova as tarefas para "In Progress" quando começar.</li>
            <li><strong>Atualize o Progresso:</strong> Quando terminar uma tarefa, arraste para "Completed". A barra de progresso do projeto avança sozinha!</li>
            <li><strong>Não perca Prazos:</strong> Fique atento aos <em>Due Dates</em>. O sistema marca tarefas atrasadas em vermelho nos relatórios.</li>
            <li><strong>Mantenha os Dados Vivos:</strong> Evite criar projetos soltos. Estruture o trabalho conectando-o às Iniciativas e Setores corretos.</li>
          </ul>

        </div>
      </DialogContent>
    </Dialog>
  );
}
