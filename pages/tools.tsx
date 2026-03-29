import { lazy, Suspense } from "react";

const LazyToolsHome = lazy(() => import("../modules/tools").then(m => ({ default: m.ToolsHome })));

export default function ToolsHub() {
  return (
    <Suspense fallback={
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh', 
        color: 'var(--text-secondary, #666)', 
        padding: '2rem' 
      }}>
        Carregando Brand Studio...
      </div>
    }>
      <LazyToolsHome />
    </Suspense>
  );
}
