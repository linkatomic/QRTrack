import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { parseUserAgent } from '@/lib/utils/user-agent-parser';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const body = await request.json();
    const { qr_code_id } = body;

    if (!qr_code_id) {
      return NextResponse.json({ error: 'Missing qr_code_id' }, { status: 400 });
    }

    const userAgent = request.headers.get('user-agent') || '';
    const { device_type, os, browser } = parseUserAgent(userAgent);

    const referrer = request.headers.get('referer') || null;
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : null;

    const { error } = await supabase.from('scans').insert({
      qr_code_id,
      user_agent: userAgent,
      device_type,
      os,
      browser,
      referrer,
      ip_address: ip,
    });

    if (error) {
      console.error('Failed to track scan:', error);
      return NextResponse.json({ error: 'Failed to track scan' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Track route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
