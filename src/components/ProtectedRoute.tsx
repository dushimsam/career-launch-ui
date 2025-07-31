'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { normalizeUserType } from '@/lib/userUtils';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user && allowedRoles) {
      const normalizedUserType = normalizeUserType(user.type);
      const normalizedAllowedRoles = allowedRoles.map(role => normalizeUserType(role));
      
      if (!normalizedAllowedRoles.includes(normalizedUserType)) {
        console.log('normalizedUserType:', normalizedUserType);
        console.log('user type not allowed:', user.type);
        // Redirect to appropriate dashboard based on user type
        switch (normalizedUserType) {
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
      }
    }
  }, [user, loading, router, allowedRoles]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || (allowedRoles && !allowedRoles.map(role => normalizeUserType(role)).includes(normalizeUserType(user.type)))) {
    return null;
  }

  return <>{children}</>;
}
