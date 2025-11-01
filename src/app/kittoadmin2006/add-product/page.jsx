'use client'; 

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FaSpinner, 
  FaExclamationTriangle,
  FaPlus,
  FaUpload,
  FaTrashAlt,
  FaCheckCircle,
  FaArrowLeft
} from 'react-icons/fa';

// --- 🚀 "Add Product" Form Component එක ---
const AddProductForm = () => {
  // Form eke data save karaganna states
  const [productName, setProductName] = useState('');
  const [productCode, setProductCode] = useState('');
  const [description, setDescription] = useState('');
  const [retailPrice, setRetailPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [files, setFiles] = useState([]); // Image files walata
  const [imagePreviews, setImagePreviews] = useState([]); // Images pennanna
  
  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Image eka select kalama
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    // Memory leaks nathuwa previews hadanawa
    // Padi previews okkoma ain karanawa
    imagePreviews.forEach(url => URL.revokeObjectURL(url));
    
    // Aluth previews hadanawa
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(newPreviews);
  };

  // Image eka ain karanna
  const removeImage = (index) => {
    const newFiles = [...files];
    const newPreviews = [...imagePreviews];
    
    URL.revokeObjectURL(newPreviews[index]); // Memory eken ain karanawa

    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);

    setFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  // Form eka Submit kalama
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    // 1. Validation (simple)
    if (!productName || !retailPrice || !stockQuantity || files.length === 0) {
      setErrorMessage('Please fill in Product Name, Retail Price, Stock, and at least one Image.');
      setIsSubmitting(false);
      return;
    }

    try {
      // 2. Image(s) Upload Karanawa (Supabase Storage walata)
      const uploadedImageUrls = [];
      
      for (const file of files) {
        const fileName = `${Date.now()}-${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('product_images') // <-- Me bucket eka hadala thiyenna ona
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Upload karapu image eke Public URL eka gannawa
        const { data: urlData } = supabase
          .storage
          .from('product_images')
          .getPublicUrl(uploadData.path);
        
        uploadedImageUrls.push(urlData.publicUrl);
      }

      // 3. Product Data eka 'kitto_drop_products' Table ekata Danawa
      const { error: insertError } = await supabase
        .from('kitto_drop_products')
        .insert({
          product_name: productName,
          product_code: productCode || null,
          description: description || null,
          retail_price: parseFloat(retailPrice),
          stock_quantity: parseInt(stockQuantity),
          image_urls: uploadedImageUrls, // Image URL list eka
          is_active: true // Danagahama active karanawa
        });

      if (insertError) throw insertError;

      // 4. Success!
      setSuccessMessage('Product added successfully!');
      // Form eka clear karanawa
      setProductName('');
      setProductCode('');
      setDescription('');
      setRetailPrice('');
      setStockQuantity('');
      setFiles([]);
      imagePreviews.forEach(url => URL.revokeObjectURL(url)); // Previews clear karanawa
      setImagePreviews([]);

    } catch (err) {
      console.error('Error submitting product:', err);
      setErrorMessage(`Failed to add product: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow border border-gray-100 space-y-4">
        
        {/* Product Name & Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
            <input type="text" id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 shadow-sm" />
          </div>
          <div>
            <label htmlFor="productCode" className="block text-sm font-medium text-gray-700 mb-1">Product Code (Optional)</label>
            <input type="text" id="productCode" value={productCode} onChange={(e) => setProductCode(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 shadow-sm" />
          </div>
        </div>

        {/* Price & Stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="retailPrice" className="block text-sm font-medium text-gray-700 mb-1">Retail Price (Rs.) *</label>
            <input type="number" id="retailPrice" value={retailPrice} onChange={(e) => setRetailPrice(e.target.value)} required min="0" step="0.01" className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 shadow-sm" />
          </div>
          <div>
            {/* --- ⚠️ මෙන්න මෙතනයි කලින් වැරදිලා තිබුණේ ⚠️ --- */}
            <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
            <input type="number" id="stockQuantity" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} required min="0" step="1" className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 shadow-sm" />
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 shadow-sm"></textarea>
        </div>

        {/* Image Uploader */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Images *</label>
          <label htmlFor="fileUpload" className="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-pink-400 focus:outline-none">
            <span className="flex items-center space-x-2">
              <FaUpload className="text-gray-500" />
              <span className="font-medium text-gray-600">
                Click to upload images
                <span className="text-xs text-gray-500 block"> (You can select multiple)</span>
              </span>
            </span>
            <input id="fileUpload" type="file" multiple accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} className="hidden" />
          </label>
        </div>

        {/* Image Previews */}
        {imagePreviews.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {imagePreviews.map((previewUrl, index) => (
              <div key={index} className="relative w-24 h-24 rounded-md overflow-hidden border">
                <Image src={previewUrl} alt={`Preview ${index + 1}`} layout="fill" objectFit="cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full p-0.5 opacity-80 hover:opacity-100"
                >
                  <FaTrashAlt className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Error/Success Messages */}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm" role="alert">
            <FaExclamationTriangle className="inline mr-2" />
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-sm" role="alert">
            <FaCheckCircle className="inline mr-2" />
            {successMessage}
          </div>
        )}

        {/* Submit Button */}
        <button 
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white transition-colors ${
            isSubmitting 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500'
          }`}
        >
          {isSubmitting ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <FaPlus className="mr-2" />
          )}
          {isSubmitting ? 'Adding Product...' : 'Add Product'}
        </button>

      </form>
    </div>
  );
};


// --- Me Aluth Page eke Main Component eka ---
export default function AddProductPage() {
  return (
    <div>
      {/* Page Title & Back Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Add New Product</h1>
        <Link 
          href="/kittoadmin2006"
          className="flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-sm hover:bg-gray-300 transition-colors text-sm"
        >
          <FaArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      {/* Form eka me page ekata render karanawa */}
      <AddProductForm />
      
    </div>
  );
}

