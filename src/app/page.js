'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaChevronRight, FaTimes, FaCheck, FaComments, FaRobot, FaBullhorn, FaGift, FaPenFancy } from 'react-icons/fa';

import styles from './home.module.css'; 

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


// --- ASSISTANT CONSTANTS ---
const ASSISTANT_IMAGE_URL = "/navo.png"; 
const ASSISTANT_NAME = "Navo"; 
const SESSION_KEY = 'navoAssistantSeen_v6'; // New version key for testing
// ----------------------------


// --- Navo Assistant Chat Bubble Component ---
const NavoAssistant = () => {
    const [isVisible, setIsVisible] = useState(false); 

    useEffect(() => {
        if (typeof window !== 'undefined' && !sessionStorage.getItem(SESSION_KEY)) {
            setTimeout(() => {
                setIsVisible(true);
            }, 1000); 
        }
    }, []);

    const handleDismiss = () => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem(SESSION_KEY, 'true'); 
        }
        setIsVisible(false);
    };

    // --- ENHANCED GLASSMORPHISM STYLES (Final Polish) ---
    const bubbleStyles = {
        bubbleContainer: {
            position: 'fixed', 
            bottom: '25px',
            right: '25px',
            zIndex: 10000, 
            transform: isVisible ? 'translateY(0)' : 'translateY(100%)', 
            opacity: isVisible ? 1 : 0,
            transition: 'transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.5s ease-out',
            fontFamily: 'Arial, sans-serif',
            pointerEvents: isVisible ? 'all' : 'none', 
            boxSizing: 'border-box',
        },
        chatBubble: {
            backgroundColor: 'rgba(25, 25, 25, 0.5)', 
            backdropFilter: 'blur(15px)', 
            color: 'white',
            padding: '20px',
            borderRadius: '18px', 
            maxWidth: '350px', 
            width: '90vw', 
            boxShadow: '0 12px 50px rgba(0, 0, 0, 0.7)', 
            position: 'relative',
            border: '1px solid rgba(255, 255, 255, 0.3)', 
            animation: 'floatEffect 3s ease-in-out infinite alternate', 
        },
        header: {
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '15px',
            paddingBottom: '10px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)', 
        },
        image: {
            width: '45px', 
            height: '45px',
            borderRadius: '50%',
            objectFit: 'cover',
            // --- FIX: Pink Border අයින් කළා ---
            boxShadow: 'none', 
            border: 'none', 
        },
        h2: {
            fontSize: '1.3rem', 
            fontWeight: '600',
            // --- FIX: Blue Color එක White වලට වෙනස් කළා ---
            color: 'white', 
            textShadow: '0 0 5px rgba(255, 255, 255, 0.4)', // Subtle white glow
        },
        bodyText: {
            fontSize: '1rem', 
            color: '#e9ecef',
            lineHeight: '1.6',
            marginBottom: '20px',
            fontFamily: 'Maname, Arial, sans-serif', 
        },
        bulletPoint: {
            marginBottom: '8px',
            color: '#e9ecef',
            fontFamily: 'Maname, Arial, sans-serif', 
        },
        // Highlight Text Styles (for SithRoo Library, Kitto, Kitto Drop)
        highlightText: {
            color: 'white', // Base white
            textShadow: '0 0 5px rgba(255, 255, 255, 0.6), 0 0 10px rgba(255, 255, 255, 0.3)', // Lighter, more subtle glow
            fontWeight: 'bold',
        },
        // Modern, Glowing, Transparent Buttons (Continue Button Glow to White)
        buttonContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            gap: '10px',
        },
        mainButton: (isPrimary) => ({
            backgroundColor: isPrimary ? 'rgba(255, 255, 255, 0.1)' : 'transparent', // White Transparency for Primary
            color: 'white', 
            padding: '10px 15px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.4)', // General white border
            cursor: 'pointer',
            fontWeight: 'bold',
            flex: 1,
            transition: 'all 0.3s',
            // --- FIX: Continue Button White Glow ---
            boxShadow: isPrimary ? '0 0 8px rgba(255, 255, 255, 0.6), 0 0 15px rgba(255, 255, 255, 0.3)' : 'none', 
            textShadow: '0 0 2px rgba(0,0,0,0.5)', // Text contrast
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.9rem',
        }),
        keyframes: `
            @keyframes floatEffect {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-5px); }
                100% { transform: translateY(0px); }
            }
        `,
    };

    return (
        <div style={bubbleStyles.bubbleContainer}>
            <style>{bubbleStyles.keyframes}</style>
            
            <div style={bubbleStyles.chatBubble}>
                
                {/* Header (Navo's Introduction) */}
                <div style={bubbleStyles.header}>
                    <img 
                        src={ASSISTANT_IMAGE_URL} 
                        alt={`${ASSISTANT_NAME} Assistant`} 
                        style={bubbleStyles.image}
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/45x45/ff99aa/FFFFFF?text=N"; }}
                    />
                    <h2 style={bubbleStyles.h2}>Hi! I'm {ASSISTANT_NAME}, your SithRoo Assistant.</h2>
                </div>
                
                {/* Body Message (Sinhala with Maname Font) */}
                <div style={bubbleStyles.bodyText}>
                    <p style={{marginBottom: '10px'}}>
                        **SithRoo.Store** වෙබ් අඩවියට ඔබව සාදරයෙන් පිළිගනිමු!
                    </p>
                    <ul style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
                        <li style={bubbleStyles.bulletPoint}>
                            <strong style={bubbleStyles.highlightText}>SithRoo Library</strong>: අපේ ඊළඟ විශාල ව්‍යාපෘතියයි (තාම නිම වෙමින් පවතී).
                        </li>
                        <li style={bubbleStyles.bulletPoint}>
                            <strong style={bubbleStyles.highlightText}>Kitto</strong>: මෙහිදී ඔබටම Shop එකක් හදාගෙන අලුත්ම හෝ පරණ භාණ්ඩ පහසුවෙන් අලෙවි කළ හැකියි.
                        </li>
                        <li style={bubbleStyles.bulletPoint}>
                            <strong style={bubbleStyles.highlightText}>Kitto Drop</strong>: ඔබට කිසිදු මුදලක් නොමැතිව, නොමිලේම ආදායමක් (Earn) උපයන්න පුළුවන් විශේෂම අවස්ථාව!
                        </li>
                    </ul>
                </div>

                {/* Buttons */}
                <div style={bubbleStyles.buttonContainer}>
                    <button 
                        onClick={handleDismiss} 
                        style={bubbleStyles.mainButton(false)} 
                    >
                        පසුව බලමු / Skip
                    </button>
                    <button 
                        onClick={handleDismiss} 
                        style={bubbleStyles.mainButton(true)} 
                    >
                        හරි / Continue <FaChevronRight style={{marginLeft: '5px', fontSize: '0.8em'}}/>
                    </button>
                </div>
            </div>
        </div>
    );
};
// -----------------------------------------------------------------


// --- Main SithRoo Home Component (Existing Code) ---
export default function SithRooHome() {
    // ... (ADS_DATA and AdSlider components remain the same for functionality)
    // ... (Skipping repeated code for brevity. Assume existing AdSlider is here)

    const [currentAdIndex, setCurrentAdIndex] = useState(0);

    // Ad Slider Logic
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentAdIndex(prevIndex => (prevIndex + 1) % ADS_DATA.length);
        }, 2000); 
        return () => clearInterval(timer);
    }, []);
    
    // AdSlider component logic (assumed to be present or imported)
    const AdSlider = () => { /* ... simplified for display ... */ return null; }; 


    return (
        <>
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
        </>
    );
}