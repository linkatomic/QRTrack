'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase/types';
import { buildURLWithUTM } from '@/lib/utils/url-builder';
import { Loader2, QrCode } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

type QRCode = Database['public']['Tables']['qr_codes']['Row'];

export default function RedirectPage() {
  const params = useParams();
  const [error, setError] = useState(false);

  useEffect(() => {
    const redirect = async () => {
      try {
        const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

        const { data, error: fetchError } = await supabase
          .from('qr_codes')
          .select('*')
          .eq('short_code', params.shortCode as string)
          .eq('status', 'active')
          .maybeSingle();

        if (fetchError || !data) {
          setError(true);
          return;
        }

        const qrCode = data as QRCode;

        await fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ qr_code_id: qrCode.id }),
        }).catch(console.error);

        const destinationUrl = buildURLWithUTM(qrCode.destination_url, {
          source: qrCode.utm_source || undefined,
          medium: qrCode.utm_medium || undefined,
          campaign: qrCode.utm_campaign || undefined,
          term: qrCode.utm_term || undefined,
          content: qrCode.utm_content || undefined,
        });

        window.location.href = destinationUrl;
      } catch (err) {
        console.error('Redirect error:', err);
        setError(true);
      }
    };

    redirect();
  }, [params.shortCode]);

  if (error) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="text-center">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-lg text-slate-600">Redirecting...</p>
      </div>
    </div>
  );
}
