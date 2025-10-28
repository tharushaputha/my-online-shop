// file: app/kittoadmin2006/withdrawals/page.jsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { FaSpinner, FaExclamationTriangle, FaBoxOpen, FaCheckCircle, FaTimesCircle, FaUniversity, FaUser, FaHashtag } from 'react-icons/fa';

// Status Badge Component
const StatusBadge = ({ status }) => {
  let colorClasses = 'bg-gray-100 text-gray-800';
  let icon = <FaSpinner className="animate-spin" />;
  if (status === 'Approved') {
    colorClasses = 'bg-green-100 text-green-800';
    icon = <FaCheckCircle />;
  } else if (status === 'Rejected') {
    colorClasses = 'bg-red-100 text-red-800';
    icon = <FaTimesCircle />;
  }
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${colorClasses}`}>
      {icon}
      <span className="ml-1.5">{status}</span>
    </span>
  );
};

// Withdrawal Card Component
const WithdrawalCard = ({ request, onUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Extract details (nested joins)
  const account = request.kitto_drop_accounts;
  // Bank details might be an array (if 1-to-many) or object (if 1-to-1 via UNIQUE constraint)
  // We used UNIQUE, so it should be an object (or null)
  const bankDetails = account?.kitto_drop_bank_details; 

  const handleUpdate = async (newStatus) => {
    if (!window.confirm(`Are you sure you want to "${newStatus}" this request?`)) {
      return;
    }
    setIsUpdating(true);
    await onUpdate(request.id, newStatus);
    // isUpdating will be reset by parent's data refresh
  };

  return (
    <div className="bg-white p-4 sm:p-5 rounded-lg border border-gray-200 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Column 1: User & Request Details */}
        <div className="md:col-span-1 border-b md:border-b-0 md:border-r pb-4 md:pb-0 md:pr-4">
          <p className="text-sm text-gray-500">Shop Name</p>
          <p className="font-semibold text-lg text-gray-800 mb-2">{account?.shop_name || 'Unknown Shop'}</p>
          
          <p className="text-sm text-gray-500">Request Date</p>
          <p className="font-medium text-gray-700 mb-2">{new Date(request.created_at).toLocaleString()}</p>
          
          <p className="text-sm text-gray-500">Amount</p>
          <p className="font-extrabold text-2xl text-pink-600">Rs. {request.amount.toFixed(2)}</p>
        </div>

        {/* Column 2: Bank Details */}
        <div className="md:col-span-1 border-b md:border-b-0 md:border-r pb-4 md:pb-0 md:pr-4">
           <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider flex items-center"><FaUniversity className="mr-2"/>Bank Details</h3>
           {bankDetails ? (
              <div className="space-y-1 text-sm text-gray-600">
                <p><strong>Bank:</strong> {bankDetails.bank_name}</p>
                <p><strong>Holder:</strong> {bankDetails.account_holder_name}</p>
                <p><strong>Acc No:</strong> {bankDetails.account_number}</p>
                <p><strong>Branch:</strong> {bankDetails.branch_name || 'N/A'}</p>
              </div>
           ) : (
             <div className="text-sm text-red-500 font-medium p-3 bg-red-50 rounded border border-red-200">
               <FaExclamationTriangle className="inline mr-1.5"/>
               Bank details not added by user!
             </div>
           )}
        </div>

        {/* Column 3: Actions */}
        <div className="md:col-span-1 flex flex-col justify-between items-center md:items-end">
          <StatusBadge status={request.status} />
          
          {request.status === 'Pending' && (
            <div className="flex gap-2 w-full sm:w-auto mt-4 md:mt-0">
              <button
                onClick={() => handleUpdate('Rejected')}
                disabled={isUpdating}
                className="w-full flex-1 justify-center bg-white border border-red-500 text-red-500 font-semibold py-2 px-4 rounded-lg hover:bg-red-50 transition-colors text-sm disabled:opacity-50"
              >
                {isUpdating ? <FaSpinner className="animate-spin"/> : 'Reject'}
              </button>
              <button
                onClick={() => handleUpdate('Approved')}
                disabled={isUpdating || !bankDetails} // Disable if no bank details
                className={`w-full flex-1 justify-center bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm disabled:opacity-50 ${
                  !bankDetails ? 'cursor-not-allowed' : 'hover:bg-green-700'
                }`}
              >
                 {isUpdating ? <FaSpinner className="animate-spin"/> : 'Approve'}
              </button>
            </div>
          )}

          {request.status !== 'Pending' && (
             <p className="text-sm text-gray-400 mt-4 md:mt-0">Action completed.</p>
          )}
        </div>
      </div>
    </div>
  );
};


// Main Page
export default function ManageWithdrawalsPage() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('Pending'); // Default filter 'Pending'

  // --- Fetch ALL Withdrawal Requests ---
  const fetchWithdrawals = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      let query = supabase
        .from('kitto_drop_withdrawals')
        .select(`
          id,
          created_at,
          amount,
          status,
          kitto_drop_accounts (
            shop_name,
            kitto_drop_bank_details (
              bank_name,
              account_holder_name,
              account_number,
              branch_name
            )
          )
        `)
        .order('created_at', { ascending: true }); // Show oldest pending requests first

      if (filterStatus !== 'All') {
        query = query.eq('status', filterStatus);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }
      
      console.log("Fetched Withdrawals:", data);
      setRequests(data || []);

    } catch (err) {
      console.error("Error fetching withdrawals:", err);
      setError(`Failed to load requests: ${err.message}. (RLS disabled?)`);
    } finally {
      setIsLoading(false);
    }
  }, [filterStatus]); // Re-fetch when filterStatus changes

  // Initial fetch
  useEffect(() => {
    fetchWithdrawals();
  }, [fetchWithdrawals]);

  // --- Handle Status Update ---
  const handleUpdateStatus = async (requestId, newStatus) => {
    try {
        const { error: updateError } = await supabase
            .from('kitto_drop_withdrawals')
            .update({ status: newStatus })
            .eq('id', requestId);

        if (updateError) throw updateError;

        // Refresh list
        fetchWithdrawals();

    } catch (err) {
        console.error("Error updating status:", err);
        setError(`Failed to update status: ${err.message}`);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Withdrawals</h1>

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b mb-4 overflow-x-auto">
        {['Pending', 'Approved', 'Rejected', 'All'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`py-2 px-4 text-sm font-medium whitespace-nowrap ${
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
          <p className="ml-3 text-gray-600">Loading withdrawal requests...</p>
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
          {requests.length > 0 ? (
            // Requests List
            requests.map(request => (
              <WithdrawalCard key={request.id} request={request} onUpdate={handleUpdateStatus} />
            ))
          ) : (
            // No Requests Found
            <div className="text-center py-10 text-gray-500">
              <FaBoxOpen className="text-4xl mb-3 mx-auto"/>
              <p className="text-lg">No {filterStatus.toLowerCase()} withdrawal requests found.</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}