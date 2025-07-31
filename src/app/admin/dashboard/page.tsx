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
  Users,
  Building,
  GraduationCap,
  Briefcase,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  FileText,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Download,
  Settings,
  BarChart3,
  PieChart,
  Globe,
  UserCheck,
  UserX,
  Ban,
  Mail,
  MessageSquare,
  Sparkles,
  Zap,
  Calendar,
  LogOut
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

// Mock data for charts
const userGrowthData = [
  { month: 'Jan', students: 150, recruiters: 20, companies: 15 },
  { month: 'Feb', students: 220, recruiters: 28, companies: 18 },
  { month: 'Mar', students: 310, recruiters: 35, companies: 22 },
  { month: 'Apr', students: 420, recruiters: 42, companies: 28 },
  { month: 'May', students: 580, recruiters: 55, companies: 35 },
  { month: 'Jun', students: 750, recruiters: 68, companies: 42 },
];

const platformActivityData = [
  { day: 'Mon', logins: 342, applications: 45, messages: 128 },
  { day: 'Tue', logins: 456, applications: 62, messages: 156 },
  { day: 'Wed', logins: 523, applications: 78, messages: 189 },
  { day: 'Thu', logins: 489, applications: 71, messages: 167 },
  { day: 'Fri', logins: 612, applications: 95, messages: 234 },
  { day: 'Sat', logins: 234, applications: 32, messages: 89 },
  { day: 'Sun', logins: 189, applications: 28, messages: 67 },
];

const userTypeDistribution = [
  { name: 'Students', value: 750, color: '#3B82F6' },
  { name: 'Recruiters', value: 68, color: '#8B5CF6' },
  { name: 'University Admins', value: 25, color: '#10B981' },
  { name: 'Platform Admins', value: 5, color: '#F59E0B' },
];

const jobCategoriesData = [
  { category: 'Technology', jobs: 125, applications: 892 },
  { category: 'Finance', jobs: 45, applications: 234 },
  { category: 'Healthcare', jobs: 38, applications: 189 },
  { category: 'Education', jobs: 52, applications: 345 },
  { category: 'Marketing', jobs: 28, applications: 156 },
];

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalJobs: number;
  totalApplications: number;
  totalCompanies: number;
  totalUniversities: number;
  placementRate: number;
  averageTimeToHire: number;
  pendingVerifications: number;
  reportedContent: number;
  systemHealth: number;
  storageUsed: number;
}

interface RecentActivity {
  id: string;
  type: 'user_joined' | 'job_posted' | 'application_submitted' | 'user_verified' | 'content_reported';
  description: string;
  timestamp: string;
  user?: string;
  status?: 'pending' | 'resolved';
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

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null;

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

const ActivityItem = ({ activity }: { activity: RecentActivity }) => {
  const typeConfig = {
    user_joined: { icon: UserCheck, color: 'text-green-600' },
    job_posted: { icon: Briefcase, color: 'text-blue-600' },
    application_submitted: { icon: FileText, color: 'text-purple-600' },
    user_verified: { icon: CheckCircle, color: 'text-green-600' },
    content_reported: { icon: AlertTriangle, color: 'text-red-600' },
  };

  const config = typeConfig[activity.type];
  const Icon = config.icon;

  return (
    <div className="flex items-start gap-3 py-3">
      <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-800 ${config.color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 dark:text-gray-100">{activity.description}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {new Date(activity.timestamp).toLocaleString()}
        </p>
      </div>
      {activity.status && (
        <Badge variant={activity.status === 'pending' ? 'destructive' : 'default'}>
          {activity.status}
        </Badge>
      )}
    </div>
  );
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7days');
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 848,
    activeUsers: 623,
    totalJobs: 245,
    totalApplications: 1892,
    totalCompanies: 42,
    totalUniversities: 15,
    placementRate: 32.5,
    averageTimeToHire: 18,
    pendingVerifications: 12,
    reportedContent: 5,
    systemHealth: 98.5,
    storageUsed: 65,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      // const response = await api.get('/admin/dashboard/stats');
      // setStats(response.data.stats);
      // setRecentActivity(response.data.recentActivity);

      // Mock data
      setRecentActivity([
        {
          id: '1',
          type: 'user_joined',
          description: 'John Doe joined as a student',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          type: 'job_posted',
          description: 'TechCo Rwanda posted "Senior Developer" position',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          type: 'content_reported',
          description: 'Inappropriate content reported in job posting',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
        },
        {
          id: '4',
          type: 'user_verified',
          description: 'InnovateLab company account verified',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '5',
          type: 'application_submitted',
          description: '15 new applications submitted today',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        },
      ]);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['platform_admin']}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Welcome back, {user?.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon">
                  <Settings className="w-4 h-4" />
                </Button>
                <Button variant="ghost" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
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
                <Link href="/admin/users">
                  <Button size="sm" variant="secondary">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Users
                  </Button>
                </Link>
                <Link href="/admin/verifications">
                  <Button size="sm" variant="secondary">
                    <UserCheck className="w-4 h-4 mr-2" />
                    Verifications ({stats.pendingVerifications})
                  </Button>
                </Link>
                <Link href="/admin/reports">
                  <Button size="sm" variant="secondary">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Reports ({stats.reportedContent})
                  </Button>
                </Link>
                <Link href="/admin/analytics">
                  <Button size="sm" variant="secondary">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics
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
                  title="Total Users"
                  value={stats.totalUsers.toLocaleString()}
                  change={12}
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
                  title="Active Jobs"
                  value={stats.totalJobs}
                  change={8}
                  icon={Briefcase}
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
                  title="Placement Rate"
                  value={`${stats.placementRate}%`}
                  change={3}
                  icon={TrendingUp}
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
                  title="System Health"
                  value={`${stats.systemHealth}%`}
                  icon={Activity}
                  color="text-green-600"
                />
              </motion.div>
            </div>

            {/* Charts and Analytics */}
            <Tabs defaultValue="overview" className="space-y-4">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="users">Users</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                </TabsList>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24hours">24 Hours</SelectItem>
                    <SelectItem value="7days">7 Days</SelectItem>
                    <SelectItem value="30days">30 Days</SelectItem>
                    <SelectItem value="90days">90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* User Growth Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>User Growth</CardTitle>
                      <CardDescription>
                        Monthly user registration trends
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={userGrowthData}>
                          <defs>
                            <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorRecruiters" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Area type="monotone" dataKey="students" stroke="#3B82F6" fillOpacity={1} fill="url(#colorStudents)" />
                          <Area type="monotone" dataKey="recruiters" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorRecruiters)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* User Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle>User Distribution</CardTitle>
                      <CardDescription>
                        Breakdown by user type
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <RePieChart>
                          <Pie
                            data={userTypeDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {userTypeDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RePieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* System Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Storage Usage</span>
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold">{stats.storageUsed}%</span>
                          <span className="text-sm text-muted-foreground">of 100GB</span>
                        </div>
                        <Progress value={stats.storageUsed} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Active Users</span>
                        <Activity className="w-4 h-4 text-muted-foreground" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold">{stats.activeUsers}</span>
                          <Badge variant="secondary" className="text-xs">
                            Live
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}% of total users
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Avg. Time to Hire</span>
                        <Clock className="w-4 h-4 text-muted-foreground" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold">{stats.averageTimeToHire}</span>
                          <span className="text-sm text-muted-foreground">days</span>
                        </div>
                        <p className="text-sm text-green-600">
                          ↓ 2 days from last month
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="users" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>User Management Overview</CardTitle>
                    <CardDescription>
                      Monitor user accounts and activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Users className="w-8 h-8 text-blue-600" />
                          <Badge>Students</Badge>
                        </div>
                        <p className="text-2xl font-bold">750</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">88.4% of users</p>
                      </div>
                      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Building className="w-8 h-8 text-purple-600" />
                          <Badge>Companies</Badge>
                        </div>
                        <p className="text-2xl font-bold">42</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Active companies</p>
                      </div>
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <GraduationCap className="w-8 h-8 text-green-600" />
                          <Badge>Universities</Badge>
                        </div>
                        <p className="text-2xl font-bold">15</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Partner institutions</p>
                      </div>
                      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <UserCheck className="w-8 h-8 text-yellow-600" />
                          <Badge>Verified</Badge>
                        </div>
                        <p className="text-2xl font-bold">89%</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Verification rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Activity</CardTitle>
                    <CardDescription>
                      Daily platform usage metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={platformActivityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="logins" fill="#3B82F6" name="Logins" />
                        <Bar dataKey="applications" fill="#10B981" name="Applications" />
                        <Bar dataKey="messages" fill="#8B5CF6" name="Messages" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="performance" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Job Categories Performance</CardTitle>
                      <CardDescription>
                        Jobs and applications by category
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {jobCategoriesData.map((category, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{category.category}</span>
                              <span className="text-sm text-muted-foreground">
                                {category.jobs} jobs • {category.applications} applications
                              </span>
                            </div>
                            <Progress 
                              value={(category.applications / 1000) * 100} 
                              className="h-2"
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>System Performance</CardTitle>
                      <CardDescription>
                        Real-time system metrics
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <p className="text-3xl font-bold text-green-600">99.9%</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Uptime</p>
                        </div>
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <p className="text-3xl font-bold text-blue-600">145ms</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Avg Response</p>
                        </div>
                      </div>
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          All systems operational. No issues detected.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest platform events and actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {recentActivity.map((activity) => (
                      <ActivityItem key={activity.id} activity={activity} />
                    ))}
                  </div>
                  <Button variant="link" className="w-full mt-4">
                    View all activity →
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Pending Actions</CardTitle>
                  <CardDescription>
                    Items requiring admin attention
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href="/admin/verifications">
                    <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <UserCheck className="w-5 h-5 text-yellow-600" />
                        <span className="font-medium">Pending Verifications</span>
                      </div>
                      <Badge variant="secondary">{stats.pendingVerifications}</Badge>
                    </div>
                  </Link>
                  
                  <Link href="/admin/reports">
                    <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <span className="font-medium">Reported Content</span>
                      </div>
                      <Badge variant="destructive">{stats.reportedContent}</Badge>
                    </div>
                  </Link>
                  
                  <Link href="/admin/messages">
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">Support Tickets</span>
                      </div>
                      <Badge variant="secondary">8</Badge>
                    </div>
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
