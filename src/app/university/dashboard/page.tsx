'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { 
  GraduationCap,
  Users,
  Briefcase,
  TrendingUp,
  Award,
  FileText,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  PieChart,
  Mail,
  Phone,
  Globe,
  MapPin,
  BookOpen,
  Target,
  Sparkles,
  UserCheck,
  UserX,
  Search,
  Filter,
  Download,
  LogOut,
  Plus,
  ChevronRight
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart
} from 'recharts';
import Link from 'next/link';
import api from '@/lib/api';

// Mock data
const placementData = [
  { month: 'Jan', placements: 12, applications: 45 },
  { month: 'Feb', placements: 15, applications: 62 },
  { month: 'Mar', placements: 23, applications: 78 },
  { month: 'Apr', placements: 28, applications: 95 },
  { month: 'May', placements: 35, applications: 112 },
  { month: 'Jun', placements: 42, applications: 128 },
];

const departmentDistribution = [
  { name: 'Computer Science', value: 145, color: '#3B82F6' },
  { name: 'Business', value: 98, color: '#8B5CF6' },
  { name: 'Engineering', value: 76, color: '#10B981' },
  { name: 'Design', value: 54, color: '#F59E0B' },
  { name: 'Others', value: 32, color: '#6B7280' },
];

const topEmployers = [
  { company: 'TechCo Rwanda', hires: 15, logo: '🏢' },
  { company: 'InnovateLab', hires: 12, logo: '💡' },
  { company: 'StartupHub', hires: 8, logo: '🚀' },
  { company: 'FinTech Solutions', hires: 6, logo: '💰' },
  { company: 'HealthTech Africa', hires: 5, logo: '🏥' },
];

interface UniversityStats {
  totalStudents: number;
  activeStudents: number;
  alumniCount: number;
  placementRate: number;
  averageSalary: number;
  totalApplications: number;
  pendingVerifications: number;
  totalCompanyPartners: number;
  activeJobPostings: number;
  upcomingEvents: number;
}

interface StudentActivity {
  id: string;
  studentName: string;
  action: string;
  timestamp: string;
  status?: 'success' | 'pending' | 'failed';
}

const StatCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  trend,
  color = 'text-primary'
}: { 
  title: string; 
  value: string | number; 
  change?: number; 
  icon: React.ElementType; 
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
}) => {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600',
  };

  const TrendIcon = trend === 'up' ? TrendingUp : null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && TrendIcon && trend && (
          <div className={`flex items-center text-xs ${trendColors[trend]} mt-1`}>
            <TrendIcon className="h-3 w-3" />
            <span className="ml-1">{Math.abs(change)}% from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function UniversityDashboard() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('6months');
  const [stats, setStats] = useState<UniversityStats>({
    totalStudents: 405,
    activeStudents: 342,
    alumniCount: 1250,
    placementRate: 78.5,
    averageSalary: 1200000,
    totalApplications: 892,
    pendingVerifications: 23,
    totalCompanyPartners: 28,
    activeJobPostings: 45,
    upcomingEvents: 3,
  });
  const [recentActivity, setRecentActivity] = useState<StudentActivity[]>([]);

  useEffect(() => {
    console.log('Fetching dashboard data...');
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      // Mock data
      setRecentActivity([
        {
          id: '1',
          studentName: 'John Doe',
          action: 'Applied to Frontend Developer at TechCo',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'success',
        },
        {
          id: '2',
          studentName: 'Jane Smith',
          action: 'Profile verification pending',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
        },
        {
          id: '3',
          studentName: 'Mike Johnson',
          action: 'Got placed at InnovateLab',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          status: 'success',
        },
      ]);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['universityadmin']}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">University Dashboard</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Welcome back, {user?.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Quick Actions Bar */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span className="font-medium">Quick Actions:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href="/university/students">
                  <Button size="sm" variant="secondary">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Students
                  </Button>
                </Link>
                <Link href="/university/verifications">
                  <Button size="sm" variant="secondary">
                    <UserCheck className="w-4 h-4 mr-2" />
                    Verify Students ({stats.pendingVerifications})
                  </Button>
                </Link>
                <Link href="/university/placements">
                  <Button size="sm" variant="secondary">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Placements
                  </Button>
                </Link>
                <Link href="/university/events">
                  <Button size="sm" variant="secondary">
                    <Calendar className="w-4 h-4 mr-2" />
                    Events ({stats.upcomingEvents})
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <StatCard
                  title="Total Students"
                  value={stats.totalStudents}
                  change={8}
                  icon={Users}
                  trend="up"
                  color="text-blue-600"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <StatCard
                  title="Placement Rate"
                  value={`${stats.placementRate}%`}
                  change={5}
                  icon={Target}
                  trend="up"
                  color="text-green-600"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <StatCard
                  title="Active Applications"
                  value={stats.totalApplications}
                  change={12}
                  icon={FileText}
                  trend="up"
                  color="text-purple-600"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <StatCard
                  title="Company Partners"
                  value={stats.totalCompanyPartners}
                  icon={Building}
                  color="text-orange-600"
                />
              </motion.div>
            </div>

            {/* Charts and Analytics */}
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="placements">Placements</TabsTrigger>
                <TabsTrigger value="students">Students</TabsTrigger>
                <TabsTrigger value="partners">Partners</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Placement Trends */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Placement Trends</CardTitle>
                      <CardDescription>
                        Monthly placements vs applications
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={placementData}>
                          <defs>
                            <linearGradient id="colorPlacements" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Area type="monotone" dataKey="applications" stroke="#3B82F6" fillOpacity={1} fill="url(#colorApplications)" />
                          <Area type="monotone" dataKey="placements" stroke="#10B981" fillOpacity={1} fill="url(#colorPlacements)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Department Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Students by Department</CardTitle>
                      <CardDescription>
                        Current enrollment distribution
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <RePieChart>
                          <Pie
                            data={departmentDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {departmentDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RePieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Average Salary</span>
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">
                        RWF {(stats.averageSalary / 1000000).toFixed(1)}M
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        For placed graduates
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Active Students</span>
                        <Users className="w-4 h-4 text-blue-600" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{stats.activeStudents}</p>
                      <Progress 
                        value={(stats.activeStudents / stats.totalStudents) * 100} 
                        className="h-2 mt-2"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        {((stats.activeStudents / stats.totalStudents) * 100).toFixed(0)}% engagement rate
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Alumni Network</span>
                        <Award className="w-4 h-4 text-purple-600" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{stats.alumniCount}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Total graduates
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="placements" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Hiring Companies</CardTitle>
                    <CardDescription>
                      Companies that hired the most students
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topEmployers.map((employer, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{employer.logo}</span>
                            <div>
                              <p className="font-medium">{employer.company}</p>
                              <p className="text-sm text-gray-500">Technology Sector</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-600">{employer.hires}</p>
                            <p className="text-sm text-gray-500">students hired</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="students" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Recent Student Activity</CardTitle>
                        <CardDescription>
                          Latest actions by your students
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${
                              activity.status === 'success' ? 'bg-green-500' :
                              activity.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                            }`} />
                            <div>
                              <p className="font-medium">{activity.studentName}</p>
                              <p className="text-sm text-gray-500">{activity.action}</p>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(activity.timestamp).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Button variant="link" className="w-full mt-4">
                      View all activity →
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="partners" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Partner Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Total Partners</span>
                        <span className="text-2xl font-bold">{stats.totalCompanyPartners}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Active Job Postings</span>
                        <span className="text-2xl font-bold text-green-600">{stats.activeJobPostings}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Avg. Jobs per Partner</span>
                        <span className="text-2xl font-bold">
                          {(stats.activeJobPostings / stats.totalCompanyPartners).toFixed(1)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Partnership Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button className="w-full justify-start">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Partner
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Mail className="w-4 h-4 mr-2" />
                        Invite Companies
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="w-4 h-4 mr-2" />
                        Partnership Report
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>
                    Career fairs and recruitment drives
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">Tech Career Fair</span>
                      <Badge>In 3 days</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      15 companies attending
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">Interview Workshop</span>
                      <Badge variant="secondary">Next week</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Soft skills training
                    </p>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Calendar className="w-4 h-4 mr-2" />
                    View All Events
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>This Month's Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">New Registrations</span>
                      <span className="font-bold">32</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Placements</span>
                      <span className="font-bold">18</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Applications Sent</span>
                      <span className="font-bold">156</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/university/reports">
                    <Button variant="outline" className="w-full justify-between">
                      <span className="flex items-center">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Generate Reports
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/university/settings">
                    <Button variant="outline" className="w-full justify-between">
                      <span className="flex items-center">
                        <Building className="w-4 h-4 mr-2" />
                        University Profile
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/university/help">
                    <Button variant="outline" className="w-full justify-between">
                      <span className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Help & Support
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}
