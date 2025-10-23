'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { FaCheckCircle, FaLock, FaStar, FaPaw } from 'react-icons/fa'; // Paw Icon
import Confetti from 'react-confetti'; // Confetti

const categoriesList = [
  'Electronics', 'Vehicles', 'Property', 'Fashion & Beauty',
  'Home & Garden', 'Pets & Animals', 'Services', 'Jobs', 'Other',
];

const MAX_IMAGES_FREE = 3;
const MAX_ACTIVE_ADS_FREE = 2;
const MAX_IMAGES_PLUS = 10;

const PostAdForm = () => {
  const { session, loading: authLoading } = useAuth();
  const router = useRouter();

  // States
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false); // Confetti State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [files, setFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const userId = session?.user?.id;

  // Security Check
  useEffect(() => {
    if (!authLoading && !session) {
      router.push('/login');
    }
  }, [session, authLoading, router]);

  // Fetch User Profile
  const fetchProfile = useCallback(async () => {
    if (!userId) { setLoadingProfile(false); return; }
    setLoadingProfile(true);
    try {
      const { data, error: fetchError, status } = await supabase
        .from('profiles').select('current_plan').eq('id', userId).single();
      if (fetchError && status !== 406) throw fetchError;
      setProfile(data || { current_plan: 'free' });
    } catch (error) {
      setGeneralError(`Could not load profile: ${error.message}`);
      setProfile({ current_plan: 'free' });
    } finally {
      setLoadingProfile(false);
    }
  }, [userId]);

  // Trigger Fetch Profile
  useEffect(() => {
    if (!authLoading && userId) fetchProfile();
    else if (!authLoading && !userId) setLoadingProfile(false);
  }, [authLoading, userId, fetchProfile]);

  // Preview URLs Cleanup
  useEffect(() => {
    let currentPreviews = imagePreviews;
    return () => { currentPreviews.forEach(url => URL.revokeObjectURL(url)); };
  }, [imagePreviews]);

  // File select
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;
    const maxImages = profile?.current_plan === 'plus' ? MAX_IMAGES_PLUS : MAX_IMAGES_FREE;
    if (files.length + selectedFiles.length > maxImages) {
      setFormError(`Max ${maxImages} images allowed for ${profile?.current_plan || 'free'} plan.`);
      return;
    }
    setFiles(prev => [...prev, ...selectedFiles]);
    const urls = selectedFiles.map(f => URL.createObjectURL(f));
    setImagePreviews(prev => [...prev, ...urls]);
    setFormError(''); setMessage('');
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Image remove
  const handleRemoveImage = (indexToRemove) => {
    URL.revokeObjectURL(imagePreviews[indexToRemove]);
    setImagePreviews(prev => prev.filter((_, i) => i !== indexToRemove));
    setFiles(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  // Activate Plus Plan (Simulation)
  const activatePlusPlan = async () => {
    if (!userId) return;
    setSubmitting(true); setMessage(''); setGeneralError('');
    try {
      const { error: updateError } = await supabase.from('profiles').update({ current_plan: 'plus' }).eq('id', userId);
      if (updateError) throw updateError;
      setProfile({ ...profile, current_plan: 'plus' });
      setMessage('Plus Plan activated (Trial)!');
       setGeneralError('');
       setShowConfetti(true); // Confetti Trigger
       setTimeout(() => setShowConfetti(false), 5000); // 5s
    } catch (error) { setGeneralError(`Plan activation failed: ${error.message}`); }
    finally { setSubmitting(false); }
  };

  // Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); setMessage(''); setGeneralError(''); setFormError('');
    if (!userId) { setGeneralError('Not logged in.'); setSubmitting(false); return; }
    if (files.length === 0) { setFormError('Please upload at least one image.'); setSubmitting(false); return; }
    if (!category) { setFormError('Please select a category.'); setSubmitting(false); return;}
    if (!title.trim()) { setFormError('Please enter a title.'); setSubmitting(false); return;}
    if (!price || parseFloat(price) <= 0) { setFormError('Please enter a valid price.'); setSubmitting(false); return;}
    if (!location.trim()) { setFormError('Please enter a location.'); setSubmitting(false); return;}
    if (!whatsappNumber.trim()) { setFormError('Please enter a WhatsApp number.'); setSubmitting(false); return;}

    const currentPlan = profile?.current_plan || 'free';
    try {
      if (currentPlan === 'free') {
        const { count, error: countError } = await supabase.from('ads').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('is_sold', false);
        if (countError) throw new Error("Could not check ad count.");
        if (count !== null && count >= MAX_ACTIVE_ADS_FREE) {
          setGeneralError(`You've reached the ${MAX_ACTIVE_ADS_FREE} ad limit for the Free Plan. Consider activating Plus.`);
          setSubmitting(false); return;
        }
      }
      const uploadedUrls = [];
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('ad_images').upload(fileName, file);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('ad_images').getPublicUrl(fileName);
        uploadedUrls.push(urlData.publicUrl);
      }
      const { error: insertError } = await supabase.from('ads').insert([{
        user_id: userId, title, description, price: parseFloat(price),
        location, category_name: category, whatsapp_number: whatsappNumber,
        image_urls: uploadedUrls, is_sold: false
      }]);
      if (insertError) throw insertError;
      setMessage('Success! Your ad has been posted.');
      setTitle(''); setDescription(''); setPrice(''); setLocation('');
      setCategory(''); setWhatsappNumber(''); setFiles([]); setImagePreviews([]);
      setFormError(''); setGeneralError('');
      setTimeout(() => { router.push('/'); }, 2000);
    } catch (error) { setGeneralError(`Error posting ad: ${error.message}`); }
    finally { setSubmitting(false); }
  };

  if (authLoading || loadingProfile) { return <div className="text-center py-10">Loading form...</div>; }
  if (!session) { return <div className="text-center py-10">Redirecting...</div>; }

  const maxImages = profile?.current_plan === 'plus' ? MAX_IMAGES_PLUS : MAX_IMAGES_FREE;
  const currentPlan = profile?.current_plan || 'free';

  // --- Form UI (සම්පූර්ණ Form එක) ---
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 font-sans">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      <div className="w-full max-w-2xl p-6 md:p-8 space-y-6 bg-white shadow-lg rounded-2xl my-12">
        <h2 className="text-3xl font-bold text-center text-gray-800">Post Your Ad on Kitto</h2>

        {generalError && <p className="mb-4 text-center text-red-600 bg-red-100 p-3 rounded">{generalError}</p>}
        {message && <p className="mb-4 text-center text-green-600 bg-green-100 p-3 rounded">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Form Fields (Title to Category) */}
          <div><label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Ad Title</label><input id="title" value={title} onChange={e=>setTitle(e.target.value)} required className="w-full input-field"/></div>
          <div><label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea id="description" value={description} onChange={e=>setDescription(e.target.value)} rows={4} className="w-full input-field"></textarea></div>
          <div><label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price (Rs.)</label><input id="price" type="number" value={price} onChange={e=>setPrice(e.target.value)} required className="w-full input-field"/></div>
          <div><label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label><input id="location" value={location} onChange={e=>setLocation(e.target.value)} required className="w-full input-field"/></div>
          <div><label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label><input id="whatsapp" type="tel" value={whatsappNumber} onChange={e=>setWhatsappNumber(e.target.value)} required className="w-full input-field"/></div>
          <div><label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label><select id="category" value={category} onChange={e=>setCategory(e.target.value)} required className="w-full input-field"><option value="" disabled>-- Select --</option>{categoriesList.map(c=><option key={c} value={c}>{c}</option>)}</select></div>


          {/* Image Upload (Using <img> tag for preview) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Upload Images (Max {maxImages} for {currentPlan} plan)</label>
            <div className="mt-2 grid grid-cols-3 gap-4">
              {imagePreviews.map((previewUrl, index) => (
                  <div key={index} className="relative border rounded-md overflow-hidden h-24">
                    <img src={previewUrl} alt={`Preview ${index + 1}`} className="object-cover w-full h-full"/>
                    <button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs leading-none">X</button>
                  </div>
              ))}
              {files.length < maxImages && (
                <label htmlFor="images" className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-24 cursor-pointer hover:border-primary">
                  <span className="text-gray-400 text-3xl">+</span>
                  <input id="images" ref={fileInputRef} type="file" multiple accept="image/*" className="sr-only" onChange={handleFileChange} />
                </label>
              )}
            </div>
          </div>
          {formError && <p className="text-sm text-red-600 mt-1">{formError}</p>}

          {/* Plan Selection UI */}
          {/* Show plans if on free plan */}
          {currentPlan === 'free' && (
              <div className="border-t border-gray-200 pt-6 mt-6 space-y-4">
                  {/* Show upgrade title only if limit is reached */}
                  {generalError.includes('limit') && (
                      <>
                          <h3 className="text-xl font-bold text-center text-red-600 mb-2">Ad Limit Reached!</h3>
                          <p className="text-sm text-center text-gray-600 mb-6">Activate the Plus plan trial to continue posting.</p>
                      </>
                  )}
                  {!generalError.includes('limit') && (
                       <h3 className="text-xl font-semibold text-center text-gray-700 mb-4">Your Current Plan</h3>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Free Plan */}
                      <div className="border border-gray-200 rounded-lg p-4 text-center bg-gray-50 flex flex-col justify-between">
                         <div>
                            <h4 className="font-bold text-lg text-gray-700">Free</h4>
                            <ul className="text-sm text-gray-600 mt-3 space-y-1"><li><FaCheckCircle className="inline w-3 h-3 mr-1 text-green-500"/> Max {MAX_ACTIVE_ADS_FREE} Ads</li><li><FaCheckCircle className="inline w-3 h-3 mr-1 text-green-500"/> Max {MAX_IMAGES_FREE} Images</li></ul>
                         </div>
                          <button type="button" disabled className="mt-5 w-full py-2 px-4 text-sm font-medium rounded-md text-gray-500 bg-gray-200">Current</button>
                      </div>
                      {/* Plus Plan */}
                      <div className="border-2 border-primary rounded-lg p-4 text-center shadow-lg bg-white flex flex-col justify-between">
                          <div>
                            <h4 className="font-bold text-lg text-primary">Plus (Trial)</h4>
                            <ul className="text-sm text-gray-600 mt-3 space-y-1"><li><FaCheckCircle className="inline w-3 h-3 mr-1 text-green-500"/> Unlimited Ads</li><li><FaCheckCircle className="inline w-3 h-3 mr-1 text-green-500"/> Max {MAX_IMAGES_PLUS} Images</li><li><FaStar className="inline w-3 h-3 mr-1 text-yellow-500"/> Boosts</li></ul>
                          </div>
                          <button type="button" onClick={activatePlusPlan} disabled={submitting} className="mt-5 w-full py-2 px-4 text-sm font-bold rounded-md text-white bg-primary hover:opacity-90 disabled:opacity-50">{submitting ? 'Activating...' : 'Activate Trial'}</button>
                          <p className="text-xs text-gray-400 mt-2">Rs. 200/month</p>
                      </div>
                      {/* Pro Plan */}
                      <div className="relative border border-transparent rounded-lg p-4 text-center bg-gradient-to-br from-secondary via-pink-400 to-primary text-white flex flex-col justify-between shadow-xl overflow-hidden">
                           <div className="relative z-10">
                              <h4 className="font-bold text-lg">Pro</h4>
                              <ul className="text-sm mt-3 space-y-1"><li><FaCheckCircle className="inline w-3 h-3 mr-1"/> Unlimited Ads/Images</li><li><FaPaw className="inline w-3 h-3 mr-1 text-yellow-300"/> Verified Badge</li><li><FaStar className="inline w-3 h-3 mr-1 text-yellow-300"/> Support</li></ul>
                           </div>
                          <button type="button" disabled className="relative z-10 mt-5 w-full py-2 px-4 text-sm font-bold rounded-md text-gray-700 bg-white bg-opacity-80 cursor-not-allowed flex items-center justify-center"><FaLock className="w-3 h-3 mr-1.5"/> Coming Soon</button>
                      </div>
                  </div>
              </div>
          )}
          {/* Show current plan if not free */}
          {currentPlan !== 'free' && !generalError.includes('limit') && (
               <div className="border-t border-gray-200 pt-4 mt-6 text-center">
                   <p className="text-sm text-green-700 font-medium">✅ You are on the <span className="capitalize font-semibold">{currentPlan}</span> Plan. (Max {maxImages} images)</p>
               </div>
          )}

          {/* Submit Button */}
           <div className="pt-6 border-t border-gray-200 mt-6">
             <button type="submit" disabled={submitting || loadingProfile} className="w-full py-3 px-4 font-bold text-white bg-primary rounded-md hover:opacity-90 disabled:opacity-50">
               {submitting ? 'Posting Ad...' : 'Post Your Ad'}
             </button>
           </div>
        </form>
      </div>
    </div>
  );
};

// Style Code
if (typeof window !== 'undefined') {
  const styleSheet = document.createElement("style"); styleSheet.type = "text/css";
  styleSheet.innerText = `.input-field { display: block; width: 100%; padding: 0.75rem; margin-top: 0.25rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); background-color: white; } .input-field:focus { outline: none; border-color: #f08080; box-shadow: 0 0 0 2px #f08080; }`;
  document.head.appendChild(styleSheet);
}

export default PostAdForm;