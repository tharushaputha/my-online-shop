// app/kitto-drop/commission/page.jsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { FaSpinner, FaExclamationTriangle, FaInfoCircle, FaDollarSign, FaHistory, FaUniversity, FaCheckCircle, FaHourglassHalf } from 'react-icons/fa';

// Helper: Status Badge
const StatusBadge = ({ status }) => {
  let colorClasses = 'bg-gray-100 text-gray-800';
  let icon = <FaInfoCircle />;
  if (status === 'Pending') {
    colorClasses = 'bg-yellow-100 text-yellow-800';
    icon = <FaHourglassHalf />;
  } else if (status === 'Approved' || status === 'Completed' || status === 'Delivered') { // 'Delivered' order status
    colorClasses = 'bg-green-100 text-green-800';
    icon = <FaCheckCircle />;
  } else if (status === 'Rejected' || status === 'Cancelled') { // 'Cancelled' order status
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

export default function CommissionPage() {
  const router = useRouter();
  const [kittoDropAccountId, setKittoDropAccountId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // --- Data States ---
  const [availableBalance, setAvailableBalance] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [pendingWithdrawals, setPendingWithdrawals] = useState(0);
  const [hasBankDetails, setHasBankDetails] = useState(false);
  const [earnedOrders, setEarnedOrders] = useState([]); // List of orders
  const [withdrawalHistory, setWithdrawalHistory] = useState([]); // List of withdrawals

  // --- Form State ---
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Main Data Fetching Function ---
  const fetchData = useCallback(async (accountId) => {
    if (!accountId) return;

    setIsLoading(true);
    setError('');

    try {
      // 1. Fetch Bank Details (to check if user can withdraw)
      const { data: bankData, error: bankError } = await supabase
        .from('kitto_drop_bank_details')
        .select('id')
        .eq('account_id', accountId)
        .maybeSingle();
      if (bankError) throw new Error(`Bank check failed: ${bankError.message}`);
      setHasBankDetails(!!bankData); // true if bankData is not null

      // 2. Fetch all COMPLETED orders (e.g., 'Delivered' or 'Shipped' - adjust status as needed)
      //    We assume 'Delivered' means the profit is earned
      const { data: ordersData, error: ordersError } = await supabase
        .from('kitto_drop_orders')
        .select('id, created_at, customer_name, total_profit, order_status')
        .eq('kitto_drop_account_id', accountId)
        .eq('order_status', 'Delivered') // <-- IMPORTANT: Only count delivered orders
        .order('created_at', { ascending: false });
      if (ordersError) throw new Error(`Orders fetch failed: ${ordersError.message}`);
      setEarnedOrders(ordersData || []);
      const calculatedTotalEarned = (ordersData || []).reduce((sum, order) => sum + order.total_profit, 0);
      setTotalEarned(calculatedTotalEarned);

      // 3. Fetch all Withdrawal requests
      const { data: withdrawalsData, error: withdrawalsError } = await supabase
        .from('kitto_drop_withdrawals')
        .select('id, created_at, amount, status')
        .eq('kitto_drop_account_id', accountId)
        .order('created_at', { ascending: false });
      if (withdrawalsError) throw new Error(`Withdrawals fetch failed: ${withdrawalsError.message}`);
      setWithdrawalHistory(withdrawalsData || []);

      // 4. Calculate Balances
      const calculatedPendingWithdrawals = (withdrawalsData || [])
        .filter(w => w.status === 'Pending')
        .reduce((sum, w) => sum + w.amount, 0);
      setPendingWithdrawals(calculatedPendingWithdrawals);

      const calculatedCompletedWithdrawals = (withdrawalsData || [])
        .filter(w => w.status === 'Approved' || w.status === 'Completed') // Use 'Approved' or 'Completed'
        .reduce((sum, w) => sum + w.amount, 0);

      // Available Balance = Total Earned - (Total Already Withdrawn + Total Pending)
      setAvailableBalance(calculatedTotalEarned - calculatedCompletedWithdrawals - calculatedPendingWithdrawals);

    } catch (err) {
      console.error("Error fetching commission data:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array, will be called by user check effect

  // --- User Verification ---
  useEffect(() => {
    let accountId = null;
    try {
      const storedUser = localStorage.getItem('kittoDropUser');
      if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
        const userData = JSON.parse(storedUser);
        if (userData && userData.id) {
          accountId = userData.id;
          setKittoDropAccountId(accountId);
          // --- Fetch data now that we have the ID ---
          fetchData(accountId);
        } else {
          throw new Error("Invalid user data.");
        }
      } else {
        throw new Error("No user data.");
      }
    } catch (e) {
      console.error("User validation error:", e);
      router.push('/kitto-drop/login'); // Redirect if no valid user
    }
  }, [router, fetchData]); // Add fetchData to dependency array

  // --- Handle Withdraw Request ---
  const handleWithdraw = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    const amount = parseFloat(withdrawAmount);

    // Validation
    if (!amount || amount <= 0) {
      setError('Please enter a valid withdrawal amount.');
      setIsSubmitting(false);
      return;
    }
    if (amount > availableBalance) {
      setError('Withdrawal amount cannot be more than your available balance.');
      setIsSubmitting(false);
      return;
    }

    try {
      const { error: insertError } = await supabase
        .from('kitto_drop_withdrawals')
        .insert({
          kitto_drop_account_id: kittoDropAccountId,
          amount: amount,
          status: 'Pending' // Admin will approve this later
        });

      if (insertError) {
        throw insertError;
      }

      setSuccessMessage(`Withdrawal request for Rs. ${amount.toFixed(2)} submitted successfully!`);
      setWithdrawAmount(''); // Clear input
      // Refresh all data
      fetchData(kittoDropAccountId);

    } catch (err) {
      console.error("Error submitting withdrawal:", err);
      setError(`Failed to submit request: ${err.message || 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };


  // --- Render Loading State ---
  if (isLoading) {
    return (
        <> <Header /> <main className="bg-white min-h-[calc(100vh-150px)] flex justify-center items-center"> <FaSpinner className="animate-spin text-pink-600 text-4xl" /> <p className="ml-3 text-gray-600">Loading earnings...</p> </main> <Footer /> </>
    );
  }

  // --- Render Page Content ---
  return (
    <>
      <Header />
      <main className="bg-white min-h-[calc(100vh-150px)] py-10 px-4">
        <div className="max-w-5xl mx-auto"> {/* Wider container */}
          <h1 className="text-3xl sm:text-4xl font-bold text-pink-600 mb-8 text-center">
            My Earnings & Commission
          </h1>

          {/* === 1. Earnings Summary (Gemini's Idea) === */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {/* Available Balance */}
            <div className="bg-green-50 p-5 rounded-xl shadow-md border border-green-200 text-center">
              <h3 className="text-sm font-semibold text-green-800 uppercase">Available Balance</h3>
              <p className="text-3xl font-extrabold text-green-700 mt-2">Rs. {availableBalance.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">Ready to withdraw</p>
            </div>
            {/* Total Earned */}
            <div className="bg-gray-50 p-5 rounded-xl shadow-md border border-gray-200 text-center">
              <h3 className="text-sm font-semibold text-gray-700 uppercase">Total Earned</h3>
              <p className="text-3xl font-extrabold text-gray-800 mt-2">Rs. {totalEarned.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">(From {earnedOrders.length} delivered orders)</p>
            </div>
            {/* Pending Withdrawals */}
            <div className="bg-yellow-50 p-5 rounded-xl shadow-md border border-yellow-200 text-center">
              <h3 className="text-sm font-semibold text-yellow-800 uppercase">Pending Withdrawals</h3>
              <p className="text-3xl font-extrabold text-yellow-700 mt-2">Rs. {pendingWithdrawals.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">Awaiting approval</p>
            </div>
          </div>

          {/* Main Grid: Withdraw & Earnings Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* --- Left Column: Withdraw --- */}
            <div className="lg:col-span-1 space-y-6">
              {/* Withdraw Card */}
              <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-100 sticky top-24"> {/* Sticky for desktop */}
                <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                  <FaDollarSign className="text-pink-500 mr-2"/> Request Withdrawal
                </h2>
                
                {!hasBankDetails ? (
                  // If No Bank Details
                  <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <FaInfoCircle className="text-yellow-600 text-2xl mx-auto mb-2"/>
                    <p className="text-sm text-yellow-800 font-medium">Please add your bank details first to request a withdrawal.</p>
                    <Link href="/kitto-drop/manage-bank" className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-pink-600 text-pink-600 text-sm font-medium rounded-md hover:bg-pink-50 transition-colors">
                       <FaUniversity className="mr-2"/> Add Bank Details
                    </Link>
                  </div>
                ) : (
                  // If Bank Details Exist
                  <form onSubmit={handleWithdraw} className="space-y-4">
                    <div>
                      <label htmlFor="withdrawAmount" className="block text-sm font-medium text-gray-700 mb-1">Amount to Withdraw</label>
                      <input
                        type="number"
                        id="withdrawAmount"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        step="0.01"
                        min="1" // Minimum withdraw amount
                        max={availableBalance} // Maximum withdraw amount
                        placeholder={`e.g., ${availableBalance.toFixed(2)}`}
                        required
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-base shadow-sm"
                      />
                       <p className="text-xs text-gray-500 mt-1">Available: Rs. {availableBalance.toFixed(2)}</p>
                    </div>
                    {/* Messages */}
                    {error && <p className="text-sm text-red-600 text-center"><FaExclamationTriangle className="inline mr-1.5"/>{error}</p>}
                    {successMessage && <p className="text-sm text-green-600 text-center"><FaCheckCircle className="inline mr-1.5"/>{successMessage}</p>}
                    {/* Submit Button */}
                    <button type="submit" disabled={isSubmitting || availableBalance <= 0}
                            className={`w-full bg-pink-600 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg flex items-center justify-center ${
                              (isSubmitting || availableBalance <= 0) ? 'opacity-70 cursor-not-allowed' : 'hover:bg-pink-700'
                            }`}>
                      {isSubmitting ? <FaSpinner className="animate-spin mr-2" /> : null}
                      {isSubmitting ? 'Submitting...' : 'Request Withdraw'}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* --- Right Column: History --- */}
            <div className="lg:col-span-2 space-y-6">
                {/* Earnings Breakdown Card */}
                <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Earnings Breakdown</h2>
                    <div className="max-h-60 overflow-y-auto space-y-3 pr-2 modal-list-scroll">
                        {earnedOrders.length > 0 ? (
                            earnedOrders.map(order => (
                                <div key={order.id} className="flex justify-between items-center bg-white p-3 rounded border border-gray-200">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{order.customer_name}</p>
                                        <p className="text-xs text-gray-500">Order on {new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <p className="text-base font-bold text-green-600">+ Rs. {order.total_profit.toFixed(2)}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 text-center py-4">No completed orders found.</p>
                        )}
                    </div>
                </div>

                {/* Withdrawal History Card (Gemini's Idea) */}
                <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                        <FaHistory className="text-gray-500 mr-2"/> Withdrawal History
                    </h2>
                     <div className="max-h-60 overflow-y-auto space-y-3 pr-2 modal-list-scroll">
                        {withdrawalHistory.length > 0 ? (
                            withdrawalHistory.map(w => (
                                <div key={w.id} className="flex justify-between items-center bg-white p-3 rounded border border-gray-200">
                                    <div>
                                        <p className="text-base font-bold text-gray-800">Rs. {w.amount.toFixed(2)}</p>
                                        <p className="text-xs text-gray-500">Requested on {new Date(w.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <StatusBadge status={w.status} />
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 text-center py-4">No withdrawal requests found.</p>
                        )}
                    </div>
                </div>

            </div> {/* --- End Right Column --- */}
          </div> {/* End Main Grid */}

          <Link href="/kitto-drop/my-account" className="block mt-8 text-center text-pink-600 hover:underline text-sm">
            ← Back to My Account
          </Link>
        </div>
      </main>
      <Footer />
      {/* Helper CSS (copy from other pages) */}
      <style jsx global>{` .modal-list-scroll::-webkit-scrollbar { width: 6px; } /* ... etc */ `}</style>
    </>
  );
}