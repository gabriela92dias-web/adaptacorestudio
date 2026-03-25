import { useEffect, useRef } from "react";

export function useSwipeNavigation(
  onNavigate: (dir: 1 | -1) => void,
  options: { threshold?: number; enableMouseDrag?: boolean; enabled?: boolean; requireSpacebar?: boolean } = {}
) {
  const { threshold = 150, enableMouseDrag = true, enabled = true, requireSpacebar = true } = options;
  const ref = useRef<HTMLDivElement>(null);
  
  const state = useRef({
    isSpacePressed: false,
    isMouseDown: false,
    startX: 0,
    swiped: false,
    lastMouseX: 0,
    wheelDx: 0
  });

  useEffect(() => {
    if (!enabled) return;

    let feedbackEl = document.getElementById("swipe-nav-feedback");
    if (!feedbackEl) {
      feedbackEl = document.createElement("div");
      feedbackEl.id = "swipe-nav-feedback";
      Object.assign(feedbackEl.style, {
        position: "fixed",
        bottom: "24px",
        right: "24px",
        backgroundColor: "color-mix(in srgb, var(--card) 85%, transparent)",
        color: "var(--muted-foreground)",
        border: "1px solid var(--border)",
        backdropFilter: "blur(6px)",
        padding: "8px 14px",
        borderRadius: "10px",
        fontSize: "12px",
        fontWeight: "500",
        pointerEvents: "none",
        zIndex: "9000",
        transition: "all 0.2s ease",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        boxShadow: "var(--shadow-sm)"
      });
      feedbackEl.innerHTML = "💡 <b>Use dois dedos (Trackpad)</b> ou arraste p/ navegar";
      document.body.appendChild(feedbackEl);
    }

    const resetFeedback = () => {
      const el = document.getElementById("swipe-nav-feedback");
      if (el) {
        el.style.backgroundColor = "color-mix(in srgb, var(--card) 85%, transparent)";
        el.style.color = "var(--muted-foreground)";
        el.style.borderColor = "var(--border)";
        el.style.transform = "scale(1)";
        el.innerHTML = "💡 <b>Use dois dedos (Trackpad)</b> ou arraste p/ navegar";
      }
    };

    const updateFeedbackDrag = (dx: number) => {
      const el = document.getElementById("swipe-nav-feedback");
      if (!el) return;
      const progress = Math.min(Math.abs(dx) / threshold, 1);
      const isReady = progress >= 1;
      
      el.style.transform = `scale(${1 + (progress * 0.05)})`;
      
      if (isReady) {
        el.style.backgroundColor = "var(--primary)";
        el.style.color = "var(--primary-foreground)";
        el.style.borderColor = "var(--primary)";
        el.innerHTML = dx > 0 ? "✨ Solte para Voltar no Tempo!" : "✨ Solte para Avançar no Tempo!";
      } else {
        el.style.backgroundColor = "var(--card)";
        el.style.color = "var(--foreground)";
        el.style.borderColor = "var(--border)";
        if (dx > 0) {
          el.innerHTML = `← Voltando... ${Math.round(progress * 100)}%`;
        } else {
          el.innerHTML = `Avançando... ${Math.round(progress * 100)}% →`;
        }
      }
    };

    const trackMouse = (e: MouseEvent) => {
      state.current.lastMouseX = e.clientX;
    };
    
    // START ACTIONS (Mouse down OR Space down)
    const handleActionStart = (startXPos: number) => {
      state.current.swiped = false;
      state.current.startX = startXPos;
      state.current.lastMouseX = startXPos;
      state.current.wheelDx = 0;
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
      if (ref.current) {
        ref.current.style.transition = "none";
      }
      const el = document.getElementById("swipe-nav-feedback");
      if (el) {
        el.style.backgroundColor = "var(--card)";
        el.style.color = "var(--foreground)";
        el.innerHTML = "↔️ Arraste para os lados";
      }
    };

    // END ACTIONS (Mouse up OR Space up)
    const handleActionEnd = () => {
      state.current.isSpacePressed = false;
      state.current.isMouseDown = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      resetFeedback();
      if (ref.current) {
        ref.current.style.transform = "translateX(0px) scale(1)";
        ref.current.style.filter = "none";
        ref.current.style.transition = "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;

      if ((e.code === "Space" || e.key === " ") && !state.current.isSpacePressed) {
        e.preventDefault(); 
        state.current.isSpacePressed = true;
        handleActionStart(state.current.lastMouseX);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === " ") {
        handleActionEnd();
      }
    };

    const handleBlur = () => {
      handleActionEnd();
    };

    // MOUSE DRAG SPECIFIC logic
    const handleMouseDown = (e: MouseEvent | TouchEvent) => {
      if (requireSpacebar && e.type === "mousedown" && !state.current.isSpacePressed) {
        return; // Prevent mouse drag swipe unless Space is held
      }

      const target = e.target as HTMLElement;
      // Do not pan if clicking interactive elements inside the timeline
      if (
        target.closest('button, input, select, textarea, [data-task-id], [class*="node"], [class*="task"], [class*="event"], .no-swipe')
      ) {
        return;
      }
      
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      state.current.isMouseDown = true;
      handleActionStart(clientX);
    };

    const handleGlobalMove = (e: MouseEvent | TouchEvent) => {
      if (!(state.current.isSpacePressed || state.current.isMouseDown) || state.current.swiped) return;

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const dx = clientX - state.current.startX;

      updateFeedbackDrag(dx);

      // Physical drag applied
      if (ref.current) {
        const progress = Math.min(Math.abs(dx) / threshold, 1);
        ref.current.style.transform = `translateX(${dx * 0.85}px) scale(${1 - progress * 0.01})`;
        ref.current.style.transition = "none";
        
        if (dx > 0) {
           // Past (Voltando no tempo: Sepia/Desaturated)
           ref.current.style.filter = `sepia(${progress * 40}%) grayscale(${progress * 20}%)`;
        } else {
           // Future (Avançando no tempo: Saturation + Hue Shift)
           ref.current.style.filter = `saturate(${100 + progress * 40}%) brightness(${100 + progress * 5}%) hue-rotate(${progress * -15}deg)`;
        }
      }

      if (Math.abs(dx) > threshold) {
        if (dx > 0) onNavigate(-1);
        else onNavigate(1);
        
        state.current.swiped = true;
        document.body.style.cursor = "default";
        
        if (ref.current) {
          ref.current.style.transform = "translateX(0px) scale(1)";
          ref.current.style.filter = "none";
          ref.current.style.transition = "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
        }
        
        const el = document.getElementById("swipe-nav-feedback");
        if (el) {
           el.style.backgroundColor = "var(--secondary)";
           el.style.color = "var(--secondary-foreground)";
           el.innerHTML = "✔️ Navegado! (Solte e repita)";
        }
      }
    };

    let wheelTimeout: ReturnType<typeof setTimeout>;

    const handleWheel = (e: WheelEvent) => {
      // Ignore heavily vertical scroll
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX) || state.current.swiped) return;
      
      // Prevent browser back/forward swipe
      e.preventDefault();
      
      // Trackpad deltaX > 0 means two fingers swiped LEFT (want to see future)
      // In our code, dx > 0 means dragging right (want to see past). So we invert.
      state.current.wheelDx = (state.current.wheelDx || 0) + e.deltaX;
      let swipeDx = -state.current.wheelDx;
      
      // Increase responsiveness slightly for trackpads
      updateFeedbackDrag(swipeDx);

      const progress = Math.min(Math.abs(swipeDx) / threshold, 1);
      if (ref.current) {
        ref.current.style.transform = `translateX(${swipeDx * 0.85}px) scale(${1 - progress * 0.01})`;
        ref.current.style.transition = "none";
        
        if (swipeDx > 0) {
           ref.current.style.filter = `sepia(${progress * 40}%) grayscale(${progress * 20}%)`;
        } else {
           ref.current.style.filter = `saturate(${100 + progress * 40}%) brightness(${100 + progress * 5}%) hue-rotate(${progress * -15}deg)`;
        }
      }

      if (Math.abs(swipeDx) > threshold) {
        if (swipeDx > 0) onNavigate(-1);
        else onNavigate(1);
        
        state.current.swiped = true;
        
        if (ref.current) {
          ref.current.style.transform = "translateX(0px)";
          ref.current.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
        }
        
        const el = document.getElementById("swipe-nav-feedback");
        if (el) {
           el.style.backgroundColor = "var(--secondary)";
           el.style.color = "var(--secondary-foreground)";
           el.innerHTML = "✔️ Navegado! (Mude o movimento)";
        }
        
        // Debounce before allowing next trackpad swipe naturally
        setTimeout(() => {
          state.current.swiped = false;
          state.current.wheelDx = 0;
          resetFeedback();
        }, 600);
      }

      clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        if (!state.current.swiped) {
          state.current.wheelDx = 0;
          resetFeedback();
          if (ref.current) {
            ref.current.style.transform = "translateX(0px) scale(1)";
            ref.current.style.filter = "none";
            ref.current.style.transition = "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
          }
        }
      }, 400);
    };

    window.addEventListener("mousemove", trackMouse, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);
    
    if (ref.current) {
      ref.current.addEventListener("wheel", handleWheel as EventListener, { passive: false });
    }

    if (enableMouseDrag && ref.current) {
      ref.current.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mouseup", handleActionEnd);
      window.addEventListener("mousemove", handleGlobalMove);
      
      ref.current.addEventListener("touchstart", handleMouseDown, { passive: true });
      window.addEventListener("touchend", handleActionEnd);
      window.addEventListener("touchmove", handleGlobalMove as EventListener, { passive: true });
    }

    return () => {
      window.removeEventListener("mousemove", trackMouse);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
      clearTimeout(wheelTimeout);
      
      if (enableMouseDrag) {
        window.removeEventListener("mouseup", handleActionEnd);
        window.removeEventListener("mousemove", handleGlobalMove);
        window.removeEventListener("touchend", handleActionEnd);
        window.removeEventListener("touchmove", handleGlobalMove);
      }
      if (ref.current) {
         ref.current.removeEventListener("wheel", handleWheel as EventListener);
      }
      
      document.body.style.cursor = "";
      const el = document.getElementById("swipe-nav-feedback");
      if (el) el.remove();
    };
  }, [enabled, requireSpacebar, threshold, onNavigate, enableMouseDrag]);

  return ref;
}
