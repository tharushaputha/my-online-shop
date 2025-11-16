// File: app/about/page.jsx
// White Background / Black Text Design

import React from 'react';

// About Us පිටුව සඳහා වන React component එක
export default function AboutUsPage() {
  
  // --- අලුත් "Normal White" Styles ---
  const styles = {
    // පිටත Background එක (ලා අළු පාට)
    pageWrapper: {
      backgroundColor: '#f4f4f4', // Light gray background
      minHeight: '100vh',
      padding: '40px 20px',
      fontFamily: 'Arial, sans-serif',
    },
    // අන්තර්ගතය තියෙන සුදු Box එක
    contentBox: {
      maxWidth: '800px',
      margin: '0 auto', // මැදට එන්න
      padding: '40px',
      backgroundColor: '#FFFFFF', // සුදු පාට Box එක
      borderRadius: '8px', // පොඩි round corner එකක්
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)', // හරිම පොඩි shadow එකක්
    },
    // ප්‍රධාන මාතෘකාව (Black)
    h1: {
      fontSize: '2.5rem', 
      fontWeight: 'bold', 
      marginBottom: '20px', 
      color: '#111111', // තද කළු පාට
    },
    // අනු මාතෘකා (Black)
    h2: {
      fontSize: '1.8rem', 
      fontWeight: 'bold', 
      marginTop: '30px',
      marginBottom: '15px',
      color: '#111111', // තද කළු පාට
    },
    // සාමාන්‍ය text (Dark Gray)
    p: {
      fontSize: '1rem', 
      color: '#333333', // කියවන්න පහසු අළු පාටක්
      marginBottom: '15px',
      lineHeight: '1.7', // පේළි අතර ඉඩ
    }
  };
  // ---------------------------------

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.contentBox}>
        
        {/* 1. English වලට මාරු කළා */}
        <h1 style={styles.h1}>
          About Us
        </h1>

        <p style={styles.p}>
          <strong>Welcome to Kitto!</strong> We are dedicated to creating an
          online marketplace that easily connects buyers and sellers in Sri Lanka.
        </p>
        
        <p style={styles.p}>
          Whether you are looking to sell a new or used item, or trying to find
          what you need at the best price, our goal is to provide a safe,
          reliable, and easy-to-use platform.
        </p>

        {/* 2. තීරු 2 අයින් කරලා, Normal විදිහට දැම්මා */}
        
        <h2 style={styles.h2}>
          Our Vision
        </h2>
        <p style={styles.p}>
          To become the most trusted, popular, and user-friendly name in
          Sri Lanka's e-commerce sector.
        </p>

        <h2 style={styles.h2}>
          Our Mission
        </h2>
        <p style={styles.p}>
          To build an environment where anyone can easily and safely buy and
          sell goods, utilizing modern technology.
        </p>

      </div>
    </div>
  );
}