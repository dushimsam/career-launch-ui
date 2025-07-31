'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { normalizeUserType } from '@/lib/userUtils';
import { 
  Menu, 
  X, 
  Briefcase, 
  Home,
  FileText,
  Users,
  BarChart,
  LogOut,
  User,
  Settings,
  Building
} from 'lucide-react';

const publicNavItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/jobs', label: 'Browse Jobs', icon: Briefcase },
  { href: '/companies', label: 'Companies', icon: Users },
];

const studentNavItems = [
  { href: '/student/dashboard', label: 'Dashboard', icon: Home },
  { href: '/jobs', label: 'Browse Jobs', icon: Briefcase },
  { href: '/student/applications', label: 'My Applications', icon: FileText },
  { href: '/student/profile', label: 'Profile', icon: User },
];

const recruiterNavItems = [
  { href: '/recruiter/dashboard', label: 'Dashboard', icon: Home },
  { href: '/recruiter/jobs', label: 'Manage Jobs', icon: Briefcase },
  { href: '/recruiter/candidates', label: 'Candidates', icon: Users },
  { href: '/recruiter/analytics', label: 'Analytics', icon: BarChart },
];

const universityAdminNavItems = [
  { href: '/university/dashboard', label: 'Dashboard', icon: Home },
  { href: '/university/students', label: 'Students', icon: Users },
  { href: '/university/placements', label: 'Placements', icon: Briefcase },
  { href: '/university/partners', label: 'Partners', icon: Building },
];

const adminNavItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = user
    ? normalizeUserType(user.type) === 'student'
      ? studentNavItems
      : normalizeUserType(user.type) === 'recruiter'
      ? recruiterNavItems
      : normalizeUserType(user.type) === 'universityadmin'
      ? universityAdminNavItems
      : normalizeUserType(user.type) === 'platform_admin'
      ? adminNavItems
      : publicNavItems
    : publicNavItems;

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CareerLaunch
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    className={cn(
                      'flex items-center gap-2',
                      isActive && 'bg-gradient-to-r from-blue-600 to-purple-600'
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Hi, {user.name}
                </span>
                <Button variant="ghost" size="icon">
                  <Settings className="w-4 h-4" />
                </Button>
                <Button variant="ghost" onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-4 space-y-2"
          >
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
            <hr className="my-2" />
            {user ? (
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            ) : (
              <>
                <Link href="/login">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button 
                    className="w-full justify-start"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </motion.div>
        )}
      </div>
    </nav>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
