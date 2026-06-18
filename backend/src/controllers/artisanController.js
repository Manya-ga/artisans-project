const supabase = require('../config/supabase');

function normalizeArtisan(artisan) {
  return {
    id: artisan.id,
    _id: artisan.id, // compatibility
    name: artisan.name,
    category: artisan.category,
    image: artisan.image,
    rating: artisan.rating,
    tagline: artisan.tagline,
    bio: artisan.bio,
    location: artisan.location,
  };
}

exports.getArtisans = async (req, res) => {
  try {
    const requestedPage = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 12);
    
    const search = String(req.query.search || '').trim();
    const category = req.query.category || 'All';
    const sort = req.query.sort || 'newest';
    const locationFilter = req.query.location || 'All';

    // Get count
    let countQuery = supabase.from('artisans').select('id', { count: 'exact', head: true });
    
    if (category && category !== 'All') {
      countQuery = countQuery.eq('category', category);
    }
    if (locationFilter && locationFilter !== 'All') {
      countQuery = countQuery.eq('location', locationFilter);
    }
    if (search) {
      const cleanSearch = `%${search}%`;
      countQuery = countQuery.or(`name.ilike.${cleanSearch},location.ilike.${cleanSearch},category.ilike.${cleanSearch}`);
    }

    const { count: totalArtisans, error: countError } = await countQuery;
      
    if (countError) throw countError;
    
    const totalCount = Number(totalArtisans || 0);
    const totalPages = Math.ceil(totalCount / limit);
    const page = totalPages > 0 ? Math.min(requestedPage, totalPages) : requestedPage;
    const skip = (page - 1) * limit;

    let dataQuery = supabase.from('artisans').select('*');
    if (category && category !== 'All') {
      dataQuery = dataQuery.eq('category', category);
    }
    if (locationFilter && locationFilter !== 'All') {
      dataQuery = dataQuery.eq('location', locationFilter);
    }
    if (search) {
      const cleanSearch = `%${search}%`;
      dataQuery = dataQuery.or(`name.ilike.${cleanSearch},location.ilike.${cleanSearch},category.ilike.${cleanSearch}`);
    }

    if (sort === 'rating') {
      dataQuery = dataQuery.order('rating', { ascending: false });
    } else {
      dataQuery = dataQuery.order('created_at', { ascending: false });
    }

    const { data: artisans, error } = await dataQuery
      .range(skip, skip + limit - 1);

    if (error) throw error;
    
    return res.json({
      artisans: artisans.map(normalizeArtisan),
      currentPage: page,
      totalPages: totalPages,
      totalArtisans: totalCount,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    });
  } catch (error) {
    console.error('Failed to get artisans:', error);
    return res.status(500).json({ error: 'Unable to load artisans.' });
  }
};

exports.getArtisanById = async (req, res) => {
  try {
    const value = req.params.id;
    
    const { data: artisan, error: artisanError } = await supabase
      .from('artisans')
      .select('*')
      .eq('id', value)
      .maybeSingle();

    if (artisanError || !artisan) {
      return res.status(404).json({ error: 'Artisan not found.' });
    }

    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('artisan_name', artisan.name); // Using name matching for now as per legacy logic

    if (productsError) throw productsError;

    return res.json({
      ...normalizeArtisan(artisan),
      products: products.map((product) => ({
        id: product.id,
        _id: product.id,
        title: product.title,
        price: product.price,
        image: product.image || (product.images && product.images[0]) || '',
        images: product.images || (product.image ? [product.image] : []),
        artisanName: product.artisan_name || product.artisanName,
        category: product.category,
      })),
    });
  } catch (error) {
    console.error('Failed to get artisan by id:', error);
    return res.status(500).json({ error: 'Unable to load artisan.' });
  }
};
