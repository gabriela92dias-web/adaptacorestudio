import { lazy, Suspense } from "react";

const LazyToolsHome = lazy(() => import("../modules/tools").then(m => ({ default: m.ToolsHome })));

export default function ToolsHub() {
  return (
    <Suspense fallback={<div className="p-8 flex items-center justify-center min-h-screen text-muted-foreground animate-pulse">Carregando Brand Studio...</div>}>
      <LazyToolsHome />
    </Suspense>
  );
}
