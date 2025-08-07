const express = require('express');
const { body, validationResult, param, query: expressQuery } = require('express-validator');
const { query } = require('../config/database');
const { verifyToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM categories ORDER BY name ASC'
    );

    res.json({
      success: true,
      categories: result.rows.map(category => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        createdAt: category.created_at
      }))
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get products catalog (public endpoint with optional auth for store status)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      category, 
      minPrice, 
      maxPrice, 
      sortBy = 'created_at', 
      sortOrder = 'DESC',
      trending,
      fastShipping 
    } = req.query;

    const offset = (page - 1) * limit;
    let whereConditions = ['p.is_active = true'];
    let queryParams = [];
    let paramIndex = 1;

    // Search filter
    if (search) {
      whereConditions.push(`(p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex} OR array_to_string(p.tags, ' ') ILIKE $${paramIndex})`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    // Category filter
    if (category) {
      whereConditions.push(`c.slug = $${paramIndex}`);
      queryParams.push(category);
      paramIndex++;
    }

    // Price filters
    if (minPrice) {
      whereConditions.push(`p.price >= $${paramIndex}`);
      queryParams.push(parseFloat(minPrice));
      paramIndex++;
    }

    if (maxPrice) {
      whereConditions.push(`p.price <= $${paramIndex}`);
      queryParams.push(parseFloat(maxPrice));
      paramIndex++;
    }

    // Trending filter
    if (trending === 'true') {
      whereConditions.push('p.trending = true');
    }

    // Fast shipping filter
    if (fastShipping === 'true') {
      whereConditions.push('p.fast_shipping = true');
    }

    // Validate sort fields
    const validSortFields = ['name', 'price', 'rating', 'created_at', 'review_count'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const sortDirection = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Get user's store if authenticated
    let userStoreId = null;
    if (req.userId) {
      const storeResult = await query(
        'SELECT id FROM stores WHERE user_id = $1',
        [req.userId]
      );
      if (storeResult.rows.length > 0) {
        userStoreId = storeResult.rows[0].id;
      }
    }

    // Build the main query
    let selectQuery = `
      SELECT p.*, c.name as category_name, c.slug as category_slug,
             COUNT(*) OVER() as total_count`;

    if (userStoreId) {
      selectQuery += `,
             CASE WHEN sp.store_id IS NOT NULL THEN true ELSE false END as in_store`;
    }

    let fromQuery = `
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id`;

    if (userStoreId) {
      fromQuery += `
      LEFT JOIN store_products sp ON p.id = sp.product_id AND sp.store_id = ${userStoreId}`;
    }

    const fullQuery = `
      ${selectQuery}
      ${fromQuery}
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY p.${sortField} ${sortDirection}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);

    const result = await query(fullQuery, queryParams);

    const totalCount = result.rows.length > 0 ? parseInt(result.rows[0].total_count) : 0;
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      success: true,
      products: result.rows.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        shortDescription: product.short_description,
        price: parseFloat(product.price),
        originalPrice: product.original_price ? parseFloat(product.original_price) : null,
        commissionRate: parseFloat(product.commission_rate),
        commissionAmount: parseFloat(product.commission_amount),
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
        sku: product.sku,
        trending: product.trending,
        fastShipping: product.fast_shipping,
        inStore: userStoreId ? product.in_store : undefined,
        createdAt: product.created_at,
        updatedAt: product.updated_at
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
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get single product by ID
router.get('/:productId', [
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

    const result = await query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = $1 AND p.is_active = true`,
      [productId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const product = result.rows[0];

    // Record product view
    const today = new Date().toISOString().split('T')[0];
    await query(
      `INSERT INTO store_analytics (store_id, date, product_views)
       SELECT s.id, $1, 1 
       FROM stores s
       WHERE s.is_public = true
       ON CONFLICT (store_id, date)
       DO UPDATE SET product_views = store_analytics.product_views + 1`,
      [today]
    );

    res.json({
      success: true,
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        shortDescription: product.short_description,
        price: parseFloat(product.price),
        originalPrice: product.original_price ? parseFloat(product.original_price) : null,
        commissionRate: parseFloat(product.commission_rate),
        commissionAmount: parseFloat(product.commission_amount),
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
        sku: product.sku,
        weight: product.weight ? parseFloat(product.weight) : null,
        dimensions: product.dimensions,
        shippingCost: parseFloat(product.shipping_cost),
        tags: product.tags,
        trending: product.trending,
        fastShipping: product.fast_shipping,
        createdAt: product.created_at,
        updatedAt: product.updated_at
      }
    });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get trending products
router.get('/trending/list', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const result = await query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.is_active = true AND p.trending = true
       ORDER BY p.rating DESC, p.review_count DESC
       LIMIT $1`,
      [limit]
    );

    res.json({
      success: true,
      products: result.rows.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        shortDescription: product.short_description,
        price: parseFloat(product.price),
        originalPrice: product.original_price ? parseFloat(product.original_price) : null,
        commissionAmount: parseFloat(product.commission_amount),
        rating: parseFloat(product.rating),
        reviewCount: product.review_count,
        imageUrl: product.image_url,
        category: product.category_name,
        categorySlug: product.category_slug,
        stockCount: product.stock_count,
        trending: product.trending,
        fastShipping: product.fast_shipping
      }))
    });

  } catch (error) {
    console.error('Get trending products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get featured products
router.get('/featured/list', async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const result = await query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.is_active = true
       ORDER BY p.rating DESC, p.review_count DESC
       LIMIT $1`,
      [limit]
    );

    res.json({
      success: true,
      products: result.rows.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        shortDescription: product.short_description,
        price: parseFloat(product.price),
        originalPrice: product.original_price ? parseFloat(product.original_price) : null,
        commissionAmount: parseFloat(product.commission_amount),
        rating: parseFloat(product.rating),
        reviewCount: product.review_count,
        imageUrl: product.image_url,
        category: product.category_name,
        categorySlug: product.category_slug,
        stockCount: product.stock_count,
        trending: product.trending,
        fastShipping: product.fast_shipping
      }))
    });

  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get products by category
router.get('/category/:categorySlug', async (req, res) => {
  try {
    const { categorySlug } = req.params;
    const { page = 1, limit = 20, sortBy = 'created_at', sortOrder = 'DESC' } = req.query;

    const offset = (page - 1) * limit;

    // Validate sort fields
    const validSortFields = ['name', 'price', 'rating', 'created_at', 'review_count'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const sortDirection = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const result = await query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug,
              COUNT(*) OVER() as total_count
       FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE p.is_active = true AND c.slug = $1
       ORDER BY p.${sortField} ${sortDirection}
       LIMIT $2 OFFSET $3`,
      [categorySlug, limit, offset]
    );

    if (result.rows.length === 0) {
      // Check if category exists
      const categoryCheck = await query(
        'SELECT name FROM categories WHERE slug = $1',
        [categorySlug]
      );

      if (categoryCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }
    }

    const totalCount = result.rows.length > 0 ? parseInt(result.rows[0].total_count) : 0;
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      success: true,
      products: result.rows.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        shortDescription: product.short_description,
        price: parseFloat(product.price),
        originalPrice: product.original_price ? parseFloat(product.original_price) : null,
        commissionAmount: parseFloat(product.commission_amount),
        rating: parseFloat(product.rating),
        reviewCount: product.review_count,
        imageUrl: product.image_url,
        imageUrls: product.image_urls,
        category: product.category_name,
        categorySlug: product.category_slug,
        features: product.features,
        colors: product.colors,
        sizes: product.sizes,
        stockCount: product.stock_count,
        trending: product.trending,
        fastShipping: product.fast_shipping,
        createdAt: product.created_at
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      category: result.rows.length > 0 ? {
        name: result.rows[0].category_name,
        slug: result.rows[0].category_slug
      } : null
    });

  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Search products
router.get('/search/query', async (req, res) => {
  try {
    const { q, page = 1, limit = 20, category, minPrice, maxPrice } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    const offset = (page - 1) * limit;
    let whereConditions = ['p.is_active = true'];
    let queryParams = [];
    let paramIndex = 1;

    // Add search condition
    whereConditions.push(`(p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex} OR array_to_string(p.tags, ' ') ILIKE $${paramIndex})`);
    queryParams.push(`%${q.trim()}%`);
    paramIndex++;

    // Category filter
    if (category) {
      whereConditions.push(`c.slug = $${paramIndex}`);
      queryParams.push(category);
      paramIndex++;
    }

    // Price filters
    if (minPrice) {
      whereConditions.push(`p.price >= $${paramIndex}`);
      queryParams.push(parseFloat(minPrice));
      paramIndex++;
    }

    if (maxPrice) {
      whereConditions.push(`p.price <= $${paramIndex}`);
      queryParams.push(parseFloat(maxPrice));
      paramIndex++;
    }

    queryParams.push(limit, offset);

    const result = await query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug,
              COUNT(*) OVER() as total_count
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE ${whereConditions.join(' AND ')}
       ORDER BY 
         CASE WHEN p.name ILIKE $1 THEN 1 ELSE 2 END,
         p.rating DESC, p.review_count DESC
       LIMIT $${paramIndex - 1} OFFSET $${paramIndex}`,
      queryParams
    );

    const totalCount = result.rows.length > 0 ? parseInt(result.rows[0].total_count) : 0;
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      success: true,
      query: q.trim(),
      products: result.rows.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        shortDescription: product.short_description,
        price: parseFloat(product.price),
        originalPrice: product.original_price ? parseFloat(product.original_price) : null,
        commissionAmount: parseFloat(product.commission_amount),
        rating: parseFloat(product.rating),
        reviewCount: product.review_count,
        imageUrl: product.image_url,
        category: product.category_name,
        categorySlug: product.category_slug,
        stockCount: product.stock_count,
        trending: product.trending,
        fastShipping: product.fast_shipping
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
    console.error('Search products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
