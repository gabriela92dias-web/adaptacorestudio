import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  Clock, 
  ShieldAlert, 
  Blocks,
  ArrowRight
} from "lucide-react";

export default function V8Dashboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const fetchData = () => {
    setLoading(true);
    fetch("/_api/v8/list")
      .then(r => r.json())
      .then(d => {
        setData(d.campaigns || []);
        setLoading(false);
      })
      .catch(e => {
        console.error("Erro ao buscar campanhas v8", e);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const campaign = data[selectedIdx];

  const updateModuleField = async (modId: number, field: string, value: any) => {
    await fetch("/_api/v8/update_module", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ id: modId, [field]: value })
    });
    fetchData();
  };

  const toggleGate = async (gateId: number, currentOk: boolean) => {
    await fetch("/_api/v8/update_gate", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ id: gateId, ok: !currentOk })
    });
    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-[var(--muted-foreground)]">
          <Zap size={32} className="animate-pulse text-[var(--primary)]" />
          <p className="font-heading uppercase tracking-wider text-xs font-bold">Consolidando Matriz V8...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-[var(--card)] border border-[var(--border)] p-12 rounded-[2rem] shadow-sm">
          <div className="w-16 h-16 bg-[var(--primary)]/10 text-[var(--primary)] rounded-2xl flex items-center justify-center mx-auto mb-6">
             <Blocks size={32} />
          </div>
          <h1 className="text-2xl font-bold mb-3 font-heading text-[var(--foreground)] tracking-tight">Sem Campanhas no Ciclo</h1>
          <p className="text-[var(--muted-foreground)] text-sm mb-8 leading-relaxed">
            Inicie um novo <strong>Blueprint 3D</strong> no Painel de Criação para que os dados estratégicos e operacionais apareçam aqui.
          </p>
          <a href="/brand-studio" className="inline-flex items-center gap-2 bg-[var(--foreground)] text-[var(--background)] px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
             Abrir Brand Studio <ArrowRight size={16}/>
          </a>
        </div>
      </div>
    );
  }

  const { modulos = [], gates = [] } = campaign;
  const criticalIssues: string[] = [];
  
  modulos.filter((m: any) => m.status === 'on').forEach((m: any) => {
    if (!m.owner) criticalIssues.push(`Módulo "${m.nome}" sem responsável.`);
    if (!m.ok) criticalIssues.push(`Módulo "${m.nome}" aguardando ativação.`);
  });

  gates.forEach((g: any) => {
    if (g.critical && !g.ok) criticalIssues.push(`Checklat Crítico: ${g.name}`);
  });

  const isPublishReady = criticalIssues.length === 0;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans antialiased flex flex-col items-center">
      <Helmet><title>Dashboard V8 | Engine Executiva</title></Helmet>

      {/* HEADER EXECUTIVO */}
      <header className="w-full border-b border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-md sticky top-0 z-50">
         <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="bg-[var(--foreground)] text-[var(--background)] p-1.5 rounded-lg">
                  <Activity size={18} />
               </div>
               <span className="font-heading font-black text-lg tracking-tighter uppercase italic">V8 Engine</span>
            </div>
            
            <div className="flex items-center gap-4">
               {data.length > 1 && (
                 <div className="flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] p-1 rounded-xl">
                    <select
                      className="bg-transparent pl-3 pr-8 py-1.5 text-xs font-bold uppercase tracking-tight appearance-none cursor-pointer outline-none"
                      value={selectedIdx}
                      onChange={e => setSelectedIdx(Number(e.target.value))}
                    >
                      {data.map((c: any, i: number) => (
                        <option key={c.id} value={i}>{c.objetivo_primario || "Campanha Sazonal"}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none -ml-6 mr-3">
                       <Clock size={12} className="text-[var(--muted-foreground)]" />
                    </div>
                 </div>
               )}
               <div className="h-2 w-2 rounded-full bg-[var(--success)] animate-pulse shadow-[0_0_8px_var(--success)]" />
               <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Live Matrix</span>
            </div>
         </div>
      </header>

      <div className="w-full max-w-7xl px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* COLUNA ESQUERDA: DNA & SAÚDE */}
        <div className="lg:col-span-4 flex flex-col gap-8">
           
           {/* CARD DNA STRATEGICO */}
           <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                 <Blocks size={120} />
              </div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)] mb-6">Blueprint Strategy</h3>
              <h2 className="text-3xl font-heading font-black leading-tight mb-8 tracking-tighter">
                 {campaign.objetivo_primario}
              </h2>

              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] font-bold uppercase text-[var(--muted-foreground)] mb-2 block tracking-wider">Direção Estratégica</label>
                    <div className="flex items-center gap-3 bg-[var(--surface)] p-3 rounded-2xl border border-[var(--border)]">
                       <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-black">D</div>
                       <span className="text-sm font-bold">{campaign.direcao || "Institucional Geral"}</span>
                    </div>
                 </div>
                 <div>
                    <label className="text-[10px] font-bold uppercase text-[var(--muted-foreground)] mb-2 block tracking-wider">Perfil de Experiência</label>
                    <div className="flex items-center gap-3 bg-[var(--surface)] p-3 rounded-2xl border border-[var(--border)]">
                       <div className="w-10 h-10 rounded-xl bg-[var(--success)]/10 text-[var(--success)] flex items-center justify-center font-black">E</div>
                       <span className="text-sm font-bold">{campaign.experiencia || "Foco em Cuidado"}</span>
                    </div>
                 </div>
                 <div>
                    <label className="text-[10px] font-bold uppercase text-[var(--muted-foreground)] mb-2 block tracking-wider">Público Prioritário</label>
                    <div className="text-sm font-medium px-1 italic text-[var(--muted-foreground)]">
                       "{campaign.segmento_publico}"
                    </div>
                 </div>
              </div>
           </div>

           {/* STATUS DE BLOQUEIOS */}
           <div className={`rounded-3xl p-8 border ${isPublishReady ? 'bg-[var(--success)]/5 border-[var(--success)]/20 text-[var(--success)]' : 'bg-[var(--error)]/5 border-[var(--error)]/20 text-[var(--error)]'}`}>
              <div className="flex items-center gap-3 mb-6">
                 {isPublishReady ? <CheckCircle2 size={24}/> : <ShieldAlert size={24}/>}
                 <h3 className="text-lg font-heading font-black uppercase tracking-tight">
                    {isPublishReady ? "Pronto para Go-Live" : "Pendências Críticas"}
                 </h3>
              </div>

              {criticalIssues.length > 0 ? (
                <ul className="space-y-4">
                  {criticalIssues.map((issue, idx) => (
                    <li key={idx} className="text-xs leading-relaxed flex items-start gap-3">
                      <span className="mt-1 w-2 h-2 shrink-0 bg-[var(--error)] rounded-full animate-pulse" />
                      <span className="font-medium">{issue}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm font-medium opacity-80 leading-relaxed">
                   Todos os módulos de governança e ativação estão conformes com os padrões institucionais da Adapta.
                </p>
              )}
           </div>

        </div>

        {/* COLUNA DIREITA: OPERAÇÃO E GATES */}
        <div className="lg:col-span-8 space-y-10">
           
           {/* STATS RAPIDOS */}
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[var(--card)] border border-[var(--border)] p-6 rounded-3xl">
                 <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Ações de Segurança</span>
                    <ShieldAlert size={14} className="text-[var(--warning)]" />
                 </div>
                 <div className="text-2xl font-black font-heading tracking-tighter">
                    {gates.filter((g: any) => g.ok).length}/{gates.length}
                 </div>
                 <div className="text-[10px] text-[var(--muted-foreground)] font-bold mt-1">GATES VALIDADOS</div>
              </div>
              <div className="bg-[var(--card)] border border-[var(--border)] p-6 rounded-3xl">
                 <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Módulos Ativos</span>
                    <Blocks size={14} className="text-[var(--primary)]" />
                 </div>
                 <div className="text-2xl font-black font-heading tracking-tighter">
                    {modulos.filter((m: any) => m.ok).length}/{modulos.filter((m: any) => m.status === 'on').length}
                 </div>
                 <div className="text-[10px] text-[var(--muted-foreground)] font-bold mt-1">EXECUÇÃO CONCLUÍDA</div>
              </div>
           </div>

           {/* EXECUÇÃO DE MÓDULOS */}
           <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-sm">
              <div className="px-8 py-6 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface)]/30">
                 <h3 className="font-heading font-black uppercase text-sm tracking-widest">Matriz de Entrega</h3>
                 <span className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase">Tempo Real</span>
              </div>
              
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-[var(--surface)] text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)] border-b border-[var(--border)]">
                       <tr>
                          <th className="px-8 py-4">Componente</th>
                          <th className="px-6 py-4">Evidência</th>
                          <th className="px-6 py-4">Status V8</th>
                          <th className="px-6 py-4">Liderança</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                       {modulos.filter((m:any) => m.status === 'on').map((m: any) => (
                          <tr key={m.id} className="hover:bg-[var(--surface)]/50 transition-colors group">
                             <td className="px-8 py-5">
                                <div className="font-bold text-sm leading-tight text-[var(--foreground)]">{m.nome}</div>
                                <div className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-tight mt-1">Bloco {m.bloco}</div>
                             </td>
                             <td className="px-6 py-5">
                                <div className="text-xs font-bold text-[var(--muted-foreground)] bg-[var(--surface)] border border-[var(--border)] px-3 py-1.5 rounded-lg inline-block italic">
                                   {m.ok_trigger || "Check-in"}
                                </div>
                             </td>
                             <td className="px-6 py-5">
                                <button
                                  onClick={() => updateModuleField(m.id, 'ok', !m.ok)}
                                  className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter px-3 py-2 rounded-xl transition-all border ${m.ok ? 'bg-[var(--success)] text-[var(--success-foreground)] border-[var(--success)]' : 'bg-[var(--background)] text-[var(--foreground)] border-[var(--border)] hover:border-[var(--primary)]'}`}
                                >
                                   {m.ok ? (
                                     <> <CheckCircle2 size={12}/> Ativo </>
                                   ) : (
                                      "Pendente"
                                   )}
                                </button>
                             </td>
                             <td className="px-6 py-5 min-w-[140px]">
                                <input 
                                   className="w-full bg-transparent border-none placeholder:text-[var(--muted-foreground)]/30 text-[var(--foreground)] text-xs font-bold outline-none focus:ring-1 focus:ring-[var(--primary)] rounded px-1 -mx-1"
                                   placeholder="ALOCAR..." 
                                   defaultValue={m.owner || ''}
                                   onBlur={(e) => updateModuleField(m.id, 'owner', e.target.value)}
                                />
                             </td>
                          </tr>
                       ))}

                       {/* SEGURANÇA / GATES */}
                       {gates.map((g: any) => (
                          <tr key={g.id} className="bg-[var(--muted)]/5 hover:bg-[var(--muted)]/10 transition-colors group">
                             <td className="px-8 py-5">
                                <div className="font-bold text-sm leading-tight text-[var(--foreground)] flex items-center gap-2">
                                   {g.name}
                                   {g.critical && <ShieldAlert size={12} className="text-[var(--error)]" />}
                                </div>
                                <div className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-tight mt-1 italic">Conformidade Legal</div>
                             </td>
                             <td className="px-6 py-5">
                                <div className="text-xs font-medium text-[var(--muted-foreground)] opacity-60">
                                   {g.artifact || "Verificação"}
                                </div>
                             </td>
                             <td className="px-6 py-5">
                                <button
                                  onClick={() => toggleGate(g.id, g.ok)}
                                  className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter px-3 py-2 rounded-xl transition-all border ${g.ok ? 'bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]' : 'bg-[var(--background)] text-[var(--foreground)] border-[var(--border)] hover:border-[var(--primary)]'}`}
                                >
                                   {g.ok ? "Validado" : "Auditoría"}
                                </button>
                             </td>
                             <td className="px-6 py-5">
                                <div className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase">
                                   Conselho V8
                                </div>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
}
