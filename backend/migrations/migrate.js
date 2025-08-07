const fs = require('fs');
const path = require('path');
const { query } = require('../config/database');

const runMigration = async (filename) => {
  try {
    console.log(`Running migration: ${filename}`);
    const sql = fs.readFileSync(path.join(__dirname, filename), 'utf8');
    await query(sql);
    console.log(`✅ Migration ${filename} completed successfully`);
  } catch (error) {
    console.error(`❌ Migration ${filename} failed:`, error.message);
    throw error;
  }
};

const runAllMigrations = async () => {
  try {
    console.log('Starting database migrations...');
    
    // Get all .sql files in the migrations directory
    const migrationFiles = fs.readdirSync(__dirname)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Run migrations in alphabetical order
    
    if (migrationFiles.length === 0) {
      console.log('No migration files found');
      return;
    }

    for (const file of migrationFiles) {
      await runMigration(file);
    }
    
    console.log('🎉 All migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration process failed:', error.message);
    process.exit(1);
  }
};

// Run migrations if this file is executed directly
if (require.main === module) {
  runAllMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { runMigration, runAllMigrations };
