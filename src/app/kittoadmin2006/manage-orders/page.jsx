// file: app/kittoadmin2006/manage-orders/page.jsx
'use client';

// ******** IMPORT FIX: 'useCallback' මෙතනට add කළා ********
import React, { useState, useEffect, useCallback } from 'react';
// **********************************************************

import { supabase } from '@/lib/supabaseClient';
import { FaSpinner, FaShoppingCart, FaDollarSign, FaExclamationTriangle, FaBoxOpen, FaCheckCircle, FaTruck, FaTimesCircle } from 'react-icons/fa';

// Status Badge Component (No change)
const StatusBadge = ({ status }) => {
  let colorClasses = 'bg-gray-100 text-gray-800';
  let icon = <FaBoxOpen />;
  switch (status) {
    case 'Pending': colorClasses = 'bg-yellow-100 text-yellow-800'; icon = <FaSpinner className="animate-spin" />; break;
    case 'Processing': colorClasses = 'bg-blue-100 text-blue-800'; icon = <FaSpinner className="animate-spin" />; break;
    case 'Shipped': colorClasses = 'bg-blue-100 text-blue-800'; icon = <FaTruck />; break;
    case 'Delivered': colorClasses = 'bg-green-100 text-green-800'; icon = <FaCheckCircle />; break;
    case 'Cancelled': colorClasses = 'bg-red-100 text-red-800'; icon = <FaTimesCircle />; break;
  }
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${colorClasses}`}>
      {icon}
      <span className="ml-1.5">{status}</span>
    </span>
  );
};

// Order Card (Admin) (No change)
const AdminOrderCard = ({ order, onStatusChange }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    await onStatusChange(order.id, newStatus);
    setIsUpdating(false);
  };

  return (
    <div className="bg-white p-4 sm:p-5 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
        {/* Left Side: Details */}
        <div className="flex-grow">
          <p className="text-sm text-gray-500">Order ID: <span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">{order.id.substring(0, 8)}...</span></p>
          <p className="font-semibold text-lg text-gray-800 mt-1">{order.customer_name}</p>
          <p className="text-sm text-gray-600">{order.customer_address}, {order.customer_city}, {order.customer_district}</p>
          <p className="text-sm text-gray-500">Date: {new Date(order.created_at).toLocaleString()}</p>
          {/* Check if kitto_drop_accounts exists before accessing shop_name */}
          <p className="text-sm text-gray-500">Shop: <span className="font-medium text-gray-700">{order.kitto_drop_accounts?.shop_name || 'N/A'}</span></p>

          {/* Items */}
          <div className="mt-3 space-y-1 border-t pt-2">
            {/* Check if kitto_drop_order_items exists and is an array */}
            {Array.isArray(order.kitto_drop_order_items) && order.kitto_drop_order_items.map((item, index) => (
              <div key={index} className="text-sm text-gray-700">
                <span>{item.quantity} x {item.product_name}</span>
                <span className="float-right font-medium">Rs. {(item.sale_amount * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="text-sm text-gray-500">
              Delivery Fee(s)
              <span className="float-right font-medium">Rs. {(Array.isArray(order.kitto_drop_order_items) ? order.kitto_drop_order_items.length * 400 : 0).toFixed(2)}</span>
            </div>
            <div className="text-sm font-bold text-gray-800 border-t pt-1 mt-1">
              Total Payable
              <span className="float-right text-pink-600">Rs. {order.total_order_amount.toFixed(2)}</span>
            </div>
             <div className="text-sm font-medium text-green-600">
              Total Profit
              <span className="float-right">Rs. {order.total_profit.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        {/* Right Side: Status & Amount */}
        <div className="flex sm:flex-col items-end sm:items-end justify-between w-full sm:w-auto flex-shrink-0 mt-2 sm:mt-0 sm:min-w-[150px]">
          <div className="sm:mb-4">
             <StatusBadge status={order.order_status} />
          </div>
         
          {/* Status Change Dropdown */}
          <div className="relative">
            <select
              value={order.order_status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={isUpdating}
              className="w-full sm:w-auto p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 shadow-sm bg-white appearance-none text-sm"
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            {isUpdating && <FaSpinner className="animate-spin absolute right-2 top-2.5 text-gray-400" />}
          </div>
        </div>
      </div>
    </div>
  );
};


// Main Page
export default function ManageOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('Pending'); // Default filter

  // --- Fetch ALL Orders (useCallback is now imported) ---
  const fetchAllOrders = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      let query = supabase
        .from('kitto_drop_orders')
        .select(`
          *,
          kitto_drop_accounts ( shop_name ),
          kitto_drop_order_items ( * )
        `)
        .order('created_at', { ascending: false });

      if (filterStatus !== 'All') {
        query = query.eq('order_status', filterStatus);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }
      
      console.log("Fetched Orders:", data);
      setOrders(data || []);

    } catch (err) {
      console.error("Error fetching all orders:", err);
      setError(`Failed to load orders: ${err.message}. (Check RLS/Permissions)`);
    } finally {
      setIsLoading(false);
    }
  }, [filterStatus]); // Re-fetch when filterStatus changes

  // Initial fetch
  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  // --- Handle Status Change ---
  const handleStatusChange = async (orderId, newStatus) => {
    try {
        const { error: updateError } = await supabase
            .from('kitto_drop_orders')
            .update({ order_status: newStatus })
            .eq('id', orderId);

        if (updateError) throw updateError;

        // Refresh list
        fetchAllOrders();

    } catch (err) {
        console.error("Error updating status:", err);
        setError(`Failed to update status: ${err.message}`);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Kitto Drop Orders</h1>

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b mb-4 overflow-x-auto"> {/* Added overflow-x-auto for mobile */}
        {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'All'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`py-2 px-4 text-sm font-medium whitespace-nowrap ${ // Added whitespace-nowrap
              filterStatus === status
                ? 'border-b-2 border-pink-600 text-pink-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <FaSpinner className="animate-spin text-pink-600 text-4xl" />
          <p className="ml-3 text-gray-600">Loading orders...</p>
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
        <div className="space-y-4">
          {orders.length > 0 ? (
            // Order List
            orders.map(order => (
              <AdminOrderCard key={order.id} order={order} onStatusChange={handleStatusChange} />
            ))
          ) : (
            // No Orders Found
            <div className="text-center py-10 text-gray-500">
              <FaBoxOpen className="text-4xl mb-3 mx-auto"/>
              <p className="text-lg">No orders found with status "{filterStatus}".</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}