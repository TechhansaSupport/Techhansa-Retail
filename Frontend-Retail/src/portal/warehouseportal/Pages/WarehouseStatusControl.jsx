import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios';
import { Settings2, Save, RefreshCw, XCircle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function WarehouseStatusControl() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // We can track pending changes locally before saving
  const [statusChanges, setStatusChanges] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      const res = await axios.get('/api/admin/orders', { headers: { Authorization: `Bearer ${token}` } });
      
      // Filter out statuses that don't need controlling anymore (like cancelled or already delivered if we want to hide them, 
      // but usually we want to see everything or at least active ones). We'll show all for now and let them filter.
      setOrders(res.data);
      setStatusChanges({});
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to load orders for status control');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    setStatusChanges(prev => ({
      ...prev,
      [orderId]: newStatus
    }));
  };

  const handleSaveStatus = async (order) => {
    const newStatus = statusChanges[order._id] || statusChanges[order.id];
    if (!newStatus) return;

    try {
      setUpdatingId(order._id || order.id);
      const token = sessionStorage.getItem('token');
      const isProcurement = order.orderType === 'Franchise Procurement' || order.orderType === 'Procurement';
      
      const endpoint = isProcurement 
        ? `/api/admin/procurement-requests/${order._id || order.id}/status`
        : `/api/admin/orders/${order._id || order.id}/status`;
      
      await axios.patch(endpoint, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
      
      toast.success('Status updated successfully');
      
      // Clear the local change for this row and refresh data
      setStatusChanges(prev => {
        const updated = { ...prev };
        delete updated[order._id || order.id];
        return updated;
      });
      fetchOrders();
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const statusOptions = [
    'Pending',
    'Confirmed',
    'Processing',
    'Sent to Warehouse',
    'Dispatched',
    'Out for Delivery',
    'Delivered',
    'Cancelled'
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Settings2 className="w-6 h-6 text-indigo-600" />
            Status Control
          </h1>
          <p className="text-slate-500 mt-1">Manage and update the lifecycle status of all partner orders.</p>
        </div>
        <button 
          onClick={fetchOrders}
          className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          title="Refresh Data"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Partner</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Current Status</th>
                <th className="px-6 py-4 font-semibold text-center">New Status</th>
                <th className="px-6 py-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-indigo-300" />
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const id = order._id || order.id;
                  const currentStatus = order.status || 'Pending';
                  const changedStatus = statusChanges[id];
                  const hasChanged = changedStatus && changedStatus !== currentStatus;

                  return (
                    <tr key={id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">{order.orderNumber || order.requestId || order.orderId}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-700">{order.storeId || order.userId || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {order.orderType || 'Order'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          currentStatus === 'Delivered' || currentStatus === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' :
                          currentStatus === 'Dispatched' || currentStatus === 'DISPATCHED' ? 'bg-blue-100 text-blue-700' :
                          currentStatus === 'Cancelled' ? 'bg-rose-100 text-rose-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {currentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={changedStatus || currentStatus}
                          onChange={(e) => handleStatusChange(id, e.target.value)}
                          className="w-full min-w-[160px] px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          {statusOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                          {/* Fallback if current status is not in the list (e.g., uppercase DELIVERED) */}
                          {!statusOptions.includes(currentStatus) && (
                            <option value={currentStatus}>{currentStatus}</option>
                          )}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleSaveStatus(order)}
                          disabled={!hasChanged || updatingId === id}
                          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all w-full ${
                            hasChanged
                              ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          {updatingId === id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                          Save
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
