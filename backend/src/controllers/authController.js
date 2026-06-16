const supabase = require('../config/supabase');
const { getPublicBaseUrl } = require('../utils/publicUrl');

// Email validation regex (RFC 5322 simplified)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;
const MIN_NAME_LENGTH = 2;

function sendTokenCookie(res, token) {
  res.cookie('token', token, {
    httpOnly: true,
    secure: true, // Required for sameSite: 'none'
    sameSite: 'none', // Required for cross-origin
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

function sanitizeUser(user) {
  if (!user) return null;
  const id = user.id || user._id;
  return {
    id: id,
    _id: id, // compatibility for frontend
    displayName: user.display_name || user.displayName || user.email?.split('@')[0],
    email: user.email,
    role: user.role || 'buyer',
    photoURL: user.photo_url || user.photoURL || '',
    bio: user.bio || '',
    wishlist: user.wishlist || [],
    emailVerified: user.email_verified ?? true,
  };
}

// ── REGISTER ─────────────────────────────────────────────────────────────────
exports.register = async (req, res) => {
  const { email, password, displayName } = req.body || {};

  if (!email || !password || !displayName) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  // Validate email format
  if (!EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  // Validate password strength
  if (password.length < MIN_PASSWORD_LENGTH) {
    return res.status(400).json({ error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` });
  }

  // Validate name length
  if (displayName.trim().length < MIN_NAME_LENGTH) {
    return res.status(400).json({ error: `Name must be at least ${MIN_NAME_LENGTH} characters.` });
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password,
      options: {
        data: {
          display_name: displayName.trim(),
        }
      }
    });

    if (error) return res.status(400).json({ error: error.message });
    if (!data.user) return res.status(400).json({ error: 'Registration failed.' });

    // Create profile in public.profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        email: email.toLowerCase().trim(),
        display_name: displayName.trim(),
        role: 'buyer',
        updated_at: new Date().toISOString()
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Even if profile fails, user is created in auth.
    }

    let token = null;
    if (data.session) {
      token = data.session.access_token;
      sendTokenCookie(res, token);
    }

    return res.status(201).json({
      message: 'Registration successful.',
      token,
      user: sanitizeUser({ ...data.user, display_name: displayName, role: 'buyer' })
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Registration failed.' });
  }
};

// ── LOGIN ─────────────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  // Validate email format
  if (!EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    });

    if (error) {
      console.error('Login error from Supabase:', error.message);
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Fetch profile with error handling
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle();

    const token = data.session.access_token;
    sendTokenCookie(res, token);
    return res.json({ 
      token,
      user: sanitizeUser(profile || data.user) 
    });
  } catch (err) {
    console.error('Unexpected login error:', err);
    return res.status(500).json({ error: 'Login failed due to a server error.' });
  }
};

// ── LOGOUT ────────────────────────────────────────────────────────────────────
exports.logout = async (req, res) => {
  await supabase.auth.signOut();
  res.clearCookie('token');
  return res.json({ message: 'Logged out successfully' });
};

// ── GET CURRENT USER ──────────────────────────────────────────────────────────
exports.getCurrentUser = async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated.' });
  return res.json({ user: sanitizeUser(req.user) });
};

// ── DEMO LOGIN ────────────────────────────────────────────────────────────────
exports.demoLogin = async (req, res) => {
  const demoEmail = process.env.DEMO_USER_EMAIL || 'demo@artisan.com';
  const demoPassword = process.env.DEMO_USER_PASSWORD || 'demo1234';

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: demoEmail,
      password: demoPassword,
    });

    if (error) {
      console.error('Demo login error from Supabase:', error.message);
      return res.status(401).json({ error: `Demo login failed: ${error.message}` });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle();

    const token = data.session.access_token;
    sendTokenCookie(res, token);
    return res.json({ 
      token,
      user: sanitizeUser(profile || data.user) 
    });
  } catch (err) {
    console.error('Unexpected demo login error:', err);
    return res.status(500).json({ error: 'Demo login error.' });
  }
};

// ── TOGGLE WISHLIST ───────────────────────────────────────────────────────────
exports.toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    // Fetch current wishlist
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('wishlist')
      .eq('id', userId)
      .single();

    if (fetchError) throw fetchError;

    let wishlist = profile.wishlist || [];
    const index = wishlist.indexOf(productId);
    if (index > -1) {
      wishlist.splice(index, 1);
    } else {
      wishlist.push(productId);
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ wishlist })
      .eq('id', userId);

    if (updateError) throw updateError;

    return res.json({ wishlist });
  } catch (error) {
    console.error('Failed to toggle wishlist:', error);
    return res.status(500).json({ error: 'Failed to update wishlist' });
  }
};

// ── UPDATE PROFILE ────────────────────────────────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = {};

    if (req.body.displayName) updates.display_name = String(req.body.displayName).trim();
    if (req.body.bio !== undefined) updates.bio = String(req.body.bio).trim();

    if (req.file) {
      let url;
      const uploadMiddleware = require('../middleware/upload');
      if (uploadMiddleware.uploadToSupabase) {
        url = await uploadMiddleware.uploadToSupabase(req.file, 'artisan-connect');
      }
      if (!url) {
        const path = require('path');
        const fileName = path.basename(req.file.path || req.file.filename || '');
        url = `${getPublicBaseUrl(req)}/uploads/${fileName}`;
      }
      updates.photo_url = url;
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    return res.json({ user: sanitizeUser(profile) });
  } catch (error) {
    console.error('Failed to update profile:', error);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
};
