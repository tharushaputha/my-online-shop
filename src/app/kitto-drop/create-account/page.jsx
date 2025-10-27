// app/kitto-drop/create-account/page.jsx
'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient'; // Supabase client import
import { FaWhatsapp, FaFacebook, FaTiktok, FaInstagram, FaYoutube, FaTimes, FaSpinner, FaCheckCircle } from 'react-icons/fa'; // Icons

// Platform Data
const availablePlatforms = [
  { key: 'whatsapp', name: 'WhatsApp', icon: FaWhatsapp, color: 'text-green-500' },
  { key: 'facebook', name: 'Facebook', icon: FaFacebook, color: 'text-blue-600' },
  { key: 'tiktok', name: 'TikTok', icon: FaTiktok, color: 'text-black' }, // Requires specific TikTok icon if available
  { key: 'instagram', name: 'Instagram', icon: FaInstagram, color: 'text-pink-500' },
  { key: 'youtube', name: 'YouTube', icon: FaYoutube, color: 'text-red-600' },
  // Add more platforms if needed
];

export default function CreateAccountPage() {
  // Form State
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [shopName, setShopName] = useState('');
  const [city, setCity] = useState(''); // Consider using a dropdown/search later
  const [selectedPlatforms, setSelectedPlatforms] = useState([]); // Stores keys like ['whatsapp', 'facebook']

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Platform Selection Logic
  const handlePlatformToggle = (platformKey) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformKey)
        ? prev.filter(p => p !== platformKey) // Remove if already selected
        : [...prev, platformKey] // Add if not selected
    );
  };

  // Form Submission Logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Basic Validation
    if (!fullName || !mobileNumber || !shopName || !city) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error: insertError } = await supabase
        .from('kitto_drop_accounts') // Your table name
        .insert([
          {
            full_name: fullName,
            mobile_number: mobileNumber,
            whatsapp_number: whatsappNumber || null, // Send null if empty
            shop_name: shopName,
            city: city,
            selling_platforms: selectedPlatforms.length > 0 ? selectedPlatforms : null, // Send null if empty
            // user_id: session?.user?.id || null // If using authentication
          }
        ])
        .select(); // Optionally select the inserted data

      if (insertError) {
        throw insertError;
      }

      setSuccessMessage('Account created successfully!');
      // Optionally clear the form or redirect
      // setFullName(''); setMobileNumber(''); setWhatsappNumber(''); setShopName(''); setCity(''); setSelectedPlatforms([]);
      // router.push('/kitto-drop/success'); // Example redirect

    } catch (err) {
      console.error('Error creating account:', err);
      setError(`Failed to create account: ${err.message || 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      {/* White Background for the page */}
      <main className="bg-white min-h-[calc(100vh-150px)] py-10 px-4 flex justify-center items-start">
        <div className="w-full max-w-2xl bg-gray-50 p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200"> {/* Light gray card */}
          <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-6 text-center">
            Create Kitto Drop Account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input Fields */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name </label>
              <input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required
                     className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-base shadow-sm"/>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number </label>
                <input type="tel" id="mobileNumber" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} required
                       className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-base shadow-sm"/>
              </div>
              <div>
                <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number (Optional)</label>
                <input type="tel" id="whatsappNumber" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)}
                       className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-base shadow-sm"/>
              </div>
            </div>
            <div>
              <label htmlFor="shopName" className="block text-sm font-medium text-gray-700 mb-1">Your Shop Name </label>
              <input type="text" id="shopName" value={shopName} onChange={(e) => setShopName(e.target.value)} required
                     className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-base shadow-sm"/>
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City </label>
              <input type="text" id="city" value={city} onChange={(e) => setCity(e.target.value)} required
                     className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-base shadow-sm"/>
              {/* TODO: Replace with a city dropdown/search component later for better UX */}
            </div>

            {/* Platform Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Selling Platforms (Optional)</label>
              <div className="flex flex-wrap gap-3">
                {availablePlatforms.map(platform => (
                  <button type="button" key={platform.key} onClick={() => handlePlatformToggle(platform.key)}
                          className={`p-2 border rounded-full flex items-center justify-center transition-all duration-150 ${
                            selectedPlatforms.includes(platform.key)
                              ? 'border-primary bg-pink-50 ring-2 ring-pink-300' // Selected style
                              : 'border-gray-300 bg-white hover:bg-gray-50' // Default style
                          }`}>
                    <platform.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${platform.color}`} /> {/* Icon */}
                  </button>
                ))}
              </div>
            </div>

            {/* Display Selected Platforms */}
            {selectedPlatforms.length > 0 && (
              <div className="pt-2">
                <p className="text-sm font-medium text-gray-700 mb-2">Selected:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedPlatforms.map(platformKey => {
                    const platform = availablePlatforms.find(p => p.key === platformKey);
                    if (!platform) return null;
                    return (
                      <div key={platformKey} className="flex items-center bg-gray-200 text-gray-700 text-xs sm:text-sm font-medium px-2.5 py-1 rounded-full">
                        <platform.icon className={`w-3 h-3 sm:w-4 sm:h-4 mr-1.5 ${platform.color}`} />
                        {platform.name}
                        <button type="button" onClick={() => handlePlatformToggle(platformKey)} className="ml-1.5 text-gray-400 hover:text-gray-600">
                          <FaTimes size={12}/>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Error/Success Messages */}
            {error && <p className="text-sm text-primary text-center">{error}</p>}
            {successMessage && <p className="text-sm text-green-600 text-center flex items-center justify-center"><FaCheckCircle className="mr-1.5"/>{successMessage}</p>}

            {/* Submit Button */}
            <button type="submit" disabled={isSubmitting}
                    className={`w-full bg-primary text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg flex items-center justify-center ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary'
                    }`}>
              {isSubmitting ? <FaSpinner className="animate-spin mr-2" /> : null}
              {isSubmitting ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have a Kitto Drop account?{' '}
            <Link href="/kitto-drop/login" className="font-medium text-primary hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}