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
    const { data: artisans, error } = await supabase
      .from('artisans')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.json(artisans.map(normalizeArtisan));
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
