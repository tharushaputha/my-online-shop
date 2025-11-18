'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  FaSpinner, FaExclamationTriangle, FaBoxOpen, FaArrowLeft, 
  FaDownload, FaCopy, FaCheckCircle, FaTag, FaLayerGroup
} from 'react-icons/fa';
import Image from 'next/image';

// --- Image Gallery Component ---
const ProductImageGallery = ({ images, productName }) => {
  const [mainImage, setMainImage] = useState(images?.[0] || '/kitto-logo.png');

  return (
    <div className="space-y-4">
      {/* Main Large Image */}
      <div className="relative w-full h-80 md:h-96 bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
        <Image
          src={mainImage}
          alt={productName}
          layout="fill"
          objectFit="contain"
          className="transition-transform duration-300 hover:scale-105"
          onError={(e) => { e.currentTarget.src = '/kitto-logo.png'; }}
        />
      </div>

      {/* Thumbnails */}
      {images && images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setMainImage(img)}
              className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                mainImage === img ? 'border-primary ring-2 ring-pink-200' : 'border-gray-200 hover:border-pink-300'
              }`}
            >
              <Image 
                src={img} 
                alt={`Thumb ${idx}`} 
                layout="fill" 
                objectFit="cover" 
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Main Detail Page Component ---
export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params; // URL eken ID eka gannawa

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // --- 1. Verify User & Fetch Product Data ---
  useEffect(() => {
    const storedUser = localStorage.getItem('kittoDropUser');
    if (!storedUser) {
      router.push('/kitto-drop/login');
      return;
    }

    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const { data, error: fetchError } = await supabase
          .from('kitto_drop_products')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Product not found or removed.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProductDetails();
  }, [id, router]);

  // --- Helper: Copy Description ---
  const handleCopyDescription = () => {
    if (!product) return;
    const textToCopy = `
${product.product_name}
Price: Rs. ${product.retail_price}
Code: ${product.product_code || '-'}

${product.description || ''}
    `.trim();

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- Helper: Download Image ---
  const handleDownloadImage = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename || 'kitto-product.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed", err);
      alert("Failed to download image. Please try long-pressing to save.");
    }
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <FaSpinner className="animate-spin text-primary text-4xl mb-4" />
        <p className="text-gray-500">Loading details...</p>
      </div>
    );
  }

  // --- Error State ---
  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <FaExclamationTriangle className="text-red-500 text-5xl mb-4" />
        <h1 className="text-xl font-bold text-gray-800 mb-2">Oops!</h1>
        <p className="text-gray-600 mb-6">{error}</p>
        <button onClick={() => router.back()} className="px-6 py-2 bg-gray-200 rounded-full font-bold hover:bg-gray-300">
          Go Back
        </button>
      </div>
    );
  }

  // --- Success State ---
  const isAvailable = product.stock_quantity > 0;

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen py-8 px-4">
        <div className="max-w-5xl mx-auto">
          
          {/* Back Button */}
          <button 
            onClick={() => router.back()} 
            className="flex items-center text-gray-600 hover:text-primary font-bold mb-6 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Back to Catalog
          </button>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              
              {/* Left: Image Gallery */}
              <div className="p-6 md:p-8 bg-gray-50/50">
                <ProductImageGallery 
                  images={product.image_urls} 
                  productName={product.product_name} 
                />
                
                {/* Quick Actions for Images */}
                <div className="mt-6 grid grid-cols-1 gap-3">
                  <button 
                    onClick={() => handleDownloadImage(product.image_urls?.[0], `${product.product_name}.jpg`)}
                    className="w-full py-3 rounded-xl border-2 border-dashed border-pink-200 text-primary font-bold hover:bg-pink-50 hover:border-pink-400 transition-all flex items-center justify-center gap-2"
                  >
                    <FaDownload /> Download Main Image
                  </button>
                </div>
              </div>

              {/* Right: Product Details */}
              <div className="p-6 md:p-10 flex flex-col">
                
                {/* Product Badges */}
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`}>
                    {isAvailable ? 'In Stock' : 'Out of Stock'}
                  </span>
                  {product.product_code && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 uppercase">
                      SKU: {product.product_code}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2 leading-tight">
                  {product.product_name}
                </h1>

                {/* Price */}
                <div className="mb-8">
                  <span className="text-3xl font-bold text-primary">
                    Rs. {product.retail_price?.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-400 ml-2 font-medium">Retail Price</span>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <FaLayerGroup className="text-blue-500 mb-2 text-xl" />
                    <p className="text-xs text-blue-400 font-bold uppercase">Stock Available</p>
                    <p className="text-xl font-bold text-blue-700">{product.stock_quantity} Items</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                    <FaTag className="text-purple-500 mb-2 text-xl" />
                    <p className="text-xs text-purple-400 font-bold uppercase">Category</p>
                    <p className="text-lg font-bold text-purple-700">General</p>
                  </div>
                </div>

                {/* Description Section */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-bold text-gray-800">Product Description</h3>
                    <button 
                      onClick={handleCopyDescription}
                      className="text-sm flex items-center gap-1 text-gray-500 hover:text-primary font-medium transition-colors"
                    >
                      {copied ? <FaCheckCircle className="text-green-500" /> : <FaCopy />}
                      {copied ? 'Copied!' : 'Copy Details'}
                    </button>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 text-gray-700 leading-relaxed whitespace-pre-line text-sm md:text-base h-64 overflow-y-auto custom-scrollbar">
                    {product.description || "No detailed description available for this product."}
                  </div>
                </div>

                {/* Place Order Button */}
                <div className="mt-auto">
                  <button 
                    onClick={() => router.push('/kitto-drop/new-order')}
                    disabled={!isAvailable}
                    className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all transform hover:-translate-y-1 ${
                      isAvailable 
                        ? 'bg-gradient-to-r from-primary to-purple-400 hover:shadow-pink-500/30' 
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isAvailable ? 'Place Order Now' : 'Currently Unavailable'}
                  </button>
                  {isAvailable && (
                    <p className="text-center text-xs text-gray-400 mt-3">
                      Click to go to the order form and add this item.
                    </p>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}