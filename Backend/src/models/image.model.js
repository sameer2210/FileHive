import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    folder: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', required: true },
    public_id: { type: String, required: true }, // Cloudinary id
    url: { type: String, required: true },
    size: { type: Number },
    contentType: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Image', schema);
