import { User } from '../models/user.model.js'
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from '../auth/auth.js'
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { refreshSecretKey } from '../auth/config.js';
import { signUpSchema, signInSchema } from '../validators/authValidators.js';
import { setRefreshToken, setAccessToken, removeAccessToken, removeRefreshToken } from '../utils/authCookies.js';
import axios from 'axios'


//Sign Up Controller Function
export const signUpUser = async (req, res) => {
  const { email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(409).json({ 
      success: false,
      message: 'User with this email already exists' 
    });
  }

  // Create a new user
  const newUser = new User({
    email,
    password: hashedPassword
  });

  // Save the user to the database
  await newUser.save();

  // Generate tokens
  const accessToken = generateAccessToken(newUser);
  const refreshToken = generateRefreshToken(newUser);

  // Set cookies
  setAccessToken(res, accessToken);
  setRefreshToken(res, refreshToken);

  // Respond with success message
  res.status(200).json({ 
    success: true,
    message: 'User registered successfully',
    data: {
      email: newUser.email
    }
  });
}

//Sign In Controller Function
export const signInUser = async (req, res) => {
  // No need for validation here - it's already handled by middleware
  
  const { email, password } = req.body;

  // Check if the user exists by their email
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ 
      success: false,
      message: 'User not found' 
    });
  }

  // Compare the provided password with the hashed password in the database
  const passwordMatch = await user.comparePassword(password);

  if (passwordMatch) {
    // Passwords match, generate JWT token
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    //set cookies
    setAccessToken(res, accessToken);
    setRefreshToken(res, refreshToken);

    return res.status(200).json({ 
      success: true,
      message: 'Sign In successful', 
      data: {
        email: user.email 
      }
    });
  } else {
    // Passwords don't match
    return res.status(400).json({ 
      success: false,
      message: 'Invalid email or password', 
      code: 'INVALID_EMAIL_OR_PASSWORD' 
    });
  }
}


//Log out Controller Function
export const logOutUser = async (req, res) => {
    removeRefreshToken(res);
    removeAccessToken(res);
    res.status(200).json({ message: 'Logged out successfully' });
}

//Refresh token controller function
export const refreshToken = (req, res) => {
    const refreshToken = req.cookies?.refreshToken;

    // Check if refreshToken is present in cookies
    if (!refreshToken) return res.status(401).json(
        {
            message: 'You dont have the permission for this, Please log in.',
            code: 'REFRESH_TOKEN_NOT_FOUND'
        });


    // Verify the refresh token
    jwt.verify(refreshToken, refreshSecretKey, (err, user) => {
        if (err) return res.status(403).json({ message: 'Session timed out. Please log in again.' });

        // Generate a new access token
        const accessToken = generateAccessToken({ email: user.email, _id: user._id });

        // Set the new access token in the cookies
        setAccessToken(res, accessToken);

        return res.status(200).json({ message: 'Access token refreshed successfully' });
    });
};
