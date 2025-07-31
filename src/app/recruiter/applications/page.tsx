'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft,
  Search,
  Filter,
  Eye,
  Download,
  UserCheck,
  UserX,
  Clock,
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

interface Application {
  applicationID: string;
  status: 'submitted' | 'under_review' | 'shortlisted' | 'interviewed' | 'accepted' | 'rejected' | 'withdrawn';
  coverLetter?: string;
  recruiterNotes?: string;
  studentNotes?: string;
  statusHistory: Array<{
    status: string;
    changedAt: string;
    changedBy: string;
    notes?: string;
  }>;
  interviewInfo?: {
    scheduledDate?: string;
    type?: string;
    location?: string;
    interviewer?: string;
  };
  score?: number;
  skillsMatchPercentage?: number;
  expectedSalary?: {
    amount: number;
    currency: string;
    period: string;
  };
  availabilityDate?: string;
  createdAt: string;
  updatedAt: string;
  student: {
    userID: string;
    name: string;
    email: string;
    phoneNumber?: string;
    profile?: {
      bio?: string;
      skills?: string[];
      experience?: Array<{
        title: string;
        company: string;
        startDate: string;
        endDate?: string;
        description?: string;
      }>;
      education?: Array<{
        degree: string;
        institution: string;
        graduationYear: number;
        grade?: string;
      }>;
      certifications?: Array<{
        name: string;
        issuer: string;
        issueDate: string;
        expiryDate?: string;
      }>;
      projects?: Array<{
        name: string;
        description: string;
        technologies: string[];
        url?: string;
        githubUrl?: string;
      }>;
    };
  };
  job: {
    jobID: string;
    title: string;
    description: string;
    location?: string;
    jobType: string;
    experienceLevel: string;
  };
}

export default function ApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [jobFilter, setJobFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [updateLoading, setUpdateLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchQuery, statusFilter, jobFilter]);

  const fetchApplications = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await api.get('/applications');
      setApplications(response.data.applications);
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      setError(error.response?.data?.message || 'Failed to fetch applications');
    } finally {
      setIsLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(app => 
        app.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.job.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Job filter
    if (jobFilter !== 'all') {
      filtered = filtered.filter(app => app.job.jobID === jobFilter);
    }

    setFilteredApplications(filtered);
  };

  const updateApplicationStatus = async (applicationId: string, newStatus: Application['status'], notes?: string) => {
    setUpdateLoading(applicationId);
    try {
      await api.patch(`/applications/${applicationId}/status`, {
        status: newStatus,
        recruiterNotes: notes
      });
      
      // Update local state
      setApplications(prev => 
        prev.map(app => 
          app.applicationID === applicationId ? { 
            ...app, 
            status: newStatus,
            recruiterNotes: notes || app.recruiterNotes,
            updatedAt: new Date().toISOString()
          } : app
        )
      );
    } catch (error: any) {
      console.error('Error updating application status:', error);
      setError(error.response?.data?.message || 'Failed to update application status');
    } finally {
      setUpdateLoading(null);
    }
  };

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      case 'shortlisted':
        return 'bg-green-100 text-green-800';
      case 'interviewed':
        return 'bg-purple-100 text-purple-800';
      case 'accepted':
        return 'bg-emerald-100 text-emerald-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUniqueJobs = () => {
    const jobs = applications.map(app => ({ id: app.job.jobID, title: app.job.title }));
    return Array.from(new Map(jobs.map(job => [job.id, job])).values());
  };

  return (
    <ProtectedRoute allowedRoles={['recruiter']}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/recruiter/dashboard">
                  <Button variant="ghost" size="icon">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold">Applications</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Review and manage candidate applications
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by name, email, or job title..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="shortlisted">Shortlisted</SelectItem>
                    <SelectItem value="interviewed">Interviewed</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="withdrawn">Withdrawn</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={jobFilter} onValueChange={setJobFilter}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Filter by job" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Jobs</SelectItem>
                    {getUniqueJobs().map(job => (
                      <SelectItem key={job.id} value={job.id}>
                        {job.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{applications.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Under Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {applications.filter(app => app.status === 'submitted' || app.status === 'under_review').length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Shortlisted</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {applications.filter(app => app.status === 'shortlisted').length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {applications.filter(app => app.status === 'rejected').length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Applications List */}
          <div className="space-y-4">
            {isLoading ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground">Loading applications...</p>
                </CardContent>
              </Card>
            ) : filteredApplications.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground">No applications found</p>
                </CardContent>
              </Card>
            ) : (
              filteredApplications.map((application) => (
                <Card key={application.applicationID} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{application.student.name}</CardTitle>
                        <CardDescription>
                          Applied for: <span className="font-medium">{application.job.title}</span>
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(application.status)}>
                        {application.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <a href={`mailto:${application.student.email}`} className="hover:underline">
                          {application.student.email}
                        </a>
                      </div>
                      {application.student.phoneNumber && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <a href={`tel:${application.student.phoneNumber}`} className="hover:underline">
                            {application.student.phoneNumber}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Education */}
                    {application.student.profile?.education && application.student.profile.education.length > 0 && (
                      <div className="flex items-start gap-2">
                        <GraduationCap className="h-4 w-4 text-gray-400 mt-0.5" />
                        <div className="text-sm">
                          {application.student.profile.education.map((edu, index) => (
                            <div key={index}>
                              {edu.degree} - {edu.institution} ({edu.graduationYear})
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skills */}
                    {application.student.profile?.skills && (
                      <div className="flex flex-wrap gap-2">
                        {application.student.profile.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Expected Salary */}
                    {application.expectedSalary && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Expected Salary: {application.expectedSalary.amount} {application.expectedSalary.currency} / {application.expectedSalary.period}</span>
                      </div>
                    )}

                    {/* Skills Match */}
                    {application.skillsMatchPercentage && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Skills Match: {application.skillsMatchPercentage}%</span>
                      </div>
                    )}

                    {/* Applied Date */}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      Applied {new Date(application.createdAt).toLocaleDateString()}
                    </div>

                    {/* Cover Letter */}
                    {application.coverLetter && (
                      <div className="bg-gray-50 p-3 rounded-md">
                        <h4 className="text-sm font-medium mb-2">Cover Letter</h4>
                        <p className="text-sm text-gray-600">{application.coverLetter}</p>
                      </div>
                    )}

                    {/* Recruiter Notes */}
                    {application.recruiterNotes && (
                      <div className="bg-blue-50 p-3 rounded-md">
                        <h4 className="text-sm font-medium mb-2">Recruiter Notes</h4>
                        <p className="text-sm text-gray-600">{application.recruiterNotes}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t">
                      <Button size="sm" variant="outline">
                        <Eye className="mr-2 h-4 w-4" />
                        View Profile
                      </Button>
                      
                      {/* Portfolio Links */}
                      {application.student.profile?.projects && application.student.profile.projects.length > 0 && (
                        <div className="flex gap-2">
                          {application.student.profile.projects.slice(0, 2).map((project, index) => (
                            project.url && (
                              <a 
                                key={index}
                                href={project.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                              >
                                <ExternalLink className="mr-2 h-4 w-4" />
                                {project.name}
                              </a>
                            )
                          ))}
                        </div>
                      )}

                      <div className="ml-auto flex gap-2">
                        {application.status === 'submitted' && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => updateApplicationStatus(application.applicationID, 'under_review')}
                            disabled={updateLoading === application.applicationID}
                          >
                            <Clock className="mr-2 h-4 w-4" />
                            {updateLoading === application.applicationID ? 'Updating...' : 'Review'}
                          </Button>
                        )}
                        
                        {(application.status === 'under_review' || application.status === 'submitted') && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => updateApplicationStatus(application.applicationID, 'shortlisted')}
                            disabled={updateLoading === application.applicationID}
                          >
                            <UserCheck className="mr-2 h-4 w-4" />
                            {updateLoading === application.applicationID ? 'Updating...' : 'Shortlist'}
                          </Button>
                        )}
                        
                        {application.status !== 'rejected' && application.status !== 'withdrawn' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateApplicationStatus(application.applicationID, 'rejected')}
                            disabled={updateLoading === application.applicationID}
                          >
                            <UserX className="mr-2 h-4 w-4" />
                            {updateLoading === application.applicationID ? 'Updating...' : 'Reject'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
