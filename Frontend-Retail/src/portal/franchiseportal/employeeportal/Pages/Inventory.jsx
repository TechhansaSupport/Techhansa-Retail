import React, { useState, useEffect, useContext } from 'react';
import { Search, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEmployee } from '../context/EmployeeContext';

export default function EmployeeInventory() {
  const { inventory = [] } = useEmployee();
  const [searchQuery, setSearchQuery] = useState('');

  const searchLower = searchQuery.toLowerCase();
  const filteredInventory = inventory.filter(item => 
    item.name?.toLowerCase().includes(searchLower) ||
    item.category?.toLowerCase().includes(searchLower) ||
    item.serialNumber?.toLowerCase().includes(searchLower) ||
    item.specs?.toLowerCase().includes(searchLower) ||
    item.brand?.toLowerCase().includes(searchLower) ||
    item.model?.toLowerCase().includes(searchLower)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Store Inventory</h1>
          <p className="text-slate-500">View real-time stock availability and pricing for customers.</p>
        </div>
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm"
            placeholder="Search Name, Category, Specs, Brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-xl flex items-start gap-3">
        <Info size={20} className="shrink-0 mt-0.5" />
        <div className="text-sm">
          <strong>Note:</strong> This is a view-only list. You cannot add or edit inventory items. Contact the Store Admin for any discrepancies. B2B purchase prices are hidden as per store policy.
        </div>
      </div>

      {/* Inventory Table */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Hardware Category</th>
                <th className="px-6 py-4 font-medium">Brand & Model</th>
                <th className="px-6 py-4 font-medium">Specifications</th>
                <th className="px-6 py-4 font-medium text-right">Selling Price</th>
                <th className="px-6 py-4 font-medium text-center">Available Qty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInventory.length > 0 ? (
                filteredInventory.map((item) => (
                  <tr key={item._id || item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{item.brand || item.name}</div>
                      {item.model && <div className="text-xs text-slate-500 font-mono mt-0.5">{item.model}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-600 leading-relaxed max-w-xs block truncate" title={item.specs}>
                        {item.specs || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-indigo-600">
                      ₹{item.sellingPrice?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.availableStock > item.lowStockAlert ? 'bg-green-100 text-green-700' : item.availableStock > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                        {item.availableStock} in stock
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    No products found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
