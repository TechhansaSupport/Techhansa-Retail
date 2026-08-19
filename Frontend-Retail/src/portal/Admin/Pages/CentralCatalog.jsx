import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios';
import { motion } from 'framer-motion';
import { Search, Filter, AlertTriangle, Edit2, Plus, X, Trash2, PackageSearch, Truck, Calendar, Eye, Package } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CentralCatalog() {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [activeTab, setActiveTab] = useState('catalog');
  const [dispatchOrders, setDispatchOrders] = useState([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // View Order Modal State
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const initialFormState = {
    category: '',
    brand: '',
    model: '',
    name: '',
    specs: '',
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
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/admin/orders');
      const processingOrders = response.data.filter(o => o.status === 'Processing');
      setDispatchOrders(processingOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/admin/catalog`);
      setCatalog(response.data);
    } catch (error) {
      console.error(error);
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
        console.error(error);
        toast.error('Failed to delete product');
      }
    }
  };

  const handleDispatch = async (orderId, orderType) => {
    try {
      if (orderType === 'Franchise Procurement') {
        await axios.patch(`/api/admin/procurement-requests/${orderId}/status`, { status: 'DISPATCHED' });
      } else {
        await axios.patch(`/api/admin/orders/${orderId}/status`, { status: 'Dispatched' });
      }
      toast.success('Order dispatched successfully!');
      fetchOrders();
      fetchCatalog(); // Refresh catalog to show deducted inventory
    } catch (error) {
      console.error(error);
      toast.error('Failed to dispatch order');
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
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

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`pb-3 font-semibold text-sm transition-colors relative ${activeTab === 'catalog' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Catalog Management
          {activeTab === 'catalog' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full"></div>}
        </button>
        <button
          onClick={() => setActiveTab('dispatch')}
          className={`pb-3 font-semibold text-sm transition-colors relative flex items-center ${activeTab === 'dispatch' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Pending Dispatches
          {dispatchOrders.length > 0 && (
            <span className="ml-2 inline-flex items-center justify-center bg-rose-500 text-white text-[10px] w-5 h-5 rounded-full font-bold">
              {dispatchOrders.length}
            </span>
          )}
          {activeTab === 'dispatch' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full"></div>}
        </button>
      </div>

      {activeTab === 'catalog' && (
        <>
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
                <th className="px-6 py-4 font-medium w-1/4">Specifications</th>
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
                    <td className="px-6 py-4">
                      <div className="text-xs text-slate-600 line-clamp-2" title={item.specs}>{item.specs || 'N/A'}</div>
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
                    {item.specs && (
                      <div className="text-xs text-slate-500 mt-1 line-clamp-2">{item.specs}</div>
                    )}
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
      </>
      )}

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
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Full Product Name *</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="e.g. Dell XPS 13" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Specifications</label>
                      <textarea name="specs" value={formData.specs} onChange={handleChange} rows="2" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="e.g. Intel Core i7, 16GB RAM, 512GB SSD"></textarea>
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

      {activeTab === 'dispatch' && (
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
                  <th className="px-6 py-4 font-medium text-right">Amount</th>
                  <th className="px-6 py-4 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dispatchOrders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                      No orders pending dispatch.
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
                    <td className="px-6 py-4 text-right font-bold text-slate-800">
                      ₹{order.totalAmount?.toLocaleString() || 0}
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
                        {order.status === 'Dispatched' ? (
                          <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-semibold flex items-center gap-2">
                            <Truck size={16} />
                            Dispatched
                          </span>
                        ) : (
                          <button 
                            onClick={() => handleDispatch(order._id, order.orderType)}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2"
                          >
                            <Truck size={16} />
                            Dispatch Order
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
      )}

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
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-bold text-slate-800">{item.productName || item.hardwareType || item.otherType}</div>
                            <div className="text-xs text-slate-500">{item.brand} {item.model ? `- ${item.model}` : ''}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-xs text-slate-600 whitespace-pre-wrap">
                              {typeof item.configuration === 'string' ? item.configuration : 
                               typeof item.specs === 'string' ? item.specs :
                               item.specs ? JSON.stringify(item.specs, null, 2) : 'Standard Configuration'}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center font-bold text-slate-800">
                            {item.quantity}
                          </td>
                        </tr>
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
              {selectedOrder.status !== 'Dispatched' && (
                <button
                  onClick={() => {
                    setIsOrderModalOpen(false);
                    handleDispatch(selectedOrder._id, selectedOrder.orderType);
                  }}
                  className="px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2"
                >
                  <Truck size={18} />
                  Dispatch Order
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
