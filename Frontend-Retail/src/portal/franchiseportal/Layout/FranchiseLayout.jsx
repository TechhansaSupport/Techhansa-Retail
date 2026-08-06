import React, { useContext, useEffect, useRef, useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Store, Package, ShoppingCart, BarChart3, LogOut, Bell, User, Receipt, Truck, Menu, X } from 'lucide-react';
import { AuthContext } from '../../../context/AuthContext';
import { motion } from 'framer-motion';
import logo from '../../../assets/logo.png';

export default function FranchiseLayout() {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const mainRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
    // Close sidebar on mobile when route changes
    setIsSidebarOpen(false);
  }, [location.pathname]);

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
    <div className="flex h-screen bg-slate-100 md:p-4 md:gap-4 text-slate-800 font-sans overflow-hidden">
      
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-slate-900/50 z-40 md:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsSidebarOpen(false)} 
      />

      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className={`fixed md:relative inset-y-0 left-0 z-50 w-72 md:w-80 bg-white md:rounded-2xl flex flex-col shadow-2xl md:shadow-sm overflow-hidden shrink-0 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="h-20 flex items-center px-4 md:px-6 border-b border-slate-100 justify-between">
          <div className="flex items-center min-w-0">
            <img src={logo} alt="Techhansa Retail" className="h-12 w-auto -ml-2 object-contain shrink-0" />
            <span className="text-base md:text-lg font-black ml-2 text-[var(--premium-gold)] tracking-tight uppercase whitespace-nowrap truncate">
              Techhansa Retail
            </span>
          </div>
          <button className="md:hidden text-slate-400 hover:text-slate-600 p-2 shrink-0 ml-1" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
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
      <div className="flex-1 flex flex-col bg-white md:rounded-2xl shadow-sm overflow-hidden relative w-full">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-xl">
              <Menu size={24} />
            </button>
            <h2 className="text-lg md:text-xl font-semibold text-slate-800 hidden sm:block">
              Welcome back, {user?.userId || 'Partner'}
            </h2>
          </div>
          
          <div className="flex items-center gap-4 md:gap-6">
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
        <main ref={mainRef} className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
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
