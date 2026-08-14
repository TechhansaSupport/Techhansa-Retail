import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios';
import { motion } from 'framer-motion';
import { Search, Filter, AlertTriangle, Edit2, Plus, X, Trash2, PackageSearch } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CentralCatalog() {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const initialFormState = {
    category: '',
    brand: '',
    model: '',
    name: '',

    serialNumber: '',
    buyingPrice: '',
    mrp: '',
    sellingPrice: '',
    availableStock: '',
    lowStockAlert: '',
    reservedStock: '0'
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchCatalog();
  }, []);

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/admin/catalog`);
      setCatalog(response.data);
    } catch (error) {
      toast.error('Failed to fetch catalog');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(catalog.map(i => i.category).filter(Boolean))];

  const filteredData = catalog.filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const isLowStock = item.availableStock <= item.lowStockAlert;
    const matchesStatus = statusFilter === 'All' || 
                          (statusFilter === 'Low Stock' && isLowStock) || 
                          (statusFilter === 'In Stock' && !isLowStock);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData(initialFormState);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'brand' || name === 'model') {
       const newBrand = name === 'brand' ? value : formData.brand;
       const newModel = name === 'model' ? value : formData.model;
       setFormData(prev => ({ ...prev, [name]: value, name: `${newBrand} ${newModel}`.trim() }));
    } else {
       setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const processedData = {
      ...formData,
      buyingPrice: Number(formData.buyingPrice),
      mrp: Number(formData.mrp),
      sellingPrice: Number(formData.sellingPrice),
      availableStock: Number(formData.availableStock),
      quantity: Number(formData.availableStock), // keep in sync
      lowStockAlert: Number(formData.lowStockAlert),
      reservedStock: Number(formData.reservedStock) || 0
    };

    try {
      if (editingItem) {
        await axios.put(`/api/admin/catalog/${editingItem._id}`, processedData);
        toast.success("Product updated successfully!");
      } else {
        await axios.post(`/api/admin/catalog`, processedData);
        toast.success("New product added successfully!");
      }
      handleCloseModal();
      fetchCatalog();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving product');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this global product?')) {
      try {
        await axios.delete(`/api/admin/catalog/${id}`);
        toast.success('Product deleted');
        fetchCatalog();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <PackageSearch className="mr-2 text-indigo-500" size={28} />
            Central Catalog
          </h2>
          <p className="text-slate-500 mt-1">Manage global hardware marketplace and dynamic B2B pricing.</p>
        </div>
        <div className="flex flex-wrap w-full md:w-auto gap-3 items-center">
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
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus size={16} />
            Add Product
          </button>
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
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Brand & Model</th>
                <th className="px-6 py-4 font-medium text-right">Base Purchase Price</th>
                <th className="px-6 py-4 font-medium text-right">Store Selling Price</th>
                <th className="px-6 py-4 font-medium text-center">Available Qty</th>
                <th className="px-6 py-4 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredData.map((item) => {
                const isLowStock = item.availableStock <= item.lowStockAlert;
                
                return (
                  <tr key={item._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                        {item.category || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{item.brand || 'N/A'}</div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">{item.model || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-700">
                      ₹{item.buyingPrice?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-indigo-600">
                      ₹{item.sellingPrice?.toLocaleString() || 0}
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
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button 
                          onClick={() => handleOpenModal(item)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Update Product"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              
              {!loading && filteredData.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    No products found in Central Catalog.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-slate-100">
          {!loading && filteredData.map((item) => {
            const isLowStock = item.availableStock <= item.lowStockAlert;
            return (
              <div key={item._id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-slate-800 text-lg">{item.name}</div>
                  </div>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => handleOpenModal(item)}
                      className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={() => handleDelete(item._id)}
                      className="p-1.5 bg-red-50 text-red-600 rounded-lg"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-xl p-3">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Buying Price</p>
                    <p className="font-semibold text-slate-700">₹{item.buyingPrice?.toLocaleString() || 0}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Selling Price</p>
                    <p className="font-bold text-indigo-600">₹{item.sellingPrice?.toLocaleString() || 0}</p>
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
          {!loading && filteredData.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              No products found matching your search.
            </div>
          )}
        </div>
      </motion.div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl my-8 relative flex flex-col max-h-full">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 flex-shrink-0">
              <h2 className="text-xl font-bold text-slate-800">
                {editingItem ? 'Update Global Product' : 'Add New Global Product'}
              </h2>
              <button onClick={handleCloseModal} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <form id="catalog-form" onSubmit={handleSubmit} className="space-y-6">
                
                {/* Product Identification */}
                <div className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-100">
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Product Info</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Category *</label>
                      <input type="text" name="category" value={formData.category} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="e.g. Laptops" />
                    </div>
                    <div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Brand *</label>
                      <input type="text" name="brand" value={formData.brand} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="e.g. Dell" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Model *</label>
                      <input type="text" name="model" value={formData.model} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="e.g. XPS 13" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Full Product Name</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="e.g. Dell XPS 13" />
                    </div>
                  </div>
                </div>

                {/* Pricing & Stock */}
                <div className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-100">
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Pricing & Quantities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Buying Price (₹) *</label>
                      <input type="number" name="buyingPrice" value={formData.buyingPrice} onChange={handleChange} required min="0" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">MRP (₹) *</label>
                      <input type="number" name="mrp" value={formData.mrp} onChange={handleChange} required min="0" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Selling Price (₹) *</label>
                      <input type="number" name="sellingPrice" value={formData.sellingPrice} onChange={handleChange} required min="0" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Available Stock *</label>
                      <input type="number" name="availableStock" value={formData.availableStock} onChange={handleChange} required min="0" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Low Stock Alert Threshold *</label>
                      <input type="number" name="lowStockAlert" value={formData.lowStockAlert} onChange={handleChange} required min="0" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                    </div>
                  </div>
                </div>

              </form>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 flex-shrink-0 bg-white rounded-b-2xl">
              <button type="button" onClick={handleCloseModal} className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                Cancel
              </button>
              <button type="submit" form="catalog-form" className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm">
                {editingItem ? 'Save Changes' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
