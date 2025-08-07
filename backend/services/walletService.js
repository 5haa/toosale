const { ethers } = require('ethers');
const crypto = require('crypto');
const { query } = require('../config/database');

class WalletService {
  constructor() {
    // Get encryption key from environment or generate one (should be in .env in production)
    const key = process.env.WALLET_ENCRYPTION_KEY || 'your-32-character-secret-key-here';
    this.encryptionKey = crypto.scryptSync(key, 'salt', 32); // Derive a 32-byte key
    this.algorithm = 'aes-256-cbc';
    
    // USDT Contract Address on Ethereum Mainnet
    this.USDT_CONTRACT_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
    
    // If you want to use testnet for development
    this.isTestnet = process.env.NODE_ENV !== 'production';
  }

  /**
   * Generate a new Ethereum wallet
   * @returns {Object} wallet object with address and private key
   */
  generateWallet() {
    try {
      // Create a random wallet
      const wallet = ethers.Wallet.createRandom();
      
      return {
        address: wallet.address,
        privateKey: wallet.privateKey,
        mnemonic: wallet.mnemonic?.phrase || null
      };
    } catch (error) {
      console.error('Error generating wallet:', error);
      throw new Error('Failed to generate wallet');
    }
  }

  /**
   * Encrypt a private key
   * @param {string} privateKey - The private key to encrypt
   * @returns {string} encrypted private key
   */
  encryptPrivateKey(privateKey) {
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(this.algorithm, this.encryptionKey, iv);
      
      let encrypted = cipher.update(privateKey, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      // Combine IV and encrypted data
      return iv.toString('hex') + ':' + encrypted;
    } catch (error) {
      console.error('Error encrypting private key:', error);
      throw new Error('Failed to encrypt private key');
    }
  }

  /**
   * Decrypt a private key
   * @param {string} encryptedPrivateKey - The encrypted private key
   * @returns {string} decrypted private key
   */
  decryptPrivateKey(encryptedPrivateKey) {
    try {
      const [ivHex, encrypted] = encryptedPrivateKey.split(':');
      const iv = Buffer.from(ivHex, 'hex');
      
      const decipher = crypto.createDecipheriv(this.algorithm, this.encryptionKey, iv);
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      console.error('Error decrypting private key:', error);
      throw new Error('Failed to decrypt private key');
    }
  }

  /**
   * Create a new wallet for a user
   * @param {number} userId - The user ID
   * @returns {Object} wallet data
   */
  async createUserWallet(userId) {
    try {
      // Check if user already has an active wallet
      const existingWallet = await query(
        'SELECT id, wallet_address FROM wallets WHERE user_id = $1 AND is_active = TRUE',
        [userId]
      );

      if (existingWallet.rows.length > 0) {
        throw new Error('User already has an active wallet');
      }

      // Generate new wallet
      const wallet = this.generateWallet();
      
      // Encrypt private key
      const encryptedPrivateKey = this.encryptPrivateKey(wallet.privateKey);

      // Save to database
      const result = await query(
        `INSERT INTO wallets (user_id, wallet_address, private_key_encrypted, balance) 
         VALUES ($1, $2, $3, $4) 
         RETURNING id, wallet_address, balance, created_at`,
        [userId, wallet.address, encryptedPrivateKey, 0.00]
      );

      const walletData = result.rows[0];

      return {
        id: walletData.id,
        address: walletData.wallet_address,
        balance: parseFloat(walletData.balance),
        createdAt: walletData.created_at
      };
    } catch (error) {
      console.error('Error creating user wallet:', error);
      throw error;
    }
  }

  /**
   * Get user wallet information
   * @param {number} userId - The user ID
   * @returns {Object} wallet data
   */
  async getUserWallet(userId) {
    try {
      const result = await query(
        'SELECT id, wallet_address, balance, created_at FROM wallets WHERE user_id = $1 AND is_active = TRUE',
        [userId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const wallet = result.rows[0];
      return {
        id: wallet.id,
        address: wallet.wallet_address,
        balance: parseFloat(wallet.balance),
        createdAt: wallet.created_at
      };
    } catch (error) {
      console.error('Error getting user wallet:', error);
      throw error;
    }
  }

  /**
   * Get wallet private key for deposits (be very careful with this!)
   * @param {number} userId - The user ID
   * @returns {string} private key
   */
  async getWalletPrivateKey(userId) {
    try {
      const result = await query(
        'SELECT private_key_encrypted FROM wallets WHERE user_id = $1 AND is_active = TRUE',
        [userId]
      );

      if (result.rows.length === 0) {
        throw new Error('Wallet not found');
      }

      const encryptedKey = result.rows[0].private_key_encrypted;
      return this.decryptPrivateKey(encryptedKey);
    } catch (error) {
      console.error('Error getting wallet private key:', error);
      throw error;
    }
  }

  /**
   * Update wallet balance
   * @param {number} walletId - The wallet ID
   * @param {number} newBalance - The new balance
   * @returns {Object} updated wallet
   */
  async updateWalletBalance(walletId, newBalance) {
    try {
      const result = await query(
        'UPDATE wallets SET balance = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, wallet_address, balance',
        [newBalance, walletId]
      );

      if (result.rows.length === 0) {
        throw new Error('Wallet not found');
      }

      return {
        id: result.rows[0].id,
        address: result.rows[0].wallet_address,
        balance: parseFloat(result.rows[0].balance)
      };
    } catch (error) {
      console.error('Error updating wallet balance:', error);
      throw error;
    }
  }

  /**
   * Record a wallet transaction
   * @param {Object} transactionData - Transaction details
   * @returns {Object} transaction record
   */
  async recordTransaction(transactionData) {
    const {
      walletId,
      userId,
      type,
      amount,
      balanceBefore,
      balanceAfter,
      status = 'completed',
      transactionHash = null,
      description = '',
      metadata = {}
    } = transactionData;

    try {
      const result = await query(
        `INSERT INTO wallet_transactions 
         (wallet_id, user_id, transaction_type, amount, balance_before, balance_after, status, transaction_hash, description, metadata)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING id, transaction_type, amount, status, created_at`,
        [walletId, userId, type, amount, balanceBefore, balanceAfter, status, transactionHash, description, JSON.stringify(metadata)]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error recording transaction:', error);
      throw error;
    }
  }

  /**
   * Get user transaction history
   * @param {number} userId - The user ID
   * @param {number} limit - Number of transactions to return
   * @param {number} offset - Offset for pagination
   * @returns {Array} transaction history
   */
  async getUserTransactions(userId, limit = 20, offset = 0) {
    try {
      const result = await query(
        `SELECT id, transaction_type, amount, balance_before, balance_after, status, 
                transaction_hash, description, metadata, created_at, updated_at
         FROM wallet_transactions 
         WHERE user_id = $1 
         ORDER BY created_at DESC 
         LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
      );

      return result.rows.map(transaction => ({
        id: transaction.id,
        type: transaction.transaction_type,
        amount: parseFloat(transaction.amount),
        balanceBefore: parseFloat(transaction.balance_before),
        balanceAfter: parseFloat(transaction.balance_after),
        status: transaction.status,
        transactionHash: transaction.transaction_hash,
        description: transaction.description,
        metadata: transaction.metadata,
        createdAt: transaction.created_at,
        updatedAt: transaction.updated_at
      }));
    } catch (error) {
      console.error('Error getting user transactions:', error);
      throw error;
    }
  }

  /**
   * Add funds to wallet (for demo/admin purposes)
   * @param {number} userId - The user ID
   * @param {number} amount - Amount to add
   * @param {string} description - Transaction description
   * @returns {Object} transaction result
   */
  async addFunds(userId, amount, description = 'Admin deposit') {
    try {
      const wallet = await this.getUserWallet(userId);
      if (!wallet) {
        throw new Error('Wallet not found');
      }

      const balanceBefore = wallet.balance;
      const balanceAfter = balanceBefore + amount;

      // Update wallet balance
      await this.updateWalletBalance(wallet.id, balanceAfter);

      // Record transaction
      const transaction = await this.recordTransaction({
        walletId: wallet.id,
        userId: userId,
        type: 'deposit',
        amount: amount,
        balanceBefore: balanceBefore,
        balanceAfter: balanceAfter,
        status: 'completed',
        description: description,
        metadata: { method: 'admin' }
      });

      return {
        success: true,
        transaction: transaction,
        newBalance: balanceAfter
      };
    } catch (error) {
      console.error('Error adding funds:', error);
      throw error;
    }
  }
}

module.exports = WalletService;
