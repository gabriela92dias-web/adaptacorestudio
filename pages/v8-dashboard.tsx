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

  const fetchData = () => {
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

  const toggleGate = async (gateId: number, currentOk: boolean) => {
    await fetch("/_api/v8/update_gate", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ id: gateId, ok: !currentOk })
    });
    fetchData();
  };

  const updateModuleField = async (modId: number, field: string, value: any) => {
    await fetch("/_api/v8/update_module", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ id: modId, [field]: value })
    });
    fetchData();
  };

  const [selectedIdx, setSelectedIdx] = useState(0);
  const campaign = data[selectedIdx];

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-[var(--muted-foreground)]">
          <Zap size={32} className="animate-pulse text-[var(--primary)]" />
          <p className="font-heading uppercase tracking-wider text-sm font-bold">Carregando Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6">
        <div className="text-center max-w-md bg-[var(--card)] border border-[var(--border)] p-10 rounded-3xl shadow-sm">
          <Blocks size={48} className="mx-auto text-[var(--muted-foreground)] opacity-50 mb-6" />
          <h1 className="text-2xl font-bold mb-3 font-heading text-[var(--foreground)]">Banco de Campanhas Vazio</h1>
          <p className="text-[var(--muted-foreground)] text-sm mb-8 leading-relaxed">
            Não há campanhas ativas no momento. Inicie um novo ciclo no construtor de campanhas para visualizar os painéis estratégicos.
          </p>
        </div>
      </div>
    );
  }

  const { modulos = [], gates = [] } = campaign;

  const activeModulesCount = modulos.filter((m: any) => m.status === 'on').length;
  const criticalIssues: string[] = [];
  const actionRequired: string[] = [];
  
  modulos.forEach((m: any) => {
    if (m.status !== 'on') return;
    const missing = [];
    if (!m.owner) missing.push("Responsável");
    if (missing.length) criticalIssues.push(`O módulo estratégico "${m.nome}" precisa de ${missing.join(", ")} definido.`);
    if (!m.ok) criticalIssues.push(`Falta evidência de conclusão no módulo "${m.nome}".`);
  });

  if (activeModulesCount === 0) criticalIssues.push("Atenção: A configuração atual indica que nenhum módulo está ativado para esta campanha.");

  gates.forEach((g: any) => {
    if (g.critical && !g.ok) criticalIssues.push(`Requisito Crítico Pendente: ${g.name}`);
    if (!g.critical && !g.ok) actionRequired.push(`Ação Recomendada: ${g.name}`);
  });

  const isPublishReady = criticalIssues.length === 0;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans antialiased flex flex-col items-center pb-20">
      <Helmet><title>CoreStudio | Painel de Controle</title></Helmet>

      <div className="w-full max-w-7xl px-6 py-10 flex flex-col lg:flex-row gap-8">
        
        {/* SIDEBAR: Resumo de Saúde da Campanha */}
        <aside className="w-full lg:w-[320px] flex flex-col gap-6 shrink-0">
          
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--primary)]/10 to-transparent rounded-full -mr-10 -mt-10 blur-2xl"></div>
            
            <div className="flex items-center gap-2 mb-4 text-[var(--muted-foreground)]">
              <Activity size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Painel Executivo</span>
            </div>
            
            <h1 className="text-2xl font-black font-heading leading-tight mb-2 tracking-tight">Status Geral</h1>
            <p className="text-[var(--muted-foreground)] text-sm mb-6 leading-relaxed">
              Visão macro de prontidão e conformidade das ativações mapeadas.
            </p>

            {data.length > 1 && (
              <div className="mb-6">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-1 block">Campanha Selecionada</label>
                <select
                  className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm font-medium focus:border-[var(--primary)] focus:outline-none transition-colors appearance-none cursor-pointer"
                  value={selectedIdx}
                  onChange={e => setSelectedIdx(Number(e.target.value))}
                >
                  {data.map((c: any, i: number) => (
                    <option key={c.id} value={i}>{c.objetivo_primario || "Campanha Sazonal"} — {new Date(c.created_at).toLocaleDateString()}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-[var(--muted-foreground)]">Prontidão de Lançamento</span>
                {isPublishReady ? (
                  <span className="flex items-center gap-1 text-[var(--success)] text-xs font-bold px-2 py-0.5 rounded bg-[var(--success)]/10"><CheckCircle2 size={12}/> PRONTO</span>
                ) : (
                  <span className="flex items-center gap-1 text-[var(--error)] text-xs font-bold px-2 py-0.5 rounded bg-[var(--error)]/10"><ShieldAlert size={12}/> BLOQUEADO</span>
                )}
              </div>
              <div className="w-full bg-[var(--border)] h-1.5 rounded-full mt-3 overflow-hidden">
                <div className={`h-full ${isPublishReady ? 'bg-[var(--success)] w-full' : 'bg-[var(--error)] w-1/3'} transition-all`}></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-[var(--surface)] p-3 rounded-lg border border-[var(--border)]">
                <div className="text-[var(--muted-foreground)] text-[10px] font-bold uppercase mb-1">Criada em</div>
                <div className="font-semibold">{new Date(campaign.created_at).toLocaleDateString()}</div>
              </div>
              <div className="bg-[var(--surface)] p-3 rounded-lg border border-[var(--border)]">
                <div className="text-[var(--muted-foreground)] text-[10px] font-bold uppercase mb-1">Origem</div>
                <div className="font-semibold tracking-tight">Motor V8</div>
              </div>
            </div>
          </div>

          <div className="bg-[var(--error)]/5 border border-[var(--error)]/20 text-[var(--error)] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={18} />
               <span className="text-sm font-bold tracking-tight">Atenção Prioritária ({criticalIssues.length})</span>
            </div>
            {criticalIssues.length > 0 ? (
              <ul className="space-y-3">
                {criticalIssues.map((issue, idx) => (
                  <li key={idx} className="text-sm leading-relaxed flex items-start gap-2">
                    <span className="mt-1 w-1.5 h-1.5 shrink-0 bg-[var(--error)] rounded-full" />
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm flex items-center gap-2 font-medium opacity-90"><CheckCircle2 size={16}/> Excelente! Nenhum bloqueio crítico.</p>
            )}

            {actionRequired.length > 0 && (
              <div className="mt-6 pt-5 border-t border-[var(--error)]/10">
                <span className="text-xs font-bold uppercase tracking-wider mb-3 block opacity-80">Recomendações ({actionRequired.length})</span>
                <ul className="space-y-2">
                  {actionRequired.map((act, idx) => (
                    <li key={idx} className="text-sm leading-relaxed text-[var(--error)]/80 flex items-start gap-2">
                      <span className="mt-1.5 w-1 h-1 shrink-0 bg-current rounded-full" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

        </aside>

        {/* MAIN: Detalhamento Operacional */}
        <main className="flex-1 flex flex-col gap-6">
          
          {/* Header Dashboard Visual */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold text-[var(--muted-foreground)] tracking-widest mb-2">Meta Principal</span>
                <span className="text-3xl font-heading font-black mb-1 text-[var(--foreground)]">500</span>
                <span className="text-xs text-[var(--muted-foreground)] font-medium">Cadastros Qualificados</span>
             </div>
             <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold text-[var(--muted-foreground)] tracking-widest mb-2">Engajamento Previsto</span>
                <span className="text-3xl font-heading font-black mb-1 text-[var(--foreground)]">2.4%</span>
                <span className="text-xs text-[var(--muted-foreground)] font-medium">Taxa de Conversão</span>
             </div>
             <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/80 text-[var(--primary-foreground)] rounded-2xl p-6 shadow-md flex flex-col justify-between relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-32 h-32 bg-[var(--primary-foreground)]/10 rounded-full blur-2xl"></div>
                <span className="text-[10px] uppercase font-bold text-[var(--primary-foreground)]/80 tracking-widest mb-2">Investimento Total</span>
                <span className="text-3xl font-heading font-black mb-1">R$ --</span>
                <span className="text-xs text-[var(--primary-foreground)]/90 font-medium">Orçamento Consolidado</span>
             </div>
          </section>

          <section className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-heading font-black mb-2">Detalhamento da Execução</h2>
            <p className="text-[var(--muted-foreground)] text-sm mb-8 leading-relaxed max-w-2xl">
              Nesta visão, você acompanha o progresso de cada etapa criativa e de governança. Marque os requisitos como concluídos conforme for adquirindo as evidências necessárias.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-[var(--border)]">
                    <th className="pb-3 text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] min-w-[200px]">Ativação Estratégica</th>
                    <th className="pb-3 text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] w-[160px]">Status</th>
                    <th className="pb-3 text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] min-w-[150px]">Evidência Exigida</th>
                    <th className="pb-3 text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] w-[180px]">Responsável</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]/50">
                  {modulos.filter((m: any) => m.status === 'on').map((m: any) => (
                    <tr key={m.id} className="group hover:bg-[var(--surface)] transition-colors">
                      <td className="py-4 pr-4">
                        <div className="font-semibold text-sm mb-1">{m.nome}</div>
                        <div className="text-xs text-[var(--muted-foreground)]">{m.ok ? "Concluído" : "Em andamento"}</div>
                      </td>
                      <td className="py-4 pr-4 align-middle">
                        <button 
                          onClick={() => updateModuleField(m.id, 'ok', !m.ok)}
                          className={`h-8 px-3 rounded-full text-xs font-bold transition-all border shrink-0 ${m.ok ? 'bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20 hover:bg-[var(--success)]/20' : 'bg-[var(--surface)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--card)] hover:border-[var(--primary)]'}`}
                        >
                          {m.ok ? "Concluído" : "Marcar Pronto"}
                        </button>
                      </td>
                      <td className="py-4 pr-4">
                        <div className="text-sm font-medium border border-dashed border-[var(--border)] bg-[var(--surface)] inline-flex px-3 py-1.5 rounded-lg text-[var(--muted-foreground)]">
                          {m.ok_trigger || "Nenhum exigido"}
                        </div>
                      </td>
                      <td className="py-4 align-middle">
                        <input 
                          className="w-full bg-transparent border border-transparent hover:border-[var(--border)] focus:border-[var(--primary)] focus:bg-[var(--surface)] rounded-md px-3 py-2 text-sm font-medium transition-all outline-none"
                          placeholder="Atribuir responsável..." 
                          defaultValue={m.owner || ''}
                          onBlur={(e) => updateModuleField(m.id, 'owner', e.target.value)} 
                        />
                      </td>
                    </tr>
                  ))}

                  {/* Soft Gates */}
                  {gates.map((g: any) => (
                    <tr key={g.id} className="group hover:bg-[var(--surface)] transition-colors">
                      <td className="py-4 pr-4">
                        <div className="font-semibold text-sm mb-1 flex justify-start items-center gap-2">
                           {g.name}
                           {g.critical && <ShieldAlert size={14} className="text-[var(--warning)]" />}
                        </div>
                        <div className="text-xs text-[var(--muted-foreground)]">Checkpoint de Segurança</div>
                      </td>
                      <td className="py-4 pr-4 align-middle">
                        <button 
                          onClick={() => toggleGate(g.id, g.ok)}
                          className={`h-8 px-3 rounded-full text-xs font-bold transition-all border shrink-0 ${g.ok ? 'bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] hover:opacity-90' : 'bg-[var(--surface)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--card)] hover:border-[var(--primary)]'}`}
                        >
                          {g.ok ? "Aprovado" : "Validar Etapa"}
                        </button>
                      </td>
                      <td className="py-4 pr-4">
                        <div className="text-sm font-medium text-[var(--muted-foreground)]">
                          {g.artifact || "Documentação"}
                        </div>
                      </td>
                      <td className="py-4 align-middle">
                        <span className="text-sm font-medium text-[var(--muted-foreground)] px-2">Assinatura Liderança</span>
                      </td>
                    </tr>
                  ))}

                  {modulos.length === 0 && gates.length === 0 && (
                     <tr>
                        <td colSpan={4} className="py-12 text-center text-[var(--muted-foreground)] text-sm">
                           Nenhuma etapa registrada para esta campanha.
                        </td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
            
          </section>

        </main>
      </div>
    </div>
  );
}
