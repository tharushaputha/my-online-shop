'use client'; // Client-side data fetching

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

// --- Shop Card Component (මේ page එකට විතරක් අලුතෙන් හදමු) ---
const ShopCard = ({ shop }) => (
  <Link href={`/shop/${shop.id}`} // Shop ID (User ID) එකෙන් link කරනවා
        className="block bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow group p-4 text-center">
    {/* Shop Logo */}
    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center mx-auto mb-3 border">
      {shop.shop_logo_url ? (
        <img src={shop.shop_logo_url} alt={`${shop.shop_name} logo`} className="w-full h-full object-cover" />
      ) : (
        <span className="text-gray-400 text-4xl">🛍️</span> // Default icon
      )}
    </div>
    {/* Shop Name */}
    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary truncate">
      {shop.shop_name || 'Unnamed Shop'}
    </h3>
     {/* Optional: Shop City */}
     {shop.shop_city && (
        <p className="text-sm text-gray-500 mt-1">{shop.shop_city}</p>
     )}
  </Link>
);

// --- Main Shops Page Component ---
export default function ShopsPage() {
  const [shops, setShops] = useState([]); // Shops list එක තියාගන්න
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShops = async () => {
      setLoading(true);
      setError(null);

      try {
        // 'profiles' table එකෙන් is_shop = true තියෙන profiles ටික select කරනවා
        // Shop එකට අවශ්‍ය columns විතරක් select කරමු: id, shop_name, shop_logo_url, shop_city
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('id, shop_name, shop_logo_url, shop_city') // Select specific columns
          .eq('is_shop', true) // Shops විතරක්
          .order('shop_name', { ascending: true }); // නම අනුව sort කරමු

        if (fetchError) {
          throw fetchError;
        }

        console.log("Shops fetched:", data);
        setShops(data || []); // Shops ටික state එකට දානවා

      } catch (error) {
        console.error('Error fetching shops:', error);
        setError(`Could not fetch shops: ${error.message}`);
        setShops([]);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []); // Mount වෙද්දි එක පාරක් fetch කරනවා

  return (
    <>
      <Header />
      <main className="bg-gray-100 min-h-screen py-10">
        <div className="container mx-auto px-4">
          {/* Page Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
            Discover Shops on Kitto
          </h1>

          {/* Display Logic */}
          {loading && <p className="text-center">Loading shops...</p>}
          {error && <p className="text-center text-red-600">{error}</p>}
          {!loading && !error && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {shops.length > 0 ? (
                shops.map((shop) => <ShopCard key={shop.id} shop={shop} />)
              ) : (
                <p className="text-center col-span-full text-gray-500 py-6">
                  No shops have been set up yet.
                </p>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}