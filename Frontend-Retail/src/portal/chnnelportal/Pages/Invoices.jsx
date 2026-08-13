import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Search, Receipt, Download, ExternalLink, Eye, XCircle, Printer } from 'lucide-react';
import { printInvoice } from '../../../utils/printUtils';
import { AuthContext } from '../../../context/AuthContext';
import { numberToWords } from '../../../utils/numberToWords';

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
  const [companySettings, setCompanySettings] = useState(null);

  useEffect(() => {
    if (user?.userId) {
      fetchInvoices();
      fetchRfps();
      fetchCompanySettings();
    }
  }, [user]);

  const fetchCompanySettings = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/settings/company`);
      const data = await res.json();
      setCompanySettings(data);
    } catch (err) {
      console.error('Failed to fetch company settings', err);
    }
  };

  const fetchInvoices = async () => {
    if (!user?.userId) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/procurement/invoices?userId=${user.userId}`);
      const data = await res.json();
      setInvoices(data);
    } catch (err) {
      console.error('Failed to fetch invoices', err);
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

  const filteredInvoices = invoices.filter(i => {
    const invId = i.invoiceNumber || i.invoiceId || '';
    return invId.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const orderRefForRfp = selectedInvoice?.orderReference?.orderId || selectedInvoice?.orderReference?.orderNumber || (typeof selectedInvoice?.orderReference === 'string' ? selectedInvoice?.orderReference : '');
  const selectedRfp = selectedInvoice?.orderReference?.quotationReference?.rfpReference || (selectedInvoice ? rfps.find(r => r.rfpId === orderRefForRfp?.replace('ORD-', '')) : null);
  const invoiceItems = selectedInvoice?.items || selectedRfp?.products || [];

  const totalQtyAcrossAllItems = invoiceItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const totalAmountFromInvoice = selectedInvoice?.amount || 0;
  const assumedRate = totalQtyAcrossAllItems > 0 ? (totalAmountFromInvoice / 1.18) / totalQtyAcrossAllItems : 0;

  const calculatedTotalAmount = invoiceItems.reduce((acc, item) => {
    const rate = item.rate || item.unitPrice || assumedRate;
    const qty = item.quantity || 0;
    const taxRate = item.taxRate || 18;
    return acc + (rate * qty * (1 + (taxRate / 100)));
  }, 0);
  const finalTotalAmount = selectedInvoice?.amount || calculatedTotalAmount;
  const displayReceivedAmount = selectedInvoice?.receivedAmount || 0;
  const isPaid = selectedInvoice?.paymentStatus === 'Paid';
  const calculatedBalance = Math.max(0, finalTotalAmount - displayReceivedAmount);
  const displayBalanceAmount = isPaid ? 0 : (selectedInvoice?.balanceAmount || calculatedBalance);

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
            className="bg-white rounded-2xl shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col"
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

              {/* Professional Invoice Header */}
              <div className="flex flex-col md:flex-row border border-slate-700 mb-6">

                {/* Left Side: Company & Buyer Details */}
                <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r border-slate-700">
                  {/* Company Details */}
                  <div className="p-4 border-b border-slate-700">
                    <h3 className="font-bold text-slate-900">{companySettings?.companyName || 'Company Name'}</h3>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{companySettings?.registeredAddress || 'Address'}</p>
                    <div className="mt-2 text-sm text-slate-700 space-y-0.5">
                      <p><strong>GSTIN/UIN:</strong> {companySettings?.gstin || 'N/A'}</p>
                      <p><strong>State Name:</strong> {companySettings?.stateName || 'N/A'}</p>
                      <p><strong>Contact:</strong> {companySettings?.contactNumber || 'N/A'}</p>
                      <p><strong>E-Mail:</strong> {companySettings?.email || 'N/A'}</p>
                    </div>
                  </div>
                  {/* Buyer Details */}
                  <div className="p-4 flex-1">
                    <h4 className="text-sm text-slate-500 mb-1">Buyer (Bill to)</h4>
                    <p className="font-bold text-slate-900">{user?.companyName || user?.name || 'Buyer Name'}</p>
                    <p className="text-sm text-slate-700">{user?.address || 'Buyer Address'}</p>
                    <p className="text-sm text-slate-700 mt-1"><strong>Phone:</strong> {user?.phone || 'N/A'}</p>
                    <p className="text-sm text-slate-700"><strong>Email:</strong> {user?.email || 'N/A'}</p>
                  </div>
                </div>

                {/* Right Side: Invoice Meta Details */}
                <div className="flex-1 flex flex-col">
                  <div className="flex border-b border-slate-700">
                    <div className="flex-1 p-4 border-r border-slate-700">
                      <p className="text-sm text-slate-500">Invoice No.</p>
                      <p className="font-bold text-slate-900">{selectedInvoice.invoiceNumber || selectedInvoice.invoiceId}</p>
                    </div>
                    <div className="flex-1 p-4">
                      <p className="text-sm text-slate-500">Dated</p>
                      <p className="font-bold text-slate-900">{new Date(selectedInvoice.createdAt).toLocaleDateString('en-GB')}</p>
                    </div>
                  </div>
                  <div className="flex border-b border-slate-700">
                    <div className="flex-1 p-4 border-r border-slate-700">
                      <p className="text-sm text-slate-500">Related Order</p>
                      <p className="font-bold text-slate-900">{selectedInvoice.orderReference?.orderId || selectedInvoice.orderReference?.orderNumber || (typeof selectedInvoice.orderReference === 'string' ? selectedInvoice.orderReference : 'N/A')}</p>
                    </div>
                    <div className="flex-1 p-4">
                      <p className="text-sm text-slate-500">Mode/Terms of Payment</p>
                      <p className="font-bold text-slate-900">{selectedInvoice.paymentStatus || 'Pending'}</p>
                    </div>
                  </div>
                  <div className="flex-1 p-4 border-b border-slate-700 flex flex-col justify-center">
                    <p className="text-sm text-slate-500">Country</p>
                    <p className="font-bold text-slate-900">India</p>
                  </div>
                  <div className="flex-1 p-4">
                    <p className="text-sm text-slate-500">Terms of Delivery</p>
                    <p className="font-bold text-slate-900">As per standard terms</p>
                  </div>
                </div>
              </div>

              {invoiceItems.length > 0 && (
                <>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Invoice Items</h3>
                  <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-4 py-3 text-sm font-semibold text-slate-700 whitespace-nowrap">Serial No.</th>
                          <th className="px-4 py-3 text-sm font-semibold text-slate-700 whitespace-nowrap">Item / Category</th>
                          <th className="px-4 py-3 text-sm font-semibold text-slate-700 whitespace-nowrap">Brand</th>
                          <th className="px-4 py-3 text-sm font-semibold text-slate-700 whitespace-nowrap">Model</th>
                          <th className="px-4 py-3 text-sm font-semibold text-slate-700 whitespace-nowrap">Configuration</th>
                          <th className="px-4 py-3 text-sm font-semibold text-slate-700 whitespace-nowrap">Purchase Date</th>
                          <th className="px-4 py-3 text-sm font-semibold text-slate-700 text-center whitespace-nowrap">HSN</th>
                          <th className="px-4 py-3 text-sm font-semibold text-slate-700 text-center whitespace-nowrap">Qty</th>
                          <th className="px-4 py-3 text-sm font-semibold text-slate-700 text-right whitespace-nowrap">Rate</th>
                          <th className="px-4 py-3 text-sm font-semibold text-slate-700 text-right whitespace-nowrap">GST Amount</th>
                          <th className="px-4 py-3 text-sm font-semibold text-slate-700 text-right whitespace-nowrap">Total Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {invoiceItems.map((item, i) => {
                          const rate = item.rate || item.unitPrice || assumedRate;
                          const qty = item.quantity || 0;
                          const hsn = item.hsn || '-';
                          const gstRate = item.taxRate || 18;
                          const taxableValue = rate * qty;
                          const gstAmount = taxableValue * (gstRate / 100);
                          const totalAmount = taxableValue + gstAmount;

                          return (
                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                              <td className="px-4 py-3 text-sm text-slate-900 font-medium text-center">{i + 1}</td>
                              <td className="px-4 py-3 text-sm text-slate-900">{item.name || item.productName || item.category || '-'}</td>
                              <td className="px-4 py-3 text-sm text-slate-900">{item.brand || '-'}</td>
                              <td className="px-4 py-3 text-sm text-slate-900">{item.model || '-'}</td>
                              <td className="px-4 py-3 text-sm text-slate-500 whitespace-pre-wrap">{item.configuration || item.specs || item.details || '-'}</td>
                              <td className="px-4 py-3 text-sm text-slate-500">{new Date(selectedRfp?.createdAt || selectedInvoice.createdAt).toLocaleDateString()}</td>
                              <td className="px-4 py-3 text-sm text-slate-900 text-center">{hsn}</td>
                              <td className="px-4 py-3 text-sm text-slate-900 text-center font-medium">{qty}</td>
                              <td className="px-4 py-3 text-sm text-slate-900 text-right font-medium">₹{rate.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                              <td className="px-4 py-3 text-sm text-slate-900 text-right font-medium text-slate-500">
                                ₹{gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td className="px-4 py-3 text-sm text-slate-900 text-right font-bold text-emerald-600">
                                ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot className="bg-slate-50 border-t border-slate-200">
                        <tr>
                          <td colSpan="7" className="px-4 py-3 text-sm font-bold text-slate-700 text-right">TOTAL</td>
                          <td className="px-4 py-3 text-sm font-bold text-slate-900 text-center">{selectedInvoice.totalQuantity || invoiceItems.reduce((acc, item) => acc + (item.quantity || 0), 0)}</td>
                          <td className="px-4 py-3 text-sm font-bold text-slate-900 text-center text-slate-400">-</td>
                          <td className="px-4 py-3 text-sm font-bold text-slate-700 text-right">
                            {(() => {
                              const totalGst = invoiceItems.reduce((acc, item) => {
                                const r = item.rate || item.unitPrice || assumedRate;
                                const q = item.quantity || 0;
                                const gRate = item.taxRate || 18;
                                return acc + (r * q * (gRate / 100));
                              }, 0);
                              return `₹${totalGst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                            })()}
                          </td>
                          <td className="px-4 py-3 text-sm font-bold text-emerald-700 text-right">
                            {(() => {
                              const amt = selectedInvoice.amount || invoiceItems.reduce((acc, item) => {
                                const r = item.rate || item.unitPrice || 0;
                                const q = item.quantity || 0;
                                const gRate = item.taxRate || 18;
                                const tVal = r * q;
                                return acc + tVal + (tVal * (gRate / 100));
                              }, 0);
                              return `₹${amt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                            })()}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* Professional Invoice Summary & Footer */}
                  <div className="border border-slate-700 border-t-0 mt-[-24px] mb-6 flex flex-col">

                    {/* Amount Chargeable (in words) */}
                    <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                      <div className="text-sm">
                        <span className="text-slate-500">Amount Chargeable (in words)</span>
                        <p className="font-bold text-slate-900 capitalize">
                          INR {numberToWords(Math.round(selectedInvoice.amount || invoiceItems.reduce((acc, item) => acc + ((item.rate || item.unitPrice || assumedRate) * (item.quantity || 0) * (1 + ((item.taxRate || 18) / 100))), 0)))} Only
                        </p>
                      </div>
                      <div className="text-sm text-right">
                        <span className="text-slate-500 italic block">E. & O.E</span>
                      </div>
                    </div>

                    {/* Taxable Value & Tax Amount */}
                    <div className="p-4 border-b border-slate-700 flex justify-between bg-slate-50">
                      <div className="text-sm w-1/2">
                        <span className="text-slate-500">Tax Amount (in words) : </span>
                        <p className="font-bold text-slate-900 capitalize">
                          INR {numberToWords(Math.round(invoiceItems.reduce((acc, item) => acc + ((item.rate || item.unitPrice || assumedRate) * (item.quantity || 0) * ((item.taxRate || 18) / 100)), 0)))} Only
                        </p>
                      </div>
                      <div className="text-sm w-1/2 flex flex-col items-end gap-1">
                        <div className="flex justify-between w-48">
                          <span className="text-slate-500">Taxable Value:</span>
                          <span className="font-bold text-slate-900">
                            ₹{invoiceItems.reduce((acc, item) => acc + ((item.rate || item.unitPrice || assumedRate) * (item.quantity || 0)), 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="flex justify-between w-48">
                          <span className="text-slate-500">Total Tax:</span>
                          <span className="font-bold text-slate-900">
                            ₹{invoiceItems.reduce((acc, item) => acc + ((item.rate || item.unitPrice || assumedRate) * (item.quantity || 0) * ((item.taxRate || 18) / 100)), 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Financial Balances (from old UI, preserved cleanly) */}
                    <div className="p-4 border-b border-slate-700 flex justify-between bg-white">
                      <div className="text-sm flex items-center gap-2">
                        <span className="text-slate-500">Received Amount:</span>
                        <span className="font-bold text-emerald-600">₹{displayReceivedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="text-sm flex items-center gap-2">
                        <span className="text-slate-500">Balance Amount:</span>
                        <span className="font-bold text-amber-600">₹{displayBalanceAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    </div>

                    {/* Bottom Section: Declaration & Bank Details */}
                    <div className="flex flex-col md:flex-row">

                      {/* Left: Declaration */}
                      <div className="flex-1 p-4 border-b md:border-b-0 md:border-r border-slate-700 flex flex-col">
                        <div className="mb-4 text-sm">
                          <p className="underline font-medium mb-1">Declaration</p>
                          <p className="text-slate-700">{companySettings?.declaration || 'We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.'}</p>
                        </div>
                      </div>

                      {/* Right: Bank Details & Signatory */}
                      <div className="flex-1 flex flex-col">
                        {/* Bank Details */}
                        <div className="p-4 border-b border-slate-700 text-sm">
                          <p className="underline font-medium mb-1">Company's Bank Details</p>
                          <div className="grid grid-cols-[120px_1fr] gap-x-2 gap-y-0.5">
                            <span className="text-slate-600">A/c Holder's Name</span>
                            <span className="font-bold text-slate-900">: {companySettings?.bankDetails?.accountHolderName || 'N/A'}</span>
                            <span className="text-slate-600">Bank Name</span>
                            <span className="font-bold text-slate-900">: {companySettings?.bankDetails?.bankName || 'N/A'}</span>
                            <span className="text-slate-600">A/c No.</span>
                            <span className="font-bold text-slate-900">: {companySettings?.bankDetails?.accountNo || 'N/A'}</span>
                            <span className="text-slate-600">Branch & IFS Code</span>
                            <span className="font-bold text-slate-900">: {companySettings?.bankDetails?.ifscCode || 'N/A'}</span>
                          </div>
                        </div>

                        {/* Signatory */}
                        <div className="p-4 flex-1 flex flex-col justify-between min-h-[120px] text-right text-sm">
                          <p className="font-bold text-slate-900">for {companySettings?.companyName || 'Techhansa Retail'}</p>
                          <div className="mt-auto">
                            <p className="text-slate-500 whitespace-pre-wrap leading-tight">{companySettings?.authorizedSignatoryText || 'Authorised Signatory'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tax Breakdown */}
                  {selectedInvoice.taxBreakdown && selectedInvoice.taxBreakdown.length > 0 && (
                    <div className="mb-6">
                      <div className="border border-slate-200 rounded-xl overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs md:text-sm min-w-[600px]">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                              <th className="px-4 py-2 font-semibold text-slate-700 whitespace-nowrap">HSN/SAC</th>
                              <th className="px-4 py-2 font-semibold text-slate-700 text-right whitespace-nowrap">Taxable Value</th>
                              <th className="px-4 py-2 font-semibold text-slate-700 text-right whitespace-nowrap">CGST Rate</th>
                              <th className="px-4 py-2 font-semibold text-slate-700 text-right whitespace-nowrap">CGST Amt</th>
                              <th className="px-4 py-2 font-semibold text-slate-700 text-right whitespace-nowrap">SGST Rate</th>
                              <th className="px-4 py-2 font-semibold text-slate-700 text-right whitespace-nowrap">SGST Amt</th>
                              <th className="px-4 py-2 font-semibold text-slate-700 text-right whitespace-nowrap">Total Tax Amount</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {selectedInvoice.taxBreakdown.map((tax, i) => (
                              <tr key={i}>
                                <td className="px-4 py-2 text-slate-900 font-medium">{tax.hsn}</td>
                                <td className="px-4 py-2 text-slate-900 text-right">₹{tax.taxableValue?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="px-4 py-2 text-slate-600 text-right">{tax.cgstRate}%</td>
                                <td className="px-4 py-2 text-slate-600 text-right">₹{tax.cgstAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="px-4 py-2 text-slate-600 text-right">{tax.sgstRate}%</td>
                                <td className="px-4 py-2 text-slate-600 text-right">₹{tax.sgstAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="px-4 py-2 font-bold text-slate-900 text-right">₹{tax.totalTaxAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Amount in words */}
                  {selectedInvoice.totalAmountInWords && (
                    <div className="mb-6 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                      <p className="text-sm font-semibold text-blue-900 mb-1">Total Amount (in words)</p>
                      <p className="text-sm text-blue-800 font-medium">{selectedInvoice.totalAmountInWords}</p>
                    </div>
                  )}

                  {/* Bank Details & Terms */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {selectedInvoice.bankDetails && selectedInvoice.bankDetails.name && (
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <h3 className="text-sm font-bold text-slate-900 mb-3">Bank Details</h3>
                        <div className="space-y-1.5 text-sm text-slate-600">
                          <p><span className="font-medium text-slate-700 inline-block w-24">Name:</span> {selectedInvoice.bankDetails.name}</p>
                          <p><span className="font-medium text-slate-700 inline-block w-24">IFSC Code:</span> {selectedInvoice.bankDetails.ifscCode}</p>
                          <p><span className="font-medium text-slate-700 inline-block w-24">Account No:</span> {selectedInvoice.bankDetails.accountNo}</p>
                          <p><span className="font-medium text-slate-700 inline-block w-24">Bank:</span> {selectedInvoice.bankDetails.bankName}</p>
                        </div>
                      </div>
                    )}

                    {selectedInvoice.termsAndConditions && selectedInvoice.termsAndConditions.length > 0 && (
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <h3 className="text-sm font-bold text-slate-900 mb-3">Terms and Conditions</h3>
                        <ol className="list-decimal list-inside space-y-1.5 text-sm text-slate-600">
                          {selectedInvoice.termsAndConditions.map((term, i) => (
                            <li key={i}>{term}</li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>

                  {/* Product Details Section */}
                  {(() => {
                    // Use stored productDetails if available, otherwise build from RFP products
                    const prodList = (selectedInvoice.productDetails && selectedInvoice.productDetails.length > 0)
                      ? selectedInvoice.productDetails
                      : (selectedRfp?.products || []).map(p => {
                          const perItemRate = assumedRate;
                          const gst = perItemRate * 0.18;
                          return {
                            productName: p.category || p.name || '-',
                            brand: p.brand || '-',
                            model: p.model || '-',
                            configuration: p.configuration || '-',
                            serialNumber: '',
                            rate: perItemRate,
                            gstAmount: gst,
                            totalAmount: perItemRate + gst
                          };
                        });
                    
                    if (prodList.length === 0) return null;

                    return (
                      <div className="mb-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Product Details</h3>
                        <div className="border border-slate-200 rounded-xl overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs md:text-sm">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-4 py-2 font-semibold text-slate-700 whitespace-nowrap">Product Name</th>
                                <th className="px-4 py-2 font-semibold text-slate-700 whitespace-nowrap">Brand</th>
                                <th className="px-4 py-2 font-semibold text-slate-700 whitespace-nowrap">Model</th>
                                <th className="px-4 py-2 font-semibold text-slate-700 whitespace-nowrap">Configuration</th>
                                <th className="px-4 py-2 font-semibold text-slate-700 whitespace-nowrap">Serial Number</th>
                                <th className="px-4 py-2 font-semibold text-slate-700 text-right whitespace-nowrap">Rate</th>
                                <th className="px-4 py-2 font-semibold text-slate-700 text-right whitespace-nowrap">GST Amount</th>
                                <th className="px-4 py-2 font-semibold text-slate-700 text-right whitespace-nowrap">Total Amount</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {prodList.map((prod, i) => {
                                const rate = prod.rate || 0;
                                const gstAmount = prod.gstAmount || (rate * 0.18);
                                const totalAmount = prod.totalAmount || (rate + gstAmount);
                                return (
                                  <tr key={i}>
                                    <td className="px-4 py-2 text-slate-900">{prod.productName || prod.category || '-'}</td>
                                    <td className="px-4 py-2 text-slate-900">{prod.brand || '-'}</td>
                                    <td className="px-4 py-2 text-slate-900">{prod.model || '-'}</td>
                                    <td className="px-4 py-2 text-slate-500">{prod.configuration || '-'}</td>
                                    <td className="px-4 py-2 text-slate-900">{prod.serialNumber || '-'}</td>
                                    <td className="px-4 py-2 text-slate-900 text-right">₹{rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                    <td className="px-4 py-2 text-slate-900 text-right">₹{gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                    <td className="px-4 py-2 font-bold text-slate-900 text-right">₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Buyer Details Section */}
                  {(() => {
                    // Use stored buyerDetails if available, otherwise build from user context
                    const buyer = (selectedInvoice.buyerDetails && selectedInvoice.buyerDetails.buyerId)
                      ? selectedInvoice.buyerDetails
                      : {
                          buyerId: user?.userId || selectedInvoice.userId || 'N/A',
                          productId: selectedRfp?.rfpId || selectedInvoice.orderReference?.orderNumber || 'N/A',
                          buyerName: user?.name || user?.companyName || 'N/A',
                          paymentDetails: (user?.totalCredit > 0) ? 'Credit Limit' : 'Advance Payment'
                        };

                    return (
                      <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <h3 className="text-sm font-bold text-slate-900 mb-3">Buyer Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600">
                          <p><span className="font-medium text-slate-700 block">Buyer ID:</span> {buyer.buyerId || 'N/A'}</p>
                          <p><span className="font-medium text-slate-700 block">Product ID:</span> {buyer.productId || 'N/A'}</p>
                          <p><span className="font-medium text-slate-700 block">Buyer Name:</span> {buyer.buyerName || 'N/A'}</p>
                          <p><span className="font-medium text-slate-700 block">Payment Details:</span>
                            <span className={buyer.paymentDetails === 'Advance Payment' ? 'text-amber-600 font-semibold' : 'text-emerald-600 font-semibold'}>
                              {buyer.paymentDetails || 'Advance Payment'}
                            </span>
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setSelectedInvoice(null)} className="px-6 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-100 transition-colors">
                Close
              </button>
              <button onClick={() => printInvoice({ invoice: selectedInvoice, companySettings, user, rfp: selectedRfp })} className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm">
                <Printer className="w-4 h-4" /> Print PDF
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
