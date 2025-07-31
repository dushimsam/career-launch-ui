'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft,
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign,
  Building,
  Calendar,
  Users,
  Heart,
  Share2,
  Send,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Trophy,
  Target,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface JobDetails {
  jobID: string;
  title: string;
  company: {
    companyID: string;
    name: string;
    logo?: string;
    location: string;
    description: string;
    size: string;
    industry: string;
  };
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  responsibilities: string[];
  requirements: string[];
  preferredQualifications: string[];
  skills: string[];
  benefits: string[];
  postedDate: string;
  applicationDeadline: string;
  applicants: number;
  saved?: boolean;
  applied?: boolean;
}

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [job, setJob] = useState<JobDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (params.id) {
      fetchJobDetails(params.id as string);
    }
  }, [params.id]);

  const fetchJobDetails = async (jobId: string) => {
    try {
      // const response = await api.get(`/jobs/${jobId}`);
      // setJob(response.data);
      
      // Mock data for now
      const mockJob: JobDetails = {
        jobID: jobId,
        title: 'Senior Frontend Developer',
        company: {
          companyID: '1',
          name: 'TechCo Rwanda',
          location: 'Kigali, Rwanda',
          description: 'TechCo Rwanda is a leading technology company focused on building innovative solutions for African markets.',
          size: '50-200 employees',
          industry: 'Technology',
        },
        location: 'Kigali, Rwanda',
        type: 'full-time',
        salary: {
          min: 1500000,
          max: 2500000,
          currency: 'RWF',
        },
        description: `We are looking for a skilled Senior Frontend Developer to join our growing team. You will be responsible for building and maintaining high-quality web applications using modern technologies. This is an excellent opportunity to work on challenging projects that impact thousands of users across Africa.

Our ideal candidate is passionate about creating exceptional user experiences and has a strong background in React and modern JavaScript frameworks. You'll work closely with our design and backend teams to deliver scalable solutions.`,
        responsibilities: [
          'Develop and maintain responsive web applications using React and Next.js',
          'Collaborate with designers to implement pixel-perfect UI components',
          'Optimize applications for maximum speed and scalability',
          'Participate in code reviews and maintain high code quality standards',
          'Mentor junior developers and contribute to technical documentation',
          'Work with backend developers to integrate APIs and services',
        ],
        requirements: [
          '5+ years of experience in frontend development',
          'Expert knowledge of React, TypeScript, and modern JavaScript',
          'Experience with Next.js and server-side rendering',
          'Strong understanding of web performance optimization',
          'Excellent problem-solving and communication skills',
          'Bachelor\'s degree in Computer Science or related field',
        ],
        preferredQualifications: [
          'Experience with React Native for mobile development',
          'Knowledge of GraphQL and Apollo Client',
          'Familiarity with AWS or other cloud platforms',
          'Contributions to open-source projects',
          'Experience working in agile environments',
        ],
        skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Node.js', 'GraphQL', 'Git', 'AWS'],
        benefits: [
          'Competitive salary and performance bonuses',
          'Health insurance for you and your family',
          'Flexible working hours and remote work options',
          'Professional development budget',
          'Modern office space in Kigali Innovation City',
          'Team building activities and annual retreats',
        ],
        postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        applicants: 23,
        saved: false,
        applied: false,
      };
      
      setJob(mockJob);
    } catch (error) {
      console.error('Failed to fetch job details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      setApplying(true);
      // await api.post(`/applications`, { jobID: job?.jobID });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setApplicationStatus('success');
      if (job) {
        setJob({ ...job, applied: true });
      }
    } catch (error) {
      setApplicationStatus('error');
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (job) {
      setJob({ ...job, saved: !job.saved });
      // Make API call to save/unsave job
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48" />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Job not found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The job you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/jobs">
              <Button>Browse Jobs</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-purple-700 text-white py-12">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 relative z-10">
          <Button
            variant="ghost"
            className="text-white hover:text-blue-200 mb-4"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{job.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-blue-100">
                  <div className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    <span className="font-medium">{job.company.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    <span className="capitalize">{job.type.replace('-', ' ')}</span>
                  </div>
                </div>
              </div>
              
              <div className="hidden md:flex gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleSave}
                  className={job.saved ? 'text-red-500' : ''}
                >
                  <Heart className={`w-5 h-5 ${job.saved ? 'fill-current' : ''}`} />
                </Button>
                <Button variant="secondary" size="icon">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Job Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="requirements">Requirements</TabsTrigger>
                      <TabsTrigger value="company">Company</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="space-y-6 mt-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <FileText className="w-5 h-5 text-blue-600" />
                          Job Description
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                          {job.description}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Target className="w-5 h-5 text-blue-600" />
                          Key Responsibilities
                        </h3>
                        <ul className="space-y-2">
                          {job.responsibilities.map((resp, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-600 dark:text-gray-400">{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Trophy className="w-5 h-5 text-blue-600" />
                          Benefits
                        </h3>
                        <ul className="space-y-2">
                          {job.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Sparkles className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-600 dark:text-gray-400">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="requirements" className="space-y-6 mt-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Required Qualifications</h3>
                        <ul className="space-y-2">
                          {job.requirements.map((req, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-600 dark:text-gray-400">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">Preferred Qualifications</h3>
                        <ul className="space-y-2">
                          {job.preferredQualifications.map((qual, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-600 dark:text-gray-400">{qual}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">Required Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {job.skills.map((skill, index) => (
                            <Badge 
                              key={index} 
                              variant="secondary"
                              className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="company" className="space-y-6 mt-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">About {job.company.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          {job.company.description}
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Industry</p>
                            <p className="font-medium">{job.company.industry}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Company Size</p>
                            <p className="font-medium">{job.company.size}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                            <p className="font-medium">{job.company.location}</p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Apply Section */}
            <div className="space-y-6">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Job Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {job.salary && (
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Salary Range</p>
                        <p className="font-medium">
                          {job.salary.currency} {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Posted Date</p>
                      <p className="font-medium">{new Date(job.postedDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Application Deadline</p>
                      <p className="font-medium">{new Date(job.applicationDeadline).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Applicants</p>
                      <p className="font-medium">{job.applicants} candidates</p>
                    </div>
                  </div>

                  <hr className="my-4" />

                  {applicationStatus === 'success' && (
                    <Alert className="bg-green-50 border-green-200 text-green-800">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Application submitted successfully! We'll notify you about the next steps.
                      </AlertDescription>
                    </Alert>
                  )}

                  {applicationStatus === 'error' && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Failed to submit application. Please try again.
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleApply}
                    disabled={applying || job.applied}
                  >
                    {applying ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Send className="w-4 h-4 mr-2" />
                        </motion.div>
                        Submitting...
                      </>
                    ) : job.applied ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Applied
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Apply Now
                      </>
                    )}
                  </Button>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={handleSave}
                    >
                      <Heart className={`w-4 h-4 mr-2 ${job.saved ? 'fill-current text-red-500' : ''}`} />
                      {job.saved ? 'Saved' : 'Save'}
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
