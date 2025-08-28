import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
    },
    cloudinaryId: {
      type: String,
      required: true,
    },
    folder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Folder',
      required: true,
      index: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    size: {
      type: Number,
    },
    mimeType: {
      type: String,
    },
    tags: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for efficient searching
imageSchema.index({ owner: 1, name: 'text' });
imageSchema.index({ owner: 1, folder: 1 });

export default mongoose.model('Image', imageSchema);
