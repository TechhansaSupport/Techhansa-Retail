import React, { useState, useEffect, useContext } from 'react';
import { exportToCSV } from '../../../utils/exportUtils';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  ChevronDown,
  Eye,
  Edit3,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Send,
  MoreHorizontal,
  Calendar,
  Download,
  ArrowUpDown
} from 'lucide-react';

import { AuthContext } from '../../../context/AuthContext';

const STATUS_CONFIG = {
  'Draft': { bg: 'bg-slate-100', text: 'text-slate-700', icon: FileText },
  'Submitted': { bg: 'bg-amber-50', text: 'text-amber-700', icon: Clock, label: 'Pending Admin Approval' },
  'Under Review': { bg: 'bg-indigo-50', text: 'text-indigo-700', icon: Clock },
  'Approved': { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: CheckCircle },
  'Rejected': { bg: 'bg-red-50', text: 'text-red-700', icon: XCircle },
  'Quotation Received': { bg: 'bg-blue-50', text: 'text-blue-700', icon: FileText },
};

const PRIORITY_CONFIG = {
  'High': { bg: 'bg-red-50', text: 'text-red-700' },
  'Medium': { bg: 'bg-amber-50', text: 'text-amber-700' },
  'Low': { bg: 'bg-slate-100', text: 'text-slate-600' },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function RfpManagement() {
  const { user } = useContext(AuthContext) || { user: null };
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(location.state?.filter || 'All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [rfps, setRfps] = useState([]);
  const [selectedRfp, setSelectedRfp] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.userId) fetchRfps();
  }, [user]);

  const fetchRfps = async () => {
    if (!user?.userId) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/procurement/rfp?userId=${user.userId}`);
      const data = await res.json();
      setRfps(data);
    } catch (err) {
      console.error('Failed to fetch RFPs', err);
    }
  };


  const handleEdit = (rfp) => {
    if (rfp.status !== 'Draft') {
      alert("Editing is restricted. Only Draft RFPs can be edited.");
      return;
    }
    navigate('/channel/rfp/create', { state: { rfp } });
  };

  const statuses = ['All', 'Draft', 'Submitted', 'Under Review', 'Approved', 'Quotation Received', 'Rejected'];

  const handleExport = () => {
    exportToCSV('rfps.csv', filteredRFPs, [
      { key: 'rfpId', label: 'RFP ID' },
      { key: 'title', label: 'Title' },
      { key: 'status', label: 'Status' },
      { key: 'priority', label: 'Priority' },
      { key: 'expectedDeliveryDate', label: 'Delivery Date' }
    ]);
  };

  const filteredRFPs = rfps.filter(rfp => {
    const title = rfp.title || '';
    const rfpId = rfp.rfpId || '';
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) || rfpId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || rfp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Summary stats
  const totalRFPs = rfps.length;
  const draftCount = rfps.filter(r => r.status === 'Draft').length;
  const activeCount = rfps.filter(r => ['Submitted', 'Under Review', 'Quotation Received'].includes(r.status)).length;
  const approvedCount = rfps.filter(r => r.status === 'Approved').length;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-[1600px] mx-auto pb-12 space-y-6"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">RFP Management</h1>
          <p className="text-slate-500 text-sm mt-1">Create, track and manage all your procurement requests.</p>
        </div>
        <Link
          to="/channel/rfp/create"
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow-md"
        >
          <Plus className="w-4 h-4" /> Create New RFP
        </Link>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total RFPs', count: totalRFPs, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Draft', count: draftCount, icon: Edit3, color: 'text-slate-600', bg: 'bg-slate-100' },
          { label: 'Active', count: activeCount, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Approved', count: approvedCount, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stat.count}</p>
                <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Toolbar: Search + Filter + Export */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by RFP ID or title..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              {statusFilter === 'All' ? 'All Status' : statusFilter}
              <ChevronDown className="w-4 h-4" />
            </button>
            {showFilterDropdown && (
              <div className="absolute right-0 top-12 z-20 bg-white border border-slate-200 rounded-xl shadow-lg py-2 w-48">
                {statuses.map((s) => (
                  <button
                    key={s}
                    onClick={() => { setStatusFilter(s); setShowFilterDropdown(false); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${statusFilter === s ? 'font-semibold text-blue-600 bg-blue-50/50' : 'text-slate-700'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export */}
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </motion.div>

      {/* RFP List */}
      <motion.div variants={itemVariants} className="space-y-3">
        {filteredRFPs.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-12 text-center">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No RFPs found matching your criteria.</p>
            <p className="text-slate-400 text-sm mt-1">Try adjusting your search or filter.</p>
          </div>
        ) : (
          filteredRFPs.map((rfp) => {
            const statusCfg = STATUS_CONFIG[rfp.status] || STATUS_CONFIG['Draft'];
            const priorityCfg = PRIORITY_CONFIG[rfp.priority] || PRIORITY_CONFIG['Low'];
            const StatusIcon = statusCfg.icon;

            return (
              <motion.div
                key={rfp._id || rfp.rfpId}
                variants={itemVariants}
                className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-5 group"
              >
                {/* Top Row: ID + Status + Priority + Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-bold text-blue-600 text-sm cursor-pointer hover:underline">{rfp.rfpId}</span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${statusCfg.bg} ${statusCfg.text}`}>
                      {StatusIcon && <StatusIcon className="w-3 h-3" />}
                      {statusCfg.label || rfp.status}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${priorityCfg.bg} ${priorityCfg.text}`}>
                      {rfp.priority}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={() => setSelectedRfp(rfp)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleEdit(rfp)} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit">
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold text-slate-900 mb-3">{rfp.title}</h3>

                {/* Details Row */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 font-medium">Items:</span>
                    <span className="text-slate-700">{rfp.products ? rfp.products.length : 0}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 font-medium">Qty:</span>
                    <span className="text-slate-700">{rfp.products ? rfp.products.reduce((acc, p) => acc + (p.quantity || 0), 0) : 0}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-400 font-medium">Created:</span>
                    <span className="text-slate-700">{new Date(rfp.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-400 font-medium">Delivery:</span>
                    <span className="text-slate-700">{new Date(rfp.expectedDeliveryDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </motion.div>

      {/* View RFP Modal */}
      {selectedRfp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{selectedRfp.title}</h2>
                <p className="text-sm text-slate-500 mt-1">RFP ID: {selectedRfp.rfpId}</p>
              </div>
              <button onClick={() => setSelectedRfp(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Expected Delivery Date</p>
                  <p className="text-slate-900 font-semibold">{new Date(selectedRfp.expectedDeliveryDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Priority</p>
                  <p className="text-slate-900 font-semibold">{selectedRfp.priority}</p>
                </div>
                {selectedRfp.remarks && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-slate-500 mb-1">Remarks</p>
                    <p className="text-slate-900 bg-slate-50 p-4 rounded-xl text-sm border border-slate-100">{selectedRfp.remarks}</p>
                  </div>
                )}
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-4">Product Requirements</h3>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-4 py-3 text-sm font-semibold text-slate-700">Category</th>
                      <th className="px-4 py-3 text-sm font-semibold text-slate-700">Brand</th>
                      <th className="px-4 py-3 text-sm font-semibold text-slate-700">Model</th>
                      <th className="px-4 py-3 text-sm font-semibold text-slate-700">Configuration</th>
                      <th className="px-4 py-3 text-sm font-semibold text-slate-700 text-center">Qty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedRfp.products?.map((p, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-sm text-slate-900">{p.category}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">{p.brand}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">{p.model}</td>
                        <td className="px-4 py-3 text-sm text-slate-600 max-w-[200px] truncate" title={p.configuration}>{p.configuration}</td>
                        <td className="px-4 py-3 text-sm text-slate-900 text-center font-medium">{p.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button onClick={() => setSelectedRfp(null)} className="px-6 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-100 transition-colors">
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
