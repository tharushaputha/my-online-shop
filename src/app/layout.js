// app/layout.js
// NO 'use client' here - Server Component

import { AuthProvider } from "@/context/AuthContext";
import InitialLoader from "@/components/InitialLoader"; // <-- ඔයාගේ Loader එක import කරලා
import "./globals.css";

// Metadata හරියටම තියෙනවා
export const metadata = {
  title: "Kitto - Find Your Next Treasure",
  description: "Buy and sell new and used items in Sri Lanka",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* --- Loader එක මෙතන --- */}
        <InitialLoader />
        {/* -------------------- */}
        <AuthProvider>
          {children} {/* අනිත් content එක AuthProvider ඇතුළේ */}
        </AuthProvider>
      </body>
    </html>
  );
}