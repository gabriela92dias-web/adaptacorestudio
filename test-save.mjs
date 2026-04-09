// Script de teste: verifica se salvar dados via API funciona
// Uso: node test-save.mjs <email> <senha>

import { createClient } from '@supabase/supabase-js';
import superjson from 'superjson';

const SUPABASE_URL = 'https://kshybgeyetkkufkmjugz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzaHliZ2V5ZXRra3Vma21qdWd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNjU1OTQsImV4cCI6MjA4OTg0MTU5NH0.bs6pHfjKnPAACxz9fVPR3sGw-2IsjQc4DrrW584wXiY';
const API_BASE = 'http://localhost:3333';

const [,, email, senha] = process.argv;
if (!email || !senha) {
  console.error('Uso: node test-save.mjs <email> <senha>');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper: fetch + superjson parse
async function apiGet(path, headers) {
  const res = await fetch(`${API_BASE}${path}`, { headers });
  const text = await res.text();
  try {
    return { ok: res.ok, status: res.status, data: superjson.parse(text) };
  } catch {
    try { return { ok: res.ok, status: res.status, data: JSON.parse(text) }; }
    catch { return { ok: res.ok, status: res.status, data: text }; }
  }
}

async function apiPost(path, headers, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: superjson.stringify(body),
  });
  const text = await res.text();
  try {
    return { ok: res.ok, status: res.status, data: superjson.parse(text) };
  } catch {
    try { return { ok: res.ok, status: res.status, data: JSON.parse(text) }; }
    catch { return { ok: res.ok, status: res.status, data: text }; }
  }
}

async function run() {
  // 1. Login
  console.log(`\n1️⃣  Login como ${email}...`);
  const { data: auth, error: authErr } = await supabase.auth.signInWithPassword({ email, password: senha });
  if (authErr || !auth?.session) {
    console.error('❌ Login falhou:', authErr?.message);
    process.exit(1);
  }
  const token = auth.session.access_token;
  console.log('✅ Login OK.');

  const headers = { 'Authorization': `Bearer ${token}` };

  // 2. Busca projetos
  console.log('\n2️⃣  Buscando projetos...');
  const { ok: pOk, status: pStatus, data: pData } = await apiGet('/_api/coreact/projects/list', headers);
  console.log(`   Status: ${pStatus}`);
  
  if (pOk && pData?.projects?.length) {
    const p = pData.projects[0];
    console.log(`✅ ${pData.projects.length} projeto(s). Usando: "${p.name ?? p.title ?? p.id}"`);
  } else {
    // tenta listar as chaves do que veio para debug
    console.log('⚠️  Resposta de projetos:', JSON.stringify(pData)?.substring(0, 300));
  }

  // 3. Busca stages
  console.log('\n3️⃣  Buscando stages...');
  const { ok: sOk, status: sStatus, data: sData } = await apiGet('/_api/coreact/stages/list', headers);
  console.log(`   Status: ${sStatus}`);
  
  if (sOk && sData?.stages?.length) {
    console.log(`✅ ${sData.stages.length} stage(s). Usando: "${sData.stages[0].name ?? sData.stages[0].id}"`);
  } else {
    console.log('⚠️  Resposta de stages:', JSON.stringify(sData)?.substring(0, 300));
  }

  const projectId = pData?.projects?.[0]?.id ?? null;
  const stageId = sData?.stages?.[0]?.id ?? null;

  if (!projectId || !stageId) {
    console.error('\n❌ Não há projectId ou stageId. Não é possível testar criação de tarefa.');
    console.log('   Isso significa que o banco está vazio ou a rota de listagem está com problema.');
    process.exit(1);
  }

  // 4. Cria tarefa
  console.log('\n4️⃣  Testando criar tarefa (POST tasks/create)...');
  const taskName = `[TESTE AUTO] ${new Date().toISOString()}`;
  const { ok: tOk, status: tStatus, data: tData } = await apiPost('/_api/coreact/tasks/create', headers, {
    projectId,
    stageId,
    name: taskName,
    status: 'open',
    priority: 'medium',
    progress: 0,
    shift: 'morning',
  });
  console.log(`   Status: ${tStatus}`);
  if (tOk && tData?.task?.id) {
    const taskId = tData.task.id;
    console.log(`✅ Tarefa criada: id=${taskId} nome="${tData.task.name}"`);

    // 5. Testa task-action (ação) 
    console.log('\n5️⃣  Testando criar ação (POST task-actions/create)...');
    const { ok: aOk, status: aStatus, data: aData } = await apiPost('/_api/coreact/task-actions/create', headers, {
      taskId,
      type: 'purchase',
      title: `[TESTE] Compra de material ${Date.now()}`,
      status: 'pending',
    });
    console.log(`   Status: ${aStatus}`);
    if (aOk && aData?.taskAction?.id) {
      console.log(`✅ Ação criada: id=${aData.taskAction.id}`);
    } else {
      console.error('❌ Erro ao criar ação:', JSON.stringify(aData)?.substring(0, 300));
    }

    // 6. Limpa: deleta a tarefa de teste
    console.log('\n🗑️   Deletando tarefa de teste...');
    const { ok: dOk, status: dStatus } = await apiPost('/_api/coreact/tasks/delete', headers, { id: taskId });
    console.log(`   ${dOk ? '✅ Deletada.' : `❌ Erro ao deletar (${dStatus})`}`);

  } else {
    console.error('❌ Erro ao criar tarefa:', JSON.stringify(tData)?.substring(0, 300));
  }

  console.log('\n🏁 Teste concluído.\n');
}

run().catch(e => console.error('Erro fatal:', e));
