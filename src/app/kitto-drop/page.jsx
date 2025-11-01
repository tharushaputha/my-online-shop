// app/kitto-drop/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import LoadingSplash from '@/components/LoadingSplash';
// import { FaBoxes } from 'react-icons/fa'; // <-- අයින් කළා, icon එකක් පාවිච්චි කරන්නේ නැති නිසා

// --- Default Button Data ---
const defaultDropButtons = [
  { key: 'account', title: 'Create Account', imageSrc: '/kitto-drop-account.png', href: '/kitto-drop/create-account', gradient: 'from-pink-100 via-white to-green-100' },
  { key: 'new_order', title: 'New Order', imageSrc: '/kitto-drop-new-order.png', href: '/kitto-drop/new-order', gradient: 'from-green-100 via-white to-pink-100' },
  { key: 'my_orders', title: 'My Orders', imageSrc: '/kitto-drop-my-orders.png', href: '/kitto-drop/my-orders', gradient: 'from-pink-100 via-white to-green-100' },
  { key: 'commission', title: 'Commission', imageSrc: '/kitto-drop-commission.png', href: '/kitto-drop/commission', gradient: 'from-green-100 via-white to-pink-100' },
];

export default function KittoDropPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropButtons, setDropButtons] = useState(defaultDropButtons);

  // Check Login Status on Mount (JSON Parse Error Fixed)
  useEffect(() => {
    let userIsValid = false;
    try {
      const storedUser = localStorage.getItem('kittoDropUser');
      // Check if storedUser is a valid JSON string before parsing
      if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') { 
        const userData = JSON.parse(storedUser);
        if (userData && userData.id && userData.shopName) {
          setIsLoggedIn(true);
          userIsValid = true;
        }
      }
    } catch (e) {
      console.error("Error parsing user data, logging out:", e);
      localStorage.removeItem('kittoDropUser'); // Clear invalid data
    }
    
    if (!userIsValid) {
      setIsLoggedIn(false);
    }

    // Video Loading Timer
    const timer = setTimeout(() => setIsLoading(false), 4000); // 4 seconds
    return () => clearTimeout(timer);
  }, []);

  // Update Buttons based on Login Status
  useEffect(() => {
    if (isLoggedIn) {
      setDropButtons(prevButtons =>
        prevButtons.map(button =>
          button.key === 'account'
            ? { ...button, title: 'My Account', href: '/kitto-drop/my-account' }
            : button
        )
      );
    } else {
      setDropButtons(defaultDropButtons);
    }
  }, [isLoggedIn]);

  if (isLoading) {
    return <LoadingSplash />;
  }

  return (
    <>
      <Header />
      <main className="bg-white min-h-[calc(100vh-150px)] flex flex-col items-center justify-center p-4 sm:p-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-8 sm:mb-10 text-center">
          Welcome to Kitto Drop!
        </h1>
        
        {/* Main 4 Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 w-full max-w-3xl lg:max-w-4xl">
          {dropButtons.map((button) => (
            <Link href={button.href} key={button.title}>
              {/* === Button Card Style === */}
              <div
                className={`
                  p-4 sm:p-6 rounded-xl shadow-lg flex items-center space-x-4
                  bg-gradient-to-br ${button.gradient || 'from-gray-100 to-gray-200'} animate-gradient
                  transition-transform duration-200 ease-in-out
                  transform hover:scale-[1.03] active:scale-[0.98]
                  cursor-pointer group border border-transparent hover:border-pink-200
                `}
              >
                <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 relative">
                  {/* ****** 500 Error Fix: priority={true} අයින් කරලා loading="lazy" දැම්මා ****** */}
                  <Image 
                    src={button.imageSrc} 
                    alt={`${button.title} icon`} 
                    layout="fill" 
                    objectFit="contain" 
                    loading="lazy" // 'priority' වෙනුවට 'lazy'
                  />
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  {button.title}
                </h2>
              </div>
            </Link>
          ))}
        </div>

        {/* ====== "View Products" Button (Logged in users only) - UPDATED! ====== */}
        {isLoggedIn && (
          <div className="mt-6 w-full max-w-3xl lg:max-w-4xl">
            <Link
              href="/kitto-drop/view-products"
              // 1. Style එක අනිත් buttons වගේම කළා
              // 2. Syntax Error එක Fix කළා (Comment එක අයින් කළා, අමතර quotes අයින් කළා)
              className="
                p-4 sm:p-6 rounded-xl shadow-lg flex items-center space-x-4
                bg-gradient-to-br from-pink-100 via-white to-green-100 animate-gradient
                transition-transform duration-200 ease-in-out
                transform hover:scale-[1.03] active:scale-[0.98]
                cursor-pointer group border border-transparent hover:border-pink-200
                animate-pulse
              "
              // <-- 3. අලුත් "Click Me" Animation (animate-pulse)
            >
              {/* 2. අලුත් Image Icon එක */}
              <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 relative">
                <Image 
                  src="/kitto-drop-view-products.png" // <-- අලුත් Image Path එක
                  alt="View Products icon" 
                  layout="fill" 
                  objectFit="contain" 
                  loading="lazy"
                />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                View Products
              </h2>
            </Link>
          </div>
        )}
        {/* ========================================================== */}

        <p className="mt-8 sm:mt-10 text-center text-gray-600 max-w-lg text-sm sm:text-base">
          Manage your Kitto Drop activities here. Click on an option to proceed.
        </p>
      </main>
      <Footer />
      {/* Global styles (Make sure .animate-gradient is in globals.css) */}
      {/* <style jsx global>{` ... `}</style> */}
    </>
  );
}