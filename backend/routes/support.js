const express = require('express');
const { body, validationResult, param } = require('express-validator');
const { query } = require('../config/database');
const { verifyToken, verifyAdmin, verifyAdminOrOwner } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads/support');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|txt|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images, PDFs, and text documents are allowed'));
    }
  }
});

// Create notification helper function
const createNotification = async (userId, type, title, message, data = {}) => {
  try {
    await query(
      `INSERT INTO notifications (user_id, type, title, message, data) 
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, type, title, message, JSON.stringify(data)]
    );
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
};

// Validation middleware
const validateCreateTicket = [
  body('subject')
    .trim()
    .isLength({ min: 5, max: 255 })
    .withMessage('Subject must be between 5 and 255 characters'),
  body('category')
    .isIn(['account', 'technical', 'payment', 'products', 'orders', 'general'])
    .withMessage('Invalid category'),
  body('priority')
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority'),
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long'),
];

const validateMessage = [
  body('message')
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Message must be between 1 and 5000 characters'),
  body('messageType')
    .optional()
    .isIn(['text', 'image', 'file'])
    .withMessage('Invalid message type'),
];

// Get user's support tickets
router.get('/tickets', verifyToken, async (req, res) => {
  try {
    const { status, category, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE st.user_id = $1';
    let queryParams = [req.userId];
    let paramCount = 1;

    if (status && status !== 'all') {
      paramCount++;
      whereClause += ` AND st.status = $${paramCount}`;
      queryParams.push(status);
    }

    if (category && category !== 'all') {
      paramCount++;
      whereClause += ` AND st.category = $${paramCount}`;
      queryParams.push(category);
    }

    const ticketsQuery = `
      SELECT 
        st.*,
        u.first_name || ' ' || u.last_name as user_name,
        admin_u.first_name || ' ' || admin_u.last_name as admin_name,
        (SELECT COUNT(*) FROM support_messages sm WHERE sm.ticket_id = st.id) as message_count,
        (SELECT COUNT(*) FROM support_messages sm WHERE sm.ticket_id = st.id AND sm.message_type IN ('image', 'file')) as attachment_count
      FROM support_tickets st
      LEFT JOIN users u ON st.user_id = u.id
      LEFT JOIN users admin_u ON st.assigned_admin_id = admin_u.id
      ${whereClause}
      ORDER BY st.created_at DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;

    queryParams.push(limit, offset);

    const countQuery = `
      SELECT COUNT(*) as total
      FROM support_tickets st
      ${whereClause}
    `;

    const [ticketsResult, countResult] = await Promise.all([
      query(ticketsQuery, queryParams),
      query(countQuery, queryParams.slice(0, -2)) // Remove limit and offset for count
    ]);

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      tickets: ticketsResult.rows,
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
    console.error('Get tickets error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all tickets (admin only)
router.get('/admin/tickets', verifyAdmin, async (req, res) => {
  try {
    const { status, category, priority, assignedTo, page = 1, limit = 20, search } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE 1=1';
    let queryParams = [];
    let paramCount = 0;

    if (status && status !== 'all') {
      paramCount++;
      whereClause += ` AND st.status = $${paramCount}`;
      queryParams.push(status);
    }

    if (category && category !== 'all') {
      paramCount++;
      whereClause += ` AND st.category = $${paramCount}`;
      queryParams.push(category);
    }

    if (priority && priority !== 'all') {
      paramCount++;
      whereClause += ` AND st.priority = $${paramCount}`;
      queryParams.push(priority);
    }

    if (assignedTo && assignedTo !== 'all') {
      if (assignedTo === 'unassigned') {
        whereClause += ` AND st.assigned_admin_id IS NULL`;
      } else {
        paramCount++;
        whereClause += ` AND st.assigned_admin_id = $${paramCount}`;
        queryParams.push(assignedTo);
      }
    }

    if (search) {
      paramCount++;
      whereClause += ` AND (st.subject ILIKE $${paramCount} OR st.ticket_number ILIKE $${paramCount} OR u.first_name || ' ' || u.last_name ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
    }

    const ticketsQuery = `
      SELECT 
        st.*,
        u.first_name || ' ' || u.last_name as user_name,
        u.email as user_email,
        admin_u.first_name || ' ' || admin_u.last_name as admin_name,
        (SELECT COUNT(*) FROM support_messages sm WHERE sm.ticket_id = st.id) as message_count,
        (SELECT COUNT(*) FROM support_messages sm WHERE sm.ticket_id = st.id AND sm.message_type IN ('image', 'file')) as attachment_count,
        (SELECT created_at FROM support_messages sm WHERE sm.ticket_id = st.id ORDER BY created_at DESC LIMIT 1) as last_message_at
      FROM support_tickets st
      LEFT JOIN users u ON st.user_id = u.id
      LEFT JOIN users admin_u ON st.assigned_admin_id = admin_u.id
      ${whereClause}
      ORDER BY 
        CASE WHEN st.priority = 'high' THEN 1 WHEN st.priority = 'medium' THEN 2 ELSE 3 END,
        st.created_at DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;

    queryParams.push(limit, offset);

    const countQuery = `
      SELECT COUNT(*) as total
      FROM support_tickets st
      LEFT JOIN users u ON st.user_id = u.id
      ${whereClause}
    `;

    const [ticketsResult, countResult] = await Promise.all([
      query(ticketsQuery, queryParams),
      query(countQuery, queryParams.slice(0, -2)) // Remove limit and offset for count
    ]);

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      tickets: ticketsResult.rows,
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
    console.error('Get admin tickets error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get single ticket with messages
router.get('/tickets/:ticketId', verifyToken, async (req, res) => {
  try {
    const { ticketId } = req.params;

    // Get ticket details
    const ticketResult = await query(`
      SELECT 
        st.*,
        u.first_name || ' ' || u.last_name as user_name,
        u.email as user_email,
        admin_u.first_name || ' ' || admin_u.last_name as admin_name
      FROM support_tickets st
      LEFT JOIN users u ON st.user_id = u.id
      LEFT JOIN users admin_u ON st.assigned_admin_id = admin_u.id
      WHERE st.id = $1
    `, [ticketId]);

    if (ticketResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    const ticket = ticketResult.rows[0];

    // Check if user can access this ticket
    if (req.user.role !== 'admin' && ticket.user_id !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Get messages
    const messagesResult = await query(`
      SELECT 
        sm.*,
        u.first_name || ' ' || u.last_name as sender_name,
        u.role as sender_role
      FROM support_messages sm
      LEFT JOIN users u ON sm.sender_id = u.id
      WHERE sm.ticket_id = $1
      ORDER BY sm.created_at ASC
    `, [ticketId]);

    res.json({
      success: true,
      ticket,
      messages: messagesResult.rows
    });

  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new support ticket
router.post('/tickets', verifyToken, validateCreateTicket, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { subject, category, priority, description } = req.body;

    const result = await query(`
      INSERT INTO support_tickets (user_id, subject, category, priority)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [req.userId, subject, category, priority]);

    const ticket = result.rows[0];

    // Add initial message
    await query(`
      INSERT INTO support_messages (ticket_id, sender_id, message)
      VALUES ($1, $2, $3)
    `, [ticket.id, req.userId, description]);

    // Notify admins about new ticket
    const adminsResult = await query("SELECT id FROM users WHERE role = 'admin'");
    const adminNotifications = adminsResult.rows.map(admin => 
      createNotification(
        admin.id,
        'support_ticket_created',
        'New Support Ticket',
        `New ticket created: ${subject}`,
        { ticketId: ticket.id, ticketNumber: ticket.ticket_number }
      )
    );
    
    await Promise.all(adminNotifications);

    res.status(201).json({
      success: true,
      message: 'Support ticket created successfully',
      ticket
    });

  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Add message to ticket
router.post('/tickets/:ticketId/messages', verifyToken, upload.single('file'), validateMessage, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { ticketId } = req.params;
    const { message, messageType = 'text', isInternal = false } = req.body;

    // Check if ticket exists and user has access
    const ticketResult = await query(`
      SELECT * FROM support_tickets WHERE id = $1
    `, [ticketId]);

    if (ticketResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    const ticket = ticketResult.rows[0];

    // Check access permissions
    if (req.user.role !== 'admin' && ticket.user_id !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Only admins can send internal messages
    const finalIsInternal = req.user.role === 'admin' ? isInternal : false;

    let fileUrl = null;
    let fileName = null;
    let fileSize = null;

    if (req.file) {
      fileUrl = `/uploads/support/${req.file.filename}`;
      fileName = req.file.originalname;
      fileSize = req.file.size;
    }

    // Add message
    const messageResult = await query(`
      INSERT INTO support_messages (ticket_id, sender_id, message, message_type, file_url, file_name, file_size, is_internal)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [ticketId, req.userId, message, messageType, fileUrl, fileName, fileSize, finalIsInternal]);

    // Update ticket status if it was resolved and user is replying
    if (ticket.status === 'resolved' && req.user.role !== 'admin') {
      await query(`
        UPDATE support_tickets SET status = 'open', updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `, [ticketId]);
    }

    // Create notification for the other party
    let notificationUserId;
    let notificationTitle;
    let notificationMessage;

    if (req.user.role === 'admin') {
      // Admin replied, notify user
      notificationUserId = ticket.user_id;
      notificationTitle = 'Support Reply';
      notificationMessage = `You received a reply on ticket ${ticket.ticket_number}`;
    } else {
      // User replied, notify assigned admin or all admins
      if (ticket.assigned_admin_id) {
        notificationUserId = ticket.assigned_admin_id;
        notificationTitle = 'Customer Reply';
        notificationMessage = `Customer replied on ticket ${ticket.ticket_number}`;
        
        await createNotification(
          notificationUserId,
          'support_message',
          notificationTitle,
          notificationMessage,
          { ticketId: ticket.id, ticketNumber: ticket.ticket_number }
        );
      } else {
        // Notify all admins
        const adminsResult = await query("SELECT id FROM users WHERE role = 'admin'");
        const adminNotifications = adminsResult.rows.map(admin => 
          createNotification(
            admin.id,
            'support_message',
            notificationTitle,
            notificationMessage,
            { ticketId: ticket.id, ticketNumber: ticket.ticket_number }
          )
        );
        
        await Promise.all(adminNotifications);
      }
    }

    if (notificationUserId) {
      await createNotification(
        notificationUserId,
        'support_message',
        notificationTitle,
        notificationMessage,
        { ticketId: ticket.id, ticketNumber: ticket.ticket_number }
      );
    }

    // Get sender info for response
    const senderResult = await query(`
      SELECT first_name, last_name, role FROM users WHERE id = $1
    `, [req.userId]);

    const responseMessage = {
      ...messageResult.rows[0],
      sender_name: `${senderResult.rows[0].first_name} ${senderResult.rows[0].last_name}`,
      sender_role: senderResult.rows[0].role
    };

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: responseMessage
    });

  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update ticket status (admin only)
router.patch('/admin/tickets/:ticketId/status', verifyAdmin, async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;

    if (!['open', 'in_progress', 'resolved', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const resolvedAt = status === 'resolved' ? 'CURRENT_TIMESTAMP' : 'NULL';

    const result = await query(`
      UPDATE support_tickets 
      SET status = $1, updated_at = CURRENT_TIMESTAMP, resolved_at = ${resolvedAt}
      WHERE id = $2
      RETURNING *
    `, [status, ticketId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    const ticket = result.rows[0];

    // Notify user about status change
    await createNotification(
      ticket.user_id,
      'support_status_change',
      'Ticket Status Updated',
      `Your ticket ${ticket.ticket_number} status has been updated to: ${status}`,
      { ticketId: ticket.id, ticketNumber: ticket.ticket_number, newStatus: status }
    );

    res.json({
      success: true,
      message: 'Ticket status updated',
      ticket
    });

  } catch (error) {
    console.error('Update ticket status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Assign ticket to admin (admin only)
router.patch('/admin/tickets/:ticketId/assign', verifyAdmin, async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { adminId } = req.body;

    let assignedAdminId = adminId;

    // If adminId is null, unassign the ticket
    if (adminId === null || adminId === 'null') {
      assignedAdminId = null;
    } else if (adminId) {
      // Verify the adminId is actually an admin
      const adminCheck = await query(`
        SELECT id FROM users WHERE id = $1 AND role = 'admin'
      `, [adminId]);

      if (adminCheck.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid admin ID'
        });
      }
    }

    const result = await query(`
      UPDATE support_tickets 
      SET assigned_admin_id = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `, [assignedAdminId, ticketId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    const ticket = result.rows[0];

    // Notify assigned admin (if assigned)
    if (assignedAdminId) {
      await createNotification(
        assignedAdminId,
        'support_ticket_assigned',
        'Ticket Assigned',
        `You have been assigned to ticket ${ticket.ticket_number}`,
        { ticketId: ticket.id, ticketNumber: ticket.ticket_number }
      );
    }

    res.json({
      success: true,
      message: assignedAdminId ? 'Ticket assigned successfully' : 'Ticket unassigned successfully',
      ticket
    });

  } catch (error) {
    console.error('Assign ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get dashboard statistics (admin only)
router.get('/admin/stats', verifyAdmin, async (req, res) => {
  try {
    const statsQuery = `
      SELECT 
        COUNT(*) as total_tickets,
        COUNT(*) FILTER (WHERE status = 'open') as open_tickets,
        COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress_tickets,
        COUNT(*) FILTER (WHERE status = 'resolved') as resolved_tickets,
        COUNT(*) FILTER (WHERE assigned_admin_id IS NULL) as unassigned_tickets,
        COUNT(*) FILTER (WHERE priority = 'high') as high_priority_tickets,
        COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as recent_tickets
      FROM support_tickets
    `;

    const result = await query(statsQuery);
    const stats = result.rows[0];

    // Get average response time
    const responseTimeQuery = `
      SELECT 
        AVG(EXTRACT(EPOCH FROM (
          SELECT MIN(sm.created_at) 
          FROM support_messages sm 
          WHERE sm.ticket_id = st.id AND sm.sender_id != st.user_id
        ) - st.created_at) / 3600) as avg_response_hours
      FROM support_tickets st
      WHERE EXISTS (
        SELECT 1 FROM support_messages sm 
        WHERE sm.ticket_id = st.id AND sm.sender_id != st.user_id
      )
    `;

    const responseTimeResult = await query(responseTimeQuery);
    const avgResponseHours = responseTimeResult.rows[0].avg_response_hours || 0;

    res.json({
      success: true,
      stats: {
        ...stats,
        avg_response_time: Math.round(avgResponseHours * 10) / 10 // Round to 1 decimal place
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get list of admins (for assignment dropdown)
router.get('/admin/admins', verifyAdmin, async (req, res) => {
  try {
    const result = await query(`
      SELECT id, first_name, last_name, email
      FROM users 
      WHERE role = 'admin'
      ORDER BY first_name, last_name
    `);

    res.json({
      success: true,
      admins: result.rows
    });

  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
