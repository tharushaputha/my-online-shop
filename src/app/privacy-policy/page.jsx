// File: app/privacy-policy/page.jsx
// White Background / Black Text Clean Design (Legal Document)

import React from 'react';
import Link from 'next/link';

// Privacy Policy පිටුව සඳහා වන React component එක
export default function PrivacyPolicyPage() {
  
  // --- අලුත් "Normal White" Styles ---
  const styles = {
    // පිටත Background එක
    pageWrapper: {
      backgroundColor: '#f4f4f4', // Light gray background
      minHeight: '100vh',
      padding: '40px 20px',
      fontFamily: 'Arial, sans-serif',
    },
    // අන්තර්ගතය තියෙන සුදු Box එක (Card)
    contentBox: {
      maxWidth: '850px', 
      margin: '0 auto',
      padding: '40px',
      backgroundColor: '#FFFFFF', 
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      textAlign: 'left', // නීතිමය ලේඛන සඳහා අත්‍යවශ්‍යයි
    },
    // ප්‍රධාන මාතෘකාව
    h1: {
      fontSize: '2.5rem', 
      fontWeight: 'bold', 
      marginBottom: '25px', 
      color: '#111111', 
      textAlign: 'center', // Main Title විතරක් මැදට
    },
    // Section මාතෘකා
    h2: {
      fontSize: '1.8rem', 
      fontWeight: 'bold', 
      marginTop: '30px',
      marginBottom: '15px',
      color: '#111111', 
    },
    // සාමාන්‍ය text
    p: {
      fontSize: '1rem', 
      color: '#333333', 
      marginBottom: '15px',
      lineHeight: '1.7', 
    },
    // List item
    li: {
      fontSize: '1rem',
      color: '#333333',
      lineHeight: '1.7',
      marginBottom: '10px',
    },
    // Link style (Contact Us එකේ වගේ Professional Blue)
    linkStyle: {
      color: '#007bff',
      textDecoration: 'underline',
    }
  };
  // ---------------------------------

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.contentBox}>
        
        {/* ප්‍රධාන මාතෘකාව - English */}
        <h1 style={styles.h1}>
          Privacy Policy
        </h1>

        <p style={styles.p}>
          Last Updated: [29th October 2025]
        </p>
        
        <p style={styles.p}>
          Welcome to <strong>Kitto</strong>. This policy explains how we collect, use, and protect your personal information when you use our website (referred to here as the "Service").
        </p>

        {/* --- Section 1: Information We Collect --- */}
        <h2 style={styles.h2}>1. Information We Collect</h2>
        <p style={styles.p}>
          We may collect various types of information from you when you use our Service:
        </p>
        <ul style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
          <li style={styles.li}>
            <strong>Personally Identifiable Information (PII):</strong> When you create an account, post an ad, or contact us, we collect information such as your name, email address, and phone number.
          </li>
          <li style={styles.li}>
            <strong>Usage Data:</strong> Technical data such as your IP address, browser type, how you access the website, and the pages you visit.
          </li>
          <li style={styles.li}>
            <strong>Cookies:</strong> We use Cookies to ensure the functionality of the website and enhance your user experience.
          </li>
        </ul>

        {/* --- Section 2: How We Use Your Information --- */}
        <h2 style={styles.h2}>2. How We Use Your Information</h2>
        <p style={styles.p}>
          The information we collect is used for the following purposes:
        </p>
        <ul style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
          <li style={styles.li}>To provide and maintain our Service.</li>
          <li style={styles.li}>To manage your account.</li>
          <li style={styles.li}>
            To facilitate transactions between you and other users (e.g., displaying the seller's contact number).
          </li>
          <li style={styles.li}>
            To prevent fraudulent activities and ensure the security of the website.
          </li>
          <li style={styles.li}>
            To inform you about changes, updates, or promotions regarding the Service.
          </li>
        </ul>

        {/* --- Section 3: Disclosure of Information --- */}
        <h2 style={styles.h2}>3. Disclosure of Information</h2>
        <p style={styles.p}>
          We will not sell or trade your personal information to third parties without your permission, except when required by law or necessary to protect our services.
        </p>

        {/* --- Section 4: Data Security --- */}
        <h2 style={styles.h2}>4. Data Security</h2>
        <p style={styles.p}>
          The security of your information is extremely important to us. However, please be aware that no method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee its absolute security.
        </p>

        {/* --- Section 5: Changes to This Policy --- */}
        <h2 style={styles.h2}>5. Changes to This Policy</h2>
        <p style={styles.p}>
          We may update this Privacy Policy from time to time. Any changes will be posted on this page, and the "Last Updated" date will also be modified.
        </p>

        {/* --- Section 6: Contact Us --- */}
        <h2 style={styles.h2}>6. Contact Us</h2>
        <p style={styles.p}>
          If you have any questions regarding this Privacy Policy, please contact us through our
          <Link href="/contact" style={styles.linkStyle}>
            {" Contact Us "}
          </Link> 
          page.
        </p>

      </div>
    </div>
  );
}