import Post from '../models/post.model.js';
import { errorHandler } from '../utils/error.js';
import mongoose from "mongoose"; // ✅ Add this line
import Comment from '../models/comment.model.js'; // ✅ Import Comment model

let sortOption = { createdAt: -1 }; // Default: Latest posts first


export const create = async (req, res, next) => {
  try {
    console.log("🔥 Incoming Request:", req.body);

    if (!req.body.title || !req.body.content) {
      return next(errorHandler(400, "Missing title or content"));
    }

    const slug = req.body.title
      .toLowerCase()
      .trim()
      .replace(/[^a-zA-Z0-9 ]/g, "") // Remove special characters
      .replace(/\s+/g, "-"); // Replace spaces with `-`

    console.log("🔹 Generated Slug:", slug); // ✅ Debugging the slug

    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      slug: slug,
      category: req.body.category || "uncategorized",
      headerImage: req.body.headerImage,
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

    // ✅ Apply correct sorting based on query parameter
    let sortOption = { createdAt: -1 }; // Default: Latest posts first

    if (req.query.sort === "asc") {
      sortOption = { createdAt: 1 }; // ✅ Oldest first
    } else if (req.query.sort === "most-liked") {
      sortOption = { likesCount: -1 }; // ✅ Most liked
    } else if (req.query.sort === "most-viewed") {
      sortOption = { views: -1 }; // ✅ Most viewed
    }

    let aggregationPipeline = [
      { $match: query }, 
      {
        $lookup: {
          from: "users",  // ✅ Populate the author name
          localField: "userId",
          foreignField: "_id",
          as: "authorData",
        }
      },
      {
        $lookup: {
          
          from: "comments",
          localField: "_id",
          foreignField: "postId",
          as: "commentsData",
        }
      },
      {
        $addFields: {
          likesCount: { 
            $cond: { 
              if: { $isArray: "$likes" }, 
              then: { $size: "$likes" }, 
              else: 0 
            }
          },
          commentsCount: { $size: "$commentsData" }
          ,
          author: { $arrayElemAt: ["$authorData.username", 0] } // ✅ Extract the author's name
       
        }
      },
      { $sort: sortOption }, // ✅ Apply corrected sorting
      { $skip: startIndex },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          title: 1,
          slug: 1,
          content: 1,
          category: 1,
          headerImage: 1,
          updatedAt: 1,
          createdAt: 1,
          views: 1,
          likesCount: 1,  
          commentsCount: 1,
          author: 1,  // ✅ Ensure the author's name is included in the response
        },
      }
    ];

    const totalPosts = await Post.countDocuments(query);
    const posts = await Post.aggregate(aggregationPipeline);

    console.log("✅ Found Posts:", posts.length, "Total Posts:", totalPosts);
    res.status(200).json({ posts, totalPosts });
  } catch (error) {
    console.error("🔥 Server Error:", error.message);
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
    if (!req.user.isAdmin && req.user.id !== req.params.userId) {
      return next(errorHandler(403, "🚨 You are not allowed to update this post"));
    }

    console.log("🟢 Updating Post ID:", req.params.postId);

    if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
      return next(errorHandler(400, "🚨 Invalid post ID!"));
    }

    const existingPost = await Post.findById(req.params.postId);
    if (!existingPost) {
      return next(errorHandler(404, "🚨 Post not found!"));
    }

    let slug = existingPost.slug; // ✅ Keep the existing slug

    // ✅ If the title changes, generate a new slug
    if (req.body.title && req.body.title !== existingPost.title) {
      slug = req.body.title
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .replace(/\s+/g, "-");

      // ✅ Check if the new slug already exists
      const slugExists = await Post.findOne({ slug });
      if (slugExists && slugExists._id.toString() !== existingPost._id.toString()) {
        return next(errorHandler(400, "🚨 Slug already exists! Choose a different title."));
      }
    }

    // ✅ Update post without changing `updatedAt` when only views are modified
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title || existingPost.title,
          content: req.body.content || existingPost.content,
          category: req.body.category || existingPost.category,
          headerImage: req.body.headerImage || existingPost.headerImage,
          media: req.body.media || existingPost.media,
          slug, // ✅ Keep or update the slug
        },
      },
      { new: true }
    );

    console.log("✅ Post Updated Successfully:", updatedPost);
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("🔥 Server Error:", error);
    next(error);
  }
};
