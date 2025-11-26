'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { supabase } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, QrCode, MousePointerClick, Eye, Activity } from 'lucide-react';
import { Database } from '@/lib/supabase/types';

type QRCodeStats = Pick<Database['public']['Tables']['qr_codes']['Row'], 'id' | 'total_scans' | 'status'>;

interface OverviewStats {
  totalQRCodes: number;
  totalScans: number;
  scansToday: number;
  scansThisWeek: number;
  activeQRCodes: number;
  scanTrend: number;
}

export function DashboardOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState<OverviewStats>({
    totalQRCodes: 0,
    totalScans: 0,
    scansToday: 0,
    scansThisWeek: 0,
    activeQRCodes: 0,
    scanTrend: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    const { data: qrCodesData } = await supabase
      .from('qr_codes')
      .select('id, total_scans, status')
      .eq('user_id', user!.id);

    if (!qrCodesData || qrCodesData.length === 0) {
      setLoading(false);
      return;
    }

    const qrCodes: QRCodeStats[] = qrCodesData;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const twoWeeksAgo = new Date(weekAgo);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 7);

    const qrCodeIds = qrCodes.map(qr => qr.id);

    const { data: scansThisWeek } = await supabase
      .from('scans')
      .select('id')
      .in('qr_code_id', qrCodeIds)
      .gte('scanned_at', weekAgo.toISOString());

    const { data: scansLastWeek } = await supabase
      .from('scans')
      .select('id')
      .in('qr_code_id', qrCodeIds)
      .gte('scanned_at', twoWeeksAgo.toISOString())
      .lt('scanned_at', weekAgo.toISOString());

    const { data: scansToday } = await supabase
      .from('scans')
      .select('id')
      .in('qr_code_id', qrCodeIds)
      .gte('scanned_at', today.toISOString());

    const totalScans = qrCodes.reduce((sum, qr) => sum + (qr.total_scans || 0), 0);
    const activeCount = qrCodes.filter(qr => qr.status === 'active').length;

    const thisWeekCount = scansThisWeek?.length || 0;
    const lastWeekCount = scansLastWeek?.length || 0;
    const trend = lastWeekCount > 0
      ? ((thisWeekCount - lastWeekCount) / lastWeekCount) * 100
      : thisWeekCount > 0 ? 100 : 0;

    setStats({
      totalQRCodes: qrCodes?.length || 0,
      totalScans,
      scansToday: scansToday?.length || 0,
      scansThisWeek: thisWeekCount,
      activeQRCodes: activeCount,
      scanTrend: Math.round(trend),
    });

    setLoading(false);
  };

  const statCards = [
    {
      title: 'Total QR Codes',
      value: stats.totalQRCodes,
      icon: QrCode,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Scans',
      value: stats.totalScans.toLocaleString(),
      icon: MousePointerClick,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
    },
    {
      title: 'Scans Today',
      value: stats.scansToday,
      icon: Eye,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: stats.scanTrend,
    },
    {
      title: 'Active Codes',
      value: stats.activeQRCodes,
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-slate-200 rounded w-24" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-slate-200 rounded w-16 mb-2" />
              <div className="h-3 bg-slate-200 rounded w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 border-2 hover:border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                {stat.title}
              </CardTitle>
              <div className={`h-10 w-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
              {stat.trend !== undefined && (
                <div className={`flex items-center text-sm mt-2 ${
                  stat.trend >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend >= 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  <span className="font-medium">
                    {Math.abs(stat.trend)}% vs last week
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
