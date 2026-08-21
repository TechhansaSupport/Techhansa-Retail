import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, ArrowUpRight, ArrowDownRight, RefreshCcw, CreditCard, ExternalLink, XCircle, Package } from 'lucide-react';
import { exportToCSV } from '../../../utils/exportUtils';
import { AuthContext } from '../../../context/AuthContext';
import { Link } from 'react-router-dom';
import { fetchWithAuth } from '../../../utils/api.js';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function CreditHistory() {
  const { user } = useContext(AuthContext) || {};
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    if (user?.userId) {
      fetchTransactions();
    }
  }, [user]);
  
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/api/procurement/credit-transactions?userId=${user.userId}`);
      const data = await res.json();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch credit transactions', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTx = transactions.filter(tx => {
    const term = searchQuery.toLowerCase();
    return (tx.referenceId && tx.referenceId.toLowerCase().includes(term)) || 
           (tx.description && tx.description.toLowerCase().includes(term)) ||
           (tx.type && tx.type.toLowerCase().includes(term));
  });

  const formatCurrency = (num) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);

  const getTransactionIcon = (type) => {
    if (['Assigned', 'Increased', 'Refunded', 'Released'].includes(type)) {
      return <ArrowUpRight className="w-5 h-5 text-emerald-600" />;
    }
    return <ArrowDownRight className="w-5 h-5 text-red-600" />;
  };

  const getTransactionColor = (type) => {
    if (['Assigned', 'Increased', 'Refunded', 'Released'].includes(type)) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    return 'bg-red-50 text-red-700 border-red-200';
  };

  const getAmountPrefix = (type) => {
    if (['Assigned', 'Increased', 'Refunded', 'Released'].includes(type)) return '+';
    return '-';
  };

  const handleTransactionClick = async (tx) => {
    if (!tx.referenceId || !tx.referenceId.startsWith('ORD-')) return;
    
    setModalLoading(true);
    setIsModalOpen(true);
    
    try {
      const res = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/api/procurement/orders/${tx.referenceId}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedOrder(data);
      } else {
        setSelectedOrder(null);
      }
    } catch (err) {
      console.error('Failed to fetch order details', err);
      setSelectedOrder(null);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-[1600px] mx-auto pb-12 space-y-6">
      
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-blue-600" /> 
            Credit History Ledger
          </h1>
          <p className="text-slate-500 text-sm mt-1">View all credit limit assignments, deductions, and reservations.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/channel" className="px-4 py-2 border border-slate-200 text-slate-700 bg-white rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
            Back to Dashboard
          </Link>
        </div>
      </motion.div>

      {/* Stats Summary */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Available Credit</p>
          <div className="text-2xl font-bold text-emerald-600">{formatCurrency((user?.totalCredit || 0) - (user?.usedCredit || 0))}</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Limit</p>
          <div className="text-2xl font-bold text-slate-900">{formatCurrency(user?.totalCredit || 0)}</div>
        </div>
      </motion.div>

      {/* Search & Filter */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID, reference, or type..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button onClick={fetchTransactions} className="p-2.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors" title="Refresh">
              <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={() => exportToCSV('credit_history.csv', filteredTx, [
              { key: 'date', label: 'Date' },
              { key: 'type', label: 'Type' },
              { key: 'amount', label: 'Amount' },
              { key: 'referenceId', label: 'Reference' },
              { key: 'description', label: 'Description' }
            ])} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
        </div>
      </motion.div>

      {/* Transaction List */}
      <motion.div variants={itemVariants} className="space-y-3">
        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading history...</div>
        ) : filteredTx.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-12 text-center text-slate-500">
            No transactions found.
          </div>
        ) : (
          filteredTx.map((tx) => (
            <motion.div 
              key={tx._id} 
              variants={itemVariants} 
              onClick={() => handleTransactionClick(tx)}
              className={`bg-white rounded-xl border border-slate-100 shadow-sm transition-all p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 ${tx.referenceId?.startsWith('ORD-') ? 'cursor-pointer hover:shadow-md hover:border-blue-200 group' : ''}`}
            >
              
              <div className={`p-3 rounded-xl border shrink-0 ${getTransactionColor(tx.type).replace('text-', 'bg-').replace('50', '50/50')}`}>
                {getTransactionIcon(tx.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-base font-bold text-slate-900 truncate">{tx.description}</h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${getTransactionColor(tx.type)}`}>
                    {tx.type}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                  <span>{new Date(tx.date || tx.createdAt).toLocaleString()}</span>
                  {tx.referenceId && (
                    <span className="flex items-center gap-1">
                      <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                      Ref: <span className="font-semibold text-slate-700">{tx.referenceId}</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="text-left md:text-right w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                <p className={`text-lg font-bold ${['Assigned', 'Increased', 'Refunded', 'Released'].includes(tx.type) ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {getAmountPrefix(tx.type)}{formatCurrency(tx.amount)}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Transaction Detail Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  Transaction Details
                </h2>
                <p className="text-sm text-slate-500 mt-1">Order and Product breakdown for this reservation/deduction.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {modalLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <RefreshCcw className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                  <p className="text-slate-500 font-medium">Fetching order details...</p>
                </div>
              ) : selectedOrder ? (
                <div className="space-y-8">
                  
                  {/* Order Overview */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-100">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Order ID</p>
                      <p className="text-slate-900 font-bold">{selectedOrder.orderNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Order Status</p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-700">
                        {selectedOrder.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Order Date</p>
                      <p className="text-slate-900 font-semibold">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Amount</p>
                      <p className="text-slate-900 font-bold">{formatCurrency(selectedOrder.totalAmount)}</p>
                    </div>
                  </div>

                  {/* Vendor & Quotation info if available */}
                  {selectedOrder.quotationReference && (
                    <div>
                      <h3 className="text-base font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">Quotation Details</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="text-slate-500">Quotation No:</span> <span className="font-semibold text-slate-700">{selectedOrder.quotationReference.quotationNo}</span></div>
                        <div><span className="text-slate-500">Assigned Vendor:</span> <span className="font-semibold text-slate-700">{selectedOrder.quotationReference.vendor || 'N/A'}</span></div>
                      </div>
                    </div>
                  )}

                  {/* Product List */}
                  {selectedOrder.quotationReference?.rfpReference?.products && (
                    <div>
                      <h3 className="text-base font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">Products Reserved</h3>
                      <div className="border border-slate-200 rounded-xl overflow-hidden">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                              <th className="px-4 py-3 text-sm font-semibold text-slate-700">Category</th>
                              <th className="px-4 py-3 text-sm font-semibold text-slate-700">Brand / Model</th>
                              <th className="px-4 py-3 text-sm font-semibold text-slate-700">Configuration</th>
                              <th className="px-4 py-3 text-sm font-semibold text-slate-700 text-center">Qty</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {selectedOrder.quotationReference.rfpReference.products.map((p, i) => (
                              <tr key={i} className="hover:bg-slate-50 transition-colors">
                                <td className="px-4 py-3 text-sm text-slate-900">{p.category}</td>
                                <td className="px-4 py-3 text-sm text-slate-900">{p.brand} {p.model}</td>
                                <td className="px-4 py-3 text-sm text-slate-600 max-w-[200px] truncate" title={p.configuration}>{p.configuration || 'Standard'}</td>
                                <td className="px-4 py-3 text-sm text-slate-900 text-center font-bold bg-slate-50/50">{p.quantity}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                <div className="text-center py-12">
                  <XCircle className="w-12 h-12 text-red-300 mx-auto mb-3" />
                  <p className="text-slate-900 font-bold text-lg">Order Details Not Found</p>
                  <p className="text-slate-500 mt-1">This transaction might not be linked to a specific order, or the order was deleted.</p>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-100 transition-colors shadow-sm">
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </motion.div>
  );
}
