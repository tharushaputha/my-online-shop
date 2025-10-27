// components/LoadingSplash.jsx
'use client';
import React from 'react';

const LoadingSplash = () => {
  // --- Video file path ---
  const videoSrc = "/kitto_loading.mp4"; // Path for file in public folder

  // --- අලුත් Background Color එක ---
  const backgroundColor = '#9be3dd';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: backgroundColor, // අලුත් BG color එක මෙතන
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      {/* Video Container (Crop කරන්න සහ Size එක හදන්න) */}
      <div
        style={{
          width: 'clamp(200px, 70vw, 300px)', // Size එක පොඩ්ඩක් අඩු කළා (adjust if needed)
          aspectRatio: '1 / 1', // හතරැස් වෙන්න
          position: 'relative',
          overflow: 'hidden', // Crop කරන්න
          // backgroundColor: backgroundColor, // Container එකේ BG එකත් Splash එකේම පාට දානවා (blend වෙන්න) - අවශ්‍ය නම් දාන්න
          // borderRadius: '15px', // Round corners ඕන නම් දාන්න
        }}
      >
        <video
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            // Zoom කරලා Badge එක අයින් කරන්න (115% - 120% වගේ try කරන්න)
            width: '120%', // Zoom වැඩි කළා
            height: '120%', // Zoom වැඩි කළා
            objectFit: 'cover',
            transform: 'translate(-50%, -50%)', // මැද තියන්න
          }}
          autoPlay
          muted
          playsInline
          src={videoSrc}
        >
          ඔබගේ බ්‍රවුසරය වීඩියෝ ටැගයට සහාය නොදක්වයි.
        </video>
      </div>
    </div>
  );
};

export default LoadingSplash;