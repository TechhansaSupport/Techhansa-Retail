import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { PackageSearch, Plus, Pencil, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CentralCatalog() {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    itemName: '',
    serialNumber: '',
    model: '',
    specs: '',
    taxCode: '',
    basePurchasePrice: ''
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchCatalog();
  }, []);

  const fetchCatalog = async () => {
    try {
      const response = await axios.get(`/api/admin/catalog`);
      setCatalog(response.data);
    } catch (error) {
      toast.error('Failed to fetch catalog');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`/api/admin/catalog/${editId}`, formData);
        toast.success('Product updated successfully');
      } else {
        await axios.post(`/api/admin/catalog`, formData);
        toast.success('Product created successfully');
      }
      setIsModalOpen(false);
      setFormData({ itemName: '', serialNumber: '', model: '', specs: '', taxCode: '', basePurchasePrice: '' });
      setEditId(null);
      fetchCatalog();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving product');
    }
  };

  const handleEdit = (product) => {
    setFormData(product);
    setEditId(product._id);
    setIsModalOpen(true);
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
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <PackageSearch className="mr-2 text-indigo-500" size={28} />
            Central Catalog
          </h2>
          <p className="text-gray-500 mt-1">Manage global hardware marketplace and dynamic B2B pricing.</p>
        </div>
        
        <button
          onClick={() => {
            setFormData({ itemName: '', serialNumber: '', model: '', specs: '', taxCode: '', basePurchasePrice: '' });
            setEditId(null);
            setIsModalOpen(true);
          }}
          className="mt-4 md:mt-0 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all focus:ring-4 focus:ring-blue-500/30"
        >
          <Plus size={20} className="mr-2" />
          Add Product
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>
        ) : catalog.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-2xl border border-gray-100 shadow-sm">
            No products found in the central catalog.
          </div>
        ) : (
          catalog.map((product, idx) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group relative"
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">{product.itemName}</h3>
                  <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-indigo-800 bg-indigo-100 rounded-full">
                    {product.taxCode}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600 mb-6">
                  <p><span className="font-medium text-gray-900">S/N:</span> {product.serialNumber}</p>
                  <p><span className="font-medium text-gray-900">Model:</span> {product.model}</p>
                  <p className="line-clamp-2 text-xs text-gray-500">{product.specs}</p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Base Price</p>
                    <p className="text-xl font-black text-emerald-600">${product.basePurchasePrice}</p>
                  </div>
                  
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => handleDelete(product._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden p-6 z-10"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editId ? 'Edit Global Product' : 'Add Global Product'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                  <input type="text" name="itemName" required value={formData.itemName} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
                    <input type="text" name="serialNumber" required value={formData.serialNumber} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                    <input type="text" name="model" required value={formData.model} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specifications</label>
                  <textarea name="specs" required rows="3" value={formData.specs} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none"></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax Code</label>
                    <input type="text" name="taxCode" required value={formData.taxCode} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Base Price ($)</label>
                    <input type="number" name="basePurchasePrice" required min="0" step="0.01" value={formData.basePurchasePrice} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" />
                  </div>
                </div>

                <div className="pt-4 mt-6 border-t border-gray-100 flex justify-end space-x-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-500/30">
                    {editId ? 'Save Changes' : 'Create Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
