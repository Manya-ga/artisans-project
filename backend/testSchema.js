require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: { autoRefreshToken: false, persistSession: false }
  }
);

async function test() {
  const { data: p } = await supabase.from('products').select('*').limit(1);
  console.log("Product:", p[0]);
  const { data: a } = await supabase.from('artisans').select('*').limit(1);
  console.log("Artisan:", a[0]);
}
test();
