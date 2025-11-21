// src/components/Dashboard.jsx
'use client';

import React from 'react';
import Image from "next/image";
import Link from "next/link";
import { supabase } from '@/lib/supabaseClient';

const Dashboard = ({ user }) => {

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  // Footer Button Style (No Changes)
  const footerLinkStyle = "text-gray-600 hover:text-blue-600 font-medium text-sm md:text-base transition-colors duration-300 py-2 px-2";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 font-sans text-gray-800 overflow-x-hidden relative">
      
      {/* Background Blurs (No Changes) */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-300/20 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-0 right-[-10%] w-[400px] h-[400px] bg-purple-300/20 rounded-full blur-[120px] -z-10"></div>

      {/* === HEADER SECTION (No Changes) === */}
      <header className="w-full bg-blue-600/90 backdrop-blur-lg py-6 px-6 md:px-12 flex justify-between items-center shadow-lg relative z-50 h-24">
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-wider drop-shadow-lg">
          SithRoo
        </h1>
        <button 
          onClick={handleLogout}
          className="bg-white/20 hover:bg-white/30 text-white text-sm md:text-base font-semibold py-2 px-6 rounded-full transition-colors backdrop-blur-sm border border-white/20"
        >
          Logout
        </button>
      </header>

      <main className="container mx-auto px-6 py-12 md:py-16 max-w-5xl relative z-10">
        
        {/* === වෙනස්කම 1: HERO CARD එක "Ultra-Thin" කළා === */}
        {/* - bg-white/5: Background එක ගොඩක්ම අඩු කළා (බොහොම සියුම්).
           - p-4 md:p-6: Padding එක තවත් අඩු කළා.
           - shadow-none: Shadow එක සම්පූර්ණයෙන්ම අයින් කළා.
           - border-white/10: Border එක චුට්ටක් පැහැදිලි කළා shape එක පේන්න.
        */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-4 md:p-6 border border-white/10 flex flex-col-reverse md:flex-row items-center justify-between gap-6 mb-16 relative overflow-hidden animate-fade-in-up">
          
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[250px] h-[250px] bg-blue-200/10 rounded-full blur-[80px] -z-10"></div>
          
          {/* Left Text Content (No Changes) */}
          <div className="w-full md:w-1/2 text-center md:text-left space-y-5 z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight drop-shadow-sm whitespace-nowrap">
              Welcome <span className="text-blue-600 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">to SithRoo</span>
            </h2>
            <p className="text-base md:text-lg text-gray-700 font-medium max-w-md mx-auto md:mx-0 leading-relaxed">
              Your trusted digital ecosystem. Explore our services and discover a world of possibilities.
            </p>
            <div className="pt-3">
                <a href="#miniwebs-section" className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-md transform transition hover:scale-105 duration-300 text-sm md:text-base">
                  Start Exploring
                </a>
            </div>
          </div>

          {/* Right Image Content (No Changes) */}
          <div className="w-full md:w-1/2 flex items-center justify-center relative z-10">
             <div className="relative w-[280px] h-[380px] md:w-[500px] md:h-[600px]">
               <Image
                 src="/dashboard-character.png" 
                 alt="SithRoo Dashboard Character"
                 fill
                 className="object-contain object-center drop-shadow-[0_15px_40px_rgba(0,0,0,0.25)]"
                 priority
               />
             </div>
          </div>

        </div>


        {/* === MINIWEBS CARDS SECTION === */}
        <div id="miniwebs-section" className="animate-fade-in-up animation-delay-200 pt-4">
          <h3 className="text-3xl font-black text-gray-900 mb-8 text-center md:text-left drop-shadow-sm">MiniWebs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* --- Card 1: SithRoo Library --- */}
            <Link href="/sithroo-library" className="group">
              <div className="bg-white/70 backdrop-blur-lg rounded-[2.5rem] p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/60 flex flex-col items-center text-center h-full transform group-hover:-translate-y-3 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <h4 className="text-2xl font-bold text-gray-800 mb-6 relative z-10">SithRoo Library</h4>
                
                {/* === වෙනස්කම 2: Library Placeholder Emoji === */}
                {/* Image එක අයින් කරලා Emoji දැම්මා */}
                <div className="relative w-36 h-36 mb-6 bg-purple-100/50 rounded-[2rem] flex items-center justify-center p-4 backdrop-blur-sm shadow-inner group-hover:scale-110 transition-transform duration-500 z-10">
                   <span className="text-6xl drop-shadow-md">📚</span>
                </div>

                <span className="relative z-10 bg-white/50 border-2 border-purple-200 group-hover:border-purple-500 group-hover:bg-purple-500 group-hover:text-white text-purple-700 font-bold py-3 px-8 rounded-2xl transition-all duration-300 shadow-sm text-sm">
                  Explore Library
                </span>
              </div>
            </Link>

            {/* --- Card 2: Kitto --- */}
            <Link href="/kitto-home" className="group">
              <div className="bg-white/70 backdrop-blur-lg rounded-[2.5rem] p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/60 flex flex-col items-center text-center h-full transform group-hover:-translate-y-3 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <h4 className="text-2xl font-bold text-gray-800 mb-6 relative z-10">Kitto</h4>

                {/* === වෙනස්කම 3: Kitto Image Rounded Fix === */}
                {/* Container එකට overflow-hidden දැම්මා. Image එකට object-cover දැම්මා box එක පිරෙන්න. */}
                <div className="relative w-36 h-36 mb-6 bg-orange-100/50 rounded-[2rem] flex items-center justify-center overflow-hidden backdrop-blur-sm shadow-inner group-hover:scale-110 transition-transform duration-500 z-10">
                   <Image 
                     src="/mini-kitto.png" 
                     alt="Kitto Icon" 
                     fill 
                     className="object-cover" // Box එක පුරාම පැතිරෙන්න
                   />
                </div>

                <span className="relative z-10 bg-white/50 border-2 border-orange-200 group-hover:border-orange-500 group-hover:bg-orange-500 group-hover:text-white text-orange-700 font-bold py-3 px-8 rounded-2xl transition-all duration-300 shadow-sm text-sm">
                  Discover Kitto
                </span>
              </div>
            </Link>
          </div>
        </div>

      </main>

      {/* === FOOTER NAVIGATION (No Changes) === */}
      <footer className="w-full py-8 relative z-10 mt-10">
        <div className="container mx-auto px-6 flex justify-center">
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 items-center">
            <Link href="/about" className={footerLinkStyle}>About Us</Link>
            <Link href="/contact" className={footerLinkStyle}>Contact Us</Link>
            <Link href="/faq" className={footerLinkStyle}>FAQ</Link>
            <Link href="/privacy-policy" className={footerLinkStyle}>Privacy Policy</Link>
            <Link href="/terms-of-service" className={footerLinkStyle}>Terms of Service</Link>
          </div>
        </div>
        <p className="text-center text-gray-500 text-sm mt-8 font-medium px-4">
          © {new Date().getFullYear()} SithRoo.Store. All rights reserved.
        </p>
      </footer>

    </div>
  );
};

export default Dashboard;