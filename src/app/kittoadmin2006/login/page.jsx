// file: app/kittoadmin2006/login/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient'; // Supabase client එක import කරගන්න
import Image from 'next/image';
import { FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Start as true to check session
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Log වෙලා නම්, කෙලින්ම Dashboard එකට යවන්න
        router.push('/kittoadmin2006');
      } else {
        // Log වෙලා නැත්නම්, loading ඉවරයි, login form එක පෙන්නන්න
        setIsLoading(false);
      }
    };
    checkSession();
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Supabase Auth වලින් log වෙන්න try කරනවා
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (signInError) {
      setError(signInError.message); // Error එක පෙන්නනවා
      setIsLoading(false);
    } else {
      // Login එක සාර්ථකයි!
      setIsLoading(false);
      router.push('/kittoadmin2006'); // Admin Dashboard එකට යවනවා
    }
  };

  // Show a loading screen while checking session
  if (isLoading && !error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
         <FaSpinner className="animate-spin text-pink-600 text-4xl" />
      </div>
    );
  }

  // Show Login Form
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg border border-gray-200">

        {/* Logo */}
        <div className="flex justify-center">
          {/* ඔයාගේ logo path එක /logo.png නෙවෙයි නම් මෙතන වෙනස් කරන්න */}
          <Image src="/logo.png" alt="Kitto Logo" width={120} height={40} priority />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Admin Panel Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-base shadow-sm"
              placeholder="admin@example.com"
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-base shadow-sm"
              placeholder="••••••••"
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-sm text-red-600 text-center flex items-center justify-center gap-1.5">
              <FaExclamationTriangle /> {error}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-pink-600 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg flex items-center justify-center ${
              isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-pink-700'
            }`}
          >
            {isLoading && !error ? <FaSpinner className="animate-spin mr-2" /> : null} {/* Only show spinner on actual login click */}
            {isLoading && !error ? 'Logging In...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
}