import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { QRList } from '@/components/dashboard/qr-list';
import { DashboardOverview } from '@/components/dashboard/dashboard-overview';
import { Plus, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Dashboard - QRTrack',
  description: 'Manage your QR codes and view analytics',
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-600 mt-2 text-lg">Monitor your QR code performance and engagement</p>
        </div>
        <Link href="/dashboard/create">
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/30">
            <Plus className="mr-2 h-5 w-5" />
            Create QR Code
          </Button>
        </Link>
      </div>

      <DashboardOverview />

      <div className="pt-4">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Your QR Codes</h2>
          <Sparkles className="h-5 w-5 text-blue-600" />
        </div>
        <QRList />
      </div>
    </div>
  );
}
