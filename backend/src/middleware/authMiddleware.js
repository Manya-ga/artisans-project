const supabase = require('../config/supabase');

async function authMiddleware(req, res, next) {
  // Log incoming headers for debugging
  console.log('[Backend] Authorization Header:', req.headers.authorization);

  let token = req.cookies?.token;
  
  // Fallback to Authorization header if cookie is missing
  if (!token && req.headers.authorization) {
    if (req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else {
      // Handle cases where Bearer prefix might be missing but token is provided
      token = req.headers.authorization;
    }
  }

  console.log('[Backend] Extracted Token:', token ? `${token.substring(0, 10)}...` : 'NONE');

  if (!token) {
    return res.status(401).json({ error: 'Missing authorization token.' });
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }

    // Fetch extra profile info from public.profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError || !profile) {
      // If profile doesn't exist yet, we can still proceed with basic user info
      req.user = { 
        id: user.id, 
        _id: user.id,
        email: user.email, 
        ...user.user_metadata 
      };
    } else {
      req.user = { 
        ...profile,
        id: profile.id,
        _id: profile.id // ensure _id is present
      };
    }
    
    next();
  } catch (error) {
    console.error('Supabase auth error:', error);
    return res.status(401).json({ error: 'Authentication failed.' });
  }
}

module.exports = authMiddleware;
