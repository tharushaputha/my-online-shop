// File එක: app/contact/page.jsx

import React from 'react';
// Icons ටික import කරගන්නවා
import { FaEnvelope, FaPhoneAlt } from 'react-icons/fa';

// Contact Us පිටුව සඳහා වන React component එක
export default function ContactUsPage() {
  
  // පාට (Colors) - About Us පිටුවෙම ඒවා
  const MINT_GREEN_BG = '#F0FFF4'; // හරිම ලා Mint Green පාටක්
  const HEADING_PINK = '#D81B60';  // ලස්සන, đậm (deep) Pink පාටක්
  const TEXT_COLOR = '#334155'; // කියවන්න පහසු, තද අළු පාටක්
  const CARD_BG = '#FFFFFF';    // සුදු පාට Card එක

  return (
    // ප්‍රධාන පිටුවට අදාළ div එක
    <div style={{
      backgroundColor: MINT_GREEN_BG, // පසුබිම Mint Green
      minHeight: '100vh', // සම්පූර්ණ screen එකම cover වෙන්න
      padding: '50px 20px', // උඩ/යට සහ වම්/දකුණ ඉඩ
      fontFamily: 'Arial, sans-serif',
    }}>
      
      {/* අන්තර්ගතය තියෙන Box එක (Card එක) */}
      <div style={{ 
        maxWidth: '800px', // About Us එකට වඩා පොඩ්ඩක් පළල අඩු කළා
        margin: '0 auto', // මැදට එන්න
        padding: '40px',
        backgroundColor: CARD_BG,
        borderRadius: '15px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        textAlign: 'center', // හැමදේම මැදට
      }}>
        
        {/* ප්‍රධාන මාතෘකාව */}
        <h1 style={{ 
          fontSize: '42px', 
          fontWeight: 'bold', 
          marginBottom: '25px', 
          color: HEADING_PINK, // මාතෘකාව Pink පාටින්
        }}>
          අප අමතන්න (Contact Us)
        </h1>

        {/* හැඳින්වීමේ ඡේදය */}
        <p style={{ 
          fontSize: '17px', 
          color: TEXT_COLOR, 
          marginBottom: '40px', // Box වලට කලින් ලොකු ඉඩක්
          lineHeight: '1.8',
        }}>
          ඔබට ඇති ඕනෑම ගැටළුවක්, යෝජනාවක් හෝ පැමිණිල්ලක් සඳහා
          අපගේ කණ්ඩායම ඔබට සහාය වීමට සූදානමින් සිටී.
        </p>

        {/* Contact ක්‍රම 2 Box 2කින් */}
        <div style={{ 
          display: 'flex', // තීරු 2ක් හදන්න
          justifyContent: 'center', // මැදට වෙන්න
          gap: '30px', // Box 2 අතර ඉඩ
          textAlign: 'left', // මේ Box වල text එක වමට
        }}>
          
          {/* 1. Email Box එක */}
          <div style={{
            flex: 1, // සමාන පළල
            padding: '30px',
            backgroundColor: '#F9FAFB', // හරිම ලා අළු පාටක්
            borderRadius: '10px',
            border: '1px solid #E5E7EB', // ලා පාට border එකක්
          }}>
            <FaEnvelope style={{ fontSize: '32px', color: HEADING_PINK, marginBottom: '15px' }} />
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: TEXT_COLOR, // මෙතන Pink නැතුව තද අළු පාට
              marginBottom: '10px'
            }}>
              Email මගින්
            </h2>
            <a href="mailto:kittoads.lk@gmail.com" style={{
              color: HEADING_PINK, // Link එක Pink පාටින්
              textDecoration: 'none',
              fontSize: '17px',
              fontWeight: 'bold',
              wordBreak: 'break-all' // Email එක දිග වැඩි නම් කැඩෙන්න
            }}>
              kittoads.lk@gmail.com
            </a>
          </div>

          {/* 2. Phone Box එක */}
          <div style={{
            flex: 1, // සමාන පළල
            padding: '30px',
            backgroundColor: '#F9FAFB',
            borderRadius: '10px',
            border: '1px solid #E5E7EB',
          }}>
            <FaPhoneAlt style={{ fontSize: '32px', color: HEADING_PINK, marginBottom: '15px' }} />
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: TEXT_COLOR,
              marginBottom: '10px'
            }}>
              Hotline මගින්
            </h2>
            <a href="tel:0784497070" style={{
              color: HEADING_PINK,
              textDecoration: 'none',
              fontSize: '17px',
              fontWeight: 'bold',
            }}>
              078 449 7070
            </a>
            <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '8px', marginBlockEnd: '0' }}>
              
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}