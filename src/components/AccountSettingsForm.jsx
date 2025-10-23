'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Image component එක import කරනවා (Kitto image එකට)

const AccountSettingsForm = () => {
  const { session, loading: authLoading } = useAuth();
  const router = useRouter();

  // States
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [city, setCity] = useState('');
  const [isShop, setIsShop] = useState(false);
  const [shopName, setShopName] = useState('');
  const [shopDescription, setShopDescription] = useState('');
  const [shopWhatsapp, setShopWhatsapp] = useState('');
  const [shopCity, setShopCity] = useState('');
  const [shopLogoUrl, setShopLogoUrl] = useState(null); // Database එකෙන් එන URL එක
  const [logoPreview, setLogoPreview] = useState(null); // අලුතෙන් select කරපු file එකේ preview URL එක
  const [logoFile, setLogoFile] = useState(null); // අලුතෙන් select කරපු file object එක
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const logoInputRef = useRef(null);

  const userId = session?.user?.id;

  // Security Check & Redirect
  useEffect(() => {
    if (!authLoading && !session) {
      router.push('/login');
    }
  }, [session, authLoading, router]);

  // Fetch Profile Data
  const fetchProfile = useCallback(async () => {
    if (!userId) {
      setLoadingData(false);
      return;
    }
    setLoadingData(true);
    setError('');
    try {
      const { data, error: fetchError, status } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (fetchError && status !== 406) throw fetchError;

      if (data) {
        setFullName(data.full_name || '');
        setMobileNumber(data.mobile_number || '');
        setCity(data.city || '');
        setIsShop(data.is_shop || false);
        setShopName(data.shop_name || '');
        setShopDescription(data.shop_description || '');
        setShopWhatsapp(data.shop_whatsapp_number || '');
        setShopCity(data.shop_city || '');
        setShopLogoUrl(data.shop_logo_url || null);
        setLogoPreview(data.shop_logo_url || null);
      }
    } catch (error) {
      setError(`Failed to load profile: ${error.message}`);
    } finally {
      setLoadingData(false);
    }
  }, [userId]);

  // Trigger Fetch Profile Data
  useEffect(() => {
    if (!authLoading && userId) {
      fetchProfile();
    } else if (!authLoading && !userId) {
      setLoadingData(false);
    }
  }, [authLoading, userId, fetchProfile]);

  // Preview URL Cleanup
  useEffect(() => {
    let currentPreview = logoPreview;
    return () => {
      if (currentPreview && currentPreview.startsWith('blob:')) {
        URL.revokeObjectURL(currentPreview);
      }
    };
  }, [logoPreview]);

  // Logo File Select Logic
   const handleLogoFileSelect = (event) => {
       setMessage(''); setError('');
       const file = event.target.files?.[0];
       if (!file) {
           setLogoFile(null);
           setLogoPreview(shopLogoUrl);
           return;
        }
        if (file.size > 1 * 1024 * 1024) { // 1MB limit
            setError('Error: Logo file size should be less than 1MB.');
            setLogoFile(null);
            setLogoPreview(shopLogoUrl);
             if (logoInputRef.current) logoInputRef.current.value = "";
            return;
        }
       setLogoFile(file);
       if (logoPreview && logoPreview.startsWith('blob:')) {
           URL.revokeObjectURL(logoPreview);
       }
       setLogoPreview(URL.createObjectURL(file));
   };


  // Logo Upload Function (called on Save)
  const uploadLogo = async (fileToUpload) => {
      if (!fileToUpload || !userId) return null;
      setUploadingLogo(true);
      let newLogoSupabaseUrl = shopLogoUrl;
      try {
          const oldFileName = shopLogoUrl ? shopLogoUrl.split('/').pop() : null;
          const fileExt = fileToUpload.name.split('.').pop();
          const fileName = `${userId}-${Date.now()}.${fileExt}`;
          const filePath = `${fileName}`;
          const { error: uploadError } = await supabase.storage.from('shop_logos').upload(filePath, fileToUpload, { upsert: false });
          if (uploadError) throw uploadError;
          const { data: publicUrlData } = supabase.storage.from('shop_logos').getPublicUrl(filePath);
          newLogoSupabaseUrl = publicUrlData.publicUrl;
           if (oldFileName && oldFileName !== fileName) {
               await supabase.storage.from('shop_logos').remove([oldFileName]);
           }
          setMessage('Logo uploaded successfully!');
      } catch (error) {
          setError(`Failed to upload new logo: ${error.message}. Previous logo kept.`);
          newLogoSupabaseUrl = shopLogoUrl;
      } finally {
          setUploadingLogo(false);
          setLogoFile(null);
          if (logoInputRef.current) logoInputRef.current.value = "";
      }
      return newLogoSupabaseUrl;
  };


  // Form Submit Logic
  const handleSave = async (e) => {
    e.preventDefault();
    if (!userId) return;
    setSaving(true);
    setMessage('');
    setError('');
    let finalLogoUrl = shopLogoUrl;

    try {
      if (logoFile) {
        finalLogoUrl = await uploadLogo(logoFile);
         if (!finalLogoUrl && shopLogoUrl) { finalLogoUrl = shopLogoUrl; }
      }

      const updates = {
        id: userId, full_name: fullName, mobile_number: mobileNumber, city: city,
        is_shop: isShop, shop_name: isShop ? shopName : null,
        shop_description: isShop ? shopDescription : null,
        shop_whatsapp_number: isShop ? shopWhatsapp : null,
        shop_city: isShop ? shopCity : null,
        shop_logo_url: finalLogoUrl, updated_at: new Date(),
      };
      const { error: saveError } = await supabase.from('profiles').upsert(updates);
      if (saveError) throw saveError;
      setShopLogoUrl(finalLogoUrl);
      setLogoPreview(finalLogoUrl);
      setMessage('Profile updated successfully!');
    } catch (error) {
      setError(`Failed to save profile: ${error.message}`);
    } finally {
      setSaving(false);
      setLogoFile(null);
      if (logoInputRef.current) logoInputRef.current.value = "";
    }
  };


  if (authLoading || loadingData) { return <div className="text-center py-10">Loading profile...</div>; }
  if (!session) { return <div className="text-center py-10">Please log in.</div>; }

  // --- Form UI ---
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center md:text-left">Account Settings</h1>
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md flex flex-col md:flex-row md:space-x-8">

        {/* Left Side: Form */}
        <div className="md:w-2/3">
          {error && <p className="mb-4 text-center text-red-600 bg-red-100 p-3 rounded">{error}</p>}
          {message && <p className="mb-4 text-center text-green-600 bg-green-100 p-3 rounded">{message}</p>}
          <form onSubmit={handleSave} className="space-y-6">
            {/* Basic Profile */}
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Profile</h2>
              <div className="space-y-4">
                <div><label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label><input id="fullName" value={fullName} onChange={e=>setFullName(e.target.value)} className="w-full input-field"/></div>
                <div><label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label><input id="mobileNumber" type="tel" value={mobileNumber} onChange={e=>setMobileNumber(e.target.value)} className="w-full input-field"/></div>
                <div><label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">Your City</label><input id="city" value={city} onChange={e=>setCity(e.target.value)} className="w-full input-field"/></div>
              </div>
            </div>
            {/* Shop Section */}
            <div className="pt-4">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Shop (Optional)</h2>
              <div className="flex items-center mb-6"><input id="isShop" type="checkbox" checked={isShop} onChange={e=>setIsShop(e.target.checked)} className="h-4 w-4 mr-2"/><label htmlFor="isShop" className="text-sm font-medium text-gray-900">Set up my profile as a Shop</label></div>
              {isShop && (
                <div className="space-y-4 pl-6 border-l-2 border-primary ml-2">
                  <div><label htmlFor="shopName" className="block text-sm font-medium text-gray-700 mb-1">Shop Name *</label><input id="shopName" value={shopName} onChange={e=>setShopName(e.target.value)} required={isShop} className="w-full input-field"/></div>
                  <div><label htmlFor="shopDescription" className="block text-sm font-medium text-gray-700 mb-1">Shop Description</label><textarea id="shopDescription" value={shopDescription} onChange={e=>setShopDescription(e.target.value)} rows={3} className="w-full input-field"></textarea></div>
                  <div><label htmlFor="shopWhatsapp" className="block text-sm font-medium text-gray-700 mb-1">Shop WhatsApp</label><input id="shopWhatsapp" type="tel" value={shopWhatsapp} onChange={e=>setShopWhatsapp(e.target.value)} className="w-full input-field"/></div>
                  <div><label htmlFor="shopCity" className="block text-sm font-medium text-gray-700 mb-1">Shop City</label><input id="shopCity" value={shopCity} onChange={e=>setShopCity(e.target.value)} className="w-full input-field"/></div>
                  {/* Logo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Shop Logo</label>
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                        {logoPreview ? ( // Preview එක පෙන්නන්නේ logoPreview state එකෙන්
                          <img src={logoPreview} alt="Logo Preview" className="object-cover w-full h-full"/>
                        ) : (
                          <span className="text-gray-400 text-xs">No Logo</span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="logoUpload" className={`cursor-pointer inline-block px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 ${uploadingLogo ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          {uploadingLogo ? 'Uploading...' : 'Change Logo'}
                        </label>
                        <input id="logoUpload" ref={logoInputRef} type="file" accept="image/*" className="sr-only" onChange={handleLogoFileSelect} disabled={uploadingLogo}/>
                        <p className="text-xs text-gray-500 mt-2">PNG, JPG, WEBP up to 1MB.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Save Button */}
            <div className="pt-6 border-t border-gray-200 mt-6">
              <button type="submit" disabled={saving || loadingData || uploadingLogo} className="w-full py-3 px-4 font-bold text-white bg-primary rounded-md hover:opacity-90 disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
        {/* Right Side: Image */}
        <div className="hidden md:flex md:w-1/3 items-start justify-center pt-8 md:pt-16">
          <Image src="/kitto-settings.png" alt="Kitto Settings" width={250} height={250} className="opacity-90"/>
        </div>
      </div>
    </div>
  );
};

// Style Code (Inject styles)
if (typeof window !== 'undefined') {
  const styleSheet = document.createElement("style"); styleSheet.type = "text/css";
  styleSheet.innerText = `.input-field { display: block; width: 100%; padding: 0.75rem; margin-top: 0.25rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); background-color: white; } .input-field:focus { outline: none; border-color: #f08080; box-shadow: 0 0 0 2px #f08080; }`;
  document.head.appendChild(styleSheet);
}

export default AccountSettingsForm;