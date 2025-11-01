'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { FaSearch, FaSpinner, FaExclamationTriangle, FaBoxOpen } from 'react-icons/fa';
import Image from 'next/image';

// --- 🚀 Product Card Component (Link eka FIX karapu aluth widiya) ---
const ProductCard = ({ product }) => {
  const isAvailable = product.stock_quantity > 0;
  // Gradient eka oyage anith buttons wagema
  const gradient = 'from-pink-100 via-white to-green-100'; 
  
  return (
    // --- ⚠️ FIX EKA MEHEMAI ---
    // Link eken 'legacyBehavior' ain karala, athule thibba <a> tag eka ain kara.
    // ClassName okkoma Link ekatama dunna.
    <Link 
      href={`/kitto-drop/view-products/${product.id}`}
      className={`
        p-4 rounded-xl shadow-lg flex items-center space-x-4
        bg-gradient-to-br ${gradient} animate-gradient
        transition-transform duration-200 ease-in-out
        transform hover:scale-[1.03] active:scale-[0.98]
        cursor-pointer group border border-transparent hover:border-primary
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

      {/* Image */}
      <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 relative rounded-md overflow-hidden">
        <Image
          src={product.image_urls?.[0] || '/kitto-logo.png'} // Placeholder ekata oyage logo eka
          alt={product.product_name}
          layout="fill"
          objectFit="cover"
          className="group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      {/* Details */}
      <div className="flex-grow min-w-0"> {/* min-w-0 dala text truncate hariyatama kala */}
        <p className="text-xs text-gray-500 mb-1 truncate">{product.product_code || 'N/A'}</p>
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate group-hover:text-pink-600 transition-colors">
          {product.product_name}
        </h3>
        <p className="text-lg font-bold text-primary mt-1">
          Rs. {product.retail_price ? product.retail_price.toLocaleString() : 'N/A'}
        </p>
      </div>
    </Link>
  );
};


// --- Main Page (Kisima wenasak naha) ---
export default function ViewProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Verify User & Fetch Products
  useEffect(() => {
    // Check user login
    const storedUser = localStorage.getItem('kittoDropUser');
    if (!storedUser || storedUser === 'undefined' || storedUser === 'null') {
      router.push('/kitto-drop/login');
      return;
    }

    const fetchProducts = async () => {
      setIsLoading(true);
      setError('');
      try {
        // 'kitto_drop_products' table eken fetch karanawa
        const { data, error: fetchError } = await supabase
          .from('kitto_drop_products') // <-- Aluth table eka
          .select('id, product_name, retail_price, image_urls, product_code, stock_quantity')
          .eq('is_active', true) // Active products vitharak
          .order('created_at', { ascending: false });

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

  // Filter products based on search term
  const filteredProducts = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    if (!lowerSearch) return products; // No search, return all

    return products.filter(p =>
      p.product_name.toLowerCase().includes(lowerSearch) ||
      (p.product_code && p.product_code.toLowerCase().includes(lowerSearch))
    );
  }, [searchTerm, products]);

  return (
    <>
      <Header />
      <main className="bg-white min-h-[calc(100vh-150px)] py-10 px-4">
        <div className="max-w-6xl mx-auto"> {/* Wider container for products */}
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
              className="w-full p-3 pl-10 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-10">
              <FaSpinner className="animate-spin text-primary text-4xl" />
              <p className="ml-3 text-gray-600">Loading products...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-10 text-red-600">
              <FaExclamationTriangle className="text-3xl mb-2 mx-auto"/>
              <p>{error}</p>
            </div>
          )}

          {/* Content State */}
          {!isLoading && !error && (
            <>
              {filteredProducts.length > 0 ? (
                // Products Grid (Mobile: 1 col, Desktop: 3 cols)
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                // No Products Found
                <div className="text-center py-10 text-gray-500">
                  <FaBoxOpen className="text-4xl mb-3 mx-auto"/>
                  <p className="text-lg">
                    {searchTerm ? 'No products found matching your search.' : 'No products available yet.'}
                  </p>
                  <p className="text-sm mt-1">
                    {searchTerm ? '' : 'Admin panel eken aluth products add karanna.'}
                  </p>
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

