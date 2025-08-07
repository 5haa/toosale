-- Create deposit_intents table to track queued crypto deposits for verification
CREATE TABLE IF NOT EXISTS deposit_intents (
  id SERIAL PRIMARY KEY,
  wallet_id INTEGER NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_symbol VARCHAR(16) NOT NULL DEFAULT 'USDT',
  network VARCHAR(32) NOT NULL DEFAULT 'polygon',
  amount_expected DECIMAL(18, 6) NOT NULL,
  amount_confirmed DECIMAL(18, 6),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'expired', 'failed', 'cancelled')),
  tx_hash VARCHAR(66),
  last_checked_block BIGINT,
  notes TEXT,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL '30 minutes')
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_deposit_intents_user_id ON deposit_intents(user_id);
CREATE INDEX IF NOT EXISTS idx_deposit_intents_wallet_id ON deposit_intents(wallet_id);
CREATE INDEX IF NOT EXISTS idx_deposit_intents_status ON deposit_intents(status);
CREATE INDEX IF NOT EXISTS idx_deposit_intents_expires_at ON deposit_intents(expires_at);

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_deposit_intents_updated_at BEFORE UPDATE ON deposit_intents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


