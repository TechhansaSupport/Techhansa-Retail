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
  { title: 'Pending RFP', value: 0, icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
  { title: 'Approved Orders', value: 0, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  { title: 'Delivered Orders', value: 0, icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
  { title: 'Invoices', value: 0, icon: Receipt, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },
  { title: 'Total Spending', value: '₹0', icon: IndianRupee, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.userId) return;
      setIsLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/procurement/dashboard-stats?userId=${user.userId}`);
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      } finally {
        setIsLoading(false);
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
    { title: 'Pending RFP', value: stats.pendingRFPs || 0, icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
    { title: 'Approved Orders', value: stats.approvedOrders || 0, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { title: 'Delivered Orders', value: stats.deliveredOrders || 0, icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { title: 'Invoices', value: stats.totalInvoices || 0, icon: Receipt, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },
    { title: 'Total Spending', value: formatCurrency(stats.totalSpending || 0), icon: IndianRupee, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
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
          </div>

          <div className="relative z-10 h-16 flex flex-col justify-center">
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-8 w-16 bg-slate-200 animate-pulse rounded-md"></div>
                <div className="h-4 w-24 bg-slate-100 animate-pulse rounded-md"></div>
              </div>
            ) : (
              <>
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">
                  <NumberCounter value={kpi.value} />
                </h3>
                <p className="text-sm font-medium text-slate-500">{kpi.title}</p>
              </>
            )}
          </div>

        </motion.div>
      ))}
    </div>
  );
}
