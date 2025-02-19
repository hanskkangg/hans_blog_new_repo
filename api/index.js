import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';

dotenv.config();

const app = express();
const __dirname = path.resolve();
const PORT = process.env.PORT || 3000;

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('🔥 MongoDB Connection Error:', err));

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ API Logger
app.use((req, res, next) => {
  console.log(`🟢 ${req.method} ${req.url}`);
  next();
});

// ✅ Register API Routes First
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);

// ✅ Handle API Route Not Found
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'API Route Not Found' });
});

// ✅ Serve Static Files (React Frontend) Only If API Routes Fail
app.use(express.static(path.join(__dirname, '/client/dist')));

// ✅ Ensure API Routes Are Not Overwritten by React Routes
app.get('*', (req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API Route Not Found' });
  }
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error('🔥 Global Error:', err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ✅ Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
