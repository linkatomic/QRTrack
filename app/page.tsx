'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, BarChart3, Globe, Zap, Shield, Target, ArrowRight, Check, Sparkles, TrendingUp, Users, Smartphone } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <QrCode className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">QRTrack</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">Features</Link>
              <Link href="#how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">How It Works</Link>
              <Link href="#pricing" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">Pricing</Link>
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/sign-in">
                <Button variant="ghost" className="font-medium">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 font-medium shadow-lg shadow-blue-500/30 transition-all duration-300">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="container mx-auto px-4 pt-20 pb-32 lg:pt-32 lg:pb-40 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-cyan-50/50 pointer-events-none" />
          <div className={`max-w-5xl mx-auto text-center space-y-8 relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-medium text-sm mb-4">
              <Sparkles className="h-4 w-4" />
              Trusted by 10,000+ marketers worldwide
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight tracking-tight">
              Transform QR Codes into
              <span className="block mt-2 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]"> Marketing Intelligence</span>
            </h1>
            <p className="text-xl lg:text-2xl text-slate-600 leading-relaxed max-w-3xl mx-auto font-light">
              Create, track, and optimize your QR code campaigns with powerful analytics. Connect offline engagement to online conversions seamlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link href="/sign-up">
                <Button size="lg" className="text-lg px-8 h-14 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 font-semibold shadow-xl shadow-blue-500/30 transition-all duration-300 group">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="text-lg px-8 h-14 font-semibold border-2 hover:bg-slate-50 transition-all duration-300">
                  See How It Works
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8 pt-12 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Free 14-day trial
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Cancel anytime
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="container mx-auto px-4 py-24 bg-white relative">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-1 rounded-full bg-slate-100 text-slate-700 font-medium text-sm mb-4">FEATURES</div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">Everything You Need to Succeed</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light">
              Powerful features designed for modern marketers and data-driven teams
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            <Card className="border-2 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="space-y-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Zap className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl">Instant QR Creation</CardTitle>
                <CardDescription className="text-base">
                  Generate custom QR codes in seconds with your brand colors, logos, and destination URLs. No design skills required.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-cyan-300 hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="space-y-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <BarChart3 className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl">Real-Time Analytics</CardTitle>
                <CardDescription className="text-base">
                  Track every scan with detailed insights on devices, locations, and user behavior. Beautiful dashboards included.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-green-300 hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="space-y-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Target className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl">Smart UTM Tracking</CardTitle>
                <CardDescription className="text-base">
                  Built-in UTM builder automatically tracks campaign performance across all your analytics platforms.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-orange-300 hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="space-y-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Globe className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl">SEO-Optimized Pages</CardTitle>
                <CardDescription className="text-base">
                  Every QR code gets a fully optimized landing page with proper meta tags and search engine visibility.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-red-300 hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="space-y-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl">Enterprise Security</CardTitle>
                <CardDescription className="text-base">
                  Bank-level encryption, 99.9% uptime SLA, and lightning-fast global CDN for instant redirects worldwide.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-pink-300 hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="space-y-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Smartphone className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl">Multi-Format Export</CardTitle>
                <CardDescription className="text-base">
                  Download QR codes as PNG, SVG, or PDF. Perfect for print, digital, or product packaging.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        <section id="how-it-works" className="container mx-auto px-4 py-24 bg-gradient-to-br from-slate-50 to-white">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-1 rounded-full bg-slate-100 text-slate-700 font-medium text-sm mb-4">HOW IT WORKS</div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">Simple, Powerful, Effective</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light">
              Get started in minutes with our intuitive platform
            </p>
          </div>

          <div className="max-w-5xl mx-auto space-y-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 space-y-4">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-lg shadow-lg">1</div>
                <h3 className="text-3xl font-bold text-slate-900">Create Your QR Code</h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Enter your destination URL, customize colors and style, add UTM parameters for tracking, and generate your QR code instantly.
                </p>
              </div>
              <div className="order-1 md:order-2">
                <Card className="p-8 shadow-2xl border-2">
                  <div className="aspect-square bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg flex items-center justify-center">
                    <QrCode className="h-24 w-24 text-blue-600" />
                  </div>
                </Card>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-4">
                <Card className="p-8 shadow-2xl border-2">
                  <div className="aspect-square bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-24 w-24 text-green-600" />
                  </div>
                </Card>
              </div>
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white font-bold text-lg shadow-lg">2</div>
                <h3 className="text-3xl font-bold text-slate-900">Track Every Scan</h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Monitor real-time analytics as users scan your QR codes. See device types, locations, timestamps, and conversion paths.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 space-y-4">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white font-bold text-lg shadow-lg">3</div>
                <h3 className="text-3xl font-bold text-slate-900">Optimize & Scale</h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Use insights to improve campaigns, A/B test different destinations, and scale what works. Export reports to share with your team.
                </p>
              </div>
              <div className="order-1 md:order-2">
                <Card className="p-8 shadow-2xl border-2">
                  <div className="aspect-square bg-gradient-to-br from-orange-50 to-red-50 rounded-lg flex items-center justify-center">
                    <Users className="h-24 w-24 text-orange-600" />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-24">
          <Card className="max-w-5xl mx-auto bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 text-white border-none shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
            <CardContent className="p-12 lg:p-16 text-center space-y-6 relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold">Ready to Transform Your Marketing?</h2>
              <p className="text-xl lg:text-2xl text-blue-50 max-w-3xl mx-auto font-light">
                Join thousands of marketers and creators using QRTrack to bridge offline and online experiences
              </p>
              <div className="pt-6">
                <Link href="/sign-up">
                  <Button size="lg" variant="secondary" className="text-lg px-10 h-14 font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group bg-white hover:bg-slate-50">
                    Start Your Free Trial
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-blue-100 pt-4">No credit card required • 14-day free trial • Cancel anytime</p>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t bg-slate-900 text-slate-300 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                  <QrCode className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">QRTrack</span>
              </Link>
              <p className="text-slate-400 leading-relaxed">
                The most powerful QR code analytics platform for modern marketers.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm">
              © 2025 QRTrack. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <Link href="#" className="hover:text-white transition-colors">Terms</Link>
              <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-white transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
