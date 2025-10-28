// file: app/kittoadmin2006/users/page.jsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { FaSpinner, FaExclamationTriangle, FaUsers, FaSearch, FaUserCircle, FaStore, FaPhoneAlt, FaMapMarkerAlt, FaTrashAlt } from 'react-icons/fa'; // Added FaTrashAlt

// User Card Component (Delete Button Added)
const UserCard = ({ account, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    // Confirm first
    if (!window.confirm(`Are you sure you want to delete the shop "${account.shop_name}"? This will delete ALL their orders and bank details.`)) {
      return;
    }
    setIsDeleting(true);
    // Call the delete function passed from the parent page
    await onDelete(account.id);
    // No need to set isDeleting false, as the component will be removed from list
  };

  return (
    <div className="bg-white p-4 sm:p-5 rounded-lg border border-gray-200 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <FaUserCircle className="w-10 h-10 text-gray-300" />
        </div>
        
        {/* Details */}
        <div className="flex-grow">
          <p className="font-semibold text-lg text-pink-600">{account.shop_name}</p>
          <p className="text-sm font-medium text-gray-700">{account.full_name}</p>
          <p className="text-sm text-gray-500 mt-2 flex items-center gap-1.5">
            <FaPhoneAlt className="w-3 h-3 flex-shrink-0"/> {account.mobile_number}
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1.5">
            <FaMapMarkerAlt className="w-3 h-3 flex-shrink-0"/> {account.city}
          </p>
           <p className="text-xs text-gray-400 mt-2">
            Joined: {new Date(account.created_at).toLocaleDateString()}
           </p>
        </div>
        
        {/* Platforms & Delete Button */}
        <div className="flex flex-col items-start sm:items-end gap-2">
            {/* Platforms */}
            {account.selling_platforms && account.selling_platforms.length > 0 && (
              <div className="flex sm:flex-col gap-2 pt-2 sm:pt-0">
                {account.selling_platforms.map(platform => (
                  <span key={platform} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">{platform}</span>
                ))}
              </div>
            )}
            {/* Delete Button */}
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="mt-2 flex items-center justify-center text-xs text-red-500 hover:text-red-700 font-medium p-2 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {isDeleting ? (
                <FaSpinner className="animate-spin mr-1.5" />
              ) : (
                <FaTrashAlt className="mr-1.5" />
              )}
              {isDeleting ? 'Deleting...' : 'Delete User'}
            </button>
        </div>

      </div>
    </div>
  );
};


// Main Page
export default function ManageUsersPage() {
  const [accounts, setAccounts] = useState([]); // Main list
  const [filteredAccounts, setFilteredAccounts] = useState([]); // List to display
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // --- Fetch ALL Kitto Drop Accounts ---
  const fetchAllAccounts = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const { data, error: fetchError } = await supabase
        .from('kitto_drop_accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      setAccounts(data || []);
      setFilteredAccounts(data || []);

    } catch (err) {
      console.error("Error fetching accounts:", err);
      setError(`Failed to load accounts: ${err.message}.`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchAllAccounts();
  }, [fetchAllAccounts]);

  // --- Search/Filter Logic ---
  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    if (lowerSearchTerm === '') {
      setFilteredAccounts(accounts); // No search, show all
    } else {
      const filtered = accounts.filter(acc => 
        acc.shop_name.toLowerCase().includes(lowerSearchTerm) ||
        acc.full_name.toLowerCase().includes(lowerSearchTerm) ||
        acc.mobile_number.includes(lowerSearchTerm) ||
        acc.city.toLowerCase().includes(lowerSearchTerm)
      );
      setFilteredAccounts(filtered);
    }
  }, [searchTerm, accounts]);

  // --- Handle Delete User ---
  const handleDeleteUser = async (accountId) => {
    setError(''); // Clear previous errors
    try {
      // Delete from 'kitto_drop_accounts' table
      // CASCADE will handle deleting from other tables (orders, bank, withdrawals)
      const { error: deleteError } = await supabase
        .from('kitto_drop_accounts')
        .delete()
        .eq('id', accountId);

      if (deleteError) {
        throw deleteError;
      }

      // Update the UI state immediately
      setAccounts(prevAccounts => prevAccounts.filter(acc => acc.id !== accountId));
      // setFilteredAccounts(prevFiltered => prevFiltered.filter(acc => acc.id !== accountId)); // This will be handled by the useEffect above
      
    } catch (err) {
      console.error("Error deleting user:", err);
      setError(`Failed to delete user: ${err.message}. (Check console for details)`);
    }
  };


  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Kitto Drop Users</h1>

      {/* Search Bar */}
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Search by Shop Name, User Name, Phone, or City..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <FaSpinner className="animate-spin text-pink-600 text-4xl" />
          <p className="ml-3 text-gray-600">Loading user accounts...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-5 bg-red-50 text-red-700 rounded-lg">
          <FaExclamationTriangle className="text-3xl mb-2 mx-auto"/>
          <p>{error}</p>
        </div>
      )}

      {/* Content State */}
      {!isLoading && !error && (
        <div className="space-y-4">
          {filteredAccounts.length > 0 ? (
            // User List
            filteredAccounts.map(account => (
              <UserCard key={account.id} account={account} onDelete={handleDeleteUser} />
            ))
          ) : (
            // No Users Found
            <div className="text-center py-10 text-gray-500">
              <FaUsers className="text-4xl mb-3 mx-auto"/>
              <p className="text-lg">
                {searchTerm ? 'No accounts found matching your search.' : 'No Kitto Drop accounts found.'}
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}