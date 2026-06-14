const mongoose = require('mongoose');

const artisanSchema = new mongoose.Schema(
  {
    legacyId: { type: Number, unique: true, sparse: true, index: true },
    name: { type: String, required: true },
    category: String,
    image: String,
    rating: Number,
    tagline: String,
    bio: String,
    location: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Artisan', artisanSchema);
