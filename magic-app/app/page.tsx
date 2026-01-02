'use client';

import Dashboard from '@/components/Dashboard';
import { WalletProvider } from '@/components/WalletContext';

export default function Home() {
  return (
    <WalletProvider>
      <Dashboard />
    </WalletProvider>
  );
}
