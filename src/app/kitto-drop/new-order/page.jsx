'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { FaWhatsapp, FaFacebook, FaTiktok, FaInstagram, FaYoutube, FaTimes, FaSpinner, FaCheckCircle, FaExclamationTriangle, FaPlus, FaTrashAlt, FaSearch } from 'react-icons/fa';
import _ from 'lodash';

// Order Source Platforms
const orderSourcePlatforms = [ 
  { key: 'whatsapp', name: 'WhatsApp', icon: FaWhatsapp, color: 'text-green-500' }, 
  { key: 'facebook', name: 'Facebook', icon: FaFacebook, color: 'text-blue-600' }, 
  { key: 'tiktok', name: 'TikTok', icon: FaTiktok, color: 'text-black' }, 
  { key: 'instagram', name: 'Instagram', icon: FaInstagram, color: 'text-pink-500' }, 
  { key: 'youtube', name: 'YouTube', icon: FaYoutube, color: 'text-red-600' }, 
];

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
  const [selectedCityName, setSelectedCityName] = useState('');
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [filteredCities, setFilteredCities] = useState([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const cityInputRef = useRef(null);
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [orderSource, setOrderSource] = useState(null);
  const [paymentMethod] = useState('Cash on Delivery');
  const [orderNote, setOrderNote] = useState('');

  // Product Line Item State
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

  // Order Items State
  const [orderItems, setOrderItems] = useState([]);

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isFetchingLocations, setIsFetchingLocations] = useState(false);

  // --- Verify User & Fetch Districts on Mount ---
  useEffect(() => {
    let accountId = null;
    try {
      const storedUser = localStorage.getItem('kittoDropUser');
      if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') { 
        const userData = JSON.parse(storedUser);
        if (userData && userData.id) {
          accountId = userData.id;
          setKittoDropAccountId(accountId);
        } else { throw new Error("Invalid user data format."); }
      } else { throw new Error("No user data found."); }
    } catch (e) {
      console.error("User data error", e);
      router.push('/kitto-drop/login'); return;
    }
    
    const fetchDistricts = async () => {
      setIsFetchingLocations(true);
      const { data, error } = await supabase.from('districts').select('id, name_en').order('name_en');
      if (error) { console.error("Error fetching districts:", error); setError("Could not load districts."); }
      else { setDistricts([{ id: '', name_en: 'Select District...' }, ...data]); }
      setIsFetchingLocations(false);
    };
    if (accountId) { fetchDistricts(); }
  }, [router]);

  // --- Location Handlers ---
  const handleDistrictChange = async (event) => {
    const selectedId = event.target.value; const selectedName = event.target.options[event.target.selectedIndex].text;
    setSelectedDistrictId(selectedId); setSelectedDistrictName(selectedId ? selectedName : ''); setSelectedCityName('');
    setCitySearchTerm(''); setCities([]); setFilteredCities([]); setShowCityDropdown(false);
    if (selectedId) {
      setIsFetchingLocations(true);
      const { data, error } = await supabase.from('cities').select('id, name_en').eq('district_id', selectedId).order('name_en');
      if (error) { console.error("Error fetching cities:", error); setError("Could not load cities."); }
      else { setCities(data || []); setFilteredCities((data || []).slice(0, 10)); }
      setIsFetchingLocations(false);
    }
  };
  useEffect(() => {
    if (cities.length > 0) { const searchTermLower = citySearchTerm.toLowerCase(); const results = searchTermLower ? cities.filter(city => city.name_en.toLowerCase().includes(searchTermLower)) : cities.slice(0, 10); setFilteredCities(results.slice(0, 20)); }
    else { setFilteredCities([]); }
  }, [citySearchTerm, cities]);
  const handleCitySelect = (city) => { setSelectedCityName(city.name_en); setCitySearchTerm(city.name_en); setShowCityDropdown(false); };
  const handleCityInputChange = (e) => { setCitySearchTerm(e.target.value); setSelectedCityName(''); setShowCityDropdown(true); };
  const handleCityInputBlur = () => { setTimeout(() => { if (showCityDropdown) { const exactMatch = cities.find(c => c.name_en.toLowerCase() === citySearchTerm.toLowerCase().trim()); if (exactMatch) { handleCitySelect(exactMatch); } setShowCityDropdown(false); } }, 150); }
  useEffect(() => { const handleClickOutside = (event) => { if (cityInputRef.current && !cityInputRef.current.contains(event.target)) { setShowCityDropdown(false); } }; document.addEventListener('mousedown', handleClickOutside); return () => document.removeEventListener('mousedown', handleClickOutside); }, []);

  // --- Product Search Logic ---
  const fetchProductSuggestions = useCallback(
    _.debounce(async (term) => {
      if (term.trim().length < 2) {
        setProductSuggestions([]);
        setIsLoadingProducts(false);
        return;
      }
      setIsLoadingProducts(true);
      try {
        const { data, error } = await supabase
          .from('kitto_drop_products')
          .select('id, product_name, retail_price, stock_quantity, product_code')
          .ilike('product_name', `%${term}%`)
          .eq('is_active', true)
          .gt('stock_quantity', 0)
          .limit(5);

        if (error) throw error;
        setProductSuggestions(data || []);
      } catch (err) {
        console.error("Kitto Drop Product suggest error:", err);
        setProductSuggestions([]);
      } finally {
        setIsLoadingProducts(false);
      }
    }, 400), 
    []
  );

  useEffect(() => {
    fetchProductSuggestions(productSearchTerm);
    return () => fetchProductSuggestions.cancel();
  }, [productSearchTerm, fetchProductSuggestions]);

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setProductSearchTerm(product.product_name);
    setRetailPrice(product.retail_price);
    setProductSuggestions([]);
    
    const currentSaleAmount = parseFloat(saleAmount) || 0;
    setEstimatedProfit(currentSaleAmount > 0 ? currentSaleAmount - product.retail_price : 0);
    setTotalAmount(currentSaleAmount > 0 ? currentSaleAmount + deliveryFee : deliveryFee);
  };

  useEffect(() => { const rp = parseFloat(retailPrice) || 0; const sa = parseFloat(saleAmount) || 0; setEstimatedProfit(sa > 0 ? sa - rp : 0); setTotalAmount(sa > 0 ? sa + deliveryFee : deliveryFee); }, [saleAmount, retailPrice, deliveryFee]);

  const handleAddProduct = () => {
    setError('');
    if (!selectedProduct || quantity < 1 || !saleAmount || parseFloat(saleAmount) <= 0) { setError('Please select product, quantity, and valid sale amount.'); return; }
    if (parseFloat(saleAmount) < retailPrice) { setError('Sale Amount cannot be less than Retail Price.'); return; }
    if (quantity > selectedProduct.stock_quantity) { setError(`Only ${selectedProduct.stock_quantity} items available in stock.`); return; }

    const newItem = {
      product_id: selectedProduct.id,
      product_name: selectedProduct.product_name, // This is correct locally
      quantity: parseInt(quantity, 10),
      retail_price: parseFloat(retailPrice),
      sale_amount: parseFloat(saleAmount),
      profit: (parseFloat(saleAmount) - parseFloat(retailPrice)) * parseInt(quantity, 10),
      product_note: productNote || null,
      delivery_fee: deliveryFee,
    };
    setOrderItems(prev => [...prev, newItem]);
    setProductSearchTerm(''); setSelectedProduct(null); setQuantity(1); setRetailPrice(0); setSaleAmount(''); setProductNote(''); setEstimatedProfit(0); setTotalAmount(deliveryFee);
  };
  const handleRemoveItem = (indexToRemove) => { setOrderItems(prev => prev.filter((_, i) => i !== indexToRemove)); };

  const finalTotalAmount = orderItems.reduce((sum, item) => sum + (item.sale_amount * item.quantity) + item.delivery_fee, 0);
  const finalTotalProfit = orderItems.reduce((sum, item) => sum + item.profit, 0);

  // --- Form Submission Logic (FIXED) ---
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!customerName || !address || !selectedCityName || !selectedDistrictName || !orderSource) {
      setError('Please fill in all customer details (including District & City) and select an order source.');
      return;
    }
    if (orderItems.length === 0) { setError('Please add at least one product.'); return; }
    if (!kittoDropAccountId) { setError('Account ID missing.'); return; }

    setIsSubmitting(true);
    
    try {
      // Step 1: Insert Order
      const { data: orderData, error: orderError } = await supabase
        .from('kitto_drop_orders')
        .insert({ 
            kitto_drop_account_id: kittoDropAccountId, 
            customer_name: customerName, 
            customer_address: address, 
            customer_city: selectedCityName, 
            customer_district: selectedDistrictName, 
            due_date: dueDate || null, 
            order_source: orderSource, 
            payment_method: paymentMethod, 
            order_note: orderNote || null, 
            total_order_amount: finalTotalAmount, 
            total_profit: finalTotalProfit, 
            order_status: 'Pending', 
        })
        .select('id')
        .single();

      if (orderError || !orderData) throw orderError || new Error("No Order ID returned.");
      const newOrderId = orderData.id;

      // Step 2: Insert Items (FIXED: Added product_name)
      const itemsToInsert = orderItems.map(item => ({
          order_id: newOrderId,
          product_id: item.product_id,
          product_name: item.product_name, // ✅ මෙම කොටස එකතු කරන ලදී
          quantity: item.quantity,
          sale_amount: item.sale_amount,
          product_note: item.product_note, // Color එක මෙතනින් යනවා
          profit: item.profit / item.quantity 
      }));
      
      const { error: itemsError } = await supabase.from('kitto_drop_order_items').insert(itemsToInsert);
      
      if (itemsError) { 
          await supabase.from('kitto_drop_orders').delete().eq('id', newOrderId); 
          throw itemsError; 
      }

      setSuccessMessage('Order placed successfully! Redirecting to dashboard...');
      setTimeout(() => {
        router.push('/kitto-drop'); 
      }, 2000);

    } catch (err) {
      console.error('Error submitting order:', err);
      setError(`Failed to submit order: ${err.message || 'Please check details.'}`);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="bg-white min-h-[calc(100vh-150px)] py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-6 text-center">
            Place New Kitto Drop Order
          </h1>

          <form onSubmit={handleSubmitOrder} className="space-y-8">
            <section className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Customer Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div> <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label> <input type="text" id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 shadow-sm"/> </div>
                <div> <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">District *</label> <select id="district" value={selectedDistrictId} onChange={handleDistrictChange} required disabled={isFetchingLocations} className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 shadow-sm bg-white appearance-none ${isFetchingLocations ? 'cursor-not-allowed': ''}`}> {districts.map(d => <option key={d.id || 'placeholder'} value={d.id} disabled={!d.id}>{d.name_en}</option>)} </select> </div>
                <div className="sm:col-span-2"> <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address *</label> <textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} required rows={3} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 shadow-sm"/> </div>
                <div className="relative" ref={cityInputRef}>
                  <label htmlFor="citySearch" className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input type="text" id="citySearch" placeholder={selectedDistrictId ? "Type or select city..." : "Select District first"} value={citySearchTerm} onChange={handleCityInputChange} onFocus={() => selectedDistrictId && setShowCityDropdown(true)} onBlur={handleCityInputBlur} disabled={!selectedDistrictId || isFetchingLocations} required={!selectedCityName} className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary shadow-sm ${!selectedDistrictId || isFetchingLocations ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`} autoComplete="off" />
                  {isFetchingLocations && selectedDistrictId && <FaSpinner className="animate-spin absolute right-3 top-9 text-gray-400"/>}
                  {showCityDropdown && selectedDistrictId && !isFetchingLocations && (
                    <ul className="absolute left-0 right-0 top-full mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-20 max-h-48 overflow-y-auto">
                      {filteredCities.length > 0 ? ( filteredCities.map(c => ( <li key={c.id} onClick={() => handleCitySelect(c)} className="px-3 py-2 hover:bg-pink-50 cursor-pointer text-sm text-gray-800"> {c.name_en} </li> )) ) : ( <li className="px-3 py-2 text-gray-500 text-sm"> {citySearchTerm ? 'No cities found.' : 'No cities listed.'} </li> )}
                    </ul>
                  )}
                </div>
                <div> <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">Due Date</label> <input type="date" id="dueDate" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"/> </div>
                <div className="sm:col-span-2"> <label className="block text-sm font-medium text-gray-700 mb-2">Order Source *</label> <div className="flex flex-wrap gap-3"> {orderSourcePlatforms.map(platform => ( <button type="button" key={platform.key} onClick={() => setOrderSource(platform.key)} className={`p-2 border rounded-full flex items-center justify-center transition-all duration-150 ${ orderSource === platform.key ? 'border-primary bg-pink-50 ring-2 ring-primary' : 'border-gray-300 bg-white hover:bg-gray-50' }`}> <platform.icon className={`w-5 h-5 ${platform.color}`} /> </button> ))} </div> </div>
                <div> <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label> <input type="text" id="paymentMethod" value={paymentMethod} readOnly disabled className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed shadow-sm"/> </div>
                <div className="sm:col-span-2"> <label htmlFor="orderNote" className="block text-sm font-medium text-gray-700 mb-1">Order Note (Optional)</label> <textarea id="orderNote" value={orderNote} onChange={(e) => setOrderNote(e.target.value)} rows={2} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"/> </div>
              </div>
            </section>

            <section className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Products</h2>
              {orderItems.length > 0 && ( <div className="mb-6 space-y-3"> <h3 className="text-base font-medium text-gray-600">Items Added:</h3> {orderItems.map((item, index) => ( <div key={index} className="flex justify-between items-start bg-white p-3 rounded border border-gray-200 gap-2 text-sm"> <div> <p className="font-semibold text-gray-800">{item.quantity} x {item.product_name}</p> <p className="text-xs text-gray-500">Sale: Rs. {(item.sale_amount * item.quantity).toFixed(2)} | Profit: Rs. {item.profit.toFixed(2)}</p> {item.product_note && <p className="text-xs text-gray-500 mt-1">Note: {item.product_note}</p>} </div> <button type="button" onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700 flex-shrink-0 pt-1"> <FaTrashAlt size={14}/> </button> </div> ))} 
              <div className="border-t pt-4 mt-4 space-y-1 text-right font-medium text-gray-700">
                <p className="text-sm">Items Amount: <span className="font-bold text-gray-800">Rs. {orderItems.reduce((sum, item) => sum + (item.sale_amount * item.quantity), 0).toFixed(2)}</span></p>
                <p className="text-sm">Total Delivery: <span className="font-bold text-gray-800">Rs. {(orderItems.length * deliveryFee).toFixed(2)}</span></p>
                <p className="text-base sm:text-lg text-primary mt-1">Total Customer Payable: <span className="font-bold">Rs. {finalTotalAmount.toFixed(2)}</span></p>
                <p className="text-base text-green-600">Est. Total Profit: <span className="font-bold">Rs. {finalTotalProfit.toFixed(2)}</span></p>
              </div>
              </div> )}
              
              <div className="space-y-4 pt-4 border-t border-dashed">
                <h3 className="text-base font-semibold text-gray-700 -mb-2">Add Product</h3>
                <div className="relative"> 
                  <label htmlFor="productSearch" className="block text-sm font-medium text-gray-700 mb-1">Product *</label> 
                  <input type="text" id="productSearch" placeholder="Type Kitto Drop product name or code..." value={productSearchTerm} onChange={(e) => {setProductSearchTerm(e.target.value); setSelectedProduct(null); setRetailPrice(0);}} required={orderItems.length === 0} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary shadow-sm" autoComplete="off"/> 
                  {(isLoadingProducts || productSuggestions.length > 0) && ( 
                    <ul className="absolute left-0 right-0 top-full mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto"> 
                      {isLoadingProducts && <li className="px-3 py-2 text-gray-500 text-sm">Searching...</li>} 
                      {!isLoadingProducts && productSuggestions.map(p => ( 
                        <li key={p.id} onClick={() => handleProductSelect(p)} className="px-3 py-2 hover:bg-pink-50 cursor-pointer text-sm text-gray-800"> {p.product_name} <span className="text-xs text-gray-400">(Rs. {p.retail_price}) (Stock: {p.stock_quantity})</span> </li> 
                      ))} 
                    </ul> 
                  )} 
                </div>
                <div className="grid grid-cols-2 gap-4"> 
                  <div> <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Qty *</label> <input type="number" id="quantity" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} min="1" required={orderItems.length === 0} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 shadow-sm"/> </div>
                  <div> <label htmlFor="retailPrice" className="block text-sm font-medium text-gray-700 mb-1">Retail Price</label> <input type="text" id="retailPrice" value={`Rs. ${retailPrice.toFixed(2)}`} readOnly disabled className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed shadow-sm"/> </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> 
                  <div> <label htmlFor="saleAmount" className="block text-sm font-medium text-gray-700 mb-1">Your Sale Amount *</label> <input type="number" id="saleAmount" value={saleAmount} onChange={(e) => setSaleAmount(e.target.value)} required={orderItems.length === 0} min={retailPrice > 0 ? retailPrice : 0} step="0.01" placeholder="e.g., 2500.00" className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 shadow-sm"/> </div>
                  <div> <label htmlFor="estProfit" className="block text-sm font-medium text-gray-700 mb-1">Estimated Profit (Item)</label> <input type="text" id="estProfit" value={`Rs. ${estimatedProfit.toFixed(2)}`} readOnly disabled className={`w-full p-2 border rounded-md bg-gray-100 text-gray-500 cursor-not-allowed shadow-sm ${estimatedProfit < 0 ? 'border-red-400 text-red-600' : ''}`}/> </div>
                </div>
                <div> <label htmlFor="productNote" className="block text-sm font-medium text-gray-700 mb-1">Product Note (Optional)</label> <input type="text" id="productNote" value={productNote} onChange={(e) => setProductNote(e.target.value)} placeholder="e.g., Color preference, size" className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 shadow-sm"/> </div>
                <button type="button" onClick={handleAddProduct} disabled={!selectedProduct || isSubmitting} className={`w-full sm:w-auto px-5 py-2 rounded-lg text-white font-semibold transition-colors flex items-center justify-center text-sm sm:text-base ${ !selectedProduct ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700' }`}> <FaPlus className="mr-2 h-4 w-4"/> Add Product to Order </button>
                {error && orderItems.length === 0 && <p className="text-xs text-red-600 mt-1">{error}</p>}
              </div>
            </section>

            {error && <p className="text-sm text-red-600 text-center mt-4"><FaExclamationTriangle className="inline mr-1.5"/>{error}</p>}
            {successMessage && <p className="text-sm text-green-600 text-center mt-4 font-bold"><FaCheckCircle className="inline mr-1.5"/>{successMessage}</p>}

            <button type="submit" disabled={isSubmitting || orderItems.length === 0} className={`w-full mt-8 bg-primary text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg flex items-center justify-center ${ isSubmitting || orderItems.length === 0 ? 'opacity-70 cursor-not-allowed' : 'hover:bg-pink-700' }`}> {isSubmitting ? <FaSpinner className="animate-spin mr-2" /> : null} {isSubmitting ? 'Processing...' : 'Submit Order'} </button>
            <Link href="/kitto-drop" className="block mt-4 text-center text-gray-500 hover:underline text-sm"> Cancel </Link>
          </form>
        </div>
      </main>
      <Footer />
       <style jsx global>{`
        .label-style { @apply block text-sm font-medium text-gray-700 mb-1; }
        .input-style { @apply w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm text-base placeholder:text-gray-400 transition duration-150; }
        .disabled-input { @apply bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200; }
        .dropdown-style { @apply absolute left-0 right-0 top-full mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-20 max-h-48 overflow-y-auto; }
        .dropdown-item { @apply px-3 py-2 hover:bg-pink-50 cursor-pointer text-sm text-gray-800; }
        .platform-button { @apply p-2 border rounded-full flex items-center justify-center transition-all duration-150; }
        .selected-platform { @apply border-primary bg-pink-50 ring-2 ring-primary; }
        .default-platform { @apply border-gray-300 bg-white hover:bg-gray-100; }
        .error-message { @apply text-sm text-red-600 text-center mt-4; }
        .success-message { @apply text-sm text-green-600 text-center mt-4; }
        .button-style { @apply rounded-lg text-white font-semibold transition-colors flex items-center justify-center; }
        .disabled-button { @apply opacity-70 cursor-not-allowed; }
        .modal-list-scroll::-webkit-scrollbar { width: 6px; }
        .modal-list-scroll::-webkit-scrollbar-track { background: #f1f1ff; }
        .modal-list-scroll::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px;}
        .modal-list-scroll::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
       `}</style>
    </>
  );
}