const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const artisanRoutes = require('./routes/artisanRoutes');
const storyRoutes = require('./routes/storyRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const offerRoutes = require('./routes/offerRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();


const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.CORS_ORIGIN,
  process.env.RENDER_EXTERNAL_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  'https://artisan-connect-frontend.vercel.app',
  'https://artisan-connect-backend-db2z.onrender.com',
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(cookieParser());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  // eslint-disable-next-line no-console
  console.log(`[Backend] ${req.method} ${req.url}`);
  next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/test', (req, res) => {
  return res.json({ status: 'ok' });
});

app.get('/api/health', (req, res) => {
  return res.json({ status: 'ok' });
});

app.get('/api/health/debug', (req, res) => {
  return res.json({ 
    supabaseUrlConfigured: !!process.env.SUPABASE_URL,
    supabaseRoleKeyConfigured: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    databaseInUse: (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) ? 'Supabase' : 'local_db.json',
    supabaseUrlPrefix: process.env.SUPABASE_URL ? process.env.SUPABASE_URL.substring(0, 25) : null
  });
});

const adController = require('./controllers/adController');
const couponController = require('./controllers/couponController');
const messageRoutes = require('./routes/messageRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/artisans', artisanRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/coupons', offerRoutes); // Support legacy path for validation
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);

// New Feature Routes
app.get('/api/ads', adController.getActiveAds);



app.use((req, res) => {
  return res.status(404).json({ error: 'Route not found.' });
});

app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  return res.status(500).json({ error: 'Server error.' });
});

module.exports = app;
