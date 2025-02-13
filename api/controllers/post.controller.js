import Post from '../models/post.model.js';
import { errorHandler } from '../utils/error.js';
import mongoose from "mongoose"; // ✅ Add this line


export const create = async (req, res, next) => {
  try {
    console.log("🔥 Incoming Request:", req.body); // ✅ Check if headerImage is included
    if (!req.body.title || !req.body.content) {
      return next(errorHandler(400, "Missing title or content"));
    }

    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      slug: req.body.title.toLowerCase().split(" ").join("-"),
      category: req.body.category || "uncategorized",
      headerImage: req.body.headerImage, // ✅ Ensure backend saves the correct image
      userId: req.user?._id || "67ac37bb4d40a958638c0265",
    });

    const savedPost = await newPost.save();
    console.log("✅ Post Created:", savedPost);
    res.status(201).json(savedPost);
  } catch (error) {
    console.error("❌ Error:", error);
    next(error);
  }
};

export const getposts = async (req, res, next) => {
  try {
    console.log("🔹 Received Request:", req.query);

    const startIndex = parseInt(req.query.startIndex) || 0;

    let query = {};

    // ✅ Fetch by `slug` if provided
    if (req.query.slug) {
      query.slug = req.query.slug;
    }

    if (req.query.userId && !req.query.isAdmin) {
      query.userId = new mongoose.Types.ObjectId(req.query.userId);
    }
    if (req.query.postId) {
      query._id = new mongoose.Types.ObjectId(req.query.postId);
    }

    console.log("🔹 Fetching Posts with Query:", query);

    const posts = await Post.find(query)
      .select("_id title slug content category headerImage updatedAt")
      .sort({ updatedAt: -1 })
      .skip(startIndex)

    console.log("✅ Found Posts:", posts.length, posts);
    res.status(200).json({ posts });
  } catch (error) {
    console.error("🔥 Server Error:", error);
    next(error);
  }
};



export const deletepost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this post'));
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json('The post has been deleted');
  } catch (error) {
    next(error);
  }
};


export const updatepost = async (req, res, next) => {
  try {
    if (!req.user.isAdmin && req.user.id !== req.params.userId) {
      return next(errorHandler(403, "🚨 You are not allowed to update this post"));
    }

    console.log("🟢 Updating Post ID:", req.params.postId);

    if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
      return next(errorHandler(400, "🚨 Invalid post ID!"));
    }

    // ✅ Ensure slug is updated if the title changes
    let slug = req.body.slug;
    if (req.body.title) {
      slug = req.body.title
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .split(" ")
        .join("-");
    }

    // ✅ Only update **one specific post** (fixes all posts being overwritten)
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          headerImage: req.body.headerImage,
          media: req.body.media,
          slug, // ✅ Ensure slug is updated
        },
      },
      { new: true } // ✅ Returns the updated post
    );

    if (!updatedPost) {
      return next(errorHandler(404, "🚨 Post not found!"));
    }

    console.log("✅ Post Updated Successfully:", updatedPost);
    res.status(200).json(updatedPost); // ✅ Send the correct post back
  } catch (error) {
    console.error("🔥 Server Error:", error);
    next(error);
  }
};
