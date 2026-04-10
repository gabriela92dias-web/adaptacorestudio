import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

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
    return <div style={{fontFamily: "monospace", padding: 40}}>Inicializando Motor V8...</div>;
  }

  if (!campaign) {
    return (
      <div style={{fontFamily: "monospace", padding: 40}}>
        <h1>BANCO V8 VAZIO</h1>
        <p>Crie sua primeira campanha no construtor para popular os módulos.</p>
      </div>
    );
  }

  // Desestruturando para ficar como o ensaio v002
  const { modulos = [], gates = [] } = campaign;

  const activeModulesCount = modulos.filter((m: any) => m.status === 'on').length;
  const blocks: string[] = [];
  const alerts: string[] = [];
  
  modulos.forEach((m: any) => {
    if (m.status !== 'on') return;
    const missing = [];
    if (!m.owner) missing.push("Dono");
    // if (!m.cost) missing.push("Custo");
    // if (!m.dueDate) missing.push("Prazo");
    if (missing.length) blocks.push(`MÓDULO OFF-SPEC [${m.nome}]: faltam ${missing.join(", ")}.`);
    if (!m.ok) blocks.push(`MÓDULO NÃO PRODUZIDO [${m.nome}]: falta evidência.`);
  });

  if (activeModulesCount === 0) blocks.push("CAMPANHA VAZIA: Nenhum módulo ativo.");

  gates.forEach((g: any) => {
    if (g.critical && !g.ok) blocks.push(`SOFT GATE CRÍTICO PENDENTE: ${g.name}`);
    if (!g.critical && !g.ok) alerts.push(`Gate não crítico pendente: ${g.name}`);
  });

  const isPublishReady = blocks.length === 0;

  return (
    <>
      <Helmet><title>CoreStudio | v8 Dashboard</title></Helmet>
      <style dangerouslySetInnerHTML={{__html: `
        /* =========================================================
          ENSAIO DE VERSÃO — LAYOUT-LOCKED v2 (CONTRATO)
          Regra: NÃO alterar layout/estrutura entre versões
          sem "EVOLUTION_MAP" explícito.
        ========================================================== */

        .v8-theme {
          --bg: #fafafa;
          --fg: #111;
          --muted: #666;
          --border: #2a2a2a;
          --border-soft: #bdbdbd;
          --panel: #fff;
          --panel-2: #f2f2f2;

          --pad-1: 10px;
          --pad-2: 14px;
          --pad-3: 18px;

          --radius: 0px; 
          --font: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;

          --h1: 18px;
          --h2: 13px;
          --h3: 12px;
          --p: 11.5px;
          --small: 10px;
          --line: 1.45;
          
          background: var(--bg);
          color: var(--fg);
          font-family: var(--font);
          line-height: var(--line);
          min-height: 100vh;
        }

        .v8-theme * { box-sizing: border-box; }
        
        .v8-theme .page {
          max-width: 1180px;
          margin: 0 auto;
          padding: 22px 18px 40px;
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: 18px;
        }

        .v8-theme .sidebar {
          position: sticky;
          top: 14px;
          align-self: start;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .v8-theme .main {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .v8-theme .card {
          background: var(--panel);
          border: 2px solid var(--border);
          border-radius: var(--radius);
          padding: var(--pad-2);
        }

        .v8-theme .card.soft {
          border-color: var(--border-soft);
          background: var(--panel-2);
        }

        .v8-theme .label {
          display: inline-block;
          border: 2px solid var(--border);
          padding: 2px 8px;
          font-size: var(--small);
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 8px;
          background: var(--bg);
        }

        .v8-theme h1, .v8-theme h2, .v8-theme h3 {
          margin: 0 0 6px 0;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .3px;
        }
        .v8-theme h1 { font-size: var(--h1); }
        .v8-theme h2 { font-size: var(--h2); }
        .v8-theme h3 { font-size: var(--h3); }

        .v8-theme p {
          margin: 0 0 8px 0;
          font-size: var(--p);
          color: var(--fg);
        }
        .v8-theme .muted { color: var(--muted); }

        .v8-theme .row { display:flex; gap: 10px; flex-wrap: wrap; }
        .v8-theme .col { display:flex; flex-direction: column; gap: 8px; }

        .v8-theme .btn {
          border: 2px solid var(--border);
          background: #fff;
          padding: 8px 10px;
          font-family: var(--font);
          font-size: var(--p);
          cursor: pointer;
          text-transform: uppercase;
          font-weight: 700;
        }
        .v8-theme .btn:active{ transform: translateY(1px); }

        .v8-theme .kv {
          display:grid;
          grid-template-columns: 120px 1fr;
          gap: 6px 10px;
          font-size: var(--small);
          color: var(--fg);
        }
        .v8-theme .kv b { text-transform: uppercase; }

        .v8-theme .mono {
          font-size: var(--small);
          white-space: pre-wrap;
          word-break: break-word;
          border: 2px dashed var(--border-soft);
          padding: 10px;
          background: #fff;
        }

        .v8-theme .pill {
          border: 2px solid var(--border);
          padding: 2px 8px;
          text-transform: uppercase;
          font-weight: 800;
          font-size: var(--small);
          background: #fff;
          display:inline-block;
        }

        .v8-theme .grid2 { display:grid; grid-template-columns: 1fr 1fr; gap: 10px; }

        .v8-theme .wf-box { border: 2px dashed var(--border-soft); background:#fff; padding: 10px; }

        .v8-theme table {
          width: 100%;
          border-collapse: collapse;
          font-size: var(--small);
          background:#fff;
          border: 2px solid var(--border);
        }
        .v8-theme th, .v8-theme td {
          border: 1px solid var(--border-soft);
          padding: 8px;
          vertical-align: top;
        }
        .v8-theme th {
          text-transform: uppercase;
          font-weight: 900;
          background: #f0f0f0;
          text-align: left;
        }

        @media (max-width: 980px){
          .v8-theme .page { grid-template-columns: 1fr; }
          .v8-theme .sidebar { position: static; }
        }
      `}} />
      
      <div className="v8-theme">
        <div className="page">
          
          {/* SIDEBAR */}
          <aside className="sidebar">
            <div className="card">
              <div className="label">Painel de Controle</div>
              <h1>Motor V8 (Fábrica)</h1>
              <p className="muted">Validação de Soft Gates e Workflow Assíncrono da Campanha Ativa.</p>

              <div style={{height: 2, background: 'var(--border)', opacity: 0.2, margin: '8px 0'}}></div>

              <div className="kv">
                <b>Versão</b><span>v002</span>
                <b>Data</b><span>{new Date(campaign.created_at).toLocaleDateString()}</span>
                <b>Origem</b><span>Supabase API</span>
                <b>Layout</b><span className="pill">LOCKED-v2</span>
              </div>
            </div>

            <div className="card soft">
              <div className="label">Validador P0</div>
              <p className="muted">Lista bloqueadores/alertas + readiness.</p>
              
              <div style={{height: 2, background: 'var(--border)', opacity: 0.2, margin: '8px 0'}}></div>
              
              <div className="mono">
                {`PRONTO PRO AR: ${isPublishReady ? "SIM" : "NÃO"}\n=========================\n`}
                {`BLOQUEADORES P0 (${blocks.length}):\n`}
                {blocks.map(b => `- ${b}\n`).join("")}
                {`\nALERTAS (${alerts.length}):\n`}
                {alerts.map(a => `- ${a}\n`).join("")}
              </div>
            </div>
          </aside>

          {/* MAIN */}
          <main className="main">
            
            <section className="card">
              <div className="label">HUD Motor V8 / Painel Final</div>
              {data.length > 1 && (
                <div className="row" style={{marginBottom: 10}}>
                  <span style={{fontSize: 10, fontWeight: 700, textTransform: 'uppercase', alignSelf: 'center'}}>Campanha:</span>
                  <select
                    style={{fontFamily: 'inherit', fontSize: 10, border: '2px solid var(--border)', padding: '4px 8px', background: '#fff', cursor: 'pointer'}}
                    value={selectedIdx}
                    onChange={e => setSelectedIdx(Number(e.target.value))}
                  >
                    {data.map((c: any, i: number) => (
                      <option key={c.id} value={i}>{c.objetivo_primario} — {new Date(c.created_at).toLocaleDateString()}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="row">
                <span className="pill">Publish: <span>{isPublishReady ? "SIM" : "NÃO"}</span></span>
                <span className="pill">Bloqueadores: <span>{blocks.length}</span></span>
              </div>
              <p className="muted" style={{marginTop: 8}}>
                Console de voo. Sem "OK" nos gates críticos e módulos completos, a campanha online continua bloqueada.
              </p>
            </section>

            <section className="card">
              <div className="label">Visão Geral Módulos vs Gates</div>
              <h2>Painel Ativo da Campanha</h2>
              <p className="muted">Os módulos não são em cascata, ocorrem todos paralelamente se não houver gates pendentes.</p>

              <div className="grid2" style={{marginTop: 10}}>
                <div className="wf-box">
                  <h3>Módulos Carregados (DNA)</h3>
                  <div className="mono" style={{fontSize: 11, marginTop: 5, padding: 5, borderColor: '#ddd'}}>
                    {modulos.map((m: any) => (
                      <div key={m.id}>[{m.ok ? "X" : " "}] {m.nome} (R${m.cost || '??'} / {m.owner || '??'})</div>
                    ))}
                    {modulos.length === 0 && "--"}
                  </div>
                </div>
                <div className="wf-box">
                  <h3>Soft Gates (Gargalos)</h3>
                  <div className="mono" style={{fontSize: 11, marginTop: 5, padding: 5, borderColor: '#ddd'}}>
                    {gates.map((g: any) => (
                      <div key={g.id}>[{g.ok ? "OK" : "PENDENTE"}] {g.name}</div>
                    ))}
                    {gates.length === 0 && "--"}
                  </div>
                </div>
              </div>

              <div style={{marginTop: 10}}>
                <h3>Relatório Consolidado de Execução</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Componente / Módulo / Gate</th>
                      <th>Status</th>
                      <th>Evidência / OK Trigger</th>
                      <th>Owner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modulos.filter((m: any) => m.status === 'on').map((m: any) => (
                      <tr key={m.id}>
                        <td>Módulo: {m.nome}</td>
                        <td style={{width: 140}}>
                          <button className="btn" style={{width: '100%', fontSize: 9}} onClick={() => updateModuleField(m.id, 'ok', !m.ok)}>
                            {m.ok ? "MARCAR PENDENTE" : "MARCAR CONCLUÍDO"}
                          </button>
                        </td>
                        <td>{m.ok_trigger}</td>
                        <td style={{width: 140}}>
                          <input 
                            className="input" 
                            style={{padding: 4, height: 26, fontSize: 10}} 
                            placeholder="Dono" 
                            defaultValue={m.owner || ''}
                            onBlur={(e) => updateModuleField(m.id, 'owner', e.target.value)} 
                          />
                        </td>
                      </tr>
                    ))}
                    {gates.map((g: any) => (
                      <tr key={g.id}>
                        <td>Soft Gate: {g.name}</td>
                        <td style={{width: 140}}>
                          <button className="btn" style={{width: '100%', fontSize: 9}} onClick={() => toggleGate(g.id, g.ok)}>
                            {g.ok ? "REVOGAR OK" : "APROVAR"}
                          </button>
                        </td>
                        <td>{g.artifact || "-"}</td>
                        <td><span className="muted">Liderança / Sistema</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

          </main>
        </div>
      </div>
    </>
  );
}
