import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "../ui/button";

interface CopyButtonProps {
  text: string;
  label?: string;
}

export function CopyButton({ text, label = "Copiar" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      onClick={handleCopy}
      variant="ghost"
      size="sm"
      className="gap-2"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          Copiado!
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          {label}
        </>
      )}
    </Button>
  );
}
