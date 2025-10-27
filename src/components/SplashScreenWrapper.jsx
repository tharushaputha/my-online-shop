// components/SplashScreenWrapper.jsx
'use client';

import { useState, useEffect } from 'react';
import LoadingSplash from './LoadingSplash';
import { AuthProvider } from "@/context/AuthContext";

const SplashScreenWrapper = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  // --- 1. අලුත් State එකක්: Component එක mount වුනාද බලන්න ---
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // --- 2. Component එක mount වුන ගමන් මේක true කරනවා ---
    setHasMounted(true);

    // Video එක ඉවර වෙන වෙලාව (e.g., 4000ms = 4 seconds)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000); // <-- Adjust this time if needed

    return () => clearTimeout(timer);
  }, []); // Run only once on mount

  // --- 3. Render Logic එක වෙනස් කළා ---
  if (!hasMounted) {
    // Component එක mount වෙනකම්, Server එක render කරපු දේම (AuthProvider + children)
    // පෙන්නන්න උත්සාහ කරමු (hydration error එක නැති වෙන්න).
    // නැත්නම් null return කරන්නත් පුළුවන් මුකුත් නොපෙන්න ඉන්න.
    // Let's return the children directly to match server render initially.
     return (
        <AuthProvider>
            {children}
        </AuthProvider>
     );
    // return null; // Or return null to show nothing until mounted
  }

  // Component එක mount වුනාට පස්සේ, loading state එක අනුව පෙන්නන දේ තීරණය කරනවා
  if (isLoading) {
    return <LoadingSplash />; // Loading නම් Video එක පෙන්නන්න
  }

  // Loading ඉවර නම්, Content එක පෙන්නන්න
  return (
      <AuthProvider>
        {children}
      </AuthProvider>
  );
};

export default SplashScreenWrapper;