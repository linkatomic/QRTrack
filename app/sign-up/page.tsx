import Link from 'next/link';
import { SignUpForm } from '@/components/auth/sign-up-form';
import { QrCode } from 'lucide-react';

export const metadata = {
  title: 'Sign Up - QRTrack',
  description: 'Create your QRTrack account',
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <QrCode className="h-10 w-10 text-blue-600" />
            <span className="text-3xl font-bold text-slate-900">QRTrack</span>
          </Link>
        </div>

        <SignUpForm />

        <p className="text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link href="/sign-in" className="text-blue-600 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
