require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSchema() {
  // Test inserting a profile
  const testId = '11111111-1111-1111-1111-111111111111';
  const { error } = await supabase.from('profiles').insert({
    id: testId,
    display_name: 'Test Artisan',
    role: 'artisan'
  });
  console.log('Insert Profile Error:', error);

  if (!error) {
    await supabase.from('profiles').delete().eq('id', testId);
  }
}

checkSchema().catch(console.error);
