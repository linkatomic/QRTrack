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

  const qrCodeUrl = qrCode.enable_tracking
    ? redirectUrl
    : qrCode.destination_url;

  useEffect(() => {
    generateQR();
  }, [qrCode]);

  const generateQR = async () => {
    try {
      const dataUrl = await generateQRCode({
        url: qrCodeUrl,
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
    await navigator.clipboard.writeText(qrCodeUrl);
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
          <div className={`p-4 rounded-lg ${qrCode.enable_tracking ? 'bg-blue-50 border border-blue-200' : 'bg-green-50 border border-green-200'}`}>
            <p className="text-xs font-medium mb-1 flex items-center gap-2">
              {qrCode.enable_tracking ? (
                <>
                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                  <span className="text-blue-900">Tracking URL (Analytics Enabled)</span>
                </>
              ) : (
                <>
                  <span className="inline-block w-2 h-2 bg-green-600 rounded-full"></span>
                  <span className="text-green-900">Direct Link (No Tracking)</span>
                </>
              )}
            </p>
            <p className={`text-sm break-all ${qrCode.enable_tracking ? 'text-blue-700' : 'text-green-700'}`}>
              {qrCodeUrl}
            </p>
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
