'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FaWhatsapp, FaStore, FaEye } from 'react-icons/fa'; // --- 1. Aluth Icons (FaStore, FaEye) Import Kala ---
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';

// ImageGallery Component (Wenasak Na)
const ImageGallery = ({ imageUrls, title }) => {
  if (!imageUrls || imageUrls.length === 0) {
    return (
      <div className="bg-gray-200 h-64 flex items-center justify-center text-gray-500 rounded-lg">
        No Images
      </div>
    );
  }
  return (
    <div className="relative w-full h-64 md:h-96 bg-gray-100 rounded-lg overflow-hidden mb-6 flex items-center justify-center">
      <img
        src={imageUrls[0]}
        alt={title}
        className="max-w-full max-h-full object-contain"
        loading="lazy"
      />
    </div>
  );
};

// formatWhatsAppNumber function (Wenasak Na)
const formatWhatsAppNumber = (number) => {
  if (!number) return null;
  let cleaned = number.replace(/[-\s]/g, '');
  if (cleaned.startsWith('07')) {
    cleaned = '94' + cleaned.substring(1);
  }
  return cleaned;
};

// --- Related Ad Card (Kalin hadapu eka, Wenasak Na) ---
const RelatedAdCard = ({ ad }) => (
  <Link
    href={`/ad/${ad.id}`}
    className="block w-48 flex-shrink-0 bg-white rounded-lg shadow-md overflow-hidden group"
  >
    <div className="w-full h-32 bg-gray-200 overflow-hidden">
      {ad.image_urls && ad.image_urls.length > 0 ? (
        <img
          src={ad.image_urls[0]}
          alt={ad.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          loading="lazy"
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <span className="text-gray-500 text-sm">No Image</span>
        </div>
      )}
    </div>
    <div className="p-3">
      <h4 className="text-sm font-semibold text-gray-800 truncate">
        {ad.title}
      </h4>
      <p className="text-base font-bold text-primary mt-1">
        Rs. {ad.price.toLocaleString()}
      </p>
    </div>
  </Link>
);

// --- Related Ads Section (Kalin hadapu eka, Wenasak Na) ---
const RelatedAds = ({ categoryName, currentAdId }) => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryName || !currentAdId) {
      setLoading(false);
      return;
    }
    const fetchRelated = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('category_name', categoryName)
        .neq('id', currentAdId)
        .eq('is_sold', false)
        .limit(8);
      if (error) {
        console.error('Error fetching related ads:', error);
      } else if (data) {
        setAds(data);
      }
      setLoading(false);
    };
    fetchRelated();
  }, [categoryName, currentAdId]);

  if (loading || ads.length === 0) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 mt-12 mb-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Related Ads</h2>
      <div className="flex overflow-x-auto space-x-4 pb-4">
        {ads.map((ad) => (
          <RelatedAdCard key={ad.id} ad={ad} />
        ))}
      </div>
    </div>
  );
};

// --- ප්‍රධාන Page Component (Mehi Wenas Kam Thiyenawa) ---
export default function AdDetailPage() {
  const params = useParams();
  const id = params?.id;
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setAd(null);
    setError(null);
    setLoading(true);
    if (id) {
      const fetchAdDetails = async () => {
        try {
          // --- 2. Aluth Data Fetch Method (Shop details ganna 'profiles' table ekath join kala) ---
          const { data, error: fetchError, status } = await supabase
            .from('ads')
            .select('*, profiles(*)') // '*' wenwata '*, profiles(*)' kiyala damma
            .eq('id', id)
            .single();

          if (fetchError && status !== 406) throw fetchError;

          if (data) {
            setAd(data); // Data set kala
            setError(null);

            // --- 3. View Count eka 1kin Wadi Karamu (Fire-and-forget) ---
            // (Page eka load wenna block karanne na)
            try {
              await supabase.rpc('increment_view_count', { ad_id_input: data.id });
              console.log('View count incremented');
            } catch (rpcError) {
              console.error('Error incrementing view count:', rpcError);
            }
            // --------------------------------------------------------

          } else {
            setError('Ad not found.');
            setAd(null);
          }
        } catch (catchError) {
          setError(`Could not load ad details: ${catchError.message}`);
          setAd(null);
        } finally {
          setLoading(false);
        }
      };
      fetchAdDetails();
    } else {
      setLoading(false);
      setError('Invalid Ad ID.');
    }
  }, [id]); // ID eka wenas weddi aye run wenawa

  let content;
  if (loading) {
    content = <LoadingSpinner message="Loading ad details..." />;
  } else if (error) {
    content = <p className="text-center py-10 text-red-600">{error}</p>;
  } else if (ad) {
    const whatsappLink = `https://wa.me/${formatWhatsAppNumber(
      ad.whatsapp_number
    )}`;
    
    // Check karamu meka shop ekakda kiyala (api data fetch karapu 'profiles' object eken)
    const postedByShop = ad.profiles && ad.profiles.is_shop === true;

    content = (
      <>
        {/* --- ප්‍රධාන Ad එකේ විස්තර --- */}
        <div className="max-w-4xl mx-auto p-4 md:p-8 bg-white shadow-lg rounded-lg my-10">
          <ImageGallery imageUrls={ad.image_urls} title={ad.title} />
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {ad.title}
          </h1>
          
          <p className="text-3xl font-bold text-primary mb-6">
            Rs. {ad.price ? ad.price.toLocaleString() : 'N/A'}
          </p>

          {/* --- 4. Aluth Metadata Section (Shop Name & View Count) --- */}
          <div className="flex flex-wrap items-center text-sm text-gray-600 mb-6 gap-x-5 gap-y-2">
            <span>📍 {ad.location || 'N/A'}</span>
            <span>🏷️ {ad.category_name || 'N/A'}</span>
            
            {/* View Count eka pennamu */}
            <span className="inline-flex items-center">
              <FaEye className="w-4 h-4 mr-1.5" />
              {ad.view_count || 0} views
            </span>
            
            {/* Shop ekak nam, Shop Name eka Link ekak widihata pennamu */}
            {postedByShop && (
              <Link
                href={`/shop/${ad.user_id}`} // Click karama shop page ekata yanna
                className="inline-flex items-center text-blue-600 font-semibold hover:underline"
              >
                <FaStore className="w-4 h-4 mr-1.5" />
                {ad.profiles.shop_name || 'View Shop'}
              </Link>
            )}
          </div>
          {/* ---------------------------------------------------- */}

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Description
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {ad.description || 'No description provided.'}
            </p>
          </div>
          {ad.whatsapp_number && (
            <div className="mt-8 border-t pt-6">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors"
              >
                <FaWhatsapp className="w-5 h-5 mr-2 -ml-1" />
                Chat on WhatsApp
              </a>
            </div>
          )}
        </div>

        {/* --- Related Ads Section (Wenasak na) --- */}
        <RelatedAds
          categoryName={ad.category_name}
          currentAdId={ad.id}
        />
      </>
    );
  } else {
    content = <p className="text-center py-10">Ad not found.</p>;
  }

  return (
    <>
      <Header />
      <main className="bg-gray-100 min-h-screen">{content}</main>
      <Footer />
    </>
  );
}