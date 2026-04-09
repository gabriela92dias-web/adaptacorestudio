import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envText = fs.readFileSync('env.json', 'utf8');
const env = JSON.parse(envText);

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function run() {
  console.log("Tentando criar conta...");
  
  // Criar usuario na tabela do Auth (Supabase GoTrue)
  const { data, error } = await supabase.auth.signUp({
    email: 'gabriela92dias@gmail.com',
    password: 'CoreStudio!2026',
    options: {
      data: {
        name: 'Gabriela Dias'
      }
    }
  });

  if (error) {
    console.error("Erro ao criar Auth:", error.message);
  } else {
    console.log("Usuário de Auth criado com sucesso!", data.user?.id);
  }
}

run();
