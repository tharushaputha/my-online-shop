// File: app/layout.js
import { AuthProvider } from "@/context/AuthContext"; 
import "./globals.css";

// === 1. අපි හදපු Loader එක Import කරනවා ===
import InitialLoader from "@/components/InitialLoader";


// --- Metadata (SEO and PWA) ---
export const metadata = {
  title: "Kitto - Find Your Next Treasure",
  description: "Buy and sell new and used items in Sri Lanka",
  manifest: "/manifest.json",
  themeColor: "#9be3dd", 
  appleWebAppCapable: "yes",
  appleWebAppStatusBarStyle: "default",
  appleWebAppTitle: "Kitto",
};
// -----------------------------


// --- Main Layout Component ---
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        
        {/* === 2. Loader එක මෙතනට දානවා === */}
        {/* මේක AuthProvider එකටත් උඩින් එනවා */}
        <InitialLoader /> 

        {/* AuthProvider එකෙන් මුළු site එකම wrap කරනවා */}
        <AuthProvider>
          {children} {/* මෙතනට තමයි අනිත් pages (page.jsx) එන්නේ */}
        </AuthProvider>

      </body>
    </html>
  );
}