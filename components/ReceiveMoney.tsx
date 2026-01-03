'use client';

import React, { useState, useEffect } from 'react';
import { Download, Copy, QrCode } from 'lucide-react';
import { useWallet } from './WalletContext';
import { generateQRCode } from '@/utils/qrCode';
import { getChainSymbol } from '@/utils/format';

export default function ReceiveMoney() {
  const { activeWallet } = useWallet();
  const [qrCode, setQrCode] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (activeWallet) {
      generateQR();
    }
  }, [activeWallet, amount]);

  const generateQR = async () => {
    if (!activeWallet) return;

    try {
      const qrData = {
        address: activeWallet.address,
        chain: activeWallet.chain,
        ...(amount && { amount }),
      };
      const qrCodeUrl = await generateQRCode(qrData);
      setQrCode(qrCodeUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const copyAddress = () => {
    if (activeWallet) {
      navigator.clipboard.writeText(activeWallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadQR = () => {
    if (qrCode) {
      const link = document.createElement('a');
      link.href = qrCode;
      link.download = `magic-${activeWallet?.chain}-qr.png`;
      link.click();
    }
  };

  if (!activeWallet) {
    return (
      <div className="text-center p-8 bg-gray-800/50 rounded-xl border border-gray-700">
        <p className="text-gray-400">Please connect a wallet to receive money</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <QrCode className="w-6 h-6 text-green-400" />
          <h2 className="text-2xl font-bold text-white">Receive Money</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Receiving Wallet
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
              Request Amount (Optional)
            </label>
            <input
              type="number"
              step="0.000001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount to request"
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="mt-1 text-xs text-gray-400">
              If specified, the QR code will include the requested amount
            </p>
          </div>

          {qrCode && (
            <div className="flex flex-col items-center space-y-4">
              <div className="p-6 bg-white rounded-xl">
                <img src={qrCode} alt="QR Code" className="w-64 h-64" />
              </div>

              <div className="w-full p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <p className="text-xs text-gray-400 mb-2">Your {activeWallet.chain} Address:</p>
                <div className="flex items-center justify-between space-x-2">
                  <p className="text-white font-mono text-sm break-all">{activeWallet.address}</p>
                  <button
                    onClick={copyAddress}
                    className="flex-shrink-0 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    title="Copy address"
                  >
                    <Copy className="w-4 h-4 text-white" />
                  </button>
                </div>
                {copied && (
                  <p className="mt-2 text-xs text-green-400">Address copied to clipboard!</p>
                )}
              </div>

              <button
                onClick={downloadQR}
                className="w-full py-3 bg-green-500 hover:bg-green-600 rounded-lg text-white font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Download QR Code</span>
              </button>
            </div>
          )}

          <div className="p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg">
            <p className="text-blue-400 text-sm">
              <strong>How to receive:</strong> Share your QR code or address with the sender. They can scan the QR code or paste your address to send you crypto.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
