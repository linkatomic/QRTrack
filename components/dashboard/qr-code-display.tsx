'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Copy, Check } from 'lucide-react';
import { generateQRCode } from '@/lib/qr/generator';
import { buildURLWithUTM } from '@/lib/utils/url-builder';
import { Database } from '@/lib/supabase/types';

type QRCode = Database['public']['Tables']['qr_codes']['Row'];

interface QRCodeDisplayProps {
  qrCode: QRCode;
}

export function QRCodeDisplay({ qrCode }: QRCodeDisplayProps) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const trackingUrl = buildURLWithUTM(qrCode.destination_url, {
    source: qrCode.utm_source || undefined,
    medium: qrCode.utm_medium || undefined,
    campaign: qrCode.utm_campaign || undefined,
    term: qrCode.utm_term || undefined,
    content: qrCode.utm_content || undefined,
  });

  const redirectUrl = `${window.location.origin}/r/${qrCode.short_code}`;

  useEffect(() => {
    generateQR();
  }, [qrCode]);

  const generateQR = async () => {
    try {
      const dataUrl = await generateQRCode({
        url: redirectUrl,
        color: qrCode.qr_color,
        bgColor: qrCode.qr_bg_color || '#FFFFFF',
        size: qrCode.qr_size || 512,
        margin: qrCode.qr_margin || 2,
        errorCorrectionLevel: (qrCode.qr_error_correction as 'L' | 'M' | 'Q' | 'H') || 'M',
        style: (qrCode.qr_style as any) || 'square',
        eyeStyle: (qrCode.qr_eye_style as any) || 'square',
        gradientType: (qrCode.qr_gradient_type as any) || 'none',
        gradientColor: qrCode.qr_gradient_color || undefined,
        logoUrl: qrCode.qr_logo_url || undefined,
      });
      setQrDataUrl(dataUrl);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `${qrCode.name.replace(/\s+/g, '_')}_qr_code.png`;
    link.click();
  };

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(redirectUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>QR Code</CardTitle>
        <CardDescription>Download or share your QR code</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          {loading ? (
            <div className="w-64 h-64 bg-slate-100 animate-pulse rounded-lg" />
          ) : (
            <img src={qrDataUrl} alt="QR Code" className="w-64 h-64 rounded-lg shadow-md" />
          )}
        </div>

        <div className="space-y-3">
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-xs font-medium text-slate-700 mb-1">Tracking URL:</p>
            <p className="text-sm text-slate-600 break-all">{redirectUrl}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyUrl}
              className="mt-2"
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy URL
                </>
              )}
            </Button>
          </div>

          <Button onClick={handleDownload} disabled={loading} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Download PNG
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
