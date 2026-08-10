import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Download, TrendingUp, IndianRupee, ShoppingBag, FileText, BarChart2 } from 'lucide-react';
import { AuthContext } from '../../../context/AuthContext';
import { exportToCSV } from '../../../utils/exportUtils';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line
} from 'recharts';

export default function Reports() {
  const { user } = useContext(AuthContext) || { user: null };
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      if (!user?.userId) return;
      try {
        const res = await fetch(`http://localhost:5000/api/procurement/reports?userId=${user.userId}`);
        const data = await res.json();
        setReportData(data);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [user]);

  const handleDownload = (type) => {
    if (!reportData) return;

    if (type === 'daily') {
      const data = [{
        Date: new Date().toLocaleDateString(),
        TotalSpend: `₹${reportData.daily.spend}`,
        OrdersPlaced: reportData.daily.orders,
        RFPsCreated: reportData.daily.rfps,
        InvoicesPaid: reportData.daily.invoicesPaid
      }];
      exportToCSV('daily_report.csv', data);
    } else if (type === 'monthly') {
      exportToCSV('monthly_report.csv', reportData.monthly);
    } else if (type === 'yearly') {
      exportToCSV('yearly_report.csv', reportData.yearly);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-500 font-medium">Loading reports...</div>;
  }

  if (!reportData) {
    return <div className="p-12 text-center text-red-500 font-medium">Failed to load reports. Please try again.</div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-[1600px] mx-auto pb-12 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Reports & Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Real-time insights and downloadable reports for your procurement activities.</p>
      </div>

      {/* Daily Report Cards */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Today's Overview</h2>
          <button onClick={() => handleDownload('daily')} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Download Daily
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-500 font-medium text-sm">Today's Spend</span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><IndianRupee className="w-4 h-4" /></div>
            </div>
            <p className="text-2xl font-bold text-slate-900">₹{reportData.daily.spend.toLocaleString('en-IN')}</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-500 font-medium text-sm">Orders Placed</span>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><ShoppingBag className="w-4 h-4" /></div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{reportData.daily.orders}</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-500 font-medium text-sm">RFPs Created</span>
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><FileText className="w-4 h-4" /></div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{reportData.daily.rfps}</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-500 font-medium text-sm">Invoices Paid</span>
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><TrendingUp className="w-4 h-4" /></div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{reportData.daily.invoicesPaid}</p>
          </div>
        </div>
      </motion.div>

      {/* Monthly Chart */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Monthly Spending & Orders</h2>
            <p className="text-slate-500 text-sm">Trailing 12 months performance</p>
          </div>
          <button onClick={() => handleDownload('monthly')} className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition-colors">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reportData.monthly} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} tickFormatter={(value) => `₹${value >= 1000 ? (value / 1000) + 'k' : value}`} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={10} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value, name) => [name === 'spend' ? `₹${value.toLocaleString('en-IN')}` : value, name === 'spend' ? 'Spend' : 'Orders']}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar yAxisId="left" dataKey="spend" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Spend (₹)" />
              <Bar yAxisId="right" dataKey="orders" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Yearly Chart */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Yearly Spending Trend</h2>
            <p className="text-slate-500 text-sm">Historical 5-year view</p>
          </div>
          <button onClick={() => handleDownload('yearly')} className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition-colors">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={reportData.yearly} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} tickFormatter={(value) => `₹${value >= 1000 ? (value / 1000) + 'k' : value}`} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Spend']}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Line type="monotone" dataKey="spend" stroke="#10b981" strokeWidth={3} dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} name="Total Spend (₹)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  );
}
