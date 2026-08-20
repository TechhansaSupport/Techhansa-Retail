import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { IndianRupee, Clock, Search, X, CheckCircle, XCircle, FileText, Image as ImageIcon, Eye, List } from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthContext } from '../../../context/AuthContext';
import { useContext } from 'react';

export default function FinanceDashboard() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [storeLedger, setStoreLedger] = useState([]);
  const [loadingLedger, setLoadingLedger] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(20);

  const { user } = useContext(AuthContext) || { user: null };

  useEffect(() => {
    fetchPayments(currentPage);
  }, [currentPage]);

  const fetchPayments = async (page = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/finance/pending-payments?page=${page}&limit=${limit}`);
      setPayments(res.data.payments || res.data);
      if (res.data.totalPages) {
        setTotalPages(res.data.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch payments', error);
      toast.error('Failed to load pending payments');
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(p => 
    p.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.utrNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.storeId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);
  };

  const handleAction = async (action, paymentObj = selectedPayment) => {
    if (!paymentObj) return;
    setIsProcessing(true);
    try {
      const endpoint = action === 'approve' 
        ? `/api/finance/approve/${encodeURIComponent(paymentObj.orderType)}/${paymentObj._id}`
        : `/api/finance/reject/${encodeURIComponent(paymentObj.orderType)}/${paymentObj._id}`;
        
      await axios.post(endpoint);
      
      toast.success(`Payment ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      if (paymentObj === selectedPayment) {
        setIsModalOpen(false);
      }
      fetchPayments();
    } catch (error) {
      toast.error(`Failed to ${action} payment`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendInvoice = async (payment) => {
    try {
      await axios.post(`/api/admin/orders/${payment._id}/invoice`);
      toast.success('Invoice generated and sent successfully');
      setPayments(prev => prev.map(p => p._id === payment._id ? { ...p, invoiceSent: true } : p));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send invoice');
    }
  };

  const pendingCount = payments.filter(p => p.status !== 'Paid').length;
  const pendingValue = payments.filter(p => p.status !== 'Paid').reduce((acc, p) => acc + (p.amount || 0), 0);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 mb-2">
            <IndianRupee className="w-8 h-8 text-emerald-600" />
            Payment Approvals
          </h1>
          <p className="text-slate-500 font-medium">Verify UTR and approve pending transactions</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Pending Approvals</div>
            <div className="text-2xl font-black text-slate-900">{payments.length}</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Value Pending</div>
            <div className="text-2xl font-black text-slate-900">
              {formatCurrency(payments.reduce((acc, p) => acc + p.amount, 0))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by ID, UTR or Store ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-bold">
                <th className="p-4 pl-6 whitespace-nowrap">Transaction ID</th>
                <th className="p-4 whitespace-nowrap">Date</th>
                <th className="p-4 whitespace-nowrap">Origin</th>
                <th className="p-4 whitespace-nowrap">Method</th>
                <th className="p-4 whitespace-nowrap">UTR Number</th>
                <th className="p-4 text-right whitespace-nowrap">Amount</th>
                <th className="p-4 pr-6 text-right whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400 font-medium">Loading payments...</td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="text-slate-500 font-medium">No pending payments to review!</p>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="font-bold text-slate-900">{payment.transactionId}</div>
                      <div className="text-xs text-slate-500">{payment.storeId}</div>
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      {new Date(payment.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        payment.orderType.includes('Channel') 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'bg-purple-50 text-purple-700'
                      }`}>
                        {payment.orderType}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-slate-700">
                        <FileText className="w-4 h-4 text-slate-400" />
                        {payment.paymentMethod}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-mono text-sm text-slate-800 bg-slate-100 px-2 py-1 rounded inline-block">
                        {payment.utrNumber}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="font-bold text-slate-900">{formatCurrency(payment.amount)}</div>
                    </td>
                    <td className="p-4 pr-6 text-right flex justify-end gap-2 items-center">
                      {payment.status === 'Paid' ? (
                        <>
                          <button 
                            onClick={async () => {
                              setSelectedPayment(payment);
                              setIsModalOpen(true);
                              setLoadingLedger(true);
                              try {
                                const res = await axios.get(`/api/franchise/${payment.storeId}/wallet`);
                                setStoreLedger(res.data.data || []);
                              } catch(e) {
                                setStoreLedger([]);
                              } finally {
                                setLoadingLedger(false);
                              }
                            }}
                            className="p-1.5 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors border border-transparent hover:border-indigo-100"
                            title="View Payment Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Paid</span>
                          {(user?.role === 'finance_manager' || user?.role === 'admin') && (
                            !payment.invoiceSent ? (
                              <button 
                                onClick={() => handleSendInvoice(payment)}
                                className="px-4 py-1.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-sm text-sm"
                              >
                                Send Invoice
                              </button>
                            ) : (
                              <span className="px-3 py-1.5 bg-slate-100 text-slate-500 font-semibold rounded-lg text-sm border border-slate-200">
                                Invoice Sent
                              </span>
                            )
                          )}
                        </>
                      ) : payment.status === 'Rejected' ? (
                        <>
                          <button 
                            onClick={() => {
                              setSelectedPayment(payment);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors border border-transparent hover:border-rose-100"
                            title="View Payment Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <span className="px-3 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-full">Rejected</span>
                        </>
                      ) : (
                        <div className="flex items-center justify-end gap-1.5">
                          <button 
                            onClick={() => handleAction('approve', payment)}
                            className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-all border border-emerald-100 hover:border-emerald-200 hover:scale-105"
                            title="Quick Approve"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleAction('reject', payment)}
                            className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-all border border-rose-100 hover:border-rose-200 hover:scale-105"
                            title="Quick Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={async () => {
                              setSelectedPayment(payment);
                              setIsModalOpen(true);
                              setLoadingLedger(true);
                              try {
                                const res = await axios.get(`/api/franchise/${payment.storeId}/wallet`);
                                setStoreLedger(res.data.data || []);
                              } catch(e) {
                                setStoreLedger([]);
                              } finally {
                                setLoadingLedger(false);
                              }
                            }}
                            className="px-4 py-1.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-all shadow-sm flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Review
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 rounded-b-2xl">
            <span className="text-sm text-slate-500 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {isModalOpen && selectedPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-1">Verify Payment</h2>
                  <p className="text-sm text-slate-500">Review the UTR and receipt to approve or reject this transaction.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto">
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Transaction ID</div>
                    <div className="font-semibold text-slate-900">{selectedPayment.transactionId}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Amount</div>
                    <div className="font-bold text-emerald-600 text-lg">{formatCurrency(selectedPayment.amount)}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Payment Method</div>
                    <div className="font-semibold text-slate-900">{selectedPayment.paymentMethod}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Date</div>
                    <div className="font-semibold text-slate-900">{new Date(selectedPayment.date).toLocaleString()}</div>
                  </div>
                  <div className="col-span-2 p-4 bg-yellow-50 border border-yellow-100 rounded-xl">
                    <div className="text-xs font-bold text-yellow-800 uppercase tracking-wider mb-1">UTR / Ref Number</div>
                    <div className="font-mono text-lg font-bold text-yellow-900 tracking-wide">{selectedPayment.utrNumber}</div>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Uploaded Receipt
                  </div>
                  {selectedPayment.receiptUrl ? (
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-2 bg-slate-50 flex items-center justify-center min-h-[200px]">
                      <img 
                        src={selectedPayment.receiptUrl.startsWith('http') ? selectedPayment.receiptUrl : `http://localhost:5000${selectedPayment.receiptUrl}`} 
                        alt="Payment Receipt" 
                        className="max-w-full max-h-[400px] object-contain rounded-lg shadow-sm"
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                      />
                      <div className="hidden text-slate-400 font-medium p-8 text-center">
                        Image failed to load
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 bg-slate-50 flex items-center justify-center text-slate-400 font-medium">
                      No receipt uploaded
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <List className="w-4 h-4" />
                    Store Credit Ledger
                  </div>
                  {loadingLedger ? (
                    <div className="text-center text-slate-400 py-4 text-sm font-medium">Loading ledger...</div>
                  ) : storeLedger.length === 0 ? (
                    <div className="text-center text-slate-400 py-4 text-sm font-medium">No ledger history found</div>
                  ) : (
                    <div className="space-y-3">
                      {storeLedger.slice(0, 5).map((txn, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                          <div>
                            <div className="font-semibold text-sm text-slate-800">{txn.description || txn.txnId}</div>
                            <div className="text-xs text-slate-500">{new Date(txn.date).toLocaleDateString()} &middot; {txn.type}</div>
                          </div>
                          <div className={`font-bold ${txn.type === 'Credit In' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {txn.type === 'Credit In' ? '+' : '-'}{formatCurrency(txn.amount)}
                          </div>
                        </div>
                      ))}
                      {storeLedger.length > 5 && (
                         <div className="text-center text-xs text-slate-400 font-medium pt-2">
                            Showing 5 of {storeLedger.length} transactions
                         </div>
                      )}
                    </div>
                  )}
                </div>

              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3 justify-end">
                {selectedPayment.status === 'Paid' ? (
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                  >
                    Close
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleAction('reject')}
                      disabled={isProcessing}
                      className="px-6 py-2.5 bg-white border border-rose-200 text-rose-600 font-bold rounded-xl hover:bg-rose-50 hover:border-rose-300 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleAction('approve')}
                      disabled={isProcessing}
                      className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-sm hover:shadow disabled:opacity-50 flex items-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Approve Payment
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
