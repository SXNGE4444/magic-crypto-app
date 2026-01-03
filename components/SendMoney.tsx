'use client';

import React, { useState } from 'react';
import { Send, QrCode, Scan } from 'lucide-react';
import { useWallet } from './WalletContext';
import { walletService } from '@/lib/walletService';
import { validateAddress } from '@/utils/qrCode';
import { getChainSymbol } from '@/utils/format';

export default function SendMoney() {
  const { activeWallet, refreshBalances } = useWallet();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showScanner, setShowScanner] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!activeWallet) {
      setError('Please connect a wallet first');
      return;
    }

    if (!recipient || !amount) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateAddress(recipient, activeWallet.chain)) {
      setError('Invalid recipient address for ' + activeWallet.chain);
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Invalid amount');
      return;
    }

    if (amountNum > parseFloat(activeWallet.balance)) {
      setError('Insufficient balance');
      return;
    }

    setIsSending(true);

    try {
      const txHash = await walletService.sendTransaction({
        to: recipient,
        amount: amount,
        chain: activeWallet.chain,
      });

      setSuccess(`Transaction sent successfully! Hash: ${txHash.substring(0, 10)}...`);
      setRecipient('');
      setAmount('');
      
      // Refresh balances after successful transaction
      setTimeout(() => {
        refreshBalances();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Transaction failed');
    } finally {
      setIsSending(false);
    }
  };

  const handleScanQR = () => {
    setShowScanner(!showScanner);
  };

  if (!activeWallet) {
    return (
      <div className="text-center p-8 bg-gray-800/50 rounded-xl border border-gray-700">
        <p className="text-gray-400">Please connect a wallet to send money</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <Send className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-bold text-white">Send Money</h2>
        </div>

        <form onSubmit={handleSend} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              From Wallet
            </label>
            <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
              <p className="text-white font-medium capitalize">{activeWallet.chain}</p>
              <p className="text-gray-400 text-sm">
                Balance: {activeWallet.balance} {getChainSymbol(activeWallet.chain)}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Recipient Address
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder={`Enter ${activeWallet.chain} address`}
                className="flex-1 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleScanQR}
                className="px-4 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                title="Scan QR Code"
              >
                <Scan className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Amount ({getChainSymbol(activeWallet.chain)})
            </label>
            <input
              type="number"
              step="0.000001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setAmount(activeWallet.balance)}
              className="mt-2 text-sm text-blue-400 hover:text-blue-300"
            >
              Use max amount
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={isSending}
            className="w-full py-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition-colors flex items-center justify-center space-x-2"
          >
            {isSending ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Send Money</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg">
          <p className="text-yellow-400 text-sm">
            <strong>Note:</strong> Transactions are irreversible. Please double-check the recipient address and amount before sending.
          </p>
        </div>
      </div>
    </div>
  );
}
