import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Filter, Truck, CheckCircle, Package, Download } from 'lucide-react';
import { exportToCSV } from '../../../utils/exportUtils';
import { AuthContext } from '../../../context/AuthContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function Orders() {
  const { user } = useContext(AuthContext) || { user: null };
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(location.state?.filter || 'All');
  
  useEffect(() => {
    if (user?.userId) fetchOrders();
  }, [user]);
  
  const fetchOrders = async () => {
    if (!user?.userId) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/procurement/orders?userId=${user.userId}`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    }
  };

  const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Dispatched', 'Out for Delivery', 'Delivered', 'Declined', 'Rejected'];

  const filteredOrders = orders.filter(o => {
    if (!validStatuses.includes(o.status)) return false;

    const orderId = o.orderNumber || o.orderId || '';
    const matchesSearch = orderId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-[1600px] mx-auto pb-12 space-y-6">
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Orders</h1>
          <p className="text-slate-500 text-sm mt-1">Track and manage your procurement orders.</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            />
          </div>
          
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium focus:outline-none focus:border-blue-500 shrink-0 bg-white"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Approved</option>
            <option value="Processing">Processing</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Declined">Declined</option>
          </select>

          <button onClick={() => exportToCSV('orders.csv', filteredOrders, [
            { key: 'orderNumber', label: 'Order ID' },
            { key: 'status', label: 'Status' },
            { key: 'totalAmount', label: 'Total Amount' },
            { key: 'createdAt', label: 'Order Date' }
          ])} className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shrink-0">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-12 text-center text-slate-500">
            No orders found.
          </div>
        ) : (
          filteredOrders.map((order) => (
            <motion.div key={order._id} variants={itemVariants} className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-bold text-blue-600 text-sm cursor-pointer hover:underline">{order.orderNumber || order.orderId}</span>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                    order.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 
                    order.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700' :
                    order.status === 'Declined' || order.status === 'Rejected' ? 'bg-red-50 text-red-700' :
                    'bg-blue-50 text-blue-700'
                  }`}>
                    {order.status === 'Pending' ? 'Pending Admin Approval' : order.status === 'Confirmed' ? 'Approved' : order.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => navigate('/channel/tracking', { state: { order } })} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Track Delivery">
                    <Truck className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 mt-4">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-medium">Value:</span>
                  <span className="text-slate-700 font-semibold">₹{order.totalAmount?.toLocaleString('en-IN') || 0}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-medium">Date:</span>
                  <span className="text-slate-700">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
}
