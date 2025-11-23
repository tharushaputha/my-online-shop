// app/kitto-drop/my-account/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import {
  FaUserCircle, FaStore, FaMapMarkerAlt, FaPhoneAlt, FaSignOutAlt,
  FaSpinner, FaInfoCircle, FaCheckCircle, FaGift, FaWhatsapp,
  FaPaw, FaTasks, FaUserEdit, FaUniversity
} from 'react-icons/fa';

// --- 1. Mock Data සහ Logic වෙනස් කිරීම ---

// Sample User Level Logic (මේක තාම Mock එකක්, පස්සේ මේකත් DB එකෙන් ගන්න පුළුවන්)
const getUserLevel = (orderCount) => {
    // orderCount එක 0 නම් හෝ නැත්නම් Bronze එක දෙන්න
    const count = orderCount || 0;
    if (count >= 100) return { name: 'Gold Dropper 🥇', color: 'text-yellow-500' };
    if (count >= 25) return { name: 'Silver Dropper 🥈', color: 'text-gray-400' };
    return { name: 'Bronze Dropper 🥉', color: 'text-orange-400' };
};

export default function MyAccountPage() {
  // State
  const [accountDetails, setAccountDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // --- 2. අලුත් stats State එකක් හදමු (Default අගයන් 0 යි) ---
  // Points Goal එක දැනට අපි Hardcode කරලා තියමු.
  const [stats, setStats] = useState({
      totalEarnings: 0.00,
      ordersToday: 0,
      ordersThisMonth: 0,
      topItem: 'Not yet available', // තාම විකුණලා නැත්නම්
      kittoPoints: 0,
      pointsGoal: 100
  });

  // Fetch User Data
  useEffect(() => {
    setIsLoading(true);
    setError('');
    const storedUser = localStorage.getItem('kittoDropUser');
    let userId = null;
    if (storedUser) {
        try {
            const userData = JSON.parse(storedUser);
            if (userData && userData.id) {
                userId = userData.id;
            } else {
                throw new Error("Invalid user data.");
            }
        } catch (e) {
            console.error("Error loading user data", e);
            window.location.href = '/kitto-drop/login';
            return;
        }
    } else {
        window.location.href = '/kitto-drop/login';
        return;
    }

    const fetchAccountDetails = async () => {
        if (!userId) return;

        // --- 3. Database එකෙන් අලුත් columns ටිකත් එක්කම data ගන්නවා ---
        const { data, error: fetchError } = await supabase
            .from('kitto_drop_accounts')
            .select('*') // '*' දැම්මම අලුත් columns ටිකත් එනවා
            .eq('id', userId)
            .single();

        if (fetchError) {
            console.error("Fetch error:", fetchError);
            setError("Could not load details.");
        } else if (data) {
            setAccountDetails(data);

            // --- 4. Database එකෙන් ආපු Data වලින් stats state එක update කරනවා ---
            // data.total_earnings, data.orders_this_month වගේ නම් වලින් තමයි එන්නේ (Snake case)
            setStats(prevStats => ({
                ...prevStats,
                totalEarnings: data.total_earnings || 0.00,
                ordersToday: data.orders_today || 0,
                ordersThisMonth: data.orders_this_month || 0,
                topItem: data.top_item_name || 'Not yet available',
                kittoPoints: data.kitto_points || 0,
                // pointsGoal එක තාම static තියමු
            }));

        } else {
            setError("Account not found.");
            localStorage.removeItem('kittoDropUser');
            window.location.href = '/kitto-drop/login';
        }
        setIsLoading(false);
    };

    fetchAccountDetails();
  }, []);

  // Logout
  const handleLogout = () => { localStorage.removeItem('kittoDropUser'); window.location.href = '/kitto-drop'; };

  // Calculate user level and points percentage based on real data
  const userLevel = getUserLevel(stats.ordersThisMonth);
  const pointsPercentage = Math.min((stats.kittoPoints / stats.pointsGoal) * 100, 100);

  // --- Render Loading ---
  if (isLoading) { return ( <> <Header /> <main className="bg-white min-h-[calc(100vh-150px)] flex justify-center items-center"> <FaSpinner className="animate-spin text-primary text-4xl" /> </main> <Footer /> </> ); }
  // --- Render Error ---
   if (error) { return ( <> <Header /> <main className="bg-white min-h-[calc(100vh-150px)] flex justify-center items-center p-6 text-center"> <div className="text-red-600"> <FaInfoCircle className="text-3xl mb-2 mx-auto"/> <p>{error}</p> <Link href="/kitto-drop" className="mt-4 text-pink-600 hover:underline text-sm block">Go Back</Link> </div> </main> <Footer /> </> ); }
  // --- Render Details ---
  if (!accountDetails) { return ( <> <Header /> <main className="bg-white min-h-[calc(100vh-150px)] flex justify-center items-center"> Loading... </main> <Footer /> </> ); }


  return (
    <>
      <Header />
      {/* Light Gray BG */}
      <main className="bg-gray-50 min-h-[calc(100vh-150px)] py-6 sm:py-10 px-4">
         <div className="max-w-4xl mx-auto">

            {/* Header Section */}
            <div className="text-center mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-1 sm:mb-2"> Drop Shop: <span className="text-primary">{accountDetails.shop_name}</span> </h1>
                <span className={`text-base sm:text-lg font-medium ${userLevel.color}`}>{userLevel.name}</span>
            </div>

            {/* Grid for Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">

                {/* --- Left Column (Stats & Points) --- */}
                <div className="lg:col-span-2 space-y-5 sm:space-y-6">
                    {/* ===== Stats Card (Updated with Real Data) ===== */}
                    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-100">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">Performance</h2>
                        <div className="grid grid-cols-2 gap-4 text-center">
                            {/* toFixed(2) දාන්නේ දශම ස්ථාන දෙකක් පෙන්වන්න */}
                            <div> <p className="text-xl sm:text-2xl font-bold text-primary">Rs. {stats.totalEarnings.toFixed(2)}</p> <p className="text-xs sm:text-sm text-gray-500">Total Earnings</p> </div>
                            <div> <p className="text-xl sm:text-2xl font-bold text-primary">{stats.ordersToday}</p> <p className="text-xs sm:text-sm text-gray-500">Orders Today</p> </div>
                            <div> <p className="text-xl sm:text-2xl font-bold text-primary">{stats.ordersThisMonth}</p> <p className="text-xs sm:text-sm text-gray-500">Orders This Month</p> </div>
                            <div className="col-span-2 mt-2"> <p className="text-base sm:text-lg font-medium text-gray-700">🔥 <span className="font-semibold">Top Item:</span> {stats.topItem}</p> </div>
                        </div>
                        <div className="mt-4 text-right"> <Link href="/kitto-drop/my-orders" className="text-xs sm:text-sm text-primary hover:underline font-medium">View My Orders →</Link> </div>
                    </div>
                    {/* ==================================== */}

                    {/* ===== Kitto Points Card (Updated with Real Data) ===== */}
                    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-100">
                          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 flex items-center"> <FaPaw className="text-pink-500 mr-2"/> Kitto Points </h2>
                          <div className="flex items-center justify-between mb-2">
                              {/* Points 0 නම් 0 විදිහට පෙන්වයි */}
                              <span className="text-xl sm:text-2xl font-bold text-pink-600">{stats.kittoPoints} <span className="text-sm font-normal text-gray-500">/ {stats.pointsGoal}</span></span>
                              <span className="text-xs text-gray-500 font-medium">(100 Points = Rs. 1000)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 overflow-hidden mb-4">
                              {/* Percentage 0 නම් bar එක පිරෙන්නේ නෑ */}
                              <div className="bg-gradient-to-r from-green-300 to-pink-400 h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${pointsPercentage}%` }}></div>
                          </div>
                          {/* Points මදි නම් Button එක Disable වෙයි */}
                          <button disabled={stats.kittoPoints < stats.pointsGoal} className={`w-full sm:w-auto px-5 py-2 rounded-lg text-white font-semibold transition-colors flex items-center justify-center text-sm sm:text-base ${ stats.kittoPoints >= stats.pointsGoal ? 'bg-primary hover:primary' : 'bg-gray-400 cursor-not-allowed' }`}> <FaGift className="mr-2 h-4 w-4"/> Redeem Points </button>
                    </div>
                    {/* ========================================= */}

                      {/* ===== Daily Task Card (No Change Here Yet) ===== */}
                      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-100">
                          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 flex items-center"><FaTasks className="text-blue-500 mr-2"/> Daily Task</h2>
                          <p className="text-sm sm:text-base text-gray-600 mb-3">Complete a simple task each day to earn bonus Kitto Points!</p>
                          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-dashed border-gray-300 flex flex-col sm:flex-row justify-between items-center gap-2">
                            <p className="text-xs sm:text-sm font-medium text-center sm:text-left">Share your top-selling item on Facebook</p>
                            <button className="bg-blue-500 text-white text-xs px-3 py-1.5 rounded hover:bg-blue-600 w-full sm:w-auto flex-shrink-0">Complete Task (+5 Points)</button>
                          </div>
                    </div>
                    {/* ====================================== */}

                </div> {/* --- End Left Column --- */}

                {/* --- Right Column (Account & Bank) --- */}
                <div className="space-y-5 sm:space-y-6">
                    {/* ===== Account Details Card (No Change Here) ===== */}
                     <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-100">
                          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">Account Details</h2>
                          <div className="space-y-3 text-gray-600 text-xs sm:text-sm mb-4">
                              <p className="flex items-center"><FaUserCircle className="w-4 h-4 mr-2 text-primary flex-shrink-0"/><strong>Name:</strong> <span className="ml-1 truncate">{accountDetails.full_name}</span></p>
                              <p className="flex items-center"><FaPhoneAlt className="w-4 h-4 mr-2 text-primary flex-shrink-0"/><strong>Mobile:</strong> <span className="ml-1 truncate">{accountDetails.mobile_number}</span></p>
                              {accountDetails.whatsapp_number && <p className="flex items-center"><FaWhatsapp className="w-4 h-4 mr-2 text-green-500 flex-shrink-0"/><strong>WhatsApp:</strong> <span className="ml-1 truncate">{accountDetails.whatsapp_number}</span></p>}
                              <p className="flex items-center"><FaMapMarkerAlt className="w-4 h-4 mr-2 text-primary flex-shrink-0"/><strong>City:</strong> <span className="ml-1 truncate">{accountDetails.city}</span></p>
                              {accountDetails.selling_platforms && accountDetails.selling_platforms.length > 0 && (
                                  <div>
                                      <span className="font-semibold text-xs sm:text-sm">Platforms:</span>
                                      <div className="flex flex-wrap gap-1.5 mt-1">
                                          {accountDetails.selling_platforms.map(p => ( <span key={p} className="bg-gray-200 text-gray-700 text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full capitalize">{p}</span> ))}
                                      </div>
                                  </div>
                              )}
                          </div>
                          <Link href="/kitto-drop/edit-account" className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-primary text-primary text-xs sm:text-sm font-medium rounded-md hover:bg-pink-50 transition-colors"> <FaUserEdit className="mr-1.5 h-4 w-4"/> Edit Details </Link>
                     </div>
                     {/* ========================================= */}

                    {/* ===== Bank Details Card (Still using Fake Data for now) ===== */}
                    {/* Bank Details ටික database එකෙන් එනකම් මේ විදිහට තියමු */}
                     <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-100">
                          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">Bank Account</h2>
                          <div className="text-gray-600 text-xs sm:text-sm mb-4">
                             {/* TODO: Replace with real bank details from DB */}
                             <p><strong>Bank:</strong> Sampath Bank</p> {/* Fake Data */}
                             <p><strong>Account No:</strong> **** **** **** 1234</p> {/* Fake Data */}
                          </div>
                          <Link
                            href="/kitto-drop/manage-bank"
                            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-primary text-primary text-xs sm:text-sm font-medium rounded-md hover:bg-pink-50 transition-colors"
                          >
                              <FaUniversity className="mr-1.5 h-4 w-4"/> Manage Bank Details
                          </Link>
                     </div>
                     {/* =============================================== */}

                     {/* ===== Logout Button Card (No Change) ===== */}
                     <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-100">
                          <button onClick={handleLogout} className="w-full bg-red-500 text-white font-semibold py-2.5 sm:py-3 px-6 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center text-sm sm:text-base"> <FaSignOutAlt className="mr-2"/> Log Out </button>
                     </div>
                     {/* ======================================== */}

                     {/* Back Link */}
                     <Link href="/kitto-drop" className="block mt-4 text-center text-primary hover:underline text-xs sm:text-sm"> ← Back to Kitto Drop </Link>

                </div> {/* --- End Right Column --- */}

            </div> {/* End Grid */}
         </div> {/* End Max Width Container */}
      </main>
      <Footer />

       {/* Helper CSS */}
       <style jsx global>{` .modal-list-scroll::-webkit-scrollbar { width: 6px; } .modal-list-scroll::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 3px;} .modal-list-scroll::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px;} .modal-list-scroll::-webkit-scrollbar-thumb:hover { background: #9ca3af; } `}</style>
    </>
  );
}