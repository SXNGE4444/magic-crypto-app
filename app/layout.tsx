import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Magic - Crypto Transfer App',
  description: 'Send and receive cryptocurrency instantly with no fees. Support for Bitcoin, Ethereum, and Solana.',
  keywords: 'crypto, cryptocurrency, bitcoin, ethereum, solana, wallet, transfer, p2p',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
