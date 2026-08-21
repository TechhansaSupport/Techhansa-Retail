import React, { useState, useEffect, useMemo, useContext } from 'react';
import axios from '../../../api/axios';
import { Users, Wallet, Package, TrendingUp, BarChart3, Activity, IndianRupee, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, 
  BarChart, Bar, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCreditDistributed: 0,
    totalUsedCredit: 0,
    totalInventoryItems: 0,
    totalInventoryValue: 0,
    totalRevenue: 0
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeRevenueRange, setActiveRevenueRange] = useState('7 Days');

  if (user?.role === 'account_manager') {
    return <Navigate to="/admin/orders" replace />;
  }
  if (user?.role === 'inventory_manager') {
    return <Navigate to="/admin/catalog" replace />;
  }
  if (user?.role === 'finance_manager') {
    return <Navigate to="/admin/finance" replace />;
  }

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, chartRes] = await Promise.all([
          axios.get(`/api/admin/dashboard`),
          axios.get(`/api/admin/dashboard/chart?timeRange=${encodeURIComponent(activeRevenueRange)}`)
        ]);
        setStats(statsRes.data);
        setChartData(chartRes.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [activeRevenueRange]);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#0ea5e9'];

  const statCards = [
    { title: "Total Users", value: stats.totalUsers, subText: "Active Franchise & B2B", icon: <Users size={24} />, color: "text-indigo-600", bgBox: "bg-indigo-50/50 border-indigo-100 shadow-indigo-100/50", iconBg: "bg-indigo-100/50", stroke: "#4f46e5", fill: "#c7d2fe", id: "colorAdminIndigo", data: stats.userSparkline || [] },
    { title: "Distributed Credit", value: `₹${(stats.totalCreditDistributed || 0).toLocaleString()}`, subText: "Overall credit line", icon: <Wallet size={24} />, color: "text-emerald-600", bgBox: "bg-emerald-50/50 border-emerald-100 shadow-emerald-100/50", iconBg: "bg-emerald-100/50", stroke: "#10b981", fill: "#a7f3d0", id: "colorAdminEmerald", data: stats.distributedCreditSparkline || [] },
    { title: "Used Credit", value: `₹${(stats.totalUsedCredit || 0).toLocaleString()}`, subText: "Outstanding B2B", icon: <Activity size={24} />, color: "text-amber-600", bgBox: "bg-amber-50/50 border-amber-100 shadow-amber-100/50", iconBg: "bg-amber-100/50", stroke: "#f59e0b", fill: "#fde68a", id: "colorAdminAmber", data: stats.usedCreditSparkline || [] },
    { title: "Total Revenue", value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, subText: "Gross platform sales", icon: <TrendingUp size={24} />, color: "text-blue-600", bgBox: "bg-blue-50/50 border-blue-100 shadow-blue-100/50", iconBg: "bg-blue-100/50", stroke: "#2563eb", fill: "#bfdbfe", id: "colorAdminBlue", data: stats.revenueSparkline || [] },
    { title: "Net Profit", value: `₹${(stats.netProfit || 0).toLocaleString()}`, subText: "After COGS margins", icon: <Activity size={24} />, color: "text-purple-600", bgBox: "bg-purple-50/50 border-purple-100 shadow-purple-100/50", iconBg: "bg-purple-100/50", stroke: "#9333ea", fill: "#e9d5ff", id: "colorAdminPurple", data: stats.revenueSparkline || [] },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 pb-4 md:pb-8">
      
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Global Overview</h1>
        <p className="text-slate-500 mt-1 font-medium">Aggregated operational metrics across Franchise and B2B channels.</p>
      </div>

      {/* Hero Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`rounded-3xl p-6 shadow-sm border ${stat.bgBox} relative flex flex-col justify-between overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
          >
            <div className="flex justify-between items-start mb-1 relative z-10">
              <div>
                <p className="font-semibold text-slate-500 text-xs tracking-wide uppercase">{stat.title}</p>
                <h3 className="text-2xl font-black text-slate-800 mt-1">{stat.value}</h3>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Sales Trend Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-100 flex flex-col"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Consolidated Financial Reporting</h2>
              <p className="text-slate-500 text-sm">Revenue segmentation across quarters</p>
            </div>
            <select
              value={activeRevenueRange}
              onChange={(e) => setActiveRevenueRange(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer font-medium"
            >
              <option value="7 Days">Last 7 Days</option>
              <option value="30 Days">Last 30 Days</option>
              <option value="90 Days">Last 90 Days</option>
              <option value="1 Year">Last 1 Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} tickFormatter={(value) => `₹${value}k`} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', padding: '12px' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                <Bar dataKey="Franchise" name="Franchise Network" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="B2B" name="B2B Channels" fill="#ea580c" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Global Inventory Details */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-100 flex flex-col"
        >
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800">Global Inventory</h2>
            <p className="text-slate-500 text-sm">Centralized Catalog Value</p>
          </div>
          <div className="w-full flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <Package size={48} className="text-indigo-400 mb-4" />
            <span className="text-4xl font-black text-slate-800 tracking-tight">₹{(stats.totalInventoryValue || 0).toLocaleString()}</span>
            <span className="text-sm text-slate-500 font-semibold uppercase tracking-wider mt-2">Total Value</span>
            
            <div className="mt-8 pt-6 border-t border-slate-200 w-full flex justify-between px-4">
               <div className="text-center">
                 <p className="text-xl font-bold text-slate-700">{stats.totalInventoryItems}</p>
                 <p className="text-xs text-slate-400 uppercase font-bold tracking-wide">Unique Items</p>
               </div>
               <div className="text-center">
                 <p className="text-xl font-bold text-slate-700">100%</p>
                 <p className="text-xs text-emerald-500 uppercase font-bold tracking-wide">Stock Health</p>
               </div>
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
