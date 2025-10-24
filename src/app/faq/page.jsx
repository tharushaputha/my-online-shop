// File එක: app/faq/page.jsx

import React from 'react';
// මේ page එකට icons ඕන නෑ

// FAQ පිටුව සඳහා වන React component එක
export default function FAQPage() {
  
  // පාට (Colors) - අනිත් පිටු වලම ඒවා
  const MINT_GREEN_BG = '#F0FFF4'; // හරිම ලා Mint Green පාටක්
  const HEADING_PINK = '#D81B60';  // ලස්සන, đậm (deep) Pink පාටක්
  const TEXT_COLOR = '#334155'; // කියවන්න පහසු, තද අළු පාටක්
  const CARD_BG = '#FFFFFF';    // සුදු පාට Card එක

  // FAQ එකක ප්‍රශ්නය (Question) සඳහා style
  const questionStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: TEXT_COLOR,
    padding: '18px 20px',
    backgroundColor: '#F9FAFB', // ලා අළු පාටක්
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    cursor: 'pointer', // click කරන්න පුළුවන් කියලා පෙන්නන්න
    display: 'block', // සම්පූර්ණ පළල ගන්න
  };

  // FAQ එකක උත්තරය (Answer) සඳහා style
  const answerStyle = {
    fontSize: '16px',
    color: TEXT_COLOR,
    lineHeight: '1.7',
    padding: '20px',
    border: '1px solid #E5E7EB',
    borderTop: 'none', // උඩ border එක අයින් කරනවා
    borderRadius: '0 0 8px 8px', // යට corners දෙක විතරක් round
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
      }}>
        
        {/* ප්‍රධාන මාතෘකාව */}
        <h1 style={{ 
          fontSize: '42px', 
          fontWeight: 'bold', 
          marginBottom: '25px', 
          color: HEADING_PINK,
          textAlign: 'center', // මාතෘකාව මැදට
        }}>
          නිතර අසන ප්‍රශ්න (FAQ)
        </h1>

        {/* හැඳින්වීමේ ඡේදය */}
        <p style={{ 
          fontSize: '17px', 
          color: TEXT_COLOR, 
          marginBottom: '40px',
          lineHeight: '1.8',
          textAlign: 'center',
        }}>
          ඔබට ඇති පොදු ගැටළු සහ ඒවාට පිළිතුරු මෙතැනින් බලන්න.
        </p>

        {/* FAQ ප්‍රශ්න ටික */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {/* ප්‍රශ්නය 1 */}
          <details>
            <summary style={questionStyle}>
              මම Kittoweb හි ගිණුමක් සාදා ගන්නේ කෙසේද?
            </summary>
            <div style={answerStyle}>
              මුල් පිටුවේ ඇති "Sign Up" හෝ "ලියාපදිංචි වන්න" බොත්තම ක්ලික් කරන්න. ඉන්පසු ඔබේ 
              විස්තර (නම, ඊමේල්, මුරපදය) ඇතුළත් කර ගිණුම සාදාගන්න. එය සම්පූර්ණයෙන්ම නොමිලේ!
            </div>
          </details>

          {/* ප්‍රශ්නය 2 */}
          <details>
            <summary style={questionStyle}>
              විකිණීම සඳහා දැන්වීමක් (Ad) පළ කරන්නේ කෙසේද?
            </summary>
            <div style={answerStyle}>
              ඔබ ලොග් (log) වූ පසු, "Post Ad" හෝ "දැන්වීමක් පළ කරන්න" බොත්තම ක්ලික් කරන්න.
              ඉන්පසු ඔබේ භාණ්ඩයේ විස්තර, ඡායාරූප, මිල සහ ප්‍රවර්ගය (category) තෝරා 
              දැන්වීම පළ කරන්න.
            </div>
          </details>

          {/* ප්‍රශ්නය 3 */}
          <details>
            <summary style={questionStyle}>
              භාණ්ඩයක් මිලදී ගන්නේ කෙසේද?
            </summary>
            <div style={answerStyle}>
              ඔබට අවශ්‍ය භාණ්ඩය තෝරා, එහි ඇති විකුණුම්කරුගේ (seller) තොරතුරු (දුරකථන අංකය 
              හෝ chat) හරහා ඔහුව සම්බන්ධ කරගන්න. Kittoweb යනු ගැනුම්කරු සහ විකුණුම්කරු 
              සම්බන්ධ කරන වේදිකාවකි. ගනුදෙනුව ඔබ දෙදෙනා අතර සෘජුවම සිදු විය යුතුය.
            </div>
          </details>

          {/* ප්‍රශ්නය 4 */}
          <details>
            <summary style={questionStyle}>
              මගේ දැන්වීම ඉහළින් තබා ගන්නේ (Boost/Top) කෙසේද?
            </summary>
            <div style={answerStyle}>
              ඔබේ "My Ads" (මගේ දැන්වීම්) පිටුවට ගොස්, ඔබට boost කිරීමට අවශ්‍ය දැන්වීම 
              තෝරන්න. ඉන්පසු "Boost Ad" විකල්පය තෝරා ගෙවීම් කිරීමෙන් ඔබට දැන්වීම 
              ඉහළින් ප්‍රදර්ශනය කළ හැක.
            </div>
          </details>
          
          {/* ප්‍රශ්නය 5 */}
          <details>
            <summary style={questionStyle}>
              වංචා සහගත දැන්වීමක් (Scam Ad) දුටුවොත් කුමක් කළ යුතුද?
            </summary>
            <div style={answerStyle}>
              සෑම දැන්වීමක් යටතේම ඇති "Report Ad" (දැන්වීම වාර්තා කරන්න) බොත්තම ක්ලික් 
              කරන්න. අපගේ කණ්ඩායම එය වහාම පරීක්ෂා කර බලා අවශ්‍ය පියවර ගනු ඇත.
            </div>
          </details>

        </div>

      </div>
    </div>
  );
}