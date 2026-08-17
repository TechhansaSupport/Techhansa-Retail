import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios';
import { motion } from 'framer-motion';
import { Search, ShoppingCart, Eye, Package, Calendar, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invoiceTotal, setInvoiceTotal] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/orders');
      setOrders(res.data);
    } catch (error) {
      console.error('Failed to fetch global orders:', error);
      toast.error('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = async (orderId, orderType) => {
    try {
      if (orderType === 'Franchise Procurement') {
        const res = await axios.get(`/api/admin/procurement-requests/${orderId}`);
        setSelectedOrder({ ...res.data, orderType });
      } else {
        const res = await axios.get(`/api/admin/orders/${orderId}`);
        setSelectedOrder({ ...res.data, orderType });
      }
      setInvoiceTotal('');
      setIsModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
      toast.error('Failed to load order details');
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`/api/admin/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order ${newStatus.toLowerCase()} successfully`);
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const handleApproveProcurement = async (orderId) => {
    if (!invoiceTotal || isNaN(invoiceTotal) || Number(invoiceTotal) <= 0) {
      toast.error('Please enter a valid invoice total amount');
      return;
    }
    try {
      await axios.post(`/api/admin/procurement-requests/${orderId}/approve`, { totalAmount: Number(invoiceTotal) });
      toast.success('Invoice generated and Procurement Request approved');
      setIsModalOpen(false);
      fetchOrders();
    } catch (error) {
      console.error('Failed to approve procurement request:', error);
      toast.error(error.response?.data?.message || 'Failed to generate invoice');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-700';
      case 'Confirmed': return 'bg-blue-100 text-blue-700';
      case 'Processing': return 'bg-indigo-100 text-indigo-700';
      case 'Dispatched': return 'bg-purple-100 text-purple-700';
      case 'Delivered': return 'bg-emerald-100 text-emerald-700';
      case 'Declined': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || order.userId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || order.userRole === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
            <ShoppingCart size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Global Orders</h1>
            <p className="text-slate-500 text-sm mt-1">Monitor all network orders</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search by Order ID or Partner ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 bg-white"
        >
          <option value="All">All Partners</option>
          <option value="franchise">Franchise Partners</option>
          <option value="channel">Channel Partners</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-sm font-semibold text-slate-600">
                <th className="p-4">Order Details</th>
                <th className="p-4">Partner</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order, idx) => (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                          <Package size={18} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{order.orderNumber}</p>
                          <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                            <Calendar size={12} />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col items-start gap-1">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {order.userId || 'Unknown'}
                        </span>
                        {order.userRole && (
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${order.userRole === 'franchise' ? 'text-indigo-500' : 'text-blue-500'}`}>
                            {order.userRole}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-slate-700">
                      ₹{order.totalAmount?.toLocaleString() || 0}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-700">{order.paymentMethod || 'N/A'}</span>
                        <span className="text-xs text-slate-500">{order.paymentStatus}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {order.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(order._id, 'Confirmed')}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors inline-flex"
                              title="Accept Order"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(order._id, 'Declined')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-flex"
                              title="Decline Order"
                            >
                              <X size={18} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleViewOrder(order._id, order.orderType)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors inline-flex"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
                  <Package size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Order {selectedOrder.orderNumber}</h2>
                  <p className="text-sm text-slate-500 font-medium">Placed on {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors border border-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Status and Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Status & Delivery</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-sm font-medium">Order Status</span>
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-sm font-medium">Expected Delivery</span>
                      <span className="text-slate-700 text-sm font-bold">{selectedOrder.expectedDelivery ? new Date(selectedOrder.expectedDelivery).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Payment Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-sm font-medium">Payment Status</span>
                      <span className="text-slate-700 text-sm font-bold">{selectedOrder.paymentStatus}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-sm font-medium">Payment Method</span>
                      <span className="text-slate-700 text-sm font-bold">{selectedOrder.paymentMethod || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items List */}
              {selectedOrder.orderType === 'Franchise Procurement' ? (
                <div>
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Requested Items</h3>
                  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          <th className="px-4 py-3">Hardware Type</th>
                          <th className="px-4 py-3">Brand & Specs</th>
                          <th className="px-4 py-3 text-right">Quantity</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedOrder.items?.map((item, index) => (
                          <tr key={index} className="hover:bg-slate-50/50">
                            <td className="px-4 py-3 font-semibold text-slate-700 text-sm">
                              {item.hardwareType === 'Other' ? item.otherType : item.hardwareType}
                            </td>
                            <td className="px-4 py-3">
                              <p className="text-sm font-semibold text-slate-700">{item.brand}</p>
                              {item.specs && Object.keys(item.specs).length > 0 && (
                                <p className="text-xs text-slate-500 line-clamp-2">
                                  {Object.entries(item.specs).map(([k, v]) => `${k}: ${v}`).join(', ')}
                                </p>
                              )}
                              {item.comments && (
                                <p className="text-xs text-amber-600 mt-1 line-clamp-1 italic">"{item.comments}"</p>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm font-bold text-slate-700 text-right">{item.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : selectedOrder.quotationReference?.rfpReference?.products && (
                <div>
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Ordered Items</h3>
                  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          <th className="px-4 py-3">Item</th>
                          <th className="px-4 py-3">Category</th>
                          <th className="px-4 py-3 text-right">Quantity</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedOrder.quotationReference.rfpReference.products.map((item, index) => (
                          <tr key={index} className="hover:bg-slate-50/50">
                            <td className="px-4 py-3">
                              <p className="font-semibold text-slate-700 text-sm">{item.brand} {item.model}</p>
                              <p className="text-xs text-slate-500 line-clamp-1">{item.configuration}</p>
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-600">{item.category}</td>
                            <td className="px-4 py-3 text-sm font-bold text-slate-700 text-right">{item.quantity} {item.unit}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Total Amount Footer */}
              {selectedOrder.orderType === 'Franchise Procurement' && selectedOrder.status === 'PENDING' ? (
                <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-indigo-800 font-bold uppercase tracking-wider text-sm mb-1">Set Invoice Amount (₹)</span>
                    <input
                      type="number"
                      value={invoiceTotal}
                      onChange={(e) => setInvoiceTotal(e.target.value)}
                      placeholder="e.g. 50000"
                      className="px-4 py-2 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-indigo-900"
                    />
                  </div>
                  <button
                    onClick={() => handleApproveProcurement(selectedOrder._id)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-sm transition-colors whitespace-nowrap"
                  >
                    Generate B2B Invoice & Approve
                  </button>
                </div>
              ) : (
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 flex items-center justify-between">
                  <span className="text-indigo-800 font-bold uppercase tracking-wider">Total Amount</span>
                  <span className="text-2xl font-black text-indigo-900">₹{selectedOrder.totalAmount?.toLocaleString()}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
