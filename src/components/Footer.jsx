// File: components/Footer.jsx (හෝ ඔයාගේ Footer file එක)

import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    // bg-gray-800: තද අළු පසුබිම
    // text-gray-300: ලා අළු අකුරු
    // py-12: උඩ සහ යට ලොකු padding එකක්
    <footer className="bg-gray-800 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        
        {/* ප්‍රධාන කොටස තීරු 3කට බෙදනවා (md screen වලදී) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">

          {/* 1. Logo සහ විස්තරය */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">kitto</h3>
            <p className="text-sm">
              Sri Lanka's cutest marketplace to find your next treasure.
            </p>
          </div>

          {/* 2. ඉක්මන් Links (Quick Links) */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {/* මේ path ටික අපි හදපු folder නම් වලට ගැලපෙනවා */}
              <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-primary">FAQ</Link></li>
            </ul>
          </div>

          {/* 3. නීතිමය Links (Legal) */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              {/* '/privacy' නෙවෙයි, '/privacy-policy' */}
              <li><Link href="/privacy-policy" className="hover:text-primary">Privacy Policy</Link></li>
              
              {/* '/terms' නෙවෙයි, '/terms-of-service' */}
              <li><Link href="/terms-of-service" className="hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright කොටස (උඩ කොටසෙන් වෙන් කරන්න ඉරක්) */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Kitto. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;