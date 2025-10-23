'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FaWhatsapp } from 'react-icons/fa';
import LoadingSpinner from '@/components/LoadingSpinner'; // --- 1. Import කළා ---

// ImageGallery Component
const ImageGallery = ({ imageUrls, title }) => {
    if (!imageUrls || imageUrls.length === 0) { return <div className="bg-gray-200 h-64 flex items-center justify-center text-gray-500 rounded-lg">No Images</div>; }
    return ( <div className="relative w-full h-64 md:h-96 bg-gray-100 rounded-lg overflow-hidden mb-6 flex items-center justify-center"><img src={imageUrls[0]} alt={title} className="max-w-full max-h-full object-contain" loading="lazy"/></div> );
};

// formatWhatsAppNumber function
const formatWhatsAppNumber = (number) => {
    if (!number) return null; let cleaned = number.replace(/[-\s]/g, ''); if (cleaned.startsWith('07')) { cleaned = '94' + cleaned.substring(1); } return cleaned;
};

export default function AdDetailPage() {
  const params = useParams();
  const id = params?.id;
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setAd(null); setError(null); setLoading(true);
    if (id) {
        const fetchAdDetails = async () => {
            try {
                const { data, error: fetchError, status } = await supabase.from('ads').select('*').eq('id', id).single();
                if (fetchError && status !== 406) throw fetchError;
                if (data) { setAd(data); setError(null); }
                else { setError('Ad not found.'); setAd(null); }
            } catch (catchError) { setError(`Could not load ad details: ${catchError.message}`); setAd(null); }
            finally { setLoading(false); }
        };
        fetchAdDetails();
    } else { setLoading(false); setError("Invalid Ad ID."); }
  }, [id]);

  let content;
  // --- 2. මෙතන වෙනස් කළා ---
  if (loading) {
    content = <LoadingSpinner message="Loading ad details..." />;
  // --------------------
  } else if (error) {
    content = <p className="text-center py-10 text-red-600">{error}</p>;
  } else if (ad) {
    const whatsappLink = `https://wa.me/${formatWhatsAppNumber(ad.whatsapp_number)}`;
    content = (
      <div className="max-w-4xl mx-auto p-4 md:p-8 bg-white shadow-lg rounded-lg my-10">
        <ImageGallery imageUrls={ad.image_urls} title={ad.title} />
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{ad.title}</h1>
        <p className="text-3xl font-bold text-primary mb-6">Rs. {ad.price ? ad.price.toLocaleString() : 'N/A'}</p>
        <div className="flex flex-wrap text-sm text-gray-600 mb-6 space-x-4">
          <span>📍 {ad.location || 'N/A'}</span>
          <span>🏷️ {ad.category_name || 'N/A'}</span>
        </div>
        <div className="mb-8"><h2 className="text-xl font-semibold text-gray-700 mb-2">Description</h2><p className="text-gray-700 whitespace-pre-wrap">{ad.description || 'No description provided.'}</p></div>
        {ad.whatsapp_number && (
          <div className="mt-8 border-t pt-6">
             <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors">
               <FaWhatsapp className="w-5 h-5 mr-2 -ml-1" />
              Chat on WhatsApp
             </a>
          </div>
        )}
      </div>
    );
  } else {
    content = <p className="text-center py-10">Ad not found.</p>;
  }

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