import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import InitialLoader from "@/components/InitialLoader"; // --- 1. Loader එක import කරනවා ---

export const metadata = {
  title: "Kitto - Find Your Next Treasure",
  description: "Buy and sell new and used items in Sri Lanka",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
         {/* --- 2. Loader එක මෙතනට දානවා --- */}
        <InitialLoader />
        {/* ------------------------------- */}
        <AuthProvider>
          {children} {/* අනිත් content එක Loader එකට යටින් තියෙන්නේ */}
        </AuthProvider>
      </body>
    </html>
  );
}