import React, { Component, ErrorInfo, ReactNode, useEffect } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

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
import Page_0 from "./pages/login";
import PageLayout_0 from "./pages/login.pageLayout.tsx";
import Page_1 from "./pages/_index.tsx";
import PageLayout_1 from "./pages/_index.pageLayout.tsx";
import Page_2 from "./pages/coreact.tsx";
import PageLayout_2 from "./pages/coreact.pageLayout.tsx";
import Page_3 from "./pages/campanhas.tsx";
import PageLayout_3 from "./pages/campanhas.pageLayout.tsx";
import Page_4 from "./pages/coreact.time.tsx";
import PageLayout_4 from "./pages/coreact.time.pageLayout.tsx";
import Page_5 from "./pages/configuracoes.tsx";
import PageLayout_5 from "./pages/configuracoes.pageLayout.tsx";
import Page_6 from "./pages/coreact.setores.tsx";
import PageLayout_6 from "./pages/coreact.setores.pageLayout.tsx";
import Page_7 from "./pages/coreact.orcamento.tsx";
import PageLayout_7 from "./pages/coreact.orcamento.pageLayout.tsx";
import Page_8 from "./pages/identidade-visual.tsx";
import PageLayout_8 from "./pages/identidade-visual.pageLayout.tsx";
import Page_9 from "./pages/coreact.cronograma.tsx";
import PageLayout_9 from "./pages/coreact.cronograma.pageLayout.tsx";
import Page_10 from "./pages/coreact.iniciativas.tsx";
import PageLayout_10 from "./pages/coreact.iniciativas.pageLayout.tsx";
import Page_11 from "./pages/marketing-comunicacao.tsx";
import PageLayout_11 from "./pages/marketing-comunicacao.pageLayout.tsx";
import Page_12 from "./pages/documentos-corporativos.tsx";
import PageLayout_12 from "./pages/documentos-corporativos.pageLayout.tsx";
import Page_13 from "./pages/forgot-password.tsx";
import Page_14 from "./pages/tools.tsx";
import PageLayout_14 from "./pages/tools.pageLayout.tsx";

import { Colors, Gradients, Mascots, Analysis, LogoCores } from "./modules/tools/index";

if (!window.requestIdleCallback) {
  window.requestIdleCallback = (cb) => {
    setTimeout(cb, 1);
  };
}

import "./base.css";

const fileNameToRoute = new Map([["./pages/login.tsx","/login"],["./pages/_index.tsx","/"],["./pages/coreact.tsx","/coreact"],["./pages/campanhas.tsx","/campanhas"],["./pages/coreact.time.tsx","/coreact/time"],["./pages/configuracoes.tsx","/configuracoes"],["./pages/coreact.setores.tsx","/coreact/setores"],["./pages/coreact.orcamento.tsx","/coreact/orcamento"],["./pages/identidade-visual.tsx","/identidade-visual"],["./pages/coreact.cronograma.tsx","/coreact/cronograma"],["./pages/coreact.iniciativas.tsx","/coreact/iniciativas"],["./pages/marketing-comunicacao.tsx","/marketing-comunicacao"],["./pages/documentos-corporativos.tsx","/documentos-corporativos"],["./pages/tools.tsx","/tools"]]);
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
    <div>
      <h1>Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <p>Go back to the <a href="/" style={{ color: 'blue' }}>home page</a>.</p>
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

import { Colors, Gradients, Mascots, Analysis } from "./modules/tools";

import { AppLayout } from "./components/AppLayout";
import { UserRoute } from "./components/ProtectedRoute";

export function App() {
  return (
    <GlobalErrorBoundary>
      <BrowserRouter>
      <ScrollManager />
      <GlobalContextProviders>
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
}), fileNameToRoute, makePageRoute })} 
          <Route path="/tools/colors" element={<UserRoute><AppLayout><Colors /></AppLayout></UserRoute>} />
          <Route path="/tools/gradients" element={<UserRoute><AppLayout><Gradients /></AppLayout></UserRoute>} />
          <Route path="/tools/mascots" element={<UserRoute><AppLayout><Mascots /></AppLayout></UserRoute>} />
          <Route path="/tools/analysis" element={<UserRoute><AppLayout><Analysis /></AppLayout></UserRoute>} />
          <Route path="/tools/logo-cores" element={<UserRoute><AppLayout><LogoCores /></AppLayout></UserRoute>} />
          <Route path="/forgot-password" element={<Page_13 />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <DevBuilder />
      </GlobalContextProviders>
    </BrowserRouter>
    </GlobalErrorBoundary>
  );
}
