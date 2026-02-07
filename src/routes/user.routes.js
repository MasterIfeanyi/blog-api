import express from 'express';
import handleAsyncErr from '../utils/catchAsync.js'
const router = express.Router();
import { signInUser, signUpUser, logOutUser, refreshToken } from '../controllers/user.controller.js';
import { signInLimiter, signUpLimiter } from '../middleware/rateLimiter.js';
import { signInValidation, signUpValidation } from '../validations/authValidation.js'


// Signup post route
router.post("/signup", signUpValidation, signUpLimiter, handleAsyncErr(signUpUser));

// POST login route
router.post("/signin", signInValidation, signInLimiter, handleAsyncErr(signInUser));

// POST /logout route
router.post("/logout", handleAsyncErr(logOutUser));

//Refresh Token
router.post("/token", handleAsyncErr(refreshToken));


export default router;