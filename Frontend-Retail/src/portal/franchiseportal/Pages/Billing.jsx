import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFranchise } from '../context/FranchiseContext';
import { Search, Plus, Minus, Trash2, Printer, CheckCircle2, User, Phone, MapPin } from 'lucide-react';

export default function Billing() {
  const { inventory, processSale } = useFranchise();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({ name: '', phone: '', email: '' });
  const [generatedInvoice, setGeneratedInvoice] = useState(null);

  // Available inventory items (filtering out things with 0 stock)
  const availableItems = inventory.filter(item => 
    item.availableStock > 0 && 
    (item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     item.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        if (existing.quantity >= item.availableStock) return prev; // Cannot exceed stock
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        // Check bounds
        const inventoryItem = inventory.find(i => i.id === id);
        if (newQty > inventoryItem.availableStock) return item;
        if (newQty < 1) return item;
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.sellingPrice * item.quantity), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return alert("Cart is empty");
    if (!customer.name || !customer.phone) return alert("Please fill in Customer Name and Phone");

    // Process the sale through context (This deducts inventory automatically)
    const invoice = processSale(cart, customer, cartTotal);
    setGeneratedInvoice(invoice);
    
    // Clear cart
    setCart([]);
    setCustomer({ name: '', phone: '', email: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Point of Sale</h1>
          <p className="text-slate-500">Generate invoice and automatically update inventory.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[75vh]">
        
        {/* Left Side: Product Selection */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search products by SKU or Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableItems.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => addToCart(item)}
                  className="p-4 border border-slate-100 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/30 transition-all cursor-pointer flex justify-between items-center group"
                >
                  <div>
                    <h3 className="font-bold text-slate-800 group-hover:text-indigo-700">{item.name}</h3>
                    <p className="text-xs text-slate-500 font-mono mb-2">{item.sku}</p>
                    <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                      Stock: {item.availableStock}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-indigo-600 text-lg">₹{item.sellingPrice.toLocaleString()}</p>
                    <div className="mt-2 w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors ml-auto">
                      <Plus size={16} />
                    </div>
                  </div>
                </div>
              ))}
              {availableItems.length === 0 && (
                <div className="col-span-2 text-center text-slate-400 py-12">
                  No products found or out of stock.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Cart & Checkout */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-indigo-600 text-white">
            <h2 className="text-lg font-bold">Current Order</h2>
            <p className="text-indigo-200 text-sm">{cart.length} items</p>
          </div>
          
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-70">
                <Printer size={48} className="mb-4" />
                <p>Cart is empty</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex justify-between items-center pb-4 border-b border-slate-100 last:border-0">
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{item.name}</h4>
                    <p className="text-indigo-600 font-medium text-sm">₹{item.sellingPrice.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
                      <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-1 text-slate-500 hover:bg-slate-200"><Minus size={14} /></button>
                      <span className="px-2 text-sm font-bold text-slate-700 w-8 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-1 text-slate-500 hover:bg-slate-200"><Plus size={14} /></button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 p-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Customer & Checkout */}
          <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-4">
            <div className="space-y-3">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input type="text" placeholder="Customer Name" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input type="text" placeholder="Phone Number" value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
              </div>
            </div>
            
            <div className="flex justify-between items-end pt-4 border-t border-slate-200">
              <span className="text-slate-500 font-medium">Total</span>
              <span className="text-2xl font-bold text-indigo-700">₹{cartTotal.toLocaleString()}</span>
            </div>
            
            <button 
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none"
            >
              Generate Invoice
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

              {/* Invoice Printable Area */}
              <div className="p-8 flex-1 overflow-y-auto bg-white" id="invoice-print-area">
                <div className="text-center mb-8 border-b border-slate-100 pb-6">
                  <h2 className="text-2xl font-bold text-slate-800">Techhansa Retail</h2>
                  <p className="text-slate-500 text-sm">Downtown Store</p>
                  <p className="text-slate-400 text-xs mt-2">Invoice: {generatedInvoice.id}</p>
                  <p className="text-slate-400 text-xs">{generatedInvoice.date}</p>
                </div>
                
                <div className="mb-6">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Billed To:</p>
                  <p className="font-bold text-slate-800">{generatedInvoice.customer.name}</p>
                  <p className="text-sm text-slate-500">Phone: {generatedInvoice.customer.phone}</p>
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
                    {generatedInvoice.items.map(item => (
                      <tr key={item.id}>
                        <td className="py-3 text-slate-800 font-medium">
                          {item.name}
                          <div className="text-xs text-slate-400 font-mono">{item.sku}</div>
                        </td>
                        <td className="py-3 text-center text-slate-600">{item.quantity}</td>
                        <td className="py-3 text-right text-slate-600">₹{item.sellingPrice.toLocaleString()}</td>
                        <td className="py-3 text-right text-slate-800 font-bold">₹{(item.sellingPrice * item.quantity).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex justify-between items-center pt-4 border-t-2 border-slate-800">
                  <span className="font-bold text-slate-800">Total Amount</span>
                  <span className="text-2xl font-black text-indigo-600">₹{generatedInvoice.total.toLocaleString()}</span>
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

    </div>
  );
}
