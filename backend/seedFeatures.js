const mongoose = require('mongoose');
const Ad = require('./src/models/Ad');
const Coupon = require('./src/models/Coupon');
require('dotenv').config();

async function seedFeatures() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/artisan-connect');
  
  await Ad.deleteMany({});
  await Ad.create([
    {
      title: 'Monsoon Magic: 40% OFF',
      description: 'Exclusive handmade pottery and ceramics for your home.',
      imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=1200',
      type: 'banner',
      isActive: true,
      priority: 10
    },
    {
      title: 'New Artisan Drops',
      description: 'Discover the latest work from our master weavers.',
      imageUrl: 'https://images.unsplash.com/photo-1590736961958-51fdc62bad13?auto=format&fit=crop&q=80&w=1200',
      type: 'banner',
      isActive: true,
      priority: 5
    }
  ]);

  await Coupon.deleteMany({});
  await Coupon.create([
    {
      code: 'WELCOME50',
      discountType: 'percentage',
      discountValue: 50,
      minOrderAmount: 100,
      maxDiscountAmount: 500,
      expiryDate: new Date('2026-12-31'),
      isActive: true
    },
    {
      code: 'ZEPTO',
      discountType: 'flat',
      discountValue: 100,
      minOrderAmount: 300,
      expiryDate: new Date('2026-12-31'),
      isActive: true
    }
  ]);

  console.log('Features seeded successfully');
  process.exit();
}

seedFeatures();
