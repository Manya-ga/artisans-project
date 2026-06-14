const supabase = require('../config/supabase');

exports.getActiveAds = async (req, res) => {
  try {
    const { data: ads, error } = await supabase
      .from('ads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.json(ads);
  } catch (error) {
    console.error('Failed to fetch ads:', error);
    return res.status(500).json({ error: 'Failed to fetch ads.' });
  }
};

exports.createAd = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('ads')
      .insert(req.body)
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json(data);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
