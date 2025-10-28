// app/kitto-drop/edit-account/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { FaWhatsapp, FaFacebook, FaTiktok, FaInstagram, FaYoutube, FaTimes, FaSpinner, FaCheckCircle, FaExclamationTriangle, FaSave } from 'react-icons/fa';

// Platform Data (Create Account page එකේ තිබ්බ එකම)
const availablePlatforms = [
  { key: 'whatsapp', name: 'WhatsApp', icon: FaWhatsapp, color: 'text-green-500' },
  { key: 'facebook', name: 'Facebook', icon: FaFacebook, color: 'text-blue-600' },
  { key: 'tiktok', name: 'TikTok', icon: FaTiktok, color: 'text-black' },
  { key: 'instagram', name: 'Instagram', icon: FaInstagram, color: 'text-pink-500' },
  { key: 'youtube', name: 'YouTube', icon: FaYoutube, color: 'text-red-600' },
];

export default function EditAccountPage() {
  // Form State
  const [userId, setUserId] = useState(null); // To store the user's account ID
  const [initialDataLoading, setInitialDataLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState(''); // Usually not editable, but included
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [shopName, setShopName] = useState('');
  const [city, setCity] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  // Fetch Current Data on Mount
  useEffect(() => {
    setError('');
    setInitialDataLoading(true);
    const storedUser = localStorage.getItem('kittoDropUser');
    let fetchedUserId = null;

    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData && userData.id) {
          fetchedUserId = userData.id;
          setUserId(fetchedUserId); // Store the ID
        } else {
          throw new Error("Invalid user data.");
        }
      } catch (e) {
        console.error("Error loading user data", e);
        setError("Could not verify user. Please log in again.");
        // Redirect to login after a delay might be good UX
        setTimeout(() => router.push('/kitto-drop/login'), 2000);
        return;
      }
    } else {
      setError("You need to be logged in to edit your account.");
      setTimeout(() => router.push('/kitto-drop/login'), 2000);
      return;
    }

    // --- Fetch Real Account Data from Supabase ---
    const fetchAccountDetails = async () => {
      if (!fetchedUserId) return;

      const { data, error: fetchError } = await supabase
        .from('kitto_drop_accounts')
        .select('*')
        .eq('id', fetchedUserId)
        .single();

      if (fetchError) {
        console.error("Error fetching account details:", fetchError);
        setError("Could not load your current account details.");
      } else if (data) {
        // Populate the form state with fetched data
        setFullName(data.full_name || '');
        setMobileNumber(data.mobile_number || ''); // Display mobile, maybe disable editing?
        setWhatsappNumber(data.whatsapp_number || '');
        setShopName(data.shop_name || '');
        setCity(data.city || '');
        setSelectedPlatforms(data.selling_platforms || []);
      } else {
          setError("Account data not found.");
      }
      setInitialDataLoading(false);
    };

    fetchAccountDetails();

  }, [router]); // Added router dependency

  // Platform Selection Logic (same as Create Account)
  const handlePlatformToggle = (platformKey) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformKey)
        ? prev.filter(p => p !== platformKey)
        : [...prev, platformKey]
    );
  };

  // Form Submission Logic (Update instead of Insert)
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!userId) {
        setError('User ID not found. Cannot update.');
        return;
    }

    // Basic Validation (similar to create)
    if (!fullName || !shopName || !city) { // Mobile number likely not editable
      setError('Please fill in required fields (Name, Shop Name, City).');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error: updateError } = await supabase
        .from('kitto_drop_accounts')
        .update({ // Use update() instead of insert()
          full_name: fullName,
          // mobile_number: mobileNumber, // Usually don't allow mobile change easily
          whatsapp_number: whatsappNumber || null,
          shop_name: shopName,
          city: city,
          selling_platforms: selectedPlatforms.length > 0 ? selectedPlatforms : null,
        })
        .eq('id', userId) // Specify which row to update using the ID
        .select(); // Optionally get the updated data back

      if (updateError) {
        throw updateError;
      }

      setSuccessMessage('Account details updated successfully!');
      // Maybe disable form or show a timed message before redirecting
      setTimeout(() => {
        router.push('/kitto-drop/my-account'); // Redirect back to My Account
      }, 1500); // Wait 1.5 seconds

    } catch (err) {
      console.error('Error updating account:', err);
      setError(`Failed to update account: ${err.message || 'Please try again.'}`);
    } finally {
      setIsSubmitting(false); // Enable button again only if error or staying on page
    }
  };

  // --- Render Initial Loading State ---
  if (initialDataLoading) {
    return (
        <>
        <Header />
        <main className="bg-white min-h-[calc(100vh-150px)] flex justify-center items-center">
            <FaSpinner className="animate-spin text-pink-600 text-4xl" />
            <p className="ml-3 text-gray-600">Loading your details...</p>
        </main>
        <Footer />
        </>
    );
  }

  // --- Render Error State (if loading failed) ---
   if (error && !userId) { // Show full page error if critical (like no user ID)
     return (
        <>
        <Header />
        <main className="bg-white min-h-[calc(100vh-150px)] flex justify-center items-center p-6 text-center">
             <div className="text-red-600">
                <FaExclamationTriangle className="text-3xl mb-2 mx-auto"/>
                <p>{error}</p>
                <Link href="/kitto-drop/login" className="mt-4 text-pink-600 hover:underline text-sm block">Go to Login</Link>
             </div>
        </main>
        <Footer />
        </>
    );
   }

  // --- Render Page Content (Form) ---
  return (
    <>
      <Header />
      {/* White Background */}
      <main className="bg-white min-h-[calc(100vh-150px)] py-10 px-4 flex justify-center items-start">
        <div className="w-full max-w-2xl bg-gray-50 p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
          <h1 className="text-3xl sm:text-4xl font-bold text-pink-600 mb-6 text-center">
            Edit Account Details
          </h1>

          <form onSubmit={handleUpdate} className="space-y-5">
            {/* Input Fields - Pre-filled */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required
                     className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-base shadow-sm"/>
            </div>

            {/* Mobile Number - Often non-editable, display only or disable */}
            <div>
                <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number (Cannot Change)</label>
                <input type="tel" id="mobileNumber" value={mobileNumber} disabled readOnly // Disable editing
                       className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-500 text-base shadow-sm cursor-not-allowed"/>
            </div>

            <div>
              <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number (Optional)</label>
              <input type="tel" id="whatsappNumber" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)}
                     className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-base shadow-sm"/>
            </div>
            <div>
              <label htmlFor="shopName" className="block text-sm font-medium text-gray-700 mb-1">Your Shop Name *</label>
              <input type="text" id="shopName" value={shopName} onChange={(e) => setShopName(e.target.value)} required
                     className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-base shadow-sm"/>
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <input type="text" id="city" value={city} onChange={(e) => setCity(e.target.value)} required
                     className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-base shadow-sm"/>
            </div>

            {/* Platform Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Selling Platforms (Optional)</label>
              <div className="flex flex-wrap gap-3">
                {availablePlatforms.map(platform => (
                  <button type="button" key={platform.key} onClick={() => handlePlatformToggle(platform.key)}
                          className={`p-2 border rounded-full flex items-center justify-center transition-all duration-150 ${
                            selectedPlatforms.includes(platform.key)
                              ? 'border-pink-500 bg-pink-50 ring-2 ring-pink-300'
                              : 'border-gray-300 bg-white hover:bg-gray-50'
                          }`}>
                    <platform.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${platform.color}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Display Selected Platforms */}
            {selectedPlatforms.length > 0 && (
              <div className="pt-2">
                <p className="text-sm font-medium text-gray-700 mb-2">Selected:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedPlatforms.map(platformKey => { /* ... (display logic - code bezennna) ... */
                     const platform = availablePlatforms.find(p => p.key === platformKey); if (!platform) return null; return ( <div key={platformKey} className="flex items-center bg-gray-200 text-gray-700 text-xs sm:text-sm font-medium px-2.5 py-1 rounded-full"> <platform.icon className={`w-3 h-3 sm:w-4 sm:h-4 mr-1.5 ${platform.color}`} /> {platform.name} <button type="button" onClick={() => handlePlatformToggle(platformKey)} className="ml-1.5 text-gray-400 hover:text-gray-600"> <FaTimes size={12}/> </button> </div> );
                  })}
                </div>
              </div>
            )}

            {/* Error/Success Messages */}
            {error && <p className="text-sm text-red-600 text-center flex items-center justify-center"><FaExclamationTriangle className="mr-1.5"/>{error}</p>}
            {successMessage && <p className="text-sm text-green-600 text-center flex items-center justify-center"><FaCheckCircle className="mr-1.5"/>{successMessage}</p>}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button type="submit" disabled={isSubmitting || successMessage} // Disable if success to prevent double submit before redirect
                        className={`w-full sm:flex-1 bg-pink-600 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg flex items-center justify-center ${
                          isSubmitting || successMessage ? 'opacity-70 cursor-not-allowed' : 'hover:bg-pink-700'
                        }`}>
                  {isSubmitting ? <FaSpinner className="animate-spin mr-2" /> : <FaSave className="mr-2" />}
                  {isSubmitting ? 'Saving...' : successMessage ? 'Saved!' : 'Save Changes'}
                </button>
                <Link href="/kitto-drop/my-account"
                      className="w-full sm:w-auto text-center px-6 py-3 border border-gray-300 text-gray-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-lg">
                    Cancel
                </Link>
            </div>
          </form>
        </div>
      </main>
      <Footer />
       {/* Helper CSS */}
       <style jsx global>{` .modal-list-scroll::-webkit-scrollbar { width: 6px; } .modal-list-scroll::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 3px;} .modal-list-scroll::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px;} .modal-list-scroll::-webkit-scrollbar-thumb:hover { background: #9ca3af; } `}</style>
    </>
  );
}