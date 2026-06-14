const supabase = require('../config/supabase');
const uploadMiddleware = require('../middleware/upload');
const { getPublicBaseUrl } = require('../utils/publicUrl');

// GET ALL STORIES (Unique per user)
exports.getStories = async (req, res) => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    // Fetch stories from the last 24 hours
    const { data: stories, error } = await supabase
      .from('stories')
      .select('*, profiles(display_name, photo_url)')
      .gte('created_at', twentyFourHoursAgo)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.json(
      stories.map((story) => ({
        id: story.id,
        userId: story.user_id,
        userName: story.profiles?.display_name || story.user_name || 'Artisan',
        userProfileImage: story.profiles?.photo_url || story.user_profile_image || '',
        title: story.title,
        bio: story.bio,
        media: story.media || [],
        createdAt: story.created_at,
      }))
    );
  } catch (error) {
    console.error('Failed to get stories:', error);
    return res.status(500).json({ error: 'Unable to load stories.' });
  }
};

exports.getUserStories = async (req, res) => {
  try {
    const { userId } = req.params;
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data: story, error } = await supabase
      .from('stories')
      .select('*, profiles(display_name, photo_url)')
      .eq('user_id', userId)
      .gte('created_at', twentyFourHoursAgo)
      .maybeSingle();

    if (error) throw error;
    if (!story) return res.json(null);

    return res.json({
      id: story.id,
      userId: story.user_id,
      userName: story.profiles?.display_name || story.user_name,
      userProfileImage: story.profiles?.photo_url || story.user_profile_image || '',
      title: story.title,
      bio: story.bio,
      media: story.media || [],
      createdAt: story.created_at,
    });
  } catch (error) {
    console.error('Failed to get user stories:', error);
    return res.status(500).json({ error: 'Unable to load user stories.' });
  }
};

exports.createStory = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Auth required' });

    const { title, bio, mediaUrl } = req.body || {};
    const uploadedMedia = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        let url;
        if (uploadMiddleware.uploadToSupabase) {
          url = await uploadMiddleware.uploadToSupabase(file, 'artisan-connect');
        }
        if (!url) {
          url = `${getPublicBaseUrl(req)}/uploads/${file.filename}`;
        }
        uploadedMedia.push({
          url,
          type: file.mimetype.startsWith('video/') ? 'video' : 'image',
          createdAt: new Date().toISOString()
        });
      }
    } else if (mediaUrl) {
      uploadedMedia.push({
        url: mediaUrl,
        type: mediaUrl.match(/\.(mp4|mov|webm)$/i) ? 'video' : 'image',
        createdAt: new Date().toISOString()
      });
    }

    if (uploadedMedia.length === 0) {
      return res.status(400).json({ error: 'No media provided' });
    }

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    // Find existing story from the last 24h
    const { data: existingStory, error: fetchError } = await supabase
      .from('stories')
      .select('*')
      .eq('user_id', req.user.id)
      .gte('created_at', twentyFourHoursAgo)
      .maybeSingle();

    if (fetchError) throw fetchError;

    let result;
    if (existingStory) {
      const updatedMedia = [...existingStory.media, ...uploadedMedia];
      const { data, error } = await supabase
        .from('stories')
        .update({
          media: updatedMedia,
          title: title || existingStory.title,
          bio: bio || existingStory.bio
        })
        .eq('id', existingStory.id)
        .select()
        .single();
      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await supabase
        .from('stories')
        .insert({
          user_id: req.user.id,
          user_name: req.user.display_name || req.user.displayName || req.user.email?.split('@')[0],
          user_profile_image: req.user.photo_url || req.user.photoURL || '',
          title: title || '',
          bio: bio || '',
          media: uploadedMedia
        })
        .select()
        .single();
      if (error) throw error;
      result = data;
    }

    res.status(201).json({ success: true, story: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteStory = async (req, res) => {
  try {
    const { error } = await supabase
      .from('stories')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
