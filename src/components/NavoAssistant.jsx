'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaChevronRight } from 'react-icons/fa';

// --- ASSISTANT CONSTANTS ---
// Note: ඔබගේ navo.png file එක public folder එකේ තිබිය යුතුය.
const ASSISTANT_IMAGE_URL = "/navo.png"; 
const ASSISTANT_NAME = "Navo"; 
const SESSION_KEY = 'navoAssistantSeen_final'; // <<<< Key එක වෙනස් කළා! >>>>
// ----------------------------

// Navo Assistant Chat Bubble Component
const NavoAssistant = () => {
    const [isVisible, setIsVisible] = useState(false); 

    useEffect(() => {
        // Check if the user has seen the message in this session
        if (typeof window !== 'undefined' && !sessionStorage.getItem(SESSION_KEY)) {
            // Show the popup after a 1-second delay
            setTimeout(() => {
                setIsVisible(true);
            }, 1000); 
        }
    }, []);

    const handleDismiss = () => {
        // Save the session key so the assistant doesn't reappear
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
            boxShadow: 'none', 
            border: 'none', 
        },
        h2: {
            fontSize: '1.3rem', 
            fontWeight: '600',
            color: 'white', 
            textShadow: '0 0 5px rgba(255, 255, 255, 0.4)', 
        },
        bodyText: {
            fontSize: '1rem', 
            color: '#e9ecef',
            lineHeight: '1.6',
            marginBottom: '20px',
            // --- Maname Font භාවිතය ---
            fontFamily: `var(--font-maname), serif`, 
        },
        bulletPoint: {
            marginBottom: '8px',
            color: '#e9ecef',
            // --- Maname Font භාවිතය ---
            fontFamily: `var(--font-maname), serif`, 
        },
        // Highlight Text Styles 
        highlightText: {
            color: 'white', 
            textShadow: '0 0 5px rgba(255, 255, 255, 0.6), 0 0 10px rgba(255, 255, 255, 0.3)', 
            fontWeight: 'bold',
        },
        // Modern, Glowing, Transparent Buttons 
        buttonContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            gap: '10px',
        },
        mainButton: (isPrimary) => ({
            backgroundColor: isPrimary ? 'rgba(255, 255, 255, 0.1)' : 'transparent', 
            color: 'white', 
            padding: '10px 15px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.4)', 
            cursor: 'pointer',
            fontWeight: 'bold',
            flex: 1,
            transition: 'all 0.3s',
            boxShadow: isPrimary ? '0 0 8px rgba(255, 255, 255, 0.6), 0 0 15px rgba(255, 255, 255, 0.3)' : 'none', 
            textShadow: '0 0 2px rgba(0,0,0,0.5)', 
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
                    <h2 style={bubbleStyles.h2}>Hi I'm {ASSISTANT_NAME}, your SithRoo Assistant.</h2>
                </div>
                
                {/* Body Message (Sinhala with Maname Font) */}
                <div style={bubbleStyles.bodyText}>
                    <p style={{marginBottom: '10px'}}>
                        SithRoo.Store වෙබ් අඩවියට ඔබව සාදරයෙන් පිළිගනිමු!
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
                              Skip
                    </button>
                    <button 
                        onClick={handleDismiss} 
                        style={bubbleStyles.mainButton(true)} 
                    >
                        Continue <FaChevronRight style={{marginLeft: '5px', fontSize: '0.8em'}}/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NavoAssistant;