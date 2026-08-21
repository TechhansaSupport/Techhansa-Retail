import React, { useState, useEffect } from 'react';
import { Package, Search, Plus, X, Barcode } from 'lucide-react';
import axios from '../../../api/axios';
import toast from 'react-hot-toast';

export default function InventoryIntake() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    specs: '',
    category: '',
    buyingPrice: '',
    sellingPrice: '',
    serialNumbers: ['']
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/warehouse/inventory', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInventory(res.data);
    } catch (error) {
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleSerialChange = (index, value) => {
    const newSerials = [...formData.serialNumbers];
    newSerials[index] = value;
    setFormData({ ...formData, serialNumbers: newSerials });
  };

  const addSerialField = () => {
    setFormData({ ...formData, serialNumbers: [...formData.serialNumbers, ''] });
  };

  const removeSerialField = (index) => {
    const newSerials = formData.serialNumbers.filter((_, i) => i !== index);
    if (newSerials.length === 0) newSerials.push('');
    setFormData({ ...formData, serialNumbers: newSerials });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanSerials = formData.serialNumbers.filter(sn => sn.trim() !== '');
    if (cleanSerials.length === 0) {
      return toast.error('Please add at least one valid serial number');
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/warehouse/inventory/add', {
        ...formData,
        serialNumbers: cleanSerials
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Stock added successfully!');
      setIsModalOpen(false);
      setFormData({
        name: '', brand: '', model: '', specs: '', category: '',
        buyingPrice: '', sellingPrice: '', serialNumbers: ['']
      });
      fetchInventory();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add stock');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.model.toLowerCase().includes(search.toLowerCase()) ||
    (item.serialNumbers && item.serialNumbers.some(sn => sn.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name, model, or serial no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Add Physical Stock</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 text-sm font-medium text-slate-600">Product Info</th>
                <th className="p-4 text-sm font-medium text-slate-600">Physical Qty</th>
                <th className="p-4 text-sm font-medium text-slate-600">Reserved</th>
                <th className="p-4 text-sm font-medium text-slate-600">Serial Numbers</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => (
                <tr key={item._id} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="p-4">
                    <p className="font-medium text-slate-800">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.brand} • {item.model}</p>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg font-medium text-sm">
                      {item.quantity} units
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{item.reservedStock || 0}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {item.serialNumbers?.slice(0, 3).map((sn, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded border border-slate-200 font-mono">
                          {sn}
                        </span>
                      ))}
                      {item.serialNumbers?.length > 3 && (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded border border-slate-200">
                          +{item.serialNumbers.length - 3} more
                        </span>
                      )}
                      {(!item.serialNumbers || item.serialNumbers.length === 0) && (
                        <span className="text-xs text-slate-400 italic">No serials tracked</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredInventory.length === 0 && !loading && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-500">
                    No inventory found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Add Physical Stock</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="stock-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Product Name *</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="e.g. MacBook Pro M3" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Brand *</label>
                    <input required type="text" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Apple" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Model *</label>
                    <input required type="text" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="A2992" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Selling Price *</label>
                    <input required type="number" value={formData.sellingPrice} onChange={e => setFormData({...formData, sellingPrice: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="0.00" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Specifications</label>
                    <input type="text" value={formData.specs} onChange={e => setFormData({...formData, specs: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="16GB RAM, 512GB SSD" />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <Barcode className="w-4 h-4" /> Serial Numbers
                    </h3>
                    <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md font-medium">
                      Quantity: {formData.serialNumbers.filter(s => s.trim() !== '').length}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {formData.serialNumbers.map((sn, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input 
                          type="text" 
                          required
                          value={sn} 
                          onChange={(e) => handleSerialChange(idx, e.target.value)} 
                          className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono text-sm" 
                          placeholder={`Enter serial number #${idx + 1}`} 
                        />
                        <button type="button" onClick={() => removeSerialField(idx)} className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 rounded-lg">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={addSerialField} className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                    <Plus className="w-4 h-4" /> Add another serial number
                  </button>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-2xl">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors">
                Cancel
              </button>
              <button form="stock-form" type="submit" disabled={isSubmitting} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-70">
                {isSubmitting ? 'Saving...' : 'Save Inventory'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
