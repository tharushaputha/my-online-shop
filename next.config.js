// next.config.js

const withPWA = require('next-pwa')({
  dest: 'public', // PWA files ටික save වෙන තැන
  register: true, // Service worker එක auto register කරනවා
  skipWaiting: true, // අලුත් update එකක් ආපු ගමන් auto දානවා
  disable: process.env.NODE_ENV === 'development', // 'npm run dev' වලදී PWA එක disable කරනවා
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // --- ඔයාගේ පරණ images config එක මෙතනට දැම්මා ---
  images: {
    domains: ['ezeeongazmloinghitxl.supabase.co'], // <-- ඔයාගේ hostname එක
  },
  // ---------------------------------------------
  reactStrictMode: true,
  // ඔයාට තව config තියෙනවා නම් මෙතනට දාන්න...
};

// PWA config එක Next.js config එකත් එක්ක එකතු කරනවා
module.exports = withPWA(nextConfig);