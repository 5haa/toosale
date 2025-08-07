const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { query } = require('../config/database');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Get reviews summary for a product (star distribution and count)
router.get('/product/:productId/summary', [
  param('productId').isInt({ min: 1 }).withMessage('Valid product ID is required')
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

    const { productId } = req.params;

    // Get overall rating and count from product table
    const productResult = await query(
      'SELECT rating, review_count FROM products WHERE id = $1 AND is_active = true',
      [productId]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const product = productResult.rows[0];

    // Get star distribution
    const distributionResult = await query(`
      SELECT 
        rating,
        COUNT(*) as count,
        ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM reviews WHERE product_id = $1)), 1) as percentage
      FROM reviews 
      WHERE product_id = $1 
      GROUP BY rating 
      ORDER BY rating DESC
    `, [productId]);

    // Create distribution object with all star ratings (1-5)
    const distribution = {};
    for (let i = 5; i >= 1; i--) {
      distribution[i] = {
        count: 0,
        percentage: 0
      };
    }

    // Fill in actual data
    distributionResult.rows.forEach(row => {
      distribution[row.rating] = {
        count: parseInt(row.count),
        percentage: parseFloat(row.percentage)
      };
    });

    res.json({
      success: true,
      data: {
        averageRating: parseFloat(product.rating) || 0,
        totalReviews: product.review_count || 0,
        distribution
      }
    });

  } catch (error) {
    console.error('Get reviews summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Submit a review for a product
router.post('/product/:productId', verifyToken, [
  param('productId').isInt({ min: 1 }).withMessage('Valid product ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('orderId').optional().isInt({ min: 1 }).withMessage('Valid order ID is required if provided')
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

    const { productId } = req.params;
    const { rating, orderId } = req.body;
    const userId = req.userId;

    // Verify product exists
    const productResult = await query(
      'SELECT id FROM products WHERE id = $1 AND is_active = true',
      [productId]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // If orderId is provided, verify it belongs to the user and contains this product
    if (orderId) {
      const orderVerification = await query(`
        SELECT oi.id 
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        WHERE oi.order_id = $1 AND oi.product_id = $2 AND o.customer_email = (
          SELECT email FROM users WHERE id = $3
        )
      `, [orderId, productId, userId]);

      if (orderVerification.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid order or product not found in order'
        });
      }
    }

    // Insert or update review
    const reviewResult = await query(`
      INSERT INTO reviews (product_id, user_id, rating, order_id)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (product_id, user_id)
      DO UPDATE SET 
        rating = EXCLUDED.rating,
        order_id = EXCLUDED.order_id,
        updated_at = CURRENT_TIMESTAMP
      RETURNING id, rating, created_at, updated_at
    `, [productId, userId, rating, orderId || null]);

    const review = reviewResult.rows[0];

    res.json({
      success: true,
      message: 'Review submitted successfully',
      data: {
        id: review.id,
        rating: review.rating,
        createdAt: review.created_at,
        updatedAt: review.updated_at
      }
    });

  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user's review for a product
router.get('/product/:productId/user', verifyToken, [
  param('productId').isInt({ min: 1 }).withMessage('Valid product ID is required')
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

    const { productId } = req.params;
    const userId = req.userId;

    const result = await query(`
      SELECT id, rating, order_id, created_at, updated_at
      FROM reviews 
      WHERE product_id = $1 AND user_id = $2
    `, [productId, userId]);

    if (result.rows.length === 0) {
      return res.json({
        success: true,
        data: null
      });
    }

    const review = result.rows[0];

    res.json({
      success: true,
      data: {
        id: review.id,
        rating: review.rating,
        orderId: review.order_id,
        createdAt: review.created_at,
        updatedAt: review.updated_at
      }
    });

  } catch (error) {
    console.error('Get user review error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete user's review for a product
router.delete('/product/:productId', verifyToken, [
  param('productId').isInt({ min: 1 }).withMessage('Valid product ID is required')
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

    const { productId } = req.params;
    const userId = req.userId;

    const result = await query(
      'DELETE FROM reviews WHERE product_id = $1 AND user_id = $2 RETURNING id',
      [productId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
