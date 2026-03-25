import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "../ui/button";

const TOUR_STEPS = [
  {
    title: "Bem-vindo ao Adapta Brand Studio!",
    description: "Uma plataforma completa para criar e gerenciar a identidade visual da sua marca.",
  },
  {
    title: "Navegação",
    description: "Use a sidebar à esquerda para navegar entre Campanhas e Materiais. Você pode colapsar o menu clicando no botão de toggle.",
  },
  {
    title: "Criar Materiais",
    description: "Acesse diversos tipos de materiais corporativos: documentos, marketing, produtos e muito mais.",
  },
  {
    title: "Criar Campanhas",
    description: "Clique no botão 'Criar Campanha' no header para criar campanhas de marketing completas com posts automáticos.",
  },
  {
    title: "Editor de Logo",
    description: "Use o botão de paleta para personalizar as cores do logo. Suporta Undo/Redo com Ctrl+Z.",
  },
  {
    title: "Pronto para começar!",
    description: "Explore a plataforma e crie materiais incríveis para sua marca. Use o botão '?' sempre que precisar de ajuda.",
  },
];

export function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Expor função global para reabrir o tour
    (window as any).__openOnboardingTour = () => {
      setIsOpen(true);
      setCurrentStep(0);
    };

    // Abrir automaticamente na primeira visita
    const hasSeenTour = localStorage.getItem("adapta-tour-seen");
    if (!hasSeenTour) {
      setIsOpen(true);
      localStorage.setItem("adapta-tour-seen", "true");
    }

    return () => {
      delete (window as any).__openOnboardingTour;
    };
  }, []);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsOpen(false);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const step = TOUR_STEPS[currentStep];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-md rounded-lg shadow-2xl bg-card border border-border"
        >
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1 text-foreground">
                {step.title}
              </h2>
              <p className="text-sm text-muted-foreground">
                Passo {currentStep + 1} de {TOUR_STEPS.length}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-base leading-relaxed text-foreground">
              {step.description}
            </p>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Button>

            <div className="flex gap-1">
              {TOUR_STEPS.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep 
                      ? "bg-primary" 
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              className="gap-1"
            >
              {currentStep === TOUR_STEPS.length - 1 ? "Começar" : "Próximo"}
              {currentStep < TOUR_STEPS.length - 1 && <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}