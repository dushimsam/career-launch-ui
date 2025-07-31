'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import ProtectedRoute from '@/components/ProtectedRoute';
import { 
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Eye,
  FileText,
  Users,
  Calendar,
  Clock,
  Target,
  Award,
  Briefcase,
  ChevronUp,
  ChevronDown,
  Info,
  Sparkles,
  Lightbulb,
  AlertCircle,
  CheckCircle
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

// Mock data for charts
const profileViewsData = [
  { month: 'Jan', views: 45 },
  { month: 'Feb', views: 52 },
  { month: 'Mar', views: 48 },
  { month: 'Apr', views: 70 },
  { month: 'May', views: 85 },
  { month: 'Jun', views: 92 },
];

const applicationStatusData = [
  { name: 'Submitted', value: 12, color: '#3B82F6' },
  { name: 'Under Review', value: 5, color: '#F59E0B' },
  { name: 'Shortlisted', value: 3, color: '#8B5CF6' },
  { name: 'Interview', value: 2, color: '#6366F1' },
  { name: 'Rejected', value: 4, color: '#EF4444' },
  { name: 'Accepted', value: 1, color: '#10B981' },
];

const skillMatchData = [
  { skill: 'React', demand: 85, yourLevel: 75 },
  { skill: 'TypeScript', demand: 78, yourLevel: 60 },
  { skill: 'Node.js', demand: 72, yourLevel: 65 },
  { skill: 'Python', demand: 90, yourLevel: 40 },
  { skill: 'AWS', demand: 65, yourLevel: 30 },
];

const StatCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  trend 
}: { 
  title: string; 
  value: string | number; 
  change: number; 
  icon: React.ElementType; 
  trend: 'up' | 'down' | 'neutral';
}) => {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600',
  };

  const TrendIcon = trend === 'up' ? ChevronUp : trend === 'down' ? ChevronDown : null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {TrendIcon && (
          <div className={`flex items-center text-xs ${trendColors[trend]}`}>
            <TrendIcon className="h-4 w-4" />
            <span>{Math.abs(change)}% from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const InsightCard = ({ 
  type, 
  title, 
  description, 
  action 
}: { 
  type: 'success' | 'warning' | 'info';
  title: string;
  description: string;
  action?: string;
}) => {
  const typeConfig = {
    success: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
    warning: { icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
    info: { icon: Lightbulb, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className={`${config.bg} rounded-lg p-4`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${config.color} mt-0.5`} />
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">{title}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
          {action && (
            <button className={`text-sm font-medium ${config.color} hover:underline mt-2`}>
              {action} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('6months');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

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
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h1 className="text-4xl font-bold">Analytics Dashboard</h1>
              </div>
              <p className="text-xl text-blue-100">
                Track your career progress and optimize your job search strategy
              </p>
            </motion.div>
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
                  title="Profile Views"
                  value="342"
                  change={12}
                  icon={Eye}
                  trend="up"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <StatCard
                  title="Applications Sent"
                  value="27"
                  change={-5}
                  icon={FileText}
                  trend="down"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <StatCard
                  title="Interview Rate"
                  value="18.5%"
                  change={3}
                  icon={Users}
                  trend="up"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <StatCard
                  title="Response Rate"
                  value="65%"
                  change={0}
                  icon={Activity}
                  trend="neutral"
                />
              </motion.div>
            </div>

            {/* Charts Section */}
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="applications">Applications</TabsTrigger>
                <TabsTrigger value="skills">Skills Analysis</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Profile Views Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Views Over Time</CardTitle>
                      <CardDescription>
                        Track how many recruiters viewed your profile
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={profileViewsData}>
                          <defs>
                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Area 
                            type="monotone" 
                            dataKey="views" 
                            stroke="#3B82F6" 
                            fillOpacity={1} 
                            fill="url(#colorViews)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Application Status Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Application Status Distribution</CardTitle>
                      <CardDescription>
                        Current status of all your applications
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <RePieChart>
                          <Pie
                            data={applicationStatusData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {applicationStatusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RePieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Performance Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                    <CardDescription>
                      Key indicators of your job search effectiveness
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Profile Completion</span>
                        <span className="text-sm text-muted-foreground">85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Application Success Rate</span>
                        <span className="text-sm text-muted-foreground">22%</span>
                      </div>
                      <Progress value={22} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Interview Conversion</span>
                        <span className="text-sm text-muted-foreground">45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Average Response Time</span>
                        <span className="text-sm text-muted-foreground">3.2 days</span>
                      </div>
                      <Progress value={68} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="applications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Application Timeline</CardTitle>
                    <CardDescription>
                      Your application activity over the past 6 months
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={profileViewsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="views" fill="#3B82F6" name="Applications Sent" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="skills" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Skills Gap Analysis</CardTitle>
                    <CardDescription>
                      Compare your skills with market demand
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={skillMatchData} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis dataKey="skill" type="category" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="demand" fill="#3B82F6" name="Market Demand" />
                        <Bar dataKey="yourLevel" fill="#10B981" name="Your Level" />
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                            Skills Recommendation
                          </p>
                          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                            Consider improving your Python and AWS skills to match market demand better.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="insights" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Key Insights
                      </CardTitle>
                      <CardDescription>
                        Personalized recommendations based on your activity
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <InsightCard
                        type="success"
                        title="Strong Profile Performance"
                        description="Your profile views increased by 35% after adding React projects."
                        action="View Profile"
                      />
                      <InsightCard
                        type="warning"
                        title="Application Rate Declining"
                        description="You've applied to 40% fewer jobs this month compared to last month."
                        action="Browse Jobs"
                      />
                      <InsightCard
                        type="info"
                        title="Skill Match Opportunity"
                        description="3 new jobs match your TypeScript skills. Apply before they close."
                        action="View Matches"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Action Items
                      </CardTitle>
                      <CardDescription>
                        Recommended steps to improve your chances
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-300">1</span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">Complete Your Portfolio</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Add 2 more projects to reach the recommended 5 projects
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-300">2</span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">Update Skills Section</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Add Python and AWS certifications to match market demand
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-300">3</span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">Optimize Application Strategy</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Focus on roles requiring 2-3 years experience for better match
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Achievement Badges */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Achievements & Milestones
                    </CardTitle>
                    <CardDescription>
                      Celebrate your job search progress
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { name: 'Early Bird', description: 'First application sent', earned: true },
                        { name: 'Persistent', description: '25 applications sent', earned: true },
                        { name: 'Hot Profile', description: '100+ profile views', earned: true },
                        { name: 'Interview Pro', description: '5 interviews scheduled', earned: false },
                        { name: 'Quick Responder', description: 'Avg response < 24h', earned: true },
                        { name: 'Skill Master', description: '10+ verified skills', earned: false },
                        { name: 'Network Builder', description: '50+ connections', earned: false },
                        { name: 'Job Secured', description: 'First offer received', earned: false },
                      ].map((badge, index) => (
                        <div
                          key={index}
                          className={`text-center p-4 rounded-lg ${
                            badge.earned 
                              ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20' 
                              : 'bg-gray-100 dark:bg-gray-800 opacity-50'
                          }`}
                        >
                          <Trophy className={`w-8 h-8 mx-auto mb-2 ${
                            badge.earned ? 'text-yellow-600' : 'text-gray-400'
                          }`} />
                          <p className="font-medium text-sm">{badge.name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {badge.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}
