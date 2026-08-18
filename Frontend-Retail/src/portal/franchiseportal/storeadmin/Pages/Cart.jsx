import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFranchise } from '../context/FranchiseContext';
import { Minus, Plus, Trash2, Printer, CheckCircle2, User, Phone, ArrowLeft, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const { globalCart, updateGlobalCartQuantity, removeGlobalCartItem, clearGlobalCart, processSale, storeProfileData } = useFranchise();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({ name: '', phone: '', email: '' });
  const [generatedInvoice, setGeneratedInvoice] = useState(null);
  
  const [showSerialModal, setShowSerialModal] = useState(false);
  const [serialNumbers, setSerialNumbers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cartTotal = globalCart.reduce((acc, item) => acc + (item.sellingPrice * item.quantity), 0);

  const handleInitiateCheckout = () => {
    if (globalCart.length === 0) return alert("Cart is empty");
    if (!customer.name || !customer.phone) return alert("Please fill in Customer Name and Phone");
    
    const initialSerials = {};
    globalCart.forEach(item => {
      initialSerials[item._id || item.id] = Array(item.quantity).fill('');
    });
    setSerialNumbers(initialSerials);
    setShowSerialModal(true);
  };

  const handleSerialChange = (itemId, index, value) => {
    setSerialNumbers(prev => {
      const updated = [...(prev[itemId] || [])];
      updated[index] = value;
      return { ...prev, [itemId]: updated };
    });
  };

  const handleCheckout = async () => {
    setIsSubmitting(true);
    const cartWithSerials = globalCart.map(item => {
      const itemId = item._id || item.id;
      return {
        ...item,
        serialNumbers: (serialNumbers[itemId] || []).filter(sn => sn.trim() !== '')
      };
    });

    const invoice = await processSale(cartWithSerials, customer, cartTotal);
    setIsSubmitting(false);
    
    if (invoice) {
      setShowSerialModal(false);
      setGeneratedInvoice(invoice);
      clearGlobalCart();
      setCustomer({ name: '', phone: '', email: '' });
    } else {
      alert("Checkout failed. Please check stock availability and try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/franchise/billing')}
          className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Cart & Checkout</h1>
          <p className="text-slate-500">Review your selected items and generate an invoice.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[75vh]">
        {/* Left Side: Cart Items */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-indigo-50/50 flex justify-between items-center">
            <div className="flex items-center gap-3 text-indigo-800">
              <ShoppingCart size={24} />
              <h2 className="text-xl font-bold">Shopping Cart</h2>
            </div>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold">
              {globalCart.length} Items
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
            {globalCart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-70">
                <ShoppingCart size={64} className="mb-4 text-slate-300" />
                <p className="text-lg font-medium">Your cart is empty</p>
                <p className="text-sm mt-2">Go back and add some products.</p>
              </div>
            ) : (
              globalCart.map(item => (
                <div key={item._id || item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm gap-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 text-lg">{item.name}</h4>

                    <p className="text-indigo-600 font-bold mt-1">₹{item.sellingPrice.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden shadow-inner">
                      <button onClick={() => updateGlobalCartQuantity(item._id || item.id, -1)} className="p-3 text-slate-500 hover:bg-slate-200 transition-colors"><Minus size={16} /></button>
                      <span className="px-4 text-lg font-bold text-slate-700 w-12 text-center">{item.quantity}</span>
                      <button onClick={() => updateGlobalCartQuantity(item._id || item.id, 1)} className="p-3 text-slate-500 hover:bg-slate-200 transition-colors"><Plus size={16} /></button>
                    </div>
                    <div className="text-right w-24">
                       <p className="text-xs text-slate-400 font-medium">Subtotal</p>
                       <p className="font-bold text-slate-800 text-lg">₹{(item.sellingPrice * item.quantity).toLocaleString()}</p>
                    </div>
                    <button onClick={() => removeGlobalCartItem(item._id || item.id)} className="text-red-400 hover:text-red-600 p-2 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Customer & Checkout */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden h-fit sticky top-6">
          <div className="p-6 border-b border-slate-100 bg-slate-50">
            <h2 className="text-lg font-bold text-slate-800">Customer Details</h2>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" placeholder="Customer Name" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow" />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" placeholder="Phone Number" value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow" />
              </div>
            </div>
          </div>
            
          <div className="p-6 bg-slate-50 border-t border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-500 font-medium text-lg">Total Amount</span>
              <span className="text-3xl font-black text-indigo-700">₹{cartTotal.toLocaleString()}</span>
            </div>
            
            <button 
              onClick={handleInitiateCheckout}
              disabled={globalCart.length === 0 || isSubmitting}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={24} />
              Confirm & Invoice
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      <AnimatePresence>
        {generatedInvoice && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-emerald-50">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-emerald-900">Sale Processed Successfully!</h3>
                    <p className="text-emerald-700 text-sm">Inventory has been automatically updated.</p>
                  </div>
                </div>
                <button onClick={() => setGeneratedInvoice(null)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>

              <div className="p-8 flex-1 overflow-y-auto bg-white" id="invoice-print-area">
                <div className="text-center mb-8 border-b border-slate-100 pb-6">
                  <h2 className="text-2xl font-bold text-slate-800">Techhansa Retail</h2>
                  <p className="text-slate-500 text-sm">{storeProfileData?.storeName || 'Store'}</p>
                  <p className="text-slate-400 text-xs mt-2">Invoice: {generatedInvoice.invoiceNumber}</p>
                  <p className="text-slate-400 text-xs">{new Date(generatedInvoice.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                </div>
                
                <div className="mb-6">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Billed To:</p>
                  <p className="font-bold text-slate-800">{generatedInvoice.customerName}</p>
                  <p className="text-sm text-slate-500">Phone: {generatedInvoice.customerPhone}</p>
                </div>

                <table className="w-full text-sm mb-8">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-slate-500">
                      <th className="pb-2 font-medium">Item</th>
                      <th className="pb-2 font-medium text-center">Qty</th>
                      <th className="pb-2 font-medium text-right">Price</th>
                      <th className="pb-2 font-medium text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {generatedInvoice.items.map((item, idx) => (
                      <tr key={item.productId || idx}>
                        <td className="py-3 text-slate-800 font-medium">
                          {item.name}
                          {item.serialNumbers && item.serialNumbers.length > 0 && (
                            <div className="text-xs text-slate-500 mt-1 font-mono">
                              SN: {item.serialNumbers.join(', ')}
                            </div>
                          )}
                        </td>
                        <td className="py-3 text-center text-slate-600">{item.quantity}</td>
                        <td className="py-3 text-right text-slate-600">₹{item.sellingPrice.toLocaleString()}</td>
                        <td className="py-3 text-right text-slate-800 font-bold">₹{(item.sellingPrice * item.quantity).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="space-y-2 pt-4 border-t-2 border-slate-800">
                  <div className="flex justify-between items-center text-sm text-slate-500">
                    <span>Subtotal</span>
                    <span>₹{generatedInvoice.subtotalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-slate-500">
                    <span>Tax (GST 18%)</span>
                    <span>₹{(generatedInvoice.amount - generatedInvoice.subtotalAmount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                    <span className="font-bold text-slate-800">Grand Total</span>
                    <span className="text-2xl font-black text-indigo-600">₹{generatedInvoice.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button onClick={() => setGeneratedInvoice(null)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-xl transition-colors">Close</button>
                <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">
                  <Printer size={18} /> Print Invoice
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Serial Number Modal */}
      <AnimatePresence>
        {showSerialModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h2 className="text-xl font-bold text-slate-800">Enter Serial Numbers</h2>
                <button onClick={() => setShowSerialModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto space-y-6">
                <p className="text-sm text-slate-500 mb-2">Scan or type the serial number/MAC address for each item. You can leave it blank for non-electronic items.</p>
                {globalCart.map(item => {
                  const itemId = item._id || item.id;
                  return (
                    <div key={itemId} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <h4 className="font-bold text-slate-800 mb-3">{item.name} <span className="text-xs text-indigo-600 ml-2 font-mono">Qty: {item.quantity}</span></h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {Array.from({ length: item.quantity }).map((_, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400 w-6">#{idx + 1}</span>
                            <input 
                              type="text" 
                              placeholder="Serial Number..."
                              value={serialNumbers[itemId]?.[idx] || ''}
                              onChange={(e) => handleSerialChange(itemId, idx, e.target.value)}
                              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button onClick={() => setShowSerialModal(false)} className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                  Back to Cart
                </button>
                <button 
                  onClick={handleCheckout} 
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing...' : 'Complete Checkout'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
