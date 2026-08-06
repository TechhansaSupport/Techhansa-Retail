import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Search, Receipt, Download, ExternalLink, Eye, XCircle, Printer } from 'lucide-react';
import { printInvoice } from '../../../utils/printUtils';
import { AuthContext } from '../../../context/AuthContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function Invoices() {
  const { user } = useContext(AuthContext) || { user: null };
  const [invoices, setInvoices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [rfps, setRfps] = useState([]);

  useEffect(() => {
    if (user?.userId) {
      fetchInvoices();
      fetchRfps();
    }
  }, [user]);

  const fetchInvoices = async () => {
    if (!user?.userId) return;
    try {
      const res = await fetch(`http://localhost:5000/api/procurement/invoices?userId=${user.userId}`);
      const data = await res.json();
      setInvoices(data);
    } catch (err) {
      console.error('Failed to fetch invoices', err);
    }
  };

  const fetchRfps = async () => {
    if (!user?.userId) return;
    try {
      const res = await fetch(`http://localhost:5000/api/procurement/rfp?userId=${user.userId}`);
      const data = await res.json();
      setRfps(data);
    } catch (err) {
      console.error('Failed to fetch RFPs', err);
    }
  };

  const filteredInvoices = invoices.filter(i => {
    const invId = i.invoiceNumber || i.invoiceId || '';
    return invId.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const selectedRfp = selectedInvoice ? rfps.find(r => r.rfpId === selectedInvoice.invoiceNumber?.replace('INV-', '')) : null;
  const invoiceItems = selectedInvoice?.items || selectedRfp?.products || [];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-[1600px] mx-auto pb-12 space-y-6">
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Invoices</h1>
          <p className="text-slate-500 text-sm mt-1">Review and download your procurement invoices.</p>
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
              placeholder="Search by Invoice ID..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            />
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-3">
        {filteredInvoices.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-12 text-center text-slate-500">
            No invoices found.
          </div>
        ) : (
          filteredInvoices.map((inv) => (
            <motion.div key={inv._id} variants={itemVariants} className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-bold text-blue-600 text-sm cursor-pointer hover:underline">{inv.invoiceNumber || inv.invoiceId}</span>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${inv.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {(inv.paymentStatus === 'Unpaid' && inv.amount === 0) ? 'Pending Admin Approval' : (inv.paymentStatus || 'Pending')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setSelectedInvoice(inv)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 mt-4">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-medium">Amount:</span>
                  <span className="text-slate-700 font-semibold text-emerald-600">₹{inv.amount?.toLocaleString('en-IN') || 0}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-medium">Date:</span>
                  <span className="text-slate-700">{new Date(inv.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* View Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Invoice Details</h2>
                <p className="text-sm text-slate-500 mt-1">{selectedInvoice.invoiceNumber || selectedInvoice.invoiceId}</p>
              </div>
              <button onClick={() => setSelectedInvoice(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Invoice Amount</p>
                  <p className="text-emerald-600 font-semibold">₹{selectedInvoice.amount?.toLocaleString('en-IN') || 0}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Invoice Date</p>
                  <p className="text-slate-900 font-semibold">{new Date(selectedInvoice.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Payment Status</p>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${selectedInvoice.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {(selectedInvoice.paymentStatus === 'Unpaid' && selectedInvoice.amount === 0) ? 'Pending Admin Approval' : (selectedInvoice.paymentStatus || 'Pending')}
                  </span>
                </div>
                {selectedInvoice.orderReference && (
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">Related Order</p>
                    <p className="text-blue-600 font-semibold">{selectedInvoice.orderReference?.orderId || selectedInvoice.orderReference?._id || (typeof selectedInvoice.orderReference === 'string' ? selectedInvoice.orderReference : 'View Order')}</p>
                  </div>
                )}
              </div>

              {invoiceItems.length > 0 && (
                <>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Invoice Items</h3>
                  <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-4 py-3 text-sm font-semibold text-slate-700">Item</th>
                          <th className="px-4 py-3 text-sm font-semibold text-slate-700 text-center">HSN</th>
                          <th className="px-4 py-3 text-sm font-semibold text-slate-700 text-center">Qty</th>
                          <th className="px-4 py-3 text-sm font-semibold text-slate-700 text-right">Rate</th>
                          <th className="px-4 py-3 text-sm font-semibold text-slate-700 text-right">GST (18%)</th>
                          <th className="px-4 py-3 text-sm font-semibold text-slate-700 text-right">Total Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {invoiceItems.map((item, i) => {
                          const rate = item.rate || item.unitPrice || 0;
                          const qty = item.quantity || 0;
                          const hsn = item.hsn || '-';
                          const gstRate = item.taxRate || 18;
                          const taxableValue = rate * qty;
                          const gstAmount = taxableValue * (gstRate / 100);
                          const totalAmount = taxableValue + gstAmount;

                          return (
                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                              <td className="px-4 py-3 text-sm text-slate-900">{item.name || item.productName || `${item.brand} ${item.category} (${item.model})`}</td>
                              <td className="px-4 py-3 text-sm text-slate-900 text-center">{hsn}</td>
                              <td className="px-4 py-3 text-sm text-slate-900 text-center font-medium">{qty}</td>
                              <td className="px-4 py-3 text-sm text-slate-900 text-right font-medium">₹{rate.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                              <td className="px-4 py-3 text-sm text-slate-900 text-right font-medium text-slate-500">
                                ₹{gstAmount.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                              </td>
                              <td className="px-4 py-3 text-sm text-slate-900 text-right font-bold text-emerald-600">
                                ₹{totalAmount.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot className="bg-slate-50 border-t border-slate-200">
                        <tr>
                          <td colSpan="5" className="px-4 py-3 text-sm font-bold text-slate-700 text-right">Grand Total:</td>
                          <td className="px-4 py-3 text-sm font-bold text-emerald-700 text-right">
                            ₹{invoiceItems.reduce((acc, item) => {
                               const r = item.rate || item.unitPrice || 0;
                               const q = item.quantity || 0;
                               const gRate = item.taxRate || 18;
                               const tVal = r * q;
                               return acc + tVal + (tVal * (gRate / 100));
                            }, 0).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setSelectedInvoice(null)} className="px-6 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-100 transition-colors">
                Close
              </button>
              <button onClick={() => printInvoice(selectedInvoice)} className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm">
                <Printer className="w-4 h-4" /> Print PDF
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
