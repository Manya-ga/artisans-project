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

async function migrateAdvanced() {
  console.log('--- STARTING ADVANCED MIGRATION ---');
  
  // 1. Fetch all products
  const { data: products, error: prodError } = await supabase.from('products').select('*');
  if (prodError) throw prodError;

  // 2. Fetch all artisans
  const { data: artisans, error: artError } = await supabase.from('artisans').select('*');
  if (artError) throw artError;

  let missingLinks = products.filter(p => !p.user_id || p.user_id === '00000000-0000-0000-0000-000000000000');
  
  console.log(`Total Products Evaluated: ${products.length}`);
  console.log(`Products missing user_id originally: ${missingLinks.length}`);
  
  let fixedLinks = 0;

  // Track created users to avoid duplicates
  const artisanToUserIdMap = {};

  for (let prod of missingLinks) {
    const artisanName = prod.artisan_name;
    let userIdToAssign = artisanToUserIdMap[artisanName];

    if (!userIdToAssign) {
      // Find artisan details
      const artisanData = artisans.find(a => a.name === artisanName);
      if (artisanData) {
         // Create real auth user
         const email = `artisan_${Date.now()}_${Math.floor(Math.random()*1000)}@artisanconnect.com`;
         const { data: authData, error: authError } = await supabase.auth.admin.createUser({
           email,
           password: 'securepassword123',
           email_confirm: true,
           user_metadata: { display_name: artisanName, role: 'artisan' }
         });

         if (authError || !authData?.user) {
            console.error(`Failed to create auth user for ${artisanName}:`, authError);
            continue;
         }

         const newUserId = authData.user.id;
         userIdToAssign = newUserId;
         artisanToUserIdMap[artisanName] = newUserId;

         // Ensure profile exists
         const { error: profileError } = await supabase.from('profiles').upsert({
           id: newUserId,
           display_name: artisanName,
           role: 'artisan',
           bio: artisanData.bio || '',
           location: artisanData.location || ''
         });

         if (profileError) {
            console.error(`Failed to create profile for ${artisanName}:`, profileError);
         } else {
            console.log(`Created real user profile for artisan: ${artisanName} -> ${newUserId}`);
         }
         
         // Update artisan record to hold the real user id
         await supabase.from('artisans').update({ id: newUserId }).eq('name', artisanName);
      }
    }

    if (userIdToAssign) {
      // Update product with real user id
      const { error: updateError } = await supabase
        .from('products')
        .update({ user_id: userIdToAssign })
        .eq('id', prod.id);

      if (!updateError) {
        fixedLinks++;
      } else {
        console.error(`Failed to link product ${prod.id}:`, updateError);
      }
    }
  }

  console.log('--- MIGRATION REPORT ---');
  console.log(`Total Products Evaluated: ${products.length}`);
  console.log(`Products missing user_id originally: ${missingLinks.length}`);
  console.log(`Products successfully fixed/migrated: ${fixedLinks}`);
  console.log(`Products still missing user_id: ${missingLinks.length - fixedLinks}`);
  console.log('--- MIGRATION COMPLETE ---');
}

migrateAdvanced().catch(console.error);
