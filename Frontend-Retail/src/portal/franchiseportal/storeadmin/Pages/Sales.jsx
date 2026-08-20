import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFranchise } from '../context/FranchiseContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { Download, IndianRupee, TrendingUp, Calendar, FileText, Search } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import InvoiceTemplate from '../../../../Component/InvoiceTemplate';
import InvoiceActions from '../../../../Component/InvoiceActions';

export default function Sales() {
  const { metrics, salesHistory, invoices, storeProfileData } = useFranchise();
  const [timeRange, setTimeRange] = useState('Last 7 Days');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllInvoices, setShowAllInvoices] = useState(false);
  const invoiceRef = useRef(null);

  const chartData = useMemo(() => {
    if (!invoices || invoices.length === 0) return [];

    const now = new Date();
    const dataMap = new Map();

    const formatDate = (date, range) => {
      if (range === 'This Month' || range === 'Last Month') {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    };

    let startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    if (timeRange === 'Last 7 Days') {
      startDate.setDate(startDate.getDate() - 6);
      for (let i = 0; i < 7; i++) {
        let d = new Date(startDate);
        d.setDate(d.getDate() + i);
        dataMap.set(formatDate(d, timeRange), { date: formatDate(d, timeRange), sales: 0, orders: 0 });
      }
    } else if (timeRange === 'This Month') {
      startDate.setDate(1);
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        let d = new Date(now.getFullYear(), now.getMonth(), i);
        dataMap.set(formatDate(d, timeRange), { date: formatDate(d, timeRange), sales: 0, orders: 0 });
      }
    } else if (timeRange === 'Last Month') {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const daysInMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        let d = new Date(now.getFullYear(), now.getMonth() - 1, i);
        dataMap.set(formatDate(d, timeRange), { date: formatDate(d, timeRange), sales: 0, orders: 0 });
      }
    }

    let endDate = new Date(startDate);
    if (timeRange === 'Last 7 Days') {
      endDate = new Date();
    } else if (timeRange === 'This Month') {
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (timeRange === 'Last Month') {
      endDate = new Date(now.getFullYear(), now.getMonth(), 0);
    }
    endDate.setHours(23, 59, 59, 999);

    invoices.forEach(inv => {
      const invDate = new Date(inv.createdAt);
      if (invDate >= startDate && invDate <= endDate) {
        const dateKey = formatDate(invDate, timeRange);
        if (dataMap.has(dateKey)) {
          const existing = dataMap.get(dateKey);
          existing.sales += inv.amount;
          existing.orders += 1;
        }
      }
    });

    return Array.from(dataMap.values());
  }, [timeRange, invoices]);

  const totalItemsSoldThisMonth = useMemo(() => {
    if (!invoices) return 0;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return invoices.reduce((total, inv) => {
      const invDate = new Date(inv.createdAt);
      if (invDate >= startOfMonth) {
        const itemsCount = (inv.items || []).reduce((sum, item) => sum + (item.quantity || 0), 0);
        return total + itemsCount;
      }
      return total;
    }, 0);
  }, [invoices]);

  const sparklineData = useMemo(() => {
    const revenue = [];
    const items = [];

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);

      let dayRevenue = 0;
      let dayItems = 0;

      if (invoices) {
        invoices.forEach(inv => {
          const invDate = new Date(inv.createdAt);
          if (invDate.toLocaleDateString() === d.toLocaleDateString()) {
            dayRevenue += inv.amount;
            const itemsCount = (inv.items || []).reduce((sum, item) => sum + (item.quantity || 0), 0);
            dayItems += itemsCount;
          }
        });
      }

      revenue.push({ v: dayRevenue });
      items.push({ v: dayItems });
    }

    return { revenue, items };
  }, [invoices]);

  const filteredInvoices = useMemo(() => {
    if (!invoices) return [];
    
    // Sort descending by date (newest first)
    let filtered = [...invoices].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    if (searchTerm.trim() !== '') {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(inv => 
        (inv.invoiceNumber && inv.invoiceNumber.toLowerCase().includes(lower)) ||
        (inv.customerName && inv.customerName.toLowerCase().includes(lower)) ||
        (inv.customerPhone && inv.customerPhone.includes(lower)) ||
        (inv.employeeId && inv.employeeId.toLowerCase().includes(lower))
      );
    }
    return filtered;
  }, [invoices, searchTerm]);

  const displayedInvoices = showAllInvoices ? filteredInvoices : filteredInvoices.slice(0, 5);

  const salesStatCards = [
    {
      title: "Monthly Revenue",
      value: `₹${metrics.monthlySales.toLocaleString()}`,
      subText: "This month's revenue",
      icon: <IndianRupee size={24} />,
      color: "text-indigo-600",
      bgBox: "bg-indigo-50/50 border-indigo-100 shadow-indigo-100/50",
      iconBg: "bg-indigo-100/50",
      stroke: "#4f46e5",
      fill: "#c7d2fe",
      id: "colorRevenue",
      data: sparklineData.revenue
    },
    {
      title: "Avg. Daily Sales",
      value: `₹${(metrics.monthlySales / 30).toFixed(0).toLocaleString()}`,
      subText: "Based on 30 days rolling",
      icon: <Calendar size={24} />,
      color: "text-blue-600",
      bgBox: "bg-blue-50/50 border-blue-100 shadow-blue-100/50",
      iconBg: "bg-blue-100/50",
      stroke: "#2563eb",
      fill: "#bfdbfe",
      id: "colorDaily",
      data: sparklineData.revenue
    },
    {
      title: "Total Items Sold (Month)",
      value: totalItemsSoldThisMonth.toString(),
      subText: "Across all categories",
      icon: <TrendingUp size={24} />,
      color: "text-emerald-600",
      bgBox: "bg-emerald-50/50 border-emerald-100 shadow-emerald-100/50",
      iconBg: "bg-emerald-100/50",
      stroke: "#10b981",
      fill: "#a7f3d0",
      id: "colorItems",
      data: sparklineData.items
    }
  ];

  const exportReport = () => {
    const doc = new jsPDF();
    doc.text(`Sales & Order Report (${timeRange})`, 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [['Date', 'Sales (INR)', 'Orders']],
      body: chartData.map(row => [row.date, `Rs. ${row.sales.toLocaleString()}`, row.orders]),
      headStyles: { fillColor: [79, 70, 229] }
    });

    if (invoices && invoices.length > 0) {
      doc.text("Recent Invoices", 14, doc.lastAutoTable.finalY + 15);
      autoTable(doc, {
        startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 50,
        head: [['Invoice', 'Date', 'Customer', 'Amount (INR)']],
        body: invoices.slice(0, 50).map(inv => [
          inv.invoiceNumber,
          new Date(inv.createdAt).toLocaleDateString(),
          inv.customerName || 'Walk-in',
          `Rs. ${inv.amount.toLocaleString()}`
        ]),
        headStyles: { fillColor: [79, 70, 229] }
      });
    }

    doc.save(`sales_report_${timeRange.replace(/\s+/g, '_').toLowerCase()}.pdf`);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Sales & Reports</h1>
          <p className="text-slate-500">Analyze your store's performance and sales metrics.</p>
        </div>
        <button onClick={exportReport} className="w-full md:w-auto justify-center flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
          <Download size={16} />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {salesStatCards.map((stat, idx) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`rounded-2xl p-5 shadow-sm border ${stat.bgBox} relative flex flex-col justify-between overflow-hidden group hover:shadow-md transition-shadow`}
          >
            <div className="flex justify-between items-start mb-1 relative z-10">
              <div>
                <p className="font-semibold text-slate-500 text-xs tracking-wide uppercase">{stat.title}</p>
                <h3 className="text-3xl font-black text-slate-800 mt-1">{stat.value}</h3>
              </div>
              <div className={`p-2.5 rounded-xl ${stat.iconBg} ${stat.color}`}>
                {stat.icon}
              </div>
            </div>

            {/* Tiny Area Chart */}
            <div className="h-12 w-full mt-2 relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stat.data}>
                  <defs>
                    <linearGradient id={stat.id} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={stat.stroke} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={stat.stroke} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" stroke={stat.stroke} strokeWidth={2.5} fillOpacity={1} fill={`url(#${stat.id})`} isAnimationActive={true} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-1 relative z-10">
              <p className="text-slate-400 text-[11px] font-semibold">{stat.subText}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-800">Revenue & Orders ({timeRange})</h2>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="This Month">This Month</option>
            <option value="Last Month">Last Month</option>
          </select>
        </div>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
              <YAxis yAxisId="left" orientation="left" stroke="#6366f1" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(value) => `₹${value / 1000}k`} />
              <YAxis yAxisId="right" orientation="right" stroke="#10b981" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar yAxisId="left" dataKey="sales" name="Revenue (₹)" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
              <Bar yAxisId="right" dataKey="orders" name="No. of Orders" fill="#34d399" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Order History Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-lg font-bold text-slate-800">Order History</h2>
          
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search invoice, customer, phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Invoice No</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Customer Name</th>
                <th className="px-6 py-4 font-medium">Employee Name</th>
                <th className="px-6 py-4 font-medium text-right">Total Amount</th>
                <th className="px-6 py-4 font-medium text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedInvoices && displayedInvoices.length > 0 ? displayedInvoices.map((inv) => (
                <tr key={inv._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-slate-700">{inv.invoiceNumber}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{new Date(inv.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{inv.customerName || 'Walk-in'}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{inv.employeeId}</td>
                  <td className="px-6 py-4 text-right font-medium text-indigo-600">₹{inv.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => setSelectedInvoice(inv)}
                      className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg flex justify-center items-center gap-1 mx-auto"
                    >
                      <FileText size={14} /> View Invoice
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-500">No recent orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination / View All */}
        {!showAllInvoices && filteredInvoices.length > 5 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-center">
            <button 
              onClick={() => setShowAllInvoices(true)}
              className="px-4 py-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              View All Orders ({filteredInvoices.length})
            </button>
          </div>
        )}
        {showAllInvoices && filteredInvoices.length > 5 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-center">
            <button 
              onClick={() => setShowAllInvoices(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Show Less
            </button>
          </div>
        )}
      </motion.div>

      {/* Invoice Modal */}
      <AnimatePresence>
        {selectedInvoice && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-indigo-50" data-no-print>
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center shrink-0">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-indigo-900">Invoice {selectedInvoice.invoiceNumber}</h3>
                    <p className="text-indigo-700 text-sm">Past Order Record</p>
                  </div>
                </div>
                <button onClick={() => setSelectedInvoice(null)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>

              <div className="p-8 flex-1 overflow-y-auto bg-white flex justify-center w-full">
                <div className="w-full" ref={invoiceRef}>
                  <InvoiceTemplate invoice={selectedInvoice} storeData={storeProfileData} />
                </div>
              </div>
              
              {/* Action Buttons: Close + Download + WhatsApp + Print */}
              <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-3" data-no-print>
                <button onClick={() => setSelectedInvoice(null)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-xl transition-colors">Close</button>
                <div className="flex gap-3">
                  <InvoiceActions invoice={selectedInvoice} storeData={storeProfileData} invoiceRef={invoiceRef} />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
