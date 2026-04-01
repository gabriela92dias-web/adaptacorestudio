import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL || "https://kshybgeyetkkufkmjugz.supabase.co";
const key = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzaHliZ2V5ZXRra3Vma21qdWd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNjU1OTQsImV4cCI6MjA4OTg0MTU5NH0.bs6pHfjKnPAACxz9fVPR3sGw-2IsjQc4DrrW584wXiY";

const supabase = createClient(url, key);

async function testSign() {
  const { data, error } = await supabase.auth.signUp({
    email: 'test_admin_999@gmail.com',
    password: '@hjkkjh123',
    options: {
      data: { name: "Test Admin" }
    }
  });
  console.log("Sign Up Result:");
  console.log("Session exists:", !!data?.session);
  console.log("User exists:", !!data?.user);
  console.log("Error:", error?.message);
}

testSign();
