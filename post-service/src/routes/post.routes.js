import express from 'express';
import { createPost, deletePost, getAllPosts, getPost } from '../controllers/post.controller.js';
import { authenticateRequest } from '../middleware/auth.middleware.js';

const router = express.Router();

// authenticate user request middleware
router.use(authenticateRequest);

router.post('/create-post' , createPost);
router.get('/all-posts' , getAllPosts);
router.get('/:id' , getPost);
router.delete('/:id' , deletePost);

export default router;

