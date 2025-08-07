const express = require('express');
const { query } = require('../config/database');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// List notifications for current user
router.get('/', verifyToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const result = await query(
      `SELECT id, type, title, message, data, is_read, created_at,
              COUNT(*) OVER() AS total_count
       FROM notifications
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [req.userId, limit, offset]
    );

    const totalCount = result.rows.length > 0 ? parseInt(result.rows[0].total_count) : 0;
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      success: true,
      notifications: result.rows.map(n => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        data: n.data,
        isRead: n.is_read,
        createdAt: n.created_at,
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      }
    });
  } catch (error) {
    console.error('List notifications error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
});

// Unread count for current user
router.get('/unread-count', verifyToken, async (req, res) => {
  try {
    const result = await query(
      'SELECT COUNT(*)::int AS unread_count FROM notifications WHERE user_id = $1 AND is_read = false',
      [req.userId]
    );
    res.json({ success: true, unreadCount: result.rows[0].unread_count });
  } catch (error) {
    console.error('Unread notifications count error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch unread count' });
  }
});

// Mark single notification as read
router.patch('/:id/read', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2 RETURNING id', [id, req.userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ success: false, message: 'Failed to mark notification as read' });
  }
});

// Mark all as read
router.post('/mark-all-read', verifyToken, async (req, res) => {
  try {
    await query('UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false', [req.userId]);
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({ success: false, message: 'Failed to mark notifications as read' });
  }
});

module.exports = router;


