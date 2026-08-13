import React, { useContext, useEffect, useRef, useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Package, FileText, LogOut, Bell, User, Menu, X, ChevronDown, Shield } from 'lucide-react';
import { AuthContext } from '../../../context/AuthContext';
import { motion } from 'framer-motion';
import logo from '../../../assets/logo.png';

export default function AdminLayout() {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const mainRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

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
    { name: 'Dashboard', path: '/admin', end: true, icon: <LayoutDashboard size={20} /> },
    { name: 'Entity Management', path: '/admin/entities', icon: <Users size={20} /> },
    { name: 'Central Catalog', path: '/admin/catalog', icon: <Package size={20} /> },
    { name: 'Audit Logs', path: '/admin/audit', icon: <FileText size={20} /> },
  ];

  const notifications = [
    { id: 1, title: 'New Franchise Request', message: 'User fran123 has registered.', time: '10 mins ago', unread: true },
    { id: 2, title: 'System Update', message: 'Central database synced successfully.', time: '1 hour ago', unread: false },
  ];

  return (
    <div style={{ zoom: 0.75, height: '133.333vh', width: '133.333vw' }} className="flex bg-slate-100 md:p-4 md:gap-4 text-slate-800 font-sans overflow-hidden">
      
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-slate-900/50 z-40 md:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsSidebarOpen(false)} 
      />

      {/* Sidebar */}
      <aside 
        className={`fixed md:relative inset-y-0 left-0 z-50 w-72 md:w-80 bg-white md:rounded-2xl flex flex-col shadow-2xl md:shadow-sm overflow-hidden shrink-0 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="h-20 md:h-28 flex items-center px-4 md:px-6 border-b border-slate-100 justify-between">
          <div className="flex items-center min-w-0">
            <img src={logo} alt="Techhansa Retail" className="h-12 md:h-24 w-auto -ml-2 md:-ml-4 object-contain shrink-0" />
            <span className="text-base md:text-lg font-black ml-2 text-[var(--premium-gold)] tracking-tight uppercase whitespace-nowrap truncate">
              Techhansa Retail
            </span>
          </div>
          <button className="md:hidden text-slate-400 hover:text-slate-600 p-2 shrink-0 ml-1" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-white md:rounded-2xl shadow-sm overflow-hidden relative w-full">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-50 shrink-0 relative">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-xl">
              <Menu size={24} />
            </button>
            <h2 className="text-lg md:text-xl font-semibold text-slate-800 hidden sm:block">
              Welcome back, Super Admin
            </h2>
            <div className="relative ml-4 hidden md:block">
              <button 
                className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors"
              >
                <Shield size={16} className="text-indigo-600" />
                Command Center
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-4 md:gap-6">
            <div className="relative">
              <button 
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors rounded-full hover:bg-slate-50"
              >
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>
              
              {isNotificationOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotificationOpen(false)}></div>
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50">
                    <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center relative z-50">
                      <h3 className="font-bold text-slate-800">Notifications</h3>
                      <button className="text-xs text-indigo-600 font-medium hover:text-indigo-700">Mark all as read</button>
                    </div>
                    <div className="max-h-80 overflow-y-auto relative z-50">
                      {notifications.map(note => (
                        <div key={note.id} className={`px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer ${note.unread ? 'bg-indigo-50/30' : ''}`}>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className={`text-sm font-semibold ${note.unread ? 'text-slate-800' : 'text-slate-600'}`}>{note.title}</h4>
                            <span className="text-[10px] text-slate-400">{note.time}</span>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-2">{note.message}</p>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2 border-t border-slate-100 text-center relative z-50">
                      <button className="text-xs text-indigo-600 font-bold hover:text-indigo-700">View All Notifications</button>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="relative border-l border-slate-200 pl-6">
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-3 hover:bg-slate-50 p-2 rounded-xl transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <User size={18} />
                </div>
                <div className="text-sm hidden md:block">
                  <p className="font-semibold text-slate-700">System Admin</p>
                  <p className="text-slate-500 text-xs">ID: {user?.userId || 'admin123'}</p>
                </div>
                <ChevronDown size={14} className="text-slate-400 hidden md:block" />
              </button>
              
              {isProfileMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)}></div>
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium relative z-50">
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </>
              )}
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
