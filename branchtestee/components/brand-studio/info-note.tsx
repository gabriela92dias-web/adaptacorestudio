import React, { type ReactNode } from "react";
import { Info, AlertTriangle, CheckCircle2 } from "lucide-react";

interface InfoNoteProps {
  title?: string;
  children: ReactNode;
  type?: "info" | "warning" | "success";
}

export function InfoNote({ title, children, type = "info" }: InfoNoteProps) {
  const icons = {
    info: Info,
    warning: AlertTriangle,
    success: CheckCircle2,
  };

  const Icon = icons[type];

  return (
    <div
      className="relative rounded-md border flex gap-3 overflow-hidden transition-all duration-200 hover:border-[var(--info-icon)]/50"
      style={{
        backgroundColor: "var(--info-bg)",
        borderColor: "var(--info-border)",
        padding: "0.875rem 1rem",
      }}
    >
      {/* Subtle left accent bar */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-[2px]" 
        style={{ backgroundColor: "var(--info-icon)", opacity: 0.3 }}
      />
      
      <div className="pl-2 flex gap-3 items-start w-full">
        <Icon 
          className="w-4 h-4 flex-shrink-0 mt-0.5" 
          style={{ color: "var(--info-icon)", opacity: 0.7 }} 
        />
        <div className="flex-1 space-y-0.5">
          {title && (
            <p 
              className="text-sm tracking-wide" 
              style={{ 
                color: "var(--info-text)",
                opacity: 0.9,
                letterSpacing: "0.01em"
              }}
            >
              {title}
            </p>
          )}
          <div 
            className="text-sm leading-relaxed" 
            style={{ 
              color: "var(--info-text)", 
              opacity: 0.7 
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}