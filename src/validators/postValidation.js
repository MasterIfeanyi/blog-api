import {body} from 'express-validator'

// Validation rules
export const createPostValidation = [
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




export const updatePostValidation = [
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
