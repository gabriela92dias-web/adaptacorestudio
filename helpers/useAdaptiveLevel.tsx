import { useState, useEffect, useRef } from "react";
import styles from "./useAdaptiveLevel.module.css";

export interface UseAdaptiveLevelOptions {
  itemCount?: number;
  maxPerGroup?: number;
}

export interface UseAdaptiveLevelResult {
  level: 0 | 1 | 2 | 3;
  ref: React.RefObject<HTMLDivElement | null>;
  className: string;
}

/**
 * A custom hook that calculates a compression level (0-3) based on 
 * container dimensions and data density.
 * 
 * Highest constraint wins (e.g., if itemCount requires level 3, 
 * it stays level 3 regardless of width).
 */
export function useAdaptiveLevel(
  options?: UseAdaptiveLevelOptions
): UseAdaptiveLevelResult {
  const ref = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, measured: false });

  const { itemCount = 0, maxPerGroup = 0 } = options || {};

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const { width, height } = entry.contentRect;
        
        // Debounce the state update to avoid layout thrashing
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setDimensions({ width, height, measured: true });
        }, 150);
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  // Determine level (highest wins)
  let level: 0 | 1 | 2 | 3 = 0;

  // We only check dimension constraints if dimensions have been measured
  // to prevent flashing level 3 on the initial render.
  const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 0;
  const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 0;
  
  const w = dimensions.measured && viewportWidth > 0 ? Math.min(dimensions.width, viewportWidth) : dimensions.width;
  const h = dimensions.measured && viewportHeight > 0 ? Math.min(dimensions.height, viewportHeight) : dimensions.height;
  
  const { measured } = dimensions;

  if (
    (measured && (w < 300 || h < 300)) ||
    itemCount > 20 ||
    maxPerGroup > 25
  ) {
    level = 3; // Restructure
  } else if (
    (measured && (w < 400 || h < 350)) ||
    itemCount > 14 ||
    maxPerGroup > 14
  ) {
    level = 2; // Micro
  } else if (
    (measured && (w < 500 || h < 400)) ||
    itemCount > 11 ||
    maxPerGroup > 9
  ) {
    level = 1; // Compact
  }

  // Map to the generated CSS module class, fallback to a standard string if styles object is empty
  const cssClass = styles[`adaptive-level-${level}`] || `adaptive-level-${level}`;

  return {
    level,
    ref,
    className: cssClass,
  };
}