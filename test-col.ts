import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY!
);

async function testQuery() {
  const { data, error } = await supabase.from('campaigns').select('id, dna_direcao').limit(1);
  if (error) {
    console.error('Error fetching:', error.message);
  } else {
    console.log('Success. Data:', data);
  }
}
testQuery();
