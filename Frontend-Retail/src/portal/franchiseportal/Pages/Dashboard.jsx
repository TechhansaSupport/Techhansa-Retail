import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, TrendingUp, Clock, CheckCircle, AlertTriangle, Monitor, Cpu, Server, MousePointer2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFranchise } from '../context/FranchiseContext';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, 
  BarChart, Bar, PieChart, Pie, Cell, Legend 
} from 'recharts';

export default function Dashboard() {
  const { metrics, salesHistory, orders, inventory } = useFranchise();
  const navigate = useNavigate();
  const [activeRevenueRange, setActiveRevenueRange] = useState('7 Days');

  // Calculate low stock items count
  const lowStockCount = inventory.filter(item => item.availableStock <= item.lowStockAlert).length;

  // Process Category Distribution Data
  const categoryData = useMemo(() => {
    const counts = {};
    inventory.forEach(item => {
      counts[item.category] = (counts[item.category] || 0) + item.availableStock;
    });
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, [inventory]);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#0ea5e9'];

  const statCards = [
    { title: "Today's Sales", value: `₹${metrics.todaysSales.toLocaleString()}`, subText: "+14% from yesterday", icon: <TrendingUp size={24} />, color: "text-indigo-600", bgBox: "bg-indigo-50/50 border-indigo-100 shadow-indigo-100/50", iconBg: "bg-indigo-100/50", stroke: "#4f46e5", fill: "#c7d2fe", id: "colorIndigo", data: [{v:20},{v:40},{v:30},{v:70},{v:50},{v:90}] },
    { title: "Available Stock", value: metrics.availableStock, subText: `${inventory.length} total SKUs`, icon: <CheckCircle size={24} />, color: "text-emerald-600", bgBox: "bg-emerald-50/50 border-emerald-100 shadow-emerald-100/50", iconBg: "bg-emerald-100/50", stroke: "#10b981", fill: "#a7f3d0", id: "colorEmerald", data: [{v:85},{v:82},{v:84},{v:81},{v:83},{v:83}] },
    { title: "Pending Orders", value: metrics.pendingOrders, subText: "Awaiting fulfillment", icon: <Clock size={24} />, color: "text-amber-600", bgBox: "bg-amber-50/50 border-amber-100 shadow-amber-100/50", iconBg: "bg-amber-100/50", stroke: "#f59e0b", fill: "#fde68a", id: "colorAmber", data: [{v:6},{v:4},{v:5},{v:3},{v:2},{v:2}] },
    { title: "Low Stock Alerts", value: lowStockCount, subText: "Items need reordering", icon: <AlertTriangle size={24} />, color: "text-rose-600", bgBox: "bg-rose-50/50 border-rose-100 shadow-rose-100/50", iconBg: "bg-rose-100/50", stroke: "#e11d48", fill: "#fecdd3", id: "colorRose", data: [{v:1},{v:2},{v:1},{v:2},{v:2},{v:2}] },
  ];

  const chartData = useMemo(() => {
    if (activeRevenueRange === '7 Days') return salesHistory;
    // Generate 30 days mock data
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      return {
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        sales: Math.floor(Math.random() * 100000) + 50000,
        orders: Math.floor(Math.random() * 10) + 5
      };
    });
  }, [activeRevenueRange, salesHistory]);

  return (
    <div className="space-y-8 pb-8">
      
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Store Overview</h1>
        <p className="text-slate-500 mt-1 font-medium">Welcome back! Here's a snapshot of your business performance.</p>
      </div>

      {/* Hero Stat Cards - Redesigned for more attractive look */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Sales Trend Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white rounded-3xl p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Revenue Trend</h2>
              <p className="text-slate-500 text-sm">{activeRevenueRange === '7 Days' ? 'Last 7 Days Performance' : 'Last 30 Days Performance'}</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveRevenueRange('7 Days')}
                className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors ${activeRevenueRange === '7 Days' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                7 Days
              </button>
              <button 
                onClick={() => setActiveRevenueRange('30 Days')}
                className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors ${activeRevenueRange === '30 Days' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                30 Days
              </button>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DDA73C" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#DDA73C" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} tickFormatter={(value) => `₹${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', padding: '12px' }}
                  itemStyle={{ fontWeight: 'bold' }}
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="sales" stroke="#DDA73C" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Inventory Category Distribution */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col"
        >
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800">Inventory Distribution</h2>
            <p className="text-slate-500 text-sm">Stock by Category</p>
          </div>
          <div className="flex-1 h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text for Donut Chart */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-slate-800">{metrics.availableStock}</span>
              <span className="text-xs text-slate-500 font-semibold uppercase">Total Units</span>
            </div>
          </div>
          
          {/* Custom Mini Legend */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {categoryData.slice(0, 4).map((entry, idx) => (
              <div key={entry.name} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                <span className="text-xs font-medium text-slate-600 truncate">{entry.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products / Low Stock Alerts List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">Action Required: Low Stock</h2>
            <button onClick={() => navigate('/franchise/inventory')} className="text-indigo-600 text-sm font-semibold hover:text-indigo-800">View All</button>
          </div>
          
          <div className="space-y-4">
            {inventory.filter(i => i.availableStock <= i.lowStockAlert).length === 0 ? (
               <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 text-center text-emerald-700 font-medium flex flex-col items-center gap-2">
                 <CheckCircle size={32} />
                 All stock levels are healthy!
               </div>
            ) : (
              inventory.filter(i => i.availableStock <= i.lowStockAlert).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:bg-red-50 hover:border-red-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 group-hover:text-red-500 transition-colors">
                      {item.category === 'Laptops' ? <Monitor size={24} /> : 
                       item.category === 'Networking' ? <Server size={24} /> :
                       item.category === 'Accessories' ? <MousePointer2 size={24} /> : <Cpu size={24} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">{item.sku}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-rose-600 font-black text-lg">{item.availableStock} <span className="text-xs text-rose-400 font-medium">left</span></div>
                    <div className="text-xs text-slate-400 font-medium">Alert at {item.lowStockAlert}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Recent Orders - Beautifully Styled */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-3xl p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">Recent Admin Orders</h2>
            <button onClick={() => navigate('/franchise/orders')} className="text-indigo-600 text-sm font-semibold hover:text-indigo-800">Order History</button>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {orders.slice(0, 4).map((order) => (
              <div key={order.id} className="p-4 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow bg-white flex justify-between items-center group">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-12 rounded-full ${
                    order.status === 'Delivered' ? 'bg-emerald-400' :
                    order.status === 'Pending' ? 'bg-amber-400' :
                    order.status === 'Dispatched' ? 'bg-blue-400' :
                    'bg-indigo-400'
                  }`}></div>
                  <div>
                    <span className="font-bold text-slate-800 text-sm block mb-1">{order.id}</span>
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold tracking-wide uppercase ${
                      order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                      order.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                      order.status === 'Dispatched' ? 'bg-blue-100 text-blue-700' :
                      'bg-indigo-100 text-indigo-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="font-black text-slate-700 block">₹{order.total.toLocaleString()}</span>
                  <span className="text-xs text-slate-500 font-medium">{order.items} Items</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

    </div>
  );
}
