'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Briefcase, 
  Users, 
  LogOut, 
  Plus, 
  Eye,
  FileText,
  UserCheck,
  Clock
} from 'lucide-react';
import Link from 'next/link';

interface RecruiterStats {
  activeJobs: number;
  totalApplications: number;
  shortlistedCandidates: number;
  pendingReviews: number;
}

export default function RecruiterDashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<RecruiterStats>({
    activeJobs: 0,
    totalApplications: 0,
    shortlistedCandidates: 0,
    pendingReviews: 0,
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    // Mock data for now
    setStats({
      activeJobs: 5,
      totalApplications: 87,
      shortlistedCandidates: 12,
      pendingReviews: 23,
    });
  };

  return (
    <ProtectedRoute allowedRoles={['recruiter']}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Briefcase className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold">Recruiter Dashboard</h1>
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
                  Active Jobs
                </CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeJobs}</div>
                <p className="text-xs text-muted-foreground">
                  Currently recruiting
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Applications
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalApplications}</div>
                <p className="text-xs text-muted-foreground">
                  Across all postings
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Shortlisted
                </CardTitle>
                <UserCheck className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.shortlistedCandidates}</div>
                <p className="text-xs text-muted-foreground">
                  Ready for interviews
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Reviews
                </CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingReviews}</div>
                <p className="text-xs text-muted-foreground">
                  Need your attention
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Link href="/recruiter/jobs/new">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Post New Job
                  </Button>
                </Link>
                <Link href="/recruiter/candidates">
                  <Button variant="outline">
                    <Users className="mr-2 h-4 w-4" />
                    Browse Candidates
                  </Button>
                </Link>
                <Link href="/recruiter/applications">
                  <Button variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    Review Applications
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for detailed views */}
          <Tabs defaultValue="active-jobs" className="space-y-4">
            <TabsList>
              <TabsTrigger value="active-jobs">Active Jobs</TabsTrigger>
              <TabsTrigger value="recent-applications">Recent Applications</TabsTrigger>
              <TabsTrigger value="shortlisted">Shortlisted Candidates</TabsTrigger>
            </TabsList>

            <TabsContent value="active-jobs">
              <Card>
                <CardHeader>
                  <CardTitle>Active Job Postings</CardTitle>
                  <CardDescription>
                    Manage your current job listings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Job listings coming soon...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recent-applications">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Applications</CardTitle>
                  <CardDescription>
                    Latest candidates who applied to your jobs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Application reviews coming soon...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="shortlisted">
              <Card>
                <CardHeader>
                  <CardTitle>Shortlisted Candidates</CardTitle>
                  <CardDescription>
                    Candidates ready for the next step
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Shortlist management coming soon...
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
