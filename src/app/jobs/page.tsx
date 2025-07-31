'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign, 
  Filter,
  Building,
  Calendar,
  Users,
  TrendingUp,
  Heart,
  Share2,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

interface Job {
  jobID: string;
  title: string;
  company: {
    name: string;
    logo?: string;
    location: string;
  };
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirements: string[];
  skills: string[];
  postedDate: string;
  applicationDeadline: string;
  applicants: number;
  saved?: boolean;
}

const JobCard = ({ job, onSave }: { job: Job; onSave: (jobId: string) => void }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="h-full hover:shadow-xl transition-all duration-300 border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-bl-full" />
        
        <CardHeader className="relative">
          <div className="flex justify-between items-start">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold hover:text-blue-600 transition-colors">
                  <Link href={`/jobs/${job.jobID}`}>{job.title}</Link>
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <span className="font-medium">{job.company.name}</span>
                  <span className="text-gray-400">•</span>
                  <MapPin className="w-4 h-4" />
                  <span>{job.location}</span>
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onSave(job.jobID)}
                className={job.saved ? 'text-red-500' : ''}
              >
                <Heart className={`w-5 h-5 ${job.saved ? 'fill-current' : ''}`} />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {job.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {job.skillsRequired.slice(0, 4).map((skill, index) => (
              <Badge 
                key={index} 
                variant="secondary"
                className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
              >
                {skill}
              </Badge>
            ))}
            {job.skillsRequired.length > 4 && (
              <Badge variant="outline">+{job.skillsRequired.length - 4} more</Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Briefcase className="w-4 h-4" />
              <span className="capitalize">{job.jobType.replace('-', ' ')}</span>
            </div>
            {job.salary && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <DollarSign className="w-4 h-4" />
                <span>
                  {job.salary.currency} {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>{new Date(job.postedDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Users className="w-4 h-4" />
              <span>{job.applicants} applicants</span>
            </div>
          </div>

          <div className="pt-4">
            <Link href={`/jobs/${job.jobID}`}>
              <Button className="w-full group" variant={isHovered ? 'default' : 'outline'}>
                View Details
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [searchTerm, locationFilter, jobTypeFilter, jobs]);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/jobs');
      setJobs(response.data.jobs);
      setFilteredJobs(response.data.jobs);


      // Mock data for now
      const mockJobs: Job[] = [
        {
          jobID: '1',
          title: 'Senior Frontend Developer',
          company: {
            name: 'TechCo Rwanda',
            location: 'Kigali, Rwanda',
          },
          location: 'Kigali, Rwanda',
          type: 'full-time',
          salary: {
            min: 1500000,
            max: 2500000,
            currency: 'RWF',
          },
          description: 'We are looking for a skilled Frontend Developer to join our growing team and help build amazing web applications using modern technologies.',
          requirements: ['5+ years experience', 'React expertise', 'TypeScript proficiency'],
          skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Node.js'],
          postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          applicants: 23,
          saved: false,
        },
        {
          jobID: '2',
          title: 'Full Stack Developer Intern',
          company: {
            name: 'InnovateLab',
            location: 'Kigali, Rwanda',
          },
          location: 'Kigali, Rwanda',
          type: 'internship',
          description: 'Join our innovative team as a Full Stack Developer Intern and gain hands-on experience in building scalable web applications.',
          requirements: ['Final year student or recent graduate', 'Basic web development knowledge'],
          skills: ['JavaScript', 'Python', 'React', 'Django', 'PostgreSQL'],
          postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
          applicants: 45,
          saved: true,
        },
        {
          jobID: '3',
          title: 'Backend Engineer',
          company: {
            name: 'StartupHub',
            location: 'Nairobi, Kenya',
          },
          location: 'Nairobi, Kenya',
          type: 'full-time',
          salary: {
            min: 80000,
            max: 120000,
            currency: 'KES',
          },
          description: 'We need a talented Backend Engineer to design and implement robust server-side applications and APIs.',
          requirements: ['3+ years backend experience', 'API design expertise', 'Cloud experience'],
          skills: ['Node.js', 'Python', 'AWS', 'MongoDB', 'Docker', 'Kubernetes'],
          postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          applicationDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          applicants: 67,
          saved: false,
        },
      ];
      
      // setJobs(mockJobs);
      // setFilteredJobs(mockJobs);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = [...jobs];

    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (locationFilter) {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (jobTypeFilter) {
      filtered = filtered.filter(job => job.type === jobTypeFilter);
    }

    setFilteredJobs(filtered);
  };

  const handleSaveJob = (jobId: string) => {
    setJobs(jobs.map(job => 
      job.jobID === jobId ? { ...job, saved: !job.saved } : job
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                <Sparkles className="w-12 h-12 text-yellow-300" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Dream Job
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Discover opportunities that match your skills and aspirations
            </p>

            {/* Search Bar */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
                  <Input
                    type="text"
                    placeholder="Search jobs, skills, or companies..."
                    className="pl-10 h-12 bg-white/20 border-white/30 text-white placeholder:text-white/70"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
                  <Input
                    type="text"
                    placeholder="Location"
                    className="pl-10 h-12 bg-white/20 border-white/30 text-white placeholder:text-white/70 md:w-48"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={() => setShowFilters(!showFilters)}
                  variant="secondary"
                  className="h-12"
                >
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </Button>
              </div>

              {/* Advanced Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 pt-4 border-t border-white/20"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
                        <SelectTrigger className="bg-white/20 border-white/30 text-white">
                          <SelectValue placeholder="Job Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Types</SelectItem>
                          <SelectItem value="full-time">Full Time</SelectItem>
                          <SelectItem value="part-time">Part Time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="internship">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                      {/* Add more filters as needed */}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Briefcase, label: 'Active Jobs', value: filteredJobs.length },
              { icon: Building, label: 'Companies', value: '50+' },
              { icon: Users, label: 'Job Seekers', value: '1,000+' },
              { icon: TrendingUp, label: 'Placements', value: '200+' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4"
              >
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {filteredJobs.length} Jobs Found
            </h2>
            <Select defaultValue="recent">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="relevant">Most Relevant</SelectItem>
                <SelectItem value="salary">Highest Salary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="h-96 animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <AnimatePresence>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map((job) => (
                  <JobCard key={job.jobID} job={job} onSave={handleSaveJob} />
                ))}
              </div>
            </AnimatePresence>
          )}

          {!loading && filteredJobs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search criteria
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
