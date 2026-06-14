import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Interceptor to attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('[Frontend] Token:', token);
  console.log(`[Frontend] Request to ${config.url}`);
  
  // Define protected routes that REQUIRE a token
  const protectedRoutes = [
    '/api/stories',
    '/api/auth/profile',
    '/api/products/mine',
    '/api/auth/me',
    '/api/cart',
    '/api/orders',
    '/api/offers'
  ];

  const isProtected = protectedRoutes.some(route => config.url.startsWith(route));
  const isPostOrPutOrDelete = ['post', 'put', 'delete'].includes(config.method.toLowerCase());

  if (isProtected || isPostOrPutOrDelete) {
    if (!token && !config.url.includes('/api/auth/login') && !config.url.includes('/api/auth/register') && !config.url.includes('/api/auth/demo')) {
      console.warn(`[Frontend] Warning: Protected route ${config.url} called without token!`);
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('[Frontend] Authorization header attached');
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor to handle errors centrally
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
       localStorage.removeItem('token');
       localStorage.removeItem('artisan_user');
       // We stop automatic redirects here to prevent loops/hangs.
       // The AuthContext or specific pages will handle the unauthenticated state.
    }
    const message = error.response?.data?.error || error.message || 'Request failed';
    throw new Error(message);
  }
);

export async function loginUser(email, password) {
  return api.post('/api/auth/login', { email, password });
}

export async function registerUser(email, password, displayName) {
  return api.post('/api/auth/register', { email, password, displayName });
}

export async function loginDemoUser() {
  return api.post('/api/auth/demo');
}

export async function logoutUser() {
  return api.post('/api/auth/logout');
}

export async function fetchCurrentUser() {
  return api.get('/api/auth/me');
}

export async function toggleWishlist(productId) {
  return api.post('/api/auth/wishlist', { productId });
}

export async function fetchWishlist() {
  return api.get('/api/products/wishlist');
}

export async function getProducts(params = {}) {
  return api.get('/api/products', { params });
}

export async function getProductCategories() {
  return api.get('/api/products/categories');
}

export async function getMyProducts() {
  return api.get('/api/products/mine');
}

export async function getProductById(id) {
  return api.get(`/api/products/${id}`);
}

export async function getArtisans() {
  return api.get('/api/users/artisans');
}

export async function getArtisan(id) {
  return api.get(`/api/users/${id}`);
}

export async function followArtisan(id) {
  return api.post(`/api/users/${id}/follow`);
}

export async function getStories() {
  return api.get('/api/stories');
}

export async function getUserStories(userId) {
  return api.get(`/api/stories/user/${userId}`);
}

export async function createStory(body) {
  return api.post('/api/stories', body);
}

export async function deleteStory(storyId) {
  return api.delete(`/api/stories/${storyId}`);
}

export async function createProduct(body) {
  return api.post('/api/products', body);
}

export async function getCart() {
  return api.get('/api/cart');
}

export async function addCartItem(body) {
  return api.post('/api/cart', body);
}

export async function updateCartItem(productId, body) {
  return api.put(`/api/cart/${productId}`, body);
}

export async function removeCartItem(productId) {
  return api.delete(`/api/cart/${productId}`);
}

export async function clearCart() {
  return api.delete('/api/cart');
}

export async function checkoutCart() {
  return api.post('/api/cart/checkout');
}

export async function updateProduct(productId, body) {
  return api.put(`/api/products/${productId}`, body);
}

export async function deleteProduct(productId) {
  return api.delete(`/api/products/${productId}`);
}

export async function createRazorpayOrder(amount) {
  return api.post('/api/orders/create-razorpay-order', { amount });
}

export async function verifyPayment(body) {
  return api.post('/api/orders/verify-payment', body);
}

export async function fetchMyOrders() {
  return api.get('/api/orders/mine');
}

export async function fetchAds() {
  return api.get('/api/ads');
}

export async function getOffers() {
  return api.get('/api/offers');
}

export async function getMyOffers() {
  return api.get('/api/offers/my-offers');
}

export async function sendMessage(body) {
  return api.post('/api/messages', body);
}

export async function createOffer(body) {
  return api.post('/api/offers', body);
}

export async function deleteOffer(id) {
  return api.delete(`/api/offers/${id}`);
}

export async function validateCoupon(code, orderValue) {
  return api.post('/api/offers/validate', { code, orderValue });
}

export async function updateProfile(data) {
  const formData = new FormData();
  if (data.displayName !== undefined) formData.append('displayName', data.displayName);
  if (data.bio !== undefined) formData.append('bio', data.bio);
  if (data.avatar instanceof File) formData.append('avatar', data.avatar);

  return api.put('/api/auth/profile', formData);
}

export default api;
