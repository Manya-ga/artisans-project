const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const User = require('./src/models/User');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/artisanDB').then(async () => {
  const result = await User.updateMany(
    { emailVerified: { $ne: true } },
    { $set: { emailVerified: true } }
  );
  console.log('[Migration] Marked', result.modifiedCount, 'existing users as verified');
  process.exit(0);
}).catch(err => { console.error(err); process.exit(1); });
