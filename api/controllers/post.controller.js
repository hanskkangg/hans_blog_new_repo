import Post from '../models/post.model.js';
import { errorHandler } from '../utils/error.js';

export const create = async (req, res, next) => {
  try {
    console.log("🔹 Incoming Request Body:", req.body);

    if (!req.body.title || !req.body.content) {
      console.error("🚨 Missing required fields!");
      return next(errorHandler(400, "Please provide all required fields"));
    }

    // ✅ Fix: Convert category to lowercase and check valid values
    const validCategories = ["uncategorized", "technology", "business", "health", "sports", "javascript", "reactjs", "nextjs"];
    let category = req.body.category.trim().toLowerCase();

    if (!validCategories.includes(category)) {
      console.warn(`🚨 Invalid category "${category}", setting to default.`);
      category = "uncategorized";
    }

    const slug = req.body.title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "");

    const newPost = new Post({
      ...req.body,
      category, // ✅ Ensures a valid category is saved
      slug,
      userId: req.body.userId || "660000000000000000000000", // ✅ Fallback Admin ID
    });

    console.log("✅ Saving post to database...");
    const savedPost = await newPost.save();
    console.log("🎉 Post Created Successfully:", savedPost);

    res.status(201).json(savedPost);
  } catch (error) {
    console.error("🔥 Server Error:", error);
    next(error);
  }
};
export const getposts = async (req, res, next) => {
  try {
    console.log("🔹 Received Request from User ID:", req.query.userId); // ✅ Debugging Line

    const query = {};

    if (req.query.userId) {
      query.userId = req.query.userId;
    }

    console.log("🔹 Fetching Posts with Query:", query); // ✅ Debugging Line

    const posts = await Post.find(query)
      .sort({ updatedAt: -1 })
      .limit(9);

    console.log("✅ Found Posts:", posts.length, posts); // ✅ Debugging Line

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

// 🔹 UPDATE POST (Supports Title, Content, Category, and Media Updates)
export const updatepost = async (req, res, next) => {
  try {
    if (!req.user.isAdmin && req.user.id !== req.params.userId) {
      return next(errorHandler(403, "You are not allowed to update this post"));
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          headerImage: req.body.headerImage,
          media: req.body.media, // Handles multiple media updates
        },
      },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};