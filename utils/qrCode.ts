import QRCode from 'qrcode';

export interface QRData {
  address: string;
  chain: string;
  amount?: string;
}

export async function generateQRCode(data: QRData): Promise<string> {
  try {
    const qrString = JSON.stringify(data);
    const qrCodeDataUrl = await QRCode.toDataURL(qrString, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

export function parseQRData(qrString: string): QRData | null {
  try {
    const data = JSON.parse(qrString);
    if (data.address && data.chain) {
      return data as QRData;
    }
    return null;
  } catch (error) {
    console.error('Error parsing QR data:', error);
    return null;
  }
}

export function validateAddress(address: string, chain: string): boolean {
  switch (chain) {
    case 'ethereum':
      return /^0x[a-fA-F0-9]{40}$/.test(address);
    case 'solana':
      return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
    case 'bitcoin':
      return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/.test(address);
    default:
      return false;
  }
}
