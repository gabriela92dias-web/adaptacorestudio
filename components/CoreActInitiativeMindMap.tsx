import React, { useState, useCallback, useMemo } from "react";
import { 
  ReactFlow, 
  Controls, 
  Background, 
  applyNodeChanges, 
  applyEdgeChanges, 
  addEdge,
  Handle,
  Position,
  NodeProps,
  Edge
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import styles from "../pages/coreact.iniciativas.module.css";
import { Building2, Target, Folder, Layers, ListTodo, Zap } from "lucide-react";

// --------------------------------------------------------------------
// Custom Aesthetic Nodes (Supabase Visualizer Style)
// --------------------------------------------------------------------
const CustomEntityNode = ({ data, type }: NodeProps & { type?: string }) => {
  const Icon = data.icon as React.ElementType;
  const isAction = data.isAction;

  return (
    <div style={{
      background: isAction ? "var(--background)" : "var(--surface)",
      border: `1px solid ${isAction ? "var(--border)" : "var(--primary)"}`,
      borderRadius: "var(--radius-md)",
      padding: "var(--spacing-3) var(--spacing-4)",
      minWidth: "220px",
      display: "flex",
      alignItems: "center",
      gap: "var(--spacing-3)",
      boxShadow: isAction ? "none" : "0 4px 12px rgba(0,0,0,0.05)",
      opacity: isAction ? 0.7 : 1,
    }}>
      <Handle type="target" position={Position.Left} style={{ background: "transparent", border: "none" }} />
      <div style={{ 
        background: "var(--muted)", 
        padding: "var(--spacing-2)", 
        borderRadius: "var(--radius-sm)",
        display: "flex"
      }}>
        {Icon && <Icon size={16} style={{ color: "var(--foreground)" }} />}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: "var(--font-size-xs)", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted-foreground)" }}>
          {data.type}
        </span>
        <span style={{ fontSize: "var(--font-size-sm)", fontWeight: 600, color: "var(--foreground)" }}>
          {data.label}
        </span>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: "transparent", border: "none" }} />
    </div>
  );
};

// --------------------------------------------------------------------
// Mock Initial Data Flow (Setor -> Iniciativa -> Projeto -> Etapa)
// --------------------------------------------------------------------
const initialNodes = [
  // Nível 0 - Setor
  { id: "S1", type: "entityNode", position: { x: 50, y: 300 }, data: { label: "Tech & Product", type: "Setor Master", icon: Building2 } },
  // Nível 1 - Iniciativas
  { id: "I1", type: "entityNode", position: { x: 350, y: 150 }, data: { label: "Plataforma CoreAct", type: "Iniciativa", icon: Target } },
  { id: "I2", type: "entityNode", position: { x: 350, y: 450 }, data: { label: "AI Agent Manager", type: "Iniciativa", icon: Target } },
  // Nível 2 - Projetos
  { id: "P1", type: "entityNode", position: { x: 650, y: 50 }, data: { label: "CoreAct V1", type: "Projeto", icon: Folder } },
  { id: "P2", type: "entityNode", position: { x: 650, y: 250 }, data: { label: "Dashboard Executivo", type: "Projeto", icon: Folder } },
  { id: "P3", type: "entityNode", position: { x: 650, y: 450 }, data: { label: "Agente Integrador", type: "Projeto", icon: Folder } },
  // Nível 3 - Etapas
  { id: "E1", type: "entityNode", position: { x: 950, y: 50 }, data: { label: "Desenvolvimento Frontend", type: "Etapa", icon: Layers } },
  { id: "E2", type: "entityNode", position: { x: 950, y: 250 }, data: { label: "Integração UI/UX", type: "Etapa", icon: Layers } },
  { id: "E3", type: "entityNode", position: { x: 950, y: 450 }, data: { label: "Treinamento LLM", type: "Etapa", icon: Layers } },
  // Nível 4 - Tarefas
  { id: "T1", type: "entityNode", position: { x: 1250, y: 50 }, data: { label: "Implementar React Flow", type: "Tarefa", icon: ListTodo } },
  { id: "T2", type: "entityNode", position: { x: 1250, y: 250 }, data: { label: "Refatorar CSS Modules", type: "Tarefa", icon: ListTodo } },
  // Nível 5 - Ações (Folhas)
  { id: "A1", type: "entityNode", position: { x: 1550, y: 20 }, data: { label: "Instalar @xyflow", type: "Ação", icon: Zap, isAction: true } },
  { id: "A2", type: "entityNode", position: { x: 1550, y: 80 }, data: { label: "Criar Nodes Base", type: "Ação", icon: Zap, isAction: true } },
];

const defaultEdgeStyle = { stroke: "var(--border)", strokeWidth: 2 };
const initialEdges: Edge[] = [
  { id: "eS1-I1", source: "S1", target: "I1", type: 'smoothstep', animated: true, style: { stroke: "var(--primary)", strokeWidth: 2 } },
  { id: "eS1-I2", source: "S1", target: "I2", type: 'smoothstep', style: defaultEdgeStyle },
  { id: "eI1-P1", source: "I1", target: "P1", type: 'smoothstep', style: defaultEdgeStyle },
  { id: "eI1-P2", source: "I1", target: "P2", type: 'smoothstep', style: defaultEdgeStyle },
  { id: "eI2-P3", source: "I2", target: "P3", type: 'smoothstep', style: defaultEdgeStyle },
  { id: "eP1-E1", source: "P1", target: "E1", type: 'smoothstep', style: defaultEdgeStyle },
  { id: "eP2-E2", source: "P2", target: "E2", type: 'smoothstep', style: defaultEdgeStyle },
  { id: "eP3-E3", source: "P3", target: "E3", type: 'smoothstep', style: defaultEdgeStyle },
  { id: "eE1-T1", source: "E1", target: "T1", type: 'smoothstep', style: defaultEdgeStyle },
  { id: "eE2-T2", source: "E2", target: "T2", type: 'smoothstep', style: defaultEdgeStyle },
  { id: "eT1-A1", source: "T1", target: "A1", type: 'smoothstep', animated: true, style: { stroke: "var(--muted-foreground)" } },
  { id: "eT1-A2", source: "T1", target: "A2", type: 'smoothstep', animated: true, style: { stroke: "var(--muted-foreground)" } },
];

// Use Default export for React.lazy
export default function CoreActInitiativeMindMap() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const nodeTypes = useMemo(() => ({ entityNode: CustomEntityNode }), []);

  const onNodesChange = useCallback((changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), []);

  return (
    <div className={styles.mindmapContainer} style={{ width: "100%", height: "100%", minHeight: "65vh" }}>
      <div style={{ padding: "var(--spacing-4)", borderBottom: "1px solid var(--border)", background: "var(--card)" }}>
        <h3 style={{ margin: 0, fontSize: "var(--font-size-lg)", fontWeight: 600 }}>Mapa Estratégico</h3>
        <p style={{ margin: 0, fontSize: "var(--font-size-sm)", color: "var(--muted-foreground)" }}>
          Visualização em árvore da execução: Setores → Iniciativas → Projetos → Etapas → Tarefas → Ações.
        </p>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={24} size={2} color="var(--border)" />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
