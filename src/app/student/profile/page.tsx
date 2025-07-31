'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  FileText,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Plus,
  X,
  Upload,
  Check,
  AlertCircle,
  Sparkles,
  Target,
  Zap,
  Edit2,
  Save
} from 'lucide-react';
import api from '@/lib/api';

// Validation schemas
const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().optional(),
  location: z.string().optional(),
  headline: z.string().max(120, 'Headline must be less than 120 characters').optional(),
  about: z.string().max(500, 'About must be less than 500 characters').optional(),
  website: z.string().url().optional().or(z.literal('')),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
});

const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
});

const educationSchema = z.object({
  school: z.string().min(2, 'School name is required'),
  degree: z.string().min(2, 'Degree is required'),
  field: z.string().min(2, 'Field of study is required'),
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean(),
  description: z.string().optional(),
});

const experienceSchema = z.object({
  title: z.string().min(2, 'Job title is required'),
  company: z.string().min(2, 'Company name is required'),
  location: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean(),
  description: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type Skill = z.infer<typeof skillSchema>;
type Education = z.infer<typeof educationSchema>;
type Experience = z.infer<typeof experienceSchema>;

const ProfileCompletionCard = ({ percentage }: { percentage: number }) => {
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Profile Completion
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{percentage}%</span>
            {percentage === 100 ? (
              <Badge className="bg-green-100 text-green-700">Complete</Badge>
            ) : (
              <Badge variant="secondary">In Progress</Badge>
            )}
          </div>
          <Progress value={percentage} className="h-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {percentage < 100 
              ? `Complete your profile to increase visibility to recruiters`
              : `Great job! Your profile is complete`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const SkillBadge = ({ skill, onRemove }: { skill: Skill; onRemove: () => void }) => {
  const levelColors = {
    beginner: 'bg-gray-100 text-gray-700',
    intermediate: 'bg-blue-100 text-blue-700',
    advanced: 'bg-purple-100 text-purple-700',
    expert: 'bg-green-100 text-green-700',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="inline-flex items-center gap-2"
    >
      <Badge className={`${levelColors[skill.level]} px-3 py-1`}>
        <span className="font-medium">{skill.name}</span>
        <button
          onClick={onRemove}
          className="ml-2 hover:text-red-600 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      </Badge>
    </motion.div>
  );
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(75);
  const [skills, setSkills] = useState<Skill[]>([
    { name: 'React', level: 'advanced' },
    { name: 'TypeScript', level: 'intermediate' },
    { name: 'Node.js', level: 'intermediate' },
  ]);
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phoneNumber: '',
      location: 'Kigali, Rwanda',
      headline: 'Aspiring Software Developer',
      about: '',
      website: '',
      github: '',
      linkedin: '',
      twitter: '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setSaving(true);
      // await api.put('/students/profile', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = (newSkill: Skill) => {
    setSkills([...skills, newSkill]);
    setShowSkillForm(false);
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setResumeFile(file);
      // Upload logic here
    }
  };

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
              className="max-w-4xl mx-auto text-center"
            >
              <div className="mb-6">
                <div className="w-32 h-32 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <User className="w-16 h-16 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-2">{user?.name}</h1>
              <p className="text-xl text-blue-100 mb-4">Aspiring Software Developer</p>
              <div className="flex justify-center gap-4">
                <Button
                  variant={isEditing ? 'secondary' : 'default'}
                  onClick={() => setIsEditing(!isEditing)}
                  className={!isEditing ? 'bg-white text-blue-600 hover:bg-gray-100' : ''}
                >
                  {isEditing ? (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Quick Stats */}
              <div className="space-y-6">
                <ProfileCompletionCard percentage={profileCompletion} />
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="w-4 h-4 mr-2" />
                      Download Resume
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Award className="w-4 h-4 mr-2" />
                      Add Certification
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Github className="w-4 h-4 mr-2" />
                      Connect GitHub
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Profile Details */}
              <div className="lg:col-span-2">
                <Tabs defaultValue="about" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="about">About</TabsTrigger>
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                    <TabsTrigger value="experience">Experience</TabsTrigger>
                    <TabsTrigger value="education">Education</TabsTrigger>
                  </TabsList>

                  <TabsContent value="about" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>
                          Your basic information and contact details
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {isEditing ? (
                          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                  id="name"
                                  {...register('name')}
                                  disabled={saving}
                                />
                                {errors.name && (
                                  <p className="text-sm text-red-500">{errors.name.message}</p>
                                )}
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                  id="email"
                                  type="email"
                                  {...register('email')}
                                  disabled={saving}
                                />
                                {errors.email && (
                                  <p className="text-sm text-red-500">{errors.email.message}</p>
                                )}
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="phoneNumber">Phone Number</Label>
                                <Input
                                  id="phoneNumber"
                                  type="tel"
                                  {...register('phoneNumber')}
                                  disabled={saving}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                  id="location"
                                  {...register('location')}
                                  disabled={saving}
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="headline">Professional Headline</Label>
                              <Input
                                id="headline"
                                {...register('headline')}
                                disabled={saving}
                                placeholder="e.g., Full Stack Developer | React & Node.js"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="about">About Me</Label>
                              <Textarea
                                id="about"
                                {...register('about')}
                                disabled={saving}
                                rows={4}
                                placeholder="Tell us about yourself..."
                              />
                            </div>

                            <div className="flex justify-end gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEditing(false)}
                                disabled={saving}
                              >
                                Cancel
                              </Button>
                              <Button type="submit" disabled={saving}>
                                {saving ? (
                                  <>
                                    <motion.div
                                      animate={{ rotate: 360 }}
                                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    >
                                      <Save className="w-4 h-4 mr-2" />
                                    </motion.div>
                                    Saving...
                                  </>
                                ) : (
                                  <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                  </>
                                )}
                              </Button>
                            </div>
                          </form>
                        ) : (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-500">Name</p>
                                <p className="font-medium">{user?.name}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{user?.email}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="font-medium">+250 788 123 456</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Location</p>
                                <p className="font-medium">Kigali, Rwanda</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">About</p>
                              <p className="text-gray-600 dark:text-gray-400">
                                Passionate software developer with a strong foundation in web development.
                                Eager to contribute to innovative projects and grow professionally.
                              </p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Resume/CV</CardTitle>
                        <CardDescription>
                          Upload your latest resume
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                          {resumeFile ? (
                            <div className="space-y-2">
                              <FileText className="w-12 h-12 text-green-500 mx-auto" />
                              <p className="font-medium">{resumeFile.name}</p>
                              <p className="text-sm text-gray-500">
                                Uploaded successfully
                              </p>
                              <Button variant="outline" size="sm">
                                Replace File
                              </Button>
                            </div>
                          ) : (
                            <>
                              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                              <p className="text-gray-600 dark:text-gray-400 mb-2">
                                Drag and drop your resume here, or click to browse
                              </p>
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleResumeUpload}
                                className="hidden"
                                id="resume-upload"
                              />
                              <label htmlFor="resume-upload">
                                <Button variant="outline" asChild>
                                  <span>Choose File</span>
                                </Button>
                              </label>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="skills" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Technical Skills</CardTitle>
                        <CardDescription>
                          Add your skills and proficiency levels
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill, index) => (
                            <SkillBadge
                              key={index}
                              skill={skill}
                              onRemove={() => handleRemoveSkill(index)}
                            />
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowSkillForm(true)}
                            className="h-8"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Skill
                          </Button>
                        </div>

                        {showSkillForm && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="border rounded-lg p-4 space-y-3"
                          >
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label>Skill Name</Label>
                                <Input placeholder="e.g., JavaScript" />
                              </div>
                              <div>
                                <Label>Proficiency</Label>
                                <Select defaultValue="intermediate">
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="beginner">Beginner</SelectItem>
                                    <SelectItem value="intermediate">Intermediate</SelectItem>
                                    <SelectItem value="advanced">Advanced</SelectItem>
                                    <SelectItem value="expert">Expert</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => {
                                  handleAddSkill({ name: 'New Skill', level: 'intermediate' });
                                }}
                              >
                                Add
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setShowSkillForm(false)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="experience">
                    <Card>
                      <CardHeader>
                        <CardTitle>Work Experience</CardTitle>
                        <CardDescription>
                          Add your professional experience
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8">
                          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 dark:text-gray-400 mb-4">
                            No experience added yet
                          </p>
                          <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Experience
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="education">
                    <Card>
                      <CardHeader>
                        <CardTitle>Education</CardTitle>
                        <CardDescription>
                          Add your educational background
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8">
                          <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 dark:text-gray-400 mb-4">
                            No education added yet
                          </p>
                          <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Education
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}
