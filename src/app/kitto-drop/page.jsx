// app/kitto-drop/page.jsx
'use client'; // State use කරන නිසා

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoadingSplash from '@/components/LoadingSplash'; // Video Splash component එක import කරන්න

// Style constants (Background එකට විතරක් තියාගමු)
const MINT_GREEN_BG = '#F0FFF4'; // Or your preferred BG color
// const HEADING_PINK = '#db2777'; // pink-600 - Removed, using Tailwind class now

export default function KittoDropPage() {
  // Loading State
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Video එකේ duration එකට ගැලපෙන්න time එක adjust කරන්න (e.g., 4 seconds)
    const timer = setTimeout(() => {
      setIsLoading(false); // Loading ඉවරයි
    }, 4000); // Adjust this time (in milliseconds)

    return () => clearTimeout(timer); // Cleanup
  }, []); // එක පාරයි run වෙන්නේ

  // Conditional Rendering
  if (isLoading) {
    // Loading නම්, Video Splash එක පෙන්නන්න
    return <LoadingSplash />;
  }

  // Loading ඉවර නම්, "Coming Soon" content එක පෙන්නන්න
  return (
    <>
      <Header />
      {/* Background color එක inline style එකෙන් දැම්මා */}
      <main style={{ backgroundColor: MINT_GREEN_BG }} className="min-h-[calc(100vh-150px)] flex justify-center items-center p-10"> {/* Adjusted height calculation might be needed based on actual Header/Footer height */}
        {/* Tailwind classes for styling the card */}
        <div className="text-center bg-white p-8 sm:p-12 rounded-2xl shadow-xl max-w-lg"> {/* Adjusted padding & rounded corners */}
          {/* ****** TITLE COLOR CHANGED HERE ****** */}
          <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-5"> {/* Used text-primary class */}
            Kitto Drop
          </h1>
          {/* ************************************** */}
          <p className="text-xl sm:text-2xl text-gray-700 mb-6"> {/* Adjusted text size & color */}
            Coming Soon! 🚀
          </p>
          <p className="text-base sm:text-lg text-gray-500"> {/* Adjusted text size & color */}
            Stay tuned for exciting new features!
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}