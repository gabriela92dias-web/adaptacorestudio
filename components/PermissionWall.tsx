import React from 'react';
import { ShieldAlert } from 'lucide-react';

export function PermissionWall({ moduleName }: { moduleName: string }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      padding: '2rem',
      textAlign: 'center',
      color: 'var(--text-secondary)'
    }}>
      <ShieldAlert size={48} style={{ marginBottom: '1rem', color: 'var(--text-tertiary)' }} />
      <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Acesso Restrito</h2>
      <p>Você não tem permissão para acessar o módulo <strong>{moduleName}</strong>.</p>
      <p style={{ fontSize: '0.875rem', marginTop: '1rem' }}>Solicite acesso a um administrador associado ao CoreAct.</p>
    </div>
  );
}
