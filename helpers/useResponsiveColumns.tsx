import { useState, useLayoutEffect, useRef } from "react";

export const SOVEREIGN_MIN_COL_WIDTH = 28;

/**
 * Calculates the effective number of columns that can fit in a container.
 * 
 * @param idealCount The desired number of columns
 * @param containerWidth The available width in pixels (0 if not measured yet)
 * @param minColWidth The minimum allowed width per column in pixels
 * @returns The constrained column count
 */
export function getEffectiveColumnCount(
  idealCount: number,
  containerWidth: number,
  minColWidth: number = SOVEREIGN_MIN_COL_WIDTH
): number {
  if (containerWidth === 0) {
    // If not measured yet, default to ideal to avoid premature reduction layouts
    return idealCount;
  }
  return Math.max(1, Math.min(idealCount, Math.floor(containerWidth / minColWidth)));
}

export interface UseResponsiveColumnsOptions {
  idealCount: number;
  minColumnWidth?: number;
}

export interface UseResponsiveColumnsResult {
  ref: React.RefObject<HTMLDivElement | null>;
  containerWidth: number;
  maxColumns: number;
  shouldReduce: boolean;
  reductionFactor: number;
}

/**
 * Universal hook for responsive column layouts.
 * Enforces a minimum column width, calculating the maximum number of columns
 * that can fit inside the container, reducing the ideal count if necessary.
 */
export function useResponsiveColumns({
  idealCount,
  minColumnWidth = SOVEREIGN_MIN_COL_WIDTH,
}: UseResponsiveColumnsOptions): UseResponsiveColumnsResult {
  const ref = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  useLayoutEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      if (rect.width > 0) {
        setContainerWidth(rect.width);
      }
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const maxColumns = getEffectiveColumnCount(idealCount, containerWidth, minColumnWidth);
  const shouldReduce = idealCount > maxColumns;
  const reductionFactor = maxColumns > 0 ? idealCount / maxColumns : 1;

  return {
    ref,
    containerWidth,
    maxColumns,
    shouldReduce,
    reductionFactor,
  };
}