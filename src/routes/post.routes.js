import express from 'express';
import handleAsyncErr from '../utils/catchAsync.js'
const router = express.Router();
import {body} from 'express-validator'
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getMyPosts
} = require('../controllers/postController');



// Validation rules
const createPostValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title cannot be more than 200 characters'),
  body('content')
    .trim()
    .notEmpty().withMessage('Content is required'),
  body('status')
    .optional()
    .isIn(['draft', 'published']).withMessage('Status must be either draft or published'),
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array')
];




const updatePostValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Title cannot be empty')
    .isLength({ max: 200 }).withMessage('Title cannot be more than 200 characters'),
  body('content')
    .optional()
    .trim()
    .notEmpty().withMessage('Content cannot be empty'),
  body('status')
    .optional()
    .isIn(['draft', 'published']).withMessage('Status must be either draft or published'),
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array')
];




// Public routes
router.get('/', getPosts);
router.get('/:id', getPost);


// Protected routes
router.post('/', protect, createPostValidation, validate, handleAsyncErr(createPost));
router.put('/:id', protect, updatePostValidation, validate, handleAsyncErr(updatePost));
router.delete('/:id', protect, deletePost);
router.get('/user/my-posts', protect, getMyPosts);




export default router;