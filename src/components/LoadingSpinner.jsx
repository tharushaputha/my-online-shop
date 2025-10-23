'use client';

import React from 'react';
// --- CSS import එක අයින් කළා (ඒක දැන් globals.css එකේ තියෙන්නේ) ---
// import '../app/loading.css'; 

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="paw-loader-container" aria-live="polite" aria-busy="true">
      <div className="paw-loader">
        <div className="paw"></div>
        <div className="paw"></div>
        <div className="paw"></div>
        <div className="paw"></div>
      </div>
      <div className="paw-loader-text">{message}</div>
    </div>
  );
};

export default LoadingSpinner;