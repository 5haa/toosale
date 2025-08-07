-- Create stores table
CREATE TABLE IF NOT EXISTS stores (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  logo_url VARCHAR(500),
  custom_domain VARCHAR(255),
  is_public BOOLEAN DEFAULT TRUE,
  theme_color VARCHAR(7) DEFAULT '#007AFF',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_stores_user_id ON stores(user_id);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_stores_slug ON stores(slug);

-- Create index on is_public for faster public store queries
CREATE INDEX IF NOT EXISTS idx_stores_is_public ON stores(is_public);

-- Trigger to update updated_at column
CREATE OR REPLACE FUNCTION update_stores_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_stores_updated_at 
    BEFORE UPDATE ON stores 
    FOR EACH ROW 
    EXECUTE FUNCTION update_stores_updated_at();
