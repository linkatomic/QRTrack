'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/auth-context';
import { Database } from '@/lib/supabase/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { QRCodeDisplay } from '@/components/dashboard/qr-code-display';
import { AnalyticsOverview } from '@/components/dashboard/analytics-overview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

type QRCode = Database['public']['Tables']['qr_codes']['Row'];

export default function QRDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [qrCode, setQrCode] = useState<QRCode | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user && params.id) {
      fetchQRCode();
    }
  }, [user, params.id]);

  const fetchQRCode = async () => {
    const { data, error } = await supabase
      .from('qr_codes')
      .select('*')
      .eq('id', params.id as string)
      .eq('user_id', user!.id)
      .maybeSingle();

    if (!error && data) {
      setQrCode(data);
    } else {
      router.push('/dashboard');
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const { error } = await supabase
        .from('qr_codes')
        .delete()
        .eq('id', params.id as string)
        .eq('user_id', user!.id);

      if (error) throw error;

      toast({
        title: 'QR Code deleted',
        description: 'Your QR code has been successfully deleted.',
      });

      router.push('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete QR code',
        variant: 'destructive',
      });
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!qrCode) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-900">{qrCode.name}</h1>
              <Badge variant={qrCode.status === 'active' ? 'default' : 'secondary'}>
                {qrCode.status}
              </Badge>
              {qrCode.enable_tracking === false && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                  Direct Link
                </Badge>
              )}
            </div>
            <p className="text-slate-600 mt-1">
              {qrCode.enable_tracking
                ? 'View analytics and manage your QR code'
                : 'Direct link QR code (no tracking)'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {qrCode.landing_page_enabled && (
            <Link href={`/qr/${qrCode.short_code}`} target="_blank">
              <Button variant="outline">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Landing Page
              </Button>
            </Link>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={deleting}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete QR Code</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this QR code? This action cannot be undone.
                  All scan data will be permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className={`grid gap-6 ${qrCode.enable_tracking ? 'lg:grid-cols-3' : 'lg:grid-cols-1 max-w-2xl'}`}>
        <div className="lg:col-span-1">
          <QRCodeDisplay qrCode={qrCode} />

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <span className="text-slate-600">Destination:</span>
                <p className="font-medium break-all mt-1">{qrCode.destination_url}</p>
              </div>
              <div>
                <span className="text-slate-600">Tracking:</span>
                <p className="font-medium mt-1">
                  {qrCode.enable_tracking ? (
                    <span className="text-blue-600">Enabled - Full Analytics</span>
                  ) : (
                    <span className="text-green-600">Disabled - Direct Link</span>
                  )}
                </p>
              </div>
              {qrCode.utm_campaign && (
                <div>
                  <span className="text-slate-600">Campaign:</span>
                  <p className="font-medium mt-1">{qrCode.utm_campaign}</p>
                </div>
              )}
              {qrCode.utm_source && (
                <div>
                  <span className="text-slate-600">Source:</span>
                  <p className="font-medium mt-1">{qrCode.utm_source}</p>
                </div>
              )}
              {qrCode.utm_medium && (
                <div>
                  <span className="text-slate-600">Medium:</span>
                  <p className="font-medium mt-1">{qrCode.utm_medium}</p>
                </div>
              )}
              <div>
                <span className="text-slate-600">Created:</span>
                <p className="font-medium mt-1">
                  {new Date(qrCode.created_at).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {qrCode.enable_tracking && (
          <div className="lg:col-span-2">
            <AnalyticsOverview qrCodeId={qrCode.id} />
          </div>
        )}
      </div>
    </div>
  );
}
