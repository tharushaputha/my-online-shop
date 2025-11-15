'use client'; 
import React, { useState, useEffect } from 'react';

// === අපි ඊළඟට හදන CSS file එක import කරනවා ===
import './InitialLoader.css'; 

const InitialLoader = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500); // 2.5 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    // 'hidden' class එක දානවා, ඒකෙන් animation එක fade out වෙනවා
    <div className={`loading-overlay ${!isVisible ? 'hidden' : ''}`}>
      <div className="sithroo-loader">
        SithRoo.Store
      </div>
    </div>
  );
};

export default InitialLoader;