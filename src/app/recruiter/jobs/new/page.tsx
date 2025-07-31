'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  Briefcase, 
  Plus, 
  X,
  Save,
  Eye,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

interface JobFormData {
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  location: string;
  jobType: string;
  experienceLevel: string;
  salary: {
    min?: number;
    max?: number;
    currency: string;
    period?: string;
  };
  skillsRequired: string[];
  deadline: string;
  isRemote: boolean;
  isHybrid: boolean;
  benefits: string[];
  educationRequirement?: string;
  experienceYears?: number;
  positions: number;
}

export default function PostNewJob() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSkill, setCurrentSkill] = useState('');
  const [currentRequirement, setCurrentRequirement] = useState('');
  const [currentResponsibility, setCurrentResponsibility] = useState('');
  const [currentBenefit, setCurrentBenefit] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    description: '',
    requirements: [],
    responsibilities: [],
    location: '',
    jobType: 'full_time',
    experienceLevel: 'entry',
    salary: {
      min: undefined,
      max: undefined,
      currency: 'USD',
      period: 'annually'
    },
    skillsRequired: [],
    deadline: '',
    isRemote: false,
    isHybrid: false,
    benefits: [],
    educationRequirement: '',
    experienceYears: 0,
    positions: 1
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name.startsWith('salary.')) {
      const salaryField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        salary: {
          ...prev.salary,
          [salaryField]: salaryField === 'min' || salaryField === 'max' ? parseFloat(value) || undefined : value
        }
      }));
    } else if (name === 'experienceYears' || name === 'positions') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addSkill = () => {
    if (currentSkill.trim() && !formData.skillsRequired.includes(currentSkill.trim())) {
      setFormData(prev => ({ 
        ...prev, 
        skillsRequired: [...prev.skillsRequired, currentSkill.trim()] 
      }));
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter(skill => skill !== skillToRemove)
    }));
  };

  const addRequirement = () => {
    if (currentRequirement.trim() && !formData.requirements.includes(currentRequirement.trim())) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, currentRequirement.trim()]
      }));
      setCurrentRequirement('');
    }
  };

  const removeRequirement = (reqToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter(req => req !== reqToRemove)
    }));
  };

  const addResponsibility = () => {
    if (currentResponsibility.trim() && !formData.responsibilities.includes(currentResponsibility.trim())) {
      setFormData(prev => ({
        ...prev,
        responsibilities: [...prev.responsibilities, currentResponsibility.trim()]
      }));
      setCurrentResponsibility('');
    }
  };

  const removeResponsibility = (respToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      responsibilities: prev.responsibilities.filter(resp => resp !== respToRemove)
    }));
  };

  const addBenefit = () => {
    if (currentBenefit.trim() && !formData.benefits.includes(currentBenefit.trim())) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, currentBenefit.trim()]
      }));
      setCurrentBenefit('');
    }
  };

  const removeBenefit = (benefitToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter(benefit => benefit !== benefitToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Prepare the payload according to backend API structure
      const payload = {
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        skillsRequired: formData.skillsRequired,
        experienceLevel: formData.experienceLevel,
        jobType: formData.jobType,
        salary: formData.salary.min || formData.salary.max ? formData.salary : undefined,
        location: formData.location,
        isRemote: formData.isRemote,
        isHybrid: formData.isHybrid,
        benefits: formData.benefits,
        responsibilities: formData.responsibilities,
        educationRequirement: formData.educationRequirement,
        experienceYears: formData.experienceYears,
        positions: formData.positions,
        deadline: formData.deadline
      };

      const response = await api.post('/jobs', payload);
      
      if (response.data) {
        setSuccess('Job posted successfully!');
        setTimeout(() => {
          router.push('/recruiter/dashboard');
        }, 1500);
      }
    } catch (error: any) {
      console.error('Error posting job:', error);
      setError(error.response?.data?.message || 'Failed to post job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
                  <h1 className="text-2xl font-bold">Post New Job</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Create a new job posting
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Posting...' : 'Post Job'}
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Error/Success Messages */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert variant="default" className="border-green-500 text-green-700 dark:text-green-400">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Provide the essential details about the position
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Frontend Developer"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="jobType">Job Type *</Label>
                    <Select 
                      value={formData.jobType} 
                      onValueChange={(value) => handleSelectChange('jobType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full_time">Full Time</SelectItem>
                        <SelectItem value="part_time">Part Time</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="freelance">Freelance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="experienceLevel">Experience Level *</Label>
                    <Select 
                      value={formData.experienceLevel} 
                      onValueChange={(value) => handleSelectChange('experienceLevel', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entry">Entry Level</SelectItem>
                        <SelectItem value="junior">Junior</SelectItem>
                        <SelectItem value="mid">Mid Level</SelectItem>
                        <SelectItem value="senior">Senior</SelectItem>
                        <SelectItem value="lead">Lead</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g., Kigali, Rwanda"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Work Arrangement</Label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="isRemote"
                          checked={formData.isRemote}
                          onChange={handleInputChange}
                          className="rounded"
                        />
                        <span className="text-sm">Remote</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="isHybrid"
                          checked={formData.isHybrid}
                          onChange={handleInputChange}
                          className="rounded"
                        />
                        <span className="text-sm">Hybrid</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="salary.min">Minimum Salary</Label>
                    <Input
                      id="salary.min"
                      name="salary.min"
                      type="number"
                      value={formData.salary.min || ''}
                      onChange={handleInputChange}
                      placeholder="30000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="salary.max">Maximum Salary</Label>
                    <Input
                      id="salary.max"
                      name="salary.max"
                      type="number"
                      value={formData.salary.max || ''}
                      onChange={handleInputChange}
                      placeholder="45000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="salary.currency">Currency</Label>
                    <Select 
                      value={formData.salary.currency} 
                      onValueChange={(value) => setFormData(prev => ({
                        ...prev,
                        salary: { ...prev.salary, currency: value }
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
                        <SelectItem value="UGX">UGX</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="experienceYears">Required Experience (Years)</Label>
                    <Input
                      id="experienceYears"
                      name="experienceYears"
                      type="number"
                      value={formData.experienceYears}
                      onChange={handleInputChange}
                      placeholder="2"
                      min="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="positions">Number of Positions</Label>
                    <Input
                      id="positions"
                      name="positions"
                      type="number"
                      value={formData.positions}
                      onChange={handleInputChange}
                      placeholder="1"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="deadline">Application Deadline *</Label>
                    <Input
                      id="deadline"
                      name="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="educationRequirement">Education Requirement</Label>
                    <Select 
                      value={formData.educationRequirement || ''} 
                      onValueChange={(value) => handleSelectChange('educationRequirement', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select education level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high_school">High School</SelectItem>
                        <SelectItem value="diploma">Diploma</SelectItem>
                        <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                        <SelectItem value="master">Master's Degree</SelectItem>
                        <SelectItem value="phd">PhD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Details */}
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
                <CardDescription>
                  Describe the role and what you're looking for
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="description">Job Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Provide a detailed description of the role..."
                    rows={6}
                    required
                  />
                </div>

                <div>
                  <Label>Key Responsibilities *</Label>
                  <div className="flex space-x-2 mb-2">
                    <Input
                      placeholder="Add a responsibility..."
                      value={currentResponsibility}
                      onChange={(e) => setCurrentResponsibility(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addResponsibility();
                        }
                      }}
                    />
                    <Button type="button" onClick={addResponsibility} variant="secondary">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.responsibilities.map((responsibility, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {responsibility}
                        <button
                          type="button"
                          onClick={() => removeResponsibility(responsibility)}
                          className="ml-2 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Requirements *</Label>
                  <div className="flex space-x-2 mb-2">
                    <Input
                      placeholder="Add a requirement..."
                      value={currentRequirement}
                      onChange={(e) => setCurrentRequirement(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addRequirement();
                        }
                      }}
                    />
                    <Button type="button" onClick={addRequirement} variant="secondary">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.requirements.map((requirement, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {requirement}
                        <button
                          type="button"
                          onClick={() => removeRequirement(requirement)}
                          className="ml-2 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Required Skills</CardTitle>
                <CardDescription>
                  Add the skills you're looking for in candidates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add a skill..."
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                  />
                  <Button type="button" onClick={addSkill} variant="secondary">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.skillsRequired.map((skill) => (
                    <Badge key={skill} variant="secondary" className="px-3 py-1">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-2 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle>Benefits & Perks</CardTitle>
                <CardDescription>
                  What benefits do you offer to employees?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add a benefit..."
                    value={currentBenefit}
                    onChange={(e) => setCurrentBenefit(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addBenefit();
                      }
                    }}
                  />
                  <Button type="button" onClick={addBenefit} variant="secondary">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.benefits.map((benefit) => (
                    <Badge key={benefit} variant="secondary" className="px-3 py-1">
                      {benefit}
                      <button
                        type="button"
                        onClick={() => removeBenefit(benefit)}
                        className="ml-2 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            </form>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
