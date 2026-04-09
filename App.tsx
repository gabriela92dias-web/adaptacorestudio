import React, { Component, ErrorInfo, ReactNode, useEffect } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { CriarCampanha } from "./components/brand-studio/criar-campanha";
import V8Dashboard from "./pages/v8-dashboard";
class GlobalErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean, error: Error | null}> {
  state = { hasError: false, error: null as Error | null };
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', background: '#fee', color: '#c00', height: '100vh' }}>
          <h1 style={{fontSize: '2rem'}}>Crash Detectado</h1>
          <pre style={{ whiteSpace: 'pre-wrap', marginTop: '1rem', fontSize: '1rem' }}>{this.state.error?.toString()}</pre>
          <pre style={{ whiteSpace: 'pre-wrap', marginTop: '1rem', fontSize: '0.8rem' }}>{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
import { GlobalContextProviders } from "./components/_globalContextProviders";
import { DevBuilder } from "./components/DevBuilder";
const Page_0 = React.lazy(() => import("./pages/login"));
import PageLayout_0 from "./pages/login.pageLayout.tsx";
const Page_1 = React.lazy(() => import("./pages/_index.tsx"));
import PageLayout_1 from "./pages/_index.pageLayout.tsx";
const Page_2 = React.lazy(() => import("./pages/coreact.tsx"));
import PageLayout_2 from "./pages/coreact.pageLayout.tsx";
const Page_3 = React.lazy(() => import("./pages/campanhas.tsx"));
import PageLayout_3 from "./pages/campanhas.pageLayout.tsx";
const Page_19 = React.lazy(() => import("./pages/relatorios.tsx"));
import PageLayout_19 from "./pages/relatorios.pageLayout.tsx";
const Page_4 = React.lazy(() => import("./pages/coreact.time.tsx"));
import PageLayout_4 from "./pages/coreact.time.pageLayout.tsx";
const Page_5 = React.lazy(() => import("./pages/configuracoes.tsx"));
import PageLayout_5 from "./pages/configuracoes.pageLayout.tsx";
const Page_6 = React.lazy(() => import("./pages/coreact.setores.tsx"));
import PageLayout_6 from "./pages/coreact.setores.pageLayout.tsx";
const Page_7 = React.lazy(() => import("./pages/coreact.orcamento.tsx"));
import PageLayout_7 from "./pages/coreact.orcamento.pageLayout.tsx";
const Page_8 = React.lazy(() => import("./pages/identidade-visual.tsx"));
import PageLayout_8 from "./pages/identidade-visual.pageLayout.tsx";
const Page_9 = React.lazy(() => import("./pages/coreact.cronograma.tsx"));
import PageLayout_9 from "./pages/coreact.cronograma.pageLayout.tsx";
const Page_10 = React.lazy(() => import("./pages/coreact.iniciativas.tsx"));
import PageLayout_10 from "./pages/coreact.iniciativas.pageLayout.tsx";
const Page_11 = React.lazy(() => import("./pages/marketing-comunicacao.tsx"));
import PageLayout_11 from "./pages/marketing-comunicacao.pageLayout.tsx";
const Page_12 = React.lazy(() => import("./pages/documentos-corporativos.tsx"));
import PageLayout_12 from "./pages/documentos-corporativos.pageLayout.tsx";
const Page_13 = React.lazy(() => import("./pages/forgot-password.tsx"));
const Page_14 = React.lazy(() => import("./pages/tools.tsx"));
import PageLayout_14 from "./pages/tools.pageLayout.tsx";
const Page_15 = React.lazy(() => import("./pages/coreact.projetos.tsx"));
import PageLayout_15 from "./pages/coreact.projetos.pageLayout.tsx";
const Page_16 = React.lazy(() => import("./pages/coreact.etapas.tsx"));
import PageLayout_16 from "./pages/coreact.etapas.pageLayout.tsx";
const Page_17 = React.lazy(() => import("./pages/coreact.tarefas.tsx"));
import PageLayout_17 from "./pages/coreact.tarefas.pageLayout.tsx";
const Page_18 = React.lazy(() => import("./pages/coreact.acoes.tsx"));
import PageLayout_18 from "./pages/coreact.acoes.pageLayout.tsx";

// Lazy load named exports
const Colors = React.lazy(() => import("./modules/tools/index").then(m => ({ default: m.Colors })));
const Gradients = React.lazy(() => import("./modules/tools/index").then(m => ({ default: m.Gradients })));
const Mascots = React.lazy(() => import("./modules/tools/index").then(m => ({ default: m.Mascots })));
const Analysis = React.lazy(() => import("./modules/tools/index").then(m => ({ default: m.Analysis })));
const LogoCores = React.lazy(() => import("./modules/tools/index").then(m => ({ default: m.LogoCores })));
const ColorWheelPage = React.lazy(() => import("./modules/tools/index").then(m => ({ default: m.ColorWheelPage })));
const ProdutosEmbalagens = React.lazy(() => import("./components/brand-studio/produtos-embalagens").then(m => ({ default: m.ProdutosEmbalagens })));
const GerarDoc = React.lazy(() => import("./pages/documentos-corporativos"));

if (!window.requestIdleCallback) {
  window.requestIdleCallback = (cb) => {
    setTimeout(cb, 1);
  };
}

import "./base.css";

const fileNameToRoute = new Map([["./pages/login.tsx","/login"],["./pages/_index.tsx","/"],["./pages/coreact.tsx","/coreact"],["./pages/campanhas.tsx","/campanhas"],["./pages/coreact.time.tsx","/coreact/time"],["./pages/configuracoes.tsx","/configuracoes"],["./pages/coreact.setores.tsx","/coreact/setores"],["./pages/coreact.orcamento.tsx","/coreact/orcamento"],["./pages/identidade-visual.tsx","/identidade-visual"],["./pages/coreact.cronograma.tsx","/coreact/cronograma"],["./pages/coreact.projetos.tsx","/coreact/projetos"],["./pages/coreact.etapas.tsx","/coreact/etapas"],["./pages/coreact.tarefas.tsx","/coreact/tarefas"],["./pages/coreact.acoes.tsx","/coreact/acoes"],["./pages/coreact.iniciativas.tsx","/coreact/iniciativas"],["./pages/marketing-comunicacao.tsx","/marketing-comunicacao"],["./pages/documentos-corporativos.tsx","/documentos-corporativos"],["./pages/tools.tsx","/tools"],["./pages/relatorios.tsx","/relatorios"]]);
const fileNameToComponent = new Map([
    ["./pages/login.tsx", Page_0],
["./pages/_index.tsx", Page_1],
["./pages/coreact.tsx", Page_2],
["./pages/campanhas.tsx", Page_3],
["./pages/coreact.time.tsx", Page_4],
["./pages/configuracoes.tsx", Page_5],
["./pages/coreact.setores.tsx", Page_6],
["./pages/coreact.orcamento.tsx", Page_7],
["./pages/identidade-visual.tsx", Page_8],
["./pages/coreact.cronograma.tsx", Page_9],
["./pages/coreact.iniciativas.tsx", Page_10],
["./pages/marketing-comunicacao.tsx", Page_11],
["./pages/documentos-corporativos.tsx", Page_12],
["./pages/tools.tsx", Page_14],
["./pages/relatorios.tsx", Page_19],
["./pages/coreact.projetos.tsx", Page_15],
["./pages/coreact.etapas.tsx", Page_16],
["./pages/coreact.tarefas.tsx", Page_17],
["./pages/coreact.acoes.tsx", Page_18],
  ]);

function makePageRoute(filename: string) {
  const Component = fileNameToComponent.get(filename);
  return <Component />;
}

function toElement({
  trie,
  fileNameToRoute,
  makePageRoute,
}: {
  trie: LayoutTrie;
  fileNameToRoute: Map<string, string>;
  makePageRoute: (filename: string) => React.ReactNode;
}) {
  return [
    ...trie.topLevel.map((filename) => (
      <Route
        key={fileNameToRoute.get(filename)}
        path={fileNameToRoute.get(filename)}
        element={makePageRoute(filename)}
      />
    )),
    ...Array.from(trie.trie.entries()).map(([Component, child], index) => (
      <Route
        key={index}
        element={
          <Component>
            <Outlet />
          </Component>
        }
      >
        {toElement({ trie: child, fileNameToRoute, makePageRoute })}
      </Route>
    )),
  ];
}

type LayoutTrieNode = Map<
  React.ComponentType<{ children: React.ReactNode }>,
  LayoutTrie
>;
type LayoutTrie = { topLevel: string[]; trie: LayoutTrieNode };
function buildLayoutTrie(layouts: {
  [fileName: string]: React.ComponentType<{ children: React.ReactNode }>[];
}): LayoutTrie {
  const result: LayoutTrie = { topLevel: [], trie: new Map() };
  Object.entries(layouts).forEach(([fileName, components]) => {
    let cur: LayoutTrie = result;
    for (const component of components) {
      if (!cur.trie.has(component)) {
        cur.trie.set(component, {
          topLevel: [],
          trie: new Map(),
        });
      }
      cur = cur.trie.get(component)!;
    }
    cur.topLevel.push(fileName);
  });
  return result;
}

function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      fontFamily: 'Inter, sans-serif',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '4rem', fontWeight: 800, margin: 0, color: 'var(--primary)' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '0.5rem', marginBottom: '1rem' }}>Ops! Página não encontrada</h2>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', marginBottom: '2rem', lineHeight: 1.5 }}>
        Parece que você acessou um link que não existe ou a página mudou de lugar.
      </p>
      <a href="/" style={{
        textDecoration: 'none',
        background: 'var(--primary)',
        color: 'var(--primary-foreground)',
        padding: '12px 24px',
        borderRadius: 'var(--radius-md)',
        fontWeight: 'bold',
        transition: 'opacity 0.2s ease'
      }}>
        Voltar para a página inicial
      </a>
    </div>
  );
}

import { useLocation, useNavigationType } from "react-router-dom";

export default function ScrollManager() {
  const { pathname, search, hash } = useLocation();
  const navType = useNavigationType(); // "PUSH" | "REPLACE" | "POP"

  useEffect(() => {
    // Back/forward: keep browser-like behavior
    if (navType === "POP") return;

    // Hash links: let the browser scroll to the anchor
    if (hash) return;

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, search, hash, navType]);

  return null;
}

// Removed redundant named imports

import { AppLayout } from "./components/AppLayout";
import { UserRoute } from "./components/ProtectedRoute";
import PitchDeck from "./pages/pitch-deck";

export function App() {
  return (
    <GlobalErrorBoundary>
      <BrowserRouter>
      <ScrollManager />
      <GlobalContextProviders>
        <React.Suspense fallback={
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-secondary)'}}>
            Carregando interface...
          </div>
        }>
          <Routes>
          {toElement({ trie: buildLayoutTrie({
"./pages/login.tsx": PageLayout_0,
"./pages/_index.tsx": PageLayout_1,
"./pages/coreact.tsx": PageLayout_2,
"./pages/campanhas.tsx": PageLayout_3,
"./pages/coreact.time.tsx": PageLayout_4,
"./pages/configuracoes.tsx": PageLayout_5,
"./pages/coreact.setores.tsx": PageLayout_6,
"./pages/coreact.orcamento.tsx": PageLayout_7,
"./pages/identidade-visual.tsx": PageLayout_8,
"./pages/coreact.cronograma.tsx": PageLayout_9,
"./pages/coreact.iniciativas.tsx": PageLayout_10,
"./pages/marketing-comunicacao.tsx": PageLayout_11,
"./pages/documentos-corporativos.tsx": PageLayout_12,
"./pages/tools.tsx": PageLayout_14,
"./pages/relatorios.tsx": PageLayout_19,
"./pages/coreact.projetos.tsx": PageLayout_15,
"./pages/coreact.etapas.tsx": PageLayout_16,
"./pages/coreact.tarefas.tsx": PageLayout_17,
"./pages/coreact.acoes.tsx": PageLayout_18,
}), fileNameToRoute, makePageRoute })} 
          <Route path="/v8" element={<CriarCampanha isOpen={true} onClose={() => {}} />} />
          <Route path="/v8-dashboard" element={<V8Dashboard />} />
          <Route path="/tools/colors" element={<UserRoute><AppLayout><Colors /></AppLayout></UserRoute>} />
          <Route path="/tools/gradients" element={<UserRoute><AppLayout><Gradients /></AppLayout></UserRoute>} />
          <Route path="/tools/mascots" element={<UserRoute><AppLayout><Mascots /></AppLayout></UserRoute>} />
          {/* <Route path="/tools/cenas-mascotes" element={<UserRoute><AppLayout><CenasMascotes /></AppLayout></UserRoute>} /> */}
          <Route path="/tools/analysis" element={<UserRoute><AppLayout><Analysis /></AppLayout></UserRoute>} />
          <Route path="/tools/logo-cores" element={<UserRoute><AppLayout><LogoCores /></AppLayout></UserRoute>} />
          <Route path="/tools/produtos" element={<UserRoute><AppLayout><ProdutosEmbalagens /></AppLayout></UserRoute>} />
          <Route path="/tools/gerar-doc" element={<UserRoute><AppLayout><GerarDoc /></AppLayout></UserRoute>} />
          <Route path="/tools/color-wheel" element={<UserRoute><AppLayout><ColorWheelPage /></AppLayout></UserRoute>} />
          <Route path="/forgot-password" element={<Page_13 />} />
          <Route path="/pitch" element={<PitchDeck />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </React.Suspense>
        <DevBuilder />
      </GlobalContextProviders>
    </BrowserRouter>
    </GlobalErrorBoundary>
  );
}
