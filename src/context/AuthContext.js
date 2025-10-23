'use client'; 

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // --- මෙන්න වෙනස තියෙන තැන ---
    // 1. මුලින් session එක ගන්නවා
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false); // මෙතන loading false කරන්න ඕන
    }).catch((error) => {
      console.error("Error getting initial session:", error);
      setLoading(false); // Error එකක් ආවත් loading අයින් කරන්න
    });

    // 2. Auth state එක වෙනස් වෙනකොට අහන් ඉන්න Listener එක
    const { data: { subscription } } = supabase.auth.onAuthStateChange( // මෙතන data වලින් subscription එක ගන්නවා
      (event, session) => {
        setSession(session);
        // setLoading(false); // මෙතන ආයෙත් loading false කරන්න ඕන නෑ
      }
    );

    // cleanup function එක: component එක unmount වෙනකොට listener එක අයින් කරනවා
    return () => {
      subscription?.unsubscribe(); // මෙතන subscription එකේ unsubscribe එක call කරනවා
    };
    // -----------------------------

  }, []); // හිස් array එක තියෙන නිසා මේක mount වෙද්දි විතරයි run වෙන්නේ

  const value = {
    session,
    loading, // loading state එකත් pass කරනවා
  };

  // Loading ඉවර වෙනකම් මුකුත් පෙන්නන්න එපා
  //return loading ? null : <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>; // Loading එක දැනට අයින් කරමු, error එකක් ආවොත් බලන්න
}

export function useAuth() {
  return useContext(AuthContext);
}