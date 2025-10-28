// File: app/layout.js
// (Server Component - 'use client' නැත)

import { AuthProvider } from "@/context/AuthContext";
import InitialLoader from "@/components/InitialLoader";
import "./globals.css";

// --- Metadata (SEO and PWA) ---
export const metadata = {
  title: "Kitto - Find Your Next Treasure",
  description: "Buy and sell new and used items in Sri Lanka",
  
  // PWA (Progressive Web App) Settings
  manifest: "/manifest.json",
  themeColor: "#9be3dd", // (manifest.json එකේ දාපු පාටමයි)
  appleWebAppCapable: "yes",
  appleWebAppStatusBarStyle: "default",
  appleWebAppTitle: "Kitto",
};
// -----------------------------


// --- Main Layout Component ---
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Next.js 13+ (App Router) වලදී <head> tag එක
        වෙනම දාන්න අවශ්‍ය නෑ. 'metadata' object එකෙන්
        ඒක handle කරගන්නවා.
      */}
      <body>
        
        {/* Page මුලින්ම load වෙද්දී එන Loader එක */}
        <InitialLoader />
        
        {/* AuthProvider එකෙන් මුළු site එකම wrap කරනවා */}
        <AuthProvider>
          {children} {/* මෙතනට තමයි අනිත් pages (page.jsx) එන්නේ */}
        </AuthProvider>

      </body>
    </html>
  );
}