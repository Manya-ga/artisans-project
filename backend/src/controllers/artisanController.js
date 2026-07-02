const supabase = require('../config/supabase');
const userController = require('./userController');

function normalizeArtisan(profile, products = []) {
  // Determine categories from products
  const categoryCounts = {};
  products.forEach(p => {
    const cat = p.category || 'General';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });
  
  let mostCommonCategory = 'General';
  let maxCount = 0;
  for (const [cat, count] of Object.entries(categoryCounts)) {
    if (count > maxCount) {
      mostCommonCategory = cat;
      maxCount = count;
    }
  }

  return {
    id: profile.id,
    _id: profile.id,
    name: profile.display_name || profile.displayName || 'Unnamed Artisan',
    displayName: profile.display_name || profile.displayName || 'Unnamed Artisan',
    category: mostCommonCategory,
    image: profile.photo_url || profile.photoURL || null,
    photoURL: profile.photo_url || profile.photoURL || null,
    rating: 4.8, // Default rating
    tagline: profile.bio ? profile.bio.substring(0, 50) + '...' : 'Crafting souls into artifacts.',
    bio: profile.bio || '',
    location: profile.location || '',
    productCount: products.length,
    created_at: profile.created_at
  };
}

exports.getArtisans = async (req, res) => {
  try {
    const requestedPage = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 12);
    
    const search = String(req.query.search || '').trim().toLowerCase();
    const category = req.query.category || 'All';
    const sort = req.query.sort || 'newest';
    const locationFilter = req.query.location || 'All';

    // 1. Fetch all profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
      
    if (profilesError) throw profilesError;

    // 2. Fetch all products to calculate product counts
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*');
      
    if (productsError) throw productsError;

    // 3. Map and filter
    let artisansList = [];
    
    for (const profile of profiles) {
      // Must have a valid account (exists in profiles) and a name
      if (!profile || (!profile.display_name && !profile.displayName)) {
         continue;
      }
      
      const artisanProducts = products.filter(p => p.user_id === profile.id || p.userId === profile.id);
      
      // Must have at least one product
      if (artisanProducts.length === 0) {
         continue;
      }

      artisansList.push(normalizeArtisan(profile, artisanProducts));
    }

    // 4. Apply Filters
    if (category && category !== 'All') {
      artisansList = artisansList.filter(a => a.category === category);
    }
    
    if (locationFilter && locationFilter !== 'All') {
      artisansList = artisansList.filter(a => a.location === locationFilter);
    }
    
    if (search) {
      artisansList = artisansList.filter(a => 
        a.name.toLowerCase().includes(search) || 
        a.category.toLowerCase().includes(search) ||
        a.location.toLowerCase().includes(search)
      );
    }

    // 5. Apply Sorting
    artisansList.sort((a, b) => {
      if (sort === 'rating') {
        return b.rating - a.rating;
      } else if (sort === 'most_products' || sort === 'mostProducts') {
        return b.productCount - a.productCount;
      } else if (sort === 'alphabetical') {
        return a.name.localeCompare(b.name);
      } else {
        // default: newest
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      }
    });

    // 6. Pagination
    const totalCount = artisansList.length;
    const totalPages = Math.ceil(totalCount / limit);
    const page = totalPages > 0 ? Math.min(requestedPage, totalPages) : requestedPage;
    const skip = (page - 1) * limit;
    
    const paginatedArtisans = artisansList.slice(skip, skip + limit);

    return res.json({
      artisans: paginatedArtisans,
      page: page,
      limit: limit,
      totalPages: totalPages,
      totalItems: totalCount,
      hasNext: page < totalPages,
      hasPrevious: page > 1
    });
  } catch (error) {
    console.error('Failed to get artisans:', error);
    return res.status(500).json({ error: 'Unable to load artisans.' });
  }
};

exports.getArtisanById = async (req, res) => {
  // Compatibility layer: redirect to userController to ensure single source of truth
  return userController.getUserById(req, res);
};
