'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FaWhatsapp, FaStore, FaEye, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';

// --- ImageGallery Component (Scrollable Gallery) ---
const ImageGallery = ({ imageUrls, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!imageUrls || imageUrls.length === 0) {
    return (
      <div className="bg-gray-200 h-64 md:h-96 flex items-center justify-center text-gray-500 rounded-lg">
        No Images
      </div>
    );
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative w-full h-64 md:h-96 bg-gray-100 rounded-lg overflow-hidden mb-6 group">
      {/* Main Image */}
      <div className="w-full h-full flex items-center justify-center">
        <img
          src={imageUrls[currentIndex]}
          alt={`${title} - ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain transition-opacity duration-300"
          key={currentIndex}
          loading="lazy"
        />
      </div>

      {/* Image Count Badge */}
      {imageUrls.length > 1 && (
        <div className="absolute bottom-3 right-3 bg-black bg-opacity-60 text-white text-xs font-semibold px-2 py-1 rounded-full z-10">
          {currentIndex + 1} / {imageUrls.length}
        </div>
      )}

      {/* Previous Button */}
      {imageUrls.length > 1 && (
        <button
          onClick={goToPrevious}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 text-gray-700 hover:bg-opacity-100 transition-opacity opacity-0 group-hover:opacity-100 focus:outline-none z-10"
          aria-label="Previous Image"
        >
          <FaChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      )}

      {/* Next Button */}
      {imageUrls.length > 1 && (
        <button
          onClick={goToNext}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 text-gray-700 hover:bg-opacity-100 transition-opacity opacity-0 group-hover:opacity-100 focus:outline-none z-10"
          aria-label="Next Image"
        >
          <FaChevronRight className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      )}
    </div>
  );
};

// --- FIX: formatWhatsAppNumber function Updated ---
const formatWhatsAppNumber = (number) => {
  if (!number) return null;
  // Remove spaces and dashes
  let cleaned = number.replace(/[-\s]/g, '');
  
  // Check for leading zero (Sri Lankan format)
  if (cleaned.startsWith('07')) {
    cleaned = '94' + cleaned.substring(1);
  }
  
  // ✅ FIX: Return full WhatsApp API URL
  return `https://wa.me/${cleaned}`;
};

// --- RelatedAdCard Component ---
const RelatedAdCard = ({ ad }) => (
  <Link
    href={`/kitto-home/${ad.id}`} // Ensure this path matches your file structure
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
        Rs. {ad.price ? ad.price.toLocaleString() : 'N/A'}
      </p>
    </div>
  </Link>
);

// --- RelatedAds Section ---
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

// --- Main AdDetailPage Component ---
export default function AdDetailPage() {
  const params = useParams();
  // Handle both [id] and [adId] patterns just in case
  const id = params?.adId || params?.id; 
  
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
          // Fetch Ad and linked Profile data
          const { data, error: fetchError, status } = await supabase
            .from('ads')
            .select('*, profiles(*)') // Join with profiles table
            .eq('id', id)
            .single();

          if (fetchError && status !== 406) {
            throw fetchError;
          }

          if (data) {
            setAd(data);
            setError(null);

            // Increment View Count (fire-and-forget)
            try {
              await supabase.rpc('increment_view_count', { ad_id_input: data.id });
              console.log('View count incremented');
            } catch (rpcError) {
              console.error('Error incrementing view count:', rpcError);
            }
            
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
  }, [id]);

  // --- Render Logic ---
  let content;

  if (loading) {
    content = <LoadingSpinner message="Loading ad details..." />;
  } else if (error) {
    content = <p className="text-center py-10 text-red-600">{error}</p>;
  } else if (ad) {
    const whatsappLink = formatWhatsAppNumber(ad.whatsapp_number);
    const postedByShop = ad.profiles && ad.profiles.is_shop === true;

    content = (
      <>
        {/* Main Ad Details Card */}
        <div className="max-w-4xl mx-auto p-4 md:p-8 bg-white shadow-lg rounded-lg my-10">
          
          {/* New Image Gallery */}
          <ImageGallery imageUrls={ad.image_urls} title={ad.title} />
          
          {/* Ad Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {ad.title}
          </h1>
          
          {/* Price */}
          <p className="text-3xl font-bold text-primary mb-6">
            Rs. {ad.price ? ad.price.toLocaleString() : 'N/A'}
          </p>

          {/* Metadata (Location, Category, Views, Shop) */}
          <div className="flex flex-wrap items-center text-sm text-gray-600 mb-6 gap-x-5 gap-y-2">
            <span>📍 {ad.location || 'N/A'}</span>
            <span>🏷️ {ad.category_name || 'N/A'}</span>
            <span className="inline-flex items-center">
              <FaEye className="w-4 h-4 mr-1.5" />
              {ad.view_count || 0} views
            </span>
            
            {postedByShop && (
              <Link
                href={`/shop/${ad.user_id}`}
                className="inline-flex items-center text-blue-600 font-semibold hover:underline"
              >
                <FaStore className="w-4 h-4 mr-1.5" />
                {ad.profiles.shop_name || 'View Shop'}
              </Link>
            )}
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Description
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {ad.description || 'No description provided.'}
            </p>
          </div>

          {/* WhatsApp Button */}
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

        {/* Related Ads Section */}
        <RelatedAds
          categoryName={ad.category_name}
          currentAdId={ad.id}
        />
      </>
    );
  } else {
    content = <p className="text-center py-10">Ad not found.</p>;
  }

  // --- Final Render ---
  return (
    <>
      <Header />
      <main className="bg-gray-100 min-h-screen">
        {content}
      </main>
      <Footer />
    </>
  );
}