'use client';

import React, { useState } from 'react';
import { Wallet, Bitcoin, Zap } from 'lucide-react';
import { useWallet } from './WalletContext';
import { CryptoChain } from '@/lib/walletService';

const chains: { id: CryptoChain; name: string; icon: React.ReactNode; color: string }[] = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    icon: <Wallet className="w-8 h-8" />,
    color: 'bg-blue-500',
  },
  {
    id: 'solana',
    name: 'Solana',
    icon: <Zap className="w-8 h-8" />,
    color: 'bg-green-500',
  },
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    icon: <Bitcoin className="w-8 h-8" />,
    color: 'bg-orange-500',
  },
];

export default function WalletConnect() {
  const { connectWallet, isConnecting, wallets } = useWallet();
  const [error, setError] = useState<string>('');

  const handleConnect = async (chain: CryptoChain) => {
    setError('');
    try {
      await connectWallet(chain);
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    }
  };

  const isConnected = (chain: CryptoChain) => {
    return wallets.some(w => w.chain === chain);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Connect Your Wallet</h2>
        <p className="text-gray-400">Choose a blockchain to get started</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {chains.map((chain) => (
          <button
            key={chain.id}
            onClick={() => handleConnect(chain.id)}
            disabled={isConnecting || isConnected(chain.id)}
            className={`${chain.color} p-6 rounded-xl hover:opacity-90 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="text-white">{chain.icon}</div>
              <h3 className="text-xl font-bold text-white">{chain.name}</h3>
              {isConnected(chain.id) ? (
                <span className="text-sm text-white/90 font-medium">Connected ✓</span>
              ) : (
                <span className="text-sm text-white/80">Click to connect</span>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 p-6 bg-gray-800/50 rounded-xl border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-3">Required Wallet Extensions:</h3>
        <ul className="space-y-2 text-gray-300">
          <li className="flex items-center space-x-2">
            <span className="text-blue-400">•</span>
            <span>Ethereum: MetaMask or compatible wallet</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-green-400">•</span>
            <span>Solana: Phantom wallet</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-orange-400">•</span>
            <span>Bitcoin: Unisat or Xverse wallet</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
