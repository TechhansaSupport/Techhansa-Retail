import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MoreHorizontal, ChevronDown } from 'lucide-react';

const tableVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const getStatusStyles = (status) => {
  switch (status) {
    case 'Approved': return { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Approved' };
    case 'Draft': return { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Draft' };
    case 'Under Review': return { bg: 'bg-indigo-50', text: 'text-indigo-700', label: 'Under Review' };
    case 'Submitted': return { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Pending Admin Approval' };
    case 'Quotation Received': return { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Quotation Received' };
    case 'Rejected': return { bg: 'bg-red-50', text: 'text-red-700', label: 'Rejected' };
    case 'Accepted': return { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Accepted' };
    case 'Pending Review': return { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Pending Review' };
    case 'Confirmed': return { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Confirmed' };
    case 'Delivered': return { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Delivered' };
    case 'Pending': return { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Pending' };
    default: return { bg: 'bg-slate-100', text: 'text-slate-700', label: status };
  }
};

import { AuthContext } from '../../../context/AuthContext';

export default function ProcurementTables() {
  const { user } = useContext(AuthContext) || { user: null };
  const [rfps, setRfps] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [rfpSearch, setRfpSearch] = useState('');
  const [showRfpSearch, setShowRfpSearch] = useState(false);
  const [rfpFilter, setRfpFilter] = useState('All');
  const [qtFilter, setQtFilter] = useState('All');

  const statuses = ['All', 'Draft', 'Submitted', 'Under Review', 'Approved', 'Rejected', 'Quotation Received'];
  const qtStatuses = ['All', 'Pending', 'Approved', 'Rejected'];

  const filteredRfps = rfps.filter(rfp => {
    const matchesSearch = (rfp.rfpId || '').toLowerCase().includes(rfpSearch.toLowerCase()) || (rfp.title || '').toLowerCase().includes(rfpSearch.toLowerCase());
    const matchesFilter = rfpFilter === 'All' || rfp.status === rfpFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredQuotations = quotations.filter(qt => {
    return qtFilter === 'All' || qt.status === qtFilter;
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.userId) return;
      try {
        const [rfpRes, qtRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/procurement/rfp?userId=${user.userId}`),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/procurement/quotations?userId=${user.userId}`)
        ]);
        if (rfpRes.ok) {
          const rfpData = await rfpRes.json();
          setRfps(rfpData.slice(0, 5)); // Limit to 5 recent
        }
        if (qtRes.ok) {
          const qtData = await qtRes.json();
          setQuotations(qtData.slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to fetch table data:', err);
      }
    };
    fetchData();
  }, [user]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

      {/* Recent RFPs - Card List Layout */}
      <motion.div variants={tableVariants} className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col">
        {/* HATA DIYA GAYA HAI: border-b border-slate-100 */}
        <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-900">Recent RFPs</h2>
          <div className="flex items-center gap-2 relative">
            {showRfpSearch && (
              <input
                type="text"
                placeholder="Search RFPs..."
                value={rfpSearch}
                onChange={(e) => setRfpSearch(e.target.value)}
                className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 w-40"
                autoFocus
              />
            )}
            <button onClick={() => setShowRfpSearch(!showRfpSearch)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
              <Search className="w-4 h-4" />
            </button>
            <div className="relative group">
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                <Filter className="w-4 h-4" />
              </button>
              <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-slate-100 shadow-xl rounded-xl py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                {statuses.map(s => (
                  <button key={s} onClick={() => setRfpFilter(s)} className={`block w-full text-left px-4 py-2 text-sm ${rfpFilter === s ? 'text-blue-600 bg-blue-50 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* HATA DIYA GAYA HAI: divide-y divide-slate-100 */}
        <div className="pb-2">
          {filteredRfps.length > 0 ? filteredRfps.map((rfp) => {
            const styles = getStatusStyles(rfp.status);
            const date = new Date(rfp.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            return (
              <div key={rfp._id} className="p-4 hover:bg-slate-50/80 transition-colors group cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-blue-600 text-sm group-hover:underline">{rfp.rfpId}</span>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${styles.bg} ${styles.text}`}>
                    <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current"></span>
                    {styles.label || rfp.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700 font-medium">{rfp.title}</span>
                  <span className="text-sm text-slate-600 font-semibold">{date}</span>
                </div>
              </div>
            );
          }) : <div className="p-4 text-sm text-slate-500">No recent RFPs.</div>}

        </div>
      </motion.div>

      {/* Recent Quotations - Card List Layout */}
      <motion.div variants={tableVariants} className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col">
        {/* HATA DIYA GAYA HAI: border-b border-slate-100 */}
        <div className="p-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Recent Quotations</h2>
          <div className="flex gap-2 relative group">
            <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors">
              {qtFilter === 'All' ? 'Filter' : qtFilter} <ChevronDown className="w-4 h-4" />
            </button>
            <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-slate-100 shadow-xl rounded-xl py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
              {qtStatuses.map(s => (
                <button key={s} onClick={() => setQtFilter(s)} className={`block w-full text-left px-4 py-2 text-sm ${qtFilter === s ? 'text-blue-600 bg-blue-50 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* HATA DIYA GAYA HAI: divide-y divide-slate-100 */}
        <div className="pb-2">
          {filteredQuotations.length > 0 ? filteredQuotations.map((qt) => {
            const styles = getStatusStyles(qt.status);
            const date = new Date(qt.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            return (
              <div key={qt._id} className="p-4 hover:bg-slate-50/80 transition-colors group cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-blue-600 text-sm group-hover:underline">{qt.quotationId || 'QT-XXXX'}</span>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${styles.bg} ${styles.text}`}>
                    {qt.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700 font-medium">{qt.vendorName || 'Vendor'}</span>
                  <span className="text-sm text-slate-600 font-semibold">{date}</span>
                </div>
              </div>
            );
          }) : <div className="p-4 text-sm text-slate-500">No recent quotations.</div>}
        </div>
      </motion.div>

    </div>
  );
}