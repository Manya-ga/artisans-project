const supabase = require('../config/supabase');

function normalizeCartItem(item) {
  return {
    productId: item.productId,
    title: item.title,
    price: item.price,
    image: item.image || item.imageUrl,
    artisanName: item.artisanName,
    qty: Number(item.qty || 0),
  };
}

async function getCartForUser(userId) {
  const { data: cart, error } = await supabase
    .from('carts')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !cart) {
    const { data: newCart, error: createError } = await supabase
      .from('carts')
      .insert({ user_id: userId, items: [] })
      .select()
      .single();
    if (createError) throw createError;
    return newCart;
  }
  return cart;
}

exports.getCart = async (req, res) => {
  try {
    const cart = await getCartForUser(req.user.id);
    return res.json({ items: (cart.items || []).map(normalizeCartItem) });
  } catch (error) {
    console.error('Failed to get cart:', error);
    return res.status(500).json({ error: 'Unable to load cart.' });
  }
};

exports.addCartItem = async (req, res) => {
  try {
    const { productId, qty = 1 } = req.body || {};
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required.' });
    }

    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const cart = await getCartForUser(req.user.id);
    let items = cart.items || [];
    const key = String(productId);
    const existingIndex = items.findIndex((item) => item.productId === key);

    if (existingIndex > -1) {
      items[existingIndex].qty = Math.max(1, items[existingIndex].qty + Number(qty));
    } else {
      items.push({
        productId: key,
        title: product.title,
        price: product.price,
        imageUrl: product.image,
        artisanName: product.artisan_name || product.artisanName,
        qty: Math.max(1, Number(qty)),
      });
    }

    const { error: updateError } = await supabase
      .from('carts')
      .update({ items })
      .eq('id', cart.id);

    if (updateError) throw updateError;

    return res.json({ items: items.map(normalizeCartItem) });
  } catch (error) {
    console.error('Failed to add cart item:', error);
    return res.status(500).json({ error: 'Unable to update cart.' });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { qty } = req.body || {};
    const productId = req.params.productId;
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required.' });
    }

    const cart = await getCartForUser(req.user.id);
    let items = cart.items || [];
    const existingIndex = items.findIndex((i) => i.productId === String(productId));
    if (existingIndex === -1) {
      return res.status(404).json({ error: 'Item not found.' });
    }

    if (!qty || Number(qty) <= 0) {
      items = items.filter((i) => i.productId !== String(productId));
    } else {
      items[existingIndex].qty = Number(qty);
    }

    const { error: updateError } = await supabase
      .from('carts')
      .update({ items })
      .eq('id', cart.id);

    if (updateError) throw updateError;

    return res.json({ items: items.map(normalizeCartItem) });
  } catch (error) {
    console.error('Failed to update cart item:', error);
    return res.status(500).json({ error: 'Unable to update cart.' });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const productId = req.params.productId;
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required.' });
    }

    const cart = await getCartForUser(req.user.id);
    let items = cart.items || [];
    items = items.filter((item) => item.productId !== String(productId));

    const { error: updateError } = await supabase
      .from('carts')
      .update({ items })
      .eq('id', cart.id);

    if (updateError) throw updateError;

    return res.json({ items: items.map(normalizeCartItem) });
  } catch (error) {
    console.error('Failed to remove cart item:', error);
    return res.status(500).json({ error: 'Unable to update cart.' });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const cart = await getCartForUser(req.user.id);
    const { error } = await supabase
      .from('carts')
      .update({ items: [] })
      .eq('id', cart.id);

    if (error) throw error;
    return res.json({ items: [] });
  } catch (error) {
    console.error('Failed to clear cart:', error);
    return res.status(500).json({ error: 'Unable to clear cart.' });
  }
};

exports.checkoutCart = async (req, res) => {
  try {
    const cart = await getCartForUser(req.user.id);
    const items = cart.items || [];
    if (!items.length) {
      return res.status(400).json({ error: 'Cart is empty.' });
    }

    const total = items.reduce((sum, item) => sum + (item.price || 0) * item.qty, 0);
    
    // In SQL, we usually create one order with multiple line items, 
    // but the original code created one order PER item. I'll stick to that for now for compatibility.
    const createdOrders = [];
    for (const item of items) {
      const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: req.user.id,
          items: [item],
          total_amount: item.price * item.qty,
          payment_status: 'Paid',
          order_status: 'Placed',
          address: {} // Empty address for now as it's not provided in this call
        })
        .select()
        .single();
      
      if (!orderError) {
        createdOrders.push(newOrder);
      } else {
        console.error('Order creation error:', orderError);
      }
    }

    // Clear cart
    await supabase
      .from('carts')
      .update({ items: [] })
      .eq('id', cart.id);

    return res.json({
      message: 'Checkout complete.',
      order: {
        orderId: Date.now().toString(),
        total,
        currency: 'USD',
        items: createdOrders,
      },
    });
  } catch (error) {
    console.error('Checkout failed:', error);
    return res.status(500).json({ error: 'Checkout failed.' });
  }
};
