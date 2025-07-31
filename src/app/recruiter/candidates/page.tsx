'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft,
  Search,
  Filter,
  Eye,
  Mail,
  GraduationCap,
  MapPin,
  Award,
  Briefcase,
  ExternalLink,
  Star,
  Download,
  UserPlus
} from 'lucide-react';
import Link from 'next/link';

interface Candidate {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  education: string;
  major: string;
  graduationYear: number;
  location: string;
  skills: string[];
  experience: string;
  portfolioUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  resumeUrl?: string;
  bio: string;
  achievements: string[];
  matchScore?: number; // AI-based matching score
}

export default function BrowseCandidatesPage() {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('match-score');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCandidates();
  }, []);

  useEffect(() => {
    filterAndSortCandidates();
  }, [candidates, searchQuery, skillFilter, locationFilter, experienceFilter, sortBy]);

  const fetchCandidates = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // Mock data for now
      const mockCandidates: Candidate[] = [
        {
          id: '1',
          name: 'Alice Johnson',
          email: 'alice.j@example.com',
          education: 'BSc Computer Science',
          major: 'Software Engineering',
          graduationYear: 2023,
          location: 'Kigali, Rwanda',
          skills: ['React', 'TypeScript', 'Node.js', 'Python', 'Git', 'Docker'],
          experience: 'Entry Level',
          portfolioUrl: 'https://alicejohnson.dev',
          githubUrl: 'https://github.com/alicej',
          linkedinUrl: 'https://linkedin.com/in/alicej',
          resumeUrl: '/resumes/alice-johnson.pdf',
          bio: 'Passionate software developer with a focus on creating user-friendly web applications. Strong foundation in modern web technologies.',
          achievements: [
            'Dean\'s List 2022-2023',
            'Winner of University Hackathon 2023',
            'Google Developer Student Club Lead'
          ],
          matchScore: 95
        },
        {
          id: '2',
          name: 'David Mwangi',
          email: 'david.m@example.com',
          education: 'BSc Information Technology',
          major: 'Cybersecurity',
          graduationYear: 2024,
          location: 'Nairobi, Kenya',
          skills: ['Python', 'Java', 'AWS', 'Linux', 'Network Security', 'SQL'],
          experience: 'Entry Level',
          githubUrl: 'https://github.com/dmwangi',
          linkedinUrl: 'https://linkedin.com/in/davidmwangi',
          resumeUrl: '/resumes/david-mwangi.pdf',
          bio: 'Cybersecurity enthusiast with hands-on experience in penetration testing and cloud security. Certified in AWS Cloud Practitioner.',
          achievements: [
            'AWS Certified Cloud Practitioner',
            'CompTIA Security+ Certified',
            'Cybersecurity Club President'
          ],
          matchScore: 88
        },
        {
          id: '3',
          name: 'Sarah Uwimana',
          email: 'sarah.u@example.com',
          education: 'BSc Software Engineering',
          major: 'Mobile Development',
          graduationYear: 2023,
          location: 'Kigali, Rwanda',
          skills: ['Flutter', 'Dart', 'React Native', 'JavaScript', 'Firebase', 'UI/UX'],
          experience: 'Junior',
          portfolioUrl: 'https://sarahuwimana.com',
          githubUrl: 'https://github.com/suwimana',
          resumeUrl: '/resumes/sarah-uwimana.pdf',
          bio: 'Mobile app developer specializing in cross-platform development. Created 5+ published apps with 10k+ downloads combined.',
          achievements: [
            'Published 5 apps on Google Play Store',
            'Flutter Forward Extended Speaker',
            'Women in Tech Scholarship Recipient'
          ],
          matchScore: 92
        }
      ];
      
      setCandidates(mockCandidates);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortCandidates = () => {
    let filtered = candidates;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(candidate => 
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.education.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.major.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.bio.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Skill filter
    if (skillFilter) {
      filtered = filtered.filter(candidate =>
        candidate.skills.some(skill => 
          skill.toLowerCase().includes(skillFilter.toLowerCase())
        )
      );
    }

    // Location filter
    if (locationFilter !== 'all') {
      filtered = filtered.filter(candidate =>
        candidate.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Experience filter
    if (experienceFilter !== 'all') {
      filtered = filtered.filter(candidate =>
        candidate.experience.toLowerCase() === experienceFilter.toLowerCase()
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'match-score':
          return (b.matchScore || 0) - (a.matchScore || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'graduation':
          return b.graduationYear - a.graduationYear;
        default:
          return 0;
      }
    });

    setFilteredCandidates(filtered);
  };

  const getUniqueLocations = () => {
    const locations = new Set(candidates.map(c => c.location.split(',')[1]?.trim() || c.location));
    return Array.from(locations);
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
                  <h1 className="text-2xl font-bold">Browse Candidates</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Find the perfect match for your open positions
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
              <CardTitle>Search & Filter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by name, education, or bio..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                
                <Input
                  placeholder="Filter by skill..."
                  value={skillFilter}
                  onChange={(e) => setSkillFilter(e.target.value)}
                />

                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {getUniqueLocations().map(location => (
                      <SelectItem key={location} value={location.toLowerCase()}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="entry level">Entry Level</SelectItem>
                    <SelectItem value="junior">Junior</SelectItem>
                    <SelectItem value="mid">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Found {filteredCandidates.length} candidates
                </p>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="match-score">Match Score</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="graduation">Graduation Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Candidates Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {isLoading ? (
              <Card className="col-span-full">
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground">Loading candidates...</p>
                </CardContent>
              </Card>
            ) : filteredCandidates.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground">No candidates found matching your criteria</p>
                </CardContent>
              </Card>
            ) : (
              filteredCandidates.map((candidate) => (
                <Card key={candidate.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-lg font-semibold text-primary">
                            {candidate.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <CardTitle className="text-lg">{candidate.name}</CardTitle>
                          <CardDescription>
                            {candidate.education} - {candidate.major}
                          </CardDescription>
                        </div>
                      </div>
                      {candidate.matchScore && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="font-semibold text-sm">{candidate.matchScore}%</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Bio */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {candidate.bio}
                    </p>

                    {/* Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{candidate.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-gray-400" />
                        <span>Class of {candidate.graduationYear}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-gray-400" />
                        <span>{candidate.experience}</span>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.slice(0, 5).map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                      {candidate.skills.length > 5 && (
                        <Badge variant="outline">+{candidate.skills.length - 5} more</Badge>
                      )}
                    </div>

                    {/* Achievements */}
                    {candidate.achievements.length > 0 && (
                      <div className="border-t pt-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium">Key Achievements</span>
                        </div>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          {candidate.achievements.slice(0, 2).map((achievement, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-2">•</span>
                              <span className="line-clamp-1">{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex gap-2">
                        <Link 
                          href={`/recruiter/candidates/${candidate.id}`}
                          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Profile
                        </Link>
                        
                        {candidate.resumeUrl && (
                          <Button size="sm" variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Resume
                          </Button>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {candidate.portfolioUrl && (
                          <a 
                            href={candidate.portfolioUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        
                        {candidate.githubUrl && (
                          <a 
                            href={candidate.githubUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10"
                          >
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                          </a>
                        )}
                        
                        {candidate.linkedinUrl && (
                          <a 
                            href={candidate.linkedinUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10"
                          >
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <Mail className="mr-2 h-4 w-4" />
                        Contact
                      </Button>
                      <Button size="sm" variant="secondary" className="flex-1">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Invite to Apply
                      </Button>
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
