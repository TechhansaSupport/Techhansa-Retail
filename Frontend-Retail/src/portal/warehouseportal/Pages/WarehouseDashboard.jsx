import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, TrendingUp } from 'lucide-react';
import axios from '../../../api/axios';
import { motion } from 'framer-motion';

export default function WarehouseDashboard() {
  const [stats, setStats] = useState({
    totalStock: 0,
    lowStockItems: 0,
    totalValue: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/warehouse/inventory', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const products = res.data;
      let totalStock = 0;
      let lowStockItems = 0;
      let totalValue = 0;

      products.forEach(p => {
        totalStock += (p.quantity || 0);
        if (p.quantity <= (p.lowStockAlert || 5)) lowStockItems++;
        totalValue += (p.quantity * (p.buyingPrice || p.sellingPrice || 0));
      });

      setStats({ totalStock, lowStockItems, totalValue });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      title: 'Total Physical Stock', 
      value: stats.totalStock.toLocaleString(), 
      icon: Package, 
      color: 'blue' 
    },
    { 
      title: 'Low Stock Alerts', 
      value: stats.lowStockItems, 
      icon: AlertTriangle, 
      color: 'amber' 
    },
    { 
      title: 'Total Inventory Value', 
      value: `₹${stats.totalValue.toLocaleString()}`, 
      icon: TrendingUp, 
      color: 'emerald' 
    }
  ];

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading Dashboard...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`w-12 h-12 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
            <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
        <p className="text-slate-500 text-sm mb-6">Manage the warehouse physical inventory and register serial numbers for incoming stock.</p>
        
        <div className="flex gap-4">
          <a href="/warehouse/inventory" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
            Intake New Stock
          </a>
        </div>
      </div>
    </div>
  );
}
