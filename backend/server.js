const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const storeRoutes = require('./routes/stores');
const productRoutes = require('./routes/products');
const walletRoutes = require('./routes/wallet');
const orderRoutes = require('./routes/orders');
const supportRoutes = require('./routes/support');
const adminRoutes = require('./routes/admin');
const reviewRoutes = require('./routes/reviews');
const notificationRoutes = require('./routes/notifications');
const { connectDB } = require('./config/database');
const WalletService = require('./services/walletService');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil(15 * 60) // seconds
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

// Auth rate limiting (more restrictive)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 20 : 5, // More lenient in development
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP, please try again later.',
    retryAfter: Math.ceil(15 * 60) // seconds
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Test database connection
connectDB();

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  // Start background deposit monitor: check every 10 minutes for paid deposits
  const walletService = new WalletService();
  const intervalMs = parseInt(process.env.DEPOSIT_CHECK_INTERVAL_MS || '600000'); // 10 minutes default
  console.log(`Starting deposit verification background job - checking every ${intervalMs / 1000} seconds`);
  
  setInterval(async () => {
    try {
      const outcomes = await walletService.verifyPendingDepositIntents();
      if (outcomes.length > 0) {
        console.log(`[${new Date().toISOString()}] Deposit verification completed - processed ${outcomes.length} intents:`, outcomes);
      } else {
        console.log(`[${new Date().toISOString()}] Deposit verification completed - no pending deposits found`);
      }
    } catch (e) {
      console.error(`[${new Date().toISOString()}] Background deposit verification failed:`, e.message);
    }
  }, intervalMs);
});
