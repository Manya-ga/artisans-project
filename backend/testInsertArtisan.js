require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });

async function run() {
  const { data, error } = await supabase.from('artisans').insert({
    name: "Test Artisan",
    category: "Test"
  }).select();
  console.log("Error:", error);
  console.log("Data:", data);
}
run();
