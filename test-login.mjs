import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envText = fs.readFileSync('env.json', 'utf8');
const env = JSON.parse(envText);

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function testSignIn() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'gabriela92dias@gmail.com',
    password: 'CoreStudio!2026',
  });
  console.log("LOGIN TEST:", { data, error: error?.message });
}

testSignIn();
