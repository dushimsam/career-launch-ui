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
  Users, 
  Briefcase,
  Building,
  Globe,
  Mail,
  Phone,
  Star,
  TrendingUp,
  Filter,
  ChevronRight,
  Sparkles,
  Zap,
  Award,
  Heart
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

interface Company {
  companyID: string;
  name: string;
  logo?: string;
  industry: string;
  location: string;
  size: string;
  description: string;
  website?: string;
  email?: string;
  phone?: string;
  founded: string;
  specialties: string[];
  openPositions: number;
  employeeGrowth: number;
  rating: number;
  verified: boolean;
  hiring: boolean;
}

const CompanyCard = ({ company }: { company: Company }) => {
  const [saved, setSaved] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full hover:shadow-xl transition-all duration-300 overflow-hidden">
        {company.hiring && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-semibold px-3 py-1 text-center">
            <Zap className="w-3 h-3 inline mr-1" />
            Actively Hiring
          </div>
        )}
        
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  {company.name}
                  {company.verified && (
                    <Badge className="bg-blue-100 text-blue-700 text-xs">
                      <Award className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4" />
                  {company.location}
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSaved(!saved)}
              className={saved ? 'text-red-500' : ''}
            >
              <Heart className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {company.description}
          </p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-gray-400" />
              <span>{company.industry}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span>{company.size}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= company.rating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-sm text-gray-600 ml-1">({company.rating})</span>
            </div>
            {company.employeeGrowth > 0 && (
              <Badge variant="secondary" className="text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{company.employeeGrowth}% growth
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {company.specialties.slice(0, 3).map((specialty, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {specialty}
              </Badge>
            ))}
            {company.specialties.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{company.specialties.length - 3}
              </Badge>
            )}
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-sm font-medium text-green-600">
              {company.openPositions} open positions
            </span>
            <Link href={`/companies/${company.companyID}`}>
              <Button variant="ghost" size="sm" className="group">
                View Company
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState('all');
  const [hiringFilter, setHiringFilter] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    filterCompanies();
  }, [companies, searchTerm, industryFilter, sizeFilter, hiringFilter]);

  const fetchCompanies = async () => {
    try {
      // const response = await api.get('/companies');
      // setCompanies(response.data);
      
      // Mock data
      const mockCompanies: Company[] = [
        {
          companyID: '1',
          name: 'TechCo Rwanda',
          industry: 'Technology',
          location: 'Kigali, Rwanda',
          size: '50-200 employees',
          description: 'Leading technology company building innovative solutions for African markets.',
          website: 'https://techco.rw',
          founded: '2018',
          specialties: ['Software Development', 'Mobile Apps', 'Cloud Solutions', 'AI/ML'],
          openPositions: 8,
          employeeGrowth: 45,
          rating: 4.5,
          verified: true,
          hiring: true,
        },
        {
          companyID: '2',
          name: 'InnovateLab',
          industry: 'Software',
          location: 'Kigali, Rwanda',
          size: '10-50 employees',
          description: 'Innovation lab focused on creating cutting-edge software solutions.',
          founded: '2020',
          specialties: ['Web Development', 'UX Design', 'Digital Transformation'],
          openPositions: 3,
          employeeGrowth: 30,
          rating: 4.2,
          verified: true,
          hiring: true,
        },
        {
          companyID: '3',
          name: 'StartupHub Africa',
          industry: 'Technology',
          location: 'Nairobi, Kenya',
          size: '200-500 employees',
          description: 'Pan-African startup accelerator and technology hub.',
          founded: '2015',
          specialties: ['Startup Incubation', 'Venture Capital', 'Tech Education'],
          openPositions: 12,
          employeeGrowth: 25,
          rating: 4.7,
          verified: true,
          hiring: true,
        },
        {
          companyID: '4',
          name: 'FinTech Solutions',
          industry: 'Financial Services',
          location: 'Lagos, Nigeria',
          size: '100-200 employees',
          description: 'Digital banking and payment solutions for emerging markets.',
          founded: '2019',
          specialties: ['Mobile Banking', 'Payment Processing', 'Blockchain'],
          openPositions: 5,
          employeeGrowth: 60,
          rating: 4.3,
          verified: false,
          hiring: false,
        },
        {
          companyID: '5',
          name: 'HealthTech Africa',
          industry: 'Healthcare',
          location: 'Cape Town, South Africa',
          size: '50-100 employees',
          description: 'Digital health solutions improving healthcare access across Africa.',
          founded: '2017',
          specialties: ['Telemedicine', 'Health Records', 'Medical AI'],
          openPositions: 7,
          employeeGrowth: 35,
          rating: 4.6,
          verified: true,
          hiring: true,
        },
        {
          companyID: '6',
          name: 'EduTech Innovations',
          industry: 'Education',
          location: 'Kigali, Rwanda',
          size: '20-50 employees',
          description: 'EdTech platform democratizing education through technology.',
          founded: '2021',
          specialties: ['E-Learning', 'Virtual Classrooms', 'Educational Content'],
          openPositions: 4,
          employeeGrowth: 80,
          rating: 4.4,
          verified: true,
          hiring: true,
        },
      ];
      
      setCompanies(mockCompanies);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCompanies = () => {
    let filtered = [...companies];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Industry filter
    if (industryFilter !== 'all') {
      filtered = filtered.filter(company => company.industry === industryFilter);
    }

    // Size filter
    if (sizeFilter !== 'all') {
      filtered = filtered.filter(company => company.size === sizeFilter);
    }

    // Hiring filter
    if (hiringFilter) {
      filtered = filtered.filter(company => company.hiring);
    }

    setFilteredCompanies(filtered);
  };

  const industries = [...new Set(companies.map(c => c.industry))];
  const sizes = [...new Set(companies.map(c => c.size))];

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
                <Building className="w-12 h-12 text-yellow-300" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore Top Companies
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Discover amazing companies that are shaping the future of Africa
            </p>

            {/* Search Bar */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
                <Input
                  type="text"
                  placeholder="Search companies or specialties..."
                  className="pl-10 h-12 bg-white/20 border-white/30 text-white placeholder:text-white/70"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-6 bg-white dark:bg-gray-800 shadow-sm sticky top-16 z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Filters:</span>
            </div>
            
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {industries.map(industry => (
                  <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sizeFilter} onValueChange={setSizeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Company Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sizes</SelectItem>
                {sizes.map(size => (
                  <SelectItem key={size} value={size}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant={hiringFilter ? "default" : "outline"}
              onClick={() => setHiringFilter(!hiringFilter)}
              className="flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Actively Hiring Only
            </Button>

            <div className="ml-auto text-sm text-gray-600">
              {filteredCompanies.length} companies found
            </div>
          </div>
        </div>
      </section>

      {/* Companies Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                      <div className="flex-1">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredCompanies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCompanies.map((company) => (
                    <CompanyCard key={company.companyID} company={company} />
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No companies found</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Try adjusting your search criteria
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </section>
    </div>
  );
}
