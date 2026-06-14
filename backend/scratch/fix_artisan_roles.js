const mongoose = require('mongoose');
require('dotenv').config({path:'./.env'});
const Product = require('../src/models/Product');
const User = require('../src/models/User');

async function fixArtisanRoles() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/artisanDB');
    console.log('Connected to DB');

    const productUserIds = await Product.distinct('userId');
    console.log('Found userIds with products:', productUserIds.length);

    const result = await User.updateMany(
      { _id: { $in: productUserIds } },
      { $set: { role: 'artisan' } }
    );
    
    console.log('Users found to update:', result.matchedCount);
    console.log('Users successfully updated to artisan:', result.modifiedCount);

    process.exit(0);
  } catch (err) {
    console.error('Error during role fix:', err);
    process.exit(1);
  }
}

fixArtisanRoles();
