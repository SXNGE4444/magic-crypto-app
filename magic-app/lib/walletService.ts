import { ethers } from 'ethers';
import * as bitcoin from 'bitcoinjs-lib';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import * as bip39 from 'bip39';

export type CryptoChain = 'bitcoin' | 'ethereum' | 'solana';

export interface WalletInfo {
  address: string;
  balance: string;
  chain: CryptoChain;
}

export interface TransactionParams {
  to: string;
  amount: string;
  chain: CryptoChain;
}

class WalletService {
  private ethProvider: ethers.BrowserProvider | null = null;
  private solanaConnection: Connection | null = null;

  constructor() {
    // Initialize Solana connection (using devnet for testing, change to mainnet for production)
    this.solanaConnection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
  }

  // Generate a new wallet seed phrase
  generateSeedPhrase(): string {
    return bip39.generateMnemonic();
  }

  // Validate seed phrase
  validateSeedPhrase(seedPhrase: string): boolean {
    return bip39.validateMnemonic(seedPhrase);
  }

  // Get Ethereum provider
  private async getEthProvider(): Promise<ethers.BrowserProvider> {
    if (typeof window === 'undefined') {
      throw new Error('Window object not available');
    }

    if (!this.ethProvider && (window as any).ethereum) {
      this.ethProvider = new ethers.BrowserProvider((window as any).ethereum);
    }

    if (!this.ethProvider) {
      throw new Error('No Ethereum provider found. Please install MetaMask.');
    }

    return this.ethProvider;
  }

  // Connect MetaMask (Ethereum)
  async connectEthereumWallet(): Promise<string> {
    try {
      const provider = await this.getEthProvider();
      const accounts = await provider.send('eth_requestAccounts', []);
      return accounts[0];
    } catch (error: any) {
      throw new Error(`Failed to connect Ethereum wallet: ${error.message}`);
    }
  }

  // Get Ethereum balance
  async getEthereumBalance(address: string): Promise<string> {
    try {
      const provider = await this.getEthProvider();
      const balance = await provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error: any) {
      console.error('Error getting Ethereum balance:', error);
      return '0';
    }
  }

  // Send Ethereum transaction
  async sendEthereumTransaction(params: TransactionParams): Promise<string> {
    try {
      const provider = await this.getEthProvider();
      const signer = await provider.getSigner();
      
      const tx = await signer.sendTransaction({
        to: params.to,
        value: ethers.parseEther(params.amount)
      });

      await tx.wait();
      return tx.hash;
    } catch (error: any) {
      throw new Error(`Ethereum transaction failed: ${error.message}`);
    }
  }

  // Connect Phantom Wallet (Solana)
  async connectSolanaWallet(): Promise<string> {
    try {
      if (typeof window === 'undefined') {
        throw new Error('Window object not available');
      }

      const { solana } = window as any;
      
      if (!solana || !solana.isPhantom) {
        throw new Error('Phantom wallet not found. Please install Phantom.');
      }

      const response = await solana.connect();
      return response.publicKey.toString();
    } catch (error: any) {
      throw new Error(`Failed to connect Solana wallet: ${error.message}`);
    }
  }

  // Get Solana balance
  async getSolanaBalance(address: string): Promise<string> {
    try {
      if (!this.solanaConnection) {
        throw new Error('Solana connection not initialized');
      }

      const publicKey = new PublicKey(address);
      const balance = await this.solanaConnection.getBalance(publicKey);
      return (balance / LAMPORTS_PER_SOL).toString();
    } catch (error: any) {
      console.error('Error getting Solana balance:', error);
      return '0';
    }
  }

  // Send Solana transaction
  async sendSolanaTransaction(params: TransactionParams): Promise<string> {
    try {
      if (typeof window === 'undefined') {
        throw new Error('Window object not available');
      }

      const { solana } = window as any;
      
      if (!solana || !solana.isPhantom) {
        throw new Error('Phantom wallet not found');
      }

      if (!this.solanaConnection) {
        throw new Error('Solana connection not initialized');
      }

      const fromPubkey = solana.publicKey;
      const toPubkey = new PublicKey(params.to);
      const lamports = parseFloat(params.amount) * LAMPORTS_PER_SOL;

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports,
        })
      );

      transaction.feePayer = fromPubkey;
      const { blockhash } = await this.solanaConnection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;

      const signed = await solana.signAndSendTransaction(transaction);
      return signed.signature;
    } catch (error: any) {
      throw new Error(`Solana transaction failed: ${error.message}`);
    }
  }

  // Bitcoin functionality (Note: Bitcoin requires more complex setup with backend)
  async connectBitcoinWallet(): Promise<string> {
    // For Bitcoin, we'll use browser extensions like Unisat or Xverse
    try {
      if (typeof window === 'undefined') {
        throw new Error('Window object not available');
      }

      const { unisat } = window as any;
      
      if (!unisat) {
        throw new Error('Bitcoin wallet not found. Please install Unisat or Xverse wallet.');
      }

      const accounts = await unisat.requestAccounts();
      return accounts[0];
    } catch (error: any) {
      throw new Error(`Failed to connect Bitcoin wallet: ${error.message}`);
    }
  }

  async getBitcoinBalance(address: string): Promise<string> {
    try {
      if (typeof window === 'undefined') {
        throw new Error('Window object not available');
      }

      const { unisat } = window as any;
      
      if (!unisat) {
        throw new Error('Bitcoin wallet not found');
      }

      const balance = await unisat.getBalance();
      return (balance.total / 100000000).toString(); // Convert satoshis to BTC
    } catch (error: any) {
      console.error('Error getting Bitcoin balance:', error);
      return '0';
    }
  }

  async sendBitcoinTransaction(params: TransactionParams): Promise<string> {
    try {
      if (typeof window === 'undefined') {
        throw new Error('Window object not available');
      }

      const { unisat } = window as any;
      
      if (!unisat) {
        throw new Error('Bitcoin wallet not found');
      }

      const satoshis = Math.floor(parseFloat(params.amount) * 100000000);
      const txid = await unisat.sendBitcoin(params.to, satoshis);
      return txid;
    } catch (error: any) {
      throw new Error(`Bitcoin transaction failed: ${error.message}`);
    }
  }

  // Unified methods
  async connectWallet(chain: CryptoChain): Promise<string> {
    switch (chain) {
      case 'ethereum':
        return await this.connectEthereumWallet();
      case 'solana':
        return await this.connectSolanaWallet();
      case 'bitcoin':
        return await this.connectBitcoinWallet();
      default:
        throw new Error('Unsupported chain');
    }
  }

  async getBalance(address: string, chain: CryptoChain): Promise<string> {
    switch (chain) {
      case 'ethereum':
        return await this.getEthereumBalance(address);
      case 'solana':
        return await this.getSolanaBalance(address);
      case 'bitcoin':
        return await this.getBitcoinBalance(address);
      default:
        throw new Error('Unsupported chain');
    }
  }

  async sendTransaction(params: TransactionParams): Promise<string> {
    switch (params.chain) {
      case 'ethereum':
        return await this.sendEthereumTransaction(params);
      case 'solana':
        return await this.sendSolanaTransaction(params);
      case 'bitcoin':
        return await this.sendBitcoinTransaction(params);
      default:
        throw new Error('Unsupported chain');
    }
  }
}

export const walletService = new WalletService();
