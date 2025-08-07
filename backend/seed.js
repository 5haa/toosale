const { query, connectDB } = require('./config/database');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await connectDB();
    
    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🧹 Clearing existing data...');
    await query('DELETE FROM notifications');
    await query('DELETE FROM support_messages');
    await query('DELETE FROM support_tickets');
    await query('DELETE FROM order_items');
    await query('DELETE FROM orders');
    await query('DELETE FROM store_products');
    await query('DELETE FROM wallet_transactions');
    await query('DELETE FROM wallets');
    await query('DELETE FROM stores');
    await query('DELETE FROM users WHERE email != \'admin@toosale.com\'');
    
    // Hash password for users
    const passwordHash = await bcrypt.hash('password123', 12);
    const adminPasswordHash = await bcrypt.hash('AdminPassword123!', 12);
    
    // 1. Seed Users
    console.log('👥 Seeding users...');
    const usersResult = await query(`
      INSERT INTO users (first_name, last_name, email, password_hash, role, is_verified, created_at)
      VALUES 
        ('John', 'Doe', 'john.doe@example.com', $1, 'user', true, NOW() - INTERVAL '30 days'),
        ('Jane', 'Smith', 'jane.smith@example.com', $1, 'user', true, NOW() - INTERVAL '25 days'),
        ('Bob', 'Johnson', 'bob.johnson@example.com', $1, 'user', true, NOW() - INTERVAL '20 days'),
        ('Alice', 'Wilson', 'alice.wilson@example.com', $1, 'user', true, NOW() - INTERVAL '15 days'),
        ('Charlie', 'Brown', 'charlie.brown@example.com', $1, 'user', true, NOW() - INTERVAL '10 days'),
        ('Diana', 'Davis', 'diana.davis@example.com', $1, 'user', true, NOW() - INTERVAL '5 days'),
        ('Emma', 'Taylor', 'emma.taylor@example.com', $1, 'user', true, NOW() - INTERVAL '3 days'),
        ('Frank', 'Miller', 'frank.miller@example.com', $1, 'user', true, NOW() - INTERVAL '1 day'),
        ('Grace', 'Anderson', 'grace.anderson@example.com', $1, 'admin', true, NOW() - INTERVAL '45 days'),
        ('Henry', 'Thompson', 'henry.thompson@example.com', $1, 'admin', true, NOW() - INTERVAL '40 days')
      RETURNING id, first_name, last_name, email, role
    `, [passwordHash]);
    
    const users = usersResult.rows;
    console.log(`✅ Created ${users.length} users`);
    
    // Update admin user password
    await query(`
      UPDATE users 
      SET password_hash = $1, first_name = 'Super', last_name = 'Admin'
      WHERE email = 'admin@toosale.com'
    `, [adminPasswordHash]);
    
    // Get all users including the existing admin
    const allUsersResult = await query('SELECT * FROM users ORDER BY id');
    const allUsers = allUsersResult.rows;
    const regularUsers = allUsers.filter(u => u.role === 'user');
    const adminUsers = allUsers.filter(u => u.role === 'admin');
    
    // 2. Create wallets for users
    console.log('💰 Creating wallets...');
    for (const user of regularUsers) {
      const walletAddress = `0x${Math.random().toString(16).substring(2, 42).padStart(40, '0')}`;
      const privateKey = `0x${Math.random().toString(16).substring(2, 66).padStart(64, '0')}`;
      
      await query(`
        INSERT INTO wallets (user_id, wallet_address, private_key_encrypted, balance, created_at)
        VALUES ($1, $2, $3, $4, NOW() - INTERVAL '${Math.floor(Math.random() * 30)} days')
      `, [
        user.id, 
        walletAddress,
        `encrypted:${privateKey}`, // Simulated encrypted private key
        Math.floor(Math.random() * 5000) + 100 // Random balance between 100-5100
      ]);
    }
    
    // 3. Seed Stores
    console.log('🏪 Seeding stores...');
    const storeNames = [
      'Tech Haven', 'Fashion Forward', 'Home Essentials', 'Gadget Galaxy', 
      'Style Studio', 'Digital Dreams', 'Comfort Corner', 'Trendy Treasures'
    ];
    
    const stores = [];
    for (let i = 0; i < Math.min(storeNames.length, regularUsers.length); i++) {
      const user = regularUsers[i];
      const storeName = storeNames[i];
      const slug = storeName.toLowerCase().replace(/\s+/g, '-');
      
      const storeResult = await query(`
        INSERT INTO stores (user_id, name, description, slug, is_public, theme_color, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW() - INTERVAL '${Math.floor(Math.random() * 25)} days')
        RETURNING *
      `, [
        user.id,
        storeName,
        `Welcome to ${storeName}! We offer the best products with excellent customer service.`,
        slug,
        true,
        ['#007AFF', '#FF3B30', '#34C759', '#FF9500', '#AF52DE', '#FF2D92'][Math.floor(Math.random() * 6)]
      ]);
      
      stores.push(storeResult.rows[0]);
    }
    console.log(`✅ Created ${stores.length} stores`);
    
    // 4. Add products to stores
    console.log('📦 Adding products to stores...');
    const existingProductsResult = await query('SELECT * FROM products LIMIT 20');
    const existingProducts = existingProductsResult.rows;
    
    if (existingProducts.length > 0) {
      for (const store of stores) {
        // Add 3-8 random products to each store
        const productCount = Math.floor(Math.random() * 6) + 3;
        const selectedProducts = existingProducts
          .sort(() => 0.5 - Math.random())
          .slice(0, productCount);
        
        for (const product of selectedProducts) {
          // Check if product is already in store
          const existingStoreProduct = await query(
            'SELECT id FROM store_products WHERE store_id = $1 AND product_id = $2',
            [store.id, product.id]
          );
          
          if (existingStoreProduct.rows.length === 0) {
            await query(`
              INSERT INTO store_products (store_id, product_id, is_featured, display_order, added_at)
              VALUES ($1, $2, $3, $4, NOW() - INTERVAL '${Math.floor(Math.random() * 20)} days')
            `, [
              store.id,
              product.id,
              Math.random() < 0.3, // 30% chance of being featured
              Math.floor(Math.random() * 100)
            ]);
          }
        }
      }
    }
    
    // 5. Create dummy orders
    console.log('📋 Creating dummy orders...');
    const orderStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    const paymentMethods = ['credit_card', 'paypal', 'stripe', 'bank_transfer'];
    
    for (let i = 0; i < 25; i++) {
      const store = stores[Math.floor(Math.random() * stores.length)];
      const status = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
      const paymentStatus = status === 'cancelled' ? 'failed' : (Math.random() < 0.8 ? 'completed' : 'pending');
      const subtotal = Math.floor(Math.random() * 500) + 50;
      const shipping = Math.floor(Math.random() * 20) + 5;
      const tax = Math.floor(subtotal * 0.08 * 100) / 100;
      const total = subtotal + shipping + tax;
      
      const orderResult = await query(`
        INSERT INTO orders (
          order_number, store_id, customer_email, customer_name, customer_phone,
          shipping_address, subtotal, shipping_cost, tax_amount, total_amount,
          status, payment_status, payment_method, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING *
      `, [
        `ORD-${Date.now()}-${i}`,
        store.id,
        `customer${i}@example.com`,
        `Customer ${i + 1}`,
        `+1-555-${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        JSON.stringify({
          street: `${Math.floor(Math.random() * 9999) + 1} Main St`,
          city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)],
          state: ['NY', 'CA', 'IL', 'TX', 'AZ'][Math.floor(Math.random() * 5)],
          zipCode: String(Math.floor(Math.random() * 90000) + 10000),
          country: 'USA'
        }),
        subtotal,
        shipping,
        tax,
        total,
        status,
        paymentStatus,
        paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)), // Random date in last 30 days
        new Date()
      ]);
      
      // Add order items
      const order = orderResult.rows[0];
      const itemCount = Math.floor(Math.random() * 3) + 1; // 1-3 items per order
      
      if (existingProducts.length > 0) {
        for (let j = 0; j < itemCount; j++) {
          const product = existingProducts[Math.floor(Math.random() * existingProducts.length)];
          const quantity = Math.floor(Math.random() * 3) + 1;
          const unitPrice = product.price || Math.floor(Math.random() * 100) + 10;
          const itemTotal = unitPrice * quantity;
          const commission = Math.floor(itemTotal * (product.commission_rate || 10) / 100 * 100) / 100;
          
          await query(`
            INSERT INTO order_items (
              order_id, product_id, store_id, quantity, unit_price, 
              total_price, commission_amount, created_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `, [
            order.id, product.id, store.id, quantity, unitPrice,
            itemTotal, commission, order.created_at
          ]);
        }
      }
    }
    console.log('✅ Created 25 dummy orders');
    
    // 6. Create support tickets
    console.log('🎫 Creating support tickets...');
    const ticketSubjects = [
      'Payment issue with my recent order',
      'Unable to access my account',
      'Product not matching description',
      'Refund request for order #12345',
      'Store setup assistance needed',
      'Commission calculation question',
      'Website performance issues',
      'How to add products to my store',
      'Shipping address update request',
      'Account verification problems'
    ];
    
    const ticketCategories = ['payment', 'technical', 'account', 'products', 'orders', 'general'];
    const ticketPriorities = ['low', 'medium', 'high'];
    const ticketStatuses = ['open', 'in_progress', 'resolved'];
    
    for (let i = 0; i < 15; i++) {
      const user = regularUsers[Math.floor(Math.random() * regularUsers.length)];
      const subject = ticketSubjects[Math.floor(Math.random() * ticketSubjects.length)];
      const category = ticketCategories[Math.floor(Math.random() * ticketCategories.length)];
      const priority = ticketPriorities[Math.floor(Math.random() * ticketPriorities.length)];
      const status = ticketStatuses[Math.floor(Math.random() * ticketStatuses.length)];
      const assignedAdmin = Math.random() < 0.7 ? adminUsers[Math.floor(Math.random() * adminUsers.length)].id : null;
      
      const ticketResult = await query(`
        INSERT INTO support_tickets (
          user_id, subject, category, priority, status, assigned_admin_id,
          created_at, updated_at, resolved_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `, [
        user.id, subject, category, priority, status, assignedAdmin,
        new Date(Date.now() - Math.floor(Math.random() * 20 * 24 * 60 * 60 * 1000)), // Random date in last 20 days
        new Date(),
        status === 'resolved' ? new Date() : null
      ]);
      
      const ticket = ticketResult.rows[0];
      
      // Add initial message from user
      await query(`
        INSERT INTO support_messages (ticket_id, sender_id, message, created_at)
        VALUES ($1, $2, $3, $4)
      `, [
        ticket.id,
        user.id,
        `Hi, I need help with ${subject.toLowerCase()}. This is urgent and I would appreciate a quick response. Thank you!`,
        ticket.created_at
      ]);
      
      // Add some back-and-forth messages
      const messageCount = Math.floor(Math.random() * 4) + 1; // 1-4 additional messages
      for (let j = 0; j < messageCount; j++) {
        const isAdminMessage = j % 2 === 0; // Alternate between admin and user
        const senderId = isAdminMessage ? 
          (assignedAdmin || adminUsers[0].id) : 
          user.id;
        
        const adminMessages = [
          'Thank you for contacting support. I\'m looking into your issue.',
          'I\'ve reviewed your account and found the issue. Let me help you resolve this.',
          'Could you please provide more details about when this started happening?',
          'I\'ve processed your request. The issue should be resolved now.',
          'Is there anything else I can help you with today?'
        ];
        
        const userMessages = [
          'Thank you for the quick response!',
          'The issue started happening yesterday.',
          'I tried that but it didn\'t work. Can you suggest something else?',
          'Perfect! That solved the problem. Thank you so much!',
          'No, that\'s all for now. Great service!'
        ];
        
        const message = isAdminMessage ? 
          adminMessages[Math.floor(Math.random() * adminMessages.length)] :
          userMessages[Math.floor(Math.random() * userMessages.length)];
        
        await query(`
          INSERT INTO support_messages (ticket_id, sender_id, message, created_at)
          VALUES ($1, $2, $3, $4)
        `, [
          ticket.id,
          senderId,
          message,
          new Date(ticket.created_at.getTime() + (j + 1) * 2 * 60 * 60 * 1000) // 2 hours apart
        ]);
      }
    }
    console.log('✅ Created 15 support tickets with messages');
    
    // 7. Create notifications
    console.log('🔔 Creating notifications...');
    const notificationTypes = [
      'support_ticket_created',
      'support_message',
      'order_placed',
      'payment_received',
      'new_user_registered'
    ];
    
    // Create notifications for admins
    for (const admin of adminUsers) {
      for (let i = 0; i < 8; i++) {
        const type = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
        let title, message;
        
        switch (type) {
          case 'support_ticket_created':
            title = 'New Support Ticket';
            message = 'A new support ticket has been created and needs attention.';
            break;
          case 'support_message':
            title = 'New Support Message';
            message = 'You have received a new message on a support ticket.';
            break;
          case 'order_placed':
            title = 'New Order';
            message = 'A new order has been placed on the platform.';
            break;
          case 'payment_received':
            title = 'Payment Received';
            message = 'A payment has been successfully processed.';
            break;
          case 'new_user_registered':
            title = 'New User Registration';
            message = 'A new user has registered on the platform.';
            break;
        }
        
        await query(`
          INSERT INTO notifications (user_id, type, title, message, is_read, created_at)
          VALUES ($1, $2, $3, $4, $5, $6)
        `, [
          admin.id, type, title, message,
          Math.random() < 0.3, // 30% chance of being read
          new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)) // Random date in last 7 days
        ]);
      }
    }
    
    // Create some notifications for regular users
    for (const user of regularUsers.slice(0, 5)) {
      for (let i = 0; i < 3; i++) {
        await query(`
          INSERT INTO notifications (user_id, type, title, message, is_read, created_at)
          VALUES ($1, $2, $3, $4, $5, $6)
        `, [
          user.id,
          'support_message',
          'Support Reply',
          'You have received a reply to your support ticket.',
          Math.random() < 0.5,
          new Date(Date.now() - Math.floor(Math.random() * 5 * 24 * 60 * 60 * 1000))
        ]);
      }
    }
    console.log('✅ Created notifications for users and admins');
    
    // 8. Add some wallet transactions
    console.log('💳 Creating wallet transactions...');
    const transactionTypes = ['deposit', 'withdrawal', 'sale', 'purchase'];
    
    for (const user of regularUsers) {
      const walletResult = await query('SELECT id, balance FROM wallets WHERE user_id = $1', [user.id]);
      if (walletResult.rows.length > 0) {
        const wallet = walletResult.rows[0];
        let currentBalance = parseFloat(wallet.balance);
        
        // Create 3-7 transactions per user
        const txCount = Math.floor(Math.random() * 5) + 3;
        for (let i = 0; i < txCount; i++) {
          const transactionType = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
          const amount = Math.floor(Math.random() * 500) + 10;
          const balanceBefore = currentBalance;
          
          // Calculate balance after based on transaction type
          if (transactionType === 'deposit' || transactionType === 'sale') {
            currentBalance += amount;
          } else {
            currentBalance = Math.max(0, currentBalance - amount); // Don't go negative
          }
          
          await query(`
            INSERT INTO wallet_transactions (
              wallet_id, user_id, transaction_type, amount, balance_before, balance_after,
              description, status, created_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          `, [
            wallet.id,
            user.id,
            transactionType,
            amount,
            balanceBefore,
            currentBalance,
            `${transactionType.charAt(0).toUpperCase() + transactionType.slice(1)} transaction`,
            Math.random() < 0.9 ? 'completed' : 'pending',
            new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
          ]);
        }
      }
    }
    console.log('✅ Created wallet transactions');
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`👥 Users: ${allUsers.length} (${regularUsers.length} regular, ${adminUsers.length} admin)`);
    console.log(`🏪 Stores: ${stores.length}`);
    console.log(`📋 Orders: 25`);
    console.log(`🎫 Support Tickets: 15`);
    console.log(`🔔 Notifications: ${adminUsers.length * 8 + 5 * 3}`);
    console.log('\n🔑 Login Credentials:');
    console.log('Admin: admin@toosale.com / AdminPassword123!');
    console.log('User: john.doe@example.com / password123');
    console.log('User: jane.smith@example.com / password123');
    console.log('(All seeded users use password: password123)');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
