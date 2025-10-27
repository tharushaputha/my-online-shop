// app/kitto-drop/my-account/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
// ******** IMPORT එක මෙතන හදලා තියෙන්නේ ********
import { FaUserCircle, FaStore, FaMapMarkerAlt, FaPhoneAlt, FaSignOutAlt, FaSpinner, FaWhatsapp } from 'react-icons/fa';
// ***********************************************

export default function MyAccountPage() {
  // Fake Data
  const [accountDetails, setAccountDetails] = useState({
    full_name: 'Kitto User',
    mobile_number: '0771234567',
    whatsapp_number: '0771234567',
    shop_name: 'Kitto\'s Cute Shop',
    city: 'Colombo',
    selling_platforms: ['whatsapp', 'facebook'],
    created_at: new Date().toISOString(),
  });
  const [isLoading, setIsLoading] = useState(false);

  // useEffect to load user data (or redirect)
  useEffect(() => {
    const storedUser = localStorage.getItem('kittoDropUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData && userData.shopName) {
          // Fetch real data here later using userData.id
          setAccountDetails(prev => ({ ...prev, shop_name: userData.shopName }));
        } else {
             window.location.href = '/kitto-drop/login';
        }
      } catch (e) {
        console.error("Error loading user data", e);
        window.location.href = '/kitto-drop/login';
      }
    } else {
        window.location.href = '/kitto-drop/login';
    }
  }, []);

  // Logout Function
  const handleLogout = () => {
      localStorage.removeItem('kittoDropUser');
      window.location.href = '/kitto-drop';
  };

  if (isLoading) {
    return ( /* Loading spinner - code bezennna */
        <> <Header /> <main className="bg-white min-h-[calc(100vh-150px)] flex justify-center items-center"> <FaSpinner className="animate-spin text-pink-600 text-4xl" /> </main> <Footer /> </>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-[calc(100vh-150px)] py-10 px-4 flex justify-center items-start">
         <div className="w-full max-w-lg bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
             <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-6 text-center">
               My Kitto Drop Account
             </h1>

             {/* Display Account Details */}
             <div className="space-y-4 text-gray-700">
                <div className="flex items-center">
                    <FaUserCircle className="w-5 h-5 mr-3 text-primary"/>
                    <span><strong>Name:</strong> {accountDetails.full_name}</span>
                </div>
                <div className="flex items-center">
                    <FaStore className="w-5 h-5 mr-3 text-primary"/>
                    <span><strong>Shop:</strong> {accountDetails.shop_name}</span>
                </div>
                 <div className="flex items-center">
                    <FaPhoneAlt className="w-5 h-5 mr-3 text-primary"/>
                    <span><strong>Mobile:</strong> {accountDetails.mobile_number}</span>
                </div>
                 {/* ****** FaWhatsapp මෙතන පාවිච්චි වෙනවා ****** */}
                 {accountDetails.whatsapp_number && (
                    <div className="flex items-center">
                        <FaWhatsapp className="w-5 h-5 mr-3 text-green-500"/>
                        <span><strong>WhatsApp:</strong> {accountDetails.whatsapp_number}</span>
                    </div>
                 )}
                 {/* *************************************** */}
                 <div className="flex items-center">
                    <FaMapMarkerAlt className="w-5 h-5 mr-3 text-pink-500"/>
                    <span><strong>City:</strong> {accountDetails.city}</span>
                </div>
                 {accountDetails.selling_platforms && accountDetails.selling_platforms.length > 0 && (
                     <div>
                         <span className="font-semibold">Selling Platforms:</span>
                         <div className="flex flex-wrap gap-2 mt-1">
                             {accountDetails.selling_platforms.map(p => (
                                 <span key={p} className="bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded-full capitalize">{p}</span>
                             ))}
                         </div>
                     </div>
                 )}
             </div>

             {/* Logout Button */}
             <button
                onClick={handleLogout}
                className="mt-8 w-full bg-red-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center text-lg"
             >
               <FaSignOutAlt className="mr-2"/> Log Out
             </button>

             <Link href="/kitto-drop" className="block mt-4 text-center text-primary hover:underline text-sm">
                ← Back to Kitto Drop
             </Link>
         </div>
      </main>
      <Footer />
    </>
  );
}