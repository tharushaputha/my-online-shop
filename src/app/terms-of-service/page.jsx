// File එක: app/terms-of-service/page.jsx

import React from 'react';
import Link from 'next/link'; // Privacy Policy එකට link කරන්න

// Terms of Service පිටුව සඳහා වන React component එක
export default function TermsOfServicePage() {
  
  // පාට (Colors) - අනිත් පිටු වලම ඒවා
  const MINT_GREEN_BG = '#F0FFF4';
  const HEADING_PINK = '#D81B60';
  const TEXT_COLOR = '#334155';
  const CARD_BG = '#FFFFFF';

  // Section මාතෘකා සඳහා Style
  const h2Style = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: HEADING_PINK, // Pink පාටින්
    marginTop: '30px',
    marginBottom: '10px',
  };

  // සාමාන්‍ය ඡේද (Paragraphs) සඳහා Style
  const pStyle = {
    fontSize: '16px',
    color: TEXT_COLOR,
    lineHeight: '1.7',
    marginBottom: '15px',
  };

  // List item (li) සඳහා Style
  const liStyle = {
    fontSize: '16px',
    color: TEXT_COLOR,
    lineHeight: '1.7',
    marginBottom: '10px',
    marginLeft: '20px', // පොඩි ඉඩක්
  };

  return (
    // ප්‍රධාන පිටුවට අදාළ div එක
    <div style={{
      backgroundColor: MINT_GREEN_BG,
      minHeight: '100vh',
      padding: '50px 20px',
      fontFamily: 'Arial, sans-serif',
    }}>
      
      {/* අන්තර්ගතය තියෙන Box එක (Card එක) */}
      <div style={{ 
        maxWidth: '900px',
        margin: '0 auto',
        padding: '40px',
        backgroundColor: CARD_BG,
        borderRadius: '15px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        textAlign: 'left', // Legal text එක වමට align කරනවා
      }}>
        
        {/* ප්‍රධාන මාතෘකාව */}
        <h1 style={{ 
          fontSize: '42px', 
          fontWeight: 'bold', 
          marginBottom: '25px', 
          color: HEADING_PINK,
          textAlign: 'center', // ප්‍රධාන මාතෘකාව විතරක් මැදට
        }}>
          සේවා නියම (Terms of Service)
        </h1>

        <p style={pStyle}>
          අවසන් වරට යාවත්කාලීන කරන ලද්දේ: [මෙතනට අද දවස දාන්න, උදා: 2025 ඔක්තෝබර් 24]
        </p>
        
        <p style={pStyle}>
          <strong>Kittoweb</strong> ("අප", "අපගේ") වෙබ් අඩවිය ("සේවාව") 
          භාවිතා කිරීමට පෙර කරුණාකර මෙම සේවා නියමයන් ("නියම") 
          හොඳින් කියවන්න.
        </p>
        <p style={pStyle}>
          අපගේ සේවාවට ප්‍රවේශ වීම සහ භාවිතා කිරීම, 
          ඔබ මෙම නියමයන් පිළිගැනීම සහ ඊට අනුකූල වීම මත රඳා පවතී. 
          මෙම නියමයන් අපගේ සේවාව භාවිතා කරන සියලුම 
          පරිශීලකයින් (users) සඳහා අදාළ වේ.
        </p>

        {/* --- Section 1 --- */}
        <h2 style={h2Style}>1. ගිණුම් (Accounts)</h2>
        <p style={pStyle}>
          ඔබ අප සමඟ ගිණුමක් නිර්මාණය කරන විට, ඔබ සපයන 
          තොරතුරු සෑම විටම නිවැරදි, සම්පූර්ණ සහ යාවත්කාලීන 
          බවට ඔබ වග බලා ගත යුතුය. එසේ නොකිරීම 
          මෙම නියමයන් උල්ලංඝනය කිරීමක් වන අතර, 
          එය ඔබගේ ගිණුම වහාම අත්හිටුවීමට හේතු විය හැක.
        </p>
        <p style={pStyle}>
          ඔබගේ මුරපදයේ (password) රහස්‍යභාවය ආරක්ෂා කර 
          ගැනීම ඔබගේ වගකීම වේ.
        </p>

        {/* --- Section 2 --- */}
        <h2 style={h2Style}>2. පරිශීලක අන්තර්ගතය (User Content)</h2>
        <p style={pStyle}>
          අපගේ සේවාව මඟින් ඔබට දැන්වීම්, ඡායාරූප, සහ 
          වෙනත් තොරතුරු ("අන්තර්ගතය") පළ කිරීමට (post) ඉඩ සලසයි. 
          ඔබ පළ කරන අන්තර්ගතයේ නිරවද්‍යතාවය, නීත්‍යානුකූලභාවය 
          සහ යෝග්‍යතාවය පිළිබඳ සම්පූර්ණ වගකීම ඔබ සතු වේ.
        </p>
        <p style={pStyle}>
          නීති විරෝධී, වංචනික, අසභ්‍ය, තර්ජනාත්මක, හෝ 
          වෙනත් අයුරකින් නුසුදුසු යැයි අප සලකන ඕනෑම අන්තර්ගතයක් 
          ඉවත් කිරීමට හෝ සංස්කරණය කිරීමට අපට අයිතිය ඇත.
        </p>
        <p style={pStyle}>
          <strong>[!! වැදගත්: ඔයා තහනම් කරන දේවල් (e.g., මත්ද්‍රව්‍ය, ආයුධ, සතුන්) 
          ගැන ලැයිස්තුවක් මෙතනට දාන්න !!]</strong>
        </p>

        {/* --- Section 3 --- */}
        <h2 style={h2Style}>3. ගනුදෙනු (Transactions)</h2>
        <p style={pStyle}>
          Kittoweb යනු ගැනුම්කරුවන් සහ විකුණුම්කරුවන් 
          සම්බන්ධ කරන වේදිකාවක් (platform) පමණි. 
          අප කිසිදු භාණ්ඩයක් විකුණන්නේ හෝ මිලදී ගන්නේ නැත.
        </p>
        <p style={pStyle}>
          ගැනුම්කරුවන් සහ විකුණුම්කරුවන් අතර සිදුවන 
          ඕනෑම ගනුදෙනුවක්, සන්නිවේදනයක් සහ එකඟතාවයක් 
          ඔවුන්ගේම වගකීමක් වේ. 
          සිදුවන ගනුදෙනුවල ආරක්ෂාව හෝ ගුණාත්මකභාවය 
          පිළිබඳව අප වගකීමක් දරන්නේ නැත.
        </p>

        {/* --- Section 4 --- */}
        <h2 style={h2Style}>4. ගිණුම අත්හිටුවීම (Termination)</h2>
        <p style={pStyle}>
          ඔබ මෙම නියමයන් කඩ කළහොත්, 
          කිසිදු පූර්ව දැනුම්දීමකින් තොරව හෝ 
          වගකීමකින් තොරව, ඔබගේ ගිණුම වහාම අත්හිටුවීමට 
          (suspend) හෝ අවසන් කිරීමට (terminate) 
          අපට අයිතිය ඇත.
        </p>

        {/* --- Section 5 --- */}
        <h2 style={h2Style}>5. නීතිමය බැඳීම</h2>
        <p style={pStyle}>
          මෙම නියමයන් ශ්‍රී ලංකාවේ නීතියට අනුකූලව 
          පාලනය වේ. <strong>[!! වැදගත්: ඔයාගේ නීතිමය 
          උපදේශකයාගෙන් මේ ගැන අහන්න !!]</strong>
        </p>

        {/* --- Section 6 --- */}
        <h2 style={h2Style}>6. අප අමතන්න</h2>
        <p style={pStyle}>
          මෙම සේවා නියමයන් පිළිබඳව ඔබට 
          කිසියම් ප්‍රශ්නයක් ඇත්නම්, කරුණාකර අපගේ 
          <Link href="/contact" style={{ color: HEADING_PINK, textDecoration: 'underline' }}>
            "Contact Us" (අප අමතන්න)
          </Link> 
          පිටුව හරහා අපව සම්බන්ධ කරගන්න.
        </p>

      </div>
    </div>
  );
}