'use client'; 

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link'; // <-- Link component එක Add කළා
import { 
  FaSpinner, 
  FaShoppingCart, 
  FaDollarSign, 
  FaExclamationTriangle,
  FaPlus // <-- "Add Product" button එකට ඕන
} from 'react-icons/fa';

// --- Stat Card Component (මේක ඔයාගේ, කිසිම වෙනසක් කරලා නෑ) ---
const StatCard = ({ title, value, icon, loading, colorClass = 'text-blue-500' }) => (
  <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
        {loading ? (
          <FaSpinner className="animate-spin text-gray-400 mt-2" />
        ) : (
          <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
        )}
      </div>
      <div className={`p-3 rounded-full ${colorClass} bg-opacity-10`}>
        {React.createElement(icon, { className: `w-6 h-6 ${colorClass}` })}
      </div>
    </div>
  </div>
);

// --- 🚀 "Add Product" Form eka meken ain kara ---
// (Api eka wenama file ekakata danawa)


// --- ඔයාගේ Main Dashboard Page Component එක (මම Link එකක් add කළා) ---
export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    pendingOrders: 0,
    pendingWithdrawals: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // ඔයාගේ Stats fetch karana logic eka (වෙනසක් නෑ)
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError('');
      try {
        const { count: orderCount, error: orderError } = await supabase
          .from('kitto_drop_orders')
          .select('*', { count: 'exact', head: true })
          .eq('order_status', 'Pending');
        if (orderError) throw orderError;

        const { count: withdrawalCount, error: withdrawalError } = await supabase
          .from('kitto_drop_withdrawals')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'Pending');
        if (withdrawalError) throw withdrawalError;

        setStats({
          pendingOrders: orderCount || 0,
          pendingWithdrawals: withdrawalCount || 0,
        });

      } catch (err) {
        console.error("Error fetching admin stats:", err);
        setError(`Failed to load stats: ${err.message}. (Check if RLS is disabled for all tables)`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        {/* --- 🚀 මෙන්න අලුතෙන් එකතු කරපු "Add Product" Link/Button එක --- */}
        <Link 
          href="/kittoadmin2006/add-product"
          className="flex items-center justify-center px-4 py-2 bg-pink-600 text-white font-semibold rounded-lg shadow hover:bg-pink-700 transition-colors"
        >
          <FaPlus className="mr-2 h-4 w-4" />
          Add New Product
        </Link>
      </div>


      {/* Error Message (වෙනසක් නෑ) */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <FaExclamationTriangle className="inline mr-2" />
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Stats Grid (වෙනසක් නෑ) */}
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Live Stats</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={FaShoppingCart}
          loading={isLoading}
          colorClass="text-yellow-500" 
        />
        <StatCard
          title="Pending Withdrawals"
          value={stats.pendingWithdrawals}
          icon={FaDollarSign}
          loading={isLoading}
          colorClass="text-pink-600"
        />
      </div>

      {/* --- 🚀 "AddProductForm" component call eka meken ain kara --- */}
      
      {/* ඔයාට තව admin sections තියෙනවනම්, link ටික මෙතන දාන්න පුළුවන් */}
      <div className="mt-12 border-t pt-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Admin Sections</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/kittoadmin2006/add-product" className="p-4 bg-white rounded-xl shadow border border-gray-100 text-center font-medium text-gray-700 hover:bg-gray-50">Manage Products</Link>
          <Link href="#" className="p-4 bg-gray-200 cursor-not-allowed rounded-xl shadow-sm border border-gray-100 text-center font-medium text-gray-500">Manage Orders</Link>
          <Link href="#" className="p-4 bg-gray-200 cursor-not-allowed rounded-xl shadow-sm border border-gray-100 text-center font-medium text-gray-500">Manage Users</Link>
          <Link href="#" className="p-4 bg-gray-200 cursor-not-allowed rounded-xl shadow-sm border border-gray-100 text-center font-medium text-gray-500">Manage Withdrawals</Link>
          {/* Add more links as you build those pages */}
        </div>
      </div>

    </div>
  );
}

