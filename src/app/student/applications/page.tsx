'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProtectedRoute from '@/components/ProtectedRoute';
import { 
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Building,
  MapPin,
  Briefcase,
  MessageSquare,
  ExternalLink,
  Download,
  Eye,
  Sparkles,
  TrendingUp,
  BarChart3
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
  job: {
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
    company: {
      companyID: string;
      name: string;
      description?: string;
      industry?: string;
      location?: string;
      website?: string;
      logo?: string;
    };
  };
}

const statusConfig = {
  submitted: { color: 'bg-blue-100 text-blue-700', icon: Clock, label: 'Submitted' },
  under_review: { color: 'bg-yellow-100 text-yellow-700', icon: Eye, label: 'Under Review' },
  shortlisted: { color: 'bg-purple-100 text-purple-700', icon: Sparkles, label: 'Shortlisted' },
  interviewed: { color: 'bg-indigo-100 text-indigo-700', icon: Calendar, label: 'Interviewed' },
  rejected: { color: 'bg-red-100 text-red-700', icon: XCircle, label: 'Rejected' },
  accepted: { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Accepted' },
  withdrawn: { color: 'bg-gray-100 text-gray-700', icon: AlertCircle, label: 'Withdrawn' },
};

const ApplicationCard = ({ application }: { application: Application }) => {
  const statusInfo = statusConfig[application.status];
  const StatusIcon = statusInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl hover:text-blue-600 transition-colors">
                <Link href={`/jobs/${application.job.jobID}`}>{application.job.title}</Link>
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Building className="w-4 h-4" />
                <span>{application.job.company.name}</span>
                <span className="text-gray-400">•</span>
                <MapPin className="w-4 h-4" />
                <span>{application.job.location || 'Remote'}</span>
              </CardDescription>
            </div>
            <Badge className={statusInfo.color}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusInfo.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Applied: {new Date(application.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Updated: {new Date(application.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>

          {application.interviewInfo?.scheduledDate && (
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                  Interview scheduled: {new Date(application.interviewInfo.scheduledDate).toLocaleString()}
                </span>
              </div>
              {application.interviewInfo.type && (
                <p className="text-xs text-indigo-600 mt-1">Type: {application.interviewInfo.type}</p>
              )}
              {application.interviewInfo.location && (
                <p className="text-xs text-indigo-600">Location: {application.interviewInfo.location}</p>
              )}
            </div>
          )}

          {/* Expected Salary */}
          {application.expectedSalary && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Expected Salary:</span>
              <span className="font-medium">
                {application.expectedSalary.amount} {application.expectedSalary.currency} / {application.expectedSalary.period}
              </span>
            </div>
          )}

          {/* Skills Match */}
          {application.skillsMatchPercentage && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Skills Match:</span>
              <Badge variant="outline" className="text-green-600">
                {application.skillsMatchPercentage}% match
              </Badge>
            </div>
          )}

          {/* Documents/Cover Letter */}
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-500">Submitted:</span>
            <div className="flex gap-2">
              {application.coverLetter && (
                <Badge variant="outline" className="text-green-600">
                  <FileText className="w-3 h-3 mr-1" />
                  Cover Letter
                </Badge>
              )}
              {application.expectedSalary && (
                <Badge variant="outline" className="text-blue-600">
                  <FileText className="w-3 h-3 mr-1" />
                  Salary Info
                </Badge>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Link href={`/student/applications/${application.applicationID}`} className="flex-1">
              <Button variant="outline" className="w-full">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </Link>
            <Button variant="outline" size="icon">
              <MessageSquare className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterAndSortApplications();
  }, [applications, searchTerm, statusFilter, sortBy]);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/applications');
      setApplications(response.data.applications);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortApplications = () => {
    let filtered = [...applications];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job.company.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Sort
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'updated':
        filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
      case 'company':
        filtered.sort((a, b) => a.job.company.name.localeCompare(b.job.company.name));
        break;
    }

    setFilteredApplications(filtered);
  };

  const getStatusCounts = () => {
    const counts = {
      all: applications.length,
      submitted: 0,
      under_review: 0,
      shortlisted: 0,
      interviewed: 0,
      rejected: 0,
      accepted: 0,
      withdrawn: 0,
    };

    applications.forEach(app => {
      counts[app.status]++;
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <ProtectedRoute allowedRoles={['student']}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-600 to-purple-700 text-white py-16">
          <div className="absolute inset-0 bg-black/20" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <h1 className="text-4xl font-bold mb-4">My Applications</h1>
              <p className="text-xl text-blue-100">
                Track and manage all your job applications in one place
              </p>
              
              {/* Stats Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {[
                  { label: 'Total Applications', value: statusCounts.all, icon: FileText, color: 'bg-white/20' },
                  { label: 'Under Review', value: statusCounts.under_review, icon: Eye, color: 'bg-yellow-500/20' },
                  { label: 'Interviews', value: statusCounts.interviewed, icon: Calendar, color: 'bg-indigo-500/20' },
                  { label: 'Offers', value: statusCounts.accepted, icon: CheckCircle, color: 'bg-green-500/20' },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`${stat.color} backdrop-blur-sm rounded-lg p-4`}
                  >
                    <stat.icon className="w-8 h-8 mb-2 text-white/80" />
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-sm text-white/80">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {/* Filters Bar */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search applications..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status ({statusCounts.all})</SelectItem>
                      <SelectItem value="submitted">Submitted ({statusCounts.submitted})</SelectItem>
                      <SelectItem value="under_review">Under Review ({statusCounts.under_review})</SelectItem>
                      <SelectItem value="shortlisted">Shortlisted ({statusCounts.shortlisted})</SelectItem>
                      <SelectItem value="interviewed">Interviewed ({statusCounts.interviewed})</SelectItem>
                      <SelectItem value="rejected">Rejected ({statusCounts.rejected})</SelectItem>
                      <SelectItem value="accepted">Accepted ({statusCounts.accepted})</SelectItem>
                      <SelectItem value="withdrawn">Withdrawn ({statusCounts.withdrawn})</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="updated">Last Updated</SelectItem>
                      <SelectItem value="company">Company Name</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Applications Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredApplications.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredApplications.map((application) => (
                      <ApplicationCard key={application.applicationID} application={application} />
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No applications found</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'Try adjusting your filters'
                        : 'Start applying to jobs to see them here'}
                    </p>
                    <Link href="/jobs">
                      <Button>
                        <Briefcase className="w-4 h-4 mr-2" />
                        Browse Jobs
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}
