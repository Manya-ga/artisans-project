const path = require('path');
const supabase = require('../config/supabase');

const uploadMiddleware = require('../middleware/upload');
const { getPublicBaseUrl } = require('../utils/publicUrl');

async function getUploadedFileUrl(req, file) {
  if (!file) return null;
  if (file.path?.startsWith('http')) {
    return file.path;
  }
  // Try uploading to Supabase if configured
  if (uploadMiddleware.uploadToSupabase) {
    const url = await uploadMiddleware.uploadToSupabase(file, 'artisan-connect');
    if (url) return url;
  }
  // Fallback to the configured public backend URL
  const fileName = path.basename(file.path || file.filename || '');
  return `${getPublicBaseUrl(req)}/uploads/${fileName}`;
}

function normalizeProduct(product) {
  const images = product.images && product.images.length ? product.images : product.image ? [product.image] : [];
  return {
    id: product.id,
    _id: product.id, // compatibility
    title: product.title,
    price: product.price,
    image: product.image || images[0] || '',
    images,
    artisanName: product.artisan_name || product.artisanName,
    category: product.category,
    artisanLocation: product.artisan_location || product.artisanLocation,
    description: product.description,
    ownerId: product.user_id || product.userId,
    userId: product.user_id || product.userId,
    createdAt: product.created_at || product.createdAt,
  };
}

exports.getProducts = async (req, res) => {
  try {
    const requestedPage = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 12);

    const search = String(req.query.search || '').trim();
    const category = req.query.category || 'All';
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;

    // 1. Build Query for Count
    let countQuery = supabase.from('products').select('id', { count: 'exact', head: true });

    if (category && category !== 'All') {
      countQuery = countQuery.eq('category', category);
    }
    if (minPrice) {
      countQuery = countQuery.gte('price', Number(minPrice));
    }
    if (maxPrice) {
      countQuery = countQuery.lte('price', Number(maxPrice));
    }
    if (search) {
      const cleanSearch = `%${search}%`;
      countQuery = countQuery.or(`title.ilike.${cleanSearch},artisan_name.ilike.${cleanSearch},category.ilike.${cleanSearch}`);
    }

    // Execute count query to get total products without fetching all rows
    const { count: totalProducts, error: countError } = await countQuery;
    if (countError) throw countError;

    const totalCount = Number(totalProducts || 0);
    const totalPages = Math.ceil(totalCount / limit);
    const page = totalPages > 0 ? Math.min(requestedPage, totalPages) : requestedPage;
    const skip = (page - 1) * limit;

    // 2. Build Query for Paginated Data
    let dataQuery = supabase.from('products').select('*');

    if (category && category !== 'All') {
      dataQuery = dataQuery.eq('category', category);
    }
    if (minPrice) {
      dataQuery = dataQuery.gte('price', Number(minPrice));
    }
    if (maxPrice) {
      dataQuery = dataQuery.lte('price', Number(maxPrice));
    }
    if (search) {
      const cleanSearch = `%${search}%`;
      dataQuery = dataQuery.or(`title.ilike.${cleanSearch},artisan_name.ilike.${cleanSearch},category.ilike.${cleanSearch}`);
    }

    // Order newest products first so recent uploads are visible on page 1.
    dataQuery = dataQuery.order('created_at', { ascending: false });

    // Apply pagination range
    dataQuery = dataQuery.range(skip, skip + limit - 1);

    // Execute paginated data query
    const { data: products, error: dataError } = await dataQuery;
    if (dataError) throw dataError;

    const normalizedProducts = products.map(normalizeProduct);

    return res.json({
      products: normalizedProducts,
      page: page,
      limit: limit,
      totalPages: totalPages,
      totalItems: totalCount,
      hasNext: page < totalPages,
      hasPrevious: page > 1
    });
  } catch (error) {
    console.error('Failed to get products:', error);
    return res.status(500).json({ error: 'Unable to load products.' });
  }
};

exports.getProductCategories = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .distinct('category')
      .order('category', { ascending: true });

    if (error) throw error;

    const categories = (data || []).map((item) => item.category).filter(Boolean);
    return res.json({ categories });
  } catch (error) {
    console.error('Failed to get product categories:', error);
    return res.status(500).json({ error: 'Unable to load product categories.' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    return res.json(normalizeProduct(product));
  } catch (error) {
    console.error('Failed to get product by id:', error);
    return res.status(500).json({ error: 'Unable to load product.' });
  }
};

exports.getMyProducts = async (req, res) => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', req.user.id);

    if (error) throw error;

    return res.json(products.map(normalizeProduct));
  } catch (error) {
    console.error('Failed to get my products:', error);
    return res.status(500).json({ error: 'Unable to load your products.' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { title, price, description, category, artisanLocation, artisanImage } = req.body || {};
    const uploadedImages = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const imageUrl = await getUploadedFileUrl(req, file);
        if (imageUrl) {
          uploadedImages.push(imageUrl);
        }
      }
    }

    const fallbackImage = req.body.image || (uploadedImages.length > 0 ? uploadedImages[0] : null);

    if (!title || price == null || !fallbackImage) {
      return res.status(400).json({ error: 'Product title, price, and at least one image are required.' });
    }

    // Validation: Prevent products from existing without a valid artisan profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, display_name, photo_url, location')
      .eq('id', req.user.id)
      .single();

    if (profileError || !profile) {
      return res.status(403).json({ error: 'You must have a valid profile to create products. Artisan directory validation failed.' });
    }

    const { data: product, error } = await supabase
      .from('products')
      .insert({
        user_id: req.user.id,
        title: String(title).trim(),
        price: Number(price),
        image: String(fallbackImage).trim(),
        images: uploadedImages.length > 0 ? uploadedImages : [String(fallbackImage).trim()],
        description: description ? String(description).trim() : '',
        category: category ? String(category).trim() : 'General',
        artisan_name: req.user.display_name || req.user.displayName || req.user.email || 'Artisan',
        artisan_image: artisanImage ? String(artisanImage).trim() : (req.user.photo_url || req.user.photoURL),
        artisan_location: artisanLocation ? String(artisanLocation).trim() : (req.user.location || ''),
      })
      .select()
      .single();

    if (error) throw error;

    console.log('[createProduct] Product created by userId:', req.user.id, '| title:', product.title);

    // ALWAYS ensure the creator is marked as an artisan in their profile
    await supabase
      .from('profiles')
      .update({ role: 'artisan' })
      .eq('id', req.user.id);

    return res.status(201).json(normalizeProduct(product));
  } catch (error) {
    console.error('Failed to create product:', error);
    return res.status(500).json({ error: 'Unable to create product.' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { title, price, description, category, stock } = req.body || {};
    
    const updates = {};
    if (title) updates.title = String(title).trim();
    if (price != null) updates.price = Number(price);
    if (description != null) updates.description = String(description).trim();
    if (category) updates.category = String(category).trim();
    // Note: 'stock' field was not in the SQL schema yet, adding it to updates if present
    if (stock != null) updates.stock = Number(stock);

    const { data: product, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();
    
    if (error || !product) {
      return res.status(404).json({ error: 'Product not found or unauthorized' });
    }

    return res.json(normalizeProduct(product));
  } catch (error) {
    console.error('Failed to update product:', error);
    return res.status(500).json({ error: 'Unable to update product.' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw error;

    return res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('Failed to delete product:', error);
    return res.status(500).json({ error: 'Unable to delete product.' });
  }
};

exports.getWishlistProducts = async (req, res) => {
  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('wishlist')
      .eq('id', req.user.id)
      .single();

    if (profileError) throw profileError;

    const wishlistIds = profile.wishlist || [];
    if (wishlistIds.length === 0) return res.json([]);

    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .in('id', wishlistIds);

    if (productsError) throw productsError;
    
    return res.json(products.map(normalizeProduct));
  } catch (error) {
    console.error('Failed to fetch wishlist products:', error);
    return res.status(500).json({ error: 'Unable to fetch wishlist.' });
  }
};
