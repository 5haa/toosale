const express = require('express');
const { body, validationResult, param } = require('express-validator');
const { query } = require('../config/database');
const { verifyToken, verifyStoreOwner } = require('../middleware/auth');

const router = express.Router();



// Validation middleware
const validateStoreCreation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Store name must be between 2 and 255 characters'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean'),
  body('slug')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Store URL must be between 3 and 50 characters')
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Store URL can only contain lowercase letters, numbers, and hyphens')
    .custom((value) => {
      if (value.startsWith('-') || value.endsWith('-')) {
        throw new Error('Store URL cannot start or end with a hyphen');
      }
      if (value.includes('--')) {
        throw new Error('Store URL cannot contain consecutive hyphens');
      }
      return true;
    }),
  body('themeColor')
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Theme color must be a valid hex color')
];

const validateStoreUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Store name must be between 2 and 255 characters'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean'),
  body('slug')
    .optional()
    .isLength({ min: 3, max: 50 })
    .withMessage('Store URL must be between 3 and 50 characters')
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Store URL can only contain lowercase letters, numbers, and hyphens')
    .custom((value) => {
      if (value.startsWith('-') || value.endsWith('-')) {
        throw new Error('Store URL cannot start or end with a hyphen');
      }
      if (value.includes('--')) {
        throw new Error('Store URL cannot contain consecutive hyphens');
      }
      return true;
    }),
  body('themeColor')
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Theme color must be a valid hex color')
];

// Get current user's store
router.get('/my-store', verifyToken, async (req, res) => {
  try {
    const result = await query(
      `SELECT s.*, 
              COUNT(DISTINCT sp.product_id) as product_count,
              COALESCE(SUM(oi.commission_amount), 0) as total_earnings,
              COALESCE(SUM(oi.quantity), 0) as total_sales
       FROM stores s
       LEFT JOIN store_products sp ON s.id = sp.store_id
       LEFT JOIN order_items oi ON s.id = oi.store_id
       WHERE s.user_id = $1
       GROUP BY s.id`,
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.json({
        success: true,
        store: null,
        message: 'No store found. Create one to get started.'
      });
    }

    const store = result.rows[0];
    
    // Get recent analytics
    const analyticsResult = await query(
      `SELECT 
         COALESCE(SUM(views), 0) as total_views,
         COALESCE(SUM(orders), 0) as total_orders,
         COALESCE(SUM(revenue), 0) as total_revenue,
         CASE WHEN SUM(views) > 0 THEN ROUND((SUM(orders)::decimal / SUM(views)) * 100, 2) ELSE 0 END as conversion_rate
       FROM store_analytics 
       WHERE store_id = $1 AND date >= CURRENT_DATE - INTERVAL '30 days'`,
      [store.id]
    );

    const analytics = analyticsResult.rows[0];

    res.json({
      success: true,
      store: {
        id: store.id,
        name: store.name,
        description: store.description,
        slug: store.slug,
        logoUrl: store.logo_url,
        isPublic: store.is_public,
        themeColor: store.theme_color,
        productCount: parseInt(store.product_count),
        totalEarnings: parseFloat(store.total_earnings),
        totalSales: parseInt(store.total_sales),
        analytics: {
          totalViews: parseInt(analytics.total_views),
          totalOrders: parseInt(analytics.total_orders),
          totalRevenue: parseFloat(analytics.total_revenue),
          conversionRate: parseFloat(analytics.conversion_rate)
        },
        createdAt: store.created_at,
        updatedAt: store.updated_at
      }
    });

  } catch (error) {
    console.error('Get user store error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create a new store
router.post('/', verifyToken, validateStoreCreation, async (req, res) => {
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

    const { name, description, isPublic = true, slug, themeColor = '#007AFF' } = req.body;

    // Check if user already has a store
    const existingStore = await query(
      'SELECT id FROM stores WHERE user_id = $1',
      [req.userId]
    );

    if (existingStore.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'You already have a store. Each user can only have one store.'
      });
    }

    // Check if slug is unique
    const slugCheck = await query(
      'SELECT id FROM stores WHERE slug = $1',
      [slug]
    );

    if (slugCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'This store URL is already taken. Please choose a different one.'
      });
    }

    // Create store
    const result = await query(
      `INSERT INTO stores (user_id, name, description, slug, is_public, theme_color) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [req.userId, name, description, slug, isPublic, themeColor]
    );

    const store = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'Store created successfully',
      store: {
        id: store.id,
        name: store.name,
        description: store.description,
        slug: store.slug,
        logoUrl: store.logo_url,
        isPublic: store.is_public,
        themeColor: store.theme_color,
        createdAt: store.created_at,
        updatedAt: store.updated_at
      }
    });

  } catch (error) {
    console.error('Store creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update store
router.put('/:storeId', verifyToken, verifyStoreOwner, validateStoreUpdate, async (req, res) => {
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

    const { name, description, isPublic, slug, themeColor, logoUrl } = req.body;
    const storeId = req.params.storeId;

    const updateFields = [];
    const updateValues = [];
    let valueIndex = 1;

    // Handle name update
    if (name !== undefined) {
      updateFields.push(`name = $${valueIndex}`);
      updateValues.push(name);
      valueIndex++;
    }

    // Handle slug update with uniqueness check
    if (slug !== undefined) {
      // Check if the new slug conflicts with existing stores
      const slugCheck = await query(
        'SELECT id FROM stores WHERE slug = $1 AND id != $2',
        [slug, storeId]
      );

      if (slugCheck.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'This store URL is already taken. Please choose a different one.'
        });
      }

      updateFields.push(`slug = $${valueIndex}`);
      updateValues.push(slug);
      valueIndex++;
    }

    if (description !== undefined) {
      updateFields.push(`description = $${valueIndex}`);
      updateValues.push(description);
      valueIndex++;
    }

    if (isPublic !== undefined) {
      updateFields.push(`is_public = $${valueIndex}`);
      updateValues.push(isPublic);
      valueIndex++;
    }

    if (themeColor !== undefined) {
      updateFields.push(`theme_color = $${valueIndex}`);
      updateValues.push(themeColor);
      valueIndex++;
    }

    if (logoUrl !== undefined) {
      updateFields.push(`logo_url = $${valueIndex}`);
      updateValues.push(logoUrl);
      valueIndex++;
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    updateValues.push(storeId);

    const result = await query(
      `UPDATE stores 
       SET ${updateFields.join(', ')} 
       WHERE id = $${valueIndex} 
       RETURNING *`,
      updateValues
    );

    const store = result.rows[0];

    res.json({
      success: true,
      message: 'Store updated successfully',
      store: {
        id: store.id,
        name: store.name,
        description: store.description,
        slug: store.slug,
        logoUrl: store.logo_url,
        isPublic: store.is_public,
        themeColor: store.theme_color,
        createdAt: store.created_at,
        updatedAt: store.updated_at
      }
    });

  } catch (error) {
    console.error('Store update error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get public store by slug
router.get('/public/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await query(
      `SELECT s.*, u.first_name, u.last_name
       FROM stores s
       JOIN users u ON s.user_id = u.id
       WHERE s.slug = $1 AND s.is_public = true`,
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Store not found or not public'
      });
    }

    const store = result.rows[0];

    // Get store products
    const productsResult = await query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug,
              sp.custom_price, sp.is_featured, sp.added_at
       FROM store_products sp
       JOIN products p ON sp.product_id = p.id
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE sp.store_id = $1 AND p.is_active = true
       ORDER BY sp.is_featured DESC, sp.display_order ASC, sp.added_at DESC`,
      [store.id]
    );

    // Record store view
    const today = new Date().toISOString().split('T')[0];
    await query(
      `INSERT INTO store_analytics (store_id, date, views)
       VALUES ($1, $2, 1)
       ON CONFLICT (store_id, date)
       DO UPDATE SET views = store_analytics.views + 1`,
      [store.id, today]
    );

    res.json({
      success: true,
      store: {
        id: store.id,
        name: store.name,
        description: store.description,
        slug: store.slug,
        logoUrl: store.logo_url,
        themeColor: store.theme_color,
        owner: `${store.first_name} ${store.last_name}`,
        products: productsResult.rows.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          shortDescription: product.short_description,
          price: product.custom_price || product.price,
          originalPrice: product.original_price,
          rating: parseFloat(product.rating),
          reviewCount: product.review_count,
          imageUrl: product.image_url,
          imageUrls: product.image_urls,
          category: product.category_name,
          features: product.features,
          specifications: product.specifications,
          colors: product.colors,
          sizes: product.sizes,
          stockCount: product.stock_count,
          isFeatured: product.is_featured,
          fastShipping: product.fast_shipping,
          addedAt: product.added_at
        })),
        createdAt: store.created_at
      }
    });

  } catch (error) {
    console.error('Get public store error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get store products
router.get('/:storeId/products', verifyToken, verifyStoreOwner, async (req, res) => {
  try {
    const { storeId } = req.params;
    const { page = 1, limit = 20, search, category, featured } = req.query;
    
    const offset = (page - 1) * limit;
    let whereConditions = ['sp.store_id = $1', 'p.is_active = true'];
    let queryParams = [storeId];
    let paramIndex = 2;

    if (search) {
      whereConditions.push(`p.name ILIKE $${paramIndex}`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    if (category) {
      whereConditions.push(`c.slug = $${paramIndex}`);
      queryParams.push(category);
      paramIndex++;
    }

    if (featured !== undefined) {
      whereConditions.push(`sp.is_featured = $${paramIndex}`);
      queryParams.push(featured === 'true');
      paramIndex++;
    }

    const result = await query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug,
              sp.custom_price, sp.is_featured, sp.display_order, sp.added_at,
              COUNT(*) OVER() as total_count
       FROM store_products sp
       JOIN products p ON sp.product_id = p.id
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE ${whereConditions.join(' AND ')}
       ORDER BY sp.is_featured DESC, sp.display_order ASC, sp.added_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...queryParams, limit, offset]
    );

    const totalCount = result.rows.length > 0 ? parseInt(result.rows[0].total_count) : 0;
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      success: true,
      products: result.rows.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        shortDescription: product.short_description,
        price: product.custom_price || product.price,
        originalPrice: product.original_price,
        commissionAmount: product.commission_amount,
        rating: parseFloat(product.rating),
        reviewCount: product.review_count,
        imageUrl: product.image_url,
        imageUrls: product.image_urls,
        category: product.category_name,
        categorySlug: product.category_slug,
        features: product.features,
        specifications: product.specifications,
        colors: product.colors,
        sizes: product.sizes,
        stockCount: product.stock_count,
        isFeatured: product.is_featured,
        displayOrder: product.display_order,
        fastShipping: product.fast_shipping,
        addedAt: product.added_at
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
    console.error('Get store products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Add product to store
router.post('/:storeId/products', verifyToken, verifyStoreOwner, [
  body('productId')
    .isInt({ min: 1 })
    .withMessage('Valid product ID is required'),
  body('customPrice')
    .optional()
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage('Custom price must be a valid decimal'),
  body('isFeatured')
    .optional()
    .isBoolean()
    .withMessage('isFeatured must be a boolean'),
  body('displayOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Display order must be a non-negative integer')
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

    const { storeId } = req.params;
    const { productId, customPrice, isFeatured = false, displayOrder = 0 } = req.body;

    // Check if product exists and is active
    const productCheck = await query(
      'SELECT id, name FROM products WHERE id = $1 AND is_active = true',
      [productId]
    );

    if (productCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or not active'
      });
    }

    // Check if product is already in store
    const existingProduct = await query(
      'SELECT id FROM store_products WHERE store_id = $1 AND product_id = $2',
      [storeId, productId]
    );

    if (existingProduct.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Product is already in your store'
      });
    }

    // Add product to store
    const result = await query(
      `INSERT INTO store_products (store_id, product_id, custom_price, is_featured, display_order)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [storeId, productId, customPrice, isFeatured, displayOrder]
    );

    res.status(201).json({
      success: true,
      message: 'Product added to store successfully',
      storeProduct: result.rows[0]
    });

  } catch (error) {
    console.error('Add product to store error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Remove product from store
router.delete('/:storeId/products/:productId', verifyToken, verifyStoreOwner, async (req, res) => {
  try {
    const { storeId, productId } = req.params;

    const result = await query(
      'DELETE FROM store_products WHERE store_id = $1 AND product_id = $2 RETURNING *',
      [storeId, productId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in store'
      });
    }

    res.json({
      success: true,
      message: 'Product removed from store successfully'
    });

  } catch (error) {
    console.error('Remove product from store error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update store product settings
router.put('/:storeId/products/:productId', verifyToken, verifyStoreOwner, [
  body('customPrice')
    .optional()
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage('Custom price must be a valid decimal'),
  body('isFeatured')
    .optional()
    .isBoolean()
    .withMessage('isFeatured must be a boolean'),
  body('displayOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Display order must be a non-negative integer')
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

    const { storeId, productId } = req.params;
    const { customPrice, isFeatured, displayOrder } = req.body;

    const updateFields = [];
    const updateValues = [];
    let valueIndex = 1;

    if (customPrice !== undefined) {
      updateFields.push(`custom_price = $${valueIndex}`);
      updateValues.push(customPrice);
      valueIndex++;
    }

    if (isFeatured !== undefined) {
      updateFields.push(`is_featured = $${valueIndex}`);
      updateValues.push(isFeatured);
      valueIndex++;
    }

    if (displayOrder !== undefined) {
      updateFields.push(`display_order = $${valueIndex}`);
      updateValues.push(displayOrder);
      valueIndex++;
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    updateValues.push(storeId, productId);

    const result = await query(
      `UPDATE store_products 
       SET ${updateFields.join(', ')} 
       WHERE store_id = $${valueIndex} AND product_id = $${valueIndex + 1}
       RETURNING *`,
      updateValues
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in store'
      });
    }

    res.json({
      success: true,
      message: 'Store product updated successfully',
      storeProduct: result.rows[0]
    });

  } catch (error) {
    console.error('Update store product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
