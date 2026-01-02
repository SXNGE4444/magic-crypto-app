export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
}

export function formatBalance(balance: string, decimals = 6): string {
  const num = parseFloat(balance);
  if (isNaN(num)) return '0';
  return num.toFixed(decimals);
}

export function formatCurrency(amount: string, currency: string): string {
  const num = parseFloat(amount);
  if (isNaN(num)) return `0 ${currency}`;
  return `${num.toFixed(6)} ${currency}`;
}

export function getChainSymbol(chain: string): string {
  switch (chain) {
    case 'ethereum':
      return 'ETH';
    case 'solana':
      return 'SOL';
    case 'bitcoin':
      return 'BTC';
    default:
      return '';
  }
}

export function getChainColor(chain: string): string {
  switch (chain) {
    case 'ethereum':
      return '#627EEA';
    case 'solana':
      return '#14F195';
    case 'bitcoin':
      return '#F7931A';
    default:
      return '#3B82F6';
  }
}
