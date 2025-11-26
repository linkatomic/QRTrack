import Link from 'next/link';
import { SignInForm } from '@/components/auth/sign-in-form';
import { QrCode } from 'lucide-react';

export const metadata = {
  title: 'Sign In - QRTrack',
  description: 'Sign in to your QRTrack account',
};

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <QrCode className="h-10 w-10 text-blue-600" />
            <span className="text-3xl font-bold text-slate-900">QRTrack</span>
          </Link>
        </div>

        <SignInForm />

        <p className="text-center text-sm text-slate-600">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="text-blue-600 hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
