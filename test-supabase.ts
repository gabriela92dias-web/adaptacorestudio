import "./loadEnv.js";
import { supabase } from "./helpers/supabase.ts";

console.log("Supabase URL outside:", process.env.VITE_SUPABASE_URL);

async function testAuth() {
console.log("Supabase URL internal:", supabase['supabaseUrl']);
    process.exit(0);
}
testAuth();
