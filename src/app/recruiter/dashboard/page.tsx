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
  Clock,
  MapPin,
  Calendar,
  Edit,
  Trash2,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface RecruiterStats {
  activeJobs: number;
  totalApplications: number;
  shortlistedCandidates: number;
  pendingReviews: number;
}

interface Job {
  jobID: string;
  title: string;
  description: string;
  location?: string;
  jobType: string;
  experienceLevel: string;
  salary?: {
    min?: number;
    max?: number;
    currency: string;
    period?: string;
  };
  isRemote?: boolean;
  isHybrid?: boolean;
  positions?: number;
  deadline?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    applications: number;
  };
}

export default function RecruiterDashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<RecruiterStats>({
    activeJobs: 0,
    totalApplications: 0,
    shortlistedCandidates: 0,
    pendingReviews: 0,
  });
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    await Promise.all([
      fetchJobs(),
      fetchApplications()
    ]);
  };

  const fetchJobs = async () => {
    setJobsLoading(true);
    try {
      const response = await api.get('/jobs');
      const myJobs = response.data.jobs.filter((job: Job) => 
        job.status === 'active' || job.status === 'paused'
      );
      setJobs(myJobs);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        activeJobs: myJobs.filter((job: Job) => job.status === 'active').length
      }));
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      setError('Failed to fetch jobs');
    } finally {
      setJobsLoading(false);
    }
  };

  const fetchApplications = async () => {
    setApplicationsLoading(true);
    try {
      const response = await api.get('/applications');
      setApplications(response.data.applications);
      
      // Update stats
      const shortlisted = response.data.applications.filter((app: any) => app.status === 'shortlisted').length;
      const pending = response.data.applications.filter((app: any) => 
        app.status === 'submitted' || app.status === 'under_review'
      ).length;
      
      setStats(prev => ({
        ...prev,
        totalApplications: response.data.length,
        shortlistedCandidates: shortlisted,
        pendingReviews: pending
      }));
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setApplicationsLoading(false);
    }
  };

  const getJobTypeLabel = (type: string) => {
    switch (type) {
      case 'full_time': return 'Full Time';
      case 'part_time': return 'Part Time';
      case 'internship': return 'Internship';
      case 'contract': return 'Contract';
      case 'freelance': return 'Freelance';
      default: return type;
    }
  };

  const getExperienceLevelLabel = (level: string) => {
    switch (level) {
      case 'entry': return 'Entry Level';
      case 'junior': return 'Junior';
      case 'mid': return 'Mid Level';
      case 'senior': return 'Senior';
      default: return level;
    }
  };

  const formatSalary = (salary?: Job['salary']) => {
    if (!salary) return null;
    const { min, max, currency } = salary;
    if (min && max) {
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    } else if (min) {
      return `${currency} ${min.toLocaleString()}+`;
    } else if (max) {
      return `Up to ${currency} ${max.toLocaleString()}`;
    }
    return null;
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
                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  {jobsLoading ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Loading jobs...</p>
                    </div>
                  ) : jobs.length === 0 ? (
                    <div className="text-center py-8">
                      <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">
                        You haven't posted any jobs yet.
                      </p>
                      <Link href="/recruiter/jobs/new">
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Post Your First Job
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {jobs.map((job) => (
                        <div key={job.jobID} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold mb-2">{job.title}</h3>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {job.location || 'Remote'}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Briefcase className="w-4 h-4" />
                                  {getJobTypeLabel(job.jobType)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  Posted {new Date(job.createdAt).toLocaleDateString()}
                                </span>
                                {job._count?.applications !== undefined && (
                                  <span className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    {job._count.applications} applications
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex flex-wrap gap-2 mb-3">
                                <Badge variant="secondary">
                                  {getExperienceLevelLabel(job.experienceLevel)}
                                </Badge>
                                {job.isRemote && (
                                  <Badge variant="outline" className="text-green-600">
                                    Remote
                                  </Badge>
                                )}
                                {job.isHybrid && (
                                  <Badge variant="outline" className="text-blue-600">
                                    Hybrid
                                  </Badge>
                                )}
                                {formatSalary(job.salary) && (
                                  <Badge variant="outline">
                                    <DollarSign className="w-3 h-3 mr-1" />
                                    {formatSalary(job.salary)}
                                  </Badge>
                                )}
                                <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                                  {job.status === 'active' ? 'Active' : 'Paused'}
                                </Badge>
                              </div>
                              
                              {job.deadline && (
                                <p className="text-sm text-gray-500">
                                  Application deadline: {new Date(job.deadline).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            
                            <div className="flex gap-2 ml-4">
                              <Link href={`/recruiter/jobs/${job.jobID}/edit`}>
                                <Button variant="outline" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Link href={`/recruiter/applications?job=${job.jobID}`}>
                                <Button variant="outline" size="sm">
                                  <Eye className="w-4 h-4 mr-1" />
                                  View Applications
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                  {applicationsLoading ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Loading applications...</p>
                    </div>
                  ) : applications.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No applications received yet.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {applications.slice(0, 5).map((application) => (
                        <div key={application.applicationID} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">{application.student.name}</p>
                              <p className="text-sm text-gray-500">
                                Applied for: {application.job.title}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(application.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge className="capitalize">
                              {application.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      ))}
                      
                      {applications.length > 5 && (
                        <Link href="/recruiter/applications">
                          <Button variant="outline" className="w-full">
                            View All Applications ({applications.length})
                          </Button>
                        </Link>
                      )}
                    </div>
                  )}
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
                  {applicationsLoading ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Loading shortlisted candidates...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {applications
                        .filter(app => app.status === 'shortlisted')
                        .map((application) => (
                          <div key={application.applicationID} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium">{application.student.name}</p>
                                <p className="text-sm text-gray-500">
                                  {application.student.email}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  Applied for: {application.job.title}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  Shortlisted on: {new Date(application.updatedAt).toLocaleDateString()}
                                </p>
                              </div>
                              <Link href={`/recruiter/applications?applicationId=${application.applicationID}`}>
                                <Button variant="outline" size="sm">
                                  <Eye className="w-4 h-4 mr-1" />
                                  View Details
                                </Button>
                              </Link>
                            </div>
                          </div>
                        ))
                      }
                      
                      {applications.filter(app => app.status === 'shortlisted').length === 0 && (
                        <div className="text-center py-8">
                          <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-muted-foreground">
                            No shortlisted candidates at the moment.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  );
}
