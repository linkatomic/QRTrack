'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  Sparkles,
  Link2,
  Palette,
  Frame,
  Settings2,
  TrendingUp,
  Wand2,
  Info,
  Zap,
  Shield
} from 'lucide-react';
import { validateURL, buildURLWithUTM } from '@/lib/utils/url-builder';
import { nanoid } from 'nanoid';
import { AdvancedQRGenerator } from './advanced-qr-generator';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const QR_TEMPLATES = [
  { id: 'default', name: 'Default', description: 'Classic black and white' },
  { id: 'modern', name: 'Modern', description: 'Sleek gradient design' },
  { id: 'vibrant', name: 'Vibrant', description: 'Bold and colorful' },
  { id: 'minimal', name: 'Minimal', description: 'Clean and simple' },
  { id: 'business', name: 'Business', description: 'Professional look' },
];

export function NewCreateQRForm() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [destinationUrl, setDestinationUrl] = useState('');
  const [enableTracking, setEnableTracking] = useState(true);

  const [qrColor, setQrColor] = useState('#000000');
  const [qrBgColor, setQrBgColor] = useState('#FFFFFF');
  const [qrSize, setQrSize] = useState('512');
  const [qrErrorCorrection, setQrErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [qrMargin, setQrMargin] = useState('2');
  const [qrTemplate, setQrTemplate] = useState('default');

  const [qrLogoUrl, setQrLogoUrl] = useState('');
  const [qrFrameStyle, setQrFrameStyle] = useState('none');
  const [qrFrameColor, setQrFrameColor] = useState('#000000');
  const [qrFrameText, setQrFrameText] = useState('');
  const [transparentBg, setTransparentBg] = useState(false);

  const [utmSource, setUtmSource] = useState('');
  const [utmMedium, setUtmMedium] = useState('');
  const [utmCampaign, setUtmCampaign] = useState('');

  const applyTemplate = (templateId: string) => {
    setQrTemplate(templateId);
    switch (templateId) {
      case 'modern':
        setQrColor('#3B82F6');
        setQrBgColor('#F0F9FF');
        setQrFrameStyle('rounded');
        break;
      case 'vibrant':
        setQrColor('#EC4899');
        setQrBgColor('#FDF2F8');
        setQrFrameStyle('badge');
        break;
      case 'minimal':
        setQrColor('#1F2937');
        setQrBgColor('#FFFFFF');
        setQrFrameStyle('none');
        break;
      case 'business':
        setQrColor('#1E40AF');
        setQrBgColor('#EFF6FF');
        setQrFrameStyle('professional');
        break;
      default:
        setQrColor('#000000');
        setQrBgColor('#FFFFFF');
        setQrFrameStyle('none');
    }
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
          enable_tracking: enableTracking,
          utm_source: enableTracking ? (utmSource || null) : null,
          utm_medium: enableTracking ? (utmMedium || null) : null,
          utm_campaign: enableTracking ? (utmCampaign || null) : null,
          qr_color: qrColor,
          qr_bg_color: qrBgColor,
          qr_size: parseInt(qrSize),
          qr_error_correction: qrErrorCorrection,
          qr_margin: parseInt(qrMargin),
          qr_template: qrTemplate,
          qr_logo_url: qrLogoUrl || null,
          qr_frame_style: qrFrameStyle,
          qr_frame_color: qrFrameColor,
          qr_frame_text: qrFrameText || null,
          transparent_bg: transparentBg,
          download_format: 'png',
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      router.push(`/dashboard/qr/${data.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create QR code');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 -m-8 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create QR Code
            </h1>
          </div>
          <p className="text-slate-600 ml-14">Design beautiful, trackable QR codes in seconds</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Card className="border-2 shadow-xl bg-white/80 backdrop-blur">
                <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
                  <CardTitle className="flex items-center gap-2">
                    <Link2 className="h-5 w-5 text-blue-600" />
                    Basic Setup
                  </CardTitle>
                  <CardDescription>Essential information for your QR code</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-base font-semibold">QR Code Name *</Label>
                    <Input
                      id="name"
                      placeholder="Summer Campaign 2024"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-12 text-base"
                      required
                    />
                    <p className="text-sm text-slate-500">Give it a memorable name for easy reference</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="destinationUrl" className="text-base font-semibold">Destination URL *</Label>
                    <Input
                      id="destinationUrl"
                      type="url"
                      placeholder="https://example.com/special-offer"
                      value={destinationUrl}
                      onChange={(e) => setDestinationUrl(e.target.value)}
                      className="h-12 text-base"
                      required
                    />
                    <p className="text-sm text-slate-500">Where users will be redirected when scanning</p>
                  </div>

                  <Separator />

                  <div className="flex items-start justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-5 w-5 text-amber-700" />
                        <Label className="text-base font-semibold text-amber-900">Enable Analytics Tracking</Label>
                        <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-300">
                          <Zap className="h-3 w-3 mr-1" />
                          Recommended
                        </Badge>
                      </div>
                      <p className="text-sm text-amber-700">
                        Track scans, devices, locations, and more. Disable for direct URL redirection.
                      </p>
                      {!enableTracking && (
                        <div className="mt-2 flex items-start gap-2 text-xs text-amber-600">
                          <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>QR will redirect directly to your URL without analytics</span>
                        </div>
                      )}
                    </div>
                    <Switch
                      checked={enableTracking}
                      onCheckedChange={setEnableTracking}
                      className="ml-4"
                    />
                  </div>

                  {enableTracking && (
                    <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-4 w-4 text-blue-700" />
                        <Label className="text-sm font-semibold text-blue-900">UTM Parameters (Optional)</Label>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input
                          placeholder="Source (e.g., newsletter)"
                          value={utmSource}
                          onChange={(e) => setUtmSource(e.target.value)}
                          className="bg-white"
                        />
                        <Input
                          placeholder="Medium (e.g., email)"
                          value={utmMedium}
                          onChange={(e) => setUtmMedium(e.target.value)}
                          className="bg-white"
                        />
                        <Input
                          placeholder="Campaign (e.g., summer)"
                          value={utmCampaign}
                          onChange={(e) => setUtmCampaign(e.target.value)}
                          className="bg-white"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-2 shadow-xl bg-white/80 backdrop-blur">
                <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-pink-50">
                  <CardTitle className="flex items-center gap-2">
                    <Wand2 className="h-5 w-5 text-purple-600" />
                    Design Templates
                  </CardTitle>
                  <CardDescription>Choose a pre-designed style or customize your own</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {QR_TEMPLATES.map((template) => (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => applyTemplate(template.id)}
                        className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                          qrTemplate === template.id
                            ? 'border-blue-600 bg-blue-50 shadow-lg'
                            : 'border-slate-200 bg-white hover:border-blue-300'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2">✨</div>
                          <div className="font-semibold text-sm">{template.name}</div>
                          <div className="text-xs text-slate-500 mt-1">{template.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 shadow-xl bg-white/80 backdrop-blur">
                <CardHeader className="border-b bg-gradient-to-r from-pink-50 to-rose-50">
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-pink-600" />
                    Customization
                  </CardTitle>
                  <CardDescription>Fine-tune colors, size, and appearance</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <Tabs defaultValue="colors" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="colors">Colors</TabsTrigger>
                      <TabsTrigger value="frame">Frame</TabsTrigger>
                      <TabsTrigger value="advanced">Advanced</TabsTrigger>
                    </TabsList>

                    <TabsContent value="colors" className="space-y-4 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Foreground Color</Label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              value={qrColor}
                              onChange={(e) => setQrColor(e.target.value)}
                              className="w-16 h-12"
                            />
                            <Input
                              value={qrColor}
                              onChange={(e) => setQrColor(e.target.value)}
                              className="flex-1 font-mono"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Background Color</Label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              value={qrBgColor}
                              onChange={(e) => setQrBgColor(e.target.value)}
                              className="w-16 h-12"
                            />
                            <Input
                              value={qrBgColor}
                              onChange={(e) => setQrBgColor(e.target.value)}
                              className="flex-1 font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <Label>Transparent Background</Label>
                        <Switch checked={transparentBg} onCheckedChange={setTransparentBg} />
                      </div>
                    </TabsContent>

                    <TabsContent value="frame" className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label>Frame Style</Label>
                        <Select value={qrFrameStyle} onValueChange={setQrFrameStyle}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No Frame</SelectItem>
                            <SelectItem value="rounded">Rounded</SelectItem>
                            <SelectItem value="badge">Badge</SelectItem>
                            <SelectItem value="professional">Professional</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {qrFrameStyle !== 'none' && (
                        <>
                          <div className="space-y-2">
                            <Label>Frame Text</Label>
                            <Input
                              placeholder="SCAN ME"
                              value={qrFrameText}
                              onChange={(e) => setQrFrameText(e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Frame Color</Label>
                            <div className="flex gap-2">
                              <Input
                                type="color"
                                value={qrFrameColor}
                                onChange={(e) => setQrFrameColor(e.target.value)}
                                className="w-16 h-12"
                              />
                              <Input
                                value={qrFrameColor}
                                onChange={(e) => setQrFrameColor(e.target.value)}
                                className="flex-1 font-mono"
                              />
                            </div>
                          </div>
                        </>
                      )}

                      <div className="space-y-2">
                        <Label>Logo URL (Optional)</Label>
                        <Input
                          type="url"
                          placeholder="https://example.com/logo.png"
                          value={qrLogoUrl}
                          onChange={(e) => setQrLogoUrl(e.target.value)}
                        />
                        <p className="text-xs text-slate-500">Add your logo to the center</p>
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
                            <SelectItem value="256">256x256 - Small</SelectItem>
                            <SelectItem value="512">512x512 - Standard</SelectItem>
                            <SelectItem value="1024">1024x1024 - Large</SelectItem>
                            <SelectItem value="2048">2048x2048 - Print</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Error Correction</Label>
                        <Select value={qrErrorCorrection} onValueChange={(v) => setQrErrorCorrection(v as any)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="L">Low (7%)</SelectItem>
                            <SelectItem value="M">Medium (15%)</SelectItem>
                            <SelectItem value="Q">Quartile (25%)</SelectItem>
                            <SelectItem value="H">High (30%)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Margin Size</Label>
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
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <div className="flex gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
                  size="lg"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !destinationUrl || !name}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8"
                >
                  {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  <Sparkles className="mr-2 h-5 w-5" />
                  Create QR Code
                </Button>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-4">
                <Card className="border-2 shadow-2xl bg-white/90 backdrop-blur">
                  <CardHeader className="border-b bg-gradient-to-r from-green-50 to-emerald-50">
                    <CardTitle className="flex items-center gap-2">
                      <Frame className="h-5 w-5 text-green-600" />
                      Live Preview
                    </CardTitle>
                    <CardDescription>Real-time QR code visualization</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {destinationUrl && validateURL(destinationUrl) ? (
                      <>
                        <AdvancedQRGenerator
                          url={destinationUrl}
                          color={qrColor}
                          bgColor={qrBgColor}
                          size={parseInt(qrSize)}
                          margin={parseInt(qrMargin)}
                          errorLevel={qrErrorCorrection}
                          logoUrl={qrLogoUrl}
                          frameStyle={qrFrameStyle}
                          frameColor={qrFrameColor}
                          frameText={qrFrameText}
                          transparent={transparentBg}
                        />
                        {!enableTracking && (
                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-start gap-2 text-xs text-green-700">
                              <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="font-semibold">Direct Link Mode</span>
                                <p className="mt-1">QR code will link directly to your URL without tracking</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                        <Settings2 className="h-16 w-16 text-slate-300 mb-4" />
                        <p className="text-center text-slate-600 font-medium">Enter a URL to preview</p>
                        <p className="text-center text-sm text-slate-500 mt-1">Your QR code will appear here</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-2 bg-gradient-to-br from-blue-50 to-purple-50">
                  <CardContent className="pt-6">
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <div className="p-1 bg-blue-100 rounded">
                          <Info className="h-4 w-4 text-blue-700" />
                        </div>
                        <div>
                          <div className="font-semibold text-blue-900">Pro Tip</div>
                          <div className="text-blue-700">Use templates for quick professional designs</div>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-start gap-2">
                        <div className="p-1 bg-purple-100 rounded">
                          <Zap className="h-4 w-4 text-purple-700" />
                        </div>
                        <div>
                          <div className="font-semibold text-purple-900">Analytics</div>
                          <div className="text-purple-700">Enable tracking to monitor performance</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
