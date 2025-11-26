import QRCode from 'qrcode';

export interface QROptions {
  url: string;
  color?: string;
  size?: number;
}

export async function generateQRCode(options: QROptions): Promise<string> {
  const { url, color = '#000000', size = 512 } = options;

  const qrDataUrl = await QRCode.toDataURL(url, {
    width: size,
    margin: 2,
    color: {
      dark: color,
      light: '#FFFFFF',
    },
    errorCorrectionLevel: 'M',
  });

  return qrDataUrl;
}

export async function generateQRCodeSVG(options: QROptions): Promise<string> {
  const { url, color = '#000000' } = options;

  const qrSvg = await QRCode.toString(url, {
    type: 'svg',
    margin: 2,
    color: {
      dark: color,
      light: '#FFFFFF',
    },
    errorCorrectionLevel: 'M',
  });

  return qrSvg;
}
