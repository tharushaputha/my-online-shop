// src/app/layout.js
import { Inter } from "next/font/google";
import "./globals.css";

// === 1. Loader එක Import කරන්න (මේක ඔයාගේ code එකේ මිස් වෙලා තිබුනා) ===


// === 2. AuthProvider එක වරහන් {} එක්කම තියන්න (දැන් මේක වැඩ කරනවා) ===
import { AuthProvider } from "@/context/AuthContext"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SithRoo.Store - Digital Ecosystem | Kitto Classifieds",
  description: "SithRoo.Store: A secure digital ecosystem featuring the Kitto classifieds platform and future services.",
  manifest: "/manifest.json",
  appleWebAppCapable: "yes",
  appleWebAppStatusBarStyle: "default",
  appleWebAppTitle: "SithRoo",
  verification: {
    google: 'UFJkCCiICgjs4fMABWRL1Q-cI2Kfot99Y9_z-YHjPSc',
  },
};

export const viewport = {
  themeColor: "#1e3a8a",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        
        {/* Loader එක */}
        

        {/* AuthProvider එක */}
        <AuthProvider>
          {children}
        </AuthProvider>

      </body>
    </html>
  );
}