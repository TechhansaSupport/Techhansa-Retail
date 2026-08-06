import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PackagePlus, ChevronRight, Truck, Plus, Minus, Trash2 } from 'lucide-react';
import { useFranchise } from '../context/FranchiseContext';
import { useNavigate } from 'react-router-dom';

export default function Orders() {
  const { orders, inventory, requestNewStock } = useFranchise();
  const navigate = useNavigate();
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestCart, setRequestCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');

  const addToRequest = () => {
    if (!selectedProduct) return;
    const product = inventory.find(i => i.id === Number(selectedProduct));
    if (!product) return;
    
    setRequestCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateRequestQty = (id, delta) => {
    setRequestCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty < 1 ? item : { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromRequest = (id) => {
    setRequestCart(prev => prev.filter(item => item.id !== id));
  };

  const submitRequest = () => {
    if (requestCart.length === 0) return;
    const total = requestCart.reduce((acc, item) => acc + (item.buyingPrice * item.quantity), 0);
    requestNewStock(requestCart, total);
    setIsRequesting(false);
    setRequestCart([]);
    setSelectedProduct('');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Dispatched': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Approved': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Order Management</h1>
          <p className="text-slate-500">View your incoming stock and request new inventory.</p>
        </div>
        <button 
          onClick={() => setIsRequesting(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
        >
          <PackagePlus size={18} />
          Request New Stock
        </button>
      </div>

      {/* Full Width Orders List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Date Placed</th>
                <th className="px-6 py-4 font-semibold">Items</th>
                <th className="px-6 py-4 font-semibold">Total Value</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800">{order.id}</td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{order.date}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{order.items} items</td>
                  <td className="px-6 py-4 font-bold text-slate-700">₹{order.total.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full border font-medium inline-block ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => navigate('/franchise/tracking', { state: { orderId: order.id } })}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-100 transition-colors"
                      title="Track Delivery"
                    >
                      <Truck size={16} />
                      Track
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Functional Modal for Requesting Stock */}
      <AnimatePresence>
        {isRequesting && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-800">Request New Stock</h3>
                <button onClick={() => setIsRequesting(false)} className="text-slate-400 hover:text-slate-600">
                  ✕
                </button>
              </div>
              
              <div className="p-6 flex-1 overflow-y-auto bg-slate-50">
                <div className="flex gap-3 mb-6">
                  <select 
                    className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={selectedProduct}
                    onChange={e => setSelectedProduct(e.target.value)}
                  >
                    <option value="">Select a product...</option>
                    {inventory.map(item => (
                      <option key={item.id} value={item.id}>{item.name} - ₹{item.buyingPrice.toLocaleString()}</option>
                    ))}
                  </select>
                  <button onClick={addToRequest} className="px-4 py-2 bg-indigo-100 text-indigo-700 font-bold rounded-xl hover:bg-indigo-200">
                    Add
                  </button>
                </div>

                <div className="space-y-3">
                  {requestCart.length === 0 ? (
                     <div className="text-center text-slate-400 py-8">No items added to request.</div>
                  ) : (
                    requestCart.map(item => (
                      <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm">
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                          <p className="text-xs text-slate-500">Buying Price: ₹{item.buyingPrice.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
                            <button onClick={() => updateRequestQty(item.id, -1)} className="px-2 py-1 text-slate-500 hover:bg-slate-200"><Minus size={14} /></button>
                            <span className="px-3 text-sm font-bold text-slate-700">{item.quantity}</span>
                            <button onClick={() => updateRequestQty(item.id, 1)} className="px-2 py-1 text-slate-500 hover:bg-slate-200"><Plus size={14} /></button>
                          </div>
                          <p className="font-bold text-slate-700 w-24 text-right">₹{(item.buyingPrice * item.quantity).toLocaleString()}</p>
                          <button onClick={() => removeFromRequest(item.id)} className="text-red-400 hover:text-red-600">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="p-4 bg-white border-t border-slate-100 flex justify-between items-center">
                <div className="text-slate-500 font-medium">
                  Total: <span className="text-xl font-bold text-indigo-700">₹{requestCart.reduce((a, b) => a + (b.buyingPrice * b.quantity), 0).toLocaleString()}</span>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setIsRequesting(false)} className="px-5 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                  <button 
                    onClick={submitRequest}
                    disabled={requestCart.length === 0}
                    className="px-5 py-2 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200 disabled:opacity-50 disabled:shadow-none"
                  >
                    Submit Request
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
