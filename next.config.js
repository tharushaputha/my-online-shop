// next.config.js

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // "domains" (පරණ ක්‍රමය) වෙනුවට අලුත් "remotePatterns" ක්‍රමය පාවිච්චි කරමු
    remotePatterns: [
      {
        protocol: 'https',
        // ****** මෙතන තමයි Typo එක Fix කලේ ******
        hostname: 'iezeongazmloinqhitxi.supabase.co', 
        // *******************************************
        port: '',
        pathname: '/storage/v1/object/public/**', // Supabase storage වල ඕනෑම path එකක් allow කරනවා
      },
    ],
  },
};

// PWA config එක Next.js config එකත් එක්ක එකතු කරනවා
module.exports = withPWA(nextConfig);