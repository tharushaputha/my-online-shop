'use client'; 

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation'; 

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // --- මෙන්න අලුත් DEBUG CODE එක ---
    console.log("Attempting login with:");
    console.log("Email:", email);
    console.log("Password:", password);
    // ---------------------------------

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
      console.error("Supabase Error:", error.message); // Error එකත් console එකේ පෙන්නමු
    } else {
      setMessage('Login Successful! Redirecting...');
      router.push('/');
    }

    setLoading(false);
  };

  // --- Form එකේ ඉතුරු ටික (වෙනසක් නෑ) ---
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Welcome Back to Kitto
        </h2>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 font-bold text-white bg-primary rounded-md hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Logging In...' : 'Log In'}
            </button>
          </div>
        </form>
        {message && (
          <p className="text-center text-sm text-red-600">{message}</p>
        )}
      </div>
    </div>
  );
};

export default LoginForm;