/**
 * ═══════════════════════════════════════════════════════════════
 * ADAPTA PLATFORM - Brand Assistant (Ada)
 * ═══════════════════════════════════════════════════════════════
 * 
 * Assistente de IA para orientação criativa de marca
 * Responde perguntas sobre cores, fontes, diretrizes e boas práticas
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { Sparkles, Send, RotateCcw, X, Bot, Lightbulb, ChevronDown, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { fonts } from "../utils/font-tokens";
import { useTheme } from "../utils/theme-context";
const projectId = "mock_project_id";
const publicAnonKey = "mock_anon_key";

// ═══════════════════════════════════════════════════════════════
//  CONFIG
// ═══════════════════════════════════════════════════════════════

// MOCK MODE: Para produção, configure uma API real (OpenAI, Anthropic, etc.)
// e substitua USE_MOCK_RESPONSES por false
const USE_MOCK_RESPONSES = true;

// Para integração real, descomente e configure:
// const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-92b477aa/chat`;
// const OPENAI_API_KEY = "YOUR_API_KEY_HERE"; // Substitua pela sua chave real

// ─── SUGGESTED QUESTIONS ───

const PLACEHOLDER_SUGGESTIONS = [
  "Preciso criar um post de Dia das Maes, me ajuda?",
  "Quero fazer um banner mas nao sei por onde comecar",
  "Posso usar cores da categoria Energia numa campanha?",
  "Qual a diferenca entre tier Paleta e Escala?",
  "Como faco pra peça nao ficar monotona so com Alma?",
  "Quero usar cores de Segurança num material, pode?",
  "Qual fonte usar num post de Instagram?",
  "Posso usar Creepy Notes numa peca de Halloween?",
];

// ═══════════════════════════════════════════════════════════════
//  MOCK RESPONSES
// ═══════════════════════════════════════════════════════════════

const MOCK_RESPONSES: Record<string, string> = {
  default: `Opa! Entendi sua pergunta sobre **${Math.random() > 0.5 ? 'design de marca' : 'identidade visual'}**.

Deixa eu te dar algumas **dicas praticas**:

**1. Cores da marca**
Use as cores da Cartilha Cromatica ADAPTA v2026.1:
- **Verde Core** (#141A17 a #F0F4F2): sempre presente
- **Color Core**: cores de design para ferramentas criativas

**2. Hierarquia visual**
- Titulos: use fontes do sistema tipografico
- Corpo de texto: mantenha legibilidade com bom contraste
- Destaque: use cores de accento com moderacao

**3. Equilibrio**
Lembre-se da regra: neutral-500 em **no maximo 20% do layout**.

Precisa de mais detalhes sobre algum ponto especifico?`,

  cores: `Otima pergunta sobre **cores**! Vou te explicar:

**Cartilha Cromatica ADAPTA v2026.1** tem 9 espectros:

**Verde Core** (sempre presente):
- Base: #141A17 (neutral-950)
- Tons claros: ate #F0F4F2 (neutral-050)
- 12 tons no total (G > B > R em RGB)

**Color Core** (ferramentas de design):
Permite usar cores especificas para cada contexto.

**Dica de uso:**
- **60%** cor dominante (geralmente Verde Core)
- **30%** cor secundaria
- **10%** cor de accento

Que tipo de material voce esta criando?`,

  fonte: `Sobre **fontes e tipografia**:

O sistema tipografico da marca tem hierarquia clara:

**Headings (titulos):**
Use as fontes definidas no sistema para criar impacto

**Body (corpo):**
Priorize legibilidade - espacamento adequado

**Dicas importantes:**
- Mantenha **contraste suficiente** entre texto e fundo
- Use **no maximo 2-3 familias** de fontes por peca
- Respeite o **tamanho minimo** para leitura

Em que tipo de material voce vai aplicar?`,

  banner: `Banner e uma peca visual importante! Vou te ajudar:

**Estrutura recomendada:**

**1. Hierarquia visual**
- Titulo principal (grande e impactante)
- Subtitulo ou descricao (complementa)
- Call-to-action (se aplicavel)

**2. Cores**
- Fundo: use Verde Core escuro (#141A17 ou #1A231D)
- Texto: tons claros (#F0F4F2 ou #EDF1EF)
- Destaque: use Color Core moderadamente

**3. Espacamento**
Deixe **respirar** - nao encha demais!

**4. Imagens**
Se usar foto/ilustracao, garanta que nao compete com o texto

Qual e o objetivo desse banner?`,

  campanha: `Que legal que vai criar uma **campanha**! Vamos la:

**Planejamento:**

**1. Defina o tema**
Qual a mensagem principal? Ex: Dia das Maes, Black Friday, lancamento

**2. Escolha a paleta**
Baseie-se no **tema + Cartilha Cromatica**
- Mantenha Verde Core sempre
- Adicione cores tematicas do Color Core

**3. Formatos**
Crie variacoes para diferentes canais:
- Stories (1080x1920)
- Feed (1080x1080)
- Banner (variaveis)

**4. Consistencia**
Mantenha **mesma identidade visual** em todas as pecas

Sobre qual tema e sua campanha?`,

  contraste: `**Contraste** e fundamental para acessibilidade!

**Regra de ouro:**
WCAG recomenda **minimo 4.5:1** para texto normal

**Na pratica:**

**✓ BOM contraste:**
- Texto #F0F4F2 em fundo #141A17
- Texto #141A17 em fundo #F0F4F2

**✗ EVITE:**
- Texto #8FA89B em fundo #6A8A7A
- Cinzas proximos (#B5C5BC em #D4DDD8)

**Dica:**
Use ferramentas online de verificacao de contraste ou teste com **modo escala de cinza** para validar.

Em que peca voce esta com duvida de contraste?`
};

// Função que simula streaming de resposta da IA
async function getMockResponse(query: string): Promise<string> {
  const lowerQuery = query.toLowerCase();
  
  // Detecção de palavras-chave
  if (lowerQuery.includes('cor') || lowerQuery.includes('paleta') || lowerQuery.includes('categoria')) {
    return MOCK_RESPONSES.cores;
  }
  if (lowerQuery.includes('fonte') || lowerQuery.includes('tipografia') || lowerQuery.includes('texto')) {
    return MOCK_RESPONSES.fonte;
  }
  if (lowerQuery.includes('banner') || lowerQuery.includes('comecar')) {
    return MOCK_RESPONSES.banner;
  }
  if (lowerQuery.includes('campanha') || lowerQuery.includes('post') || lowerQuery.includes('dia das')) {
    return MOCK_RESPONSES.campanha;
  }
  if (lowerQuery.includes('contraste') || lowerQuery.includes('legib')) {
    return MOCK_RESPONSES.contraste;
  }
  
  return MOCK_RESPONSES.default;
}

// Simula streaming character-by-character
async function simulateStreaming(
  text: string, 
  onChunk: (accumulated: string) => void,
  signal?: AbortSignal
): Promise<void> {
  let accumulated = "";
  const words = text.split(" ");
  
  for (let i = 0; i < words.length; i++) {
    if (signal?.aborted) throw new Error("AbortError");
    
    accumulated += (i > 0 ? " " : "") + words[i];
    onChunk(accumulated);
    
    // Velocidade variável para parecer mais natural
    const delay = Math.random() * 40 + 20;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}

// ═══════════════════════════════════════════════════════════════
//  MESSAGE TYPES
// ═══════════════════════════════════════════════════════════════

interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
  timestamp: number;
}

// ═══════════════════════════════════════════════════════════════
//  COMPONENT
// ═══════════════════════════════════════════════════════════════

interface BrandAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const WELCOME_MESSAGE = `Oi! Eu sou a **Ada**, sua parceira criativa aqui na Adapta.

Pode me perguntar qualquer coisa sobre as **cores** da marca, **fontes** do sistema tipografico, como montar uma paleta pra uma peca, duvidas sobre contraste, ou ate "por onde eu comeco?".

Nao precisa saber os termos tecnicos — me conta o que voce quer fazer e a gente resolve junto.`;

export function BrandAssistant({ isOpen, onClose }: BrandAssistantProps) {
  const { isDark, t } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "assistant",
      text: WELCOME_MESSAGE,
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;
    function handlePointerDown(e: PointerEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    const timer = setTimeout(() => {
      document.addEventListener("pointerdown", handlePointerDown);
    }, 100);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen, onClose]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming, streamingText]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  // Cleanup abort on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const handleSend = useCallback(
    async (text?: string) => {
      const query = (text || input).trim();
      if (!query || isStreaming) return;

      const userMsg: Message = {
        id: Date.now(),
        role: "user",
        text: query,
        timestamp: Date.now(),
      };

      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      setInput("");
      setIsStreaming(true);
      setStreamingText("");

      try {
        abortRef.current = new AbortController();

        if (USE_MOCK_RESPONSES) {
          // ══════ MOCK MODE ══════
          // Simula resposta da IA com streaming
          const mockResponseText = await getMockResponse(query);
          
          await simulateStreaming(
            mockResponseText,
            (accumulated) => setStreamingText(accumulated),
            abortRef.current.signal
          );

          // Finaliza: adiciona a mensagem completa
          const assistantMsg: Message = {
            id: Date.now() + 1,
            role: "assistant",
            text: mockResponseText,
            timestamp: Date.now(),
          };
          setMessages((prev) => [...prev, assistantMsg]);
        } else {
          // ══════ REAL API MODE ══════
          // Para usar API real, você precisa:
          // 1. Importar: import { projectId, publicAnonKey } from "../../utils/supabase/info";
          // 2. Configurar a URL da API abaixo
          const API_URL = "YOUR_API_URL_HERE"; // Substitua pela URL real
          const API_KEY = "YOUR_API_KEY_HERE"; // Substitua pela chave real
          
          const conversationHistory = updatedMessages
            .slice(-20)
            .map((m) => ({ role: m.role, content: m.text }));

          const response = await fetch(API_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({ messages: conversationHistory }),
            signal: abortRef.current.signal,
          });

          if (!response.ok) {
            const errData = await response.json().catch(() => ({ error: "Unknown error" }));
            throw new Error(errData.error || `HTTP ${response.status}`);
          }

          // Stream reading
          const reader = response.body!.getReader();
          const decoder = new TextDecoder();
          let accumulated = "";
          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || !trimmed.startsWith("data: ")) continue;
              const data = trimmed.slice(6);
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  accumulated += parsed.content;
                  setStreamingText(accumulated);
                }
              } catch {
                // skip
              }
            }
          }

          // Finalize: add the complete message
          const assistantMsg: Message = {
            id: Date.now() + 1,
            role: "assistant",
            text: accumulated || "Hmm, parece que nao consegui gerar uma resposta. Pode tentar de novo?",
            timestamp: Date.now(),
          };
          setMessages((prev) => [...prev, assistantMsg]);
        }
      } catch (err: any) {
        if (err.name === "AbortError" || err.message === "AbortError") return;
        console.error("Brand assistant chat error:", err);

        const errorMsg: Message = {
          id: Date.now() + 1,
          role: "assistant",
          text: `Ops, tive um problema pra processar sua pergunta. 😅

**Erro:** ${err.message || "Falha na conexao"}

Pode tentar de novo? Se o problema persistir, verifique se a chave da API OpenAI foi configurada corretamente.`,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsStreaming(false);
        setStreamingText("");
        abortRef.current = null;
      }
    },
    [input, messages, isStreaming]
  );

  const handleClearChat = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
    setStreamingText("");
    setMessages([
      {
        id: Date.now(),
        role: "assistant",
        text: "Conversa reiniciada! Me conta, no que posso te ajudar agora?",
        timestamp: Date.now(),
      },
    ]);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] shadow-2xl z-50 flex flex-col animate-in slide-in-from-right"
      role="dialog"
      aria-modal="true"
      aria-label="Assistente Ada"
      style={{ 
        fontFamily: fonts.body,
        backgroundColor: t.bgCard,
        borderLeft: `1px solid ${t.border}`
      }}
    >
      {/* Header */}
      <div 
        className="px-4 py-3 flex items-center gap-2.5"
        style={{
          backgroundColor: t.glass,
          borderBottom: `1px solid ${t.glassBorder}`
        }}
      >
        <div 
          className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md"
          style={{
            background: isDark 
              ? "linear-gradient(135deg, #6A8A7A 0%, #8FA89B 100%)"
              : "linear-gradient(135deg, #445A4F 0%, #6A8A7A 100%)"
          }}
        >
          <Bot className="w-4 h-4" style={{ color: "#FFFFFF" }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span 
              className="text-[13px]" 
              style={{ fontFamily: fonts.heading, fontWeight: 600, color: t.text }}
            >
              Ada
            </span>
            <Zap className="w-3 h-3 text-amber-500" />
            <span 
              className="text-[8px] px-1.5 py-0.5 rounded-full border"
              style={{ 
                fontFamily: fonts.heading, 
                fontWeight: 600,
                color: "#D97706",
                backgroundColor: isDark ? "rgba(251, 191, 36, 0.1)" : "#FEF3C7",
                borderColor: isDark ? "rgba(251, 191, 36, 0.2)" : "#FDE68A"
              }}
            >
              IA
            </span>
          </div>
          <p 
            className="text-[9px] truncate" 
            style={{ fontFamily: fonts.body, color: t.textMuted }}
          >
            Mentora criativa de marca
          </p>
        </div>
        <div 
          className="flex items-center gap-1 px-2 py-0.5 rounded-full border"
          style={{
            backgroundColor: isDark ? "rgba(143, 168, 155, 0.1)" : "rgba(106, 138, 122, 0.1)",
            borderColor: isDark ? "rgba(143, 168, 155, 0.2)" : "rgba(106, 138, 122, 0.3)"
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse" />
          <span className="text-[8px] text-neutral-500">Online</span>
        </div>
        <button
          onClick={handleClearChat}
          className="p-1.5 rounded-lg transition-colors"
          style={{ color: t.textMuted }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = t.text;
            e.currentTarget.style.backgroundColor = t.glass;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = t.textMuted;
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          title="Limpar conversa"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg transition-colors"
          style={{ color: t.textMuted }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = t.text;
            e.currentTarget.style.backgroundColor = t.glass;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = t.textMuted;
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}

        {/* Streaming message */}
        {isStreaming && streamingText && (
          <div className="flex justify-start">
            <div 
              className="max-w-[90%] rounded-2xl px-3.5 py-2.5 rounded-bl-md"
              style={{
                backgroundColor: isDark ? "rgba(200, 209, 205, 0.08)" : "#F5F5F5",
                color: t.text
              }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="w-2.5 h-2.5 text-neutral-400 animate-spin" />
                <span className="text-[8px] tracking-wide text-neutral-500">
                  PENSANDO...
                </span>
              </div>
              <div className="text-[11.5px] leading-[1.7] whitespace-pre-line">
                {renderMarkdown(streamingText, false, isDark, t)}
                <span 
                  className="inline-block w-1.5 h-4 animate-pulse ml-0.5 -mb-0.5 rounded-sm bg-neutral-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Typing indicator (before streaming starts) */}
        {isStreaming && !streamingText && (
          <div className="flex justify-start">
            <div 
              className="rounded-2xl rounded-bl-md px-4 py-3"
              style={{
                backgroundColor: isDark ? "rgba(200, 209, 205, 0.08)" : "#F5F5F5"
              }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="w-2.5 h-2.5 text-neutral-400" />
                <span className="text-[8px] text-neutral-500">
                  Ada esta pensando...
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span 
                  className="w-2 h-2 rounded-full animate-bounce [animation-delay:0ms] bg-neutral-600"
                />
                <span 
                  className="w-2 h-2 rounded-full animate-bounce [animation-delay:150ms] bg-neutral-600"
                />
                <span 
                  className="w-2 h-2 rounded-full animate-bounce [animation-delay:300ms] bg-neutral-600"
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested questions (collapsed) */}
      <SuggestedQuestions onSelect={handleSend} disabled={isStreaming} />

      {/* Input */}
      <div 
        className="px-4 py-3"
        style={{
          backgroundColor: t.glass,
          borderTop: `1px solid ${t.glassBorder}`
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Me conta o que voce precisa..."
            className="flex-1 px-3 py-2 rounded-xl text-[12px] focus:outline-none focus:ring-1 transition-all"
            style={{
              backgroundColor: t.bgCard,
              border: `1px solid ${t.border}`,
              color: t.text,
              opacity: isStreaming ? 0.5 : 1
            }}
            disabled={isStreaming}
          />
          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="p-2.5 rounded-xl transition-all"
            style={{
              backgroundColor: isStreaming || !input.trim() ? t.border : (isDark ? "#6A8A7A" : "#8FA89B"),
              color: "#FFFFFF",
              opacity: isStreaming || !input.trim() ? 0.3 : 1
            }}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
        <p 
          className="text-[8px] mt-1.5 text-center" 
          style={{ color: t.textFaint }}
        >
          Ada usa IA para orientar com base nas diretrizes da marca
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MESSAGE BUBBLE
// ═══════════════════════════════════════════════════════════════

function MessageBubble({ msg }: { msg: Message }) {
  const { isDark, t } = useTheme();
  
  return (
    <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 ${
          msg.role === "user" ? "rounded-br-md" : "rounded-bl-md"
        }`}
        style={{
          backgroundColor: msg.role === "user" 
            ? (isDark ? "#6A8A7A" : "#8FA89B")
            : isDark ? "rgba(200, 209, 205, 0.08)" : "#F5F5F5",
          color: msg.role === "user" ? "#FFFFFF" : t.text
        }}
      >
        <div className="text-[11.5px] leading-[1.7] whitespace-pre-line">
          {renderMarkdown(msg.text, msg.role === "user", isDark, t)}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SUGGESTED QUESTIONS (collapsible)
// ═══════════════════════════════════════════════════════════════

function SuggestedQuestions({ onSelect, disabled }: { onSelect: (q: string) => void; disabled?: boolean }) {
  const { isDark, t } = useTheme();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="px-4 pb-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-[10px] transition-colors mb-1.5 w-full"
        style={{ color: t.textMuted }}
        onMouseEnter={(e) => e.currentTarget.style.color = t.text}
        onMouseLeave={(e) => e.currentTarget.style.color = t.textMuted}
      >
        <Lightbulb className="w-3 h-3" />
        <span>Ideias de perguntas</span>
        <ChevronDown className={`w-3 h-3 ml-auto transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>
      {expanded && (
        <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto">
          {PLACEHOLDER_SUGGESTIONS.map((q) => (
            <button
              key={q}
              disabled={disabled}
              onClick={() => {
                onSelect(q);
                setExpanded(false);
              }}
              className="px-2.5 py-1 rounded-full text-[9px] transition-all border"
              style={{
                backgroundColor: isDark ? "rgba(106, 138, 122, 0.1)" : "rgba(143, 168, 155, 0.1)",
                color: t.textMuted,
                borderColor: "transparent",
                opacity: disabled ? 0.4 : 1
              }}
              onMouseEnter={(e) => {
                if (!disabled) {
                  e.currentTarget.style.color = isDark ? "#8FA89B" : "#6A8A7A";
                  e.currentTarget.style.backgroundColor = isDark ? "rgba(106, 138, 122, 0.2)" : "rgba(143, 168, 155, 0.2)";
                  e.currentTarget.style.borderColor = isDark ? "rgba(106, 138, 122, 0.3)" : "rgba(143, 168, 155, 0.3)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = t.textMuted;
                e.currentTarget.style.backgroundColor = isDark ? "rgba(106, 138, 122, 0.1)" : "rgba(143, 168, 155, 0.1)";
                e.currentTarget.style.borderColor = "transparent";
              }}
            >
              {q}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MARKDOWN RENDERER — enhanced with hex swatch support
// ═══════════════════════════════════════════════════════════════

function renderMarkdown(
  text: string, 
  isUser: boolean = false, 
  isDark: boolean,
  t: any
): React.ReactNode {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    // Process bold and inline code (backtick hex)
    const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    const rendered = parts.map((part, j) => {
      // Bold
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={j} style={{ color: isUser ? "#FFFFFF" : t.text }}>
            {part.slice(2, -2)}
          </strong>
        );
      }

      // Inline code with hex color detection
      if (part.startsWith("`") && part.endsWith("`")) {
        const code = part.slice(1, -1);
        if (/^#[0-9A-Fa-f]{6}$/.test(code)) {
          return (
            <span
              key={j}
              className="inline-flex items-center gap-1 font-mono text-[10px] rounded px-1 py-0.5 border mx-0.5"
              style={{
                backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.8)",
                borderColor: t.glassBorder
              }}
            >
              <span
                className="w-2.5 h-2.5 rounded-sm inline-block shrink-0 border border-black/10"
                style={{ backgroundColor: code }}
              />
              {code}
            </span>
          );
        }
        return (
          <code 
            key={j} 
            className="font-mono text-[10px] rounded px-1 py-0.5 mx-0.5"
            style={{
              backgroundColor: isDark ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.05)"
            }}
          >
            {code}
          </code>
        );
      }

      if (isUser) return <span key={j}>{part}</span>;

      // Process inline hex colors in regular text (without backticks)
      const hexParts = part.split(/(#[0-9A-Fa-f]{6})/g);
      return hexParts.map((hp, k) => {
        if (/^#[0-9A-Fa-f]{6}$/.test(hp)) {
          return (
            <span
              key={k}
              className="inline-flex items-center gap-1 font-mono text-[10px] rounded px-1 py-0.5 border mx-0.5"
              style={{
                backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.8)",
                borderColor: t.glassBorder
              }}
            >
              <span
                className="w-2.5 h-2.5 rounded-sm inline-block shrink-0 border border-black/10"
                style={{ backgroundColor: hp }}
              />
              {hp}
            </span>
          );
        }
        return <span key={k}>{hp}</span>;
      });
    });

    return (
      <span key={i}>
        {i > 0 && <br />}
        {rendered}
      </span>
    );
  });
}