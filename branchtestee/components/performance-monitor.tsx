/**
 * ═══════════════════════════════════════════════════════════════════
 * PERFORMANCE MONITOR - ADAPTA CORE STUDIO
 * ═══════════════════════════════════════════════════════════════════
 * Monitor visual de performance em tempo real
 * Atalho: Ctrl + Shift + P para toggle
 * ═══════════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useCallback } from 'react';
import { Activity, X, Zap, Database, Cpu, Eye, EyeOff } from 'lucide-react';
import { logger } from '../utils/performance';

interface PerformanceStats {
  fps: number;
  memory: number;
  renders: number;
  logs: number;
}

export function PerformanceMonitor() {
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState<PerformanceStats>({
    fps: 60,
    memory: 0,
    renders: 0,
    logs: 0,
  });
  const [debugEnabled, setDebugEnabled] = useState(false);

  // Toggle visibility com Ctrl+Shift+P
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Monitorar performance
  useEffect(() => {
    if (!isVisible) return;

    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measurePerformance = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        // Memória (se disponível)
        const memory = (performance as any).memory 
          ? Math.round((performance as any).memory.usedJSHeapSize / 1048576)
          : 0;

        setStats(prev => ({
          fps,
          memory,
          renders: prev.renders + 1,
          logs: prev.logs,
        }));

        frameCount = 0;
        lastTime = currentTime;
      }

      animationId = requestAnimationFrame(measurePerformance);
    };

    animationId = requestAnimationFrame(measurePerformance);
    return () => cancelAnimationFrame(animationId);
  }, [isVisible]);

  const toggleDebug = useCallback(() => {
    if (debugEnabled) {
      (window as any).adaptaDebug?.disable();
      setDebugEnabled(false);
      logger.log('Debug desabilitado via monitor', 'CONTEXT');
    } else {
      (window as any).adaptaDebug?.enableAll();
      setDebugEnabled(true);
      logger.log('Debug habilitado via monitor', 'CONTEXT');
    }
  }, [debugEnabled]);

  const clearCache = useCallback(() => {
    // Limpar caches do navegador
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }
    
    // Reload
    window.location.reload();
  }, []);

  if (!isVisible) {
    return (
      <div 
        className="fixed bottom-4 right-4 bg-[var(--neutral-900)] text-[var(--alma-400)] px-3 py-2 rounded-lg text-xs font-mono border border-[var(--neutral-800)] cursor-pointer hover:bg-[var(--neutral-850)] transition-colors"
        onClick={() => setIsVisible(true)}
        title="Performance Monitor (Ctrl+Shift+P)"
      >
        <Activity className="w-4 h-4" />
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-[var(--neutral-900)] text-[var(--neutral-100)] p-4 rounded-lg border border-[var(--neutral-800)] shadow-2xl font-mono text-xs w-64 z-[9999]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[var(--neutral-800)]">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[var(--alma-500)]" />
          <span className="font-bold text-[var(--alma-400)]">PERFORMANCE</span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-[var(--neutral-500)] hover:text-[var(--neutral-300)] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Stats */}
      <div className="space-y-2 mb-3">
        {/* FPS */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-[var(--luz-500)]" />
            <span className="text-[var(--neutral-400)]">FPS:</span>
          </div>
          <span className={`font-bold ${
            stats.fps >= 55 ? 'text-[var(--luz-500)]' :
            stats.fps >= 30 ? 'text-yellow-500' :
            'text-red-500'
          }`}>
            {stats.fps}
          </span>
        </div>

        {/* Memory */}
        {stats.memory > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-3 h-3 text-[var(--alma-500)]" />
              <span className="text-[var(--neutral-400)]">Memória:</span>
            </div>
            <span className="text-[var(--neutral-200)]">{stats.memory} MB</span>
          </div>
        )}

        {/* Renders */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-3 h-3 text-[var(--firmeza-500)]" />
            <span className="text-[var(--neutral-400)]">Renders:</span>
          </div>
          <span className="text-[var(--neutral-200)]">{stats.renders}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2 pt-2 border-t border-[var(--neutral-800)]">
        <button
          onClick={toggleDebug}
          className={`w-full px-3 py-1.5 rounded text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
            debugEnabled 
              ? 'bg-[var(--alma-500)] text-[var(--neutral-950)] hover:bg-[var(--alma-600)]'
              : 'bg-[var(--neutral-800)] text-[var(--neutral-300)] hover:bg-[var(--neutral-700)]'
          }`}
        >
          {debugEnabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          {debugEnabled ? 'DEBUG ON' : 'DEBUG OFF'}
        </button>

        <button
          onClick={clearCache}
          className="w-full px-3 py-1.5 rounded text-xs bg-[var(--neutral-800)] text-[var(--neutral-300)] hover:bg-[var(--neutral-700)] transition-colors"
        >
          Limpar Cache
        </button>
      </div>

      {/* Hint */}
      <div className="mt-3 pt-2 border-t border-[var(--neutral-800)] text-[var(--neutral-500)] text-[10px] text-center">
        Ctrl+Shift+P para toggle
      </div>
    </div>
  );
}
