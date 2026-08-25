import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios';
import { motion } from 'framer-motion';
import { ClipboardList, FileText, ArrowRightLeft, Download, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { printInvoice } from '../../../utils/printUtils';

export default function AuditLogs() {
  const [logs, setLogs] = useState({ creditTransactions: [], invoices: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('transactions');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await axios.get(`/api/admin/audit`);
      setLogs(response.data);
    } catch (error) {
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <ClipboardList className="mr-2 text-rose-500" size={28} />
          System Audit Logs
        </h2>
        <p className="text-gray-500 mt-1">Immutable ledger for tamper detection, wallet deductions, and invoice generation.</p>
      </div>

      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('transactions')}
          className={`pb-4 px-4 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'transactions' ? 'border-rose-500 text-rose-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center">
            <ArrowRightLeft size={18} className="mr-2" />
            Credit Transactions
          </div>
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={`pb-4 px-4 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'invoices' ? 'border-rose-500 text-rose-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center">
            <FileText size={18} className="mr-2" />
            Invoice Ledger
          </div>
        </button>
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
                {activeTab === 'transactions' ? (
                  <>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Invoice No.</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Store ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600 mx-auto"></div>
                  </td>
                </tr>
              ) : activeTab === 'transactions' && logs.creditTransactions.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No transactions recorded.</td></tr>
              ) : activeTab === 'invoices' && logs.invoices.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No invoices recorded.</td></tr>
              ) : activeTab === 'transactions' ? (
                logs.creditTransactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(tx.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tx.userId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        tx.type === 'Deducted' || tx.type === 'Decreased' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${
                      tx.type === 'Deducted' || tx.type === 'Decreased' ? 'text-red-600' : 'text-emerald-600'
                    }`}>
                      ₹{tx.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{tx.description}</td>
                  </tr>
                ))
              ) : (
                logs.invoices.map((inv) => (
                  <tr key={inv._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(inv.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 flex items-center gap-3">
                      <span className="hover:underline cursor-pointer" onClick={() => printInvoice({ invoice: inv, preview: true })} title="View Invoice">
                        {inv.invoiceNumber}
                      </span>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Eye size={16} className="hover:text-blue-600 transition-colors cursor-pointer" onClick={() => printInvoice({ invoice: inv, preview: true })} title="View Invoice PDF" />
                        <Download size={16} className="hover:text-blue-600 transition-colors cursor-pointer" onClick={() => printInvoice({ invoice: inv })} title="Download Invoice PDF" />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{inv.storeId || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        inv.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 
                        inv.paymentStatus === 'Overdue' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {inv.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">₹{inv.amount.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
