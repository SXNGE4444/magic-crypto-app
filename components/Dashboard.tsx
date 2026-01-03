'use client';

import React, { useState } from 'react';
import { useWallet } from './WalletContext';
import WalletConnect from './WalletConnect';
import WalletCard from './WalletCard';
import SendMoney from './SendMoney';
import ReceiveMoney from './ReceiveMoney';
import { Send, QrCode, Wallet, Plus } from 'lucide-react';

export default function Dashboard() {
  const { wallets, activeWallet, setActiveWallet, refreshBalances } = useWallet();
  const [activeTab, setActiveTab] = useState<'wallets' | 'send' | 'receive'>('wallets');
  const [showConnect, setShowConnect] = useState(false);

  const tabs = [
    { id: 'wallets' as const, name: 'My Wallets', icon: <Wallet className="w-5 h-5" /> },
    { id: 'send' as const, name: 'Send', icon: <Send className="w-5 h-5" /> },
    { id: 'receive' as const, name: 'Receive', icon: <QrCode className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">✨</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Magic</h1>
            </div>
            {wallets.length > 0 && (
              <button
                onClick={() => setShowConnect(!showConnect)}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition-colors flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Wallet</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {wallets.length === 0 && !showConnect ? (
          <div className="text-center py-16">
            <div className="mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Welcome to Magic</h2>
              <p className="text-gray-400 text-lg">
                Send and receive crypto instantly, no fees, anywhere in the world
              </p>
            </div>
            <button
              onClick={() => setShowConnect(true)}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg text-white font-semibold text-lg transition-all transform hover:scale-105"
            >
              Connect Your First Wallet
            </button>
          </div>
        ) : showConnect ? (
          <div>
            <button
              onClick={() => setShowConnect(false)}
              className="mb-6 text-gray-400 hover:text-white transition-colors"
            >
              ← Back to Dashboard
            </button>
            <WalletConnect />
          </div>
        ) : (
          <div>
            {/* Tabs */}
            <div className="flex space-x-2 mb-8 bg-gray-800/50 p-2 rounded-xl border border-gray-700">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="animate-slide-in">
              {activeTab === 'wallets' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Your Wallets</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wallets.map((wallet) => (
                      <WalletCard
                        key={wallet.chain}
                        wallet={wallet}
                        isActive={activeWallet?.chain === wallet.chain}
                        onClick={() => setActiveWallet(wallet)}
                        onRefresh={refreshBalances}
                      />
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'send' && <SendMoney />}

              {activeTab === 'receive' && <ReceiveMoney />}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <p className="mb-2">
              Magic - Send crypto instantly to anyone, anywhere
            </p>
            <p className="text-sm">
              Non-custodial • Secure • No Fees*
            </p>
            <p className="text-xs mt-2 text-gray-500">
              *Network gas fees still apply
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
