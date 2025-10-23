'use client'; 
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner'; // --- 1. Import කළා ---

// --- AdCard Component (Nested Link Fix + Featured Badge) ---
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

// --- Search Logic Component ---
function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query || query.trim() === '') { setAds([]); setLoading(false); return; }
            setLoading(true); setError(null);
            try {
                const searchTerm = `%${query}%`;
                const { data, error: searchError } = await supabase.from('ads').select(`*, profiles!inner ( shop_name )`).or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`).eq('is_sold', false).order('is_featured', { ascending: false }).order('created_at', { ascending: false });
                if (searchError) throw searchError;
                setAds(data || []);
            } catch (catchError) {
                if (catchError.code === 'PGRST200' && catchError.message.includes('relationship')) {
                    setError("Note: Could not load shop names.");
                    const { data: fData, error: fError } = await supabase.from('ads').select('*').or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`).eq('is_sold', false).order('is_featured', { ascending: false }).order('created_at', { ascending: false });
                    if (fError) throw fError;
                    setAds(fData || []);
                } else { setError(`Search failed: ${catchError.message}`); setAds([]); }
            } finally { setLoading(false); }
        };
        fetchSearchResults();
    }, [query]);

    return (
        <div className="container mx-auto px-4 py-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">Search Results {query ? `for "${query}"` : ''}</h1>
            {/* --- 2. මෙතන වෙනස් කළා --- */}
            {loading && <LoadingSpinner message="Searching for ads..." />}
            {/* -------------------- */}
            {error && <p className="text-center text-red-600 font-semibold p-4 bg-red-100 rounded">{error}</p>}
            {!loading && !error && (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {ads.length > 0 ? (
                        ads.map((ad) => <AdCard key={ad.id} ad={ad} />)
                    ) : ( <p>No ads found.</p> )}
                </div>
            )}
        </div>
    );
}

// --- Main Search Page Component ---
export default function SearchPage() {
    return (
        <>
            <Header />
            <main className="bg-gray-100 min-h-screen">
                <Suspense fallback={<LoadingSpinner message="Loading search..." />}> {/* <-- මෙතනත් දැම්මා */}
                    <SearchResults />
                </Suspense>
            </main>
            <Footer />
        </>
    );
}