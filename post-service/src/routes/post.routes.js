import express from 'express';
import { createPost, deletePost, getAllPosts, getPost } from '../controllers/post.controller.js';
import { authenticateRequest } from '../middleware/auth.middleware.js';

const router = express.Router();

// authenticate user request middleware
router.use(authenticateRequest);

router.post('/create-post' , createPost);
router.post('/all-posts' , getAllPosts);
router.post('/:id' , getPost);
router.post('/:id' , deletePost);

export default router;

