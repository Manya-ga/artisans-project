require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function testAuth() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'testartisan1@example.com',
    password: 'password123',
    email_confirm: true,
    user_metadata: { display_name: 'Test Artisan 1' }
  });
  console.log('Create User Result:', data?.user?.id, error);
  
  if (data?.user?.id) {
    // Check if profile was auto-created
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
    console.log('Profile auto-created?', profile ? 'Yes' : 'No');
    
    // Clean up
    await supabase.auth.admin.deleteUser(data.user.id);
  }
}

testAuth().catch(console.error);
