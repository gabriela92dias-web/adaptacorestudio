/**
 * ADAPTA CORE STUDIO - Color Confirmation Panel
 * Interface visual para sistema de confirmação de cores
 * Versão: 2026.1.1 | Build: 1.0.5-confirmation-panel
 */

import { useState, useEffect } from 'react';
import {
  colorConfirmationSystem,
  type ColorConfirmation,
} from '../utils/color-validation/color-confirmation-system';
import { ADAPTA_PALETTE } from '../utils/color-validation/palette-registry';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Shield,
  Plus,
  FileCheck,
} from 'lucide-react';

export function ColorConfirmationPanel() {
  const [confirmations, setConfirmations] = useState<ColorConfirmation[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    loadConfirmations();
  }, []);

  const loadConfirmations = () => {
    setConfirmations(colorConfirmationSystem.getAllConfirmations());
  };

  return (
    <div className="w-full h-full bg-[var(--neutral-900)] text-[var(--neutral-050)] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--neutral-700)]">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-[var(--neutral-400)]" />
          <div>
            <h1 className="text-2xl font-bold">Sistema de Confirmação de Cores</h1>
            <p className="text-sm text-[var(--neutral-400)]">
              Lei 004: Na dúvida, confirme antes de implementar
            </p>
          </div>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[var(--neutral-600)] hover:bg-[var(--neutral-500)] text-[var(--neutral-050)]">
              <Plus className="w-4 h-4 mr-2" />
              Nova Confirmação
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[var(--neutral-800)] border-[var(--neutral-600)] text-[var(--neutral-050)] max-w-2xl">
            <CreateConfirmationForm
              onSuccess={() => {
                setIsCreateDialogOpen(false);
                loadConfirmations();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<FileCheck className="w-5 h-5" />}
          label="Total"
          value={confirmations.length}
          color="neutral"
        />
        <StatCard
          icon={<CheckCircle className="w-5 h-5" />}
          label="Aprovadas"
          value={
            confirmations.filter((c) => c.status === 'APPROVED').length
          }
          color="success"
        />
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          label="Pendentes"
          value={
            confirmations.filter((c) => c.status === 'PENDING').length
          }
          color="warning"
        />
        <StatCard
          icon={<XCircle className="w-5 h-5" />}
          label="Rejeitadas"
          value={
            confirmations.filter((c) => c.status === 'REJECTED').length
          }
          color="error"
        />
      </div>

      {/* Confirmations List */}
      <div className="space-y-4">
        {confirmations.length === 0 ? (
          <div className="text-center py-12 bg-[var(--neutral-800)] rounded-lg border border-[var(--neutral-700)]">
            <AlertCircle className="w-12 h-12 text-[var(--neutral-400)] mx-auto mb-3" />
            <p className="text-[var(--neutral-400)]">
              Nenhuma confirmação registrada
            </p>
          </div>
        ) : (
          confirmations.map((confirmation) => (
            <ConfirmationCard
              key={confirmation.id}
              confirmation={confirmation}
              onUpdate={loadConfirmations}
            />
          ))
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: 'neutral' | 'success' | 'warning' | 'error';
}) {
  const colorClasses = {
    neutral: 'text-[var(--neutral-400)]',
    success: 'text-[var(--status-success-primary)]',
    warning: 'text-[var(--status-warning-primary)]',
    error: 'text-[var(--status-error-primary)]',
  };

  return (
    <div className="bg-[var(--neutral-800)] p-4 rounded-lg border border-[var(--neutral-700)]">
      <div className={`flex items-center gap-2 mb-2 ${colorClasses[color]}`}>
        {icon}
        <span className="text-xs text-[var(--neutral-400)]">{label}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

function ConfirmationCard({
  confirmation,
  onUpdate,
}: {
  confirmation: ColorConfirmation;
  onUpdate: () => void;
}) {
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);

  const statusConfig = {
    PENDING: {
      icon: <Clock className="w-4 h-4" />,
      label: 'Pendente',
      color: 'bg-[var(--status-warning-primary)]',
    },
    APPROVED: {
      icon: <CheckCircle className="w-4 h-4" />,
      label: 'Aprovado',
      color: 'bg-[var(--status-success-primary)]',
    },
    REJECTED: {
      icon: <XCircle className="w-4 h-4" />,
      label: 'Rejeitado',
      color: 'bg-[var(--status-error-primary)]',
    },
    AWAITING_CONFIRMATION: {
      icon: <AlertCircle className="w-4 h-4" />,
      label: 'Aguardando',
      color: 'bg-[var(--neutral-500)]',
    },
  };

  const status = statusConfig[confirmation.status];

  return (
    <div className="bg-[var(--neutral-800)] p-5 rounded-lg border border-[var(--neutral-700)]">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold">{confirmation.project}</h3>
            <Badge
              className={`${status.color} text-white flex items-center gap-1`}
            >
              {status.icon}
              {status.label}
            </Badge>
          </div>
          <p className="text-sm text-[var(--neutral-400)]">
            {confirmation.component}
          </p>
          <p className="text-xs text-[var(--neutral-500)] mt-1">
            ID: {confirmation.id}
          </p>
        </div>

        {confirmation.status === 'PENDING' && (
          <Dialog
            open={isApproveDialogOpen}
            onOpenChange={setIsApproveDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="bg-[var(--status-success-primary)] hover:bg-[var(--status-success-primary)]/80"
              >
                Aprovar/Rejeitar
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[var(--neutral-800)] border-[var(--neutral-600)] text-[var(--neutral-050)]">
              <ApprovalForm
                confirmation={confirmation}
                onSuccess={() => {
                  setIsApproveDialogOpen(false);
                  onUpdate();
                }}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Colors */}
      <div className="mb-4">
        <p className="text-xs text-[var(--neutral-400)] mb-2">
          Cores solicitadas:
        </p>
        <div className="flex flex-wrap gap-2">
          {confirmation.colors.map((color, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 bg-[var(--neutral-700)] px-3 py-1.5 rounded text-xs"
            >
              <div
                className="w-4 h-4 rounded border border-[var(--neutral-500)]"
                style={{ backgroundColor: color.hex }}
              />
              <span>{color.variable}</span>
              {color.doubt && (
                <AlertCircle className="w-3 h-3 text-[var(--status-warning-primary)]" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Requester */}
      <div className="text-xs text-[var(--neutral-400)] mb-2">
        <span className="font-semibold">Solicitante:</span>{' '}
        {confirmation.requester.name} ({confirmation.requester.email})
        <span className="ml-2">
          {new Date(confirmation.requester.date).toLocaleDateString('pt-BR')}
        </span>
      </div>

      {/* Approver */}
      {confirmation.approver.approved && (
        <div className="text-xs text-[var(--status-success-primary)]">
          <span className="font-semibold">Aprovado por:</span>{' '}
          {confirmation.approver.name} ({confirmation.approver.email})
          <span className="ml-2">
            {new Date(confirmation.approver.date).toLocaleDateString('pt-BR')}
          </span>
        </div>
      )}

      {confirmation.notes && (
        <div className="mt-3 p-3 bg-[var(--neutral-700)] rounded text-xs">
          <span className="font-semibold">Notas:</span> {confirmation.notes}
        </div>
      )}
    </div>
  );
}

function CreateConfirmationForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    project: '',
    component: '',
    requesterName: '',
    requesterEmail: '',
    selectedColors: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const colors = formData.selectedColors.map((cssVar) => {
      const color = ADAPTA_PALETTE.find((c) => c.cssVar === cssVar);
      return {
        name: color?.name || cssVar,
        hex: color?.hex || '#000000',
        variable: cssVar,
      };
    });

    colorConfirmationSystem.createConfirmation(
      formData.project,
      formData.component,
      colors,
      {
        name: formData.requesterName,
        email: formData.requesterEmail,
      }
    );

    onSuccess();
  };

  const toggleColor = (cssVar: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedColors: prev.selectedColors.includes(cssVar)
        ? prev.selectedColors.filter((c) => c !== cssVar)
        : [...prev.selectedColors, cssVar],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>Nova Confirmação de Cores</DialogTitle>
        <DialogDescription className="text-[var(--neutral-400)]">
          Solicite aprovação para uso de cores conforme Lei 004
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-3">
        <div>
          <Label htmlFor="project">Projeto/Aplicação</Label>
          <Input
            id="project"
            value={formData.project}
            onChange={(e) =>
              setFormData({ ...formData, project: e.target.value })
            }
            required
            className="bg-[var(--neutral-700)] border-[var(--neutral-600)] text-[var(--neutral-050)]"
          />
        </div>

        <div>
          <Label htmlFor="component">Componente/FAB</Label>
          <Input
            id="component"
            value={formData.component}
            onChange={(e) =>
              setFormData({ ...formData, component: e.target.value })
            }
            required
            className="bg-[var(--neutral-700)] border-[var(--neutral-600)] text-[var(--neutral-050)]"
          />
        </div>

        <div>
          <Label htmlFor="requesterName">Seu Nome</Label>
          <Input
            id="requesterName"
            value={formData.requesterName}
            onChange={(e) =>
              setFormData({ ...formData, requesterName: e.target.value })
            }
            required
            className="bg-[var(--neutral-700)] border-[var(--neutral-600)] text-[var(--neutral-050)]"
          />
        </div>

        <div>
          <Label htmlFor="requesterEmail">Seu Email</Label>
          <Input
            id="requesterEmail"
            type="email"
            value={formData.requesterEmail}
            onChange={(e) =>
              setFormData({ ...formData, requesterEmail: e.target.value })
            }
            required
            className="bg-[var(--neutral-700)] border-[var(--neutral-600)] text-[var(--neutral-050)]"
          />
        </div>

        <div>
          <Label>Cores Necessárias</Label>
          <div className="max-h-48 overflow-y-auto bg-[var(--neutral-700)] p-3 rounded space-y-2">
            {ADAPTA_PALETTE.filter((c) => c.spectrum === 'STATUS').map(
              (color) => (
                <div
                  key={color.cssVar}
                  className="flex items-center gap-2 text-sm"
                >
                  <Checkbox
                    id={color.cssVar}
                    checked={formData.selectedColors.includes(color.cssVar)}
                    onCheckedChange={() => toggleColor(color.cssVar)}
                  />
                  <label
                    htmlFor={color.cssVar}
                    className="flex items-center gap-2 flex-1 cursor-pointer"
                  >
                    <div
                      className="w-4 h-4 rounded border border-[var(--neutral-500)]"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span>{color.name}</span>
                  </label>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-[var(--neutral-600)] hover:bg-[var(--neutral-500)]"
        disabled={formData.selectedColors.length === 0}
      >
        Criar Solicitação
      </Button>
    </form>
  );
}

function ApprovalForm({
  confirmation,
  onSuccess,
}: {
  confirmation: ColorConfirmation;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    approverName: '',
    approverEmail: '',
    notes: '',
  });

  const handleApprove = (approved: boolean) => {
    colorConfirmationSystem.approveConfirmation(
      confirmation.id,
      {
        name: formData.approverName,
        email: formData.approverEmail,
      },
      approved,
      formData.notes
    );

    onSuccess();
  };

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle>Aprovar/Rejeitar Confirmação</DialogTitle>
        <DialogDescription className="text-[var(--neutral-400)]">
          {confirmation.project} - {confirmation.component}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-3">
        <div>
          <Label htmlFor="approverName">Nome do Design Lead</Label>
          <Input
            id="approverName"
            value={formData.approverName}
            onChange={(e) =>
              setFormData({ ...formData, approverName: e.target.value })
            }
            required
            className="bg-[var(--neutral-700)] border-[var(--neutral-600)] text-[var(--neutral-050)]"
          />
        </div>

        <div>
          <Label htmlFor="approverEmail">Email</Label>
          <Input
            id="approverEmail"
            type="email"
            value={formData.approverEmail}
            onChange={(e) =>
              setFormData({ ...formData, approverEmail: e.target.value })
            }
            required
            className="bg-[var(--neutral-700)] border-[var(--neutral-600)] text-[var(--neutral-050)]"
          />
        </div>

        <div>
          <Label htmlFor="notes">Notas (opcional)</Label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            className="w-full h-20 bg-[var(--neutral-700)] border border-[var(--neutral-600)] text-[var(--neutral-050)] rounded p-2 text-sm"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={() => handleApprove(true)}
          className="flex-1 bg-[var(--status-success-primary)] hover:bg-[var(--status-success-primary)]/80"
          disabled={!formData.approverName || !formData.approverEmail}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Aprovar
        </Button>
        <Button
          onClick={() => handleApprove(false)}
          className="flex-1 bg-[var(--status-error-primary)] hover:bg-[var(--status-error-primary)]/80"
          disabled={!formData.approverName || !formData.approverEmail}
        >
          <XCircle className="w-4 h-4 mr-2" />
          Rejeitar
        </Button>
      </div>
    </div>
  );
}
