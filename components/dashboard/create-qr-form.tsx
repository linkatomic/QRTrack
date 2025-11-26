'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { validateURL, buildURLWithUTM } from '@/lib/utils/url-builder';
import { nanoid } from 'nanoid';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function CreateQRForm() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const [name, setName] = useState('');
  const [destinationUrl, setDestinationUrl] = useState('');
  const [qrColor, setQrColor] = useState('#000000');

  const [utmSource, setUtmSource] = useState('');
  const [utmMedium, setUtmMedium] = useState('');
  const [utmCampaign, setUtmCampaign] = useState('');
  const [utmTerm, setUtmTerm] = useState('');
  const [utmContent, setUtmContent] = useState('');

  const [landingPageEnabled, setLandingPageEnabled] = useState(false);
  const [landingPageTitle, setLandingPageTitle] = useState('');
  const [landingPageDescription, setLandingPageDescription] = useState('');

  const updatePreview = () => {
    if (destinationUrl && validateURL(destinationUrl)) {
      const preview = buildURLWithUTM(destinationUrl, {
        source: utmSource,
        medium: utmMedium,
        campaign: utmCampaign,
        term: utmTerm,
        content: utmContent,
      });
      setPreviewUrl(preview);
    } else {
      setPreviewUrl('');
    }
  };

  const handleDestinationChange = (value: string) => {
    setDestinationUrl(value);
    setTimeout(updatePreview, 100);
  };

  const handleUtmChange = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setTimeout(updatePreview, 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter a name for your QR code');
      return;
    }

    if (!validateURL(destinationUrl)) {
      setError('Please enter a valid URL (must start with http:// or https://)');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const shortCode = nanoid(8);

      const { data, error: insertError } = await supabase
        .from('qr_codes')
        .insert({
          user_id: user!.id,
          name,
          destination_url: destinationUrl,
          short_code: shortCode,
          utm_source: utmSource || null,
          utm_medium: utmMedium || null,
          utm_campaign: utmCampaign || null,
          utm_term: utmTerm || null,
          utm_content: utmContent || null,
          qr_color: qrColor,
          landing_page_enabled: landingPageEnabled,
          landing_page_title: landingPageTitle || null,
          landing_page_description: landingPageDescription || null,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      router.push(`/dashboard/qr/${data.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create QR code');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Set up your QR code details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">QR Code Name</Label>
            <Input
              id="name"
              placeholder="Summer Campaign 2024"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <p className="text-xs text-slate-500">A descriptive name for your reference</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="destinationUrl">Destination URL</Label>
            <Input
              id="destinationUrl"
              type="url"
              placeholder="https://example.com"
              value={destinationUrl}
              onChange={(e) => handleDestinationChange(e.target.value)}
              required
            />
            <p className="text-xs text-slate-500">Where users will be redirected</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="qrColor">QR Code Color</Label>
            <div className="flex gap-2 items-center">
              <Input
                id="qrColor"
                type="color"
                value={qrColor}
                onChange={(e) => setQrColor(e.target.value)}
                className="w-20 h-10"
              />
              <span className="text-sm text-slate-600">{qrColor}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>UTM Parameters</CardTitle>
          <CardDescription>Track your campaign performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="utmSource">Source</Label>
              <Input
                id="utmSource"
                placeholder="newsletter"
                value={utmSource}
                onChange={(e) => handleUtmChange(setUtmSource)(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="utmMedium">Medium</Label>
              <Input
                id="utmMedium"
                placeholder="email"
                value={utmMedium}
                onChange={(e) => handleUtmChange(setUtmMedium)(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="utmCampaign">Campaign</Label>
              <Input
                id="utmCampaign"
                placeholder="summer_sale"
                value={utmCampaign}
                onChange={(e) => handleUtmChange(setUtmCampaign)(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="utmTerm">Term</Label>
              <Input
                id="utmTerm"
                placeholder="discount"
                value={utmTerm}
                onChange={(e) => handleUtmChange(setUtmTerm)(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="utmContent">Content</Label>
            <Input
              id="utmContent"
              placeholder="header_cta"
              value={utmContent}
              onChange={(e) => handleUtmChange(setUtmContent)(e.target.value)}
            />
          </div>

          {previewUrl && (
            <div className="mt-4 p-4 bg-slate-50 rounded-lg">
              <p className="text-xs font-medium text-slate-700 mb-1">URL Preview:</p>
              <p className="text-xs text-slate-600 break-all">{previewUrl}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Landing Page</CardTitle>
          <CardDescription>Create an SEO-friendly landing page</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Landing Page</Label>
              <p className="text-xs text-slate-500">Show a branded page before redirecting</p>
            </div>
            <Switch
              checked={landingPageEnabled}
              onCheckedChange={setLandingPageEnabled}
            />
          </div>

          {landingPageEnabled && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="landingPageTitle">Page Title</Label>
                <Input
                  id="landingPageTitle"
                  placeholder="Check out our summer sale"
                  value={landingPageTitle}
                  onChange={(e) => setLandingPageTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="landingPageDescription">Page Description</Label>
                <Input
                  id="landingPageDescription"
                  placeholder="Get 30% off all products this summer"
                  value={landingPageDescription}
                  onChange={(e) => setLandingPageDescription(e.target.value)}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create QR Code
        </Button>
      </div>
    </form>
  );
}
