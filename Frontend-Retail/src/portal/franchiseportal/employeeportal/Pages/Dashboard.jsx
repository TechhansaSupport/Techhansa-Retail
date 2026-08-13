import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { IndianRupee, Target, TrendingUp, PlusCircle, ShoppingBag, Clock, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthContext } from '../../../../context/AuthContext';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

// --- MOCK DATA ---
const MOCK_PERFORMANCE_HISTORY = [
  { day: 'Mon', sales: 12000, target: 15000 },
  { day: 'Tue', sales: 18000, target: 15000 },
  { day: 'Wed', sales: 14500, target: 15000 },
  { day: 'Thu', sales: 21000, target: 15000 },
  { day: 'Fri', sales: 19500, target: 15000 },
  { day: 'Sat', sales: 28000, target: 15000 },
  { day: 'Sun', sales: 25000, target: 15000 }
];

const MOCK_CATEGORY_DISTRIBUTION = [
  { name: 'Laptops', value: 45 },
  { name: 'Accessories', value: 30 },
  { name: 'Networking', value: 15 },
  { name: 'Components', value: 10 }
];

const MOCK_RECENT_BILLS = [
  { id: 'INV-7041', time: '10 mins ago', amount: 4500, items: 3 },
  { id: 'INV-7042', time: '1 hour ago', amount: 1200, items: 1 },
  { id: 'INV-7043', time: '3 hours ago', amount: 8500, items: 5 },
  { id: 'INV-7044', time: '4 hours ago', amount: 3200, items: 2 },
  { id: 'INV-7045', time: '5 hours ago', amount: 6400, items: 4 },
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [salesToday, setSalesToday] = useState(0);
  const [targetToday, setTargetToday] = useState(100000);
  const [ordersProcessed, setOrdersProcessed] = useState(14);
  const [aov, setAov] = useState(4250);

  useEffect(() => {
    if (user?.userId) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sales/dashboard/${user.userId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setSalesToday(data.salesToday || 0);
            setTargetToday(data.targetToday || 100000);
          }
        })
        .catch(err => console.error("Error fetching dashboard data:", err));
    }
  }, [user]);

  const progressPercentage = Math.min((salesToday / targetToday) * 100, 100);

  const statCards = [
    { title: "Sales Today", value: `₹${salesToday.toLocaleString()}`, subText: `${progressPercentage.toFixed(1)}% of daily target`, icon: <IndianRupee size={24} />, color: "text-indigo-600", bgBox: "bg-indigo-50/50 border-indigo-100 shadow-indigo-100/50", iconBg: "bg-indigo-100/50", stroke: "#4f46e5", id: "colorEmpSales" },
    { title: "Daily Target", value: `₹${targetToday.toLocaleString()}`, subText: `Remaining: ₹${Math.max(targetToday - salesToday, 0).toLocaleString()}`, icon: <Target size={24} />, color: "text-emerald-600", bgBox: "bg-emerald-50/50 border-emerald-100 shadow-emerald-100/50", iconBg: "bg-emerald-100/50", stroke: "#10b981", id: "colorEmpTarget" },
    { title: "Orders Processed", value: ordersProcessed, subText: "+3 vs yesterday", icon: <ShoppingBag size={24} />, color: "text-amber-600", bgBox: "bg-amber-50/50 border-amber-100 shadow-amber-100/50", iconBg: "bg-amber-100/50", stroke: "#f59e0b", id: "colorEmpOrders" },
    { title: "Avg Order Value", value: `₹${aov.toLocaleString()}`, subText: "Top 10% in store", icon: <TrendingUp size={24} />, color: "text-blue-600", bgBox: "bg-blue-50/50 border-blue-100 shadow-blue-100/50", iconBg: "bg-blue-100/50", stroke: "#2563eb", id: "colorEmpAOV" },
  ];

  return (
    <div className="space-y-6 md:space-y-8 pb-4 md:pb-8">
      
      {/* Header section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Welcome, {user?.name || 'Employee'}</h1>
          <p className="text-slate-500 mt-1 font-medium">Track your daily targets and sales performance.</p>
        </div>
        <button 
          onClick={() => navigate('/employee/billing')}
          className="hidden md:flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
        >
          <PlusCircle size={20} />
          New Billing
        </button>
      </div>

      {/* Hero Stat Cards */}
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
                <h3 className="text-2xl font-black text-slate-800 mt-1">{stat.value}</h3>
              </div>
              <div className={`p-2.5 rounded-xl ${stat.iconBg} ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
            
            {stat.title === 'Sales Today' && (
              <div className="w-full bg-indigo-100/50 rounded-full h-2.5 mt-3 mb-1">
                <div 
                  className="bg-indigo-500 h-2.5 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            )}
            {stat.title !== 'Sales Today' && <div className="h-4 mt-2"></div>}

            <div className="mt-1 relative z-10">
               <p className="text-slate-500 text-xs font-semibold">{stat.subText}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Performance Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white rounded-3xl p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Weekly Performance</h2>
              <p className="text-slate-500 text-sm">Your sales vs daily target</p>
            </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_PERFORMANCE_HISTORY} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} tickFormatter={(value) => `₹${value/1000}k`} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', padding: '12px' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="sales" name="Sales" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
                <Area type="step" dataKey="target" name="Target" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Categories Sold */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col"
        >
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800">Top Categories</h2>
            <p className="text-slate-500 text-sm">What you've sold this week</p>
          </div>
          <div className="w-full h-[220px] min-h-[220px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MOCK_CATEGORY_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {MOCK_CATEGORY_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                  formatter={(value) => [`${value}%`, 'Share']}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text for Donut Chart */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-slate-800">{ordersProcessed}</span>
              <span className="text-xs text-slate-500 font-semibold uppercase">Items</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-2">
            {MOCK_CATEGORY_DISTRIBUTION.map((entry, idx) => (
              <div key={entry.name} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                <span className="text-xs font-medium text-slate-600 truncate">{entry.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions (Reimagined) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-3xl shadow-lg text-white relative overflow-hidden flex flex-col justify-center items-center h-full min-h-[280px]"
        >
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
          
          <h3 className="text-2xl font-bold mb-3 relative z-10">Ready for a sale?</h3>
          <p className="text-indigo-100 text-center mb-8 max-w-sm text-sm relative z-10 font-medium">
            Start a new customer checkout process instantly and hit your daily targets.
          </p>
          
          <button 
            onClick={() => navigate('/employee/billing')}
            className="flex items-center gap-2 bg-white text-indigo-700 px-8 py-3.5 rounded-xl font-bold hover:bg-indigo-50 hover:scale-105 transition-all shadow-xl shadow-indigo-900/20 w-full max-w-[240px] justify-center relative z-10"
          >
            <PlusCircle size={20} />
            Start New Bill
          </button>
        </motion.div>

        {/* Recent Bills Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-3xl p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">Your Recent Bills</h2>
            <button className="text-indigo-600 text-sm font-semibold hover:text-indigo-800">View History</button>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {MOCK_RECENT_BILLS.map((bill) => (
              <div key={bill.id} className="p-4 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-colors bg-white flex justify-between items-center group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-indigo-500 group-hover:bg-indigo-100 transition-colors">
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 text-sm block mb-0.5">{bill.id}</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock size={12} /> {bill.time}
                    </span>
                  </div>
                </div>
                
                <div className="text-right flex items-center gap-4">
                  <div>
                    <span className="font-black text-slate-700 block text-sm">₹{bill.amount.toLocaleString()}</span>
                    <span className="text-xs text-slate-500 font-medium">{bill.items} Items</span>
                  </div>
                  <button className="text-slate-300 hover:text-indigo-600 transition-colors">
                    <ArrowUpRight size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Mobile-only CTA */}
      <button 
        onClick={() => navigate('/employee/billing')}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-600/30 flex items-center justify-center hover:bg-indigo-700 transition-colors z-50"
      >
        <PlusCircle size={28} />
      </button>

    </div>
  );
}
