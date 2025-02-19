import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create, deletepost, getposts, updatepost, incrementViews,likePost,getpost } from '../controllers/post.controller.js';

const router = express.Router();

router.post('/create', create)
router.get('/getposts', getposts)
router.delete('/deletepost/:postId/:userId', verifyToken, deletepost)
router.put('/updatepost/:postId/:userId', verifyToken, updatepost)
router.put('/increment-views/:postId', incrementViews); // ✅ API to increase views
router.put("/like/:postId", verifyToken, likePost);
// ✅ Fetch a single post by ID
router.get('/getpost/:postId', getpost); // Fetch a single post by ID (this is important)




export default router;