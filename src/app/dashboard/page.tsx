'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { normalizeUserType } from '@/lib/userUtils';

export default function DashboardRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      const normalizedType = normalizeUserType(user.type);
      
      // Redirect based on user type
      switch (normalizedType) {
        case 'student':
          router.push('/student/dashboard');
          break;
        case 'recruiter':
          router.push('/recruiter/dashboard');
          break;
        case 'universityadmin':
          router.push('/university/dashboard');
          break;
        case 'platform_admin':
          router.push('/admin/dashboard');
          break;
        default:
          router.push('/');
      }
    } else if (!loading && !user) {
      // If not logged in, redirect to login
      router.push('/login');
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Redirecting to your dashboard...
        </p>
      </div>
    </div>
  );
}
