const express = require('express');
const { body, validationResult, param } = require('express-validator');
const { query } = require('../config/database');
const { verifyToken } = require('../middleware/auth');
const WalletService = require('../services/walletService');

const router = express.Router();
const walletService = new WalletService();
// Simple helper for creating notifications
async function createNotification(userId, type, title, message, data = {}) {
  try {
    await query(
      `INSERT INTO notifications (user_id, type, title, message, data)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, type, title, message, JSON.stringify(data)]
    );
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
}

// Helper function to generate order number
async function generateOrderNumber() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp}-${random}`;
}

// Create a new order
router.post('/', [
  body('customerInfo').isObject().withMessage('Customer information is required'),
  body('customerInfo.email').isEmail().withMessage('Valid email is required'),
  body('customerInfo.firstName').trim().isLength({ min: 1 }).withMessage('First name is required'),
  body('customerInfo.lastName').trim().isLength({ min: 1 }).withMessage('Last name is required'),
  body('customerInfo.address').trim().isLength({ min: 1 }).withMessage('Address is required'),
  body('customerInfo.city').trim().isLength({ min: 1 }).withMessage('City is required'),
  body('customerInfo.state').trim().isLength({ min: 1 }).withMessage('State is required'),
  body('customerInfo.zipCode').trim().isLength({ min: 1 }).withMessage('ZIP code is required'),
  body('items').isArray({ min: 1 }).withMessage('Order items are required'),
  body('totals').isObject().withMessage('Order totals are required'),
  body('totals.subtotal').isNumeric().withMessage('Subtotal is required'),
  body('totals.shipping').isNumeric().withMessage('Shipping cost is required'),
  body('totals.tax').isNumeric().withMessage('Tax amount is required'),
  body('totals.total').isNumeric().withMessage('Total amount is required'),
  body('paymentInfo').isObject().withMessage('Payment information is required'),
  body('paymentInfo.transactionHash').optional().trim()
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

    const { customerInfo, items, totals, paymentInfo, userId } = req.body;

    // Handle wallet payment if specified
    let walletTransaction = null;
    if (paymentInfo.method === 'wallet' && userId) {
      // Verify user has sufficient wallet balance
      const userWallet = await walletService.getUserWallet(userId);
      if (!userWallet) {
        return res.status(400).json({
          success: false,
          message: 'User wallet not found. Please create a wallet first.'
        });
      }

      if (userWallet.balance < totals.total) {
        return res.status(400).json({
          success: false,
          message: `Insufficient wallet balance. Required: $${totals.total}, Available: $${userWallet.balance}`
        });
      }

      // Prepare wallet transaction (will execute after order creation)
      walletTransaction = {
        walletId: userWallet.id,
        userId: userId,
        amount: totals.total,
        balanceBefore: userWallet.balance,
        balanceAfter: userWallet.balance - totals.total
      };
    }

    // Start transaction
    await query('BEGIN');

    try {
      // Generate order number
      const orderNumber = await generateOrderNumber();

      // Get user's store ID (required for existing schema)
      let storeId = null;
      if (userId) {
        const storeResult = await query('SELECT id FROM stores WHERE user_id = $1', [userId]);
        if (storeResult.rows.length > 0) {
          storeId = storeResult.rows[0].id;
        }
      }

      // Create the order with existing schema
      const orderResult = await query(`
        INSERT INTO orders (
          order_number, store_id, customer_email, customer_name, customer_phone,
          shipping_address, subtotal, shipping_cost, tax_amount, total_amount,
          payment_method, payment_id, status, payment_status
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
        ) RETURNING id, order_number, created_at
      `, [
        orderNumber,
        storeId,
        customerInfo.email,
        `${customerInfo.firstName} ${customerInfo.lastName}`,
        customerInfo.phone || null,
        JSON.stringify({
          address: customerInfo.address,
          city: customerInfo.city,
          state: customerInfo.state,
          zipCode: customerInfo.zipCode,
          country: customerInfo.country || 'United States'
        }),
        totals.subtotal,
        totals.shipping,
        totals.tax,
        totals.total,
        paymentInfo.method || 'USDT',
        paymentInfo.transactionHash || (walletTransaction ? `wallet-${orderNumber}` : null),
        'pending',
        (paymentInfo.transactionHash || walletTransaction) ? 'paid' : 'pending'
      ]);

      const order = orderResult.rows[0];

      // Add order items
      for (const item of items) {
        // Get current product info
        const productResult = await query(
          'SELECT name, description, image_url, sku, commission_rate FROM products WHERE id = $1',
          [item.id]
        );

        if (productResult.rows.length === 0) {
          throw new Error(`Product with ID ${item.id} not found`);
        }

        const product = productResult.rows[0];
        const totalPrice = item.price * item.quantity;

        await query(`
          INSERT INTO order_items (
            order_id, product_id, quantity, unit_price, total_price
          ) VALUES ($1, $2, $3, $4, $5)
        `, [
          order.id,
          item.id,
          item.quantity,
          item.price,
          totalPrice
        ]);

        // Update product stock if available
        await query(
          'UPDATE products SET stock_count = GREATEST(0, stock_count - $1) WHERE id = $2 AND stock_count > 0',
          [item.quantity, item.id]
        );
      }

      // Execute wallet payment if specified
      if (walletTransaction) {
        // Update wallet balance
        await walletService.updateWalletBalance(walletTransaction.walletId, walletTransaction.balanceAfter);
        
        // Record wallet transaction
        await walletService.recordTransaction({
          walletId: walletTransaction.walletId,
          userId: walletTransaction.userId,
          type: 'purchase',
          amount: -walletTransaction.amount,
          balanceBefore: walletTransaction.balanceBefore,
          balanceAfter: walletTransaction.balanceAfter,
          status: 'completed',
          description: `Purchase order ${orderNumber}`,
          metadata: { orderId: order.id, orderNumber: orderNumber }
        });
      }

      // Order created successfully

      // Notify store owner (if exists) about new order
      if (storeId) {
        const ownerResult = await query('SELECT user_id FROM stores WHERE id = $1', [storeId]);
        if (ownerResult.rows.length > 0) {
          const ownerId = ownerResult.rows[0].user_id;
          await createNotification(
            ownerId,
            'order_created',
            'New Order Received',
            `Order ${orderNumber} was created with total $${totals.total.toFixed(2)}`,
            { orderId: order.id, orderNumber }
          );
        }
      }

      // Commit transaction
      await query('COMMIT');

      res.status(201).json({
        success: true,
        message: walletTransaction ? 'Order created and paid with wallet balance' : 'Order created successfully',
        order: {
          id: order.id,
          orderNumber: order.order_number,
          createdAt: order.created_at,
          status: 'pending',
          paymentStatus: (paymentInfo.transactionHash || walletTransaction) ? 'paid' : 'pending',
          paymentMethod: paymentInfo.method || 'USDT',
          ...(walletTransaction && { 
            walletInfo: {
              amountDeducted: walletTransaction.amount,
              newBalance: walletTransaction.balanceAfter
            }
          })
        }
      });

    } catch (error) {
      // Rollback transaction on error
      await query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get orders for a user (with optional filters)
router.get('/', verifyToken, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      paymentStatus,
      search,
      startDate,
      endDate
    } = req.query;

    const offset = (page - 1) * limit;
    // Get user's store ID first
    const storeResult = await query('SELECT id FROM stores WHERE user_id = $1', [req.userId]);
    if (storeResult.rows.length === 0) {
      return res.json({
        success: true,
        orders: [],
        pagination: { currentPage: 1, totalPages: 0, totalCount: 0, hasNext: false, hasPrev: false }
      });
    }
    
    let whereConditions = ['o.store_id = $1'];
    let queryParams = [storeResult.rows[0].id];
    let paramIndex = 2;

    // Add filters
    if (status) {
      whereConditions.push(`o.status = $${paramIndex}`);
      queryParams.push(status);
      paramIndex++;
    }

    if (paymentStatus) {
      whereConditions.push(`o.payment_status = $${paramIndex}`);
      queryParams.push(paymentStatus);
      paramIndex++;
    }

    if (search) {
      whereConditions.push(`(o.order_number ILIKE $${paramIndex} OR o.customer_email ILIKE $${paramIndex})`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    if (startDate) {
      whereConditions.push(`o.created_at >= $${paramIndex}`);
      queryParams.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      whereConditions.push(`o.created_at <= $${paramIndex}`);
      queryParams.push(endDate);
      paramIndex++;
    }

    // Get orders with item count and product info
    const ordersQuery = `
      SELECT 
        o.*,
        COUNT(oi.id) as item_count,
        ARRAY_AGG(DISTINCT p.name) as product_names,
        (SELECT p2.image_url FROM order_items oi2 
         JOIN products p2 ON oi2.product_id = p2.id 
         WHERE oi2.order_id = o.id LIMIT 1) as first_item_image,
        COUNT(*) OVER() as total_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE ${whereConditions.join(' AND ')}
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);
    const result = await query(ordersQuery, queryParams);

    const totalCount = result.rows.length > 0 ? parseInt(result.rows[0].total_count) : 0;
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      success: true,
      orders: result.rows.map(order => ({
        id: order.id,
        orderNumber: order.order_number,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        total: parseFloat(order.total_amount),
        status: order.status,
        paymentStatus: order.payment_status,
        itemCount: parseInt(order.item_count),
        productNames: order.product_names || [],
        firstItemImage: order.first_item_image,
        createdAt: order.created_at,
        updatedAt: order.updated_at
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
});

// Get single order with full details
router.get('/:orderId', [
  param('orderId').isInt({ min: 1 }).withMessage('Valid order ID is required')
], verifyToken, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { orderId } = req.params;

    // Get user's store ID first
    const storeResult = await query('SELECT id FROM stores WHERE user_id = $1', [req.userId]);
    if (storeResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Get order details
    const orderResult = await query(`
      SELECT * FROM orders 
      WHERE id = $1 AND store_id = $2
    `, [orderId, storeResult.rows[0].id]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orderResult.rows[0];

    // Get order items
    const itemsResult = await query(`
      SELECT oi.*, p.name, p.description, p.image_url, p.sku, p.image_urls as current_image_urls
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
      ORDER BY oi.id
    `, [orderId]);

    res.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.order_number,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        customerPhone: order.customer_phone,
        shippingAddress: order.shipping_address,
        totals: {
          subtotal: parseFloat(order.subtotal),
          shipping: parseFloat(order.shipping_cost),
          tax: parseFloat(order.tax_amount),
          total: parseFloat(order.total_amount)
        },
        payment: {
          method: order.payment_method,
          transactionHash: order.payment_id,
          status: order.payment_status
        },
        status: order.status,
        notes: order.notes,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
        items: itemsResult.rows.map(item => ({
          id: item.id,
          productId: item.product_id,
          name: item.name,
          description: item.description,
          imageUrl: item.image_url,
          currentImageUrls: item.current_image_urls,
          sku: item.sku,
          unitPrice: parseFloat(item.unit_price),
          quantity: item.quantity,
          totalPrice: parseFloat(item.total_price)
        }))
      }
    });

  } catch (error) {
    console.error('Get order details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order details'
    });
  }
});

// Update order status (admin function - could be restricted)
router.patch('/:orderId/status', [
  param('orderId').isInt({ min: 1 }).withMessage('Valid order ID is required'),
  body('status').isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).withMessage('Valid status is required'),
  body('notes').optional().trim()
], verifyToken, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { orderId } = req.params;
    const { status, notes } = req.body;

    // Update order status
    const updated = await query(
      `UPDATE orders SET status = $1, notes = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING store_id, order_number, total_amount`,
      [status, notes || null, orderId]
    );

    // Notify store owner about status change
    if (updated.rows.length > 0 && updated.rows[0].store_id) {
      const storeId = updated.rows[0].store_id;
      const ownerResult = await query('SELECT user_id FROM stores WHERE id = $1', [storeId]);
      if (ownerResult.rows.length > 0) {
        const ownerId = ownerResult.rows[0].user_id;
        await createNotification(
          ownerId,
          'order_status',
          'Order Status Updated',
          `Order ${updated.rows[0].order_number} is now ${status}`,
          { orderId: Number(orderId), orderNumber: updated.rows[0].order_number, status }
        );
      }
    }

    res.json({
      success: true,
      message: 'Order status updated successfully'
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
});

// Get order statistics (for dashboard)
router.get('/stats/overview', verifyToken, async (req, res) => {
  try {
    // Get user's store ID first
    const storeResult = await query('SELECT id FROM stores WHERE user_id = $1', [req.userId]);
    if (storeResult.rows.length === 0) {
      return res.json({
        success: true,
        stats: {
          totalOrders: 0,
          pendingOrders: 0,
          processingOrders: 0,
          shippedOrders: 0,
          deliveredOrders: 0,
          cancelledOrders: 0,
          totalRevenue: 0
        }
      });
    }

    const { startDate, endDate } = req.query;
    let dateFilter = '';
    let queryParams = [storeResult.rows[0].id];

    if (startDate && endDate) {
      dateFilter = ' AND o.created_at BETWEEN $2 AND $3';
      queryParams.push(startDate, endDate);
    }

    const statsResult = await query(`
      SELECT 
        COUNT(*) as total_orders,
        COUNT(CASE WHEN o.status = 'pending' THEN 1 END) as pending_orders,
        COUNT(CASE WHEN o.status = 'processing' THEN 1 END) as processing_orders,
        COUNT(CASE WHEN o.status = 'shipped' THEN 1 END) as shipped_orders,
        COUNT(CASE WHEN o.status = 'delivered' THEN 1 END) as delivered_orders,
        COUNT(CASE WHEN o.status = 'cancelled' THEN 1 END) as cancelled_orders,
        COALESCE(SUM(CASE WHEN o.payment_status = 'paid' THEN o.total_amount END), 0) as total_revenue
      FROM orders o
      WHERE o.store_id = $1${dateFilter}
    `, queryParams);

    const stats = statsResult.rows[0];

    res.json({
      success: true,
      stats: {
        totalOrders: parseInt(stats.total_orders),
        pendingOrders: parseInt(stats.pending_orders),
        processingOrders: parseInt(stats.processing_orders),
        shippedOrders: parseInt(stats.shipped_orders),
        deliveredOrders: parseInt(stats.delivered_orders),
        cancelledOrders: parseInt(stats.cancelled_orders),
        totalRevenue: parseFloat(stats.total_revenue)
      }
    });

  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order statistics'
    });
  }
});

module.exports = router;
