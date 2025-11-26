'use client';

import { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2, Maximize2 } from 'lucide-react';

interface AdvancedQRGeneratorProps {
  url: string;
  color: string;
  bgColor: string;
  size: number;
  margin: number;
  errorLevel: 'L' | 'M' | 'Q' | 'H';
  logoUrl?: string;
  frameStyle: string;
  frameColor: string;
  frameText?: string;
  transparent: boolean;
}

export function AdvancedQRGenerator({
  url,
  color,
  bgColor,
  size,
  margin,
  errorLevel,
  logoUrl,
  frameStyle,
  frameColor,
  frameText,
  transparent,
}: AdvancedQRGeneratorProps) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (url && qrRef.current) {
      generateQRImage();
    }
  }, [url, color, bgColor, size, margin, errorLevel, logoUrl, frameStyle, frameColor, frameText, transparent]);

  const generateQRImage = async () => {
    if (!qrRef.current) return;

    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const frameHeight = frameStyle !== 'none' && frameText ? 60 : 0;
    canvas.width = size;
    canvas.height = size + frameHeight;

    if (!transparent) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = async () => {
      ctx.drawImage(img, 0, 0, size, size);

      if (logoUrl) {
        try {
          const logo = new Image();
          logo.crossOrigin = 'anonymous';
          logo.onload = () => {
            const logoSize = size * 0.2;
            const logoX = (size - logoSize) / 2;
            const logoY = (size - logoSize) / 2;

            ctx.fillStyle = bgColor;
            ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);
            ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);

            drawFrame();
            setQrDataUrl(canvas.toDataURL('image/png'));
          };
          logo.src = logoUrl;
        } catch (err) {
          console.error('Failed to load logo:', err);
          drawFrame();
          setQrDataUrl(canvas.toDataURL('image/png'));
        }
      } else {
        drawFrame();
        setQrDataUrl(canvas.toDataURL('image/png'));
      }

      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  const drawFrame = () => {
    if (frameStyle === 'none' || !frameText) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = frameColor;
    ctx.fillRect(0, size, canvas.width, 60);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(frameText, canvas.width / 2, size + 30);
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;

    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = 'qr-code.png';
    link.click();
  };

  return (
    <div className="relative">
      <div ref={qrRef} className="hidden">
        <QRCodeSVG
          value={url || 'https://example.com'}
          size={size}
          level={errorLevel}
          marginSize={margin}
          fgColor={color}
          bgColor={transparent ? 'transparent' : bgColor}
        />
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {qrDataUrl && (
        <Card className="overflow-hidden border-2">
          <CardContent className="p-6">
            <div className="flex justify-center items-center bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-8">
              <img
                src={qrDataUrl}
                alt="QR Code"
                className="max-w-full h-auto rounded-lg shadow-2xl"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  imageRendering: 'crisp-edges'
                }}
              />
            </div>

            <div className="mt-4 flex gap-2">
              <Button onClick={handleDownload} className="flex-1" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
