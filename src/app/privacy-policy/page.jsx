// File එක: app/privacy-policy/page.jsx

import React from 'react';
import Link from 'next/link'; // Contact page එකට link කරන්න

// Privacy Policy පිටුව සඳහා වන React component එක
export default function PrivacyPolicyPage() {
  
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
          පුද්ගලිකත්ව ප්‍රතිපත්තිය (Privacy Policy)
        </h1>

        <p style={pStyle}>
          අවසන් වරට යාවත්කාලීන කරන ලද්දේ: [2025 ඔක්තෝම්බර් 29]
        </p>
        
        <p style={pStyle}>
          <strong>Kittoweb</strong>වෙත සාදරයෙන් පිළිගනිමු. 
          ඔබ අපගේ වෙබ් අඩවිය (මෙහි "සේවාව" ලෙස හැඳින්වෙන) භාවිතා කරන විට, 
          ඔබගේ පුද්ගලික තොරතුරු අප රැස් කරන, භාවිතා කරන සහ ආරක්ෂා කරන ආකාරය 
          මෙම ප්‍රතිපත්තිය මගින් පැහැදිලි කරයි.
        </p>

        {/* --- Section 1 --- */}
        <h2 style={h2Style}>1. අප රැස් කරන තොරතුරු</h2>
        <p style={pStyle}>
          ඔබ අපගේ සේවාව භාවිතා කරන විට අප ඔබගෙන් විවිධ තොරතුරු රැස් කළ හැක:
        </p>
        <ul style={{ paddingLeft: '20px' }}>
          <li style={liStyle}>
            <strong>පුද්ගලිකව හඳුනාගත හැකි තොරතුරු:</strong> ඔබ ගිණුමක් සාදන විට, 
            දැන්වීමක් පළ කරන විට හෝ අපව සම්බන්ධ කර ගන්නා විට, 
            ඔබගේ නම, ඊමේල් ලිපිනය, දුරකථන අංකය වැනි දේ. 
            <strong></strong>
          </li>
          <li style={liStyle}>
            <strong>භාවිත දත්ත (Usage Data):</strong> ඔබ වෙබ් අඩවියට පිවිසෙන ආකාරය, 
            ඔබගේ IP ලිපිනය, බ්‍රවුසර වර්ගය, ඔබ පිවිසෙන පිටු වැනි තාක්ෂණික දත්ත.
          </li>
          <li style={liStyle}>
            <strong>Cookies:</strong> වෙබ් අඩවියේ ක්‍රියාකාරීත්වය සහතික කිරීමට සහ 
            ඔබගේ අත්දැකීම වැඩි දියුණු කිරීමට අප Cookies භාවිතා කරමු.
          </li>
        </ul>

        {/* --- Section 2 --- */}
        <h2 style={h2Style}>2. අප ඔබගේ තොරතුරු භාවිතා කරන්නේ කෙසේද?</h2>
        <p style={pStyle}>
          අප රැස් කරන තොරතුරු පහත සඳහන් දෑ සඳහා භාවිතා කරමු:
        </p>
        <ul style={{ paddingLeft: '20px' }}>
          <li style={liStyle}>අපගේ සේවාව සැපයීමට සහ නඩත්තු කිරීමට.</li>
          <li style={liStyle}>ඔබගේ ගිණුම කළමනාකරණය කිරීමට.</li>
          <li style={liStyle}>
            ඔබ සහ අනෙකුත් පරිශීලකයින් අතර ගනුදෙනු සඳහා පහසුකම් සැලසීමට 
            (උදා: විකුණුම්කරුගේ අංකය පෙන්වීම).
          </li>
          <li style={liStyle}>
            වංචනික ක්‍රියා වැළැක්වීමට සහ වෙබ් අඩවියේ ආරක්ෂාව තහවුරු කිරීමට.
          </li>
          <li style={liStyle}>
            සේවාවේ වෙනස්කම්, යාවත්කාලීන කිරීම් හෝ ප්‍රවර්ධන (promotions) 
            පිළිබඳව ඔබව දැනුවත් කිරීමට. 
            <strong></strong>
          </li>
        </ul>

        {/* --- Section 3 --- */}
        <h2 style={h2Style}>3. තොරතුරු හෙළිදරව් කිරීම</h2>
        <p style={pStyle}>
          නීතියෙන් අවශ්‍ය වුවහොත් හෝ අපගේ සේවාවන් ආරක්ෂා කිරීමට අවශ්‍ය වුවහොත් 
          හැර, ඔබගේ පුද්ගලික තොරතුරු ඔබගේ අවසරයකින් තොරව 
          තෙවන පාර්ශවයන්ට විකුණන්නේ නැත, හෝ හුවමාරු කරන්නේ නැත.
        </p>
        <p style={pStyle}>
          <strong></strong>
        </p>

        {/* --- Section 4 --- */}
        <h2 style={h2Style}>4. දත්ත ආරක්ෂාව</h2>
        <p style={pStyle}>
          ඔබගේ තොරතුරුවල ආරක්ෂාව අපට ඉතා වැදගත් වේ. 
          නමුත් අන්තර්ජාලය හරහා දත්ත සම්ප්‍රේෂණය කිරීමේ 
          කිසිදු ක්‍රමයක් 100% ආරක්ෂිත නොවන බව කරුණාවෙන් සලකන්න. 
          අප ඔබගේ දත්ත ආරක්ෂා කිරීමට උත්සාහ කළද, 
          එහි නිරපේක්ෂ ආරක්ෂාව සහතික කළ නොහැක.
        </p>

        {/* --- Section 5 --- */}
        <h2 style={h2Style}>5. මෙම ප්‍රතිපත්තියේ වෙනස්කම්</h2>
        <p style={pStyle}>
          අප විසින් මෙම පුද්ගලිකත්ව ප්‍රතිපත්තිය කලින් කලට 
          යාවත්කාලීන කිරීමට ඉඩ ඇත. ඕනෑම වෙනස්කමක් 
          මෙම පිටුවේ පළ කරනු ලබන අතර, "අවසන් වරට යාවත්කාලීන කළ" 
          දිනය ද වෙනස් කරනු ඇත.
        </p>

        {/* --- Section 6 --- */}
        <h2 style={h2Style}>6. අප අමතන්න</h2>
        <p style={pStyle}>
          මෙම පුද්ගලිකත්ව ප්‍රතිපත්තිය පිළිබඳව ඔබට 
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