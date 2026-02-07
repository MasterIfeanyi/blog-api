// validations/authValidation.js
import { body, validationResult } from 'express-validator';

// Sign In validation rules
export const signInValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address')
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .withMessage('Must be a valid email address with format "name@gmail.com"'),
  
  body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 1, max: 50 }).withMessage('Password must be less than 50 characters long')
];

// Sign Up validation rules
export const signUpValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('name is required')
    .matches(/^[a-zA-Z0-9._-]+$/)
    .withMessage('Name can only contain letters, numbers, dots, underscores or dashes')
    .isLength({ min: 4, max: 20 })
    .withMessage('Name must be between 4 and 20 characters long'),

  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address')
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .withMessage('Must be a valid email address with format "name@gmail.com"'),
  
  
  body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6, max: 50 })
    .withMessage('Password must be between 6 and 50 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_-])[A-Za-z\d@$!%*?&#_-]{6,}$/)
    .withMessage('Password must include at least one uppercase letter, one lowercase letter, one number, and one special character'),
];

// Middleware to handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg // Return first error message
    });
  }
  
  next();
};