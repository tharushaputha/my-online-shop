// app/kitto-drop/my-orders/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { FaSpinner, FaExclamationTriangle, FaBoxOpen, FaCheckCircle, FaTruck, FaTimesCircle } from 'react-icons/fa';

// Helper function to get status visuals (No change)
const getStatusVisuals = (status) => {
  switch (status) {
    case 'Pending': return { icon: <FaSpinner className="animate-spin" />, color: 'bg-yellow-100 text-yellow-800', text: 'Pending' };
    case 'Processing': return { icon: <FaTruck />, color: 'bg-blue-100 text-blue-800', text: 'Processing' };
    case 'Shipped': return { icon: <FaTruck />, color: 'bg-blue-100 text-blue-800', text: 'Shipped' };
    case 'Delivered': return { icon: <FaCheckCircle />, color: 'bg-green-100 text-green-800', text: 'Delivered' };
    case 'Cancelled': return { icon: <FaTimesCircle />, color: 'bg-red-100 text-red-800', text: 'Cancelled' };
    default: return { icon: <FaBoxOpen />, color: 'bg-gray-100 text-gray-800', text: status };
  }
};

// Helper component to display product names
const OrderItemPreview = ({ items }) => {
  if (!items || items.length === 0) {
    return <p className="text-sm text-gray-500 italic">No items found for this order.</p>;
  }
  
  // Get the first item's name
  const firstItemName = items[0].product_name;
  
  // Check if there are more items
  const moreItemsCount = items.length - 1;

  return (
    <p className="text-sm text-gray-700 font-medium truncate">
      {items[0].quantity} x {firstItemName}
      {moreItemsCount > 0 && (
        <span className="text-xs text-gray-500 font-normal ml-1">(+ {moreItemsCount} more item{moreItemsCount > 1 ? 's' : ''})</span>
      )}
    </p>
  );
};


export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [kittoDropAccountId, setKittoDropAccountId] = useState(null);

  // --- Verify User & Fetch Orders ---
  useEffect(() => {
    let accountId = null;
    try { // ... (User verification logic - no change) ...
      const storedUser = localStorage.getItem('kittoDropUser');
      if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
        const userData = JSON.parse(storedUser); if (userData && userData.id) { accountId = userData.id; setKittoDropAccountId(accountId); }
        else { throw new Error("Invalid user data."); }
      } else { throw new Error("No user data."); }
    } catch (e) {
      console.error("User validation error:", e); router.push('/kitto-drop/login'); return;
    }

    // --- Fetch Orders for this Account ---
    const fetchOrders = async () => {
      if (!accountId) return;
      setIsLoading(true); setError('');
      try {
        // ****** QUERY UPDATED HERE ******
        // Fetch orders AND their related items (product_name, quantity)
        const { data, error: fetchError } = await supabase
          .from('kitto_drop_orders')
          .select(`
            *,
            kitto_drop_order_items (
              product_name,
              quantity
            )
          `)
          .eq('kitto_drop_account_id', accountId) // Filter by user
          .order('created_at', { ascending: false }); // Newest first
        // ********************************

        if (fetchError) {
          throw fetchError;
        }
        
        console.log("Fetched Orders:", data); // Check console to see fetched data
        setOrders(data || []);

      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(`Failed to load orders: ${err.message || 'Please try again.'}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [router]); // Run once on mount (and if router changes)

  return (
    <>
      <Header />
      <main className="bg-white min-h-[calc(100vh-150px)] py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-pink-600 mb-8 text-center">
            My Kitto Drop Orders
          </h1>

          {/* Loading State */}
          {isLoading && ( /* ... (Loading spinner - no change) ... */
            <div className="flex justify-center items-center py-10"> <FaSpinner className="animate-spin text-pink-600 text-4xl" /> <p className="ml-3 text-gray-600">Loading your orders...</p> </div>
          )}

          {/* Error State */}
          {error && ( /* ... (Error display - no change) ... */
            <div className="text-center py-10 text-red-600"> <FaExclamationTriangle className="text-3xl mb-2 mx-auto"/> <p>{error}</p> <Link href="/kitto-drop" className="mt-4 text-pink-600 hover:underline text-sm block">Go Back</Link> </div>
          )}

          {/* Content State */}
          {!isLoading && !error && (
            <div className="space-y-4">
              {orders.length > 0 ? (
                // Order List
                orders.map(order => {
                  const statusInfo = getStatusVisuals(order.order_status);
                  return (
                    // Order Card
                    <div key={order.id} className="bg-gray-50 p-4 sm:p-5 rounded-lg border border-gray-200 shadow-sm transition-shadow hover:shadow-md">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                        {/* Left Side: Details */}
                        <div className="flex-grow"> {/* Take available space */}
                          <p className="font-semibold text-lg text-gray-800">{order.customer_name}</p>
                          
                          {/* ****** NEW: Product Preview ****** */}
                          <div className="mt-2 mb-1">
                            <OrderItemPreview items={order.kitto_drop_order_items} />
                          </div>
                          {/* ********************************** */}
                          
                          <p className="text-sm text-gray-500">
                            Order Date: {new Date(order.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            City: {order.customer_city}, {order.customer_district}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Order ID: <span className="font-mono text-xs bg-gray-200 px-1 py-0.5 rounded">{order.id.substring(0, 8)}...</span>
                          </p>
                        </div>
                        
                        {/* Right Side: Status & Amount */}
                        <div className="flex sm:flex-col items-end sm:items-end justify-between w-full sm:w-auto flex-shrink-0 mt-2 sm:mt-0"> {/* Ensure it doesn't shrink */}
                          <p className="font-bold text-lg sm:text-xl text-pink-600 mb-0 sm:mb-2">
                            Rs. {order.total_order_amount.toFixed(2)}
                          </p>
                          {/* Status Badge */}
                          <div className={`flex items-center text-xs sm:text-sm font-medium px-2.5 py-1 rounded-full ${statusInfo.color}`}>
                            <span className="mr-1.5">{statusInfo.icon}</span>
                            {statusInfo.text}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                // No Orders Found (No change)
                <div className="text-center py-10 text-gray-500"> <FaBoxOpen className="text-4xl mb-3 mx-auto"/> <p className="text-lg">You haven't placed any orders yet.</p> <Link href="/kitto-drop/new-order" className="mt-4 inline-block bg-pink-600 text-white font-bold py-2 px-6 rounded-full hover:bg-pink-700 transition-colors"> Place Your First Order </Link> </div>
              )}
            </div>
          )}

          <Link href="/kitto-drop/my-account" className="block mt-8 text-center text-pink-600 hover:underline text-sm">
            ← Back to My Account
          </Link>
        </div>
      </main>
      <Footer />

      {/* Helper CSS (No change) */}
      <style jsx global>{` .modal-list-scroll::-webkit-scrollbar { width: 6px; } .modal-list-scroll::-webkit-scrollbar-track { background: #f1f1f1; } .modal-list-scroll::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px;} .modal-list-scroll::-webkit-scrollbar-thumb:hover { background: #9ca3af; } `}</style>
    </>
  );
}