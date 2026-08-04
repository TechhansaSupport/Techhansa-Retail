import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Bell, 
  Search, 
  MessageSquare, 
  HelpCircle, 
  Settings, 
  LogOut,
  LayoutDashboard,
  FileText,
  FileBadge,
  ShoppingCart,
  Truck,
  Receipt,
  PieChart,
  Headset,
  UserCircle
} from 'lucide-react';

const SidebarLink = ({ to, icon: Icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/channel' && location.pathname.startsWith(to));
  
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
        isActive 
          ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
      {children}
    </Link>
  );
};

export default function Layout() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full hidden md:flex z-20">
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <span className="text-xl font-bold text-gray-900 tracking-tight">Techhansa <span className="text-blue-600">B2B</span></span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-1">
          <SidebarLink to="/channel" icon={LayoutDashboard}>Dashboard</SidebarLink>
          <SidebarLink to="/channel/rfp" icon={FileText}>RFP Management</SidebarLink>
          <SidebarLink to="/channel/quotations" icon={FileBadge}>Quotations</SidebarLink>
          <SidebarLink to="/channel/orders" icon={ShoppingCart}>Orders</SidebarLink>
          <SidebarLink to="/channel/tracking" icon={Truck}>Delivery Tracking</SidebarLink>
          <SidebarLink to="/channel/invoices" icon={Receipt}>Invoices</SidebarLink>
          <SidebarLink to="/channel/reports" icon={PieChart}>Reports</SidebarLink>
          
          <div className="pt-4 mt-4 border-t border-gray-200">
            <SidebarLink to="/channel/support" icon={Headset}>Support Center</SidebarLink>
            <SidebarLink to="/channel/profile" icon={UserCircle}>Profile</SidebarLink>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Top Navigation */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10 shrink-0">
          <div className="flex-1 flex items-center">
            {/* Global Search */}
            <div className="relative w-96 hidden lg:block">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </span>
              <input 
                type="text" 
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out" 
                placeholder="Search RFPs, Orders, Invoices..." 
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-500 relative cursor-pointer">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-500 cursor-pointer">
              <MessageSquare className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-500 cursor-pointer">
              <HelpCircle className="h-5 w-5" />
            </button>
            <div className="h-8 w-px bg-gray-200 mx-2"></div>
            <button className="flex items-center gap-2 cursor-pointer">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                JD
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">John Doe</span>
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-500 ml-2 cursor-pointer">
              <Settings className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-red-500 ml-2 cursor-pointer">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
