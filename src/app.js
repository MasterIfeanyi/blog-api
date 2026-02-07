import dotenv from 'dotenv';
import express from 'express';
import corsMiddleware from './middleware/cors.js';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { apiLimiter } from './middleware/rateLimiter.js';
import throttle from './middleware/throttle.js';
import morgan from 'morgan';
import isLoggedin from './utils/isLoggedin.js';

import userRoutes from './routes/user.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import cartRoutes from './routes/cart.routes.js';
import orderRoutes from './routes/order.routes.js';
import favouriteProductRoutes from './routes/favoriteProduct.routes.js';
import productRoutes from './routes/product.routes.js'

import errorHandler from './middleware/errorHandler.js';
import httpLogger from './middlewares/httpLogger.js';


// Load environment variables if not in production
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

// Initialize Express application
const app = express();


// Use Morgan for logging HTTP requests
app.use(httpLogger);

// Use the CORS middleware
app.use(corsMiddleware);

app.options('*', corsMiddleware);

// To parse incoming JSON in POST request body
app.use(express.json({ limit: '2mb' }));

// To parse form data in POST request body
app.use(express.urlencoded({ extended: true }));

// Use cookieParser middleware
app.use(cookieParser());

// Initialize Passport for authentication
app.use(passport.initialize());


// Authentication-related routes
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
