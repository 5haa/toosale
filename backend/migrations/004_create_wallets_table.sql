-- Create wallets table
CREATE TABLE IF NOT EXISTS wallets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  wallet_address VARCHAR(42) NOT NULL UNIQUE, -- EVM address format (Polygon compatible)
  private_key_encrypted TEXT NOT NULL, -- Encrypted private key
  balance DECIMAL(18, 6) DEFAULT 0.00, -- USDT balance with 6 decimal places
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);

-- Create index on wallet_address for faster lookups
CREATE INDEX IF NOT EXISTS idx_wallets_address ON wallets(wallet_address);

-- Create unique constraint to ensure one wallet per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_wallets_user_unique ON wallets(user_id) WHERE is_active = TRUE;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON wallets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
