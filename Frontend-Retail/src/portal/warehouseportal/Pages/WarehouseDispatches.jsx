import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios';
import { motion } from 'framer-motion';
import { PackageSearch, Truck, X, Calendar, Eye, Package } from 'lucide-react';
import toast from 'react-hot-toast';

export default function WarehouseDispatches() {
  const [dispatchOrders, setDispatchOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  // View Order Modal State
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Dispatch Modal State
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [dispatchingOrder, setDispatchingOrder] = useState(null);
  const [selectedSerials, setSelectedSerials] = useState({});
  const [scannedSerialsText, setScannedSerialsText] = useState({});
  const [courierName, setCourierName] = useState('');
  const [trackingId, setTrackingId] = useState('');
  const [expectedDate, setExpectedDate] = useState('');

  useEffect(() => {
    fetchOrdersAndInventory();
  }, []);

  const fetchOrdersAndInventory = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      const [ordersRes, invRes] = await Promise.all([
        axios.get('/api/admin/orders', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/warehouse/inventory', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      const pendingDispatches = ordersRes.data.filter(o => 
        ['Sent to Warehouse', 'SENT_TO_WAREHOUSE', 'Dispatched', 'DISPATCHED'].includes(o.status)
      );
      setDispatchOrders(pendingDispatches);
      setInventory(invRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load dispatches and inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleSendTracking = async (order) => {
    try {
      const token = sessionStorage.getItem('token');
      await axios.post(`/api/admin/orders/${order._id}/tracking-email`, {
        orderType: order.orderType
      }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Tracking details sent to customer successfully!');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || 'Failed to send tracking details');
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleOpenDispatchModal = (order) => {
    setDispatchingOrder(order);
    setSelectedSerials({});
    setScannedSerialsText({});
    setCourierName('');
    setTrackingId('');
    setExpectedDate('');
    setIsDispatchModalOpen(true);
  };

  const toggleSerialSelection = (mappingKey, serial) => {
    setSelectedSerials(prev => {
      const current = prev[mappingKey] || [];
      if (current.includes(serial)) {
        return { ...prev, [mappingKey]: current.filter(s => s !== serial) };
      } else {
        return { ...prev, [mappingKey]: [...current, serial] };
      }
    });
  };

  const handleConfirmDispatch = async () => {
    // Validate quantities
    for (const item of dispatchingOrder.items || []) {
      const mappingKey = item.model || item.productName || item.hardwareType || item.otherType;
      const requiredQty = item.quantity;
      const assignedCount = (selectedSerials[mappingKey] || []).length;
      if (assignedCount !== requiredQty) {
        toast.error(`Please assign exactly ${requiredQty} serial numbers for ${mappingKey}`);
        return;
      }
    }

    try {
      const token = sessionStorage.getItem('token');
      const dispatchDetails = { courierName, trackingId, expectedDate };

      if (dispatchingOrder.orderType === 'Franchise Procurement') {
        await axios.patch(`/api/admin/procurement-requests/${dispatchingOrder._id}/status`, { 
          status: 'DISPATCHED',
          assignedSerialsMapping: selectedSerials,
          dispatchDetails
        }, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.patch(`/api/admin/orders/${dispatchingOrder._id}/status`, { 
          status: 'Dispatched',
          assignedSerialsMapping: selectedSerials,
          dispatchDetails
        }, { headers: { Authorization: `Bearer ${token}` } });
      }
      toast.success('Order dispatched successfully with serials!');
      setIsDispatchModalOpen(false);
      setDispatchingOrder(null);
      setSelectedSerials({});
      setScannedSerialsText({});
      fetchOrdersAndInventory();
    } catch (error) {
      console.error(error);
      toast.error('Failed to dispatch order');
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center">
          <Truck className="mr-2 text-indigo-500" size={28} />
          Pending Dispatches
        </h2>
        <p className="text-slate-500 mt-1">Scan serial numbers and dispatch approved orders.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Partner</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                  </td>
                </tr>
              ) : dispatchOrders.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                    No orders pending dispatch from Central Catalog.
                  </td>
                </tr>
              ) : dispatchOrders.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800 flex items-center gap-2">
                      <PackageSearch size={16} className="text-slate-400" />
                      {order.orderNumber}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-700">{order.userId || 'Unknown'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${order.orderType === 'Franchise Procurement' ? 'bg-indigo-50 text-indigo-700' : 'bg-blue-50 text-blue-700'}`}>
                      {order.orderType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => handleViewOrder(order)}
                        className="px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-2 font-medium text-sm"
                        title="View Order Details"
                      >
                        <Eye size={16} />
                        View
                      </button>
                      {!['Dispatched', 'DISPATCHED'].includes(order.status) ? (
                        <button 
                          onClick={() => handleOpenDispatchModal(order)}
                          className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2"
                        >
                          <Truck size={16} />
                          Scan & Dispatch
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleSendTracking(order)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                          Send Tracking
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* View Order Modal */}
      {isOrderModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsOrderModalOpen(false)}>
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
                  <h3 className="text-xl font-bold text-slate-900">Order Details</h3>
                  <p className="text-sm text-slate-500 mt-1">Review the order items before dispatching.</p>
                </div>
              </div>
              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors border border-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div>
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Requested Items</h3>
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <th className="px-4 py-3">Item</th>
                        <th className="px-4 py-3">Configuration</th>
                        <th className="px-4 py-3 text-center">Qty</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(selectedOrder.items || []).map((item, idx) => (
                        <React.Fragment key={idx}>
                        <tr className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-bold text-slate-800">{item.productName || item.hardwareType || item.otherType}</div>
                            <div className="text-xs text-slate-500">{item.brand} {item.model ? `- ${item.model}` : ''}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-xs text-slate-600 whitespace-pre-wrap">
                              {(() => {
                                const config = item.configuration || item.specs;
                                if (!config) return 'Standard Configuration';
                                if (typeof config === 'object') {
                                  return Object.entries(config).map(([k, v]) => `${k}: ${v}`).join('\n');
                                }
                                if (typeof config === 'string') {
                                  try {
                                    const parsed = JSON.parse(config);
                                    if (typeof parsed === 'object' && parsed !== null) {
                                      return Object.entries(parsed).map(([k, v]) => `${k}: ${v}`).join('\n');
                                    }
                                  } catch (e) {
                                    return config;
                                  }
                                  return config;
                                }
                                return 'Standard Configuration';
                              })()}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center font-bold text-slate-800">
                            {item.quantity}
                          </td>
                        </tr>
                      </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 flex-shrink-0 bg-slate-50/50">
              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setIsOrderModalOpen(false);
                  handleOpenDispatchModal(selectedOrder);
                }}
                className="px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2"
              >
                <Truck size={18} />
                Scan & Dispatch
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Dispatch Modal */}
      {isDispatchModalOpen && dispatchingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsDispatchModalOpen(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                  <PackageSearch size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Scan Serial Numbers</h3>
                  <p className="text-sm text-slate-500 mt-1">Assign serials to {dispatchingOrder.orderNumber} before dispatching.</p>
                </div>
              </div>
              <button
                onClick={() => setIsDispatchModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors border border-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* Dispatch Delivery Details Section */}
            <div className="p-6 border-b border-slate-100 bg-slate-50">
              <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Truck size={16} className="text-indigo-600" />
                Delivery Tracking Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Courier Partner *</label>
                  <input
                    type="text"
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    placeholder="e.g. BlueDart"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Tracking / Courier ID *</label>
                  <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="e.g. BD123456789"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Expected Delivery Date *</label>
                  <input
                    type="date"
                    value={expectedDate}
                    onChange={(e) => setExpectedDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {(dispatchingOrder.items || []).map((item, idx) => {
                const mappingKey = item.model || item.productName || item.hardwareType || item.otherType;
                const requiredQty = item.quantity;
                const currentCount = (selectedSerials[mappingKey] || []).length;
                const isComplete = currentCount === requiredQty;

                // Find matching product in inventory
                const product = inventory.find(p => {
                  const pName = (p.name || '').toLowerCase();
                  const pModel = (p.model || '').toLowerCase();
                  const iModel = (item.model || '').toLowerCase();
                  const mKey = (mappingKey || '').toLowerCase();
                  
                  if (iModel && pModel && pModel === iModel) return true;
                  if (mKey && pName && pName === mKey) return true;
                  if (mKey && pName && pName.includes(mKey)) return true;
                  if (mKey && pModel && pModel.includes(mKey)) return true;
                  
                  // fallback
                  const iName = (item.productName || item.hardwareType || item.otherType || '').toLowerCase();
                  if (iName && pName && pName.includes(iName)) return true;
                  
                  return false;
                });
                const availableSerials = product?.serialNumbers || [];

                return (
                  <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden p-5">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <div className="font-bold text-slate-800 text-lg">{mappingKey}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{item.brand}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold uppercase px-3 py-1.5 rounded-lg ${isComplete ? 'bg-emerald-100 text-emerald-700' : currentCount > requiredQty ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                          {currentCount} / {requiredQty} Selected
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-3">Select Serial Numbers from Inventory</label>
                      {availableSerials.length === 0 ? (
                        <div className="text-sm text-red-500 bg-red-50 p-3 rounded-xl border border-red-100">
                          No serial numbers available in inventory for this product.
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {availableSerials.map(sn => {
                            const isSelected = (selectedSerials[mappingKey] || []).includes(sn);
                            return (
                              <button
                                key={sn}
                                onClick={() => toggleSerialSelection(mappingKey, sn)}
                                disabled={!isSelected && isComplete}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                                  isSelected 
                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm hover:bg-indigo-700' 
                                    : !isSelected && isComplete
                                      ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                                      : 'bg-white border-slate-300 text-slate-700 hover:border-indigo-400 hover:bg-indigo-50'
                                }`}
                              >
                                {sn}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 flex-shrink-0 bg-slate-50/50">
              <button
                onClick={() => setIsDispatchModalOpen(false)}
                className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDispatch}
                disabled={(() => {
                  if (!courierName.trim() || !trackingId.trim() || !expectedDate) return true;
                  for (const item of dispatchingOrder.items || []) {
                    const mk = item.model || item.productName || item.hardwareType || item.otherType;
                    if ((selectedSerials[mk] || []).length !== item.quantity) return true;
                  }
                  return false;
                })()}
                className="px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Truck size={18} />
                Confirm Dispatch
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
