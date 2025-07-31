'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
  MousePointer,
  Search,
  MapPin,
  DollarSign,
  Users,
  AlertCircle,
  ExternalLink
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

interface Job {
  jobID: string;
  title: string;
  description: string;
  requirements?: string[];
  skillsRequired?: string[];
  experienceLevel: string;
  jobType: string;
  salary?: {
    min?: number;
    max?: number;
    currency: string;
    period?: string;
  };
  location?: string;
  isRemote?: boolean;
  isHybrid?: boolean;
  benefits?: string[];
  responsibilities?: string[];
  educationRequirement?: string;
  experienceYears?: number;
  positions?: number;
  deadline?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  company: {
    companyID: string;
    name: string;
    description?: string;
    industry?: string;
    location?: string;
    website?: string;
    logo?: string;
  };
  recruiter: {
    userID: string;
    name: string;
    email: string;
  };
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
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    expectedSalary: {
      amount: '',
      currency: 'USD',
      period: 'annually'
    },
    availabilityDate: '',
    studentNotes: ''
  });
  const [applicationLoading, setApplicationLoading] = useState(false);
  const [applicationError, setApplicationError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
    fetchRecentApplications();
  }, []);

  useEffect(() => {
    if (jobs.length > 0) {
      filterJobs();
    }
  }, [jobs, searchQuery, locationFilter, typeFilter, experienceFilter]);

  const fetchDashboardStats = async () => {
    try {
      // For now, calculate stats from applications data
      const response = await api.get('/applications');
      const applications = response.data.applications;
      
      const stats = {
        totalApplications: applications.length,
        pendingApplications: applications.filter((app: any) => app.status === 'submitted' || app.status === 'under_review').length,
        acceptedApplications: applications.filter((app: any) => app.status === 'accepted').length,
        rejectedApplications: applications.filter((app: any) => app.status === 'rejected').length,
        profileViews: 0, // This would need a separate endpoint
        portfolioClicks: 0, // This would need a separate endpoint
      };
      
      setStats(stats);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      // Set default values on error
      setStats({
        totalApplications: 0,
        pendingApplications: 0,
        acceptedApplications: 0,
        rejectedApplications: 0,
        profileViews: 0,
        portfolioClicks: 0,
      });
    }
  };

  const fetchRecentApplications = async () => {
    try {
      const response = await api.get('/applications');
      const applications = response.data;
      
      // Transform and get the 5 most recent applications
      const recent = applications
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
        .map((app: any) => ({
          id: app.applicationID,
          jobTitle: app.job.title,
          company: app.job.company.name,
          appliedDate: app.createdAt,
          status: app.status === 'submitted' || app.status === 'under_review' ? 'pending' :
                 app.status === 'accepted' || app.status === 'shortlisted' ? 'accepted' :
                 app.status === 'rejected' ? 'rejected' : 'pending'
        }));
      
      setRecentApplications(recent);
    } catch (error) {
      console.error('Failed to fetch recent applications:', error);
      setRecentApplications([]);
    }
  };

  const fetchJobs = async () => {
    setJobsLoading(true);
    setJobsError('');
    try {
      const response = await api.get('/jobs');
      setJobs(response.data);
    } catch (error: any) {
      console.error('Failed to fetch jobs:', error);
      setJobsError(error.response?.data?.message || 'Failed to fetch jobs');
    } finally {
      setJobsLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = jobs;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Location filter
    if (locationFilter !== 'all') {
      if (locationFilter === 'remote') {
        filtered = filtered.filter(job => job.isRemote);
      } else if (locationFilter === 'hybrid') {
        filtered = filtered.filter(job => job.isHybrid);
      } else {
        filtered = filtered.filter(job => 
          job.location?.toLowerCase().includes(locationFilter.toLowerCase())
        );
      }
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(job => job.jobType === typeFilter);
    }

    // Experience filter
    if (experienceFilter !== 'all') {
      filtered = filtered.filter(job => job.experienceLevel === experienceFilter);
    }

    setFilteredJobs(filtered);
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

  const handleApplyClick = (job: Job) => {
    setSelectedJob(job);
    setShowApplicationModal(true);
    setApplicationError('');
  };

  const handleApplicationSubmit = async () => {
    if (!selectedJob) return;
    
    setApplicationLoading(true);
    setApplicationError('');

    try {
      const payload = {
        jobID: selectedJob.jobID,
        coverLetter: applicationData.coverLetter,
        expectedSalary: applicationData.expectedSalary.amount ? {
          amount: parseFloat(applicationData.expectedSalary.amount),
          currency: applicationData.expectedSalary.currency,
          period: applicationData.expectedSalary.period
        } : undefined,
        availabilityDate: applicationData.availabilityDate || undefined,
        studentNotes: applicationData.studentNotes || undefined
      };

      await api.post('/applications', payload);
      
      // Reset form and close modal
      setApplicationData({
        coverLetter: '',
        expectedSalary: {
          amount: '',
          currency: 'USD',
          period: 'annually'
        },
        availabilityDate: '',
        studentNotes: ''
      });
      setShowApplicationModal(false);
      setSelectedJob(null);
      
      // Show success message or refresh data
      alert('Application submitted successfully!');
    } catch (error: any) {
      console.error('Failed to submit application:', error);
      setApplicationError(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplicationLoading(false);
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
          <Tabs defaultValue="overview" className="space-y-4" onValueChange={(value) => {
            if (value === 'jobs' && jobs.length === 0) {
              fetchJobs();
            }
          }}>
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

            <TabsContent value="jobs" className="space-y-4">
              {/* Job Filters */}
              <Card>
                <CardHeader>
                  <CardTitle>Find Your Next Opportunity</CardTitle>
                  <CardDescription>
                    Discover jobs that match your skills and interests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Search jobs, companies, or skills..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div>
                    
                    <Select value={locationFilter} onValueChange={setLocationFilter}>
                      <SelectTrigger className="w-full md:w-[160px]">
                        <SelectValue placeholder="Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                        <SelectItem value="kigali">Kigali</SelectItem>
                        <SelectItem value="nairobi">Nairobi</SelectItem>
                        <SelectItem value="kampala">Kampala</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-full md:w-[140px]">
                        <SelectValue placeholder="Job Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="full_time">Full Time</SelectItem>
                        <SelectItem value="part_time">Part Time</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="freelance">Freelance</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                      <SelectTrigger className="w-full md:w-[150px]">
                        <SelectValue placeholder="Experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="entry">Entry Level</SelectItem>
                        <SelectItem value="junior">Junior</SelectItem>
                        <SelectItem value="mid">Mid Level</SelectItem>
                        <SelectItem value="senior">Senior</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Error Alert */}
              {jobsError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{jobsError}</AlertDescription>
                </Alert>
              )}

              {/* Jobs List */}
              <div className="space-y-4">
                {jobsLoading ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <p className="text-muted-foreground">Loading jobs...</p>
                    </CardContent>
                  </Card>
                ) : filteredJobs.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <p className="text-muted-foreground">
                        {jobs.length === 0 ? 'No jobs available' : 'No jobs match your filters'}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredJobs.map((job) => (
                    <Card key={job.jobID} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{job.title}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <span className="font-medium">{job.company.name}</span>
                              {job.location && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {job.location}
                                  </span>
                                </>
                              )}
                              {job.isRemote && (
                                <>
                                  <span>•</span>
                                  <span className="text-green-600">Remote</span>
                                </>
                              )}
                              {job.isHybrid && (
                                <>
                                  <span>•</span>
                                  <span className="text-blue-600">Hybrid</span>
                                </>
                              )}
                            </CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="secondary">
                              {getJobTypeLabel(job.jobType)}
                            </Badge>
                            <Badge variant="outline">
                              {getExperienceLevelLabel(job.experienceLevel)}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Job Description */}
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {job.description}
                        </p>

                        {/* Salary */}
                        {formatSalary(job.salary) && (
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <span>{formatSalary(job.salary)}</span>
                          </div>
                        )}

                        {/* Skills */}
                        {job.skillsRequired && job.skillsRequired.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {job.skillsRequired.slice(0, 5).map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {job.skillsRequired.length > 5 && (
                              <Badge variant="secondary" className="text-xs">
                                +{job.skillsRequired.length - 5} more
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Job Info */}
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-4">
                            {job.positions && job.positions > 1 && (
                              <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {job.positions} positions
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Posted {new Date(job.createdAt).toLocaleDateString()}
                            </span>
                            {job.deadline && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                Deadline: {new Date(job.deadline).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-4 border-t">
                          <Button 
                            className="flex-1"
                            onClick={() => handleApplyClick(job)}
                          >
                            Apply Now
                          </Button>
                          <Button variant="outline" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Application Modal */}
          <Dialog open={showApplicationModal} onOpenChange={setShowApplicationModal}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
                <DialogDescription>
                  {selectedJob?.company.name} • {selectedJob?.location}
                </DialogDescription>
              </DialogHeader>

              {applicationError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{applicationError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                {/* Cover Letter */}
                <div className="space-y-2">
                  <Label htmlFor="coverLetter">Cover Letter</Label>
                  <Textarea
                    id="coverLetter"
                    placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                    value={applicationData.coverLetter}
                    onChange={(e) => setApplicationData(prev => ({
                      ...prev,
                      coverLetter: e.target.value
                    }))}
                    rows={4}
                  />
                </div>

                {/* Expected Salary */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expectedAmount">Expected Salary</Label>
                    <Input
                      id="expectedAmount"
                      type="number"
                      placeholder="50000"
                      value={applicationData.expectedSalary.amount}
                      onChange={(e) => setApplicationData(prev => ({
                        ...prev,
                        expectedSalary: {
                          ...prev.expectedSalary,
                          amount: e.target.value
                        }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select 
                      value={applicationData.expectedSalary.currency}
                      onValueChange={(value) => setApplicationData(prev => ({
                        ...prev,
                        expectedSalary: {
                          ...prev.expectedSalary,
                          currency: value
                        }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="RWF">RWF</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="KES">KES</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="period">Period</Label>
                    <Select 
                      value={applicationData.expectedSalary.period}
                      onValueChange={(value) => setApplicationData(prev => ({
                        ...prev,
                        expectedSalary: {
                          ...prev.expectedSalary,
                          period: value
                        }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="annually">Annually</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="hourly">Hourly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Availability Date */}
                <div className="space-y-2">
                  <Label htmlFor="availabilityDate">Available Start Date</Label>
                  <Input
                    id="availabilityDate"
                    type="date"
                    value={applicationData.availabilityDate}
                    onChange={(e) => setApplicationData(prev => ({
                      ...prev,
                      availabilityDate: e.target.value
                    }))}
                  />
                </div>

                {/* Additional Notes */}
                <div className="space-y-2">
                  <Label htmlFor="studentNotes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="studentNotes"
                    placeholder="Any additional information you'd like to share..."
                    value={applicationData.studentNotes}
                    onChange={(e) => setApplicationData(prev => ({
                      ...prev,
                      studentNotes: e.target.value
                    }))}
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setShowApplicationModal(false)}
                  disabled={applicationLoading}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleApplicationSubmit}
                  disabled={applicationLoading}
                >
                  {applicationLoading ? 'Submitting...' : 'Submit Application'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </ProtectedRoute>
  );
}
