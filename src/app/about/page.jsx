// File එක: app/about/page.jsx

import React from 'react';
// Image component එක අපිට දැන් ඕන නෑ, ඒ නිසා අයින් කළා.

// About Us පිටුව සඳහා වන React component එක
export default function AboutUsPage() {
  
  // පාට (Colors)
  const MINT_GREEN_BG = '#F0FFF4'; // හරිම ලා Mint Green පාටක් (Honeydew)
  const HEADING_PINK = '#D81B60';  // ලස්සන, đậm (deep) Pink පාටක්
  const TEXT_COLOR = '#334155'; // කියවන්න පහසු, තද අළු පාටක්

  return (
    // ප්‍රධාන පිටුවට අදාළ div එක
    <div style={{
      backgroundColor: MINT_GREEN_BG, // පසුබිම Mint Green
      minHeight: '100vh', // සම්පූර්ණ screen එකම cover වෙන්න
      padding: '50px 20px', // උඩ/යට සහ වම්/දකුණ ඉඩ
      fontFamily: 'Arial, sans-serif',
    }}>
      
      {/* අන්තර්ගතය තියෙන Box එක */}
      <div style={{ 
        maxWidth: '900px',
        margin: '0 auto', // මැදට එන්න
        padding: '40px',
        backgroundColor: '#FFFFFF', // ඇතුළත Box එක සුදු පාටින්
        borderRadius: '15px', // ලස්සනට round corners
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)', // පොඩි shadow එකක්
        textAlign: 'center', // හැමදේම මැදට
      }}>
        
        {/* ප්‍රධාන මාතෘකාව */}
        <h1 style={{ 
          fontSize: '42px', 
          fontWeight: 'bold', 
          marginBottom: '25px', 
          color: HEADING_PINK, // මාතෘකාව Pink පාටින්
        }}>
          අප ගැන (About Us)
        </h1>

        {/* හැඳින්වීමේ ඡේදය */}
        <p style={{ 
          fontSize: '17px', 
          color: TEXT_COLOR, 
          marginBottom: '20px',
          lineHeight: '1.8',
        }}>
          <strong>Kittoweb</strong> වෙත ඔබව සාදරයෙන් පිළිගනිමු! අපි ශ්‍රී ලංකාවේ ගැනුම්කරුවන් සහ විකුණුම්කරුවන් පහසුවෙන් සම්බන්ධ කරන ඔන්ලයින් වෙළඳපොළක් නිර්මාණය කිරීමට කැපවී සිටිමු.
        </p>
        
        <p style={{ 
          fontSize: '17px', 
          color: TEXT_COLOR, 
          marginBottom: '30px',
          lineHeight: '1.8',
        }}>
          ඔබ අලුත් හෝ පාවිච්චි කළ භාණ්ඩයක් විකිණීමට බලාපොරොත්තු වුවත්, හෝ ඔබට අවශ්‍ය දේ හොඳම මිලට සොයා ගැනීමට උත්සාහ කළත්, ඒ සඳහා ආරක්ෂිත, විශ්වාසදායී සහ භාවිතයට පහසු වේදිකාවක් සැපයීම අපගේ අරමුණයි.
        </p>

        {/* !!!!! Kitto Image එක තිබුණු div එක මෙතනින් අයින් කළා !!!!! */}

        {/* දැක්ම සහ මෙහෙවර තීරු 2කින් */}
        <div style={{ 
          display: 'flex', // තීරු 2ක් හදන්න
          justifyContent: 'space-between', // දෙපැත්තට වෙන්න
          gap: '30px', // තීරු 2 අතර ඉඩ
          marginTop: '40px', // උඩින් පොඩි ඉඩක්
          textAlign: 'left', // මේ Box එකේ text එක වමට
        }}>
          
          {/* දැක්ම Box එක */}
          <div style={{ flex: 1 }}> {/* flex: 1 දාලා තීරු 2ක සමාන පළලක් දෙනවා */}
            <h2 style={{ 
              fontSize: '28px', 
              fontWeight: 'bold', 
              marginBottom: '15px',
              color: HEADING_PINK, // Pink පාටින්
            }}>
              අපේ දැක්ම (Our Vision)
            </h2>
            <p style={{ fontSize: '16px', color: TEXT_COLOR, lineHeight: '1.7' }}>
              ශ්‍රී ලංකාවේ e-commerce ක්ෂේත්‍රයේ වඩාත්ම විශ්වාසවන්ත, ජනප්‍රියම සහ පරිශීලක-හිතකාමී නාමය බවට පත්වීම.
            </p>
          </div>

          {/* මෙහෙවර Box එක */}
          <div style={{ flex: 1 }}>
            <h2 style={{ 
              fontSize: '28px', 
              fontWeight: 'bold', 
              marginBottom: '15px',
              color: HEADING_PINK, // Pink පාටින්
            }}>
              අපේ මෙහෙවර (Our Mission)
            </h2>
            <p style={{ fontSize: '16px', color: TEXT_COLOR, lineHeight: '1.7' }}>
              නවීන තාක්ෂණය උපයෝගී කරගනිමින්, ඕනෑම කෙනෙකුට, පහසුවෙන් සහ ආරක්ෂිතව භාණ්ඩ මිලදී ගැනීමට සහ විකිණීමට හැකි පරිසරයක් ගොඩනැගීම.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}