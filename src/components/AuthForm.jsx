// src/components/AuthForm.jsx
'use client';

import React, { useState } from 'react';
import InputField from './InputField';
import Image from "next/image";
// 1. Supabase Client එක import කරන්න
import { supabase } from '@/lib/supabaseClient';

const AuthForm = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '', // Signup වලට නම
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  // === 2. ඇත්තම Submit Function එක ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLoginView) {
        // --- LOGIN Logic ---
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        console.log('Login Successful!');
        // Login වුනාම AuthContext එකෙන් ඉබේම page එක update වෙයි.

      } else {
        // --- SIGNUP Logic ---
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            // අපි හදපු SQL trigger එකට නම යවන්න මේක ඕනේ
            data: { 
              full_name: formData.fullName || '', 
            },
          },
        });
        if (error) throw error;
        alert('Signup successful! Please check your email to confirm.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col-reverse md:flex-row w-full max-w-[900px] mx-4 transition-all duration-500 hover:shadow-blue-500/10 relative z-20">
      
      {/* LEFT SIDE: Form Section */}
      <div className="w-full md:w-7/12 p-8 md:p-10 lg:p-12 flex flex-col justify-center">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isLoginView ? 'Welcome Back!' : 'Join SithRoo'}
          </h2>
          <p className="text-gray-500">
            {isLoginView ? 'Continue your digital journey.' : 'Create your new account today.'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Signup නම් Full Name field එක පෙන්නනවා */}
          {!isLoginView && (
             <InputField
             type="text"
             name="fullName"
             placeholder="Full Name"
             value={formData.fullName}
             onChange={handleChange}
           />
          )}

          <InputField
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
          />
          <InputField
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          {isLoginView && (
            <div className="flex justify-end pt-1">
              <button type="button" className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors">
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-4 rounded-xl shadow-md transform transition active:scale-95 duration-200 ease-in-out text-lg mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : (isLoginView ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-600 font-medium">
          <p>
            {isLoginView ? "New here? " : "Already a member? "}
            <button
              onClick={() => {
                setIsLoginView(!isLoginView);
                setError(null);
              }}
              className="text-blue-600 font-bold hover:underline ml-1 transition-colors"
            >
              {isLoginView ? 'Create Account' : 'Login'}
            </button>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Image Section (Center Aligned) */}
      <div className="w-full md:w-5/12 bg-blue-50/50 md:bg-transparent flex items-center justify-center p-6 md:p-0 relative overflow-hidden">
        <div className="hidden md:block absolute top-1/2 right-0 translate-x-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-blue-200/30 rounded-full blur-3xl -z-10"></div>
        <div className="relative w-[180px] h-[220px] md:w-[350px] md:h-[450px]">
          <Image
            src="/character.png"
            alt="SithRoo Character"
            fill
            className="object-contain drop-shadow-lg z-10"
            priority
          />
        </div>
      </div>

    </div>
  );
};

export default AuthForm;