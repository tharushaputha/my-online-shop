// src/app/page.js
'use client'; 

// 1. අවශ්‍ය Components import කරගන්න
import AuthForm from "@/components/AuthForm";
import Dashboard from "@/components/Dashboard"; // අපි අලුතෙන් හදපු Dashboard එක
import { useAuth } from "@/context/AuthContext"; // User ඉන්නවද බලන hook එක

export default function Home() {
  // 2. User ගේ විස්තර ගන්න
  const { user, loading } = useAuth();

  // Loading වෙනකොට මුකුත් නොපෙන්වා ඉන්න (නැත්නම් පොඩි වෙලාවකට Login form එක පේන්න පුළුවන්)
  if (loading) {
    return null; // නැත්නම් මෙතනට Loading spinner එකක් දාන්නත් පුළුවන්
  }

  return (
    <main className="min-h-screen w-full">
      
      {/* --- CONDITION CHECK --- */}
      {user ? (
        
        // ▶ SCENARIO 1: USER IS LOGGED IN
        // අලුත් Dashboard Component එක පෙන්නන්න
        <Dashboard user={user} />

      ) : (
        
        // ▶ SCENARIO 2: USER IS NOT LOGGED IN
        // පරණ Login Page Design එක පෙන්නන්න
        <div className="min-h-screen w-full bg-[#F0F4F8] flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
            
            {/* Background Blurs */}
            <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-blue-200/40 rounded-full blur-[100px] -z-10"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-purple-200/30 rounded-full blur-[100px] -z-10"></div>

            {/* Title */}
            <div className="text-center mb-8 md:mb-12 animate-fade-in z-10">
              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-3 drop-shadow-sm">
                SithRoo
              </h1>
              <p className="text-gray-600 text-lg md:text-xl font-medium">
                Your Secure Digital Ecosystem
              </p>
            </div>

            {/* Login/Signup Form Card */}
            <div className="w-full flex justify-center animate-fade-in-up z-10">
              <AuthForm />
            </div>
        </div>

      )}
    </main>
  );
}