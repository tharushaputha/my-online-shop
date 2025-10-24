'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa'; // WhatsApp Icon එකට

// --- AdCard Component (මේක වෙනම file එකක තිබ්බනම් තවත් හොඳයි, ඒත් මේ විදිහත් 100% වැඩ) ---
const AdCard = ({ ad }) => (
  <Link
    href={`/ad/${ad.id}`}
    className="block bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow group"
  >
    <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
      {ad.image_urls && ad.image_urls.length > 0 ? (
        <img
          src={ad.image_urls[0]}
          alt={ad.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          loading="lazy"
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <span className="text-gray-500">No Image</span>
        </div>
      )}
    </div>
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-800 truncate mb-1 group-hover:text-primary">
        {ad.title}
      </h3>
      <p className="text-xl font-bold text-primary mb-2">
        Rs. {ad.price.toLocaleString()}
      </p>
      <p className="text-sm text-gray-600">{ad.location}</p>
    </div>
  </Link>
);

// --- Main Shop Page Component ---
export default function ShopPage() {
  const params = useParams();
  const { shopId } = params; // URL එකෙන් '[shopId]' කොටස ගන්නවා (User ID එක)
  const [shopProfile, setShopProfile] = useState(null); // Shop details තියාගන්න
  const [shopAds, setShopAds] = useState([]); // Shop එකේ Ads තියාගන්න
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // formatWhatsAppNumber function (WhatsApp link හදන්න)
  const formatWhatsAppNumber = (number) => {
    if (!number) return null;
    let cleaned = number.replace(/[-\s]/g, '');
    if (cleaned.startsWith('07')) {
      cleaned = '94' + cleaned.substring(1);
    }
    return cleaned;
  };

  useEffect(() => {
    const fetchShopData = async () => {
      if (!shopId) return; // ID එකක් නැත්නම් මුකුත් කරන්න එපා

      console.log('Fetching data for Shop (User ID):', shopId);
      setLoading(true);
      setError(null);
      setShopProfile(null); // Reset previous data
      setShopAds([]); // Reset previous data

      try {
        // --- 1. Shop Profile Details Fetch කරනවා ---
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*') // හැම column එකක්ම ගන්නවා
          .eq('id', shopId) // URL එකේ ආපු user ID එකට සමාන profile එක
          .eq('is_shop', true) // ඒක shop එකක් වෙන්නත් ඕන
          .single(); // එක profile එකයි තියෙන්න ඕන

        if (profileError && profileError.code !== 'PGRST116') {
          // 'row not found' කියන error එක ignore කරනවා
          console.error('Error fetching shop profile:', profileError);
          throw new Error(`Could not fetch shop profile: ${profileError.message}`);
        }

        if (!profileData) {
          // Profile එකක් හම්බවුනේ නැත්නම් හෝ is_shop = false නම්
          setError('Shop not found or is not a registered shop.');
          setLoading(false);
          return;
        }
        console.log('Shop Profile Data:', profileData);
        setShopProfile(profileData); // Profile data ටික state එකට දානවා

        // --- 2. Shop එකේ Active Ads Fetch කරනවා ---
        const { data: adsData, error: adsError } = await supabase
          .from('ads')
          .select('*')
          .eq('user_id', shopId) // මේ shop එකේ user ID එකට අදාළ ads
          .eq('is_sold', false) // විකිණිලා නැති ඒවා විතරක්
          .order('created_at', { ascending: false }); // අලුත්ම ඒවා මුලට

        if (adsError) {
          console.error('Error fetching shop ads:', adsError);
          setError(`Could not fetch ads for this shop: ${adsError.message}`);
        } else {
          console.log('Shop Ads Data:', adsData);
          setShopAds(adsData || []); // Ads ටික state එකට දානවා
        }
      } catch (catchError) {
        console.error('Overall error fetching shop data:', catchError);
        setError(catchError.message);
        setShopProfile(null);
        setShopAds([]);
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, [shopId]); // shopId එක වෙනස් වුණොත් ආයෙත් fetch කරනවා

  // --- Display Logic ---
  return (
    <>
      <Header />
      <main className="bg-gray-100 min-h-screen py-10">
        {loading && <p className="text-center py-10">Loading shop details...</p>}
        {error && <p className="text-center py-10 text-red-600">{error}</p>}

        {/* Loading නැත්නම් සහ Profile එකක් තියෙනවා නම් විතරක් පෙන්නනවා */}
        {!loading && shopProfile && (
          <div className="container mx-auto px-4">
            
            {/* --- Shop Header Section --- */}
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-md mb-8 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Shop Logo */}
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0 border">
                {shopProfile.shop_logo_url ? (
                  <img
                    src={shopProfile.shop_logo_url}
                    alt={`${shopProfile.shop_name} logo`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-3xl">🛍️</span> // Default icon
                )}
              </div>
              {/* Shop Details */}
              <div className="text-center sm:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-1">
                  {shopProfile.shop_name}
                </h1>
                <p className="text-gray-600 mb-2">
                  {shopProfile.shop_description || 'No description provided.'}
                </p>
                {/* Contact Info */}
                <div className="flex flex-wrap justify-center sm:justify-start items-center text-sm text-gray-500 space-x-4">
                  {shopProfile.shop_city && (
                    <span>📍 {shopProfile.shop_city}</span>
                  )}
                  {shopProfile.shop_whatsapp_number && (
                    <a
                      href={`https://wa.me/${formatWhatsAppNumber(
                        shopProfile.shop_whatsapp_number
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center hover:text-green-600"
                    >
                      <FaWhatsapp className="w-4 h-4 mr-1" /> WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* --- Shop Ads Section --- */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-6">
                Active Ads from this Shop
              </h2>
              {shopAds.length > 0 ? (
                
                /* =============================================
                   !!! MAMA WENAS KALE ME LINE EKA VITHARAI !!!
                   =============================================
                   grid-cols-1 -> grid-cols-2 (Mobile wala columns 2k)
                   gap-6 -> gap-4 (Mobile wala box athara ida adu kala)
                   sm:grid-cols-2 -> sm:grid-cols-3 (Tablet wala columns 3k)
                */
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
                  {shopAds.map((ad) => (
                    <AdCard key={ad.id} ad={ad} />
                  ))}
                </div>
                
              ) : (
                <p className="text-center text-gray-500 py-6">
                  This shop hasn't posted any active ads yet.
                </p>
              )}
            </div>
          </div>
        )}
        
        {/* Loading නැත්නම්, Error නැත්නම්, ඒත් Profile නැත්නම් (Shop Not Found) */}
        {!loading && !shopProfile && !error && (
          <p className="text-center py-10 text-gray-500">Shop not found.</p>
        )}
      </main>
      <Footer />
    </>
  );
}