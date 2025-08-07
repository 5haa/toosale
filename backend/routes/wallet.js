const express = require('express');
const { body, validationResult } = require('express-validator');
const WalletService = require('../services/walletService');

const router = express.Router();
const walletService = new WalletService();

// Verify token middleware (copied from auth.js)
const jwt = require('jsonwebtoken');
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

/**
 * GET /api/wallet
 * Get user's wallet information
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const wallet = await walletService.getUserWallet(req.userId);
    
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    res.json({
      success: true,
      wallet: wallet
    });
  } catch (error) {
    console.error('Get wallet error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * POST /api/wallet/create
 * Create a new wallet for the user
 */
router.post('/create', verifyToken, async (req, res) => {
  try {
    const wallet = await walletService.createUserWallet(req.userId);

    res.status(201).json({
      success: true,
      message: 'Wallet created successfully',
      wallet: wallet
    });
  } catch (error) {
    console.error('Create wallet error:', error);
    
    if (error.message === 'User already has an active wallet') {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * GET /api/wallet/deposit-info
 * Get deposit information including private key for manual deposits
 */
router.get('/deposit-info', verifyToken, async (req, res) => {
  try {
    const wallet = await walletService.getUserWallet(req.userId);
    
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    // Get private key for deposit (be very careful with this!)
    const privateKey = await walletService.getWalletPrivateKey(req.userId);

    res.json({
      success: true,
      depositInfo: {
        walletAddress: wallet.address,
        privateKey: privateKey,
        instructions: 'Send USDT on Polygon (PoS) to this address. Use the private key to import into your wallet app.',
        warnings: [
          'Keep your private key secure and never share it',
          'Only send USDT on Polygon (USDT.e) to this address',
          'Sending tokens on other networks may result in permanent loss',
          'Always verify the address before sending'
        ]
      }
    });
  } catch (error) {
    console.error('Get deposit info error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * POST /api/wallet/deposit
 * Create a deposit intent and start verification loop
 */
router.post('/deposit', [
  verifyToken,
  body('amount')
    .isFloat({ min: 1 })
    .withMessage('Minimum deposit amount is $1')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const { amount } = req.body;
    const intent = await walletService.createDepositIntent(req.userId, parseFloat(amount));
    res.status(201).json({ success: true, intent });
  } catch (error) {
    console.error('Create deposit intent error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * POST /api/wallet/deposit/:intentId/check
 * Check a specific deposit intent now
 */
router.post('/deposit/:intentId/check', verifyToken, async (req, res) => {
  try {
    const { intentId } = req.params;
    const result = await walletService.verifyDepositIntent(intentId);
    res.json({ success: true, result });
  } catch (error) {
    console.error('Verify deposit intent error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * GET /api/wallet/transactions
 * Get user's transaction history
 */
router.get('/transactions', verifyToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const transactions = await walletService.getUserTransactions(req.userId, limit, offset);

    res.json({
      success: true,
      transactions: transactions,
      pagination: {
        limit: limit,
        offset: offset,
        hasMore: transactions.length === limit
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * POST /api/wallet/add-funds
 * Add funds to wallet (for demo/testing purposes)
 */
router.post('/add-funds', [
  verifyToken,
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number with at least 0.01'),
  body('description')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Description must be less than 255 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { amount, description } = req.body;

    const result = await walletService.addFunds(
      req.userId, 
      parseFloat(amount), 
      description || 'Demo deposit'
    );

    res.json({
      success: true,
      message: 'Funds added successfully',
      transaction: result.transaction,
      newBalance: result.newBalance
    });
  } catch (error) {
    console.error('Add funds error:', error);
    
    if (error.message === 'Wallet not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * GET /api/wallet/balance
 * Get user's current wallet balance
 */
router.get('/balance', verifyToken, async (req, res) => {
  try {
    const wallet = await walletService.getUserWallet(req.userId);
    
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    res.json({
      success: true,
      balance: wallet.balance,
      address: wallet.address
    });
  } catch (error) {
    console.error('Get wallet balance error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * POST /api/wallet/withdraw
 * Request a withdrawal (placeholder for now)
 */
router.post('/withdraw', [
  verifyToken,
  body('amount')
    .isFloat({ min: 10 })
    .withMessage('Minimum withdrawal amount is $10'),
  body('method')
    .isIn(['bank', 'paypal'])
    .withMessage('Invalid withdrawal method'),
  body('details')
    .isObject()
    .withMessage('Withdrawal details are required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { amount, method, details } = req.body;
    const wallet = await walletService.getUserWallet(req.userId);
    
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    // For now, just record as pending withdrawal
    const transaction = await walletService.recordTransaction({
      walletId: wallet.id,
      userId: req.userId,
      type: 'withdrawal',
      amount: -amount,
      balanceBefore: wallet.balance,
      balanceAfter: wallet.balance, // Don't deduct yet until approved
      status: 'pending',
      description: `Withdrawal request via ${method}`,
      metadata: { method, details }
    });

    res.json({
      success: true,
      message: 'Withdrawal request submitted successfully',
      transaction: transaction
    });
  } catch (error) {
    console.error('Withdraw request error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
