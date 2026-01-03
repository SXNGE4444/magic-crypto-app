'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { walletService, CryptoChain, WalletInfo } from '@/lib/walletService';

interface WalletContextType {
  wallets: WalletInfo[];
  activeWallet: WalletInfo | null;
  isConnecting: boolean;
  connectWallet: (chain: CryptoChain) => Promise<void>;
  disconnectWallet: (chain: CryptoChain) => void;
  setActiveWallet: (wallet: WalletInfo) => void;
  refreshBalances: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallets, setWallets] = useState<WalletInfo[]>([]);
  const [activeWallet, setActiveWalletState] = useState<WalletInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Load saved wallets from localStorage
    const savedWallets = localStorage.getItem('magic_wallets');
    if (savedWallets) {
      const parsed = JSON.parse(savedWallets);
      setWallets(parsed);
      if (parsed.length > 0) {
        setActiveWalletState(parsed[0]);
      }
    }
  }, []);

  useEffect(() => {
    // Save wallets to localStorage whenever they change
    if (wallets.length > 0) {
      localStorage.setItem('magic_wallets', JSON.stringify(wallets));
    }
  }, [wallets]);

  const connectWallet = async (chain: CryptoChain) => {
    setIsConnecting(true);
    try {
      const address = await walletService.connectWallet(chain);
      const balance = await walletService.getBalance(address, chain);
      
      const newWallet: WalletInfo = {
        address,
        balance,
        chain,
      };

      setWallets(prev => {
        const filtered = prev.filter(w => w.chain !== chain);
        return [...filtered, newWallet];
      });

      setActiveWalletState(newWallet);
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = (chain: CryptoChain) => {
    setWallets(prev => prev.filter(w => w.chain !== chain));
    
    if (activeWallet?.chain === chain) {
      const remaining = wallets.filter(w => w.chain !== chain);
      setActiveWalletState(remaining.length > 0 ? remaining[0] : null);
    }
  };

  const setActiveWallet = (wallet: WalletInfo) => {
    setActiveWalletState(wallet);
  };

  const refreshBalances = async () => {
    const updated = await Promise.all(
      wallets.map(async (wallet) => {
        try {
          const balance = await walletService.getBalance(wallet.address, wallet.chain);
          return { ...wallet, balance };
        } catch (error) {
          console.error(`Error refreshing balance for ${wallet.chain}:`, error);
          return wallet;
        }
      })
    );
    setWallets(updated);
    
    if (activeWallet) {
      const updatedActive = updated.find(w => w.chain === activeWallet.chain);
      if (updatedActive) {
        setActiveWalletState(updatedActive);
      }
    }
  };

  return (
    <WalletContext.Provider
      value={{
        wallets,
        activeWallet,
        isConnecting,
        connectWallet,
        disconnectWallet,
        setActiveWallet,
        refreshBalances,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
