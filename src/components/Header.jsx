'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { FaPhoneAlt } from 'react-icons/fa';
import { Menu, Transition } from '@headlessui/react';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { Fragment, useState, useEffect } from 'react';

// --- Menu Items List Definitions ---
const loggedInMenuItems = [
  { href: '/my-ads', label: 'My Ads' },
  { href: '/account/settings', label: 'Settings' },
];
const loggedOutMenuItems = [
  { href: '/login', label: 'Log In' },
  { href: '/signup', label: 'Sign Up' },
];
const commonMenuItems = [
  { href: '/', label: 'Home' },
  { href: '/shops', label: 'Shops' },
  { href: '/kitto-drop', label: 'Kitto Drop' }, // New Item
];
// --------------------------------------------------------------------

const Header = () => {
  const { session } = useAuth();
  const router = useRouter();
  const hotline = '+94 78 449 7070';

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <header className="bg-secondary shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <Image src="/logo.png" alt="Kitto Logo" width={120} height={40} priority />
        </Link>

        {/* Hotline */}
        <div className="hidden md:flex items-center space-x-2 text-gray-800 font-semibold">
          <FaPhoneAlt className="w-4 h-4" />
          <span>{hotline}</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-2 md:space-x-4">
          <Link href="/" className="bg-white text-primary font-bold py-2 px-4 rounded-full hover:bg-gray-100"> Home </Link>
          <Link href="/shops" className="bg-white text-primary font-bold py-2 px-4 rounded-full hover:bg-gray-100"> Shops </Link>
          {/* === New Button === */}
          <Link href="/kitto-drop" className="bg-white text-primary font-bold py-2 px-4 rounded-full hover:bg-gray-100"> Kitto Drop </Link>
          {/* ================== */}
          <Link href="/post-ad" className="bg-primary text-white font-bold py-2 px-6 rounded-full hover:opacity-90"> + Post Ad </Link>

          {/* Conditional Auth Links */}
          {session ? (
            <>
              <Link href="/my-ads" className="bg-white text-primary font-bold py-2 px-4 rounded-full hover:bg-gray-100"> My Ads </Link>
              <Link href="/account/settings" className="bg-white text-primary font-bold py-2 px-4 rounded-full hover:bg-gray-100" title="Settings"> Settings </Link>
              <button onClick={handleLogout} className="bg-white text-red-500 font-bold py-2 px-4 rounded-full hover:bg-gray-100"> Log Out </button>
            </>
          ) : (
            <>
              <Link href="/login" className="bg-white text-primary font-bold py-2 px-4 rounded-full hover:bg-gray-100"> Log In </Link>
              <Link href="/signup" className="bg-white text-primary font-bold py-2 px-4 rounded-full hover:bg-gray-100"> Sign Up </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <Link href="/post-ad" className="bg-primary text-white font-bold py-1 px-3 rounded-full text-sm mr-2"> + Post Ad </Link>

          {/* Hydration check for Menu */}
          {isClient && (
            <Menu as="div" className="relative inline-block text-left">
              {({ open }) => (
                <>
                  <Menu.Button className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-2 py-1 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                    {open ? ( <HiOutlineX className="h-5 w-5" /> ) : ( <HiOutlineMenu className="h-5 w-5" /> )}
                  </Menu.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {/* Common Links */}
                      <div className="py-1">
                        {commonMenuItems.map((item) => (
                          <Menu.Item key={item.label}>
                            {({ active }) => (
                              <Link href={item.href} className={`${ active ? 'bg-gray-100' : '' } block px-4 py-2 text-sm text-gray-700`}>
                                {item.label}
                              </Link>
                            )}
                          </Menu.Item>
                        ))}
                      </div>
                      {/* Auth Specific Links */}
                      <div className="py-1">
                        {(session ? loggedInMenuItems : loggedOutMenuItems).map((item) => (
                          <Menu.Item key={item.label}>
                            {({ active }) => (
                              <Link href={item.href} className={`${ active ? 'bg-gray-100' : '' } block px-4 py-2 text-sm text-gray-700`}>
                                {item.label}
                              </Link>
                            )}
                          </Menu.Item>
                        ))}
                        {/* Logout Button */}
                        {session && (
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={handleLogout}
                                className={`${ active ? 'bg-gray-100' : '' } block w-full px-4 py-2 text-left text-sm text-red-600`}
                              >
                                Log Out
                              </button>
                            )}
                          </Menu.Item>
                        )}
                      </div>
                    </Menu.Items>
                  </Transition>
                </>
              )}
            </Menu>
          )}
          {/* Fallback for SSR/initial render */}
          {!isClient && (
            <div className="px-2 py-1 border border-gray-300 rounded-md bg-white">
              <HiOutlineMenu className="h-5 w-5 text-gray-400" />
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;