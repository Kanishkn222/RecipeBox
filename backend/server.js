import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import userRoutes from './routes/userRoutes.js';
import feedRoutes from './routes/feedRoutes.js';
import cookbookRoutes from './routes/cookbookRoutes.js';
import mealPlannerRoutes from './routes/mealPlannerRoutes.js';

// Middleware Imports
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load Environment Variables
dotenv.config();

// Establish Database Connection
connectDB();

const app = express();

const allowedOrigins = [
  process.env.CLIENT_ORIGIN,
  'https://recipebox-site.netlify.app',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || /^http:\/\/localhost:\d+$/.test(origin) || /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Simple Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'RecipeBox Backend API is running smoothly' });
});

// Mounting API Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/cookbooks', cookbookRoutes);
app.use('/api/meals', mealPlannerRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = Number(process.env.PORT || 5000);

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.warn(`[Server Error] Port ${port} is in use, trying port ${port + 1}...`);
      setTimeout(() => startServer(port + 1), 500);
    } else {
      console.error('[Server Error]', error);
    }
  });
};

startServer(PORT);

