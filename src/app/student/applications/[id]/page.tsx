'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import ProtectedRoute from '@/components/ProtectedRoute';
import { 
  ArrowLeft,
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
  Download,
  Eye,
  Send,
  Phone,
  Mail,
  Globe,
  User,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Edit,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

interface ApplicationDetails {
  applicationID: string;
  jobID: string;
  job: {
    title: string;
    company: string;
    companyLogo?: string;
    location: string;
    type: string;
    salary?: {
      min: number;
      max: number;
      currency: string;
    };
    description: string;
  };
  status: 'submitted' | 'under_review' | 'shortlisted' | 'interview_scheduled' | 'rejected' | 'accepted';
  appliedDate: string;
  lastUpdated: string;
  timeline: {
    date: string;
    status: string;
    note?: string;
  }[];
  documents: {
    resume: { name: string; url: string; uploadedAt: string };
    coverLetter?: { name: string; url: string; uploadedAt: string };
    portfolio?: { name: string; url: string; uploadedAt: string };
    additional?: { name: string; url: string; uploadedAt: string }[];
  };
  recruiterInfo?: {
    name: string;
    email: string;
    phone?: string;
    position: string;
  };
  interviewDetails?: {
    date: string;
    time: string;
    location?: string;
    type: 'in-person' | 'video' | 'phone';
    meetingLink?: string;
    instructions?: string;
  };
  notes: {
    id: string;
    content: string;
    createdAt: string;
    isPrivate: boolean;
  }[];
  feedback?: {
    strengths: string[];
    improvements: string[];
    overallComments: string;
  };
}

const statusConfig = {
  submitted: { color: 'bg-blue-100 text-blue-700', icon: Clock, label: 'Application Submitted' },
  under_review: { color: 'bg-yellow-100 text-yellow-700', icon: Eye, label: 'Under Review' },
  shortlisted: { color: 'bg-purple-100 text-purple-700', icon: Sparkles, label: 'Shortlisted' },
  interview_scheduled: { color: 'bg-indigo-100 text-indigo-700', icon: Calendar, label: 'Interview Scheduled' },
  rejected: { color: 'bg-red-100 text-red-700', icon: XCircle, label: 'Not Selected' },
  accepted: { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Offer Received' },
};

const TimelineItem = ({ item, isLast }: { item: any; isLast: boolean }) => {
  const config = statusConfig[item.status as keyof typeof statusConfig];
  const Icon = config?.icon || AlertCircle;

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${config?.color || 'bg-gray-100'}`}>
          <Icon className="w-5 h-5" />
        </div>
        {!isLast && <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 mt-2" />}
      </div>
      <div className="flex-1 pb-8">
        <p className="font-medium">{config?.label || item.status}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(item.date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
        {item.note && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.note}</p>
        )}
      </div>
    </div>
  );
};

export default function ApplicationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [application, setApplication] = useState<ApplicationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchApplicationDetails(params.id as string);
    }
  }, [params.id]);

  const fetchApplicationDetails = async (applicationId: string) => {
    try {
      // const response = await api.get(`/applications/${applicationId}`);
      // setApplication(response.data);
      
      // Mock data
      const mockApplication: ApplicationDetails = {
        applicationID: applicationId,
        jobID: '1',
        job: {
          title: 'Senior Frontend Developer',
          company: 'TechCo Rwanda',
          location: 'Kigali, Rwanda',
          type: 'full-time',
          salary: { min: 1500000, max: 2500000, currency: 'RWF' },
          description: 'We are looking for a skilled Frontend Developer to join our growing team.',
        },
        status: 'interview_scheduled',
        appliedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        timeline: [
          {
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'submitted',
            note: 'Application submitted successfully',
          },
          {
            date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'under_review',
            note: 'Your application is being reviewed by the hiring team',
          },
          {
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'shortlisted',
            note: 'Congratulations! You have been shortlisted',
          },
          {
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'interview_scheduled',
            note: 'Interview scheduled for next week',
          },
        ],
        documents: {
          resume: {
            name: 'John_Doe_Resume.pdf',
            url: '/documents/resume.pdf',
            uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          },
          coverLetter: {
            name: 'Cover_Letter_TechCo.pdf',
            url: '/documents/cover-letter.pdf',
            uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          },
          portfolio: {
            name: 'Portfolio_Link',
            url: 'https://johndoe.dev',
            uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          },
        },
        recruiterInfo: {
          name: 'Sarah Johnson',
          email: 'sarah.johnson@techco.rw',
          phone: '+250 788 123 456',
          position: 'Senior HR Manager',
        },
        interviewDetails: {
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          time: '10:00 AM',
          type: 'video',
          meetingLink: 'https://meet.google.com/abc-defg-hij',
          instructions: 'Please join the meeting 5 minutes early. Ensure your camera and microphone are working properly.',
        },
        notes: [
          {
            id: '1',
            content: 'Research the company culture and recent projects',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            isPrivate: true,
          },
          {
            id: '2',
            content: 'Prepare questions about the tech stack and team structure',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            isPrivate: true,
          },
        ],
      };
      
      setApplication(mockApplication);
    } catch (error) {
      console.error('Failed to fetch application details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    setAddingNote(true);
    try {
      // await api.post(`/applications/${application?.applicationID}/notes`, { content: newNote });
      
      // Mock adding note
      if (application) {
        const newNoteObj = {
          id: Date.now().toString(),
          content: newNote,
          createdAt: new Date().toISOString(),
          isPrivate: true,
        };
        setApplication({
          ...application,
          notes: [...application.notes, newNoteObj],
        });
        setNewNote('');
      }
    } catch (error) {
      console.error('Failed to add note:', error);
    } finally {
      setAddingNote(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (application) {
      setApplication({
        ...application,
        notes: application.notes.filter(note => note.id !== noteId),
      });
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

  if (!application) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Application not found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The application you're looking for doesn't exist.
            </p>
            <Link href="/student/applications">
              <Button>Back to Applications</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusInfo = statusConfig[application.status];

  return (
    <ProtectedRoute allowedRoles={['student']}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Header */}
        <section className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Applications
            </Button>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">{application.job.title}</h1>
                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 mt-2">
                  <div className="flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    <span>{application.job.company}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{application.job.location}</span>
                  </div>
                </div>
              </div>
              <Badge className={`${statusInfo.color} px-4 py-2`}>
                <statusInfo.icon className="w-4 h-4 mr-2" />
                {statusInfo.label}
              </Badge>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Main Info */}
              <div className="lg:col-span-2 space-y-6">
                <Tabs defaultValue="timeline" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="interview">Interview</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                  </TabsList>

                  <TabsContent value="timeline" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Application Timeline</CardTitle>
                        <CardDescription>
                          Track the progress of your application
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {application.timeline.map((item, index) => (
                            <TimelineItem
                              key={index}
                              item={item}
                              isLast={index === application.timeline.length - 1}
                            />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="documents" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Submitted Documents</CardTitle>
                        <CardDescription>
                          Documents you submitted with this application
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="w-8 h-8 text-blue-600" />
                            <div>
                              <p className="font-medium">{application.documents.resume.name}</p>
                              <p className="text-sm text-gray-500">
                                Uploaded on {new Date(application.documents.resume.uploadedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>

                        {application.documents.coverLetter && (
                          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="w-8 h-8 text-purple-600" />
                              <div>
                                <p className="font-medium">{application.documents.coverLetter.name}</p>
                                <p className="text-sm text-gray-500">
                                  Uploaded on {new Date(application.documents.coverLetter.uploadedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        )}

                        {application.documents.portfolio && (
                          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Globe className="w-8 h-8 text-green-600" />
                              <div>
                                <p className="font-medium">{application.documents.portfolio.name}</p>
                                <p className="text-sm text-gray-500">
                                  {application.documents.portfolio.url}
                                </p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                              <a href={application.documents.portfolio.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Visit
                              </a>
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="interview" className="mt-6">
                    {application.interviewDetails ? (
                      <Card>
                        <CardHeader>
                          <CardTitle>Interview Details</CardTitle>
                          <CardDescription>
                            Information about your upcoming interview
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <Alert className="bg-blue-50 border-blue-200">
                            <Calendar className="h-4 w-4" />
                            <AlertDescription>
                              <strong>Interview scheduled for:</strong>{' '}
                              {new Date(application.interviewDetails.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}{' '}
                              at {application.interviewDetails.time}
                            </AlertDescription>
                          </Alert>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Interview Type</p>
                              <p className="font-medium capitalize">{application.interviewDetails.type}</p>
                            </div>
                            {application.interviewDetails.location && (
                              <div>
                                <p className="text-sm text-gray-500 mb-1">Location</p>
                                <p className="font-medium">{application.interviewDetails.location}</p>
                              </div>
                            )}
                          </div>

                          {application.interviewDetails.meetingLink && (
                            <div>
                              <p className="text-sm text-gray-500 mb-2">Meeting Link</p>
                              <Button variant="outline" className="w-full" asChild>
                                <a href={application.interviewDetails.meetingLink} target="_blank" rel="noopener noreferrer">
                                  <Calendar className="w-4 h-4 mr-2" />
                                  Join Video Interview
                                </a>
                              </Button>
                            </div>
                          )}

                          {application.interviewDetails.instructions && (
                            <div>
                              <p className="text-sm text-gray-500 mb-2">Instructions</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {application.interviewDetails.instructions}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ) : (
                      <Card>
                        <CardContent className="text-center py-8">
                          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 dark:text-gray-400">
                            No interview scheduled yet
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="notes" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Private Notes</CardTitle>
                        <CardDescription>
                          Add notes to help you prepare and track important information
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {application.notes.map((note) => (
                            <div key={note.id} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                              <div className="flex justify-between items-start">
                                <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                                  {note.content}
                                </p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteNote(note.id)}
                                  className="ml-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                              <p className="text-xs text-gray-500 mt-2">
                                {new Date(note.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          ))}

                          <div className="space-y-2">
                            <Label htmlFor="new-note">Add a note</Label>
                            <Textarea
                              id="new-note"
                              placeholder="Type your note here..."
                              value={newNote}
                              onChange={(e) => setNewNote(e.target.value)}
                              rows={3}
                            />
                            <Button
                              onClick={handleAddNote}
                              disabled={addingNote || !newNote.trim()}
                              className="w-full"
                            >
                              {addingNote ? (
                                <>
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  >
                                    <Send className="w-4 h-4 mr-2" />
                                  </motion.div>
                                  Adding...
                                </>
                              ) : (
                                <>
                                  <Send className="w-4 h-4 mr-2" />
                                  Add Note
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Right Column - Quick Info */}
              <div className="space-y-6">
                {/* Job Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Job Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{application.job.type}</span>
                    </div>
                    {application.job.salary && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">
                          {application.job.salary.currency} {application.job.salary.min.toLocaleString()} - {application.job.salary.max.toLocaleString()}
                        </span>
                      </div>
                    )}
                    <Link href={`/jobs/${application.jobID}`}>
                      <Button variant="outline" className="w-full mt-4">
                        View Job Details
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Recruiter Contact */}
                {application.recruiterInfo && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Recruiter Contact</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">{application.recruiterInfo.name}</p>
                          <p className="text-sm text-gray-500">{application.recruiterInfo.position}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 pt-2">
                        <a
                          href={`mailto:${application.recruiterInfo.email}`}
                          className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
                        >
                          <Mail className="w-4 h-4" />
                          {application.recruiterInfo.email}
                        </a>
                        {application.recruiterInfo.phone && (
                          <a
                            href={`tel:${application.recruiterInfo.phone}`}
                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
                          >
                            <Phone className="w-4 h-4" />
                            {application.recruiterInfo.phone}
                          </a>
                        )}
                      </div>

                      <Button variant="outline" className="w-full mt-4">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Important Dates */}
                <Card>
                  <CardHeader>
                    <CardTitle>Important Dates</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Applied On</p>
                      <p className="font-medium">
                        {new Date(application.appliedDate).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Updated</p>
                      <p className="font-medium">
                        {new Date(application.lastUpdated).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}
