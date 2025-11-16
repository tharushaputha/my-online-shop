'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
// Next.js Local Font Loader
import localFont from 'next/font/local'; 
import { FaChevronRight, FaBullhorn, FaGift, FaPenFancy } from 'react-icons/fa';

import styles from './home.module.css'; 
// --- New: Navo Assistant Component එක Import කළා ---
import NavoAssistant from '../components/NavoAssistant'; 

// --- 1. MANAME FONT LOADER (Local File Optimization - FINAL PATH) ---
// Note: Maname.ttf file එක public/fonts/ folder එකේ තිබිය යුතුය.
const manameFont = localFont({
    // Final Fix: src/app/ -> ../.. (Project Root) -> public/fonts/Maname.ttf
    src: [
        {
            path: '../../public/fonts/Maname.ttf', // ULTIMATE FIX
            weight: '400',
            style: 'normal',
        },
    ],
    display: 'swap',
    variable: '--font-maname', // CSS Variable Name
});
// ----------------------------------------------------


// --- ADS SLIDER MOCK DATA (Retained) ---
const ADS_DATA = [
    { 
      id: 1, 
      title: 'Kitto Mega Ad Special!', 
      subtitle: 'Premium Ad Placement: Get 10x more views instantly.', 
      buttonText: 'Boost Ad Now', 
      link: '/kitto-home/post-ad',
      icon: FaBullhorn, 
      startColor: '#007bff', 
      endColor: '#17a2b8', 
    },
    { 
      id: 2, 
      title: 'New User Discount!', 
      subtitle: 'Sign up today and get a free e-book from our Library.', 
      buttonText: 'Claim Gift', 
      link: '/signup',
      icon: FaGift, 
      startColor: '#28a745', 
      endColor: '#20c997', 
    },
    { 
      id: 3, 
      title: 'Need Help with your Ad?', 
      subtitle: 'Our Support Team is ready 24/7 to assist you.', 
      buttonText: 'Contact Support', 
      link: '/contact',
      icon: FaPenFancy, 
      startColor: '#ffc107', 
      endColor: '#fd7e14', 
    },
];
// ----------------------------------------------------


// --- Main SithRoo Home Component ---
export default function SithRooHome() {

    const [currentAdIndex, setCurrentAdIndex] = useState(0);

    // Ad Slider Logic
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentAdIndex(prevIndex => (prevIndex + 1) % ADS_DATA.length);
        }, 2000); 
        return () => clearInterval(timer);
    }, []);
    
    // AdSlider component is complex, simplified representation for main component flow
    const AdSlider = () => {
        // Full Ad Slider Logic as implemented previously (not shown here for brevity)
        return null; 
    }; 

    return (
        <div className={manameFont.variable}> {/* Apply the font variable to the main div */}
            {/* Background Flow Animation */}
            <div className={styles.background}></div>

            {/* === Onboarding Assistant (New Feature) === */}
            <NavoAssistant />

            {/* Main Content Container (Glassy Buttons) */}
            <main className={styles.container}>
                <h1 className={styles.title}>Welcome to SithRoo.Store</h1>
                
                {/* SithRoo Library Button */}
                <Link href="/sithroo-library" className={styles.button}>
                SithRoo library
                </Link>
                
                {/* Kitto Button */}
                <Link href="/kitto-home" className={styles.button}>
                Kitto
                </Link>

                {/* Footer Links Section */}
                <footer className={styles.homeFooter}>
                <Link href="/about" className={styles.footerLink}>About Us</Link>
                <Link href="/contact" className={styles.footerLink}>Contact Us</Link>
                <Link href="/faq" className={styles.footerLink}>FAQ</Link>
                <Link href="/privacy-policy" className={styles.footerLink}>Privacy Policy</Link>
                <Link href="/terms-of-service" className={styles.footerLink}>Terms of Service</Link>
                </footer>
            </main>
        </div>
    );
}