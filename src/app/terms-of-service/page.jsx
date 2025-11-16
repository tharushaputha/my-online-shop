// File: app/terms-of-service/page.jsx
// White Background / Black Text Clean Design (Legal Document)

import React from 'react';
import Link from 'next/link';

// Terms of Service පිටුව සඳහා වන React component එක
export default function TermsOfServicePage() {
  
  // --- අලුත් "Normal White" Styles (Privacy Policy එකට සමානයි) ---
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
      textAlign: 'left', // Legal document requires left alignment
    },
    // ප්‍රධාන මාතෘකාව
    h1: {
      fontSize: '2.5rem', 
      fontWeight: 'bold', 
      marginBottom: '25px', 
      color: '#111111', 
      textAlign: 'center', // Main Title only centered
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
      marginLeft: '20px', 
    },
    // Link style (Professional Blue)
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
          Terms of Service
        </h1>

        <p style={styles.p}>
          Last Updated: [24th October 2025]
        </p>
        
        <p style={styles.p}>
          Please read these Terms of Service ("Terms") carefully before accessing or using the <strong>Kitto</strong> website ("Service").
        </p>
        <p style={styles.p}>
          Your access to and use of the Service is conditioned upon your acceptance of and compliance with these Terms. These Terms apply to all users who access or use the Service.
        </p>

        {/* --- Section 1: Accounts --- */}
        <h2 style={styles.h2}>1. Accounts</h2>
        <p style={styles.p}>
          When you create an account with us, you must ensure that the information you provide is always accurate, complete, and up-to-date. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
        </p>
        <p style={styles.p}>
          You are responsible for safeguarding the password that you use to access the Service.
        </p>

        {/* --- Section 2: User Content --- */}
        <h2 style={styles.h2}>2. User Content</h2>
        <p style={styles.p}>
          Our Service allows you to post advertisements, photos, and other information ("Content"). You are solely responsible for the accuracy, legality, and suitability of the Content you post.
        </p>
        <p style={styles.p}>
          We reserve the right to remove or edit any Content that we deem illegal, fraudulent, obscene, threatening, or otherwise inappropriate.
        </p>
        <p style={styles.p}>
          <strong style={{ color: '#dc3545' }}>[IMPORTANT: Prohibited Items]</strong> Content related to illegal drugs, weapons, or trade in protected animals is strictly prohibited.
        </p>

        {/* --- Section 3: Transactions --- */}
        <h2 style={styles.h2}>3. Transactions</h2>
        <p style={styles.p}>
          Kittoweb is only a platform that connects buyers and sellers. We do not sell or purchase any items.
        </p>
        <p style={styles.p}>
          Any transaction, communication, and agreement between buyers and sellers are solely their responsibility. We are not responsible for the safety or quality of transactions that occur.
        </p>

        {/* --- Section 4: Termination --- */}
        <h2 style={styles.h2}>4. Termination</h2>
        <p style={styles.p}>
          We may terminate or suspend your account immediately, without prior notice or liability, if you breach these Terms.
        </p>

        {/* --- Section 5: Governing Law --- */}
        <h2 style={styles.h2}>5. Governing Law</h2>
        <p style={styles.p}>
          These Terms shall be governed and construed in accordance with the laws of Sri Lanka. <strong style={{ color: '#dc3545' }}>[IMPORTANT: Consult your legal advisor regarding this section]</strong>.
        </p>

        {/* --- Section 6: Contact Us --- */}
        <h2 style={styles.h2}>6. Contact Us</h2>
        <p style={styles.p}>
          If you have any questions about these Terms of Service, please contact us through our
          <Link href="/contact" style={styles.linkStyle}>
            {" Contact Us "}
          </Link> 
          page.
        </p>

      </div>
    </div>
  );
}