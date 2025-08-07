const fs = require('fs');
const path = require('path');
const { query, connectDB } = require('../config/database');

async function runMigrations() {
  try {
    console.log('🔄 Starting database migrations...');
    
    // Connect to database
    await connectDB();
    
    // Create migrations table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Get list of migration files
    const migrationDir = __dirname;
    const migrationFiles = fs.readdirSync(migrationDir)
      .filter(file => file.endsWith('.sql') && file !== 'migrate.js')
      .sort();
    
    console.log(`📁 Found ${migrationFiles.length} migration files`);
    
    // Get already executed migrations
    const executedResult = await query('SELECT filename FROM migrations');
    const executedMigrations = executedResult.rows.map(row => row.filename);
    
    // Run pending migrations
    for (const filename of migrationFiles) {
      if (executedMigrations.includes(filename)) {
        console.log(`⏩ Skipping ${filename} (already executed)`);
        continue;
      }
      
      console.log(`🚀 Executing ${filename}...`);
      
      try {
        // Read and execute migration file
        const migrationPath = path.join(migrationDir, filename);
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
        
        // Execute migration
        await query(migrationSQL);
        
        // Record migration as executed
        await query(
          'INSERT INTO migrations (filename) VALUES ($1)',
          [filename]
        );
        
        console.log(`✅ Successfully executed ${filename}`);
        
      } catch (error) {
        console.error(`❌ Failed to execute ${filename}:`, error.message);
        throw error;
      }
    }
    
    console.log('🎉 All migrations completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations };