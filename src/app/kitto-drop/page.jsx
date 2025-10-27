// app/kitto-drop/page.jsx
'use client';

import React, { useState, useEffect } from 'react'; // Added useEffect
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import LoadingSplash from '@/components/LoadingSplash';

// --- Default Button Data --- (href and title might change based on login)
const defaultDropButtons = [
  { key: 'account', title: 'Create Account', imageSrc: '/kitto-drop-account.png', href: '/kitto-drop/create-account', gradient: 'from-pink-100 via-white to-green-100' },
  { key: 'new_order', title: 'New Order', imageSrc: '/kitto-drop-new-order.png', href: '/kitto-drop/new-order', gradient: 'from-green-100 via-white to-pink-100' },
  { key: 'my_orders', title: 'My Orders', imageSrc: '/kitto-drop-my-orders.png', href: '/kitto-drop/my-orders', gradient: 'from-pink-100 via-white to-green-100' },
  { key: 'commission', title: 'Commission', imageSrc: '/kitto-drop-commission.png', href: '/kitto-drop/commission', gradient: 'from-green-100 via-white to-pink-100' },
];

export default function KittoDropPage() {
  // Loading State
  const [isLoading, setIsLoading] = useState(true);
  // --- Login State ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropButtons, setDropButtons] = useState(defaultDropButtons); // Dynamic button state

  // Check Login Status on Mount
  useEffect(() => {
    // Check localStorage for user data
    const storedUser = localStorage.getItem('kittoDropUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData && userData.id && userData.shopName) {
          setIsLoggedIn(true);
        } else {
            // Invalid data in localStorage, remove it
            localStorage.removeItem('kittoDropUser');
            setIsLoggedIn(false);
        }
      } catch (e) {
        console.error("Error parsing user data from localStorage", e);
        localStorage.removeItem('kittoDropUser');
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }

    // Video Loading Timer
    const timer = setTimeout(() => setIsLoading(false), 4000); // 4 seconds
    return () => clearTimeout(timer);
  }, []); // Run only once on mount

  // Update Buttons based on Login Status
  useEffect(() => {
    if (isLoggedIn) {
      // User is logged in, change the first button
      setDropButtons(prevButtons =>
        prevButtons.map(button =>
          button.key === 'account'
            ? { ...button, title: 'My Account', href: '/kitto-drop/my-account' } // Update title and link
            : button
        )
      );
    } else {
      // User is not logged in, ensure buttons are default
      setDropButtons(defaultDropButtons);
    }
  }, [isLoggedIn]); // Run when login status changes

  // --- Conditional Rendering for Loading ---
  if (isLoading) {
    return <LoadingSplash />;
  }

  // --- Page Content ---
  return (
    <>
      <Header />
      <main className="bg-white min-h-[calc(100vh-150px)] flex flex-col items-center justify-center p-4 sm:p-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-8 sm:mb-10 text-center">
          Welcome to Kitto Drop!
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 w-full max-w-3xl lg:max-w-4xl">
          {dropButtons.map((button) => ( // Use dynamic dropButtons state here
            <Link href={button.href} key={button.title}>
              <div
                className={`
                  p-4 sm:p-6 rounded-xl shadow-lg
                  flex items-center space-x-4
                  bg-gradient-to-br ${button.gradient}
                  animate-gradient
                  transition-transform duration-200 ease-in-out
                  transform hover:scale-[1.03] active:scale-[0.98]
                  cursor-pointer group
                  border border-transparent hover:border-pink-200
                `}
              >
                <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 relative">
                  <Image src={button.imageSrc} alt={`${button.title} icon`} layout="fill" objectFit="contain" priority={true}/>
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  {button.title}
                </h2>
              </div>
            </Link>
          ))}
        </div>
        <p className="mt-8 sm:mt-10 text-center text-gray-600 max-w-lg text-sm sm:text-base">
          Manage your Kitto Drop activities here. Click on an option to proceed.
        </p>
      </main>
      <Footer />
      {/* Global styles needed for animation if not in globals.css */}
      {/* <style jsx global>{` @keyframes gradient-shift { ... } .animate-gradient { ... } `}</style> */}
    </>
  );
}