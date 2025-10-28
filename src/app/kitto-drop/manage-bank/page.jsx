// app/kitto-drop/manage-bank/page.jsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { FaUniversity, FaUser, FaHashtag, FaCodeBranch, FaSave, FaSpinner, FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

// Sample Banks (Add the full list here or fetch from DB if needed)
const sriLankanBanks = [
  'Select Bank...', // Default option
  'Bank of Ceylon (BOC)', 'People\'s Bank', 'Commercial Bank', 'Hatton National Bank (HNB)',
  'Sampath Bank', 'Seylan Bank', 'National Savings Bank (NSB)', 'Nations Trust Bank (NTB)',
  'DFCC Bank', 'Pan Asia Bank', 'Union Bank', 'Amana Bank', 'Standard Chartered Bank',
  'HSBC', 'Cargills Bank', 'MCB Bank', 'Public Bank', 'State Bank of India',
];

export default function ManageBankPage() {
  // State
  const [accountId, setAccountId] = useState(null); // Kitto Drop Account ID
  const [bankDetailId, setBankDetailId] = useState(null); // ID if bank details already exist
  const [initialDataLoading, setInitialDataLoading] = useState(true);
  const [bankName, setBankName] = useState(sriLankanBanks[0]); // Default to placeholder
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [branchName, setBranchName] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  // Fetch Existing Data or Verify User
  useEffect(() => {
    setError('');
    setInitialDataLoading(true);
    const storedUser = localStorage.getItem('kittoDropUser');
    let fetchedAccountId = null;

    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData && userData.id) {
          fetchedAccountId = userData.id;
          setAccountId(fetchedAccountId); // Store the account ID
        } else {
          throw new Error("Invalid user data.");
        }
      } catch (e) {
        console.error("Error loading user data", e);
        setError("Could not verify user. Please log in again.");
        setTimeout(() => router.push('/kitto-drop/login'), 2000);
        return;
      }
    } else {
      setError("You need to be logged in to manage bank details.");
      setTimeout(() => router.push('/kitto-drop/login'), 2000);
      return;
    }

    // --- Fetch Existing Bank Details ---
    const fetchBankDetails = async () => {
      if (!fetchedAccountId) return;

      const { data, error: fetchError } = await supabase
        .from('kitto_drop_bank_details')
        .select('*')
        .eq('account_id', fetchedAccountId) // Match the Kitto Drop account ID
        .maybeSingle(); // Expect 0 or 1 row

      if (fetchError) {
        console.error("Error fetching bank details:", fetchError);
        setError("Could not load existing bank details.");
      } else if (data) {
        // Populate form if details exist
        setBankDetailId(data.id); // Store the ID of the bank detail row
        setBankName(data.bank_name || sriLankanBanks[0]);
        setAccountHolderName(data.account_holder_name || '');
        setAccountNumber(data.account_number || '');
        setBranchName(data.branch_name || '');
      } else {
        // No existing details, form will be empty (ready for insert)
        setBankDetailId(null);
      }
      setInitialDataLoading(false);
    };

    fetchBankDetails();

  }, [router]);

  // Form Submission Logic (Upsert: Insert or Update)
  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!accountId) {
        setError('User account ID not found. Cannot save.');
        return;
    }

    // Validation
    if (!bankName || bankName === sriLankanBanks[0] || !accountHolderName || !accountNumber) {
      setError('Please fill in Bank Name, Account Holder Name, and Account Number.');
      return;
    }

    setIsSubmitting(true);

    const bankData = {
      account_id: accountId, // Link to the user's Kitto Drop account
      bank_name: bankName,
      account_holder_name: accountHolderName,
      account_number: accountNumber,
      branch_name: branchName || null, // Send null if empty
    };

    try {
        let resultError;
        if (bankDetailId) {
            // --- UPDATE existing details ---
            console.log("Attempting to UPDATE bank details for ID:", bankDetailId);
            const { error } = await supabase
              .from('kitto_drop_bank_details')
              .update(bankData)
              .eq('id', bankDetailId); // Update the specific row
            resultError = error;
        } else {
            // --- INSERT new details ---
            console.log("Attempting to INSERT new bank details for Account ID:", accountId);
            const { error } = await supabase
              .from('kitto_drop_bank_details')
              .insert(bankData);
            resultError = error;
        }

      if (resultError) {
        // Check for unique constraint violation (account_id already has bank details)
        if (resultError.code === '23505' && resultError.message.includes('kitto_drop_bank_details_account_id_key')) {
             setError('Bank details already exist for this account. Cannot add new ones. Try refreshing the page to edit.');
             console.error("Unique constraint violation:", resultError);
             // Optionally fetch existing data again here to switch to update mode
        } else {
            throw resultError; // Throw other errors
        }
      } else {
          setSuccessMessage('Bank details saved successfully!');
          setTimeout(() => {
            router.push('/kitto-drop/my-account'); // Redirect back to My Account
          }, 1500);
      }

    } catch (err) {
      console.error('Error saving bank details:', err);
      setError(`Failed to save bank details: ${err.message || 'Please try again.'}`);
    } finally {
        // Keep button disabled on success during redirect timer
        if (error || !successMessage) {
             setIsSubmitting(false);
        }
    }
  };

  // --- Render Initial Loading State ---
  if (initialDataLoading) {
    return (
        <>
        <Header />
        <main className="bg-white min-h-[calc(100vh-150px)] flex justify-center items-center">
            <FaSpinner className="animate-spin text-pink-600 text-4xl" />
            <p className="ml-3 text-gray-600">Loading bank details...</p>
        </main>
        <Footer />
        </>
    );
  }

  // --- Render Error State (if loading failed critically) ---
   if (error && !accountId) {
     return ( /* ... (Error display - code bezennna) ... */
        <> <Header /> <main className="bg-white min-h-[calc(100vh-150px)] flex justify-center items-center p-6 text-center"> <div className="text-red-600"> <FaExclamationTriangle className="text-3xl mb-2 mx-auto"/> <p>{error}</p> <Link href="/kitto-drop/login" className="mt-4 text-pink-600 hover:underline text-sm block">Go to Login</Link> </div> </main> <Footer /> </>
     );
   }

  // --- Render Page Content (Form) ---
  return (
    <>
      <Header />
      {/* White Background */}
      <main className="bg-white min-h-[calc(100vh-150px)] py-10 px-4 flex justify-center items-start">
        <div className="w-full max-w-lg bg-gray-50 p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200"> {/* Slightly smaller card */}
          <h1 className="text-3xl sm:text-4xl font-bold text-pink-600 mb-6 text-center">
            Manage Bank Details
          </h1>

          <form onSubmit={handleSave} className="space-y-5">
            {/* Bank Name Dropdown */}
            <div>
              <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">Bank Name *</label>
              <select id="bankName" value={bankName} onChange={(e) => setBankName(e.target.value)} required
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-base shadow-sm bg-white appearance-none">
                 {sriLankanBanks.map(bank => (
                    <option key={bank} value={bank} disabled={bank === sriLankanBanks[0]}>
                       {bank}
                    </option>
                 ))}
              </select>
            </div>

            {/* Account Holder Name */}
            <div>
              <label htmlFor="accountHolderName" className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name *</label>
              <input type="text" id="accountHolderName" value={accountHolderName} onChange={(e) => setAccountHolderName(e.target.value)} required
                     placeholder="Name as on bank account"
                     className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-base shadow-sm"/>
            </div>

             {/* Account Number */}
            <div>
              <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">Account Number *</label>
              <input type="text" id="accountNumber" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required
                     inputMode="numeric" // Helps mobile keyboards
                     placeholder="Enter account number"
                     className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-base shadow-sm"/>
            </div>

             {/* Branch Name (Optional) */}
            <div>
              <label htmlFor="branchName" className="block text-sm font-medium text-gray-700 mb-1">Branch Name (Optional)</label>
              <input type="text" id="branchName" value={branchName} onChange={(e) => setBranchName(e.target.value)}
                     placeholder="e.g., Colombo 7"
                     className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-base shadow-sm"/>
            </div>

            {/* Error/Success Messages */}
            {error && <p className="text-sm text-red-600 text-center flex items-center justify-center"><FaExclamationTriangle className="mr-1.5"/>{error}</p>}
            {successMessage && <p className="text-sm text-green-600 text-center flex items-center justify-center"><FaCheckCircle className="mr-1.5"/>{successMessage}</p>}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button type="submit" disabled={isSubmitting || successMessage}
                        className={`w-full sm:flex-1 bg-pink-600 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg flex items-center justify-center ${
                          isSubmitting || successMessage ? 'opacity-70 cursor-not-allowed' : 'hover:bg-pink-700'
                        }`}>
                  {isSubmitting ? <FaSpinner className="animate-spin mr-2" /> : <FaSave className="mr-2" />}
                  {isSubmitting ? 'Saving...' : successMessage ? 'Saved!' : bankDetailId ? 'Update Bank Details' : 'Add Bank Details'}
                </button>
                <Link href="/kitto-drop/my-account"
                      className="w-full sm:w-auto text-center px-6 py-3 border border-gray-300 text-gray-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-lg">
                    Cancel
                </Link>
            </div>
          </form>
        </div>
      </main>
      <Footer />
       {/* Helper CSS */}
       <style jsx global>{` .modal-list-scroll::-webkit-scrollbar { width: 6px; } .modal-list-scroll::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 3px;} .modal-list-scroll::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px;} .modal-list-scroll::-webkit-scrollbar-thumb:hover { background: #9ca3af; } `}</style>
    </>
  );
}