import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useFranchise } from '../context/FranchiseContext';
import { Search, Filter, AlertTriangle } from 'lucide-react';

export default function Inventory() {
  const { inventory } = useFranchise();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const categories = ['All', ...new Set(inventory.map(i => i.category))];

  const filteredData = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const isLowStock = item.availableStock <= item.lowStockAlert;
    const matchesStatus = statusFilter === 'All' || 
                          (statusFilter === 'Low Stock' && isLowStock) || 
                          (statusFilter === 'In Stock' && !isLowStock);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Inventory Management</h1>
          <p className="text-slate-500">View and track your current stock levels. (Read Only)</p>
        </div>
        <div className="flex w-full md:w-auto gap-3">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search SN, Name, Category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64 shadow-sm"
            />
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Filter size={16} />
              Filter
            </button>
            
            {showFilters && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 shadow-xl rounded-xl p-4 z-10">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Category</label>
                    <select 
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Status</label>
                    <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="All">All</option>
                      <option value="In Stock">In Stock</option>
                      <option value="Low Stock">Low Stock</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
      >
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Hardware Category</th>
                <th className="px-6 py-4 font-medium">Brand & Model</th>
                <th className="px-6 py-4 font-medium">SN / MAC Address</th>
                <th className="px-6 py-4 font-medium text-right">B2B Purchase Price</th>
                <th className="px-6 py-4 font-medium text-right">MRP</th>
                <th className="px-6 py-4 font-medium text-right">Store Selling Price</th>
                <th className="px-6 py-4 font-medium text-center">Available Qty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((item) => {
                const isLowStock = item.availableStock <= item.lowStockAlert;
                
                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{item.brand}</div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">{item.model}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-slate-700">
                      {item.serialNumber || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-700">
                      ₹{item.buyingPrice.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-500 line-through">
                      ₹{item.mrp?.toLocaleString() || (item.sellingPrice * 1.2).toFixed(0)}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-indigo-600">
                      ₹{item.sellingPrice.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className={`font-bold text-lg ${isLowStock ? 'text-red-500' : 'text-slate-700'}`}>
                          {item.availableStock}
                        </span>
                        {isLowStock && (
                          <span className="text-[10px] font-bold text-red-500 uppercase mt-1">Low Stock</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                    No products found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredData.map((item) => {
            const isLowStock = item.availableStock <= item.lowStockAlert;
            return (
              <div key={item.id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-slate-800 text-lg">{item.name}</div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">{item.sku}</div>
                  </div>
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
                    {item.category}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-xl p-3">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Buying Price</p>
                    <p className="font-semibold text-slate-700">₹{item.buyingPrice.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Selling Price</p>
                    <p className="font-bold text-indigo-600">₹{item.sellingPrice.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <div className="flex gap-4">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Available</p>
                      <p className={`font-black text-xl ${isLowStock ? 'text-red-500' : 'text-slate-800'}`}>
                        {item.availableStock}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Reserved</p>
                      <p className="font-bold text-slate-500 text-xl">{item.reservedStock}</p>
                    </div>
                  </div>
                  
                  <div>
                    {isLowStock ? (
                      <div className="flex items-center justify-center gap-1 text-red-500 text-xs font-bold bg-red-50 py-1.5 px-3 rounded-lg">
                        <AlertTriangle size={14} /> Low Stock
                      </div>
                    ) : (
                      <div className="text-emerald-500 text-xs font-bold bg-emerald-50 py-1.5 px-3 rounded-lg inline-block">
                        In Stock
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {filteredData.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              No products found matching your search.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
