// components/LoadingSplash.jsx
'use client';
import React from 'react';

const LoadingSplash = () => {
  // --- Video file path (මේක වෙනස් කරේ නෑ) ---
  const videoSrc = "/kitto_loading.mp4"; // public folder එකේ තියෙන file එකේ path එක

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0, // top:0, left:0, width:100%, height:100%
        // ****** BACKGROUND COLOR එක මෙතන වෙනස් කළා ******
        backgroundColor: '#9be3dd', // <-- අලුත් පාට
        // ************************************************
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      {/* Video Container */}
      <div
        style={{
          width: 'clamp(200px, 80vw, 350px)',
          aspectRatio: '1 / 1',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '15px',
        }}
      >
        <video
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '110%',
            height: '110%',
            objectFit: 'cover',
            transform: 'translate(-50%, -50%)',
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