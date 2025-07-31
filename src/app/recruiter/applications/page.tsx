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
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  candidateEducation: string;
  candidateSkills: string[];
  appliedAt: string;
  status: 'pending' | 'reviewing' | 'shortlisted' | 'rejected';
  resumeUrl?: string;
  portfolioUrl?: string;
  coverLetter?: string;
}

export default function ApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [jobFilter, setJobFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchQuery, statusFilter, jobFilter]);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // Mock data for now
      const mockApplications: Application[] = [
        {
          id: '1',
          jobId: 'job1',
          jobTitle: 'Frontend Developer',
          candidateId: 'cand1',
          candidateName: 'John Doe',
          candidateEmail: 'john.doe@example.com',
          candidatePhone: '+250788123456',
          candidateEducation: 'BSc Computer Science, University of Rwanda',
          candidateSkills: ['React', 'TypeScript', 'Node.js', 'Git'],
          appliedAt: '2024-01-10T10:00:00Z',
          status: 'pending',
          resumeUrl: '/resumes/john-doe.pdf',
          portfolioUrl: 'https://github.com/johndoe',
          coverLetter: 'I am excited to apply for this position...'
        },
        {
          id: '2',
          jobId: 'job1',
          jobTitle: 'Frontend Developer',
          candidateId: 'cand2',
          candidateName: 'Jane Smith',
          candidateEmail: 'jane.smith@example.com',
          candidatePhone: '+250788234567',
          candidateEducation: 'BSc Software Engineering, ALU',
          candidateSkills: ['Vue.js', 'JavaScript', 'CSS', 'HTML'],
          appliedAt: '2024-01-09T14:30:00Z',
          status: 'shortlisted',
          resumeUrl: '/resumes/jane-smith.pdf',
          portfolioUrl: 'https://janesmith.dev'
        },
        {
          id: '3',
          jobId: 'job2',
          jobTitle: 'Backend Developer',
          candidateId: 'cand3',
          candidateName: 'Mike Johnson',
          candidateEmail: 'mike.j@example.com',
          candidatePhone: '+250788345678',
          candidateEducation: 'BSc Information Technology, AUCA',
          candidateSkills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
          appliedAt: '2024-01-08T09:15:00Z',
          status: 'reviewing',
          resumeUrl: '/resumes/mike-johnson.pdf'
        }
      ];
      
      setApplications(mockApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(app => 
        app.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.candidateEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Job filter
    if (jobFilter !== 'all') {
      filtered = filtered.filter(app => app.jobId === jobFilter);
    }

    setFilteredApplications(filtered);
  };

  const updateApplicationStatus = async (applicationId: string, newStatus: Application['status']) => {
    try {
      // TODO: Replace with actual API call
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      case 'shortlisted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUniqueJobs = () => {
    const jobs = applications.map(app => ({ id: app.jobId, title: app.jobTitle }));
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewing">Reviewing</SelectItem>
                    <SelectItem value="shortlisted">Shortlisted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
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
                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {applications.filter(app => app.status === 'pending').length}
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
                <Card key={application.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{application.candidateName}</CardTitle>
                        <CardDescription>
                          Applied for: <span className="font-medium">{application.jobTitle}</span>
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(application.status)}>
                        {application.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <a href={`mailto:${application.candidateEmail}`} className="hover:underline">
                          {application.candidateEmail}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <a href={`tel:${application.candidatePhone}`} className="hover:underline">
                          {application.candidatePhone}
                        </a>
                      </div>
                    </div>

                    {/* Education */}
                    <div className="flex items-start gap-2">
                      <GraduationCap className="h-4 w-4 text-gray-400 mt-0.5" />
                      <span className="text-sm">{application.candidateEducation}</span>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2">
                      {application.candidateSkills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    {/* Applied Date */}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      Applied {new Date(application.appliedAt).toLocaleDateString()}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t">
                      <Button size="sm" variant="outline">
                        <Eye className="mr-2 h-4 w-4" />
                        View Profile
                      </Button>
                      
                      {application.resumeUrl && (
                        <Button size="sm" variant="outline">
                          <Download className="mr-2 h-4 w-4" />
                          Resume
                        </Button>
                      )}
                      
                      {application.portfolioUrl && (
                        <a 
                          href={application.portfolioUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Portfolio
                        </a>
                      )}

                      <div className="ml-auto flex gap-2">
                        {application.status !== 'shortlisted' && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => updateApplicationStatus(application.id, 'shortlisted')}
                          >
                            <UserCheck className="mr-2 h-4 w-4" />
                            Shortlist
                          </Button>
                        )}
                        
                        {application.status !== 'rejected' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateApplicationStatus(application.id, 'rejected')}
                          >
                            <UserX className="mr-2 h-4 w-4" />
                            Reject
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
