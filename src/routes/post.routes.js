import express from 'express';
import handleAsyncErr from '../utils/catchAsync.js'
const router = express.Router();

const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getPostsWithFilter
} = require('../controllers/postController');
import { createPostValidation, updatePostValidation } from '../validators/postValidation.js';


// Public routes
router.get('/', handleAsyncErr(getPosts));
router.get('/:slug', handleAsyncErr(getPost));


// Protected routes
router.post('/', protect, createPostValidation, validate, handleAsyncErr(createPost));
router.put('/:id', protect, updatePostValidation, validate, handleAsyncErr(updatePost));
router.delete('/:id', protect, handleAsyncErr(deletePost));


export default router;