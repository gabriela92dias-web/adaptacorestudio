/**
 * ═══════════════════════════════════════════════════════════════
 * PERFORMANCE UTILITIES - ADAPTA CORE STUDIO
 * ═══════════════════════════════════════════════════════════════
 * 
 * Utilitários para otimização de performance
 * ⚡ Production-ready optimizations
 */

/**
 * Debounce function - delays execution until after wait milliseconds
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function - limits execution to once per wait milliseconds
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), wait);
    }
  };
}

/**
 * Conditional console.log - only in development
 */
export const devLog = (...args: any[]) => {
  if (import.meta.env.DEV) {
    console.log(...args);
  }
};

/**
 * Performance mark utility
 */
export const perfMark = (name: string) => {
  if (import.meta.env.DEV && performance.mark) {
    performance.mark(name);
  }
};

/**
 * Performance measure utility
 */
export const perfMeasure = (name: string, startMark: string, endMark: string) => {
  if (import.meta.env.DEV && performance.measure) {
    try {
      performance.measure(name, startMark, endMark);
      const measure = performance.getEntriesByName(name)[0];
      console.log(`⚡ ${name}: ${measure.duration.toFixed(2)}ms`);
    } catch (e) {
      // Ignore if marks don't exist
    }
  }
};
