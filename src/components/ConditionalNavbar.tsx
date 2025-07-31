'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Don't show the global navbar on the home page since it has its own
  if (pathname === '/') {
    return null;
  }
  
  return <Navbar />;
}