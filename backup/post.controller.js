import Post from '../api/models/post.model.js';
import { errorHandler } from '../api/utils/error.js';

export const create = async (req, res, next) => {
  try {
    // Ensure user is authorized to create a post
    if (!req.user || !req.user.isAdmin) {
      return next(errorHandler(403, 'You are not allowed to create a post'));
    }

    // Validate required fields
    const { title, content, headerImage, bodyImages } = req.body;
    if (!title || !content || !headerImage) {
      return next(errorHandler(400, 'Please provide title, content, and header image.'));
    }

    // Generate slug from title
    const slug = title
      .split(' ')
      .join('-')
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, '');

    // Create new post
    const newPost = new Post({
      title,
      content,
      headerImage,
      bodyImages: bodyImages || [],
      category: req.body.category || 'uncategorized',
      slug,
      userId: req.user.id,
    });

    // Save post to database
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);

  } catch (error) {
    console.error('Error creating post:', error);
    next(errorHandler(500, 'Something went wrong while creating the post.'));
  }
};
