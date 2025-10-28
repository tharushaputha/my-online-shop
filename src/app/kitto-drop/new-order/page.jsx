// app/kitto-drop/new-order/page.jsx
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { FaWhatsapp, FaFacebook, FaTiktok, FaInstagram, FaYoutube, FaTimes, FaSpinner, FaCheckCircle, FaExclamationTriangle, FaPlus, FaTrashAlt, FaSearch } from 'react-icons/fa';
import _ from 'lodash';

// Order Source Platforms (No change)
const orderSourcePlatforms = [ { key: 'whatsapp', name: 'WhatsApp', icon: FaWhatsapp, color: 'text-green-500' }, { key: 'facebook', name: 'Facebook', icon: FaFacebook, color: 'text-blue-600' }, { key: 'tiktok', name: 'TikTok', icon: FaTiktok, color: 'text-black' }, { key: 'instagram', name: 'Instagram', icon: FaInstagram, color: 'text-pink-500' }, { key: 'youtube', name: 'YouTube', icon: FaYoutube, color: 'text-red-600' }, ];

export default function NewOrderPage() {
  const router = useRouter();
  const [kittoDropAccountId, setKittoDropAccountId] = useState(null);

  // --- Form State ---
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState('');
  const [selectedDistrictName, setSelectedDistrictName] = useState('');
  const [selectedCityName, setSelectedCityName] = useState(''); // This must be set correctly
  const [citySearchTerm, setCitySearchTerm] = useState(''); // This is for the input box
  const [filteredCities, setFilteredCities] = useState([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const cityInputRef = useRef(null);
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [orderSource, setOrderSource] = useState(null);
  const [paymentMethod] = useState('Cash on Delivery');
  const [orderNote, setOrderNote] = useState('');

  // Product Line Item State (No change)
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [productSuggestions, setProductSuggestions] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [retailPrice, setRetailPrice] = useState(0);
  const [saleAmount, setSaleAmount] = useState('');
  const [productNote, setProductNote] = useState('');
  const [estimatedProfit, setEstimatedProfit] = useState(0);
  const [totalAmount, setTotalAmount] = useState(400);
  const deliveryFee = 400;

  // Order Items State (No change)
  const [orderItems, setOrderItems] = useState([]);

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isFetchingLocations, setIsFetchingLocations] = useState(false);

  // --- Verify User & Fetch Districts on Mount (JSON Parse Error Fixed) ---
  useEffect(() => {
    // ****** FIX for JSON Error ******
    let accountId = null;
    try {
      const storedUser = localStorage.getItem('kittoDropUser');
      if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') { // Check for valid string
        const userData = JSON.parse(storedUser);
        if (userData && userData.id) {
          accountId = userData.id;
          setKittoDropAccountId(accountId);
        } else {
          throw new Error("Invalid user data format.");
        }
      } else {
        throw new Error("No user data found.");
      }
    } catch (e) {
      console.error("User data error", e);
      router.push('/kitto-drop/login'); // Redirect on parse error or if no user
      return;
    }
    // *********************************

    // Fetch Districts
    const fetchDistricts = async () => {
      setIsFetchingLocations(true);
      const { data, error } = await supabase.from('districts').select('id, name_en').order('name_en');
      if (error) { console.error("Error fetching districts:", error); setError("Could not load districts."); }
      else { setDistricts([{ id: '', name_en: 'Select District...' }, ...data]); }
      setIsFetchingLocations(false);
    };
    if (accountId) { // Fetch only if user is validated
        fetchDistricts();
    }
  }, [router]);

  // --- Fetch Cities when District Changes (No change) ---
  const handleDistrictChange = async (event) => {
    const selectedId = event.target.value;
    const selectedName = event.target.options[event.target.selectedIndex].text;
    setSelectedDistrictId(selectedId);
    setSelectedDistrictName(selectedId ? selectedName : '');
    setSelectedCityName(''); // Reset city
    setCitySearchTerm(''); // Reset city search term
    setCities([]);
    setFilteredCities([]);
    setShowCityDropdown(false);
    if (selectedId) {
      setIsFetchingLocations(true);
      const { data, error } = await supabase.from('cities').select('id, name_en').eq('district_id', selectedId).order('name_en');
      if (error) { console.error("Error fetching cities:", error); setError("Could not load cities for this district."); }
      else { setCities(data || []); setFilteredCities((data || []).slice(0, 10)); }
      setIsFetchingLocations(false);
    }
  };

  // --- Filter Cities based on Search (No change) ---
  useEffect(() => {
    if (cities.length > 0) {
      const searchTermLower = citySearchTerm.toLowerCase();
      const results = searchTermLower ? cities.filter(city => city.name_en.toLowerCase().includes(searchTermLower)) : cities.slice(0, 10);
      setFilteredCities(results.slice(0, 20));
    } else {
      setFilteredCities([]);
    }
  }, [citySearchTerm, cities]);

  // --- City Selection Handlers (FIXED LOGIC) ---
  const handleCitySelect = (city) => {
    setSelectedCityName(city.name_en); // <<< This SETS the city
    setCitySearchTerm(city.name_en); // This updates the input box
    setShowCityDropdown(false);
  };
  const handleCityInputChange = (e) => {
    setCitySearchTerm(e.target.value); // Update input box text
    setSelectedCityName(''); // <<< Clear the *selected* city (so validation fails if they don't select)
    setShowCityDropdown(true);
  };
  const handleCityInputBlur = () => {
    setTimeout(() => {
        if (showCityDropdown) {
           const exactMatch = cities.find(c => c.name_en.toLowerCase() === citySearchTerm.toLowerCase().trim());
           if (exactMatch) {
               handleCitySelect(exactMatch); // Auto-select if exact match
           }
           setShowCityDropdown(false); // Close dropdown on blur
        }
    }, 150); // 150ms delay
  }
  // ********************************************

  // Close city dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => { if (cityInputRef.current && !cityInputRef.current.contains(event.target)) { setShowCityDropdown(false); } };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  // --- Product Search Logic (No change) ---
  const fetchProductSuggestions = useCallback( _.debounce(async (term) => { if (term.trim().length < 2) { setProductSuggestions([]); setIsLoadingProducts(false); return; } setIsLoadingProducts(true); try { const { data, error } = await supabase .from('ads') .select('id, title, price') .ilike('title', `%${term}%`) .eq('is_sold', false) /* .eq('user_id', 'YOUR_WONDERNES T_USER_ID') */ .limit(5); if (error) throw error; setProductSuggestions(data || []); } catch (err) { console.error("Product suggest error:", err); setProductSuggestions([]); } finally { setIsLoadingProducts(false); } }, 400), [] );
  useEffect(() => { fetchProductSuggestions(productSearchTerm); return () => fetchProductSuggestions.cancel(); }, [productSearchTerm, fetchProductSuggestions]);
  const handleProductSelect = (product) => { setSelectedProduct(product); setProductSearchTerm(product.title); setRetailPrice(product.price); setProductSuggestions([]); const currentSaleAmount = parseFloat(saleAmount) || 0; setEstimatedProfit(currentSaleAmount > 0 ? currentSaleAmount - product.price : 0); setTotalAmount(currentSaleAmount > 0 ? currentSaleAmount + deliveryFee : deliveryFee); };

  // --- Calculation Logic (No change) ---
  useEffect(() => { const rp = parseFloat(retailPrice) || 0; const sa = parseFloat(saleAmount) || 0; setEstimatedProfit(sa > 0 ? sa - rp : 0); setTotalAmount(sa > 0 ? sa + deliveryFee : deliveryFee); }, [saleAmount, retailPrice, deliveryFee]);

  // --- Add/Remove Product Logic (No change) ---
  const handleAddProduct = () => { setError(''); if (!selectedProduct || quantity < 1 || !saleAmount || parseFloat(saleAmount) <= 0) { setError('Please select product, quantity, and valid sale amount.'); return; } if (parseFloat(saleAmount) < retailPrice) { setError('Sale Amount cannot be less than Retail Price.'); return; } const newItem = { product_id: selectedProduct.id, product_name: selectedProduct.title, quantity: parseInt(quantity, 10), retail_price: parseFloat(retailPrice), sale_amount: parseFloat(saleAmount), profit: parseFloat(estimatedProfit), product_note: productNote || null, delivery_fee: deliveryFee }; setOrderItems(prev => [...prev, newItem]); setProductSearchTerm(''); setSelectedProduct(null); setQuantity(1); setRetailPrice(0); setSaleAmount(''); setProductNote(''); setEstimatedProfit(0); setTotalAmount(deliveryFee); };
  const handleRemoveItem = (indexToRemove) => { setOrderItems(prev => prev.filter((_, i) => i !== indexToRemove)); };

  // --- Form Submission Logic (Validation and Error Fix) ---
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // ****** VALIDATION: This check is STRICT and CORRECT ******
    if (!customerName || !address || !selectedCityName || !selectedDistrictName || !orderSource) {
      setError('Please fill in all customer details (including District & City) and select an order source.');
      return;
    }
    // ********************************************************

    if (orderItems.length === 0) { setError('Please add at least one product.'); return; }
    if (!kittoDropAccountId) { setError('Account ID missing.'); return; }

    setIsSubmitting(true);
    const finalTotalAmount = orderItems.reduce((sum, item) => sum + item.sale_amount + item.delivery_fee, 0);
    const finalTotalProfit = orderItems.reduce((sum, item) => sum + item.profit, 0);

    try {
      // Step 1: Insert Order
      const { data: orderData, error: orderError } = await supabase .from('kitto_drop_orders').insert({ kitto_drop_account_id: kittoDropAccountId, customer_name: customerName, customer_address: address, customer_city: selectedCityName, customer_district: selectedDistrictName, due_date: dueDate || null, order_source: orderSource, payment_method: paymentMethod, order_note: orderNote || null, total_order_amount: finalTotalAmount, total_profit: finalTotalProfit, order_status: 'Pending', }).select('id').single();
      if (orderError || !orderData) throw orderError || new Error("No Order ID returned.");
      const newOrderId = orderData.id;

      // Step 2: Insert Items
      const itemsToInsert = orderItems.map(item => ({ ...item, order_id: newOrderId }));
      const { error: itemsError } = await supabase.from('kitto_drop_order_items').insert(itemsToInsert);
      if (itemsError) { await supabase.from('kitto_drop_orders').delete().eq('id', newOrderId); throw itemsError; }

      // Success
      setSuccessMessage('Order placed successfully!');
      // Clear form
      setCustomerName(''); setAddress(''); setSelectedDistrictId(''); setSelectedDistrictName(''); setSelectedCityName(''); setCitySearchTerm(''); setCities([]); setFilteredCities([]);
      setDueDate(new Date().toISOString().split('T')[0]); setOrderSource(null); setOrderNote('');
      setOrderItems([]);
      setProductSearchTerm(''); setSelectedProduct(null); setQuantity(1); setRetailPrice(0); setSaleAmount(''); setProductNote(''); setEstimatedProfit(0); setTotalAmount(deliveryFee);

    } catch (err) {
      console.error('Error submitting order:', err);
      // ****** SYNTAX ERROR FIXED HERE (Added ``) ******
      setError(`Failed to submit order: ${err.message || 'Please check details.'}`);
      // ***********************************************
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render (Design is UNCHANGED) ---
  return (
    <>
      <Header />
      <main className="bg-white min-h-[calc(100vh-150px)] py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-pink-600 mb-6 text-center">
            Place New Kitto Drop Order
          </h1>

          <form onSubmit={handleSubmitOrder} className="space-y-8">

            {/* --- Customer Details Section --- */}
            <section className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Customer Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div> <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label> <input type="text" id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 shadow-sm"/> </div>
                <div> <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">District *</label> <select id="district" value={selectedDistrictId} onChange={handleDistrictChange} required disabled={isFetchingLocations} className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 shadow-sm bg-white appearance-none ${isFetchingLocations ? 'cursor-not-allowed': ''}`}> {districts.map(d => <option key={d.id || 'placeholder'} value={d.id} disabled={!d.id}>{d.name_en}</option>)} </select> </div>
                <div className="sm:col-span-2"> <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address *</label> <textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} required rows={3} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 shadow-sm"/> </div>
                {/* City Search/Select */}
                <div className="relative" ref={cityInputRef}>
                  <label htmlFor="citySearch" className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    id="citySearch"
                    placeholder={selectedDistrictId ? "Type or select city..." : "Select District first"}
                    value={citySearchTerm}
                    onChange={handleCityInputChange} // Changed
                    onFocus={() => selectedDistrictId && setShowCityDropdown(true)}
                    onBlur={handleCityInputBlur} // Added
                    disabled={!selectedDistrictId || isFetchingLocations}
                    required={!selectedCityName} // Validation based on selectedCityName
                    className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 shadow-sm ${!selectedDistrictId || isFetchingLocations ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                    autoComplete="off"
                  />
                  {isFetchingLocations && selectedDistrictId && <FaSpinner className="animate-spin absolute right-3 top-9 text-gray-400"/>}
                  {showCityDropdown && selectedDistrictId && !isFetchingLocations && (
                    <ul className="absolute left-0 right-0 top-full mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-20 max-h-48 overflow-y-auto">
                      {filteredCities.length > 0 ? (
                        filteredCities.map(c => (
                          <li key={c.id} onClick={() => handleCitySelect(c)} className="px-3 py-2 hover:bg-pink-50 cursor-pointer text-sm text-gray-800">
                            {c.name_en}
                          </li>
                        ))
                      ) : ( <li className="px-3 py-2 text-gray-500 text-sm"> {citySearchTerm ? 'No cities found.' : 'No cities listed.'} </li> )}
                    </ul>
                  )}
                </div>
                <div> <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">Due Date</label> <input type="date" id="dueDate" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 shadow-sm"/> </div>
                <div className="sm:col-span-2"> <label className="block text-sm font-medium text-gray-700 mb-2">Order Source *</label> <div className="flex flex-wrap gap-3"> {orderSourcePlatforms.map(platform => ( <button type="button" key={platform.key} onClick={() => setOrderSource(platform.key)} className={`p-2 border rounded-full flex items-center justify-center transition-all duration-150 ${ orderSource === platform.key ? 'border-pink-500 bg-pink-50 ring-2 ring-pink-300' : 'border-gray-300 bg-white hover:bg-gray-50' }`}> <platform.icon className={`w-5 h-5 ${platform.color}`} /> </button> ))} </div> </div>
                <div> <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label> <input type="text" id="paymentMethod" value={paymentMethod} readOnly disabled className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed shadow-sm"/> </div>
                <div className="sm:col-span-2"> <label htmlFor="orderNote" className="block text-sm font-medium text-gray-700 mb-1">Order Note (Optional)</label> <textarea id="orderNote" value={orderNote} onChange={(e) => setOrderNote(e.target.value)} rows={2} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 shadow-sm"/> </div>
              </div>
            </section>

            {/* --- Order Items Section --- */}
            <section className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Products</h2>
              {/* Display Added Items */}
              {orderItems.length > 0 && ( <div className="mb-6 space-y-3"> <h3 className="text-base font-medium text-gray-600">Items Added:</h3> {orderItems.map((item, index) => ( <div key={index} className="flex justify-between items-start bg-white p-3 rounded border border-gray-200 gap-2 text-sm"> <div> <p className="font-semibold text-gray-800">{item.quantity} x {item.product_name}</p> <p className="text-xs text-gray-500">Sale: Rs. {item.sale_amount.toFixed(2)} | Profit: Rs. {item.profit.toFixed(2)}</p> {item.product_note && <p className="text-xs text-gray-500 mt-1">Note: {item.product_note}</p>} </div> <button type="button" onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700 flex-shrink-0 pt-1"> <FaTrashAlt size={14}/> </button> </div> ))} <p className="text-right text-sm font-medium text-gray-700 pt-2"> Subtotal (Items + Delivery): Rs. {orderItems.reduce((sum, item) => sum + item.sale_amount + item.delivery_fee, 0).toFixed(2)} </p> </div> )}
              {/* Add New Item Form */}
              <div className="space-y-4 pt-4 border-t border-dashed">
                <h3 className="text-base font-semibold text-gray-700 -mb-2">Add Product</h3>
                <div className="relative"> <label htmlFor="productSearch" className="block text-sm font-medium text-gray-700 mb-1">Product *</label> <input type="text" id="productSearch" placeholder="Type product name (from WonderNest)..." value={productSearchTerm} onChange={(e) => {setProductSearchTerm(e.target.value); setSelectedProduct(null); setRetailPrice(0);}} 
                  required={orderItems.length === 0} // <<< BUG FIX HERE
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 shadow-sm" autoComplete="off"/> {(isLoadingProducts || productSuggestions.length > 0) && ( <ul className="absolute left-0 right-0 top-full mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto"> {isLoadingProducts && <li className="px-3 py-2 text-gray-500 text-sm">Searching...</li>} {!isLoadingProducts && productSuggestions.map(p => ( <li key={p.id} onClick={() => handleProductSelect(p)} className="px-3 py-2 hover:bg-pink-50 cursor-pointer text-sm text-gray-800"> {p.title} <span className="text-xs text-gray-400">(Rs. {p.price})</span> </li> ))} </ul> )} </div>
                <div className="grid grid-cols-2 gap-4"> <div> <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Qty *</label> <input type="number" id="quantity" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} min="1" 
                  required={orderItems.length === 0} // <<< BUG FIX HERE
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 shadow-sm"/> </div> <div> <label htmlFor="retailPrice" className="block text-sm font-medium text-gray-700 mb-1">Retail Price</label> <input type="text" id="retailPrice" value={`Rs. ${retailPrice.toFixed(2)}`} readOnly disabled className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed shadow-sm"/> </div> </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4"> <div className="sm:col-span-1"> <label htmlFor="saleAmount" className="block text-sm font-medium text-gray-700 mb-1">Your Sale Amount *</label> <input type="number" id="saleAmount" value={saleAmount} onChange={(e) => setSaleAmount(e.target.value)} 
                  required={orderItems.length === 0} // <<< BUG FIX HERE
                  min={retailPrice > 0 ? retailPrice : 0} step="0.01" placeholder="e.g., 2500.00" className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 shadow-sm"/> </div> <div className="sm:col-span-1"> <label htmlFor="estProfit" className="block text-sm font-medium text-gray-700 mb-1">Estimated Profit</label> <input type="text" id="estProfit" value={`Rs. ${estimatedProfit.toFixed(2)}`} readOnly disabled className={`w-full p-2 border rounded-md bg-gray-100 text-gray-500 cursor-not-allowed shadow-sm ${estimatedProfit < 0 ? 'border-red-400 text-red-600' : 'border-gray-300'}`}/> </div> <div className="sm:col-span-1"> <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700 mb-1">Total (Sale + Del.)</label> <input type="text" id="totalAmount" value={`Rs. ${totalAmount.toFixed(2)}`} readOnly disabled className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed shadow-sm"/> </div> </div>
                <div> <label htmlFor="productNote" className="block text-sm font-medium text-gray-700 mb-1">Product Note (Optional)</label> <input type="text" id="productNote" value={productNote} onChange={(e) => setProductNote(e.target.value)} placeholder="e.g., Color preference, size" className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 shadow-sm"/> </div>
                <button type="button" onClick={handleAddProduct} disabled={!selectedProduct || isSubmitting} className={`w-full sm:w-auto px-5 py-2 rounded-lg text-white font-semibold transition-colors flex items-center justify-center text-sm sm:text-base ${ !selectedProduct ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700' }`}> <FaPlus className="mr-2 h-4 w-4"/> Add Product to Order </button>
                {error && orderItems.length === 0 && <p className="text-xs text-red-600 mt-1">{error}</p>}
              </div>
            </section>

            {/* Error/Success Messages */}
            {error && <p className="text-sm text-red-600 text-center mt-4"><FaExclamationTriangle className="inline mr-1.5"/>{error}</p>}
            {successMessage && <p className="text-sm text-green-600 text-center mt-4"><FaCheckCircle className="inline mr-1.5"/>{successMessage}</p>}

            {/* Submit Order Button */}
            <button type="submit" disabled={isSubmitting || orderItems.length === 0} className={`w-full mt-8 bg-pink-600 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg flex items-center justify-center ${ isSubmitting || orderItems.length === 0 ? 'opacity-70 cursor-not-allowed' : 'hover:bg-pink-700' }`}> {isSubmitting ? <FaSpinner className="animate-spin mr-2" /> : null} {isSubmitting ? 'Submitting Order...' : 'Submit Order'} </button>
            <Link href="/kitto-drop" className="block mt-4 text-center text-gray-500 hover:underline text-sm"> Cancel </Link>
          </form>
        </div>
      </main>
      <Footer />

       {/* Helper CSS (Removed classes, using Tailwind directly) */}
       <style jsx global>{`
        /* Added Tailwind base classes to use in component */
        .label-style { @apply block text-sm font-medium text-gray-700 mb-1; }
        .input-style { @apply w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 shadow-sm text-base; }
        .disabled-input { @apply bg-gray-100 text-gray-500 cursor-not-allowed; }
        .button-style { @apply px-5 py-2 rounded-lg text-white font-semibold transition-colors flex items-center justify-center text-sm sm:text-base; }
        .disabled-button { @apply opacity-70 cursor-not-allowed; }
        .dropdown-style { @apply absolute left-0 right-0 top-full mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto; }
        .dropdown-item { @apply px-3 py-2 hover:bg-pink-50 cursor-pointer text-sm text-gray-800; }
        .selected-platform { @apply border-pink-500 bg-pink-50 ring-2 ring-pink-300; }
        .default-platform { @apply border-gray-300 bg-white hover:bg-gray-50; }
        .error-message { @apply text-sm text-red-600 text-center mt-4; }
        .success-message { @apply text-sm text-green-600 text-center mt-4; }
        /* Scrollbar */
        .modal-list-scroll::-webkit-scrollbar { width: 6px; }
        .modal-list-scroll::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 3px;}
        .modal-list-scroll::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px;}
        .modal-list-scroll::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
       `}</style>
    </>
  );
}