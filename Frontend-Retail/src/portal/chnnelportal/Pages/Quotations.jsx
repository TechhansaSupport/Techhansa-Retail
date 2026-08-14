import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, FileText, Download, Eye, ExternalLink, XCircle } from 'lucide-react';
import { exportToCSV } from '../../../utils/exportUtils';
import { AuthContext } from '../../../context/AuthContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function Quotations() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext) || { user: null };
  const [quotations, setQuotations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [rfps, setRfps] = useState([]);
  
  useEffect(() => {
    if (user?.userId) {
      fetchQuotations();
      fetchRfps();
    }
  }, [user]);
  
  const fetchQuotations = async () => {
    if (!user?.userId) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/procurement/quotations?userId=${user.userId}`);
      const data = await res.json();
      setQuotations(data);
    } catch (err) {
      console.error('Failed to fetch quotations', err);
    }
  };

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

  const filteredQs = quotations.filter(q => {
    if (q.status === 'Rejected') return false;

    const qtId = q.quotationNo || q.quotationId || '';
    const vendor = q.vendorName || q.vendor || '';
    return qtId.toLowerCase().includes(searchQuery.toLowerCase()) || vendor.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const selectedRfp = selectedQuotation ? rfps.find(r => r.rfpId === selectedQuotation.quotationNo?.replace('QT-', '')) : null;
  const quotationItems = (selectedQuotation?.items?.length > 0) ? selectedQuotation.items : (selectedRfp?.products || []).map(p => {
    const unitPrice = selectedQuotation?.amount || 0;
    const totalAmount = unitPrice * (p.quantity || 1) * 1.18; // 18% GST
    return { ...p, unitPrice, totalAmount };
  });

  const displayTotalAmount = quotationItems.reduce((sum, item) => sum + (item.totalAmount || ((item.quantity || 1) * (item.unitPrice || 0) * 1.18)), 0);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-[1600px] mx-auto pb-12 space-y-6">
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quotations</h1>
          <p className="text-slate-500 text-sm mt-1">Review and manage received quotations.</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Quotation ID or Vendor..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            />
          </div>
          <button onClick={() => exportToCSV('quotations.csv', filteredQs, [
            { key: 'quotationNo', label: 'Quotation ID' },
            { key: 'vendor', label: 'Vendor' },
            { key: 'status', label: 'Status' },
            { key: 'amount', label: 'Total Amount' },
            { key: 'validUntil', label: 'Valid Until' }
          ])} className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shrink-0">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-3">
        {filteredQs.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-12 text-center text-slate-500">
            No quotations found.
          </div>
        ) : (
          filteredQs.map((qt) => (
            <motion.div key={qt._id} variants={itemVariants} className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-bold text-blue-600 text-sm cursor-pointer hover:underline">{qt.quotationNo || qt.quotationId}</span>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${qt.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                    {qt.status === 'Pending' ? 'Pending Admin Approval' : qt.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setSelectedQuotation(qt)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">{qt.vendorName || qt.vendor}</h3>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-medium">Value:</span>
                  <span className="text-slate-700 font-semibold text-emerald-600">₹{qt.amount?.toLocaleString('en-IN') || qt.totalAmount?.toLocaleString('en-IN') || 0}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-medium">Valid Until:</span>
                  <span className="text-slate-700">{new Date(qt.validUntil).toLocaleDateString()}</span>
                </div>
                {qt.rfpReference && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 font-medium">Related RFP:</span>
                    <span className="text-blue-500 cursor-pointer hover:underline">{qt.rfpReference.rfpId}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* View Quotation Modal */}
      {selectedQuotation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Quotation Details</h2>
                <p className="text-sm text-slate-500 mt-1">{selectedQuotation.quotationNo || selectedQuotation.quotationId}</p>
              </div>
              <button onClick={() => setSelectedQuotation(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Vendor</p>
                  <p className="text-slate-900 font-semibold">{selectedQuotation.vendorName || selectedQuotation.vendor || 'TBD'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Total Amount</p>
                  <p className="font-bold text-emerald-600">₹{displayTotalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Valid Until</p>
                  <p className="text-slate-900 font-semibold">{new Date(selectedQuotation.validUntil).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${selectedQuotation.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                    {selectedQuotation.status === 'Pending' ? 'Pending Admin Approval' : selectedQuotation.status}
                  </span>
                </div>
                {selectedQuotation.rfpReference && (
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Related RFP</p>
                    <p className="text-blue-600 font-semibold">{selectedQuotation.rfpReference.rfpId}</p>
                  </div>
                )}
                {selectedQuotation.notes && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-slate-500 mb-1">Notes / Terms</p>
                    <p className="text-slate-900 bg-slate-50 p-4 rounded-xl text-sm border border-slate-100">{selectedQuotation.notes}</p>
                  </div>
                )}
              </div>
              
              {quotationItems.length > 0 && (
                <>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Quoted Items</h3>
                  <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-4 py-3 text-sm font-semibold text-slate-700">Item</th>
                          <th className="px-4 py-3 text-sm font-semibold text-slate-700 text-center">Qty</th>
                          <th className="px-4 py-3 text-sm font-semibold text-slate-700 text-right">Unit Price</th>
                          <th className="px-4 py-3 text-sm font-semibold text-slate-700 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {quotationItems.map((item, i) => (
                          <tr key={i} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 text-sm text-slate-900">{item.name || item.productName || `${item.brand} ${item.category} (${item.model})`}</td>
                            <td className="px-4 py-3 text-sm text-slate-900 text-center font-medium">{item.quantity}</td>
                            <td className="px-4 py-3 text-sm text-slate-900 text-right font-medium">₹{item.unitPrice?.toLocaleString('en-IN') || 0}</td>
                            <td className="px-4 py-3 text-sm text-slate-900 text-right font-medium">₹{(item.totalAmount || ((item.quantity || 0) * (item.unitPrice || 0) * 1.18)).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setSelectedQuotation(null)} className="px-6 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-100 transition-colors">
                Close
              </button>
              {selectedQuotation.status === 'Pending' && (
                <button disabled className="px-6 py-2 bg-slate-200 text-slate-500 font-medium rounded-lg cursor-not-allowed" title="Awaiting admin approval">
                  Accept Quotation
                </button>
              )}
              {selectedQuotation.status !== 'Pending' && (
                <button 
                  onClick={() => navigate('/channel/checkout', { state: { quotation: selectedQuotation, displayTotalAmount } })} 
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Proceed to Checkout
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
