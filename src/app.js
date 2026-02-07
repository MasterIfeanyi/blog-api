import dotenv from 'dotenv';
import express from 'express';
import corsMiddleware from './middleware/cors.js';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { apiLimiter } from './middleware/rateLimiter.js';
import throttle from './middleware/throttle.js';
import isLoggedin from './utils/isLoggedin.js';

import userRoutes from './routes/user.routes.js';


import errorHandler from './middleware/errorHandler.js';
import httpLogger from './middlewares/httpLogger.js';


// Load environment variables if not in production
dotenv.config();

// Initialize Express application
const app = express();


// Use Morgan for logging HTTP requests
app.use(httpLogger);

// Use the CORS middleware
app.use(corsMiddleware);

app.options('*', corsMiddleware);

app.use(throttle); 
app.use('/api/', apiLimiter);


// To parse incoming JSON in POST request body
app.use(express.json({ limit: '2mb' }));

// To parse form data in POST request body
app.use(express.urlencoded({ extended: true }));

// Use cookieParser middleware
app.use(cookieParser());

// Initialize Passport for authentication
app.use(passport.initialize());

// public routes
app.use('/api/posts', postRoutes); 
app.use('/api/auth', userRoutes);


// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

//Authenticate Routes Below this middleware
app.use(isLoggedin);


// Error handling middleware
app.use(errorHandler);


export default app;
