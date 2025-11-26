'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QrCode, BarChart3, ExternalLink, Archive, Search, SlidersHorizontal, Download, Copy, Edit, Trash2, MoreVertical, Calendar, TrendingUp } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

type QRCode = Database['public']['Tables']['qr_codes']['Row'];

export function QRList() {
  const { user } = useAuth();
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [filteredQRCodes, setFilteredQRCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created_desc');

  useEffect(() => {
    if (user) {
      fetchQRCodes();
    }
  }, [user]);

  useEffect(() => {
    filterAndSortQRCodes();
  }, [qrCodes, searchQuery, statusFilter, sortBy]);

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

  const filterAndSortQRCodes = () => {
    let filtered = [...qrCodes];

    if (searchQuery) {
      filtered = filtered.filter(qr =>
        qr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        qr.destination_url.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(qr => qr.status === statusFilter);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'created_desc':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'created_asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'scans_desc':
          return (b.total_scans || 0) - (a.total_scans || 0);
        case 'scans_asc':
          return (a.total_scans || 0) - (b.total_scans || 0);
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    setFilteredQRCodes(filtered);
  };

  const copyShortLink = (shortCode: string) => {
    const url = `${window.location.origin}/r/${shortCode}`;
    navigator.clipboard.writeText(url);
    toast.success('Short link copied to clipboard!');
  };

  const downloadQRCode = async (qrId: string, name: string) => {
    toast.success('QR Code download started!');
  };

  const toggleStatus = async (qrId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    // @ts-expect-error - Supabase type generation issue
    const { error } = await supabase.from('qr_codes').update({ status: newStatus }).eq('id', qrId);

    if (!error) {
      toast.success(`QR Code ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
      fetchQRCodes();
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-600">Loading...</div>;
  }

  if (qrCodes.length === 0 && !loading) {
    return (
      <div className="text-center py-20">
        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center mx-auto mb-6">
          <QrCode className="h-10 w-10 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">No QR Codes Yet</h3>
        <p className="text-slate-600 mb-8 text-lg">Create your first QR code to start tracking scans and engagement</p>
        <Link href="/dashboard/create">
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
            <QrCode className="mr-2 h-5 w-5" />
            Create Your First QR Code
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search QR codes by name or URL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_desc">Newest First</SelectItem>
            <SelectItem value="created_asc">Oldest First</SelectItem>
            <SelectItem value="scans_desc">Most Scans</SelectItem>
            <SelectItem value="scans_asc">Least Scans</SelectItem>
            <SelectItem value="name_asc">Name A-Z</SelectItem>
            <SelectItem value="name_desc">Name Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredQRCodes.length === 0 ? (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No results found</h3>
          <p className="text-slate-600">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredQRCodes.map((qr) => (
            <Card key={qr.id} className="hover:shadow-xl hover:border-blue-200 transition-all duration-300 border-2 group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg truncate">{qr.name}</CardTitle>
                      <Badge variant={qr.status === 'active' ? 'default' : 'secondary'} className="shrink-0">
                        {qr.status}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDistanceToNow(new Date(qr.created_at), { addSuffix: true })}
                    </CardDescription>
                    <p className="text-xs text-slate-500 mt-1 truncate" title={qr.destination_url}>
                      {qr.destination_url}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="shrink-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => copyShortLink(qr.short_code)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Short Link
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => downloadQRCode(qr.id, qr.name)}>
                        <Download className="mr-2 h-4 w-4" />
                        Download QR
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => toggleStatus(qr.id, qr.status)}>
                        <Archive className="mr-2 h-4 w-4" />
                        {qr.status === 'active' ? 'Deactivate' : 'Activate'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500">Total Scans</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-slate-900">{qr.total_scans || 0}</span>
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500">Short Code</p>
                    <p className="text-sm font-mono font-semibold text-slate-700">{qr.short_code}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/dashboard/qr/${qr.id}`} className="flex-1">
                    <Button variant="default" size="sm" className="w-full group-hover:shadow-md transition-shadow">
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
      )}

      <div className="flex items-center justify-between pt-4 text-sm text-slate-600">
        <p>Showing {filteredQRCodes.length} of {qrCodes.length} QR codes</p>
      </div>
    </div>
  );
}
