'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Briefcase, 
  FileText, 
  GraduationCap, 
  LogOut, 
  Plus, 
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  MousePointer
} from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';

interface DashboardStats {
  totalApplications: number;
  pendingApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;
  profileViews: number;
  portfolioClicks: number;
}

interface RecentApplication {
  id: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalApplications: 0,
    pendingApplications: 0,
    acceptedApplications: 0,
    rejectedApplications: 0,
    profileViews: 0,
    portfolioClicks: 0,
  });
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);

  useEffect(() => {
    fetchDashboardStats();
    fetchRecentApplications();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // TODO: Replace with actual API endpoint
      // const response = await api.get('/students/dashboard/stats');
      // setStats(response.data);
      
      // Mock data for now
      setStats({
        totalApplications: 12,
        pendingApplications: 5,
        acceptedApplications: 3,
        rejectedApplications: 4,
        profileViews: 156,
        portfolioClicks: 42,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    }
  };

  const fetchRecentApplications = async () => {
    try {
      // TODO: Replace with actual API endpoint
      // const response = await api.get('/applications/my-applications?limit=5');
      // setRecentApplications(response.data);
      
      // Mock data for now
      setRecentApplications([
        {
          id: '1',
          jobTitle: 'Frontend Developer',
          company: 'TechCo Rwanda',
          appliedDate: '2025-07-28',
          status: 'pending',
        },
        {
          id: '2',
          jobTitle: 'Full Stack Developer',
          company: 'InnovateLab',
          appliedDate: '2025-07-25',
          status: 'accepted',
        },
        {
          id: '3',
          jobTitle: 'Backend Engineer',
          company: 'StartupHub',
          appliedDate: '2025-07-23',
          status: 'rejected',
        },
      ]);
    } catch (error) {
      console.error('Failed to fetch recent applications:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'text-green-600 bg-green-50';
      case 'rejected':
        return 'text-red-600 bg-red-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <ProtectedRoute allowedRoles={['student']}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <GraduationCap className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold">Student Dashboard</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Welcome back, {user?.name}!
                  </p>
                </div>
              </div>
              <Button variant="ghost" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Applications
                </CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalApplications}</div>
                <p className="text-xs text-muted-foreground">
                  Across all job postings
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending
                </CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingApplications}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting response
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Accepted
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.acceptedApplications}</div>
                <p className="text-xs text-muted-foreground">
                  Interview invitations
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Profile Views
                </CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.profileViews}</div>
                <p className="text-xs text-muted-foreground">
                  Last 30 days
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="profile">My Profile</TabsTrigger>
              <TabsTrigger value="jobs">Browse Jobs</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Recent Applications */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Applications</CardTitle>
                    <CardDescription>
                      Your latest job applications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentApplications.map((app) => (
                        <div key={app.id} className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {app.jobTitle}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {app.company}
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(app.status)}`}>
                            {app.status}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Link href="/student/applications">
                    <Button variant="link" className="mt-4 p-0">
                    View all applications →
                    </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                      Common tasks and shortcuts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Link href="/student/profile">
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="mr-2 h-4 w-4" />
                        Update Profile
                      </Button>
                    </Link>
                    <Link href="/student/portfolio">
                      <Button variant="outline" className="w-full justify-start">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Portfolio Item
                      </Button>
                    </Link>
                    <Link href="/jobs">
                      <Button variant="outline" className="w-full justify-start">
                        <Briefcase className="mr-2 h-4 w-4" />
                        Browse Jobs
                      </Button>
                    </Link>
                    <Link href="/student/analytics">
                      <Button variant="outline" className="w-full justify-start">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        View Analytics
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="applications">
              <Card>
                <CardHeader>
                  <CardTitle>All Applications</CardTitle>
                  <CardDescription>
                    Track and manage your job applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Application tracking coming soon...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>My Profile</CardTitle>
                  <CardDescription>
                    Manage your profile information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Profile management coming soon...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="jobs">
              <Card>
                <CardHeader>
                  <CardTitle>Browse Jobs</CardTitle>
                  <CardDescription>
                    Find opportunities that match your skills
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Job browsing coming soon...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  );
}
