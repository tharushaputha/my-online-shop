'use client'; 

import React, { useState, useEffect } from 'react';
import '../app/loading.css'; // CSS file

const InitialLoader = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // --- 1. Delay එක 1500ms (1.5s) ඉඳන් 2500ms (2.5s) ට වැඩි කළා ---
    // මේක අර CSS එකේ අන්තිම animation delay (1.0s) + duration (1.5s) එකට ගැලපෙනවා
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500); // 2.5 seconds
    // ----------------------------------------------------

    return () => clearTimeout(timer); // Cleanup
  }, []);

  // 2. "kitto" වචනේ අකුරු ටික වෙන වෙනම span වල දාලා තියෙනවද බැලුවා
  return (
    <div className={`loading-overlay ${!isVisible ? 'hidden' : ''}`}>
      <div className="kitto-loader">
        <span>k</span>
        <span>i</span>
        <span>t</span>
        <span>t</span>
        <span>o</span>
      </div>
    </div>
  );
};

export default InitialLoader;