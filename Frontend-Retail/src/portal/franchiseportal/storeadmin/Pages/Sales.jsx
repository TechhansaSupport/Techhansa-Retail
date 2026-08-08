import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useFranchise } from '../context/FranchiseContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { Download, IndianRupee, TrendingUp, Calendar, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function Sales() {
  const { metrics, salesHistory, invoices } = useFranchise();
  const [timeRange, setTimeRange] = useState('Last 7 Days');

  const chartData = useMemo(() => {
    if (timeRange === 'Last 7 Days') return salesHistory;
    // Mocking other ranges
    if (timeRange === 'This Month') {
      return Array.from({ length: 15 }, (_, i) => ({
        date: `Aug ${i + 1}`,
        sales: Math.floor(Math.random() * 100000) + 50000,
        orders: Math.floor(Math.random() * 10) + 5
      }));
    }
    if (timeRange === 'Last Month') {
      return Array.from({ length: 30 }, (_, i) => ({
        date: `Jul ${i + 1}`,
        sales: Math.floor(Math.random() * 100000) + 50000,
        orders: Math.floor(Math.random() * 10) + 5
      }));
    }
    return salesHistory;
  }, [timeRange, salesHistory]);

  const salesStatCards = [
    { 
      title: "Monthly Revenue", 
      value: `₹${metrics.monthlySales.toLocaleString()}`, 
      subText: "+12% from last month", 
      icon: <IndianRupee size={24} />, 
      color: "text-indigo-600", 
      bgBox: "bg-indigo-50/50 border-indigo-100 shadow-indigo-100/50", 
      iconBg: "bg-indigo-100/50", 
      stroke: "#4f46e5", 
      fill: "#c7d2fe", 
      id: "colorRevenue", 
      data: [{v:30},{v:40},{v:45},{v:50},{v:49},{v:60},{v:70}] 
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
      data: [{v:40},{v:30},{v:45},{v:35},{v:50},{v:40},{v:60}] 
    },
    { 
      title: "Total Items Sold (Month)", 
      value: "342", 
      subText: "Across all categories", 
      icon: <TrendingUp size={24} />, 
      color: "text-emerald-600", 
      bgBox: "bg-emerald-50/50 border-emerald-100 shadow-emerald-100/50", 
      iconBg: "bg-emerald-100/50", 
      stroke: "#10b981", 
      fill: "#a7f3d0", 
      id: "colorItems", 
      data: [{v:10},{v:15},{v:12},{v:20},{v:18},{v:25},{v:22}] 
    }
  ];

  const exportReport = () => {
    const doc = new jsPDF();
    doc.text(`Sales & Order Report (${timeRange})`, 14, 15);
    
    doc.autoTable({
      startY: 25,
      head: [['Date', 'Sales (INR)', 'Orders']],
      body: chartData.map(row => [row.date, `Rs. ${row.sales.toLocaleString()}`, row.orders]),
      headStyles: { fillColor: [79, 70, 229] }
    });

    if (invoices && invoices.length > 0) {
      doc.text("Recent Invoices", 14, doc.lastAutoTable.finalY + 15);
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 20,
        head: [['Invoice No', 'Date', 'Customer Name', 'Total Amount']],
        body: invoices.map(inv => [inv.id, inv.date, inv.customer?.name || 'Walk-in', `Rs. ${inv.total.toLocaleString()}`]),
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
                      <stop offset="5%" stopColor={stat.stroke} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={stat.stroke} stopOpacity={0}/>
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
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
              <YAxis yAxisId="left" orientation="left" stroke="#6366f1" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(value) => `₹${value/1000}k`} />
              <YAxis yAxisId="right" orientation="right" stroke="#10b981" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
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
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">Order History</h2>
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
              {invoices && invoices.length > 0 ? invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-slate-700">{inv.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{inv.date}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{inv.customer?.name || 'Walk-in'}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">Admin</td>
                  <td className="px-6 py-4 text-right font-medium text-indigo-600">₹{inv.total.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => {
                         const doc = new jsPDF();
                         doc.text(`Invoice: ${inv.id}`, 14, 15);
                         doc.text(`Date: ${inv.date}`, 14, 25);
                         doc.text(`Total: Rs. ${inv.total.toLocaleString()}`, 14, 35);
                         doc.save(`${inv.id}.pdf`);
                      }}
                      className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg flex justify-center items-center gap-1 mx-auto"
                    >
                      <FileText size={14} /> PDF
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-500">No recent orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
