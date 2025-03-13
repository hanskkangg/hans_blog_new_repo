import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["uncategorized","all", 'NHL', 'PWHL', 'Kang you believe it?', 'Kangs trade hops', 'Hop to the Future: Rookies', 'Kang in the crease'],
      default: "uncategorized",
    },
    headerImage: {
      type: String,
      default: "https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png",
    },
    media: [
      {
        url: { type: String, required: true },
        type: { type: String, enum: ["image", "video"], required: true },
      },
    ],
    views: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
