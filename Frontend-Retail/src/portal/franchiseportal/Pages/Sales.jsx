import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useFranchise } from '../context/FranchiseContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download, IndianRupee, TrendingUp, Calendar } from 'lucide-react';

export default function Sales() {
  const { metrics, salesHistory } = useFranchise();
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

  const exportReport = () => {
    const headers = ['Date', 'Sales (INR)', 'Orders'];
    const csvContent = [
      headers.join(','),
      ...chartData.map(row => `${row.date},${row.sales},${row.orders}`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `sales_report_${timeRange.replace(/\s+/g, '_').toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Sales & Reports</h1>
          <p className="text-slate-500">Analyze your store's performance and sales metrics.</p>
        </div>
        <button onClick={exportReport} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
          <Download size={16} />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-indigo-600 text-white rounded-2xl p-6 shadow-lg shadow-indigo-200 relative overflow-hidden"
        >
          <div className="absolute -right-6 -top-6 text-white/10">
            <IndianRupee size={120} />
          </div>
          <div className="relative z-10">
            <p className="text-indigo-100 font-medium mb-1">Monthly Revenue</p>
            <h3 className="text-3xl font-bold mb-4">₹{metrics.monthlySales.toLocaleString()}</h3>
            <div className="flex items-center gap-2 text-sm text-emerald-300 font-medium bg-white/10 w-fit px-3 py-1 rounded-full">
              <TrendingUp size={16} /> +12% from last month
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 font-medium mb-1">Avg. Daily Sales</p>
              <h3 className="text-2xl font-bold text-slate-800">₹{(metrics.monthlySales / 30).toFixed(0).toLocaleString()}</h3>
            </div>
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <Calendar size={20} />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 font-medium mb-1">Total Items Sold (Month)</p>
              <h3 className="text-2xl font-bold text-slate-800">342</h3>
            </div>
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
          </div>
        </motion.div>
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
    </div>
  );
}
