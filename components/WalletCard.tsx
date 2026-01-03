'use client';

import React from 'react';
import { Wallet, Bitcoin, Zap, Copy, RefreshCw } from 'lucide-react';
import { WalletInfo } from '@/lib/walletService';
import { shortenAddress, formatBalance, getChainSymbol } from '@/utils/format';

interface WalletCardProps {
  wallet: WalletInfo;
  isActive: boolean;
  onClick: () => void;
  onRefresh: () => void;
}

const getChainIcon = (chain: string) => {
  switch (chain) {
    case 'ethereum':
      return <Wallet className="w-6 h-6" />;
    case 'solana':
      return <Zap className="w-6 h-6" />;
    case 'bitcoin':
      return <Bitcoin className="w-6 h-6" />;
    default:
      return <Wallet className="w-6 h-6" />;
  }
};

const getChainColor = (chain: string) => {
  switch (chain) {
    case 'ethereum':
      return 'from-blue-500 to-blue-700';
    case 'solana':
      return 'from-green-500 to-green-700';
    case 'bitcoin':
      return 'from-orange-500 to-orange-700';
    default:
      return 'from-gray-500 to-gray-700';
  }
};

export default function WalletCard({ wallet, isActive, onClick, onRefresh }: WalletCardProps) {
  const copyAddress = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(wallet.address);
  };

  const handleRefresh = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRefresh();
  };

  return (
    <div
      onClick={onClick}
      className={`relative p-6 rounded-xl bg-gradient-to-br ${getChainColor(wallet.chain)} cursor-pointer transform transition-all hover:scale-105 ${
        isActive ? 'ring-4 ring-white/50' : ''
      }`}
    >
      {isActive && (
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white">
            Active
          </span>
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-white">{getChainIcon(wallet.chain)}</div>
          <h3 className="text-xl font-bold text-white capitalize">{wallet.chain}</h3>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-white/70 text-sm mb-1">Balance</p>
          <p className="text-3xl font-bold text-white">
            {formatBalance(wallet.balance)} {getChainSymbol(wallet.chain)}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm mb-1">Address</p>
            <p className="text-white font-mono text-sm">{shortenAddress(wallet.address)}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={copyAddress}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              title="Copy address"
            >
              <Copy className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={handleRefresh}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              title="Refresh balance"
            >
              <RefreshCw className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
