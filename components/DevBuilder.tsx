import React, { useState } from 'react';
import { RefreshCcw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function DevBuilder() {
  const [isBuilding, setIsBuilding] = useState(false);

  const handleBuild = async () => {
    if (isBuilding) return;
    setIsBuilding(true);
    
    // Add an initial toast so the user knows it started
    const toastId = toast.loading("Recompilando o Frontend via Vite... (Aguarde ~10s)");
    
    try {
      const res = await fetch("/_api/dev/build", { method: "POST" });
      const data = await res.json();
      
      if (data.success) {
        toast.success("Build completo! Recarregando a página...", { id: toastId });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error("Erro ao compilar: " + data.message, { id: toastId });
        console.error(data.error);
        setIsBuilding(false);
      }
    } catch (e: any) {
      toast.error("Erro de conexão ao rodar build: " + e.message, { id: toastId });
      setIsBuilding(false);
    }
  };

  return (
    <button
      onClick={handleBuild}
      disabled={isBuilding}
      title="Forçar Recompilação Completa (HARD F5)"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: 'var(--primary, #000)',
        color: 'var(--primary-foreground, #fff)',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        cursor: isBuilding ? 'wait' : 'pointer',
        zIndex: 999999,
        transition: 'transform 0.2s, background-color 0.2s',
        opacity: isBuilding ? 0.8 : 1,
        transform: isBuilding ? 'scale(0.95)' : 'scale(1)',
      }}
      onMouseEnter={(e) => {
        if (!isBuilding) e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        if (!isBuilding) e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {isBuilding ? (
        <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
      ) : (
        <RefreshCcw size={24} />
      )}
      <style>
        {`
          @keyframes spin {
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </button>
  );
}
