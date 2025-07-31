'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Mail, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      const response = await api.post('/auth/verify-email', { token: verificationToken });
      setVerificationStatus('success');
      setMessage('Your email has been successfully verified!');
    } catch (error: any) {
      setVerificationStatus('error');
      setMessage(error.response?.data?.message || 'Verification failed. The link may be expired.');
    }
  };

  const resendVerification = async () => {
    try {
      const email = localStorage.getItem('userEmail'); // You might want to get this from context
      if (email) {
        await api.get(`/auth/resend-verification?email=${email}`);
        setMessage('A new verification email has been sent. Please check your inbox.');
      }
    } catch (error) {
      setMessage('Failed to resend verification email. Please try again later.');
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle>Check Your Email</CardTitle>
            <CardDescription>
              We've sent a verification link to your email address
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Please check your inbox and click the verification link to activate your account.
            </p>
            <div className="space-y-2">
              <Button onClick={resendVerification} variant="outline" className="w-full">
                Resend Verification Email
              </Button>
              <Link href="/login" className="block">
                <Button variant="default" className="w-full">
                  Go to Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {verificationStatus === 'pending' && (
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          )}
          {verificationStatus === 'success' && (
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          )}
          {verificationStatus === 'error' && (
            <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          )}
          <CardTitle>
            {verificationStatus === 'pending' && 'Verifying Your Email'}
            {verificationStatus === 'success' && 'Email Verified!'}
            {verificationStatus === 'error' && 'Verification Failed'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">{message}</p>
          {verificationStatus === 'success' && (
            <Link href="/login">
              <Button className="w-full">
                Continue to Login
              </Button>
            </Link>
          )}
          {verificationStatus === 'error' && (
            <div className="space-y-2">
              <Button onClick={resendVerification} variant="outline" className="w-full">
                Resend Verification Email
              </Button>
              <Link href="/login" className="block">
                <Button variant="default" className="w-full">
                  Go to Login
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
