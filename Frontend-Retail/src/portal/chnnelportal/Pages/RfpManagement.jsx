import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  ChevronDown,
  Eye,
  Edit3,
  Trash2,
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

const RFP_DATA = [
  {
    id: 'RFP-2024-089',
    title: 'Q3 Office Laptops Procurement',
    category: 'Laptops',
    priority: 'High',
    status: 'Approved',
    createdDate: '2024-10-15',
    deliveryDate: '2024-11-30',
    totalQty: 50,
    totalItems: 3,
    estimatedValue: '₹22,50,000',
  },
  {
    id: 'RFP-2024-088',
    title: 'Network Infrastructure Upgrade',
    category: 'Networking',
    priority: 'Medium',
    status: 'Under Review',
    createdDate: '2024-10-12',
    deliveryDate: '2024-12-15',
    totalQty: 25,
    totalItems: 5,
    estimatedValue: '₹8,75,000',
  },
  {
    id: 'RFP-2024-087',
    title: 'Monitor Refresh Program',
    category: 'Monitors',
    priority: 'Low',
    status: 'Draft',
    createdDate: '2024-10-10',
    deliveryDate: '2024-12-01',
    totalQty: 100,
    totalItems: 2,
    estimatedValue: '₹15,00,000',
  },
  {
    id: 'RFP-2024-086',
    title: 'Server Room Expansion',
    category: 'Servers',
    priority: 'High',
    status: 'Submitted',
    createdDate: '2024-10-08',
    deliveryDate: '2024-11-20',
    totalQty: 10,
    totalItems: 4,
    estimatedValue: '₹45,00,000',
  },
  {
    id: 'RFP-2024-085',
    title: 'Printer Fleet Replacement',
    category: 'Printers',
    priority: 'Medium',
    status: 'Quotation Received',
    createdDate: '2024-10-05',
    deliveryDate: '2024-11-25',
    totalQty: 30,
    totalItems: 2,
    estimatedValue: '₹6,00,000',
  },
  {
    id: 'RFP-2024-084',
    title: 'Desktop Workstations',
    category: 'Desktops',
    priority: 'Low',
    status: 'Rejected',
    createdDate: '2024-09-28',
    deliveryDate: '2024-11-10',
    totalQty: 20,
    totalItems: 1,
    estimatedValue: '₹12,00,000',
  },
];

const STATUS_CONFIG = {
  'Draft': { bg: 'bg-slate-100', text: 'text-slate-700', icon: FileText },
  'Submitted': { bg: 'bg-blue-50', text: 'text-blue-700', icon: Send },
  'Under Review': { bg: 'bg-amber-50', text: 'text-amber-700', icon: Clock },
  'Approved': { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: CheckCircle },
  'Quotation Received': { bg: 'bg-violet-50', text: 'text-violet-700', icon: FileText },
  'Rejected': { bg: 'bg-red-50', text: 'text-red-700', icon: XCircle },
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
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const statuses = ['All', 'Draft', 'Submitted', 'Under Review', 'Approved', 'Quotation Received', 'Rejected'];

  const filteredRFPs = RFP_DATA.filter(rfp => {
    const matchesSearch = rfp.title.toLowerCase().includes(searchQuery.toLowerCase()) || rfp.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || rfp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Summary stats
  const totalRFPs = RFP_DATA.length;
  const draftCount = RFP_DATA.filter(r => r.status === 'Draft').length;
  const activeCount = RFP_DATA.filter(r => ['Submitted', 'Under Review', 'Quotation Received'].includes(r.status)).length;
  const approvedCount = RFP_DATA.filter(r => r.status === 'Approved').length;

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
          <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
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
                key={rfp.id}
                variants={itemVariants}
                className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-5 group"
              >
                {/* Top Row: ID + Status + Priority + Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-bold text-blue-600 text-sm cursor-pointer hover:underline">{rfp.id}</span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${statusCfg.bg} ${statusCfg.text}`}>
                      <StatusIcon className="w-3 h-3" />
                      {rfp.status}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${priorityCfg.bg} ${priorityCfg.text}`}>
                      {rfp.priority}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold text-slate-900 mb-3">{rfp.title}</h3>

                {/* Details Row */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 font-medium">Category:</span>
                    <span className="text-slate-700">{rfp.category}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 font-medium">Items:</span>
                    <span className="text-slate-700">{rfp.totalItems}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 font-medium">Qty:</span>
                    <span className="text-slate-700">{rfp.totalQty}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-400 font-medium">Created:</span>
                    <span className="text-slate-700">{rfp.createdDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-400 font-medium">Delivery:</span>
                    <span className="text-slate-700">{rfp.deliveryDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 font-medium">Est. Value:</span>
                    <span className="text-slate-900 font-semibold">{rfp.estimatedValue}</span>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </motion.div>
    </motion.div>
  );
}
