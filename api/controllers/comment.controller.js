import Comment from '../models/comment.model.js';
import Post from '../models/post.model.js';
import User from '../models/user.model.js';

export const getcomments = async (req, res, next) => {
  if (!req.user.isAdmin)
    return next(errorHandler(403, 'You are not allowed to get all comments'));

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;

    // Calculate last month's date rangess
    const currentDate = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    // Count total comments
    const totalComments = await Comment.countDocuments();

    // Count comments created in the last month
    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: lastMonth, $lt: currentDate },
    });

    // Fetch latest comments
    const comments = await Comment.find()
     //Newest comments first
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .populate("userId", "username email") 
      .populate("postId", "title slug");

    res.status(200).json({ comments, totalComments, lastMonthComments });
  } catch (error) {
    console.error(" Error fetching comments:", error);
    next(error);
  }
};

export const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;

    if (userId !== req.user.id) {
      return next(
        errorHandler(403, 'You are not allowed to create this comment')
      );
    }

    const newComment = new Comment({
      content,
      postId,
      userId,
    });
    await newComment.save();

    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};


export const getPostComments = async (req, res, next) => {
  try { // Default to most liked
    const sortOption = req.query.sort || "most-liked";
    let sortQuery = { createdAt: 1 };
        // Sort by newest first
    if (sortOption === "newest") {
        sortQuery = { createdAt: -1 }; 
        // Sort by oldest first 
    } else if (sortOption === "oldest") {
        sortQuery = { createdAt: 1 }; 
    }

    const postId = req.params.postId;

    // Fetch the top 3 most liked comments with at least 1 like
    const mostLikedComments = await Comment.find({ postId, numberOfLikes: { $gt: 0 } })
      .sort({ numberOfLikes: -1, createdAt: -1 })
      .limit(3)
      .populate("userId", "username email profilePicture")
      .lean();

    // Fetch remaining comments based on the selected sort option, excluding the most liked ones
    const mostLikedCommentIds = mostLikedComments.map(comment => comment._id.toString());

    const otherComments = await Comment.find({
        postId,
        _id: { $nin: mostLikedCommentIds }
      })
      .sort(sortQuery)
      .populate("userId", "username email profilePicture")
      .lean();

    // Mark only comments with likes as "Most Liked"
    mostLikedComments.forEach(comment => {
        if (comment.numberOfLikes > 0) {
            comment.isMostLiked = true;
        }
    });

    // Combine and return the final list
    const combinedComments = [...mostLikedComments, ...otherComments];

    res.status(200).json(combinedComments);
  } catch (error) {
    console.error("Error fetching sorted comments:", error);
    next(error);
  }
};


export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, 'Comment not found'));
    }
    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};
export const editComment = async (req, res, next) => {
  try {
    console.log("Editing comment: ", req.params.commentId);
    console.log("Received User ID: ", req.user.id);
    
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      console.log("Comment not found");
      return next(errorHandler(404, 'Comment not found'));
    }

    console.log("Comment User ID: ", comment.userId.toString());

    if (comment.userId.toString() !== req.user.id.toString() && !req.user.isAdmin) {
      console.log("Unauthorized");
      return next(errorHandler(403, 'You are not allowed to edit this comment'));
    }

    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      { content: req.body.content },
      { new: true }
    );

    console.log("Successfully updated comment: ", editedComment);
    res.status(200).json(editedComment);
  } catch (error) {
    console.log("Error editing comment:", error);
    next(error);
  }
};


export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, 'Comment not found'));
    }
    if (comment.userId.toString() !== req.user.id.toString() && !req.user.isAdmin) {
      return next(errorHandler(403, 'You are not allowed to edit this comment'));
    }
    
    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json('Comment has been deleted');
  } catch (error) {
    next(error);
  }
};
export const getUserComments = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    if (!userId) return next(errorHandler(400, 'User ID is required'));

    // Handle pagination parameters
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;

    console.log("📦 Pagination Params - Start Index:", startIndex, "Limit:", limit);

    // Fetch comments with pagination and populate the related post data
    const comments = await Comment.find({ userId })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .populate("postId", "title slug");

    // Count total comments by the user for pagination control
    const totalComments = await Comment.countDocuments({ userId });

    res.status(200).json({ comments, totalComments });
  } catch (error) {
    console.error("🔥 Error fetching user comments:", error);
    next(error);
  }
};

