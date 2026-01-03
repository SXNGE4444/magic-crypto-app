# Magic - Peer-to-Peer Crypto Transfer App

![Magic Logo](https://img.shields.io/badge/Magic-Crypto%20Transfer-blue)

Magic is a non-custodial peer-to-peer cryptocurrency transfer application that allows users to send and receive Bitcoin, Ethereum, and Solana with minimal friction. Built with Next.js 14 and TypeScript.

## ✨ Features

- **Multi-Chain Support**: Bitcoin, Ethereum, and Solana
- **Non-Custodial**: You control your private keys
- **No Platform Fees**: Only network gas fees apply
- **QR Code Support**: Easy transfers by scanning QR codes
- **Real-Time Balance Updates**: Track your crypto in real-time
- **Beautiful UI**: Modern, responsive design
- **Instant Transfers**: Send crypto anywhere in the world

## 🚀 Tech Stack

- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Blockchain Libraries**:
  - Ethers.js (Ethereum)
  - @solana/web3.js (Solana)
  - bitcoinjs-lib (Bitcoin)
- **QR Code**: qrcode & html5-qrcode
- **Icons**: Lucide React

## 📋 Prerequisites

Before deploying Magic, ensure users have the following wallet extensions installed:

- **Ethereum**: [MetaMask](https://metamask.io/)
- **Solana**: [Phantom Wallet](https://phantom.app/)
- **Bitcoin**: [Unisat Wallet](https://unisat.io/) or [Xverse](https://www.xverse.app/)

## 🛠️ Installation

### Local Development

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd magic-app
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🌐 Deployment to Vercel

### Method 1: Deploy via Vercel CLI

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

4. **Deploy to Production**
```bash
vercel --prod
```

### Method 2: Deploy via Vercel Dashboard

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo>
git push -u origin main
```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure project settings:
     - Framework Preset: Next.js
     - Root Directory: `./`
     - Build Command: `npm run build`
     - Output Directory: `.next`
   - Click "Deploy"

3. **Your app is live!**
   - Vercel will provide you with a URL like `your-app.vercel.app`

### Method 3: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/magic-app)

## ⚙️ Configuration

### Environment Variables (Optional)

For production, you may want to configure custom RPC endpoints:

Create a `.env.local` file:
```env
NEXT_PUBLIC_ETHEREUM_RPC=https://mainnet.infura.io/v3/YOUR_KEY
NEXT_PUBLIC_SOLANA_RPC=https://api.mainnet-beta.solana.com
```

### Network Configuration

By default, Magic connects to:
- **Ethereum**: Mainnet (via MetaMask)
- **Solana**: Mainnet-beta
- **Bitcoin**: Mainnet (via Unisat)

To change networks, edit `/lib/walletService.ts`:
```typescript
// For Solana testnet
this.solanaConnection = new Connection('https://api.devnet.solana.com', 'confirmed');
```

## 📱 Usage

### 1. Connect Wallet
- Click "Connect Your First Wallet"
- Choose your blockchain (Bitcoin, Ethereum, or Solana)
- Approve the connection in your wallet extension

### 2. Send Money
- Go to the "Send" tab
- Select recipient address (or scan QR code)
- Enter amount
- Confirm transaction in your wallet

### 3. Receive Money
- Go to the "Receive" tab
- Share your QR code or address
- Optionally specify an amount to request

## 🔒 Security Considerations

### Non-Custodial Architecture
- Magic NEVER stores your private keys
- All transactions are signed locally in your browser
- Your keys never leave your device

### Best Practices
1. Always verify recipient addresses before sending
2. Start with small test transactions
3. Keep your wallet extensions updated
4. Never share your seed phrase or private keys
5. Use hardware wallets for large amounts

### Disclaimer
This is a proof-of-concept application. For production use:
- Implement comprehensive security audits
- Add rate limiting and DDoS protection
- Implement transaction monitoring
- Add multi-signature support for large transfers
- Consider implementing 2FA
- Add compliance features (KYC/AML) if required in your jurisdiction

## 🌍 Browser Support

- Chrome/Edge (recommended)
- Firefox
- Brave
- Safari (limited wallet support)

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## ⚠️ Legal Notice

### Regulatory Compliance
This application is for educational and demonstration purposes. Before deploying to production:

1. **Research Local Regulations**: Cryptocurrency regulations vary by country
2. **Licensing**: Some jurisdictions require money transmitter licenses
3. **KYC/AML**: Consider implementing Know Your Customer and Anti-Money Laundering procedures
4. **Tax Implications**: Inform users about potential tax obligations
5. **Terms of Service**: Create comprehensive terms of service
6. **Privacy Policy**: Implement GDPR-compliant privacy practices

### Gas Fees
While Magic charges no platform fees, blockchain networks charge gas fees for transactions:
- **Ethereum**: Varies based on network congestion (typically $1-50)
- **Solana**: Minimal fees (typically $0.00025)
- **Bitcoin**: Varies based on transaction size and priority (typically $0.50-20)

## 🐛 Troubleshooting

### Common Issues

**Wallet not connecting:**
- Ensure you have the correct wallet extension installed
- Try refreshing the page
- Check if the wallet extension is unlocked

**Transaction failing:**
- Verify you have sufficient balance for both the transfer and gas fees
- Check that the recipient address is valid
- Try increasing the gas price if using Ethereum

**Balance not updating:**
- Click the refresh button on your wallet card
- Wait a few seconds for the blockchain to confirm

**QR Scanner not working:**
- Ensure you've granted camera permissions
- Try using a different browser
- Use manual address entry as an alternative

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Email: support@magic-app.com (replace with your email)
- Discord: [Join our community] (replace with your link)

## 🗺️ Roadmap

- [ ] Multi-language support
- [ ] Transaction history with export
- [ ] Price charts and analytics
- [ ] Multiple wallet support per chain
- [ ] Token swap integration
- [ ] Mobile app (React Native)
- [ ] Hardware wallet integration (Ledger, Trezor)
- [ ] ENS and SNS domain support
- [ ] Batch transactions
- [ ] Scheduled payments

## 🙏 Acknowledgments

- Ethereum Foundation
- Solana Labs
- Bitcoin Core
- The amazing open-source community

---

**Built with ✨ Magic**

Made for the future of decentralized finance.
