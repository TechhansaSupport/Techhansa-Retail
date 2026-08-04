import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard,
  FileText,
  FileBadge,
  ShoppingCart,
  Truck,
  Receipt,
  PieChart,
  Headset,
  UserCircle,
  LogOut
} from 'lucide-react';
import { AuthContext } from '../../../context/AuthContext';

const SidebarLink = ({ to, icon: Icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/channel' && location.pathname.startsWith(to));
  
  return (
    <Link
      to={to}
      className={`relative flex items-center gap-3 px-4 py-3 mx-2 my-1 text-sm font-medium transition-all duration-200 rounded-xl group overflow-hidden ${
        isActive 
          ? 'text-blue-700' 
          : 'text-slate-500 hover:text-slate-900'
      }`}
    >
      {isActive && (
        <motion.div 
          layoutId="sidebar-active"
          className="absolute inset-0 bg-blue-50 border border-blue-100/50 rounded-xl -z-10"
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      {!isActive && (
        <div className="absolute inset-0 bg-slate-100 opacity-0 group-hover:opacity-100 rounded-xl -z-10 transition-opacity duration-200" />
      )}
      <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
      <span className="relative z-10">{children}</span>
    </Link>
  );
};

export default function Sidebar({ isOpen, setIsOpen }) {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className={`w-64 bg-white/80 backdrop-blur-xl border border-slate-200 flex flex-col h-[calc(100vh-1rem)] md:h-full z-50 rounded-2xl shadow-sm overflow-hidden transition-transform duration-300 absolute md:relative left-2 md:left-0 top-2 md:top-0 ${isOpen ? 'translate-x-0' : '-translate-x-[150%] md:translate-x-0'}`}>
      {/* Logo Area */}
      <div className="h-24 flex items-center px-1 border-b border-slate-100 shrink-0">
        <Link to="/" className="flex items-center gap-2">
          <img src="/src/assets/logo.png" alt="Techhansa" className="h-22 w-auto" />
          <span className="font-bold text-[#DDA73C] text-lg leading-tight mt-1">
            Techhansa Retail
          </span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4 flex flex-col gap-1">
        <SidebarLink to="/channel" icon={LayoutDashboard}>Dashboard</SidebarLink>
        <SidebarLink to="/channel/rfp" icon={FileText}>RFP Management</SidebarLink>
        <SidebarLink to="/channel/quotations" icon={FileBadge}>Quotations</SidebarLink>
        <SidebarLink to="/channel/orders" icon={ShoppingCart}>Orders</SidebarLink>
        <SidebarLink to="/channel/tracking" icon={Truck}>Delivery Tracking</SidebarLink>
        <SidebarLink to="/channel/invoices" icon={Receipt}>Invoices</SidebarLink>
        <SidebarLink to="/channel/reports" icon={PieChart}>Reports</SidebarLink>
        
        <div className="pt-4 mt-auto border-t border-slate-100 mx-2">
          <SidebarLink to="/channel/support" icon={Headset}>Support</SidebarLink>
          <SidebarLink to="/channel/profile" icon={UserCircle}>Profile</SidebarLink>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 mt-1 text-sm font-medium transition-all duration-200 text-red-600 hover:bg-red-50 rounded-xl"
          >
            <LogOut className="w-5 h-5 text-red-500" />
            Logout
          </button>
        </div>
      </nav>
    </aside>
  );
}
