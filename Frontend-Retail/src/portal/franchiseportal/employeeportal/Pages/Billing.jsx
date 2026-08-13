import React, { useState, useEffect, useContext } from 'react';
import { Search, User, Phone, Mail, ShoppingCart, Plus, Minus, Trash2, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../../../context/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useEmployee } from '../context/EmployeeContext';

export default function EmployeeBilling() {
  const { user } = useContext(AuthContext);
  const { inventory, globalCart, addToGlobalCart } = useEmployee();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const availableItems = inventory.filter(item => 
    item.availableStock > 0 && 
    (item.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
     item.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
     item.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
     item.serialNumber?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-24 relative min-h-screen">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Point of Sale</h1>
          <p className="text-slate-500">Select products to add to cart.</p>
        </div>
      </div>

      {/* Product Selection */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden h-[75vh]">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search products by SKU or Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {availableItems.map(item => {
              const inCartItem = globalCart.find(c => (c._id || c.id) === (item._id || item.id));
              const remainingStock = item.availableStock - (inCartItem ? inCartItem.quantity : 0);

              return (
                <div 
                  key={item._id || item.id} 
                  onClick={() => remainingStock > 0 && addToGlobalCart(item)}
                  className={`p-5 border rounded-2xl transition-all flex flex-col group ${
                    remainingStock > 0 
                    ? 'border-slate-100 hover:border-indigo-300 hover:bg-indigo-50/30 cursor-pointer hover:shadow-md'
                    : 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 group-hover:text-indigo-700 leading-tight mb-1">{item.name}</h3>
                    <p className="text-xs text-slate-500 font-mono mb-3">{item.sku}</p>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-md ${
                      remainingStock > 0 ? 'bg-indigo-50 text-indigo-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {remainingStock > 0 ? `Stock: ${remainingStock}` : 'Out of Stock'}
                    </span>
                  </div>
                  <div className="flex justify-between items-end mt-4 pt-4 border-t border-slate-100">
                    <p className="font-black text-indigo-600 text-lg">₹{item.sellingPrice.toLocaleString()}</p>
                    {remainingStock > 0 && (
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Plus size={18} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {availableItems.length === 0 && (
              <div className="col-span-full text-center text-slate-400 py-12">
                No products found or out of stock.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Cart Button */}
      <AnimatePresence>
        {globalCart.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-50 md:ml-32 w-[90%] md:w-auto" // Center on mobile, offset on desktop
          >
            <button 
              onClick={() => navigate('/employee/cart')}
              className="flex w-full md:w-auto items-center justify-between md:justify-center gap-2 md:gap-4 bg-indigo-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-full shadow-2xl hover:bg-indigo-700 hover:shadow-indigo-500/30 transition-all hover:-translate-y-1"
            >
              <div className="flex items-center gap-2 md:gap-4">
                <div className="relative">
                  <ShoppingCart size={24} />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-indigo-600">
                    {globalCart.length}
                  </span>
                </div>
                <span className="font-bold text-base md:text-lg hidden xs:inline">View Cart</span>
              </div>
              <div className="flex items-center gap-2 md:gap-4">
                <div className="w-px h-6 bg-indigo-400/50 mx-1 hidden md:block"></div>
                <span className="font-black text-lg md:text-xl">
                ₹{globalCart.reduce((a, b) => a + (b.sellingPrice * b.quantity), 0).toLocaleString()}
              </span>
              <ArrowRight size={20} className="ml-2" />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
