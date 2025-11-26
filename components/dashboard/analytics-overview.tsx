'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Monitor, Smartphone, Tablet, Globe } from 'lucide-react';
import { Database } from '@/lib/supabase/types';

type Scan = Database['public']['Tables']['scans']['Row'];

interface AnalyticsOverviewProps {
  qrCodeId: string;
}

export function AnalyticsOverview({ qrCodeId }: AnalyticsOverviewProps) {
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScans();
  }, [qrCodeId]);

  const fetchScans = async () => {
    const { data, error } = await supabase
      .from('scans')
      .select('*')
      .eq('qr_code_id', qrCodeId)
      .order('scanned_at', { ascending: false });

    if (!error && data) {
      setScans(data);
    }
    setLoading(false);
  };

  const totalScans = scans.length;

  const deviceBreakdown = scans.reduce((acc, scan) => {
    const device = scan.device_type || 'unknown';
    acc[device] = (acc[device] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCountries = Object.entries(
    scans.reduce((acc, scan) => {
      const country = scan.country || 'Unknown';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (loading) {
    return <div className="text-center py-8 text-slate-600">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
            <BarChart3 className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalScans}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Mobile</CardTitle>
            <Smartphone className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deviceBreakdown.mobile || 0}</div>
            <p className="text-xs text-slate-500">
              {totalScans > 0 ? Math.round(((deviceBreakdown.mobile || 0) / totalScans) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Desktop</CardTitle>
            <Monitor className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deviceBreakdown.desktop || 0}</div>
            <p className="text-xs text-slate-500">
              {totalScans > 0 ? Math.round(((deviceBreakdown.desktop || 0) / totalScans) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tablet</CardTitle>
            <Tablet className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deviceBreakdown.tablet || 0}</div>
            <p className="text-xs text-slate-500">
              {totalScans > 0 ? Math.round(((deviceBreakdown.tablet || 0) / totalScans) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Countries</CardTitle>
        </CardHeader>
        <CardContent>
          {topCountries.length > 0 ? (
            <div className="space-y-3">
              {topCountries.map(([country, count]) => (
                <div key={country} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-slate-600" />
                    <span className="text-sm font-medium">{country}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600"
                        style={{ width: `${(count / totalScans) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-slate-600 w-12 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 text-center py-4">No data yet</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Scans</CardTitle>
        </CardHeader>
        <CardContent>
          {scans.length > 0 ? (
            <div className="space-y-2">
              {scans.slice(0, 10).map((scan) => (
                <div key={scan.id} className="flex items-center justify-between text-sm py-2 border-b last:border-0">
                  <div>
                    <span className="font-medium">{scan.device_type || 'Unknown'}</span>
                    <span className="text-slate-500 mx-2">•</span>
                    <span className="text-slate-600">{scan.os || 'Unknown OS'}</span>
                    {scan.country && (
                      <>
                        <span className="text-slate-500 mx-2">•</span>
                        <span className="text-slate-600">{scan.country}</span>
                      </>
                    )}
                  </div>
                  <span className="text-xs text-slate-500">
                    {new Date(scan.scanned_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 text-center py-4">No scans yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
