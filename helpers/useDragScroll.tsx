import { useEffect, useRef, useState } from "react";

/**
 * Hook that enables pan/drag scrolling on an element.
 * Users can drag using Middle Click, or Left Click (ignoring interactive elements),
 * or by holding the Space key and dragging.
 */
export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat) {
        const target = e.target as HTMLElement;
        const isInput =
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable;

        if (!isInput) {
          setIsSpacePressed(true);
          e.preventDefault();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setIsSpacePressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let isDown = false;
    let startX: number;
    let startY: number;
    let scrollLeft: number;
    let scrollTop: number;

    const onMouseDown = (e: MouseEvent) => {
      // Proceed only for Middle click (1) or Left click (0)
      if (e.button !== 0 && e.button !== 1) return;

      // Left click only triggers panning if Space is held
      if (e.button === 0 && !isSpacePressed) {
        return;
      }

      isDown = true;
      setIsGrabbing(true);
      startX = e.clientX;
      startY = e.clientY;
      scrollLeft = el.scrollLeft;
      scrollTop = el.scrollTop;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault(); // Prevent text selection
      
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      
      el.scrollLeft = scrollLeft - dx;
      el.scrollTop = scrollTop - dy;
    };

    const onMouseUp = () => {
      isDown = false;
      setIsGrabbing(false);
    };

    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isSpacePressed]);

  return { ref, isGrabbing, isSpacePressed };
}