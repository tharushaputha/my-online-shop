'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
// import LoadingSpinner from './LoadingSpinner'; // --- 1. Import එක අයින් කළා ---

// AdCard Component (වෙනසක් නෑ)
const AdCard = ({ ad }) => {
  const router = useRouter();
  const handleShopLinkClick = (e, userId) => { e.stopPropagation(); router.push(`/shop/${userId}`); };
  const isCurrentlyFeatured = ad.is_featured && ad.featured_until && new Date(ad.featured_until) > new Date();
  return (
    <Link href={`/ad/${ad.id}`} className="block bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow group relative">
      {isCurrentlyFeatured && !ad.is_sold && ( <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded z-10 animate-pulse">🚀 Boosted</div> )}
      <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
        {ad.image_urls && ad.image_urls.length > 0 ? ( <img src={ad.image_urls[0]} alt={ad.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy"/> ) : ( <div className="flex items-center justify-center h-full"><span className="text-gray-500">No Image</span></div> )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate mb-1 group-hover:text-primary">{ad.title}</h3>
        <p className="text-xl font-bold text-primary mb-2">Rs. {ad.price.toLocaleString()}</p>
        <p className="text-sm text-gray-600 mb-1">{ad.location}</p>
        {ad.profiles?.shop_name && ( <span className="text-xs text-blue-600 hover:underline mt-1 inline-block cursor-pointer" onClick={(e) => handleShopLinkClick(e, ad.user_id)}> by {ad.profiles.shop_name} 🛍️ </span> )}
      </div>
    </Link>
  );
};

const FeaturedAds = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Artificial Delay එක අයින් කළා, ඔයාට ඕන නම් ආයෙත් දාන්න
  // const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms)); 

  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true); setError(null); setAds([]);
      try {
        // await wait(1500); // Delay එක අයින් කළා
        const { data, error: fetchError } = await supabase.from('ads').select(`*, profiles!inner ( shop_name, id )`).eq('is_sold', false).order('is_featured', { ascending: false }).order('created_at', { ascending: false }).limit(8);
        if (fetchError) {
            if (fetchError.code === 'PGRST200' && fetchError.message.includes('relationship')) {
                 console.warn("FeaturedAds: Join failed, falling back...");
                 setError("Note: Could not load shop names.");
                 const { data: fData, error: fError } = await supabase.from('ads').select('*').eq('is_sold', false).order('is_featured', { ascending: false }).order('created_at', { ascending: false }).limit(8);
                 if (fError) throw fError; setAds(fData || []);
            } else { throw fetchError; }
        } else { setAds(data || []); }
      } catch (error) { setError(`Could not fetch ads. (${error.message})`); setAds([]); }
      finally { setLoading(false); }
    };
    fetchAds();
  }, []);

  return (
     <section className="bg-white py-12 sm:py-16">
       <div className="container mx-auto px-4">
         <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8">Featured & Latest Ads</h2>
         {/* --- 2. මෙතන ආයෙත් text එකට වෙනස් කළා --- */}
         {loading && <p className="text-center text-gray-500">Loading latest ads...</p>}
         {/* ---------------------------------- */}
         {error && <p className="text-center text-red-600 font-semibold">{error}</p>}
         {!loading && !error && (
           <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
             {ads.length > 0 ? ( ads.map((ad) => <AdCard key={ad.id} ad={ad} />) ) : ( <p>No ads yet.</p> )}
           </div>
         )}
       </div>
     </section>
  );
};

export default FeaturedAds;