import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ExternalLink, QrCode } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

interface PageProps {
  params: {
    shortCode: string;
  };
}

type QRCode = Database['public']['Tables']['qr_codes']['Row'];

async function getQRCode(shortCode: string): Promise<QRCode | null> {
  const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

  const { data, error } = await supabase
    .from('qr_codes')
    .select('*')
    .eq('short_code', shortCode)
    .eq('status', 'active')
    .eq('landing_page_enabled', true)
    .maybeSingle();

  return data;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const qrCode = await getQRCode(params.shortCode);

  if (!qrCode) {
    return {
      title: 'QR Code Not Found - QRTrack',
      description: 'This QR code does not exist or has been disabled',
    };
  }

  return {
    title: qrCode.landing_page_title || qrCode.name,
    description: qrCode.landing_page_description || `Visit ${qrCode.destination_url}`,
    openGraph: {
      title: qrCode.landing_page_title || qrCode.name,
      description: qrCode.landing_page_description || `Visit ${qrCode.destination_url}`,
    },
  };
}

export default async function QRLandingPage({ params }: PageProps) {
  const qrCode = await getQRCode(params.shortCode);

  if (!qrCode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <QrCode className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">QR Code Not Found</h1>
          <p className="text-slate-600 mb-6">
            This QR code does not exist or has been disabled
          </p>
          <Link href="/">
            <Button>Go to QRTrack</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const redirectUrl = `/r/${qrCode.short_code}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <QrCode className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-slate-900">QRTrack</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 lg:p-12 text-center space-y-6">
            {qrCode.landing_page_logo_url && (
              <img
                src={qrCode.landing_page_logo_url}
                alt="Logo"
                className="h-20 w-20 mx-auto object-contain"
              />
            )}

            <div className="space-y-4">
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">
                {qrCode.landing_page_title || qrCode.name}
              </h1>
              {qrCode.landing_page_description && (
                <p className="text-lg text-slate-600 leading-relaxed">
                  {qrCode.landing_page_description}
                </p>
              )}
            </div>

            <div className="pt-4">
              <Link href={redirectUrl}>
                <Button size="lg" className="text-lg px-8">
                  <ExternalLink className="mr-2 h-5 w-5" />
                  {qrCode.landing_page_cta_text || 'Visit Site'}
                </Button>
              </Link>
            </div>

            <div className="pt-8 border-t">
              <p className="text-sm text-slate-500">
                You&apos;ll be redirected to: <br />
                <span className="font-medium text-slate-700">{qrCode.destination_url}</span>
              </p>
            </div>
          </Card>

          <div className="mt-8 text-center">
            <Link href="/" className="text-sm text-slate-600 hover:text-slate-900">
              Powered by QRTrack
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
