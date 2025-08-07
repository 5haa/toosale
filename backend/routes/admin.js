const express = require('express');
const { body, validationResult, param } = require('express-validator');
const { query } = require('../config/database');
const { verifyAdmin } = require('../middleware/auth');
const WalletService = require('../services/walletService');
const walletService = new WalletService();

const router = express.Router();

// Helper: create a notification
async function createNotification(userId, type, title, message, data = {}) {
  try {
    await query(
      `INSERT INTO notifications (user_id, type, title, message, data)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, type, title, message, JSON.stringify(data)]
    );
  } catch (e) {
    console.error('Failed to create notification:', e);
  }
}

// Get admin dashboard stats
router.get('/dashboard/stats', verifyAdmin, async (req, res) => {
  try {
    const statsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM users WHERE role = 'user') as total_users,
        (SELECT COUNT(*) FROM users WHERE created_at >= CURRENT_DATE - INTERVAL '30 days' AND role = 'user') as new_users_month,
        (SELECT COUNT(*) FROM stores) as total_stores,
        (SELECT COUNT(*) FROM products) as total_products,
        (SELECT COUNT(*) FROM orders) as total_orders,
        (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status = 'completed') as total_revenue,
        (SELECT COUNT(*) FROM support_tickets) as total_tickets,
        (SELECT COUNT(*) FROM support_tickets WHERE status = 'open') as open_tickets
    `;

    const statsResult = await query(statsQuery);
    const stats = statsResult.rows[0];

    // Get recent activity
    const recentActivityQuery = `
      (SELECT 'user_registered' as type, first_name || ' ' || last_name as title, 'New user registration' as description, created_at
       FROM users WHERE role = 'user' AND created_at >= CURRENT_DATE - INTERVAL '7 days'
       ORDER BY created_at DESC LIMIT 5)
      UNION ALL
      (SELECT 'order_placed' as type, 'Order #' || order_number as title, 'New order placed' as description, created_at
       FROM orders WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
       ORDER BY created_at DESC LIMIT 5)
      UNION ALL
      (SELECT 'support_ticket' as type, 'Ticket ' || ticket_number as title, subject as description, created_at
       FROM support_tickets WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
       ORDER BY created_at DESC LIMIT 5)
      ORDER BY created_at DESC
      LIMIT 10
    `;

    const activityResult = await query(recentActivityQuery);

    // Get monthly revenue for chart
    const monthlyRevenueQuery = `
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COALESCE(SUM(total_amount), 0) as revenue,
        COUNT(*) as order_count
      FROM orders 
      WHERE created_at >= CURRENT_DATE - INTERVAL '12 months'
        AND status = 'completed'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month DESC
      LIMIT 12
    `;

    const monthlyRevenueResult = await query(monthlyRevenueQuery);

    res.json({
      success: true,
      stats,
      recent_activity: activityResult.rows,
      monthly_revenue: monthlyRevenueResult.rows
    });

  } catch (error) {
    console.error('Get admin dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all users with pagination and search
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE 1=1';
    let queryParams = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      whereClause += ` AND (first_name ILIKE $${paramCount} OR last_name ILIKE $${paramCount} OR email ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
    }

    if (role && role !== 'all') {
      paramCount++;
      whereClause += ` AND role = $${paramCount}`;
      queryParams.push(role);
    }

    const usersQuery = `
      SELECT 
        id, first_name, last_name, email, role, is_verified, 
        last_login, created_at,
        (SELECT COUNT(*) FROM stores WHERE user_id = users.id) as store_count,
        (SELECT COUNT(*) FROM orders WHERE store_id IN (SELECT id FROM stores WHERE user_id = users.id)) as order_count
      FROM users
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;

    queryParams.push(limit, offset);

    const countQuery = `
      SELECT COUNT(*) as total
      FROM users
      ${whereClause}
    `;

    const [usersResult, countResult] = await Promise.all([
      query(usersQuery, queryParams),
      query(countQuery, queryParams.slice(0, -2))
    ]);

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      users: usersResult.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update user role
router.patch('/users/:userId/role', verifyAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    const result = await query(`
      UPDATE users 
      SET role = $1
      WHERE id = $2
      RETURNING id, first_name, last_name, email, role
    `, [role, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User role updated successfully',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all stores with admin view
router.get('/stores', verifyAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE 1=1';
    let queryParams = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      whereClause += ` AND (s.name ILIKE $${paramCount} OR s.slug ILIKE $${paramCount} OR u.first_name || ' ' || u.last_name ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
    }

    if (status === 'public') {
      whereClause += ` AND s.is_public = true`;
    } else if (status === 'private') {
      whereClause += ` AND s.is_public = false`;
    }

    const storesQuery = `
      SELECT 
        s.*,
        u.first_name || ' ' || u.last_name as owner_name,
        u.email as owner_email,
        (SELECT COUNT(*) FROM store_products sp WHERE sp.store_id = s.id) as product_count,
        (SELECT COUNT(*) FROM orders o WHERE o.store_id = s.id) as order_count,
        (SELECT COALESCE(SUM(total_amount), 0) FROM orders o WHERE o.store_id = s.id AND o.status = 'completed') as total_revenue
      FROM stores s
      LEFT JOIN users u ON s.user_id = u.id
      ${whereClause}
      ORDER BY s.created_at DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;

    queryParams.push(limit, offset);

    const countQuery = `
      SELECT COUNT(*) as total
      FROM stores s
      LEFT JOIN users u ON s.user_id = u.id
      ${whereClause}
    `;

    const [storesResult, countResult] = await Promise.all([
      query(storesQuery, queryParams),
      query(countQuery, queryParams.slice(0, -2))
    ]);

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      stores: storesResult.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all orders with admin view
router.get('/orders', verifyAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE 1=1';
    let queryParams = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      whereClause += ` AND (o.order_number ILIKE $${paramCount} OR o.customer_name ILIKE $${paramCount} OR o.customer_email ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
    }

    if (status && status !== 'all') {
      paramCount++;
      whereClause += ` AND o.status = $${paramCount}`;
      queryParams.push(status);
    }

    const ordersQuery = `
      SELECT 
        o.*,
        s.name as store_name,
        u.first_name || ' ' || u.last_name as store_owner,
        (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id) as item_count
      FROM orders o
      LEFT JOIN stores s ON o.store_id = s.id
      LEFT JOIN users u ON s.user_id = u.id
      ${whereClause}
      ORDER BY o.created_at DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;

    queryParams.push(limit, offset);

    const countQuery = `
      SELECT COUNT(*) as total
      FROM orders o
      LEFT JOIN stores s ON o.store_id = s.id
      LEFT JOIN users u ON s.user_id = u.id
      ${whereClause}
    `;

    const [ordersResult, countResult] = await Promise.all([
      query(ordersQuery, queryParams),
      query(countQuery, queryParams.slice(0, -2))
    ]);

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      orders: ordersResult.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update order status
router.patch('/orders/:orderId/status', verifyAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const result = await query(
      `UPDATE orders 
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, order_number, store_id, total_amount`,
      [status, orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Notify store owner about status change
    const order = result.rows[0];
    if (order.store_id) {
      const ownerRes = await query('SELECT user_id FROM stores WHERE id = $1', [order.store_id]);
      if (ownerRes.rows.length > 0) {
        await createNotification(
          ownerRes.rows[0].user_id,
          'order_status',
          'Order Status Updated',
          `Order ${order.order_number} is now ${status}`,
          { orderId: order.id, orderNumber: order.order_number, status }
        );
      }
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get analytics data
router.get('/analytics', verifyAdmin, async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    let dateFilter;
    switch (period) {
      case '7d':
        dateFilter = "WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'";
        break;
      case '30d':
        dateFilter = "WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'";
        break;
      case '90d':
        dateFilter = "WHERE created_at >= CURRENT_DATE - INTERVAL '90 days'";
        break;
      case '1y':
        dateFilter = "WHERE created_at >= CURRENT_DATE - INTERVAL '1 year'";
        break;
      default:
        dateFilter = "WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'";
    }

    // Daily revenue and orders
    const dailyStatsQuery = `
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as order_count,
        COALESCE(SUM(total_amount), 0) as revenue
      FROM orders 
      ${dateFilter} AND status = 'completed'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `;

    // Top products
    const topProductsQuery = `
      SELECT 
        p.name,
        SUM(oi.quantity) as total_sold,
        SUM(oi.total_price) as total_revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN orders o ON oi.order_id = o.id
      ${dateFilter.replace('created_at', 'o.created_at')} AND o.status = 'completed'
      GROUP BY p.id, p.name
      ORDER BY total_sold DESC
      LIMIT 10
    `;

    // Top stores
    const topStoresQuery = `
      SELECT 
        s.name,
        COUNT(o.id) as order_count,
        COALESCE(SUM(o.total_amount), 0) as revenue
      FROM stores s
      LEFT JOIN orders o ON s.id = o.store_id
      ${dateFilter.replace('created_at', 'o.created_at')} AND (o.status = 'completed' OR o.status IS NULL)
      GROUP BY s.id, s.name
      ORDER BY revenue DESC
      LIMIT 10
    `;

    const [dailyStats, topProducts, topStores] = await Promise.all([
      query(dailyStatsQuery),
      query(topProductsQuery),
      query(topStoresQuery)
    ]);

    res.json({
      success: true,
      analytics: {
        daily_stats: dailyStats.rows,
        top_products: topProducts.rows,
        top_stores: topStores.rows
      }
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;

// --- Wallet admin: review withdrawals ---
// List pending withdrawals
router.get('/wallet/withdrawals', verifyAdmin, async (req, res) => {
  try {
    const { status = 'pending', page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const result = await query(
      `SELECT wt.* , u.first_name || ' ' || u.last_name as user_name
       FROM wallet_transactions wt
       JOIN users u ON u.id = wt.user_id
       WHERE wt.transaction_type = 'withdrawal' AND wt.status = $1
       ORDER BY wt.created_at DESC
       LIMIT $2 OFFSET $3`,
      [status, limit, offset]
    );
    res.json({ success: true, withdrawals: result.rows });
  } catch (error) {
    console.error('List withdrawals error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Approve withdrawal: mark completed and deduct balance
router.post('/wallet/withdrawals/:id/approve', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    // Load withdrawal
    const txRes = await query(`SELECT * FROM wallet_transactions WHERE id = $1 AND transaction_type = 'withdrawal'`, [id]);
    if (txRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Withdrawal not found' });
    }
    const tx = txRes.rows[0];
    if (tx.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Withdrawal is not pending' });
    }

    // Fetch wallet
    const wRes = await query(`SELECT id, balance FROM wallets WHERE id = $1`, [tx.wallet_id]);
    if (wRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Wallet not found' });
    }
    const wallet = wRes.rows[0];
    const amount = Math.abs(Number(tx.amount));
    if (Number(wallet.balance) < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient wallet balance to approve' });
    }

    await query('BEGIN');
    try {
      // Deduct balance
      const newBalance = Number(wallet.balance) - amount;
      await walletService.updateWalletBalance(wallet.id, newBalance);

      // Mark transaction completed
      await query(`UPDATE wallet_transactions SET status = 'completed', balance_after = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`, [newBalance, id]);

      await query('COMMIT');
      res.json({ success: true, message: 'Withdrawal approved', newBalance });
    } catch (e) {
      await query('ROLLBACK');
      throw e;
    }
  } catch (error) {
    console.error('Approve withdrawal error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Reject withdrawal: keep balance same, set failed with reason
router.post('/wallet/withdrawals/:id/reject', [
  verifyAdmin,
  body('reason').isString().isLength({ min: 3, max: 255 }).withMessage('Reason required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }
    const { id } = req.params;
    const { reason } = req.body;
    const txRes = await query(`SELECT * FROM wallet_transactions WHERE id = $1 AND transaction_type = 'withdrawal'`, [id]);
    if (txRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Withdrawal not found' });
    }
    const tx = txRes.rows[0];
    if (tx.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Withdrawal is not pending' });
    }
    await query(`UPDATE wallet_transactions SET status = 'failed', description = COALESCE(description,'') || ' | Rejected: ' || $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`, [reason, id]);
    res.json({ success: true, message: 'Withdrawal rejected' });
  } catch (error) {
    console.error('Reject withdrawal error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

