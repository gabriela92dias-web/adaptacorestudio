import React, { useMemo } from "react";
import { FileType, Image as ImageIcon, File } from "lucide-react";
import { useBrandStudio } from "../../contexts/brand-context";
import { SampleLogo } from "./sample-logo";
import { ColorControls } from "./color-controls";

interface LogoViewModesProps {
  defaultMode?: "sidebar" | "maximized";
  onClose: () => void;
  controlled?: boolean;
}

export function LogoViewModes({ defaultMode = "sidebar", onClose, controlled = false }: LogoViewModesProps) {
  const { layers, layerColors } = useBrandStudio();

  if (defaultMode === "sidebar") {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[165]"
          style={{ backgroundColor: "var(--modal-backdrop)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="absolute right-0 top-0 h-full w-full max-w-md shadow-2xl overflow-y-auto"
            style={{
              backgroundColor: "var(--modal-bg)",
              borderLeft: "1px solid var(--modal-border)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="sticky top-0 p-6 border-b flex items-center justify-between"
              style={{
                backgroundColor: "var(--modal-bg)",
                borderColor: "var(--modal-border)",
              }}
            >
              <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                Editor de Logo
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100"
                style={{ color: "var(--text-secondary)" }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Preview */}
              <div
                className="p-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "var(--preview-bg)" }}
              >
                <SampleLogo layers={layers} width={200} height={200} />
              </div>

              {/* Controls */}
              <ColorControls />
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return null;
}
