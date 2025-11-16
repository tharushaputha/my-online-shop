// File: app/layout.js
import { AuthProvider } from "@/context/AuthContext"; 
import "./globals.css";

// === 1. අපි හදපු Loader එක Import කරනවා ===
import InitialLoader from "@/components/InitialLoader";


// --- Metadata (SEO and PWA) ---
export const metadata = {
  // === Title එක SithRoo.Store Branding වලට වෙනස් කළා ===
  title: "SithRoo.Store - Digital Ecosystem | Kitto Classifieds", 
  // === Description එක SithRoo.Store Branding වලට වෙනස් කළා ===
  description: "SithRoo.Store: A secure digital ecosystem featuring the Kitto classifieds platform and future services.",
  
  manifest: "/manifest.json",
  appleWebAppCapable: "yes",
  appleWebAppStatusBarStyle: "default",
  appleWebAppTitle: "SithRoo",
  
  // === GOOGLE VERIFICATION CODE එක මෙතනට දැම්මා ===
  verification: {
    google: 'UFJkCCiICgjs4fMABWRL1Q-cI2Kfot99Y9_z-YHjPSc', 
  },
};

// --- Viewport Export (ThemeColor fix) ---
export const viewport = {
  themeColor: "#1e3a8a", 
};
// -----------------------------------------------------


// --- Main Layout Component ---
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        
        {/* === 2. Loader එක මෙතනට දානවා === */}
        <InitialLoader /> 

        {/* AuthProvider එකෙන් මුළු site එකම wrap කරනවා */}
        <AuthProvider>
          {children} {/* මෙතනට තමයි අනිත් pages (page.jsx) එන්නේ */}
        </AuthProvider>

      </body>
    </html>
  );
}