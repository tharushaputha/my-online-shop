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
  
  // PWA (Progressive Web App) Settings
  manifest: "/manifest.json",
  // === Theme Color එක Dark Mode එකට වෙනස් කළා ===
  themeColor: "#1e3a8a", 
  appleWebAppCapable: "yes",
  appleWebAppStatusBarStyle: "default",
  // === Apple Web App Title එක SithRoo වලට වෙනස් කළා ===
  appleWebAppTitle: "SithRoo",
  
  // Note: Google Verification code එක මෙතනට දාන්න
  // verification: { google: 'ඔයාගේ_GOOGLE_CODE_එක' }, 
};
// -----------------------------


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