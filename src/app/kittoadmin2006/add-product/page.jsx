'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FaSpinner, FaExclamationTriangle, FaPlus, FaUpload, FaTrashAlt, 
  FaCheckCircle, FaArrowLeft, FaBoxOpen, FaTag, FaMoneyBillWave, FaLayerGroup
} from 'react-icons/fa';

// --- Custom Toast Notification ---
const ToastNotification = ({ message, type, show, onClose }) => {
  if (!show) return null;
  const bgColor = type === 'error' ? 'bg-red-600' : 'bg-green-600';
  return (
    <div className="fixed top-5 right-5 z-50 animate-slide-in-right">
      <div className={`${bgColor} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-white/20`}>
        {type === 'error' ? <FaExclamationTriangle /> : <FaCheckCircle />}
        <span className="font-medium">{message}</span>
        <button onClick={onClose} className="ml-4 text-white/70 hover:text-white">✕</button>
      </div>
    </div>
  );
};

export default function AddProductPage() {
  // Form States
  const [productName, setProductName] = useState('');
  const [productCode, setProductCode] = useState('');
  const [description, setDescription] = useState('');
  const [retailPrice, setRetailPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [files, setFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  
  // UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToastMsg = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  // Handle Image Selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length + files.length > 5) {
      showToastMsg("Maximum 5 images allowed", "error");
      return;
    }

    const newFiles = [...files, ...selectedFiles];
    setFiles(newFiles);

    // Generate previews
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  // Remove Image
  const removeImage = (index) => {
    const newFiles = [...files];
    const newPreviews = [...imagePreviews];
    
    URL.revokeObjectURL(newPreviews[index]); // Free memory
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);

    setFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!productName || !retailPrice || !stockQuantity) {
      showToastMsg('Please fill in Name, Price and Stock.', 'error');
      setIsSubmitting(false);
      return;
    }
    if (files.length === 0) {
      showToastMsg('Please upload at least one image.', 'error');
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Upload Images
      const uploadedImageUrls = [];
      
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `products/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('product_images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('product_images')
          .getPublicUrl(fileName);
        
        uploadedImageUrls.push(urlData.publicUrl);
      }

      // 2. Save Product Data
      const { error: insertError } = await supabase
        .from('kitto_drop_products')
        .insert({
          product_name: productName,
          product_code: productCode || null,
          description: description || null,
          retail_price: parseFloat(retailPrice),
          stock_quantity: parseInt(stockQuantity),
          image_urls: uploadedImageUrls, // ✅ Correct Column (Array)
          // image_url: uploadedImageUrls[0], ❌ Removed this causing the error
          is_active: true
        });

      if (insertError) throw insertError;

      showToastMsg('Product added successfully!');
      
      // Clear Form
      setProductName(''); setProductCode(''); setDescription('');
      setRetailPrice(''); setStockQuantity('');
      setFiles([]); setImagePreviews([]);

    } catch (err) {
      console.error('Error adding product:', err);
      showToastMsg(err.message || 'Failed to add product', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <ToastNotification {...toast} onClose={() => setToast({ ...toast, show: false })} />
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <Link href="/kittoadmin2006" className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 font-semibold rounded-lg shadow hover:bg-gray-100 transition-colors">
            <FaArrowLeft /> Back
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Product Name *</label>
                <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none" placeholder="Product Name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Product Code</label>
                <div className="relative">
                  <FaTag className="absolute left-3 top-3.5 text-gray-400" />
                  <input type="text" value={productCode} onChange={(e) => setProductCode(e.target.value)} className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none" placeholder="SKU-123" />
                </div>
              </div>
            </div>

            {/* Price & Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-pink-50 p-6 rounded-xl border border-pink-100">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Retail Price (Rs.) *</label>
                <div className="relative">
                  <FaMoneyBillWave className="absolute left-3 top-3.5 text-green-600" />
                  <input type="number" value={retailPrice} onChange={(e) => setRetailPrice(e.target.value)} className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="0.00" min="0" step="0.01" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Stock Quantity *</label>
                <div className="relative">
                  <FaLayerGroup className="absolute left-3 top-3.5 text-blue-600" />
                  <input type="number" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" min="0" />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none" placeholder="Product details..."></textarea>
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <label className="text-sm font-bold text-gray-700">Product Images (Max 5) *</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <label className="border-2 border-dashed border-gray-300 rounded-xl h-32 flex flex-col items-center justify-center cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition-all">
                  <FaUpload className="text-2xl text-gray-400 mb-2" />
                  <span className="text-xs font-bold text-gray-500">Upload</span>
                  <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" disabled={files.length >= 5} />
                </label>

                {imagePreviews.map((url, idx) => (
                  <div key={idx} className="relative h-32 rounded-xl overflow-hidden border border-gray-200 group">
                    <Image src={url} alt="preview" layout="fill" objectFit="cover" />
                    <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700">
                      <FaTrashAlt size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button type="submit" disabled={isSubmitting} className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all ${isSubmitting ? 'bg-gray-400' : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:shadow-pink-500/30 hover:-translate-y-1'}`}>
                {isSubmitting ? <span className="flex items-center justify-center gap-2"><FaSpinner className="animate-spin" /> Saving...</span> : <span className="flex items-center justify-center gap-2"><FaPlus /> Add Product</span>}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}