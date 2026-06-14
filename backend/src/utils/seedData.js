const supabase = require('../config/supabase');
const { artisans, products, stories } = require('../data');

async function seedDatabase() {
  try {
    const demoEmail = process.env.DEMO_USER_EMAIL || 'demo@artisan.com';
    const demoPassword = process.env.DEMO_USER_PASSWORD || 'demo1234';

    // 1. Seed Artisans
    const { count: artisanCount } = await supabase
      .from('artisans')
      .select('*', { count: 'exact', head: true });

    if (artisanCount === 0) {
      const { error: artisanError } = await supabase
        .from('artisans')
        .insert(
          artisans.map((item) => ({
            legacy_id: item.id,
            name: item.name,
            category: item.category,
            image: item.image,
            rating: item.rating,
            tagline: item.tagline,
            bio: item.bio,
            location: item.location,
          }))
        );
      if (artisanError) console.error('Error seeding artisans:', artisanError);
      else console.log('Seeded artisans');
    }

    // 2. Seed Demo User
    let { data: demoUserAuth } = await supabase.auth.admin.listUsers();
    let demoUser = demoUserAuth.users.find(u => u.email === demoEmail);

    if (!demoUser) {
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: demoEmail,
        password: demoPassword,
        email_confirm: true,
        user_metadata: { display_name: 'Demo Buyer' }
      });
      if (createError) {
        console.error('Error creating demo user:', createError);
      } else {
        demoUser = newUser.user;
      }
    }

    if (demoUser) {
      // Ensure profile exists
      await supabase.from('profiles').upsert({
        id: demoUser.id,
        email: demoEmail,
        display_name: 'Demo Buyer',
        role: 'buyer'
      });
      console.log('Seeded demo user profile');
    }

    // 3. Create Users for Artisans
    const artisanUserMap = new Map();
    for (const item of artisans) {
      let email = `artisan${item.id}@artisan.com`;
      let existingUser = demoUserAuth.users.find(u => u.email === email);
      let userId;

      if (!existingUser) {
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email,
          password: demoPassword,
          email_confirm: true,
          user_metadata: { display_name: item.name }
        });
        if (createError) {
          console.error(`Error creating artisan user ${email}:`, createError);
          continue;
        }
        userId = newUser.user.id;
      } else {
        userId = existingUser.id;
      }

      await supabase.from('profiles').upsert({
        id: userId,
        email,
        display_name: item.name,
        role: 'artisan',
        bio: item.bio,
        photo_url: item.image,
        location: item.location
      });
      
      artisanUserMap.set(item.id, userId);
    }

    console.log('Seeded artisan users');

    // 4. Seed Products
    const { count: productCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (productCount === 0) {
      const { error: productError } = await supabase
        .from('products')
        .insert(
          products.map((item) => ({
            legacy_id: item.id,
            user_id: artisanUserMap.get(item.artisanId) || demoUser.id,
            title: item.name,
            price: item.price,
            image: item.image,
            category: item.category,
            artisan_name: item.artisanName,
            artisan_image: item.artisanImage,
            artisan_location: item.artisanLocation,
          }))
        );
      if (productError) console.error('Error seeding products:', productError);
      else console.log('Seeded products');
    }

    // 5. Seed Stories
    const { count: storyCount } = await supabase
      .from('stories')
      .select('*', { count: 'exact', head: true });

    if (storyCount === 0) {
      const artisanMap = new Map(artisans.map((artisan) => [artisan.id, artisan]));
      const { error: storyError } = await supabase
        .from('stories')
        .insert(
          stories.map((item, index) => {
            const artisan = artisanMap.get(item.artisanId);
            return {
              title: item.title,
              bio: item.content || 'Behind the scenes story from our artisan.',
              media: [{ url: artisan?.image || 'https://via.placeholder.com/400?text=Story', type: 'image' }],
              user_name: artisan?.name || 'Artisan Story',
              user_id: artisanUserMap.get(item.artisanId) || demoUser.id,
              created_at: new Date(Date.now() - index * 3600 * 1000).toISOString(),
            };
          })
        );
      if (storyError) console.error('Error seeding stories:', storyError);
      else console.log('Seeded stories');
    }
  } catch (err) {
    console.error('Seed database failed:', err);
  }
}

module.exports = seedDatabase;
