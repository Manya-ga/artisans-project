const mongoose = require('mongoose');

const adSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String, required: true },
    link: { type: String }, // link to product or category
    type: { type: String, enum: ['banner', 'sidebar', 'sponsored'], default: 'banner' },
    position: { type: String, default: 'top' },
    isActive: { type: Boolean, default: true },
    priority: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ad', adSchema);
