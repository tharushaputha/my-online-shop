'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaShareAlt, FaCheckCircle, FaTrashAlt } from 'react-icons/fa';

// --- AdCard Component (Functions වල logic එක restore කළා) ---
const AdCard = ({ ad, handleDelete, handleMarkAsSold }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    // Mark Sold Function (Passes call to parent)
    const markSold = async () => {
        if (isProcessing) return; // Prevent double clicks
        console.log(`AdCard: Mark/Unmark Sold button clicked for Ad ID: ${ad.id}`);
        setIsProcessing(true);
        await handleMarkAsSold(ad.id, !ad.is_sold);
        setIsProcessing(false); // Re-enable button after operation
    };

    // Delete Function (Passes call to parent)
    const deleteAd = async () => {
        if (isProcessing) return;
        console.log(`AdCard: Delete button clicked for Ad ID: ${ad.id}`);
        setIsProcessing(true);
        await handleDelete(ad.id, ad.image_urls);
        // Component might unmount, but just in case:
        // setIsProcessing(false); 
    };

    // Share Function
    const handleShareClick = () => {
         console.log(`AdCard: Share button clicked for Ad ID: ${ad.id}`);
         alert('Sharing feature coming soon!');
    };

    return (
        <div className={`bg-white rounded-lg shadow-md overflow-hidden flex flex-col justify-between transition-opacity duration-300 ${ad.is_sold ? 'opacity-60' : ''}`}>
            <Link href={`/ad/${ad.id}`} className="block hover:shadow-xl transition-shadow group">
                {/* Image */}
                <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
                    {ad.is_sold && (<div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">SOLD</div>)}
                    {ad.image_urls && ad.image_urls.length > 0 ? (<img src={ad.image_urls[0]} alt={ad.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy"/>) : ( <div className="flex items-center justify-center h-full"><span className="text-gray-500">No Image</span></div> )}
                </div>
                {/* Details */}
                <div className="p-4">
                    <h3 className={`text-lg font-semibold text-gray-800 truncate mb-1 group-hover:text-primary ${ad.is_sold ? 'line-through' : ''}`}>{ad.title}</h3>
                    <p className={`text-xl font-bold text-primary mb-2 ${ad.is_sold ? 'line-through' : ''}`}>Rs. {ad.price.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{ad.location}</p>
                </div>
            </Link>
            {/* --- Buttons Section (Redesigned) --- */}
            <div className="p-3 border-t mt-auto space-y-2">
                 {/* Share Button */}
                {!ad.is_sold && (
                    <button
                        onClick={handleShareClick}
                        disabled={isProcessing}
                        className="w-full inline-flex items-center justify-center bg-blue-500 text-white font-semibold py-2 px-3 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 text-sm"
                    >
                        <FaShareAlt className="w-4 h-4 mr-1.5" />
                        Share & Boost (Free)
                    </button>
                )}
                {/* Mark/Unmark and Delete Buttons */}
                <div className="flex space-x-2">
                    <button
                      onClick={markSold}
                      disabled={isProcessing}
                      className={`flex-1 inline-flex items-center justify-center border font-semibold py-2 px-3 rounded-md transition-colors text-sm disabled:opacity-50 ${
                        ad.is_sold
                          ? 'border-yellow-500 text-yellow-600 hover:bg-yellow-50' // Unmark
                          : 'border-green-500 text-green-600 hover:bg-green-50' // Mark Sold
                      }`}
                    >
                       <FaCheckCircle className="w-4 h-4 mr-1.5" />
                      {isProcessing ? '...' : (ad.is_sold ? 'Unmark' : 'Mark Sold')}
                    </button>
                    <button
                      onClick={deleteAd}
                      disabled={isProcessing}
                      className="flex-1 inline-flex items-center justify-center bg-red-500 text-white font-semibold py-2 px-3 rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 text-sm"
                    >
                       <FaTrashAlt className="w-3.5 h-3.5 mr-1.5" />
                      {isProcessing ? '...' : 'Delete'}
                    </button>
                </div>
            </div>
             {/* ------------------------------------------- */}
        </div>
    );
};


// --- Main MyAdsPage Component ---
const MyAdsPage = () => {
  const { session, loading: authLoading } = useAuth();
  const router = useRouter();
  const [myAds, setMyAds] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  // Security Check
  useEffect(() => {
    if (!authLoading && !session) {
      router.push('/login');
    }
  }, [session, authLoading, router]);

  // Fetch User's Ads
  const fetchMyAds = useCallback(async (currentUserId) => {
    if (!currentUserId) { setLoadingData(false); return; }
    setError(null); setStatusMessage('');
    try {
      const { data, error: fetchError } = await supabase.from('ads').select('*').eq('user_id', currentUserId).order('created_at', { ascending: false });
      if (fetchError) { throw fetchError; }
      setMyAds(data || []);
    } catch (error) { setError(`Could not fetch ads: ${error.message}`); setMyAds([]); }
    finally { setLoadingData(false); }
  }, []);

  // Trigger Fetch Ads
  useEffect(() => {
      const currentUserId = session?.user?.id;
      if (!authLoading && currentUserId) { setLoadingData(true); fetchMyAds(currentUserId); }
      else if (!authLoading && !currentUserId){ setLoadingData(false); }
  }, [authLoading, session, fetchMyAds]);


  // --- Mark as Sold Function (Logic Restored) ---
  const handleMarkAsSold = async (adId, newSoldStatus) => {
      console.log(`MyAdsPage: handleMarkAsSold called for ID: ${adId}, New Status: ${newSoldStatus}`);
      setStatusMessage('Updating status...');
      try {
          const { error: updateError } = await supabase.from('ads').update({ is_sold: newSoldStatus }).eq('id', adId);
          if (updateError) throw updateError;
          setMyAds(currentAds => currentAds.map(ad => ad.id === adId ? { ...ad, is_sold: newSoldStatus } : ad ));
          setStatusMessage(`Ad marked as ${newSoldStatus ? 'Sold' : 'Available'}!`);
          console.log(`MyAdsPage: Successfully updated status for ID: ${adId}`);
      } catch (error) {
          console.error('MyAdsPage: Error updating ad status:', error);
          setStatusMessage(`Error updating status: ${error.message}`);
      }
  };
  // ----------------------------------------------------

  // --- Delete Function (Logic Restored) ---
  const handleDeleteAd = async (adId, imageUrls) => {
      console.log(`MyAdsPage: handleDeleteAd called for ID: ${adId}`);
      if (!confirm('Are you sure you want to delete this ad? This cannot be undone.')) {
        console.log("MyAdsPage: Deletion cancelled by user.");
        return;
      }
      setStatusMessage('Deleting ad...');
      try {
         // Delete images from storage
         if (imageUrls && imageUrls.length > 0) {
             const filePaths = imageUrls.map(url => {
               try {
                 const urlObject = new URL(url);
                 const pathSegments = urlObject.pathname.split('/');
                 const fileName = pathSegments[pathSegments.length - 1];
                 if (!fileName) throw new Error('Could not derive filename');
                 return fileName;
               } catch (e) { console.error("URL parse error:", url, e); return null; }
             }).filter(Boolean);
             if (filePaths.length > 0) {
               console.log("Removing files:", filePaths);
               const { error: storageError } = await supabase.storage.from('ad_images').remove(filePaths);
               if (storageError) console.error('Storage Error:', storageError);
               else console.log("Images removed.");
             }
         }
         // Delete ad record from database
         console.log("Deleting DB record:", adId);
         const { error: dbError } = await supabase.from('ads').delete().eq('id', adId);
         if (dbError) throw dbError;
         console.log("DB record deleted successfully for ID:", adId);
         // Update UI
         setMyAds(currentAds => currentAds.filter(ad => ad.id !== adId));
         setStatusMessage('Ad deleted successfully!');
         console.log("MyAdsPage: UI updated after delete.");
      } catch (error) {
         console.error('MyAdsPage: Error during deletion:', error);
         setStatusMessage(`Error deleting ad: ${error.message}.`);
      }
  };
  // ---------------------------------------


  if (authLoading || loadingData) { return <div className="text-center py-10">Loading your ads...</div>; }
  if (!session) { return <div className="text-center py-10">Redirecting...</div>; }

  // Page Content
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">My Posted Ads</h1>
      {statusMessage && ( <p className={`mb-4 text-center text-sm ${statusMessage.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>{statusMessage}</p> )}
      {error && <p className="text-center text-red-600 mb-4">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {myAds.length > 0 ? (
          myAds.map((ad) => <AdCard key={ad.id} ad={ad} handleDelete={handleDeleteAd} handleMarkAsSold={handleMarkAsSold} />)
        ) : (
          <p className="text-center col-span-full text-gray-500">You haven't posted any ads yet.</p>
        )}
      </div>
    </div>
  );
};

export default MyAdsPage;