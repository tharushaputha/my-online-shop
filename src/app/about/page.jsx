// File: app/about/page.jsx
// White Background / Black Text Design (Brand-Inclusive)

import React from 'react';

export default function AboutUsPage() {
  
  // --- Standard White/Black Styles (Changes only in content) ---
  const styles = {
    pageWrapper: {
      backgroundColor: '#f4f4f4', // Light gray background
      minHeight: '100vh',
      padding: '40px 20px',
      fontFamily: 'Arial, sans-serif',
    },
    contentBox: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '40px',
      backgroundColor: '#FFFFFF', // සුදු පාට Box එක
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    },
    h1: {
      fontSize: '2.5rem', 
      fontWeight: 'bold', 
      marginBottom: '20px', 
      color: '#111111', 
    },
    h2: {
      fontSize: '1.8rem', 
      fontWeight: 'bold', 
      marginTop: '30px',
      marginBottom: '15px',
      color: '#111111', 
    },
    p: {
      fontSize: '1rem', 
      color: '#333333', 
      marginBottom: '15px',
      lineHeight: '1.7', 
    }
  };
  // ---------------------------------

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.contentBox}>
        
        <h1 style={styles.h1}>
          About SithRoo.Store
        </h1>

        {/* === BRAND INCLUSIVE TEXT (SithRoo & Kitto ගැන කියනවා) === */}
        <p style={styles.p}>
          Welcome to <strong>SithRoo.Store</strong>, the official digital ecosystem dedicated 
          to connecting communities across Sri Lanka. We are committed to providing 
          diverse, modern, and reliable online services.
        </p>
        
        <p style={styles.p}>
          Our platform is home to the flagship classifieds service, Kitto, where you can 
          buy and sell new and used items, as well as the SithRoo Library (Coming Soon), 
          which will offer premium digital resources. Our focus is on delivering a 
          safe and intuitive experience for all services under the SithRoo banner.
        </p>

        {/* Vision/Mission ටිකත් Ecosystem එකට ගැලපෙන්න වෙනස් කළා */}
        
        <h2 style={styles.h2}>
          Our Vision
        </h2>
        <p style={styles.p}>
          To be the leading and most comprehensive digital services provider in Sri Lanka, 
          fostering trusted services and vibrant community connections across all our platforms.
        </p>

        <h2 style={styles.h2}>
          Our Mission
        </h2>
        <p style={styles.p}>
          To continuously innovate and utilize modern technology to offer secure, transparent, 
          and high-quality digital services, making every online interaction simple and rewarding.
        </p>
        {/* ======================================================= */}

      </div>
    </div>
  );
}