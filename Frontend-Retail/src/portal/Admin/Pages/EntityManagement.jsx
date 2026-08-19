import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from '../../../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Search, Users, Plus, Trash2, X, AlertTriangle, Wallet, Eye, EyeOff, History, ArrowUpRight, ArrowDownRight, IndianRupee, RefreshCcw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EntityManagement() {
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Credit Assignment Modal States
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [creditUserId, setCreditUserId] = useState(null);
  const [creditAmount, setCreditAmount] = useState('');
  const [creditHistory, setCreditHistory] = useState([]);
  const [creditHistoryLoading, setCreditHistoryLoading] = useState(false);
  const [creditTab, setCreditTab] = useState('assign'); // 'assign' | 'history'

  const [formData, setFormData] = useState({
    userId: '',
    email: '',
    name: '',
    password: '',
    role: 'franchise',
    storeId: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [storeIds, setStoreIds] = useState(['']);

  const handleAddStoreId = () => setStoreIds([...storeIds, '']);
  const handleRemoveStoreId = (index) => setStoreIds(storeIds.filter((_, i) => i !== index));
  const handleStoreIdChange = (index, value) => {
    const newStoreIds = [...storeIds];
    newStoreIds[index] = value;
    setStoreIds(newStoreIds);
  };

  useEffect(() => {
    fetchEntities();
  }, []);

  const fetchEntities = async () => {
    try {
      const response = await axios.get(`/api/admin/entities`);
      setEntities(response.data);
    } catch (error) {
      toast.error('Failed to load entities');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    try {
      await axios.put(`/api/admin/entities/${userId}/status`, { status: newStatus });
      toast.success(`Entity status updated to ${newStatus}`);
      fetchEntities(); // Refresh list
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { ...formData };
      if (payload.role === 'franchise') {
        payload.storeId = storeIds.filter(id => id.trim() !== '').join(', ');
      }
      
      if (editMode) {
        await axios.put(`/api/admin/entities/${payload.userId}`, payload);
        toast.success('Partner updated successfully!');
      } else {
        await axios.post(`/api/admin/entities`, payload);
        toast.success('Partner created successfully!');
      }
      
      setIsCreateModalOpen(false);
      setFormData({
        userId: '',
        email: '',
        name: '',
        password: '',
        role: 'franchise',
        storeId: ''
      });
      setStoreIds(['']);
      fetchEntities();
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${editMode ? 'update' : 'create'} partner`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (entity) => {
    setEditMode(true);
    setFormData({
      userId: entity.userId,
      email: entity.email || '',
      name: entity.name || '',
      password: '', // Blank password unless they want to change it
      role: entity.role,
      storeId: entity.storeId || ''
    });
    setStoreIds(entity.storeId ? entity.storeId.split(',').map(s => s.trim()) : ['']);
    setIsCreateModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await axios.delete(`/api/admin/entities/${deleteConfirmId}`);
      toast.success('Partner deleted permanently');
      setDeleteConfirmId(null);
      fetchEntities();
    } catch (error) {
      toast.error('Failed to delete partner');
    }
  };

  const fetchCreditHistory = async (userId) => {
    setCreditHistoryLoading(true);
    try {
      const res = await axios.get(`/api/admin/entities/${userId}/credit-history`);
      setCreditHistory(res.data || []);
    } catch (error) {
      console.error('Failed to fetch credit history', error);
      setCreditHistory([]);
    } finally {
      setCreditHistoryLoading(false);
    }
  };

  const handleCreditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.put(`/api/admin/entities/${creditUserId}/credit`, { totalCredit: Number(creditAmount) });
      toast.success('Credit limit updated successfully!');
      fetchEntities();
      // Refresh history after update
      fetchCreditHistory(creditUserId);
      setCreditTab('history');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign credit');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCreditModal = (userId, currentCredit) => {
    setCreditUserId(userId);
    setCreditAmount(currentCredit || 0);
    setCreditTab('assign');
    setIsCreditModalOpen(true);
    fetchCreditHistory(userId);
  };

  const formatCurrency = (num) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);

  const getHistoryColor = (type) => {
    if (['Assigned', 'Increased', 'Refunded', 'Released'].includes(type)) return 'text-emerald-600';
    return 'text-red-600';
  };

  const getHistoryBadge = (type) => {
    if (['Assigned', 'Increased', 'Refunded', 'Released'].includes(type)) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    return 'bg-red-50 text-red-700 border-red-200';
  };

  const filteredEntities = entities.filter(entity => {
    const matchesSearch = entity.userId.toLowerCase().includes(searchTerm.toLowerCase()) || (entity.email && entity.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === 'All' ? true : entity.role === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Users className="mr-2 text-blue-500" size={28} />
            Entity Management
          </h2>
          <p className="text-gray-500 mt-1">Provision, suspend, and manage Franchise and B2B Distributor accounts.</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm w-full sm:w-auto bg-white"
            >
              <option value="All">All Roles</option>
              <option value="Franchise">Franchise</option>
              <option value="Channel">B2B Channel</option>
            </select>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by ID or Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm w-full sm:w-64"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <button 
            onClick={() => {
              setEditMode(false);
              setFormData({ userId: '', email: '', name: '', password: '', role: 'franchise', storeId: '' });
              setStoreIds(['']);
              setIsCreateModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} /> Create Partner
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User / Entity</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Store ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Credit Limit</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredEntities.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500 font-medium">
                    No entities found
                  </td>
                </tr>
              ) : (
                filteredEntities.map((entity, idx) => (
                  <motion.tr 
                    key={entity.userId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-blue-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 shadow-inner">
                          {entity.userId.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{entity.userId}</div>
                          <div className="text-sm text-gray-500">{entity.email || 'No email provided'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        entity.role === 'channel' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {entity.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entity.storeId ? (
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {entity.storeId.split(',').map((id, i) => (
                            <span key={i} className="px-2 py-0.5 bg-gray-100 border border-gray-200 text-gray-700 rounded-md text-[10px] font-medium">
                              {id.trim()}
                            </span>
                          ))}
                        </div>
                      ) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600">
                      ₹{(entity.totalCredit || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                        entity.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {entity.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(entity)}
                          title="Edit Partner"
                          className="inline-flex items-center p-2 border border-gray-200 text-blue-600 bg-white hover:bg-blue-50 hover:border-blue-200 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                        </button>
                        <button
                          onClick={() => openCreditModal(entity.userId, entity.totalCredit)}
                          title="Assign Credit Limit"
                          className="inline-flex items-center p-2 border border-gray-200 text-indigo-600 bg-white hover:bg-indigo-50 hover:border-indigo-200 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <Wallet size={18} />
                        </button>
                        <button
                          onClick={() => toggleStatus(entity.userId, entity.status)}
                          title={entity.status === 'Active' ? 'Suspend' : 'Activate'}
                          className={`inline-flex items-center p-2 border rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            entity.status === 'Active'
                              ? 'border-red-200 text-red-600 bg-white hover:bg-red-50 focus:ring-red-500'
                              : 'border-emerald-200 text-emerald-600 bg-white hover:bg-emerald-50 focus:ring-emerald-500'
                          }`}
                        >
                          {entity.status === 'Active' ? <ShieldAlert size={18} /> : <ShieldCheck size={18} />}
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(entity.userId)}
                          title="Delete Permanent"
                          className="inline-flex items-center p-2 border border-gray-200 text-gray-500 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Credit Assignment Modal with History */}
      {createPortal(
        <AnimatePresence>
          {isCreditModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-indigo-50/50 shrink-0">
                <div className="flex items-center">
                   <Wallet className="text-indigo-600 mr-2" size={20} />
                   <h3 className="text-lg font-bold text-gray-800">Credit Management</h3>
                </div>
                <button onClick={() => setIsCreditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-100 px-5 shrink-0">
                <button
                  onClick={() => setCreditTab('assign')}
                  className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                    creditTab === 'assign' 
                      ? 'border-indigo-600 text-indigo-700' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Wallet size={16} /> Assign Credit
                </button>
                <button
                  onClick={() => setCreditTab('history')}
                  className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                    creditTab === 'history' 
                      ? 'border-indigo-600 text-indigo-700' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <History size={16} /> History
                  {creditHistory.length > 0 && (
                    <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{creditHistory.length}</span>
                  )}
                </button>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto">
                {creditTab === 'assign' ? (
                  <form onSubmit={handleCreditSubmit} className="p-6">
                    <p className="text-sm text-gray-500 mb-4">
                      Update the maximum operating credit line for <span className="font-bold text-gray-800">{creditUserId}</span>.
                    </p>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total Credit Line (₹)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-gray-500 font-medium">₹</span>
                        <input
                          required
                          type="number"
                          min="0"
                          step="1000"
                          value={creditAmount}
                          onChange={(e) => setCreditAmount(e.target.value)}
                          className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-bold"
                        />
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                      <button 
                        type="button"
                        onClick={() => setIsCreditModalOpen(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm shadow-indigo-200"
                      >
                        {isSubmitting ? 'Updating...' : 'Assign Limit'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-500">
                        All credit changes for <span className="font-bold text-gray-800">{creditUserId}</span>
                      </p>
                      <button
                        onClick={() => fetchCreditHistory(creditUserId)}
                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Refresh"
                      >
                        <RefreshCcw size={14} className={creditHistoryLoading ? 'animate-spin' : ''} />
                      </button>
                    </div>

                    {creditHistoryLoading ? (
                      <div className="flex flex-col items-center justify-center py-10">
                        <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-indigo-600 mb-3"></div>
                        <p className="text-sm text-gray-500">Loading history...</p>
                      </div>
                    ) : creditHistory.length === 0 ? (
                      <div className="text-center py-10">
                        <History className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">No credit history found</p>
                        <p className="text-gray-400 text-sm mt-1">Credit transactions will appear here after the first assignment.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {creditHistory.map((tx) => (
                          <div key={tx._id} className="bg-gray-50 rounded-xl p-3.5 border border-gray-100 hover:border-gray-200 transition-colors">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3 min-w-0 flex-1">
                                <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${getHistoryBadge(tx.type).split(' ')[0]} border ${getHistoryBadge(tx.type).split(' ').slice(2).join(' ')}`}>
                                  {['Assigned', 'Increased', 'Refunded', 'Released'].includes(tx.type) 
                                    ? <ArrowDownRight size={14} className="text-emerald-600" />
                                    : <ArrowUpRight size={14} className="text-red-600" />
                                  }
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-gray-900 truncate">{tx.description}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold border ${getHistoryBadge(tx.type)}`}>
                                      {tx.type}
                                    </span>
                                    <span className="text-[11px] text-gray-400">{new Date(tx.date || tx.createdAt).toLocaleString()}</span>
                                  </div>
                                  {tx.referenceId && tx.referenceId !== 'ADMIN_UPDATE' && (
                                    <p className="text-[11px] text-gray-400 mt-1">Ref: {tx.referenceId}</p>
                                  )}
                                </div>
                              </div>
                              <p className={`text-sm font-bold shrink-0 ${getHistoryColor(tx.type)}`}>
                                {['Assigned', 'Increased', 'Refunded', 'Released'].includes(tx.type) ? '+' : '-'}
                                {formatCurrency(tx.amount)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
        </AnimatePresence>,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      {createPortal(
        <AnimatePresence>
          {deleteConfirmId && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4 mx-auto">
                  <AlertTriangle className="text-red-600" size={24} />
                </div>
                <h3 className="text-lg font-bold text-center text-gray-900 mb-2">Delete Partner</h3>
                <p className="text-center text-gray-500 text-sm">
                  Are you sure you want to permanently delete the partner <span className="font-bold text-gray-800">"{deleteConfirmId}"</span>? This action cannot be undone and will revoke all access.
                </p>
              </div>
              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
                <button 
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-sm shadow-red-200"
                >
                  Delete Partner
                </button>
              </div>
            </motion.div>
          </div>
        )}
        </AnimatePresence>,
        document.body
      )}

      {/* Create Partner Slide-over Modal */}
      {createPortal(
        <AnimatePresence>
          {isCreateModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-800">{editMode ? 'Edit Partner' : 'Provision New Partner'}</h3>
                <button 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-5">
                <form onSubmit={handleCreateSubmit} id="create-partner-form" className="space-y-3">
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Partner Role</label>
                    <select
                      required
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="franchise">Franchise Network</option>
                      <option value="channel">B2B Channel Distributor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                    <input
                      required
                      type="text"
                      value={formData.userId}
                      onChange={(e) => setFormData({...formData, userId: e.target.value})}
                      disabled={editMode}
                      className={`w-full p-2 border ${editMode ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm`}
                      placeholder="e.g. fran_delhi_01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password {editMode ? '(Leave blank to keep unchanged)' : <span className="text-red-500">*</span>}</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm pr-10"
                        placeholder={editMode ? 'Leave blank to keep unchanged' : '••••••••'}
                        required={!editMode}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company / Partner Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Acme Retailers"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                    <input
                      type="email"
                      placeholder="partner@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {formData.role === 'franchise' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-sm font-medium text-gray-700">Assigned Store IDs</label>
                        <button 
                          type="button" 
                          onClick={handleAddStoreId}
                          className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <Plus size={14} /> Add Store
                        </button>
                      </div>
                      
                      {storeIds.map((id, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            required={index === 0}
                            type="text"
                            placeholder="e.g. store-005"
                            value={id}
                            onChange={(e) => handleStoreIdChange(index, e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          {storeIds.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveStoreId(index)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <X size={18} />
                            </button>
                          )}
                        </div>
                      ))}
                    </motion.div>
                  )}
                  
                </form>
              </div>
              
              <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  form="create-partner-form"
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {editMode ? 'Saving...' : 'Provisioning...'}
                    </>
                  ) : (
                    editMode ? 'Save Changes' : 'Provision Partner'
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
