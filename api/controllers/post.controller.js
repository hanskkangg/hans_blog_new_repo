import Post from '../models/post.model.js';
import { errorHandler } from '../utils/error.js';
import mongoose from "mongoose"; // ✅ Add this line
import Comment from '../models/comment.model.js'; // ✅ Import Comment model

let sortOption = { createdAt: -1 }; // Default: Latest posts first
// create controller in post.controller.js
export const create = async (req, res, next) => {
  try {
    console.log("🔥 Incoming Request Body:", req.body);
    console.log("🔍 User from Request:", req.user); // ✅ Add this log

    if (!req.body.title || !req.body.content) {
      console.error("🚨 Missing required fields: title or content");
      return next(errorHandler(400, "Missing title or content"));
    }

    if (!req.user || !req.user.id) {
      console.error("🚨 Unauthorized: No user ID found in request");
      return next(errorHandler(403, "Unauthorized! Please log in to create a post."));
    }

    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      slug: req.body.slug || req.body.title.toLowerCase().replace(/\s+/g, "-"),
      category: req.body.category || "uncategorized",
      headerImage: req.body.headerImage,
      userId: req.user.id, 
    });

    const savedPost = await newPost.save();
    console.log("✅ Post Created Successfully:", savedPost);

    res.status(201).json(savedPost);
  } catch (error) {
    console.error("❌ Error in create controller:", error.message);
    next(error);
  }
};
export const getposts = async (req, res, next) => {
  try {
    console.log("🔹 Received Request:", req.query);

    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;

    let query = {};

    if (req.query.searchTerm) {
      query.$or = [
        { title: { $regex: req.query.searchTerm, $options: "i" } },
        { content: { $regex: req.query.searchTerm, $options: "i" } }
      ];
    }

    if (req.query.slug) {
      query.slug = req.query.slug;
    }

    if (req.query.category && req.query.category !== "all") {
      query.category = req.query.category;
    }

    if (req.query.userId && !req.query.isAdmin) {
      query.userId = new mongoose.Types.ObjectId(req.query.userId);
    }

    if (req.query.postId) {
      query._id = new mongoose.Types.ObjectId(req.query.postId);
    }

    console.log("🔹 Fetching Posts with Query:", query);

    let sortOption = { createdAt: -1 }; // Default to latest
    if (req.query.sort === "asc") {
      sortOption = { createdAt: 1 };
    } else if (req.query.sort === "most-liked") {
      sortOption = { likesCount: -1 };
    } else if (req.query.sort === "most-viewed") {
      sortOption = { views: -1 };
    }

    // 🔥 Calculate Last Month Date
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    // ✅ Calculate total posts and last month posts
    const totalPosts = await Post.countDocuments(query);
    const lastMonthPosts = await Post.countDocuments({
      ...query,
      createdAt: { $gte: lastMonth },
    });

    console.log("📅 Last Month Posts Count:", lastMonthPosts);

    const posts = await Post.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "authorData",
        },
      },
      {
        $lookup: {
          from: "comments", 
          localField: "_id",
          foreignField: "postId",
          as: "commentsData",
        },
      },
      {
        $addFields: {
          author: { $ifNull: [{ $arrayElemAt: ["$authorData.username", 0] }, "Unknown"] },
          authorEmail: { $ifNull: [{ $arrayElemAt: ["$authorData.email", 0] }, ""] },
          likesCount: { $size: { $ifNull: ["$likes", []] } },
          views: { $ifNull: ["$views", 0] },
          commentsCount: { $size: { $ifNull: ["$commentsData", []] } },
        },
      },
      { $sort: sortOption },
      { $skip: startIndex },
      { $limit: limit },
    ]);

    console.log("✅ Found Posts:", posts.length, "Total Posts:", totalPosts);
    res.status(200).json({ posts: posts || [], totalPosts, lastMonthPosts });
  } catch (error) {
    console.error("🔥 Server Error in getposts:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};


export const likePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id; // ✅ Get user ID from token

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return next(errorHandler(400, "🚨 Invalid post ID!"));
    }

    if (!userId) {
      return next(errorHandler(401, "🚨 Unauthorized! Please log in."));
    }

    console.log(`❤️ User ${userId} is trying to like Post ID: ${postId}`);

    const post = await Post.findById(postId);
    if (!post) {
      return next(errorHandler(404, "🚨 Post not found!"));
    }

    if (!post.likes) {
      post.likes = [];
    }

    const hasLiked = post.likes.includes(userId);

    if (hasLiked) {
      // ✅ Unlike the post if the user has already liked it
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      // ✅ Add user ID to likes array if they haven't liked the post yet
      post.likes.push(userId);
    }

    await post.save();

    console.log(`✅ Updated Likes: ${post.likes.length}`);
    res.status(200).json({
      success: true,
      likes: post.likes.length,
      likedByUser: !hasLiked, // ✅ Return if user liked or unliked the post
    });
  } catch (error) {
    console.error("🔥 Like Error:", error);
    next(error);
  }
};

export const incrementViews = async (req, res, next) => {
  try {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return next(errorHandler(400, "🚨 Invalid post ID!"));
    }

    console.log(`👁️ Incrementing view count for Post ID: ${postId}`);

    // ✅ Find the post and increment views **without updating `updatedAt`**
    const post = await Post.findByIdAndUpdate(
      postId,
      { $inc: { views: 1 } }, // 🔥 Increment view count only
      { new: true, timestamps: false } // ✅ Prevent `updatedAt` from updating
    );

    if (!post) {
      return next(errorHandler(404, "🚨 Post not found!"));
    }

    console.log(`✅ Updated views: ${post.views}`);
    res.status(200).json({ success: true, views: post.views });
  } catch (error) {
    console.error("🔥 View Count Error:", error);
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
    const { postId, userId } = req.params;
    console.log("🟢 Received UPDATE request for Post ID:", postId, "by User ID:", userId);
    console.log("🔹 Request Body:", req.body);

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      console.log("🚨 Invalid Post ID:", postId);
      return res.status(400).json({ error: "🚨 Invalid post ID!" });
    }

    const existingPost = await Post.findById(postId);
    if (!existingPost) {
      console.log("🚨 Post not found:", postId);
      return res.status(404).json({ error: "🚨 Post not found!" });
    }

    if (!req.user || (!req.user.isAdmin && req.user.id !== userId)) {
      console.log("🚨 Unauthorized attempt by User ID:", userId);
      return res.status(403).json({ error: "🚨 You are not allowed to update this post!" });
    }

    let slug = existingPost.slug;
    if (req.body.title && req.body.title !== existingPost.title) {
      slug = req.body.title.trim().toLowerCase().replace(/\s+/g, "-");
      const slugExists = await Post.findOne({ slug });

      if (slugExists && slugExists._id.toString() !== existingPost._id.toString()) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    console.log("🔹 Updating Post with slug:", slug);

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $set: {
          title: req.body.title || existingPost.title,
          content: req.body.content || existingPost.content,
          category: req.body.category || existingPost.category,
          headerImage: req.body.headerImage || existingPost.headerImage,
          slug,
        },
      },
      { new: true }
    ).populate("userId", "username email"); // ✅ Populate author information

    console.log("✅ Successfully Updated Post:", updatedPost);
    return res.status(200).json(updatedPost);
  } catch (error) {
    console.error("🔥 Server Error in updatepost:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};


export const getpost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    console.log("🟢 Received GET request for postId:", postId);

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      console.log("🚨 Invalid postId format:", postId);
      return res.status(400).json({ error: "🚨 Invalid post ID format!" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      console.log("🚨 No post found with ID:", postId);
      return res.status(404).json({ error: "🚨 Post not found!" });
    }

    const responseData = { success: true, post };
    console.log("🔹 Sending Response:", JSON.stringify(responseData, null, 2));

    return res.status(200).json(responseData);
  } catch (error) {
    console.error("🔥 Server Error in `getpost`:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};
