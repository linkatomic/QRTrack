'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QrCode, BarChart3, ExternalLink, Archive } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

type QRCode = Database['public']['Tables']['qr_codes']['Row'];

export function QRList() {
  const { user } = useAuth();
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchQRCodes();
    }
  }, [user]);

  const fetchQRCodes = async () => {
    const { data, error } = await supabase
      .from('qr_codes')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setQrCodes(data);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-600">Loading...</div>;
  }

  if (qrCodes.length === 0) {
    return (
      <div className="text-center py-20">
        <QrCode className="h-16 w-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-900 mb-2">No QR Codes Yet</h3>
        <p className="text-slate-600 mb-6">Create your first QR code to start tracking scans</p>
        <Link href="/dashboard/create">
          <Button>Create QR Code</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {qrCodes.map((qr) => (
        <Card key={qr.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg">{qr.name}</CardTitle>
                <CardDescription className="text-xs mt-1">
                  Created {formatDistanceToNow(new Date(qr.created_at), { addSuffix: true })}
                </CardDescription>
              </div>
              <Badge variant={qr.status === 'active' ? 'default' : 'secondary'}>
                {qr.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Total Scans</span>
              <span className="font-semibold text-lg">{qr.total_scans}</span>
            </div>
            <div className="flex gap-2">
              <Link href={`/dashboard/qr/${qr.id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analytics
                </Button>
              </Link>
              {qr.landing_page_enabled && (
                <Link href={`/qr/${qr.short_code}`} target="_blank">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
