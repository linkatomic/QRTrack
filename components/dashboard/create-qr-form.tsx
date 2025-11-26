'use client';

import { useState, useEffect } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Palette, Eye, Layers, Image as ImageIcon, Settings2, QrCode } from 'lucide-react';
import { generateQRCode } from '@/lib/qr/generator';
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
  const [qrPreview, setQrPreview] = useState<string>('');
  const [generatingPreview, setGeneratingPreview] = useState(false);

  const [name, setName] = useState('');
  const [destinationUrl, setDestinationUrl] = useState('');
  const [qrColor, setQrColor] = useState('#000000');
  const [qrStyle, setQrStyle] = useState('square');
  const [qrEyeStyle, setQrEyeStyle] = useState('square');
  const [qrBgColor, setQrBgColor] = useState('#FFFFFF');
  const [qrGradientType, setQrGradientType] = useState('none');
  const [qrGradientColor, setQrGradientColor] = useState('#0000FF');
  const [qrLogoUrl, setQrLogoUrl] = useState('');
  const [qrSize, setQrSize] = useState('512');
  const [qrErrorCorrection, setQrErrorCorrection] = useState('M');
  const [qrMargin, setQrMargin] = useState('2');

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

  const updateQRPreview = async () => {
    if (!destinationUrl || !validateURL(destinationUrl)) {
      setQrPreview('');
      return;
    }

    setGeneratingPreview(true);
    try {
      const preview = await generateQRCode({
        url: destinationUrl,
        color: qrColor,
        bgColor: qrBgColor,
        size: parseInt(qrSize),
        margin: parseInt(qrMargin),
        errorCorrectionLevel: qrErrorCorrection as 'L' | 'M' | 'Q' | 'H',
      });
      setQrPreview(preview);
    } catch (err) {
      console.error('Failed to generate preview:', err);
    } finally {
      setGeneratingPreview(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      updateQRPreview();
    }, 500);
    return () => clearTimeout(timer);
  }, [destinationUrl, qrColor, qrBgColor, qrStyle, qrEyeStyle, qrGradientType, qrGradientColor, qrSize, qrMargin, qrErrorCorrection]);

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

      console.log('Creating QR code with user_id:', user!.id);
      console.log('Short code:', shortCode);

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
          qr_style: qrStyle,
          qr_eye_style: qrEyeStyle,
          qr_bg_color: qrBgColor,
          qr_gradient_type: qrGradientType,
          qr_gradient_color: qrGradientType !== 'none' ? qrGradientColor : null,
          qr_logo_url: qrLogoUrl || null,
          qr_size: parseInt(qrSize),
          qr_error_correction: qrErrorCorrection,
          qr_margin: parseInt(qrMargin),
          landing_page_enabled: landingPageEnabled,
          landing_page_title: landingPageTitle || null,
          landing_page_description: landingPageDescription || null,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        throw insertError;
      }

      console.log('QR code created successfully:', data);
      router.push(`/dashboard/qr/${data.id}`);
    } catch (err: any) {
      console.error('Full error:', err);
      setError(err.message || 'Failed to create QR code');
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
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

        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            QR Code Design
          </CardTitle>
          <CardDescription>Customize the appearance of your QR code</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="style" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="style" className="text-xs">Style</TabsTrigger>
              <TabsTrigger value="colors" className="text-xs">Colors</TabsTrigger>
              <TabsTrigger value="logo" className="text-xs">Logo</TabsTrigger>
              <TabsTrigger value="advanced" className="text-xs">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="style" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>QR Code Pattern Style</Label>
                <Select value={qrStyle} onValueChange={setQrStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="square">Square (Classic)</SelectItem>
                    <SelectItem value="dots">Dots (Modern)</SelectItem>
                    <SelectItem value="rounded">Rounded (Smooth)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500">Shape of the QR code data modules</p>
              </div>

              <div className="space-y-2">
                <Label>Corner Eye Style</Label>
                <Select value={qrEyeStyle} onValueChange={setQrEyeStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="dots">Dots</SelectItem>
                    <SelectItem value="rounded">Rounded</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500">Style of the three corner patterns</p>
              </div>
            </TabsContent>

            <TabsContent value="colors" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="qrColor">Foreground Color</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="qrColor"
                    type="color"
                    value={qrColor}
                    onChange={(e) => setQrColor(e.target.value)}
                    className="w-20 h-10"
                  />
                  <span className="text-sm font-mono text-slate-600">{qrColor}</span>
                </div>
                <p className="text-xs text-slate-500">Primary color of QR code</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="qrBgColor">Background Color</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="qrBgColor"
                    type="color"
                    value={qrBgColor}
                    onChange={(e) => setQrBgColor(e.target.value)}
                    className="w-20 h-10"
                  />
                  <span className="text-sm font-mono text-slate-600">{qrBgColor}</span>
                </div>
                <p className="text-xs text-slate-500">Background color (keep light for best scanning)</p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Gradient Effect</Label>
                <Select value={qrGradientType} onValueChange={setQrGradientType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Gradient</SelectItem>
                    <SelectItem value="linear">Linear Gradient</SelectItem>
                    <SelectItem value="radial">Radial Gradient</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500">Add gradient effect to QR code</p>
              </div>

              {qrGradientType !== 'none' && (
                <div className="space-y-2">
                  <Label htmlFor="qrGradientColor">Gradient Second Color</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      id="qrGradientColor"
                      type="color"
                      value={qrGradientColor}
                      onChange={(e) => setQrGradientColor(e.target.value)}
                      className="w-20 h-10"
                    />
                    <span className="text-sm font-mono text-slate-600">{qrGradientColor}</span>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="logo" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="qrLogoUrl">Logo URL (Optional)</Label>
                <Input
                  id="qrLogoUrl"
                  type="url"
                  placeholder="https://example.com/logo.png"
                  value={qrLogoUrl}
                  onChange={(e) => setQrLogoUrl(e.target.value)}
                />
                <p className="text-xs text-slate-500">Add your logo to the center of QR code</p>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-900">
                  <strong>Pro Tip:</strong> Use a square logo with transparent background for best results. The logo will cover ~20% of the QR code center.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>QR Code Size</Label>
                <Select value={qrSize} onValueChange={setQrSize}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="256">256x256 (Small)</SelectItem>
                    <SelectItem value="512">512x512 (Standard)</SelectItem>
                    <SelectItem value="1024">1024x1024 (Large)</SelectItem>
                    <SelectItem value="2048">2048x2048 (Print Quality)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500">Resolution for generated QR code</p>
              </div>

              <div className="space-y-2">
                <Label>Error Correction Level</Label>
                <Select value={qrErrorCorrection} onValueChange={setQrErrorCorrection}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">Low (7%) - Smaller code</SelectItem>
                    <SelectItem value="M">Medium (15%) - Balanced</SelectItem>
                    <SelectItem value="Q">Quartile (25%) - Good</SelectItem>
                    <SelectItem value="H">High (30%) - Best for logos</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500">Higher levels allow more damage/obscuring</p>
              </div>

              <div className="space-y-2">
                <Label>Quiet Zone (Margin)</Label>
                <Select value={qrMargin} onValueChange={setQrMargin}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">None</SelectItem>
                    <SelectItem value="1">Small</SelectItem>
                    <SelectItem value="2">Standard</SelectItem>
                    <SelectItem value="4">Large</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500">White space around QR code</p>
              </div>
            </TabsContent>
          </Tabs>
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
            <Button type="submit" disabled={loading || !destinationUrl}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create QR Code
            </Button>
          </div>
        </form>
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Live Preview
              </CardTitle>
              <CardDescription>See your QR code in real-time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center items-center min-h-[300px] bg-slate-50 rounded-lg p-4">
                {generatingPreview ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <p className="text-sm text-slate-600">Generating preview...</p>
                  </div>
                ) : qrPreview ? (
                  <div className="space-y-3">
                    <img
                      src={qrPreview}
                      alt="QR Code Preview"
                      className="w-64 h-64 rounded-lg shadow-md"
                      style={{ backgroundColor: qrBgColor }}
                    />
                    <div className="text-center">
                      <p className="text-xs text-slate-500">Size: {qrSize}x{qrSize}</p>
                      <p className="text-xs text-slate-500">Error Correction: {qrErrorCorrection}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-center p-8">
                    <QrCode className="h-16 w-16 text-slate-300" />
                    <p className="text-sm text-slate-600">Enter a destination URL to see preview</p>
                  </div>
                )}
              </div>

              {qrPreview && (
                <div className="space-y-2">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs font-medium text-blue-900 mb-1">Preview Stats:</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-blue-800">
                      <div>
                        <span className="text-blue-600">Style:</span> {qrStyle}
                      </div>
                      <div>
                        <span className="text-blue-600">Eyes:</span> {qrEyeStyle}
                      </div>
                      <div>
                        <span className="text-blue-600">Colors:</span> FG/BG
                      </div>
                      <div>
                        <span className="text-blue-600">Gradient:</span> {qrGradientType}
                      </div>
                    </div>
                  </div>

                  {destinationUrl && (
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs font-medium text-slate-700 mb-1">Target URL:</p>
                      <p className="text-xs text-slate-600 break-all">{destinationUrl}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
