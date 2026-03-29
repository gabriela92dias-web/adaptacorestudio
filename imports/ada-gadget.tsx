import { useState, useRef, useEffect, useCallback } from "react";
import { Bot, Send, Sparkles, Minus, Maximize2, RotateCcw } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { fonts } from "./font-tokens";

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-92b477aa/chat`;

interface Message { id: number; role: "user" | "assistant"; text: string; }

interface ChatHistory {
  id: string;
  timestamp: number;
  messages: Message[];
}

const WELCOME = "Oi! Eu sou a **Ada**, sua parceira criativa aqui na Adapta.\n\nPode me perguntar qualquer coisa sobre as cores da marca, fontes do sistema tipográfico, como montar uma paleta pra uma peça, dúvidas sobre contraste, ou até \"por onde eu começo?\".\n\nNão precisa saber os termos técnicos — me conta o que você quer fazer e a gente resolve junto.";
const STORAGE_KEY = "ada-chat-history";

interface AdaGadgetProps {
  expanded: boolean;
  onToggleExpand: () => void;
  isDark: boolean;
}

export function AdaGadget({ expanded, onToggleExpand, isDark }: AdaGadgetProps) {
  const [messages, setMessages] = useState<Message[]>([{ id: 0, role: "assistant", text: WELCOME }]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, streamingText]);
  useEffect(() => { return () => { abortRef.current?.abort(); }; }, []);

  // ── Salvar histórico no localStorage ──
  const saveCurrentChat = useCallback(() => {
    // Não salvar se só tiver mensagem de boas-vindas
    if (messages.length <= 1) return;
    
    try {
      const existing = localStorage.getItem(STORAGE_KEY);
      const history: ChatHistory[] = existing ? JSON.parse(existing) : [];
      
      const newChat: ChatHistory = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        messages,
      };
      
      // Adicionar no início (mais recente primeiro) e limitar a 10 conversas
      history.unshift(newChat);
      const trimmed = history.slice(0, 10);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch (err) {
      console.warn("Erro ao salvar histórico:", err);
    }
  }, [messages]);

  // ── Nova conversa (salva a atual e reseta) ──
  const handleNewChat = useCallback(() => {
    saveCurrentChat();
    setMessages([{ id: Date.now(), role: "assistant", text: WELCOME }]);
    setInput("");
    setStreamingText("");
    abortRef.current?.abort();
    setIsStreaming(false);
  }, [saveCurrentChat]);

  const handleSend = useCallback(async (text?: string) => {
    const query = (text || input).trim();
    if (!query || isStreaming) return;
    const userMsg: Message = { id: Date.now(), role: "user", text: query };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setIsStreaming(true);
    setStreamingText("");

    const history = updated.slice(-20).map(m => ({ role: m.role, content: m.text }));
    try {
      abortRef.current = new AbortController();
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` },
        body: JSON.stringify({ messages: history }),
        signal: abortRef.current.signal,
      });
      if (!response.ok) { const err = await response.json().catch(() => ({})); throw new Error((err as any).error || `HTTP ${response.status}`); }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let acc = "", buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n"); buf = lines.pop() || "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) continue;
          const data = trimmed.slice(6);
          if (data === "[DONE]") continue;
          try { const p = JSON.parse(data); if (p.content) { acc += p.content; setStreamingText(acc); } } catch {}
        }
      }
      setMessages(prev => [...prev, { id: Date.now() + 1, role: "assistant", text: acc || "Hmm, tente novamente?" }]);
    } catch (err: any) {
      if (err.name === "AbortError") return;
      console.error("Ada chat error:", err);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: "assistant", text: `Ops! ${err.message || "Erro de conexão"}` }]);
    } finally { setIsStreaming(false); setStreamingText(""); abortRef.current = null; }
  }, [input, messages, isStreaming]);

  const cardBg = isDark ? "rgba(255,255,255,0.03)" : "#ffffff";
  const borderCol = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.12)";
  const textCol = isDark ? "#E8F0ED" : "#1a1a1a";
  const mutedCol = isDark ? "rgba(232,240,237,0.45)" : "rgba(0,0,0,0.45)";
  const faintCol = isDark ? "rgba(232,240,237,0.25)" : "rgba(0,0,0,0.20)";
  const inputBg = isDark ? "rgba(255,255,255,0.04)" : "#f5f5f5";
  const bubbleBg = isDark ? "rgba(255,255,255,0.05)" : "#f0f0ee";
  const userBubble = isDark ? "#5E5E5E" : "#1F1F1F";
  const accentBg = isDark ? "#1F1F1F" : "#E7E7E7";
  const accentText = isDark ? "#F6F6F6" : "#0D0D0D";
  const cursorColor = isDark ? "#9D9D9D" : "#5E5E5E";

  const lastAssistant = messages.filter(m => m.role === "assistant").pop();

  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden" style={{ background: cardBg, border: `1px solid ${borderCol}` }}>
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2" style={{ borderBottom: `1px solid ${borderCol}` }}>
        <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: accentBg }}>
          <Bot className="w-3 h-3" style={{ color: accentText }} />
        </div>
        <span className="text-[11px] flex-1" style={{ fontFamily: fonts.heading, fontWeight: 600, color: textCol }}>Ada</span>
        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[7px]" style={{ background: accentBg, color: mutedCol }}>
          <span className="w-1 h-1 rounded-full animate-pulse" style={{ background: mutedCol }} /> IA
        </span>
        {/* Botão Nova Conversa - só aparece quando há conversa ativa */}
        {messages.length > 1 && (
          <button 
            onClick={handleNewChat} 
            className="p-1 rounded-md transition-colors hover:opacity-70" 
            style={{ color: mutedCol }} 
            title="Nova conversa (salva a atual)"
            disabled={isStreaming}
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        )}
        <button onClick={onToggleExpand} className="p-1 rounded-md transition-colors" style={{ color: mutedCol }} title={expanded ? "Minimizar" : "Expandir"}>
          {expanded ? <Minus className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
        </button>
      </div>

      {/* Messages area */}
      <div className={`flex-1 overflow-y-auto px-3 py-2 space-y-2 ${expanded ? "min-h-[140px]" : "min-h-[44px] max-h-[80px]"}`}>
        {!expanded ? (
          // Compact: show last message
          <div className="text-[10px] leading-relaxed" style={{ color: mutedCol }}>
            {isStreaming && streamingText ? (
              <>{renderInline(streamingText, isDark)}<span className="inline-block w-1 h-3 ml-0.5 rounded-sm animate-pulse" style={{ background: cursorColor }} /></>
            ) : isStreaming ? (
              <span className="flex items-center gap-1"><Sparkles className="w-2.5 h-2.5 animate-spin" style={{ color: cursorColor }} /> Pensando...</span>
            ) : lastAssistant ? renderInline(lastAssistant.text, isDark) : null}
          </div>
        ) : (
          // Expanded: full chat
          <>
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[90%] rounded-xl px-2.5 py-1.5" style={{
                  background: msg.role === "user" ? userBubble : bubbleBg,
                  color: msg.role === "user" ? "white" : textCol,
                  borderRadius: msg.role === "user" ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
                }}>
                  <div className="text-[10px] leading-[1.6] whitespace-pre-line">{renderInline(msg.text, isDark)}</div>
                </div>
              </div>
            ))}
            {isStreaming && streamingText && (
              <div className="flex justify-start">
                <div className="max-w-[90%] rounded-xl px-2.5 py-1.5" style={{ background: bubbleBg, borderRadius: "12px 12px 12px 4px" }}>
                  <div className="text-[10px] leading-[1.6] whitespace-pre-line" style={{ color: textCol }}>
                    {renderInline(streamingText, isDark)}
                    <span className="inline-block w-1 h-3 ml-0.5 rounded-sm animate-pulse" style={{ background: cursorColor }} />
                  </div>
                </div>
              </div>
            )}
            {isStreaming && !streamingText && (
              <div className="flex justify-start">
                <div className="rounded-xl px-3 py-2" style={{ background: bubbleBg }}>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:0ms]" style={{ background: mutedCol }} />
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:150ms]" style={{ background: mutedCol }} />
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:300ms]" style={{ background: mutedCol }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input — always visible */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="flex items-center gap-1.5 px-2 py-2"
        style={{ borderBottom: `1px solid ${borderCol}` }}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pergunte à Ada..."
          disabled={isStreaming}
          className="flex-1 px-2.5 py-1.5 rounded-lg text-[11px] placeholder:opacity-40 focus:outline-none"
          style={{ background: inputBg, border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`, color: textCol }}
        />
        <button
          type="submit"
          disabled={!input.trim() || isStreaming}
          className="p-1.5 rounded-lg disabled:opacity-30 transition-colors"
          style={{ background: accentBg, color: accentText }}
        >
          <Send className="w-3 h-3" />
        </button>
      </form>
    </div>
  );
}

// Simple inline markdown renderer
function renderInline(text: string, isDark: boolean): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`")) {
      const code = part.slice(1, -1);
      if (/^#[0-9A-Fa-f]{6}$/.test(code)) {
        return <span key={i} className="inline-flex items-center gap-0.5 font-mono text-[9px] rounded px-0.5 mx-0.5" style={{ background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)" }}>
          <span className="w-2 h-2 rounded-sm inline-block" style={{ backgroundColor: code }} />{code}
        </span>;
      }
      return <code key={i} className="font-mono text-[9px] rounded px-0.5 mx-0.5" style={{ background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)" }}>{code}</code>;
    }
    return <span key={i}>{part}</span>;
  });
}