// File: app/faq/page.jsx
// White Background / Black Text Clean Design (FAQ with Accordion - Brand Inclusive)

import React from 'react';

export default function FAQPage() {
  
  // --- Standard White/Black Styles ---
  const styles = {
    // පිටත Background එක
    pageWrapper: {
      backgroundColor: '#f4f4f4', 
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
    },
    // ප්‍රධාන මාතෘකාව
    h1: { 
      fontSize: '2.5rem', 
      fontWeight: 'bold', 
      marginBottom: '15px', 
      color: '#111111', 
      textAlign: 'center',
    },
    // හැඳින්වීමේ ඡේදය
    pIntro: { 
      fontSize: '1rem', 
      color: '#333333', 
      marginBottom: '40px', 
      lineHeight: '1.7',
      textAlign: 'center',
    },
    // FAQ ප්‍රශ්න Container එක
    qaContainer: {
      display: 'flex', 
      flexDirection: 'column', 
      gap: '10px'
    },
    // ප්‍රශ්නය (Summary) සඳහා style
    question: {
      fontSize: '1rem',
      fontWeight: '600',
      color: '#111111',
      padding: '18px 20px',
      backgroundColor: '#FAFAFA', 
      border: '1px solid #E5E7EB',
      borderRadius: '8px',
      cursor: 'pointer',
      outline: 'none',
      transition: 'background-color 0.2s',
    },
    // උත්තරය (Details content) සඳහා style
    answer: {
      fontSize: '0.95rem',
      color: '#444444',
      lineHeight: '1.7',
      padding: '20px',
      border: '1px solid #E5E7EB',
      borderTop: 'none', 
      backgroundColor: '#FFFFFF',
      borderRadius: '0 0 8px 8px',
    },
    // details tag එකටම දාන style
    detailsStyle: {
      borderRadius: '8px',
      overflow: 'hidden', 
    }
  };
  // ---------------------------------

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.contentBox}>
        
        {/* ප්‍රධාන මාතෘකාව */}
        <h1 style={styles.h1}>
          Frequently Asked Questions (FAQ)
        </h1>

        {/* හැඳින්වීමේ ඡේදය - Platform එකට ගැලපෙන්න වෙනස් කළා */}
        <p style={styles.pIntro}>
          Find answers to common questions about using the SithRoo.Store platform and its primary classifieds service, Kitto.
        </p>

        {/* FAQ ප්‍රශ්න ටික */}
        <div style={styles.qaContainer}>
          
          {/* ප්‍රශ්නය 1 - Kitto ගැන පැහැදිලි කිරීම */}
          <details style={styles.detailsStyle}>
            <summary style={styles.question}>
              What is the relationship between SithRoo.Store and Kitto?
            </summary>
            <div style={styles.answer}>
              SithRoo.Store is the main digital platform (the ecosystem). Kitto is the classifieds service operating under the SithRoo.Store banner, focused on connecting buyers and sellers for new and used items.
            </div>
          </details>

          {/* ප්‍රශ්නය 2 - Account එක Kitto වලට විතරක් නෙමෙයි */}
          <details style={styles.detailsStyle}>
            <summary style={styles.question}>
              How do I create an account on the SithRoo.Store platform?
            </summary>
            <div style={styles.answer}>
              Click the "Sign Up" or "Register" button on the homepage. Enter your details (name, email, password) to create the account. This single account grants you access to all SithRoo services, including Kitto. It is completely free to join!
            </div>
          </details>

          {/* ප්‍රශ්නය 3 - Ad Post කිරීම */}
          <details style={styles.detailsStyle}>
            <summary style={styles.question}>
              How do I post an advertisement (Ad) using the Kitto service?
            </summary>
            <div style={styles.answer}>
              Once logged into the SithRoo platform, navigate to the Kitto section. Click the "Post Ad" button. Then, enter the item's detailed description, upload photos, set the price, and select the appropriate category to publish the ad.
            </div>
          </details>

          {/* ප්‍රශ්නය 4 - Boost කිරීම */}
          <details style={styles.detailsStyle}>
            <summary style={styles.question}>
              How do I boost my ad to the top on Kitto?
            </summary>
            <div style={styles.answer}>
              Go to your "My Ads" page within the Kitto section. Select the ad you wish to boost. Then, select the "Boost Ad" option and complete the payment to display the ad at the top of the listings.
            </div>
          </details>
          
          {/* ප්‍රශ්නය 5 - Buying an item */}
          <details style={styles.detailsStyle}>
            <summary style={styles.question}>
              How do I buy an item listed on Kitto?
            </summary>
            <div style={styles.answer}>
              Select the item you want and contact the seller directly using the provided information (phone number or chat). SithRoo.Store (via Kitto) is a platform that connects buyers and sellers; transactions should be completed directly between the two parties.
            </div>
          </details>

          {/* ප්‍රශ්නය 6 - Scam Reporting */}
          <details style={styles.detailsStyle}>
            <summary style={styles.question}>
              What should I do if I see a fraudulent (Scam) ad on Kitto?
            </summary>
            <div style={styles.answer}>
              Click the "Report Ad" button located under every advertisement on the Kitto page. Our team will immediately investigate the report and take necessary action to remove misleading content from the platform.
            </div>
          </details>

        </div> {/* End of QA Container */}

      </div>
    </div>
  );
}