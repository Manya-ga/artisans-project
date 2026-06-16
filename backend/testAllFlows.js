const http = require('http');

const BASE_URL = process.env.API_URL || process.env.BACKEND_URL || 'https://artisan-connect-backend-db2z.onrender.com';

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 80,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let body = data;
        try {
          body = JSON.parse(data);
        } catch (e) {
          // not JSON
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body
        });
      });
    });

    req.on('error', err => reject(err));

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('=== Starting Artisan Connect Integration Tests ===\n');

  let testUserToken = null;
  let testUserId = null;
  let testProductId = null;
  let testStoryId = null;

  try {
    // 1. REGISTER
    console.log('[Test] Registering a new customer user...');
    const regRes = await makeRequest(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      body: {
        email: `testcustomer-${Date.now()}@test.com`,
        password: 'password123',
        displayName: 'Test Customer'
      }
    });
    console.log(`Status: ${regRes.statusCode}`);
    if (regRes.statusCode !== 201) throw new Error('Registration failed');
    testUserToken = regRes.body.token;
    testUserId = regRes.body.user.id;
    console.log(`User created: ${testUserId}, Token generated: ${testUserToken ? 'Yes' : 'No'}\n`);

    // 2. LOGIN
    console.log('[Test] Logging in with credentials...');
    const loginRes = await makeRequest(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      body: {
        email: regRes.body.user.email,
        password: 'password123'
      }
    });
    console.log(`Status: ${loginRes.statusCode}`);
    if (loginRes.statusCode !== 200) throw new Error('Login failed');
    console.log(`Login response received successfully.\n`);

    // 3. GET PROFILE (Protected Route)
    console.log('[Test] Fetching own user profile...');
    const meRes = await makeRequest(`${BASE_URL}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${testUserToken}` }
    });
    console.log(`Status: ${meRes.statusCode}`);
    if (meRes.statusCode !== 200) throw new Error('Auth me failed');
    console.log(`Profile name: ${meRes.body.user.displayName}\n`);

    // 4. UPDATE PROFILE
    console.log('[Test] Updating profile bio...');
    const updateProfileRes = await makeRequest(`${BASE_URL}/api/auth/profile`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${testUserToken}` },
      body: {
        displayName: 'Updated Customer Name',
        bio: 'Just a buyer looking for handmade crafts.'
      }
    });
    console.log(`Status: ${updateProfileRes.statusCode}`);
    if (updateProfileRes.statusCode !== 200) throw new Error('Profile update failed');
    console.log(`New Bio: ${updateProfileRes.body.user.bio}\n`);

    // 5. GET PRODUCTS (Marketplace)
    console.log('[Test] Listing products...');
    const productsRes = await makeRequest(`${BASE_URL}/api/products`);
    console.log(`Status: ${productsRes.statusCode}, Products Count: ${productsRes.body.products?.length}`);
    if (productsRes.statusCode !== 200) throw new Error('Get products failed');
    const firstProduct = productsRes.body.products?.[0];
    console.log(`First product: ${firstProduct?.title || 'None'} by ${firstProduct?.artisanName || 'None'}\n`);

    // 6. TOGGLE WISHLIST
    if (firstProduct) {
      console.log(`[Test] Toggling product ${firstProduct.id} to wishlist...`);
      const wishRes = await makeRequest(`${BASE_URL}/api/auth/wishlist`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${testUserToken}` },
        body: { productId: firstProduct.id }
      });
      console.log(`Status: ${wishRes.statusCode}`);
      if (wishRes.statusCode !== 200) throw new Error('Toggle wishlist failed');
      console.log(`Wishlist items: ${JSON.stringify(wishRes.body.wishlist)}\n`);
    }

    // 7. CART FLOW
    if (firstProduct) {
      console.log('[Test] Adding item to cart...');
      const cartAddRes = await makeRequest(`${BASE_URL}/api/cart`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${testUserToken}` },
        body: { productId: firstProduct.id, quantity: 2 }
      });
      console.log(`Status: ${cartAddRes.statusCode}`);
      if (cartAddRes.statusCode !== 200) throw new Error('Add cart failed');

      console.log('[Test] Reading cart...');
      const cartGetRes = await makeRequest(`${BASE_URL}/api/cart`, {
        headers: { 'Authorization': `Bearer ${testUserToken}` }
      });
      console.log(`Status: ${cartGetRes.statusCode}, Items: ${cartGetRes.body.items?.length}`);
      if (cartGetRes.statusCode !== 200) throw new Error('Get cart failed');

      console.log('[Test] Checking out cart...');
      const checkoutRes = await makeRequest(`${BASE_URL}/api/cart/checkout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${testUserToken}` }
      });
      console.log(`Status: ${checkoutRes.statusCode}`);
      if (checkoutRes.statusCode !== 200) throw new Error('Checkout failed');
      console.log(`Checkout response: ${JSON.stringify(checkoutRes.body)}\n`);
    }

    // 8. MESSAGING FLOW
    const sampleArtisanId = '1a518baa-6bd9-4318-b30b-40a7335dd98f'; // Ramesh Kumar
    console.log(`[Test] Sending message to artisan ${sampleArtisanId}...`);
    const sendMsgRes = await makeRequest(`${BASE_URL}/api/messages/send`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${testUserToken}` },
      body: {
        receiverId: sampleArtisanId,
        text: 'Hello, I want to inquire about custom pottery pieces.'
      }
    });
    console.log(`Status: ${sendMsgRes.statusCode}`);
    if (sendMsgRes.statusCode !== 201) throw new Error('Send message failed');

    console.log('[Test] Reading message thread...');
    const threadRes = await makeRequest(`${BASE_URL}/api/messages/${sampleArtisanId}`, {
      headers: { 'Authorization': `Bearer ${testUserToken}` }
    });
    console.log(`Status: ${threadRes.statusCode}, Message count: ${threadRes.body.length}`);
    if (threadRes.statusCode !== 200) throw new Error('Read thread failed');
    console.log(`Last message: ${threadRes.body[threadRes.body.length - 1]?.text}\n`);

    // 8.5. FOLLOW FLOW
    console.log(`[Test] Following artisan ${sampleArtisanId}...`);
    const followRes = await makeRequest(`${BASE_URL}/api/users/${sampleArtisanId}/follow`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${testUserToken}` }
    });
    console.log(`Status: ${followRes.statusCode}, isFollowing: ${followRes.body.isFollowing}`);
    if (followRes.statusCode !== 200) throw new Error('Follow failed');

    console.log(`[Test] Unfollowing artisan ${sampleArtisanId}...`);
    const unfollowRes = await makeRequest(`${BASE_URL}/api/users/${sampleArtisanId}/follow`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${testUserToken}` }
    });
    console.log(`Status: ${unfollowRes.statusCode}, isFollowing: ${unfollowRes.body.isFollowing}`);
    if (unfollowRes.statusCode !== 200) throw new Error('Unfollow failed');

    // 9. STORIES FLOW
    console.log('[Test] Creating a story...');
    const storyRes = await makeRequest(`${BASE_URL}/api/stories`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${testUserToken}` },
      body: {
        title: 'Crafting in progress',
        bio: 'Behind the scenes at my pottery wheel.',
        mediaUrl: 'https://via.placeholder.com/400'
      }
    });
    console.log(`Status: ${storyRes.statusCode}`);
    if (storyRes.statusCode !== 201) throw new Error('Create story failed');
    testStoryId = storyRes.body.story.id;

    console.log('[Test] Deleting story...');
    const delStoryRes = await makeRequest(`${BASE_URL}/api/stories/${testStoryId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${testUserToken}` }
    });
    console.log(`Status: ${delStoryRes.statusCode}\n`);
    if (delStoryRes.statusCode !== 200) throw new Error('Delete story failed');

    // 10. PRODUCTS FLOW (Creating as Artisan)
    console.log('[Test] Creating a new product...');
    const prodRes = await makeRequest(`${BASE_URL}/api/products`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${testUserToken}` },
      body: {
        title: 'Custom Test Product',
        price: 150,
        description: 'Excellent handmade test item.',
        category: 'TestCraft',
        image: 'https://via.placeholder.com/500'
      }
    });
    console.log(`Status: ${prodRes.statusCode}`);
    if (prodRes.statusCode !== 201) throw new Error('Create product failed');
    testProductId = prodRes.body.id;

    console.log('[Test] Updating product...');
    const updateProdRes = await makeRequest(`${BASE_URL}/api/products/${testProductId}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${testUserToken}` },
      body: {
        title: 'Updated Custom Test Product',
        price: 160
      }
    });
    console.log(`Status: ${updateProdRes.statusCode}`);
    if (updateProdRes.statusCode !== 200) throw new Error('Update product failed');

    console.log('[Test] Deleting product...');
    const delProdRes = await makeRequest(`${BASE_URL}/api/products/${testProductId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${testUserToken}` }
    });
    console.log(`Status: ${delProdRes.statusCode}\n`);
    if (delProdRes.statusCode !== 200) throw new Error('Delete product failed');

    console.log('=== All Integration Tests Completed Successfully! ===');
  } catch (err) {
    console.error('\n*** TEST FAILED:', err.message);
    process.exit(1);
  }
}

runTests();
