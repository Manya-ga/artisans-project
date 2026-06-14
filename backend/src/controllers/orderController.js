const crypto = require('crypto');
const razorpay = require('../config/razorpay');
const supabase = require('../config/supabase');

// 1. Create Razorpay Order
exports.createRazorpayOrder = async (req, res) => {
  const { amount } = req.body;
  if (!amount) {
    return res.status(400).json({ error: 'Amount is required.' });
  }

  try {
    const options = {
      amount: Math.round(amount * 100), // convert to paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    return res.status(500).json({ error: 'Unable to create Razorpay order.' });
  }
};

// 2. Verify Payment and Save Order
exports.verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderData,
  } = req.body;

  try {
    // Verify Signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder')
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid payment signature.' });
    }

    // Create Final Order in DB (Supabase)
    const { data: newOrder, error } = await supabase
      .from('orders')
      .insert({
        user_id: req.user.id,
        items: orderData.items,
        total_amount: orderData.totalAmount,
        address: orderData.address,
        razorpay_order_id: razorpay_order_id,
        razorpay_payment_id: razorpay_payment_id,
        razorpay_signature: razorpay_signature,
        payment_status: 'Paid',
        order_status: 'Placed',
      })
      .select()
      .single();

    if (error) throw error;

    return res.json({
      success: true,
      message: 'Payment verified and order created.',
      order: newOrder,
    });
  } catch (error) {
    console.error('Payment verification failed:', error);
    return res.status(500).json({ error: 'Internal server error during verification.' });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.json(orders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return res.status(500).json({ error: 'Failed to fetch orders.' });
  }
};
