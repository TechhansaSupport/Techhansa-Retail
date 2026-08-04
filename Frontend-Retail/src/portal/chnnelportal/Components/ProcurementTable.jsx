import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MoreHorizontal, ChevronDown } from 'lucide-react';

const RECENT_RFPS = [
  { id: 'RFP-2024-089', title: 'Office Laptops', value: '₹45,000', status: 'Approved', statusBg: 'bg-emerald-50', statusText: 'text-emerald-700', date: 'Oct 24' },
  { id: 'RFP-2024-088', title: 'Network Switches', value: '₹12,500', status: 'Draft', statusBg: 'bg-slate-100', statusText: 'text-slate-700', date: 'Oct 23' },
  { id: 'RFP-2024-087', title: 'Monitors', value: '₹8,200', status: 'Under Review', statusBg: 'bg-amber-50', statusText: 'text-amber-700', date: 'Oct 22' },
];

const RECENT_QUOTATIONS = [
  { id: 'QT-2024-112', vendor: 'Dell Technologies', value: '₹42,500', status: 'Pending Review', statusBg: 'bg-blue-50', statusText: 'text-blue-700', date: 'Oct 24' },
  { id: 'QT-2024-111', vendor: 'Cisco Systems', value: '₹14,000', status: 'Accepted', statusBg: 'bg-emerald-50', statusText: 'text-emerald-700', date: 'Oct 21' },
];

const tableVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function ProcurementTables() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

      {/* Recent RFPs - Card List Layout */}
      <motion.div variants={tableVariants} className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col">
        {/* HATA DIYA GAYA HAI: border-b border-slate-100 */}
        <div className="p-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Recent RFPs</h2>
          <div className="flex gap-2">
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
              <Search className="w-4 h-4" />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* HATA DIYA GAYA HAI: divide-y divide-slate-100 */}
        <div className="pb-2">
          {RECENT_RFPS.map((rfp) => (
            <div key={rfp.id} className="p-4 hover:bg-slate-50/80 transition-colors group cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-blue-600 text-sm group-hover:underline">{rfp.id}</span>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${rfp.statusBg} ${rfp.statusText}`}>
                  <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current"></span>
                  {rfp.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700 font-medium">{rfp.title}</span>
                <span className="text-sm text-slate-600 font-semibold">{rfp.value}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Quotations - Card List Layout */}
      <motion.div variants={tableVariants} className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col">
        {/* HATA DIYA GAYA HAI: border-b border-slate-100 */}
        <div className="p-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Recent Quotations</h2>
          <div className="flex gap-2">
            <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors">
              Filter <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* HATA DIYA GAYA HAI: divide-y divide-slate-100 */}
        <div className="pb-2">
          {RECENT_QUOTATIONS.map((qt) => (
            <div key={qt.id} className="p-4 hover:bg-slate-50/80 transition-colors group cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-blue-600 text-sm group-hover:underline">{qt.id}</span>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${qt.statusBg} ${qt.statusText}`}>
                  {qt.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700 font-medium">{qt.vendor}</span>
                <span className="text-sm text-slate-600 font-semibold">{qt.value}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

    </div>
  );
}