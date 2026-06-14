const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    legacyId: { type: Number, unique: true, sparse: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    image: String,
    images: [String],
    category: String,
    artisanName: String,
    artisanImage: String,
    artisanLocation: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
