'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Mail, Lock, User, Briefcase, School, Building, AlertCircle, Github } from 'lucide-react';

// --- Enhanced Zod Schema with Discriminated Union ---
// This provides better type-safety and validation logic based on the userType.
const baseSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const registerSchema = z.discriminatedUnion('userType', [
  z.object({
    userType: z.literal('student'),
    studentID: z.string().min(1, 'Student ID is required'),
  }).merge(baseSchema),
  z.object({
    userType: z.literal('recruiter'),
    companyName: z.string().min(2, 'Company name is required'),
  }).merge(baseSchema),
  z.object({
    userType: z.literal('university_admin'),
    universityName: z.string().min(3, 'University name is required'),
  }).merge(baseSchema),
]);

type RegisterFormData = z.infer<typeof registerSchema>;

// --- UI Components ---

// A small utility for inputs with icons
const InputWithIcon = ({ icon: Icon, ...props }: { icon: React.ElementType } & React.ComponentProps<typeof Input>) => (
  <div className="relative">
    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    <Input {...props} className="pl-10" />
  </div>
);

// Password strength indicator component
const PasswordStrength = ({ password = '' }: { password?: string }) => {
  const getStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };
  const strength = getStrength();
  const strengthText = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength];
  const color = ['bg-red-500', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-500'][strength];

  if (!password) return null;

  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="w-full bg-muted rounded-full h-2">
        <motion.div
          className={`h-2 rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${(strength / 5) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <span className="text-xs text-muted-foreground w-20 text-right">{strengthText}</span>
    </div>
  );
};

// --- Main Register Page Component ---

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      userType: 'student',
      name: '',
      email: '',
      password: '',
      studentID: '',
    },
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = form;
  
  const userType = watch('userType');
  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setError('');
      console.log('Registration Data:', data);
      // await registerUser(data); // Uncomment when ready
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Motion variants for animations
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  // Helper to render conditional fields based on user type
  const renderConditionalFields = () => {
    switch (userType) {
      case 'student':
        return (
          <motion.div key="student" variants={itemVariants}>
            <Label htmlFor="studentID">Student ID</Label>
            <InputWithIcon id="studentID" icon={School} placeholder="Your Student ID" {...register('studentID')} disabled={isLoading} />
            {errors.userType === 'student' && errors.studentID && <p className="text-sm text-red-500 mt-1">{errors.studentID.message}</p>}
          </motion.div>
        );
      case 'recruiter':
        return (
          <motion.div key="recruiter" variants={itemVariants}>
            <Label htmlFor="companyName">Company Name</Label>
            <InputWithIcon id="companyName" icon={Briefcase} placeholder="Your Company LLC" {...register('companyName')} disabled={isLoading} />
            {errors.userType === 'recruiter' && errors.companyName && <p className="text-sm text-red-500 mt-1">{errors.companyName.message}</p>}
          </motion.div>
        );
      case 'university_admin':
        return (
          <motion.div key="university_admin" variants={itemVariants}>
            <Label htmlFor="universityName">University Name</Label>
            <InputWithIcon id="universityName" icon={Building} placeholder="University of Excellence" {...register('universityName')} disabled={isLoading} />
            {errors.userType === 'university_admin' && errors.universityName && <p className="text-sm text-red-500 mt-1">{errors.universityName.message}</p>}
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-md gap-6">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-3xl font-bold">Join Our Platform</CardTitle>
            <CardDescription>Choose your role and unlock your potential.</CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <motion.div className="grid gap-4" variants={formVariants} initial="hidden" animate="visible">
                {error && (
                  <motion.div variants={itemVariants}>
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Registration Failed</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}
                
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="userType">I am registering as a...</Label>
                  <Controller
                    control={control}
                    name="userType"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">🎓 Student</SelectItem>
                          <SelectItem value="recruiter">👔 Recruiter</SelectItem>
                          <SelectItem value="university_admin">🏛️ University Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <InputWithIcon id="name" icon={User} placeholder="John Doe" {...register('name')} disabled={isLoading} />
                  {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <InputWithIcon id="email" icon={Mail} type="email" placeholder="name@example.com" {...register('email')} disabled={isLoading} />
                  {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <InputWithIcon id="password" icon={Lock} type="password" {...register('password')} disabled={isLoading} />
                  <PasswordStrength password={password} />
                  {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
                </motion.div>
                
                {/* Animated Conditional Fields */}
                <AnimatePresence mode="wait">
                  {renderConditionalFields()}
                </AnimatePresence>

                <motion.div variants={itemVariants}>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...</> : 'Create Account'}
                  </Button>
                </motion.div>

                <motion.div variants={itemVariants} className="relative my-2">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="grid grid-cols-2 gap-2">
                   <Button variant="outline" type="button" disabled={isLoading}>
                      <Github className="mr-2 h-4 w-4" /> GitHub
                   </Button>
                   <Button variant="outline" type="button" disabled={isLoading}>
                      <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path><path fill="currentColor"d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path><path fill="none" d="M1 1h22v22H1z"></path></svg>
                      Google
                   </Button>
                </motion.div>

                <motion.div variants={itemVariants} className="mt-4 text-center text-sm">
                  Already have an account?{' '}
                  <Link href="/login" className="underline font-semibold hover:text-primary">
                    Sign in
                  </Link>
                </motion.div>

              </motion.div>
            </form>
          </CardContent>
        </div>
      </div>
      <div className="hidden bg-muted lg:flex items-center justify-center p-10 flex-col bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-slate-800">
          <div className="text-center">
             <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50">Find Your Future. Today.</h2>
             <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
               Connect with top universities and recruiters. Your career journey starts here.
             </p>
             <div className="mt-8">
                {/* You can place an illustration or a relevant image here */}
                {/* For example, an SVG illustration */}
                <School className="mx-auto h-48 w-48 text-indigo-300 dark:text-indigo-500" strokeWidth={1}/>
             </div>
          </div>
      </div>
    </div>
  );
}