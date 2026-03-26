import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../helpers/useAuth";
import { Skeleton } from "../components/Skeleton";

export default function Home() {
  const { authState } = useAuth();
  
  if (authState.type === 'loading') {
    return (
      <div style={{ padding: '2rem' }}>
        <Skeleton style={{ height: 60, maxWidth: 300, marginBottom: '2rem' }} />
        <Skeleton style={{ height: 400 }} />
      </div>
    );
  }

  // Se estiver autenticado, joga direto pra nova Home do CoreStudio (que agora é o CoreAct)
  return <Navigate to="/coreact" replace />;
}