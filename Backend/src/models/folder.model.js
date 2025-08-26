import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', default: null },
    path: { type: String, default: '/' },
  },
  { timestamps: true }
);

schema.index({ owner: 1, parent: 1, name: 1 }, { unique: true });

export default mongoose.model('Folder', schema);
