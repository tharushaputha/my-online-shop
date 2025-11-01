'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { FaSearch, FaSpinner, FaExclamationTriangle, FaBoxOpen } from 'react-icons/fa';
import Image from 'next/image';

// --- Product Card Component (ලස්සන Animate වෙන Style එකට) ---
// meken thamai product eka eka card eka hadanne
const ProductCard = ({ product }) => {
  // Check karanne stock eke thiyenawada kiyala
  const isAvailable = product && typeof product.stock_quantity === 'number' && product.stock_quantity > 0;
  
  // Oya kamathi gradient eka
  const gradient = 'from-pink-100 via-white to-green-100'; 
  
  return (
    // Card eka click kalama details page ekata yana Link eka
    <Link href={`/kitto-drop/view-products/${product.id}`} legacyBehavior>
      <a
        className={`
          p-4 rounded-xl shadow-lg flex items-center space-x-4
          bg-gradient-to-br ${gradient} animate-gradient
          transition-transform duration-200 ease-in-out
          transform hover:scale-[1.03] active:scale-[0.98]
          cursor-pointer group border border-transparent hover:border-pink-200
          relative overflow-hidden
        `}
      >
        {/* Stock Status Badge */}
        <span
          className={`absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full text-white z-10 ${
            isAvailable ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {isAvailable ? `In Stock (${product.stock_quantity})` : 'Out of Stock'}
        </span>

        {/* Image Eka */}
        <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 relative rounded-md overflow-hidden bg-gray-100">
          <Image
            // Aluth 'image_urls' array eken palaweni eka gannawa
            src={product.image_urls?.[0] || '/kitto-logo.png'} 
            alt={product.product_name || 'Product Image'}
            layout="fill"
            objectFit="cover"
            className="group-hover:scale-105 transition-transform duration-300"
            // Image eka load karanna bari unoth, logo eka pennanawa
            onError={(e) => { e.currentTarget.src = '/kitto-logo.png'; }} 
          />
        </div>
        
        {/* Details (Name, Price) */}
        <div className="flex-grow min-w-0"> 
          {/* Aluth 'product_code' eka */}
          <p className="text-xs text-gray-500 mb-1 truncate">{product.product_code || 'N/A'}</p>
          {/* Aluth 'product_name' eka */}
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate group-hover:text-primary transition-colors">
            {product.product_name || 'Untitled Product'}
          </h3>
          {/* Aluth 'retail_price' eka */}
          <p className="text-lg font-bold text-primary mt-1">
            Rs. {product.retail_price ? product.retail_price.toLocaleString() : 'N/A'}
          </p>
        </div>
      </a>
    </Link>
  );
};


// --- Main Page Component ---
export default function ViewProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Page eka load weddi, user check karala products load karanawa
  useEffect(() => {
    // User login nattam, login page ekata yawanawa
    const storedUser = localStorage.getItem('kittoDropUser');
    if (!storedUser || storedUser === 'undefined' || storedUser === 'null') {
      router.push('/kitto-drop/login');
      return;
    }

    // Products fetch karana function eka
    const fetchProducts = async () => {
      setIsLoading(true);
      setError('');
      try {
        // ****** Meka Thamai Hari Query Eka ******
        const { data, error: fetchError } = await supabase
          .from('kitto_drop_products') // <-- Aluth table eka
          // Card ekata ona details witharak select karanawa
          .select('id, product_name, retail_price, image_urls, product_code, stock_quantity')
          .eq('is_active', true) // Active products witharak
          .order('created_at', { ascending: false }); // Aluthma ewa udin

        if (fetchError) throw fetchError;
        setProducts(data || []);
      } catch (err) {
        console.error("Error fetching Kitto Drop products:", err);
        setError(`Failed to load products: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [router]);

  // Search bar eke type karama filter wena logic eka
  const filteredProducts = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    if (!lowerSearch) return products; 

    // Name eken hari Code eken hari search karanawa
    return products.filter(p =>
      (p.product_name && p.product_name.toLowerCase().includes(lowerSearch)) ||
      (p.product_code && p.product_code.toLowerCase().includes(lowerSearch))
    );
  }, [searchTerm, products]);

  // --- HTML Pata ---
  return (
    <>
      <Header />
      <main className="bg-white min-h-[calc(100vh-150px)] py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-6 text-center">
            Kitto Drop Products
          </h1>

          {/* Search Bar */}
          <div className="mb-6 relative w-full max-w-lg mx-auto">
            <input
              type="text"
              placeholder="Search by Product Name or Code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Loading... kiyala pennanawa */}
          {isLoading && (
            <div className="flex justify-center items-center py-10">
              <FaSpinner className="animate-spin text-primary text-4xl" />
              <p className="ml-3 text-gray-600">Loading products...</p>
            </div>
          )}

          {/* Aulak unoth (Error) pennanawa */}
          {error && (
            <div className="text-center py-10 text-red-600">
              <FaExclamationTriangle className="text-3xl mb-2 mx-auto"/>
              <p>{error}</p>
            </div>
          )}

          {/* Products okkoma pennanawa */}
          {!isLoading && !error && (
            <>
              {filteredProducts.length > 0 ? (
                // Products Grid eka
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                // Products nattam meka pennanawa
                <div className="text-center py-10 text-gray-500">
                  <FaBoxOpen className="text-4xl mb-3 mx-auto"/>
                  <p className="text-lg">
                    {searchTerm ? 'No products found matching your search.' : 'No products available yet.'}
                  </p>
                  <p className="text-sm mt-2">Admin panel eken aluth products add karanna.</p>
                </div>
              )}
            </>
          )}
          
          <Link href="/kitto-drop" className="block mt-8 text-center text-primary hover:underline text-sm">
            ← Back to Kitto Drop
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

