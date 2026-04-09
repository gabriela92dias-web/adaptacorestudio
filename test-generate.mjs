import { config } from 'dotenv';
config();
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

async function testSave() {
  const { data, error } = await supabase.from('campaigns').insert({
    name: 'Test DNA Campaign',
    type: 'awareness',
    status: 'draft',
    dna_direcao: 'externa',
    dna_experiencia: 'digital',
    dna_modulos: { fisico: false, digital: true }
  }).select();

  if (error) {
    console.error('Save failed:', error);
  } else {
    console.log('Save succeeded:', data);
  }
}

testSave();
