// file: app/kittoadmin2006/page.jsx
'use client'; // Data fetch කරන්න state ඕන නිසා

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient'; // Supabase import (path eka hariida balanna)
import { FaSpinner, FaShoppingCart, FaDollarSign, FaExclamationTriangle } from 'react-icons/fa';

// Stat Card Component
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

// Main Dashboard Page
export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    pendingOrders: 0,
    pendingWithdrawals: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch stats from Supabase
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError('');
      try {
        // 1. Fetch Pending Orders Count
        // (අපි RLS disable කරපු නිසා මේක වැඩ කරන්න ඕන)
        const { count: orderCount, error: orderError } = await supabase
          .from('kitto_drop_orders')
          .select('*', { count: 'exact', head: true })
          .eq('order_status', 'Pending');

        if (orderError) throw orderError;

        // 2. Fetch Pending Withdrawals Count
        // (මේ table එකටත් RLS disable දාලා බලමු)
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <FaExclamationTriangle className="inline mr-2" />
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={FaShoppingCart}
          loading={isLoading}
          colorClass="text-yellow-500" // Yellow for pending
        />
        <StatCard
          title="Pending Withdrawals"
          value={stats.pendingWithdrawals}
          icon={FaDollarSign}
          loading={isLoading}
          colorClass="text-pink-600" // Pink for money
        />
        {/* Add more StatCards here as needed */}
      </div>
    </div>
  );
}