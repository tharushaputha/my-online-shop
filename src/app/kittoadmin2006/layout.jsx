// file: app/kittoadmin2006/layout.jsx
'use client'; 

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaTachometerAlt, FaShoppingCart, FaDollarSign, FaUsers, FaSpinner, FaSignOutAlt } from 'react-icons/fa';
import { supabase } from '@/lib/supabaseClient';

// Admin Navigation Links
const adminNavLinks = [
  { name: 'Dashboard', href: '/kittoadmin2006', icon: FaTachometerAlt },
  { name: 'Manage Orders', href: '/kittoadmin2006/manage-orders', icon: FaShoppingCart },
  { name: 'Withdrawals', href: '/kittoadmin2006/withdrawals', icon: FaDollarSign },
  { name: 'Manage Users', href: '/kittoadmin2006/users', icon: FaUsers },
];

export default function AdminLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 1. Check current session
    const checkSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession) {
        if (pathname !== '/kittoadmin2006/login') {
          router.push('/kittoadmin2006/login');
        } else {
          setIsLoading(false);
        }
      } else {
        setSession(currentSession);
        setIsLoading(false);
      }
    };
    checkSession();
    
    // 2. Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
             setSession(null);
             if (pathname !== '/kittoadmin2006/login') {
                router.push('/kittoadmin2006/login');
             }
        } else if (event === 'SIGNED_IN') {
             setSession(session);
        }
    });

    // 3. Cleanup listener
    return () => {
      authListener?.subscription?.unsubscribe();
    };

  }, [router, pathname]);

  // --- Logout Button Function ---
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/kittoadmin2006/login');
  };


  // 1. User ඉන්නේ Login Page එකේ නම්, Layout (Sidebar) පෙන්නන්න එපා
  if (pathname === '/kittoadmin2006/login') {
    // <html> සහ <body> tags අයින් කළා.
    // Admin panel එකේ background එකට ගැලපෙන්න bg-gray-100 දැම්මා.
    return (
      <div className="bg-gray-100 min-h-screen">
        {children} {/* Login page eka vitharak pennanawa */}
      </div>
    );
  }

  // 2. Log වෙලාද කියලා Check කරනකම් Loading පෙන්නනවා
  if (isLoading) {
    // <html> සහ <body> tags අයින් කළා.
    return (
      <div className="bg-gray-100 flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-pink-600 text-4xl" />
      </div>
    );
  }

  // 3. User Log වෙලා නම්, Admin Panel එක පෙන්නනවා
  if (!isLoading && session) {
    // <html> සහ <body> tags අයින් කළා.
    return (
      <div className="bg-gray-100 flex min-h-screen"> {/* Main container div */}
        
        {/* --- Sidebar --- */}
        <aside className="w-60 bg-gray-800 text-gray-200 flex flex-col p-4 shadow-lg">
          <div className="text-center py-4 mb-4 border-b border-gray-700">
            <Link href="/kittoadmin2006" className="text-2xl font-bold text-white hover:text-pink-500 transition-colors">
              Kitto Admin
            </Link>
          </div>
          
          <nav className="flex-grow">
            <ul className="space-y-2">
              {adminNavLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      pathname === link.href 
                      ? 'bg-pink-600 text-white' // Active link
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <link.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span className="font-medium">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* --- Logout Button --- */}
          <div className="pt-4 border-t border-gray-700 space-y-2">
             <button 
                onClick={handleLogout} 
                className="w-full flex items-center p-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
              >
                <FaSignOutAlt className="w-5 h-5 mr-3 flex-shrink-0" />
                <span className="font-medium">Log Out</span>
              </button>
              <Link href="/" className="text-sm text-gray-400 hover:text-pink-500 transition-colors block text-center">
                ← Back to Main Site
              </Link>
          </div>
        </aside>

        {/* --- Main Content --- */}
        <main className="flex-1 p-6 sm:p-8">
          {children} {/* Dashboard, Manage Orders වගේ pages මෙතනට එනවා */}
        </main>

      </div>
    );
  }

  // 4. (Fallback)
  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <FaSpinner className="animate-spin text-pink-600 text-4xl" />
      <p className="ml-3">Redirecting to login...</p>
    </div>
  );
}