// app/kitto-drop/login/page.jsx
'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation'; // Import useRouter
import { FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

export default function LoginPage() {
  // Form State
  const [shopName, setShopName] = useState(''); // Use Shop Name for login
  const [mobileNumber, setMobileNumber] = useState('');

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter(); // Initialize router

  // Form Submission Logic
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!shopName || !mobileNumber) {
      setError('Please enter both Shop Name and Mobile Number.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if account exists in Supabase
      const { data, error: fetchError } = await supabase
        .from('kitto_drop_accounts')
        .select('id, shop_name') // Select minimal data needed
        .eq('shop_name', shopName)
        .eq('mobile_number', mobileNumber)
        .single(); // Expect only one matching account

      if (fetchError || !data) {
        // Handle errors like 'PGRST116' (No rows found) or other DB errors
        console.error('Login error:', fetchError);
        setError('Invalid Shop Name or Mobile Number. Please check and try again.');
        setIsSubmitting(false);
        return;
      }

      // --- Login Success ---
      console.log('Login successful for:', data.shop_name);

      // Store login state (using localStorage for persistence)
      // WARNING: This is NOT secure authentication. For demo purposes only.
      localStorage.setItem('kittoDropUser', JSON.stringify({
          id: data.id,
          shopName: data.shop_name
      }));

      // Redirect to Kitto Drop main page
      router.push('/kitto-drop');

    } catch (err) {
      console.error('Unexpected error during login:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
        // Only set isSubmitting false if there was an error,
        // otherwise navigation happens.
        // setIsSubmitting(false); // Can cause issues if navigation is fast
    }
  };

  return (
    <>
      <Header />
      {/* White Background */}
      <main className="bg-white min-h-[calc(100vh-150px)] py-10 px-4 flex justify-center items-start">
        <div className="w-full max-w-md bg-gray-50 p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200"> {/* Smaller card */}
          <h1 className="text-3xl font-bold text-primary mb-6 text-center">
            Kitto Drop Login
          </h1>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Input Fields */}
            <div>
              <label htmlFor="shopName" className="block text-sm font-medium text-gray-700 mb-1">Shop Name *</label>
              <input type="text" id="shopName" value={shopName} onChange={(e) => setShopName(e.target.value)} required
                     className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-base shadow-sm"/>
            </div>
            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
              <input type="tel" id="mobileNumber" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} required
                     className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-base shadow-sm"/>
            </div>

            {/* Error Message */}
            {error && (
                <p className="text-sm text-primary text-center flex items-center justify-center">
                    <FaExclamationTriangle className="mr-1.5"/>{error}
                </p>
            )}

            {/* Submit Button */}
            <button type="submit" disabled={isSubmitting}
                    className={`w-full bg-primary text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg flex items-center justify-center ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary'
                    }`}>
              {isSubmitting ? <FaSpinner className="animate-spin mr-2" /> : null}
              {isSubmitting ? 'Logging In...' : 'Log In'}
            </button>
          </form>

          {/* Create Account Link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account yet?{' '}
            <Link href="/kitto-drop/create-account" className="font-medium text-primary hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}