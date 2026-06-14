const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const authMiddleware = require('../middleware/authMiddleware');

function normalizeOffer(offer) {
  return {
    _id: offer.id,
    id: offer.id,
    title: offer.title,
    description: offer.description,
    code: offer.code,
    isActive: offer.is_active,
    expiryDate: offer.expiry_date,
    minOrderValue: offer.min_order_value,
    discountType: offer.discount_type,
    discountValue: offer.discount_value,
    createdBy: offer.created_by,
    createdAt: offer.created_at
  };
}

// Get all active offers
router.get('/', async (req, res) => {
  try {
    const { data: offers, error } = await supabase
      .from('offers')
      .select('*')
      .eq('is_active', true)
      .gte('expiry_date', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(offers.map(normalizeOffer));
  } catch (err) {
    console.error('Error fetching offers:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get offers created by current artisan
router.get('/my-offers', authMiddleware, async (req, res) => {
  try {
    const { data: offers, error } = await supabase
      .from('offers')
      .select('*')
      .eq('created_by', req.user.id);

    if (error) throw error;
    res.json(offers.map(normalizeOffer));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new offer
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { data: offer, error } = await supabase
      .from('offers')
      .insert({
        title: req.body.title,
        description: req.body.description,
        code: req.body.code,
        is_active: req.body.isActive !== false,
        expiry_date: req.body.expiryDate,
        min_order_value: req.body.minOrderValue || 0,
        discount_type: req.body.discountType,
        discount_value: req.body.discountValue,
        created_by: req.user.id
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(normalizeOffer(offer));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete offer
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { error } = await supabase
      .from('offers')
      .delete()
      .eq('id', req.params.id)
      .eq('created_by', req.user.id);

    if (error) throw error;
    res.json({ message: 'Offer deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Validate coupon
router.post('/validate', async (req, res) => {
  const { code, orderValue } = req.body;
  try {
    const { data: offer, error } = await supabase
      .from('offers')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .gte('expiry_date', new Date().toISOString())
      .maybeSingle();

    if (error || !offer) {
      return res.status(404).json({ success: false, message: 'Invalid or expired coupon' });
    }

    if (orderValue < offer.min_order_value) {
      return res.status(400).json({ 
        success: false, 
        message: `Min order value for this coupon is ₹${offer.min_order_value}` 
      });
    }

    let discount = 0;
    if (offer.discount_type === 'percentage') {
      discount = (orderValue * offer.discount_value) / 100;
    } else {
      discount = offer.discount_value;
    }

    res.json({ 
      success: true, 
      discount: Math.min(discount, orderValue),
      code: offer.code,
      message: 'Coupon applied successfully'
    });
  } catch (err) {
    console.error('Validation error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
