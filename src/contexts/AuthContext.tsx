'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { normalizeUserType } from '@/lib/userUtils';

interface User {
  userID: string;
  email: string;
  name: string;
  type: 'student' | 'recruiter' | 'university_admin' | 'universityadmin' | 'platform_admin' | 'Student' | 'Recruiter' | 'UniversityAdmin' | 'PlatformAdmin';
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  userType: 'student' | 'recruiter' | 'university_admin' | 'platform_admin'  | 'universityadmin';
  companyID?: string;
  universityID?: string;
  studentID?: string;
  recruiterID?: string;
  // These are used in the form but not sent to backend
  companyName?: string;
  universityName?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await api.get('/auth/profile');
      console.log('User data from API:', response.data.user);
      setUser(response.data.user);
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, refreshToken, user } = response.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      console.log('User logged in:', user);
      setUser(user);
      
      // Normalize user type to lowercase with underscores
      const normalizedType = normalizeUserType(user.type);
      console.log('Normalized user type:', normalizedType);
      
      // Redirect based on user type
      switch (normalizedType) {
        case 'student':
          router.push('/student/dashboard');
          break;
        case 'recruiter':
          router.push('/recruiter/dashboard');
          break;
        case 'university_admin':
          router.push('/university/dashboard');
          break;
        case 'platform_admin':
          router.push('/admin/dashboard');
          break;
        default:
          router.push('/dashboard');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (data: RegisterData) => {
    try {
      // Prepare the payload according to backend requirements
      const payload: any = {
        name: data.name,
        email: data.email,
        password: data.password,
        userType: data.userType,
        phoneNumber: data.phoneNumber,
      };

      // Add role-specific fields
      if (data.userType === 'student') {
        payload.studentID = data.studentID;
        payload.universityID = data.universityID;
      } else if (data.userType === 'recruiter') {
        payload.recruiterID = data.recruiterID || `REC${Date.now()}`; // Generate if not provided
        payload.companyID = data.companyID;
      } else if (data.userType === 'university_admin') {
        payload.universityID = data.universityID;
      }

      const response = await api.post('/auth/register', payload);
      const { accessToken, refreshToken, user } = response.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setUser(user);
      
      // Redirect to verify email page
      router.push('/dashboard');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    router.push('/');
  };

  const refreshUser = async () => {
    await checkAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
