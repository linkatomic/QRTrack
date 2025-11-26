import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase/types';
import { buildURLWithUTM } from '@/lib/utils/url-builder';
import { parseUserAgent } from '@/lib/utils/user-agent-parser';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

type QRCode = Database['public']['Tables']['qr_codes']['Row'];

export async function GET(
  request: NextRequest,
  { params }: { params: { shortCode: string } }
) {
  try {
    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

    const { data, error } = await supabase
      .from('qr_codes')
      .select('*')
      .eq('short_code', params.shortCode)
      .eq('status', 'active')
      .maybeSingle();

    if (error || !data) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    const qrCode: QRCode = data;

    const userAgent = request.headers.get('user-agent') || '';
    const { device_type, os, browser } = parseUserAgent(userAgent);
    const referrer = request.headers.get('referer') || null;
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : null;

    const scanData: Database['public']['Tables']['scans']['Insert'] = {
      qr_code_id: qrCode.id,
      user_agent: userAgent,
      device_type,
      os,
      browser,
      referrer,
      ip_address: ip,
    };

    await (supabase.from('scans').insert as any)(scanData).catch(console.error);

    const destinationUrl = buildURLWithUTM(qrCode.destination_url, {
      source: qrCode.utm_source || undefined,
      medium: qrCode.utm_medium || undefined,
      campaign: qrCode.utm_campaign || undefined,
      term: qrCode.utm_term || undefined,
      content: qrCode.utm_content || undefined,
    });

    return NextResponse.redirect(destinationUrl);
  } catch (err) {
    console.error('Redirect error:', err);
    return NextResponse.redirect(new URL('/', request.url));
  }
}
