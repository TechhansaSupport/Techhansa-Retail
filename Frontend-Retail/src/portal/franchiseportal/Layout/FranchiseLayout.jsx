import React, { useContext } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Store, Package, ShoppingCart, BarChart3, LogOut, Bell, User, Receipt, Truck } from 'lucide-react';
import { AuthContext } from '../../../context/AuthContext';
import { motion } from 'framer-motion';
import logo from '../../../assets/logo.png';

export default function FranchiseLayout() {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/franchise', end: true, icon: <LayoutDashboard size={20} /> },
    { name: 'Billing / POS', path: '/franchise/billing', icon: <Receipt size={20} /> },
    { name: 'Store Profile', path: '/franchise/profile', icon: <Store size={20} /> },
    { name: 'Inventory', path: '/franchise/inventory', icon: <Package size={20} /> },
    { name: 'Orders', path: '/franchise/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Delivery Tracking', path: '/franchise/tracking', icon: <Truck size={20} /> },
    { name: 'Sales & Reports', path: '/franchise/sales', icon: <BarChart3 size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-slate-100 p-4 gap-4 text-slate-800 font-sans overflow-hidden">
      
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-80 bg-white rounded-2xl flex flex-col shadow-sm z-20 overflow-hidden shrink-0"
      >
        <div className="h-28 flex items-center px-6 border-b border-slate-100">
          <img src={logo} alt="Techhansa Retail" className="h-24 w-auto -ml-4 object-contain shrink-0" />
          <div className="flex items-center overflow-hidden">
            <span className="text-lg font-black ml-2 text-[var(--premium-gold)] tracking-tight uppercase whitespace-nowrap truncate">
              Techhansa Retail
            </span>
          </div>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 font-semibold shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-500'
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10 shrink-0">
          <h2 className="text-xl font-semibold text-slate-800">
            Welcome back, {user?.userId || 'Partner'}
          </h2>
          
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors rounded-full hover:bg-slate-50">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
              <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <User size={18} />
              </div>
              <div className="text-sm">
                <p className="font-semibold text-slate-700">Downtown Store</p>
                <p className="text-slate-500 text-xs">ID: {user?.userId}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content View */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
