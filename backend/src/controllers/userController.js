const supabase = require('../config/supabase');

exports.getArtisans = async (req, res) => {
  try {
    const currentUserId = req.user ? req.user.id : null;
    
    // Find all artisans
    const { data: artisans, error } = await supabase
      .from('profiles')
      .select('id, display_name, photo_url, bio, location, email')
      .eq('role', 'artisan');

    if (error) throw error;

    // Normalize and add isSelf flag
    const data = artisans.map(artisan => ({
      _id: artisan.id,
      id: artisan.id,
      displayName: artisan.display_name,
      name: artisan.display_name,
      photoURL: artisan.photo_url,
      image: artisan.photo_url,
      bio: artisan.bio,
      location: artisan.location,
      email: artisan.email,
      isSelf: currentUserId ? artisan.id === currentUserId : false
    }));

    res.json(data);
  } catch (error) {
    console.error('Failed to fetch artisans:', error);
    res.status(500).json({ error: 'Failed to fetch artisans' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('id, display_name, photo_url, bio, location, role, followers, following')
      .eq('id', req.params.id)
      .single();
    
    if (userError || !user) return res.status(404).json({ error: 'User not found' });
    
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (productsError) throw productsError;

    const currentUserId = req.user?.id;
    const isFollowing = currentUserId ? (user.followers || []).includes(currentUserId) : false;
    
    res.json({
      _id: user.id,
      id: user.id,
      displayName: user.display_name,
      name: user.display_name,
      photoURL: user.photo_url,
      image: user.photo_url,
      bio: user.bio,
      location: user.location,
      role: user.role,
      followersCount: (user.followers || []).length,
      followingCount: (user.following || []).length,
      isFollowing,
      products: products.map(p => ({
        id: p.id,
        _id: p.id,
        title: p.title,
        price: p.price,
        image: p.image || (p.images && p.images[0]) || '',
        images: p.images || [],
        artisanName: p.artisan_name,
        category: p.category,
        userId: p.user_id
      }))
    });
  } catch (error) {
    console.error('Failed to fetch user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

exports.toggleFollow = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user.id;

    if (targetUserId === currentUserId) {
      return res.status(400).json({ error: 'You cannot follow yourself' });
    }

    const { data: targetUser, error: tError } = await supabase
      .from('profiles')
      .select('followers')
      .eq('id', targetUserId)
      .single();

    const { data: currentUser, error: cError } = await supabase
      .from('profiles')
      .select('following')
      .eq('id', currentUserId)
      .single();

    if (tError || !targetUser || cError || !currentUser) {
       return res.status(404).json({ error: 'User not found' });
    }

    let tFollowers = targetUser.followers || [];
    let cFollowing = currentUser.following || [];

    const isFollowing = tFollowers.includes(currentUserId);

    if (isFollowing) {
      tFollowers = tFollowers.filter(id => id !== currentUserId);
      cFollowing = cFollowing.filter(id => id !== targetUserId);
    } else {
      tFollowers.push(currentUserId);
      cFollowing.push(targetUserId);
    }

    const { error: tUpdateError } = await supabase
      .from('profiles')
      .update({ followers: tFollowers })
      .eq('id', targetUserId);

    const { error: cUpdateError } = await supabase
      .from('profiles')
      .update({ following: cFollowing })
      .eq('id', currentUserId);

    if (tUpdateError || cUpdateError) throw new Error('Update failed');

    res.json({ success: true, isFollowing: !isFollowing });
  } catch (error) {
    console.error('Toggle follow error:', error);
    res.status(500).json({ error: 'Operation failed' });
  }
};
