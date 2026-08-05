import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PackagePlus, ChevronRight, CheckCircle2, Truck, PackageCheck, Clock, Plus, Minus, Trash2 } from 'lucide-react';
import { useFranchise } from '../context/FranchiseContext';

export default function Orders() {
  const { orders, inventory, requestNewStock } = useFranchise();
  const [selectedOrder, setSelectedOrder] = useState(null);
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

  const trackingSteps = [
    { name: 'Pending', icon: <Clock size={18}/> },
    { name: 'Approved', icon: <CheckCircle2 size={18}/> },
    { name: 'Packed', icon: <PackageCheck size={18}/> },
    { name: 'Dispatched', icon: <Truck size={18}/> },
    { name: 'Delivered', icon: <PackagePlus size={18}/> }
  ];

  const getStepStatus = (currentStatus, stepName) => {
    const statusIndex = trackingSteps.findIndex(s => s.name === currentStatus);
    const stepIndex = trackingSteps.findIndex(s => s.name === stepName);
    
    if (stepIndex < statusIndex) return 'completed';
    if (stepIndex === statusIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Order Management</h1>
          <p className="text-slate-500">Track incoming stock or request new inventory from Admin.</p>
        </div>
        <button 
          onClick={() => setIsRequesting(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
        >
          <PackagePlus size={18} />
          Request New Stock
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Orders List */}
        <div className="lg:col-span-1 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {orders.map((order, idx) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setSelectedOrder(order)}
              className={`cursor-pointer p-5 rounded-2xl border transition-all ${
                selectedOrder?.id === order.id 
                  ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                  : 'bg-white border-slate-100 hover:border-indigo-100 hover:shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-slate-800">{order.id}</h3>
                  <p className="text-xs text-slate-500">{order.date}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full border font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 font-medium">{order.items} Items</span>
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  ₹{order.total.toLocaleString()}
                  <ChevronRight size={16} className="text-slate-400" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Order Details & Tracking */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedOrder ? (
              <motion.div
                key={selectedOrder.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
              >
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Order {selectedOrder.id}</h2>
                    <p className="text-slate-500 text-sm">Expected Delivery: {selectedOrder.expectedDelivery}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Total Value</p>
                    <p className="text-2xl font-bold text-indigo-600">₹{selectedOrder.total.toLocaleString()}</p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="p-8">
                  <h3 className="font-semibold text-slate-800 mb-8">Tracking Status</h3>
                  
                  <div className="relative flex justify-between">
                    {/* Progress Bar Background */}
                    <div className="absolute top-5 left-6 right-6 h-1 bg-slate-100 rounded-full z-0"></div>
                    
                    {/* Active Progress Bar */}
                    <div 
                      className="absolute top-5 left-6 h-1 bg-indigo-500 rounded-full z-0 transition-all duration-1000"
                      style={{ 
                        width: `${(trackingSteps.findIndex(s => s.name === selectedOrder.status) / (trackingSteps.length - 1)) * 100}%` 
                      }}
                    ></div>

                    {trackingSteps.map((step, idx) => {
                      const state = getStepStatus(selectedOrder.status, step.name);
                      return (
                        <div key={step.name} className="relative z-10 flex flex-col items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                            state === 'completed' ? 'bg-indigo-500 border-indigo-500 text-white' :
                            state === 'current' ? 'bg-white border-indigo-500 text-indigo-600 shadow-[0_0_0_4px_rgba(99,102,241,0.2)]' :
                            'bg-white border-slate-200 text-slate-300'
                          }`}>
                            {step.icon}
                          </div>
                          <span className={`text-xs font-semibold ${
                            state === 'upcoming' ? 'text-slate-400' : 'text-slate-700'
                          }`}>
                            {step.name}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

              </motion.div>
            ) : (
              <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-300 h-full flex flex-col items-center justify-center text-slate-400 p-12">
                <PackageCheck size={48} className="mb-4 opacity-50" />
                <p className="font-medium text-lg text-slate-500">Select an order to view tracking details</p>
                <p className="text-sm mt-1">Or click "Request New Stock" to create a new order.</p>
              </div>
            )}
          </AnimatePresence>
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
