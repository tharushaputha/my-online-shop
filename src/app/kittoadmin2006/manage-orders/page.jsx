'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { 
  FaSearch, FaCopy, FaCheckCircle, FaSpinner, FaBoxOpen, 
  FaTruck, FaTimesCircle, FaMapMarkerAlt, FaUser, FaClipboardList,
  FaCalendarAlt, FaMoneyBillWave, FaTag
} from 'react-icons/fa';

// --- Custom Toast ---
const ToastNotification = ({ message, show, onClose }) => {
  if (!show) return null;
  return (
    <div className="fixed bottom-5 right-5 z-50 animate-slide-in">
      <div className="bg-gray-800 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 border border-gray-700">
        <FaCheckCircle className="text-green-400 text-lg" />
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

// --- Copy Button ---
const CopyButton = ({ text, label, onCopy }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      if(onCopy) onCopy(`Copied ${label}`); 
      setTimeout(() => setCopied(false), 2000);
    }
  };
  return (
    <button 
      onClick={handleCopy} 
      title={`Copy ${label}`}
      className="ml-2 text-gray-400 hover:text-pink-600 transition-colors focus:outline-none active:scale-95 transform"
    >
      {copied ? <FaCheckCircle className="w-3 h-3 text-green-500" /> : <FaCopy className="w-3 h-3" />}
    </button>
  );
};

// --- Status Badge ---
const StatusBadge = ({ status }) => {
  const colors = {
    'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Processing': 'bg-blue-100 text-blue-800 border-blue-200',
    'Shipped': 'bg-purple-100 text-purple-800 border-purple-200',
    'Delivered': 'bg-green-100 text-green-800 border-green-200',
    'Cancelled': 'bg-red-100 text-red-800 border-red-200',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};

export default function ManageOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // --- Fetch Orders (Simple & Fast) ---
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('kitto_drop_orders')
        .select(`*, kitto_drop_order_items (*)`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    if (!window.confirm(`Mark this order as "${newStatus}"?`)) return;
    try {
      const { error } = await supabase
        .from('kitto_drop_orders')
        .update({ order_status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      triggerToast(`Order marked as ${newStatus}`);
      fetchOrders(); 
    } catch (err) { alert("Error updating status"); console.error(err); }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'All' || order.order_status === filterStatus;
    const term = searchTerm.toLowerCase();
    const matchesSearch = (order.customer_name?.toLowerCase() || '').includes(term) || (order.customer_city?.toLowerCase() || '').includes(term) || (order.id || '').includes(term);
    return matchesStatus && matchesSearch;
  });

  const tabs = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans relative">
      <ToastNotification message={toastMsg} show={showToast} />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Orders</h1>
          <p className="text-sm text-gray-500 mt-1">View all customer submissions clearly</p>
        </div>
        <div className="relative w-full md:w-72 group">
          <FaSearch className="absolute left-3 top-3 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
          <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none shadow-sm" />
        </div>
      </div>

      <div className="flex overflow-x-auto space-x-2 mb-8 pb-2 no-scrollbar">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setFilterStatus(tab)} className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${filterStatus === tab ? 'bg-pink-600 text-white shadow-md transform scale-105' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}> {tab} </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20"><FaSpinner className="animate-spin text-4xl text-pink-500 mb-3" /></div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200 border-dashed"><FaBoxOpen className="mx-auto text-5xl text-gray-300 mb-4" /><p className="text-xl font-medium text-gray-600">No orders found</p></div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {/* Top Bar */}
              <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <span className="bg-gray-200 text-gray-700 px-2.5 py-1 rounded-md text-xs font-mono font-bold">#{order.id.slice(0, 8)}</span>
                  <CopyButton text={order.id} label="ID" onCopy={triggerToast} />
                  <span className="text-gray-300">|</span>
                  <span className="text-sm text-gray-500 flex items-center gap-1"><FaCalendarAlt className="text-gray-400 w-3 h-3" /> {new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-3">
                   <div className="flex items-center gap-1 text-xs font-bold text-gray-500 bg-white px-2 py-1 rounded border border-gray-200 shadow-sm uppercase">
                      {order.order_source || 'UNKNOWN'}
                   </div>
                   <StatusBadge status={order.order_status} />
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Customer Info */}
                <div className="lg:col-span-5 space-y-5">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                    <div className="flex justify-between items-start">
                       <div><p className="text-xs uppercase font-semibold text-gray-500">Name</p><p className="font-bold text-gray-800 text-lg leading-tight">{order.customer_name}</p></div>
                       <CopyButton text={order.customer_name} label="Name" onCopy={triggerToast} />
                    </div>
                    <div className="flex justify-between items-start pt-2 border-t border-gray-200/50">
                       <div className="flex-1 mr-2">
                          <p className="text-xs uppercase font-semibold text-gray-500">Address</p>
                          <p className="text-sm text-gray-700 leading-snug mt-0.5">{order.customer_address}</p>
                          <p className="text-sm font-semibold text-gray-900 mt-1">{order.customer_city}, {order.customer_district}</p>
                       </div>
                       <div className="flex flex-col gap-1">
                         <CopyButton text={order.customer_address} label="Address" onCopy={triggerToast} />
                         <CopyButton text={`${order.customer_city}, ${order.customer_district}`} label="City" onCopy={triggerToast} />
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                     <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <p className="text-xs text-blue-500 font-bold uppercase mb-1">Payment</p>
                        <p className="text-sm font-bold text-blue-800 flex items-center gap-1"><FaMoneyBillWave /> {order.payment_method || 'COD'}</p>
                     </div>
                     <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                        <p className="text-xs text-purple-500 font-bold uppercase mb-1">Due Date</p>
                        <p className="text-sm font-bold text-purple-800">{order.due_date || 'N/A'}</p>
                     </div>
                  </div>
                  
                  {order.order_note && (
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-sm text-yellow-800 italic">
                      <span className="font-bold">User Note:</span> "{order.order_note}"
                    </div>
                  )}
                </div>

                {/* Items */}
                <div className="lg:col-span-4 flex flex-col">
                   <div className="flex items-center gap-2 text-gray-400 uppercase text-xs font-bold tracking-wider mb-3"><FaClipboardList /> Items Ordered</div>
                   <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden">
                     <div className="max-h-[250px] overflow-y-auto custom-scrollbar p-1">
                        {order.kitto_drop_order_items && order.kitto_drop_order_items.length > 0 ? (
                          order.kitto_drop_order_items.map((item, idx) => (
                              <div key={idx} className="p-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                                <div className="flex justify-between items-start mb-1">
                                   <div><p className="font-bold text-gray-800 text-sm">{item.product_name || "Unknown Product"}</p></div>
                                   <span className="font-mono text-sm font-bold text-gray-600">x{item.quantity}</span>
                                </div>
                                <div className="flex justify-between items-center mt-2 text-xs">
                                   <span className="text-gray-400">Price: Rs. {item.sale_amount}</span>
                                   <span className="font-bold text-gray-800">Rs. {(item.sale_amount * item.quantity).toLocaleString()}</span>
                                </div>
                                {/* --- COLOR / DETAILS DISPLAY HERE --- */}
                                {item.product_note && (
                                  <p className="text-xs text-pink-600 mt-2 bg-pink-50 p-1.5 rounded border border-pink-100">
                                    <FaTag className="inline mr-1"/> 
                                    <span className="font-bold">Spec/Color:</span> {item.product_note}
                                  </p>
                                )}
                              </div>
                          ))
                        ) : (<div className="p-5 text-center text-gray-400 text-sm">No items data found</div>)}
                     </div>
                  </div>
                </div>

                {/* Totals */}
                <div className="lg:col-span-3 flex flex-col gap-4">
                  <div className="bg-gray-900 text-white rounded-xl p-5 shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                      <p className="text-gray-400 text-xs font-bold uppercase mb-1">Total Payable</p>
                      <p className="text-3xl font-bold text-white mb-4">Rs. {order.total_order_amount?.toLocaleString()}</p>
                      <div className="border-t border-gray-700 pt-3 mt-2 flex justify-between items-center">
                           <span className="text-xs text-green-400 font-bold uppercase">Est. Profit</span>
                           <span className="text-lg font-bold text-green-400">+ Rs. {order.total_profit?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-auto grid grid-cols-1 gap-2">
                    {order.order_status === 'Pending' && <button onClick={() => handleStatusUpdate(order.id, 'Processing')} className="w-full py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-bold transition-colors"><FaSpinner className="inline mr-2"/> Mark Processing</button>}
                    {(order.order_status === 'Processing' || order.order_status === 'Pending') && <button onClick={() => handleStatusUpdate(order.id, 'Shipped')} className="w-full py-2 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg text-sm font-bold transition-colors"><FaTruck className="inline mr-2"/> Mark Shipped</button>}
                    {order.order_status === 'Shipped' && <button onClick={() => handleStatusUpdate(order.id, 'Delivered')} className="w-full py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-sm font-bold transition-colors"><FaCheckCircle className="inline mr-2"/> Mark Delivered</button>}
                    {order.order_status !== 'Cancelled' && order.order_status !== 'Delivered' && <button onClick={() => handleStatusUpdate(order.id, 'Cancelled')} className="w-full py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-bold transition-colors"><FaTimesCircle className="inline mr-2"/> Cancel Order</button>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}