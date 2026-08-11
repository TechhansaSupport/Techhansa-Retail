import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { IndianRupee, Target, TrendingUp, PlusCircle, ShoppingBag, Clock, ArrowUpRight, Search, Receipt, Megaphone, PackageSearch } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthContext } from '../../../../context/AuthContext';
import toast from 'react-hot-toast';
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

const PROMOTIONS = [
  { id: 1, text: "Get ₹1000 off on all HP Laptops today!", type: "discount" },
  { id: 2, text: "Free gaming mouse with every desktop purchase.", type: "offer" }
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [salesToday, setSalesToday] = useState(0);
  const [targetToday, setTargetToday] = useState(100000);
  const [ordersProcessed, setOrdersProcessed] = useState(14);
  const [aov, setAov] = useState(4250);
  const [recentOrders, setRecentOrders] = useState([]);
  
  // Stock Check State
  const [stockQuery, setStockQuery] = useState('');
  const [stockResult, setStockResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const [activeRevenueRange, setActiveRevenueRange] = useState('7 Days');

  useEffect(() => {
    if (user?.userId) {
      // Fetch Sales Target
      fetch(`http://localhost:5000/api/sales/dashboard/${user.userId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setSalesToday(data.salesToday || 0);
            setTargetToday(data.targetToday || 100000);
          }
        })
        .catch(err => console.error("Error fetching dashboard data:", err));

      // Fetch Recent Orders (Limit to 4)
      fetch(`http://localhost:5000/api/sales/orders/${user.userId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setRecentOrders(data.data.slice(0, 4));
          }
        })
        .catch(err => console.error("Error fetching recent orders:", err));
    }
  }, [user]);

  const handleStockCheck = async () => {
    if (!stockQuery.trim()) return;
    setIsSearching(true);
    setStockResult(null);
    try {
      const res = await fetch(`http://localhost:5000/api/inventory/${user.storeId}`);
      const data = await res.json();
      if (data.success) {
        const found = data.data.find(p => 
          p.serialNumber.toLowerCase() === stockQuery.toLowerCase() || 
          p.model.toLowerCase().includes(stockQuery.toLowerCase())
        );
        if (found) {
          setStockResult(found);
        } else {
          toast.error("Product not found in store.");
        }
      }
    } catch (error) {
      toast.error("Failed to check stock.");
    } finally {
      setIsSearching(false);
    }
  };

  const progressPercentage = Math.min((salesToday / targetToday) * 100, 100);

  const statCards = [
    { title: "Sales Today", value: `₹${salesToday.toLocaleString()}`, subText: `${progressPercentage.toFixed(1)}% of daily target`, icon: <IndianRupee size={24} />, color: "text-indigo-600", bgBox: "bg-indigo-50/50 border-indigo-100 shadow-indigo-100/50", iconBg: "bg-indigo-100/50", stroke: "#4f46e5", id: "colorEmpSales", data: [{v:20},{v:40},{v:30},{v:70},{v:50},{v:90}] },
    { title: "Daily Target", value: `₹${targetToday.toLocaleString()}`, subText: `Remaining: ₹${Math.max(targetToday - salesToday, 0).toLocaleString()}`, icon: <Target size={24} />, color: "text-emerald-600", bgBox: "bg-emerald-50/50 border-emerald-100 shadow-emerald-100/50", iconBg: "bg-emerald-100/50", stroke: "#10b981", id: "colorEmpTarget", data: [{v:85},{v:82},{v:84},{v:81},{v:83},{v:83}] },
    { title: "Orders Processed", value: ordersProcessed, subText: "+3 vs yesterday", icon: <ShoppingBag size={24} />, color: "text-amber-600", bgBox: "bg-amber-50/50 border-amber-100 shadow-amber-100/50", iconBg: "bg-amber-100/50", stroke: "#f59e0b", id: "colorEmpOrders", data: [{v:10},{v:20},{v:15},{v:30},{v:25},{v:45}] },
    { title: "Avg Order Value", value: `₹${aov.toLocaleString()}`, subText: "Top 10% in store", icon: <TrendingUp size={24} />, color: "text-blue-600", bgBox: "bg-blue-50/50 border-blue-100 shadow-blue-100/50", iconBg: "bg-blue-100/50", stroke: "#2563eb", id: "colorEmpAOV", data: [{v:60},{v:60},{v:40},{v:90},{v:90},{v:90}] },
  ];

  const chartData = useMemo(() => {
    if (activeRevenueRange === '7 Days') return MOCK_PERFORMANCE_HISTORY;
    // Generate 30 days mock data
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      return {
        day: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        sales: Math.floor(Math.random() * 20000) + 10000,
        target: 15000
      };
    });
  }, [activeRevenueRange]);

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

      {/* Charts Row */}
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
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DDA73C" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#DDA73C" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} tickFormatter={(value) => `₹${value/1000}k`} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', padding: '12px' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="sales" name="Sales" stroke="#DDA73C" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
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

      {/* Stock Check & Promos Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Stock Check */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white rounded-3xl p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <PackageSearch className="text-indigo-600" size={24} />
                Quick Stock Check
              </h2>
              <p className="text-slate-500 text-sm">Verify availability instantly without leaving the desk.</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                value={stockQuery}
                onChange={(e) => setStockQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleStockCheck()}
                placeholder="Enter Serial Number or Model..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <button 
              onClick={handleStockCheck}
              disabled={isSearching}
              className="bg-slate-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-900 transition-colors disabled:opacity-50"
            >
              {isSearching ? 'Checking...' : 'Check'}
            </button>
          </div>

          {/* Search Result */}
          {stockResult && (
            <div className="mt-4 p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-slate-800 text-lg">{stockResult.model}</h4>
                <p className="text-sm text-slate-600 line-clamp-1">{stockResult.specs}</p>
              </div>
              <div className="flex items-center gap-4 text-right">
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">Selling Price</p>
                  <p className="font-black text-indigo-700">₹{stockResult.sellingPrice.toLocaleString()}</p>
                </div>
                <div className="h-10 w-px bg-indigo-200"></div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">In Stock</p>
                  <p className={`font-black ${stockResult.quantity > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {stockResult.quantity} Units
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Active Promotions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-amber-50 rounded-3xl p-7 border border-amber-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
        >
          <h2 className="text-lg font-bold text-amber-900 mb-5 flex items-center gap-2">
            <Megaphone className="text-amber-600" size={20} />
            Today's Store Offers
          </h2>
          <div className="space-y-4">
            {PROMOTIONS.map((promo) => (
              <div key={promo.id} className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm flex items-start gap-3">
                <div className="p-2 bg-amber-100 rounded-lg text-amber-700 shrink-0">
                  <Target size={16} />
                </div>
                <p className="text-sm text-amber-900 font-medium pt-1 leading-snug">
                  {promo.text}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions & Recent Bills Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
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
          transition={{ delay: 0.8 }}
          className="bg-white rounded-3xl p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">Your Recent Bills</h2>
            <button onClick={() => navigate('/employee/orders')} className="text-indigo-600 text-sm font-semibold hover:text-indigo-800">View History</button>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order._id} className="p-4 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-colors bg-white flex justify-between items-center group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-indigo-500 group-hover:bg-indigo-100 transition-colors">
                      <Receipt size={20} />
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 text-sm block mb-0.5">{order.invoiceNumber}</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock size={12} /> {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <span className="font-black text-slate-700 block text-sm">₹{order.amount.toLocaleString()}</span>
                      <span className="text-xs text-slate-500 font-medium">{order.customerName || 'Walk-in'}</span>
                    </div>
                    <button onClick={() => navigate('/employee/orders')} className="text-slate-300 hover:text-indigo-600 transition-colors">
                      <ArrowUpRight size={20} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-500 text-sm">
                No sales processed today.
              </div>
            )}
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
