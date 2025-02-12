import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    headerImage: { type: String, required: true },
    bodyImages: [{ type: String }], // Array of body images
    category: { type: String, default: 'uncategorized' },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);

export default Post;
