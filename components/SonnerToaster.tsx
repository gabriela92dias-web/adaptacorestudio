"use client";

import { Toaster as Sonner } from "sonner";
import { Hexagon, AlertCircle, AlertTriangle, Info } from "lucide-react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

/**
 * This is already included in the global context providers so should not be rendered again.
 */
export const SonnerToaster = ({ className, ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        duration: 5000,
        classNames: {
          toast: "group toast group-[.toaster]:bg-[var(--card)] group-[.toaster]:text-[var(--foreground)] group-[.toaster]:border group-[.toaster]:border-[var(--border)] group-[.toaster]:shadow-xl group-[.toaster]:rounded-xl font-sans tracking-tight",
          description: "group-[.toast]:text-[var(--muted-foreground)] text-sm",
          actionButton: "group-[.toast]:bg-[var(--primary)] group-[.toast]:text-[var(--primary-foreground)] group-[.toast]:font-semibold",
          cancelButton: "group-[.toast]:bg-[var(--muted)] group-[.toast]:text-[var(--muted-foreground)]",
          title: "font-semibold text-base",
          icon: "group-[.toast]:mr-2",
        },
      }}
      icons={{
        success: (
          <div className="relative flex items-center justify-center w-6 h-6 mr-1">
            <Hexagon className="absolute text-[var(--success)] w-full h-full" strokeWidth={2} style={{ transform: "rotate(-90deg)" }} />
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--success)] z-10" />
          </div>
        ),
        error: <AlertCircle className="text-[var(--error)] mr-1" size={24} strokeWidth={2} />,
        warning: <AlertTriangle className="text-[var(--warning)] mr-1" size={24} strokeWidth={2} />,
        info: <Info className="text-[var(--primary)] mr-1" size={24} strokeWidth={2} />
      }}
      {...props}
    />
  );
};
