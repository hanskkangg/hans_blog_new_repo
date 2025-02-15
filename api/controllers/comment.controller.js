import Comment from '../models/comment.model.js';
import Post from '../models/post.model.js';
import User from '../models/user.model.js';

export const getcomments = async (req, res, next) => {
  if (!req.user.isAdmin)
    return next(errorHandler(403, 'You are not allowed to get all comments'));

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;

    // ✅ Calculate last month's date rangess
    const currentDate = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    // ✅ Count total comments
    const totalComments = await Comment.countDocuments();

    // ✅ Count comments created in the last month
    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: lastMonth, $lt: currentDate },
    });

    // ✅ Fetch latest comments
    const comments = await Comment.find()
      .sort({ createdAt: -1 }) // 🔥 Newest comments first
      .skip(startIndex)
      .limit(limit)
      .populate("userId", "username email") // ✅ Populate user info
      .populate("postId", "title slug");

    res.status(200).json({ comments, totalComments, lastMonthComments });
  } catch (error) {
    console.error("🔥 Error fetching comments:", error);
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
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (error) {
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
    console.log("🔍 Editing comment: ", req.params.commentId);
    console.log("📌 Received User ID: ", req.user.id);
    
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      console.log("❌ Comment not found");
      return next(errorHandler(404, 'Comment not found'));
    }

    console.log("✅ Comment User ID: ", comment.userId.toString());

    if (comment.userId.toString() !== req.user.id.toString() && !req.user.isAdmin) {
      console.log("🚫 Unauthorized");
      return next(errorHandler(403, 'You are not allowed to edit this comment'));
    }

    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      { content: req.body.content },
      { new: true }
    );

    console.log("✅ Successfully updated comment: ", editedComment);
    res.status(200).json(editedComment);
  } catch (error) {
    console.log("🔥 Error editing comment:", error);
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

    const comments = await Comment.find({ userId }).sort({ createdAt: -1 }).populate("postId", "title");
    
    res.status(200).json({ comments });
  } catch (error) {
    next(error);
  }
};
