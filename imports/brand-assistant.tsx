import { useState, useRef, useEffect, useCallback } from "react";
import {
  Bot, X, Send, Sparkles, ChevronDown, Lightbulb, RotateCcw, Zap,
} from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { fonts } from "./font-tokens";

// ═══════════════════════════════════════════════════════════════
//  CONFIG
// ═══════════════════════════════════════════════════════════════

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-92b477aa/chat`;

// ─── SUGGESTED QUESTIONS ───

const SUGGESTED_QUESTIONS = [
  "Preciso criar um post de Dia das Maes, me ajuda?",
  "Quero fazer um banner mas nao sei por onde comecar",
  "Posso usar laranja numa campanha?",
  "Qual a diferenca entre tier Paleta e Escala?",
  "Como faco pra peça nao ficar monotona so com verde?",
  "Quero usar roxo num material, pode?",
  "Qual fonte usar num post de Instagram?",
  "Posso usar Creepy Notes numa peca de Halloween?",
  "O que eh essa regra de 60-30-10?",
  "Como sei se o contraste do texto ta bom?",
  "Me ajuda a montar uma paleta pra uma campanha de saude",
  "Quais fontes combinam com um tom acolhedor?",
];

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

      // Build conversation history for the API (last 20 messages for context)
      const conversationHistory = updatedMessages
        .slice(-20)
        .map((m) => ({ role: m.role, content: m.text }));

      try {
        abortRef.current = new AbortController();

        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${publicAnonKey}`,
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
      } catch (err: any) {
        if (err.name === "AbortError") return;
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
      className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-white border-l border-border shadow-2xl z-50 flex flex-col animate-in slide-in-from-right"
      role="dialog"
      aria-modal="true"
      aria-label="Assistente Ada"
      style={{ fontFamily: fonts.body }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-border bg-gradient-to-r from-green-700/5 via-green-500/5 to-green-300/5 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-700 via-green-500 to-green-300 flex items-center justify-center shadow-md">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[13px]" style={{ fontFamily: fonts.heading, fontWeight: 600 }}>Ada</span>
            <Zap className="w-3 h-3 text-amber-500" />
            <span className="text-[8px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-200" style={{ fontFamily: fonts.heading, fontWeight: 600 }}>IA</span>
          </div>
          <p className="text-[9px] text-muted-foreground truncate" style={{ fontFamily: fonts.body }}>Mentora criativa de marca</p>
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 border border-green-200">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[8px] text-green-700">Online</span>
        </div>
        <button
          onClick={handleClearChat}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-[#f0f0f0] transition-colors"
          title="Limpar conversa"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-[#f0f0f0] transition-colors"
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
            <div className="max-w-[90%] rounded-2xl px-3.5 py-2.5 bg-[#f5f5f3] text-foreground rounded-bl-md">
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="w-2.5 h-2.5 text-green-600 animate-spin" />
                <span className="text-[8px] text-green-600 tracking-wide">PENSANDO...</span>
              </div>
              <div className="text-[11.5px] leading-[1.7] whitespace-pre-line">
                {renderMarkdown(streamingText)}
                <span className="inline-block w-1.5 h-4 bg-green-600/60 animate-pulse ml-0.5 -mb-0.5 rounded-sm" />
              </div>
            </div>
          </div>
        )}

        {/* Typing indicator (before streaming starts) */}
        {isStreaming && !streamingText && (
          <div className="flex justify-start">
            <div className="bg-[#f5f5f3] rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="w-2.5 h-2.5 text-green-600" />
                <span className="text-[8px] text-green-600">Ada esta pensando...</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-600/30 animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 rounded-full bg-green-600/30 animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 rounded-full bg-green-600/30 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested questions (collapsed) */}
      <SuggestedQuestions onSelect={handleSend} disabled={isStreaming} />

      {/* Input */}
      <div className="px-4 py-3 border-t border-border bg-[#fafaf8]">
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
            className="flex-1 px-3 py-2 rounded-xl bg-white border border-border text-[12px] placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-green-600/30"
            disabled={isStreaming}
          />
          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="p-2.5 rounded-xl bg-green-700 text-white disabled:opacity-30 hover:bg-green-800 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
        <p className="text-[8px] text-muted-foreground/50 mt-1.5 text-center">
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
  return (
    <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 ${
          msg.role === "user"
            ? "bg-green-700 text-white rounded-br-md"
            : "bg-[#f5f5f3] text-foreground rounded-bl-md"
        }`}
      >
        <div className="text-[11.5px] leading-[1.7] whitespace-pre-line">
          {renderMarkdown(msg.text, msg.role === "user")}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SUGGESTED QUESTIONS (collapsible)
// ═══════════════════════════════════════════════════════════════

function SuggestedQuestions({ onSelect, disabled }: { onSelect: (q: string) => void; disabled?: boolean }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="px-4 pb-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors mb-1.5 w-full"
      >
        <Lightbulb className="w-3 h-3" />
        <span>Ideias de perguntas</span>
        <ChevronDown className={`w-3 h-3 ml-auto transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>
      {expanded && (
        <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              disabled={disabled}
              onClick={() => {
                onSelect(q);
                setExpanded(false);
              }}
              className="px-2.5 py-1 rounded-full text-[9px] bg-[#f0f0ee] text-muted-foreground hover:text-green-700 hover:bg-green-700/8 transition-colors border border-transparent hover:border-green-700/15 disabled:opacity-40"
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

function renderMarkdown(text: string, isUser: boolean = false): React.ReactNode {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    // Process bold and inline code (backtick hex)
    const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    const rendered = parts.map((part, j) => {
      // Bold
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={j} className={isUser ? "text-white" : "text-foreground"}>
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
              className="inline-flex items-center gap-1 font-mono text-[10px] bg-white/80 rounded px-1 py-0.5 border border-border/40 mx-0.5"
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
          <code key={j} className="font-mono text-[10px] bg-black/5 rounded px-1 py-0.5 mx-0.5">
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
              className="inline-flex items-center gap-1 font-mono text-[10px] bg-white/80 rounded px-1 py-0.5 border border-border/40 mx-0.5"
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