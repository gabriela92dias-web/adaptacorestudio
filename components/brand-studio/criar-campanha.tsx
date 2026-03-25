import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Rocket, Gift, Heart, User, Megaphone } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useCampaigns } from "../../contexts/campaigns-context";

interface CriarCampanhaProps {
  isOpen: boolean;
  onClose: () => void;
}

const CAMPAIGN_TYPES = [
  {
    id: "lancamento",
    name: "Lançamento de Produto",
    description: "Campanha focada em apresentar um novo produto ao mercado",
    icon: Rocket,
    duration: 30,
    channels: ["Instagram", "Facebook"],
  },
  {
    id: "promocao",
    name: "Promoção Sazonal",
    description: "Ofertas especiais para datas comemorativas",
    icon: Gift,
    duration: 15,
    channels: ["Instagram", "Facebook", "LinkedIn"],
  },
  {
    id: "engajamento",
    name: "Engajamento de Marca",
    description: "Aumentar conexão e presença da marca",
    icon: Heart,
    duration: 60,
    channels: ["Instagram", "Facebook", "LinkedIn"],
  },
  {
    id: "evento",
    name: "Evento Corporativo",
    description: "Divulgação de eventos e webinars",
    icon: User,
    duration: 45,
    channels: ["LinkedIn", "Facebook"],
  },
  {
    id: "conscientizacao",
    name: "Conscientização",
    description: "Educar o público sobre um tema importante",
    icon: Megaphone,
    duration: 90,
    channels: ["Instagram", "Facebook", "LinkedIn"],
  },
];

export function CriarCampanha({ isOpen, onClose }: CriarCampanhaProps) {
  const { saveCampaign } = useCampaigns();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    objective: "",
    targetAudience: "",
  });

  const handleCreate = () => {
    const selectedCampaign = CAMPAIGN_TYPES.find((c) => c.id === selectedType);
    if (!selectedCampaign || !formData.name) return;

    // Gerar posts automaticamente
    const totalPosts = Math.ceil(selectedCampaign.duration / 3);
    const posts = Array.from({ length: totalPosts }, (_, i) => ({
      id: i + 1,
      format: selectedCampaign.channels[i % selectedCampaign.channels.length],
      title: `${formData.name} - Post ${i + 1}`,
      copy: `Conteúdo do post ${i + 1} para a campanha ${formData.name}`,
      cta: "Saiba mais",
    }));

    saveCampaign({
      name: formData.name,
      type: selectedCampaign.name,
      duration: selectedCampaign.duration,
      channels: selectedCampaign.channels,
      posts,
      objective: formData.objective,
      targetAudience: formData.targetAudience,
      status: "draft",
    });

    // Reset e fechar
    setStep(1);
    setSelectedType(null);
    setFormData({ name: "", objective: "", targetAudience: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[150] flex items-center justify-center p-4"
        style={{ backgroundColor: "var(--modal-backdrop)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl"
          style={{
            backgroundColor: "var(--modal-bg)",
            border: "1px solid var(--modal-border)",
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
            <div>
              <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                Criar Campanha
              </h2>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Passo {step} de 2
              </p>
            </div>
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
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>
                  Escolha o tipo de campanha
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {CAMPAIGN_TYPES.map((type) => {
                    const Icon = type.icon;
                    const isSelected = selectedType === type.id;
                    return (
                      <motion.div
                        key={type.id}
                        className="p-4 rounded-lg border cursor-pointer"
                        style={{
                          backgroundColor: isSelected ? "var(--gray-100)" : "var(--card-bg)",
                          borderColor: isSelected ? "var(--gray-400)" : "var(--card-border)",
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedType(type.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: "var(--gray-800)" }}
                          >
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                              {type.name}
                            </h4>
                            <p className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                              {type.description}
                            </p>
                            <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                              {type.duration} dias • {type.channels.join(", ")}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="campaignName">Nome da Campanha</Label>
                  <Input
                    id="campaignName"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Black Friday 2024"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="objective">Objetivo</Label>
                  <Input
                    id="objective"
                    value={formData.objective}
                    onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                    placeholder="Ex: Aumentar vendas em 30%"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Público-Alvo</Label>
                  <Input
                    id="targetAudience"
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    placeholder="Ex: Mulheres 25-40 anos"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className="sticky bottom-0 p-6 border-t flex items-center justify-between"
            style={{
              backgroundColor: "var(--modal-bg)",
              borderColor: "var(--modal-border)",
            }}
          >
            <Button variant="ghost" onClick={step === 1 ? onClose : () => setStep(1)}>
              {step === 1 ? "Cancelar" : "Voltar"}
            </Button>
            <Button
              onClick={step === 1 ? () => setStep(2) : handleCreate}
              disabled={step === 1 ? !selectedType : !formData.name}
              style={{
                backgroundColor: "var(--btn-primary-bg)",
                color: "var(--btn-primary-text)",
              }}
            >
              {step === 1 ? "Continuar" : "Criar Campanha"}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}