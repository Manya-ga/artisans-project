const supabase = require('../config/supabase');

exports.validateCoupon = async (req, res) => {
  const { code, amount } = req.body;
  if (!code || !amount) {
    return res.status(400).json({ error: 'Code and amount are required.' });
  }

  try {
    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      // Assuming 'is_active' exists or just ignore for now if not in schema
      .maybeSingle();

    if (error || !coupon) {
      return res.status(404).json({ error: 'Invalid or inactive coupon code.' });
    }

    // Expiry check if expiry_date exists
    if (coupon.expiry_date && new Date() > new Date(coupon.expiry_date)) {
      return res.status(400).json({ error: 'Coupon has expired.' });
    }

    if (coupon.min_order_amount && amount < coupon.min_order_amount) {
      return res.status(400).json({ error: `Minimum order amount for this coupon is ₹${coupon.min_order_amount}` });
    }

    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = (amount * coupon.discount_value) / 100;
      if (coupon.max_discount_amount && discount > coupon.max_discount_amount) {
        discount = coupon.max_discount_amount;
      }
    } else {
      discount = coupon.discount_value || coupon.discount; // fallback to 'discount' from schema.sql
    }

    return res.json({
      success: true,
      discount,
      finalAmount: amount - discount,
      message: 'Coupon applied successfully!',
    });
  } catch (error) {
    console.error('Coupon validation error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

exports.createCoupon = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .insert(req.body)
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json(data);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
