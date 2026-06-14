const mongoose = require('mongoose');

const storySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    userName: { type: String, required: true },
    userProfileImage: { type: String, default: '' },
    title: { type: String, default: '' },
    bio: { type: String, default: '' },
    media: [
      {
        url: { type: String, required: true },
        type: { type: String, enum: ['image', 'video'], required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    createdAt: { type: Date, default: Date.now, expires: 86400 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Story', storySchema);
