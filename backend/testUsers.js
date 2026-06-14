require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const connectDB = require('./src/config/db');

connectDB().then(async () => {
  const users = await User.find({});
  console.log("Total users:", users.length);
  users.forEach(u => console.log(u._id, u.displayName, u.email));
  process.exit(0);
}).catch(console.error);
