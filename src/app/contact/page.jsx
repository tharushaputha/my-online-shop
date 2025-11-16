// File: app/contact/page.jsx
// White Background / Black Text Clean Design

import React from 'react';
// Icons ටික import කරගන්නවා
import { FaEnvelope, FaPhoneAlt } from 'react-icons/fa';

// Contact Us පිටුව සඳහා වන React component එක
export default function ContactUsPage() {
  
  // --- අලුත් "Normal White" Styles ---
  const styles = {
    // පිටත Background එක (ලා අළු පාට)
    pageWrapper: {
      backgroundColor: '#f4f4f4', // Light gray background
      minHeight: '100vh',
      padding: '40px 20px',
      fontFamily: 'Arial, sans-serif',
    },
    // අන්තර්ගතය තියෙන සුදු Box එක (Card)
    contentBox: {
      maxWidth: '800px',
      margin: '0 auto', // මැදට එන්න
      padding: '40px',
      backgroundColor: '#FFFFFF', // සුදු පාට Box එක
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      textAlign: 'center',
    },
    // ප්‍රධාන මාතෘකාව
    h1: { 
      fontSize: '2.5rem', 
      fontWeight: 'bold', 
      marginBottom: '25px', 
      color: '#111111', // තද කළු පාට
    },
    // හැඳින්වීමේ ඡේදය
    pIntro: { 
      fontSize: '1rem', 
      color: '#333333', 
      marginBottom: '40px', 
      lineHeight: '1.7',
    },
    // Contact Box Container එක
    contactContainer: {
      display: 'flex', 
      justifyContent: 'center', 
      gap: '30px', 
      textAlign: 'center', // Contact boxes ඇතුළේ text මැදට
      flexWrap: 'wrap', // Mobile වලට පහළට එන්න
    },
    // Individual Contact Box
    contactBox: {
      flex: 1, // සමාන පළල
      minWidth: '280px', // Mobile වලදි කැඩෙන්නේ නැතුව තියෙන්න
      padding: '30px',
      backgroundColor: '#FAFAFA', // හරිම ලා අළු පාටක්
      borderRadius: '8px',
      border: '1px solid #E5E7EB',
    },
    // Icon පාට
    iconColor: '#007bff', // Professional Blue
    // Box මාතෘකාව
    h2: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#111111',
      marginBottom: '10px'
    },
    // Link පාට
    linkStyle: {
      color: '#007bff',
      textDecoration: 'none',
      fontSize: '1rem',
      fontWeight: 'bold',
      wordBreak: 'break-all'
    }
  };
  // ---------------------------------

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.contentBox}>
        
        {/* ප්‍රධාන මාතෘකාව - English */}
        <h1 style={styles.h1}>
          Contact Us
        </h1>

        {/* හැඳින්වීමේ ඡේදය - English */}
        <p style={styles.pIntro}>
          Our team is ready to assist you with any questions, suggestions, or complaints you may have.
          We aim to respond to all inquiries within 24 hours.
        </p>

        {/* Contact ක්‍රම 2 Box 2කින් */}
        <div style={styles.contactContainer}>
          
          {/* 1. Email Box එක */}
          <div style={styles.contactBox}>
            <FaEnvelope style={{ fontSize: '32px', color: styles.iconColor, marginBottom: '15px' }} />
            <h2 style={styles.h2}>
              By Email
            </h2>
            <a href="mailto:kittoads.lk@gmail.com" style={styles.linkStyle}>
              kittoads.lk@gmail.com
            </a>
          </div>

          {/* 2. Phone Box එක */}
          <div style={styles.contactBox}>
            <FaPhoneAlt style={{ fontSize: '32px', color: styles.iconColor, marginBottom: '15px' }} />
            <h2 style={styles.h2}>
              By Hotline
            </h2>
            <a href="tel:0784497070" style={styles.linkStyle}>
              +94 78 449 7070
            </a>
            <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '8px', marginBlockEnd: '0' }}>
              (Monday to Friday, 9am - 5pm)
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}