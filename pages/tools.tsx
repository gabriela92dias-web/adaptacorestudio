import { lazy, Suspense } from "react";
import { Helmet } from "react-helmet";

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
        <Helmet><title>CoreStudio | Brand Studio</title></Helmet>
        Carregando Brand Studio...
      </div>
    }>
      <Helmet><title>CoreStudio | Brand Studio</title></Helmet>
      <LazyToolsHome />
    </Suspense>
  );
}
