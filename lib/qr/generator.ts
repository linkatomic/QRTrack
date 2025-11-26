import QRCode from 'qrcode';

export interface QROptions {
  url: string;
  color?: string;
  bgColor?: string;
  size?: number;
  margin?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  style?: 'square' | 'dots' | 'rounded';
  eyeStyle?: 'square' | 'dots' | 'rounded';
  gradientType?: 'none' | 'linear' | 'radial';
  gradientColor?: string;
  logoUrl?: string;
}

export async function generateQRCode(options: QROptions): Promise<string> {
  const {
    url,
    color = '#000000',
    bgColor = '#FFFFFF',
    size = 512,
    margin = 2,
    errorCorrectionLevel = 'M'
  } = options;

  const qrDataUrl = await QRCode.toDataURL(url, {
    width: size,
    margin: margin,
    color: {
      dark: color,
      light: bgColor,
    },
    errorCorrectionLevel: errorCorrectionLevel as any,
  });

  return qrDataUrl;
}

export async function generateQRCodeSVG(options: QROptions): Promise<string> {
  const {
    url,
    color = '#000000',
    bgColor = '#FFFFFF',
    margin = 2,
    errorCorrectionLevel = 'M'
  } = options;

  const qrSvg = await QRCode.toString(url, {
    type: 'svg',
    margin: margin,
    color: {
      dark: color,
      light: bgColor,
    },
    errorCorrectionLevel: errorCorrectionLevel as any,
  });

  return qrSvg;
}
