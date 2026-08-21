import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, DownloadCloud, Sparkles } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { exportToCSV } from '../../utils/exportUtils';

// Components
import KPIGrid from './components/KPIGrid';
import SmartAnalytics from './components/SmartAnalytics';
import CreditCard from './Components/CreditCard';

import RecentActivity from './components/RecentActivity';
import ProcurementTables from './components/ProcurementTable';
import { fetchWithAuth } from '../../utils/api.js';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  const handleExport = async () => {
    try {
      const res = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/api/procurement/dashboard-stats`);
      const data = await res.json();
      const exportData = [
        {
          'Pending RFPs': data.pendingRFPs,
          'Approved Orders': data.approvedOrders,
          'Delivered Orders': data.deliveredOrders,
          'Total Invoices': data.totalInvoices,
          'Total Spending (INR)': data.totalSpending
        }
      ];
      exportToCSV('dashboard_summary.csv', exportData);
    } catch (err) {
      console.error('Failed to export', err);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-[1600px] mx-auto pb-12"
    >
      {/* Header Area */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Procurement Overview</h1>
          <p className="text-slate-500 text-sm mt-1.5 flex items-center gap-1.5">
            Welcome back,{' '}
            {user?.name ? (
              <span className="font-semibold text-slate-700">{user.name}</span>
            ) : (
              <span className="h-5 w-24 bg-slate-200 animate-pulse rounded inline-block align-middle ml-1"></span>
            )}
            . Here's what's happening today.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button onClick={handleExport} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-medium transition-all shadow-sm">
            <DownloadCloud className="w-4 h-4" /> Export Report
          </button>

          <Link to="/channel/rfp/create" className="flex-1 md:flex-none group relative flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-tr from-blue-600 to-indigo-500 text-white rounded-xl font-semibold transition-all hover:shadow-[0_8px_20px_-6px_rgba(79,70,229,0.4)] hover:-translate-y-0.5 overflow-hidden">
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
            <Plus className="w-4 h-4 relative z-10" />
            <span className="relative z-10">Create New RFP</span>
          </Link>
        </div>
      </motion.div>




      {/* Credit Dashboard Card */}
      <motion.div variants={itemVariants} className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <CreditCard />
      </motion.div>

      {/* KPI Grid */}
      <motion.div variants={itemVariants}>
        <KPIGrid />
      </motion.div>

      {/* Analytics & Activity Row */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mt-6">
        <motion.div variants={itemVariants} className="xl:col-span-3">
          <SmartAnalytics />
        </motion.div>

        <motion.div variants={itemVariants} className="xl:col-span-1 mt-6 xl:mt-0">
          <RecentActivity />
        </motion.div>
      </div>

      {/* Tables Section */}
      <motion.div variants={itemVariants}>
        <ProcurementTables />
      </motion.div>

    </motion.div>
  );
}
