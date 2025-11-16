'use client'; 
import React, { useState } from 'react';
import Link from 'next/link';
import { FaHome, FaRocket } from 'react-icons/fa';

export default function LibraryComingSoon() {
  
  // Clean Sky Blue/White Theme Styles
  const styles = {
    container: {
      // Background: Light Sky Blue
      backgroundColor: '#e3f2fd', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px 20px',
      fontFamily: 'Arial, sans-serif',
      color: '#007bff', // Primary Blue color
      textAlign: 'center',
    },
    contentBox: {
      backgroundColor: 'white',
      padding: '50px 30px',
      borderRadius: '15px',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
      maxWidth: '500px',
      width: '100%',
    },
    icon: {
      fontSize: '5rem',
      color: '#ff99aa', // Cute Pink
      marginBottom: '20px',
      animation: 'pulse 1.5s infinite alternate',
    },
    h1: {
      fontSize: '3rem',
      fontWeight: 'bold',
      marginBottom: '15px',
    },
    p: {
      fontSize: '1.2rem',
      color: '#555',
      marginBottom: '30px',
    },
    homeLink: {
      backgroundColor: '#007bff',
      color: 'white',
      padding: '12px 25px',
      borderRadius: '8px',
      fontWeight: 'bold',
      textDecoration: 'none',
      transition: 'background-color 0.3s',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
    },
    // CSS Keyframe Animation
    keyframes: `
        @keyframes pulse {
            from { transform: scale(1); opacity: 0.8; }
            to { transform: scale(1.1); opacity: 1; }
        }
    `,
  };

  return (
    <div style={styles.container}>
      {/* Styles for animation */}
      <style>{styles.keyframes}</style> 
      
      <div style={styles.contentBox}>
        <FaRocket style={styles.icon} />
        <h1 style={styles.h1}>SithRoo Library</h1>
        <h1 style={styles.h1}>Coming Soon...</h1>
        <p style={styles.p}>
          We are preparing our digital ecosystem to bring you curated books, stories, and thoughts.
        </p>
        
        <Link href="/" style={styles.homeLink}>
          <FaHome /> Back to SithRoo Home
        </Link>
      </div>
    </div>
  );
};