import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  CheckCircle, 
  Truck, 
  Receipt, 
  IndianRupee,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const KPI_CARDS = [
  { title: 'Pending RFP', value: 12, icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', trend: 2, trendLabel: 'vs last week' },
  { title: 'Approved Orders', value: 45, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', trend: 5, trendLabel: 'vs last week' },
  { title: 'Delivered Orders', value: 128, icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', trend: 12, trendLabel: 'on time' },
  { title: 'Invoices', value: 89, icon: Receipt, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100', trend: -3, trendLabel: 'pending' },
  { title: 'Total Spending', value: '₹1.2Cr', icon: IndianRupee, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', trend: 12, trendLabel: 'YTD' },
];

const miniChartData = [
  { value: 10 }, { value: 15 }, { value: 8 }, { value: 20 }, { value: 12 }, { value: 25 }, { value: 22 }
];

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const NumberCounter = ({ value }) => {
  if (typeof value === 'string') return <span>{value}</span>;
  return <span>{value}</span>;
};

import { AuthContext } from '../../../context/AuthContext';

export default function KPIGrid() {
  const { user } = useContext(AuthContext) || { user: null };
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.userId) return;
      try {
        const res = await fetch(`http://localhost:5000/api/procurement/dashboard-stats?userId=${user.userId}`);
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      }
    };
    fetchStats();
  }, [user]);

  const formatCurrency = (amount) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const displayCards = stats ? [
    { title: 'Pending RFP', value: stats.pendingRFPs || 0, icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', trend: 2, trendLabel: 'vs last week' },
    { title: 'Approved Orders', value: stats.approvedOrders || 0, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', trend: 5, trendLabel: 'vs last week' },
    { title: 'Delivered Orders', value: stats.deliveredOrders || 0, icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', trend: 12, trendLabel: 'on time' },
    { title: 'Invoices', value: stats.totalInvoices || 0, icon: Receipt, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100', trend: -3, trendLabel: 'pending' },
    { title: 'Total Spending', value: formatCurrency(stats.totalSpending || 0), icon: IndianRupee, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', trend: 12, trendLabel: 'YTD' },
  ] : KPI_CARDS;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
      {displayCards.map((kpi, i) => (
        <motion.div
          key={i}
          variants={itemVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="relative bg-white rounded-2xl p-5 shadow-sm border border-slate-100 overflow-hidden group"
        >
          {/* Background Glow on Hover */}
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${kpi.bg}`} />
          
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className={`p-3 rounded-xl ${kpi.bg} ${kpi.border} border`}>
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
            </div>
            
            <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
              kpi.trend > 0 ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' : 'text-red-700 bg-red-50 border border-red-100'
            }`}>
              {kpi.trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(kpi.trend)}%
            </div>
          </div>
          
          <div className="relative z-10">
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">
              <NumberCounter value={kpi.value} />
            </h3>
            <p className="text-sm font-medium text-slate-500">{kpi.title}</p>
          </div>

          {/* Mini Sparkline Chart */}
          <div className="h-10 mt-4 -mx-5 -mb-5 relative z-0 opacity-40 group-hover:opacity-100 transition-opacity duration-300">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={miniChartData}>
                <defs>
                  <linearGradient id={`color-${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={kpi.trend > 0 ? '#10b981' : '#ef4444'} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={kpi.trend > 0 ? '#10b981' : '#ef4444'} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={kpi.trend > 0 ? '#10b981' : '#ef4444'} 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill={`url(#color-${i})`} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
