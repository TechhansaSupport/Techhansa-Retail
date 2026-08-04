import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Search, 
  MessageSquare, 
  HelpCircle, 
  Settings,
  Menu
} from 'lucide-react';
import { AuthContext } from '../../../context/AuthContext';

export default function Header({ toggleSidebar }) {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="h-20 bg-white/70 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-4 md:px-8 z-30 shrink-0 sticky top-0 transition-all">
      <div className="flex-1 flex items-center gap-4">
        {/* Hamburger Menu (Mobile Only) */}
        <button 
          onClick={toggleSidebar}
          className="md:hidden p-2 -ml-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        {/* Global Search */}
       
      </div>
      
      <div className="flex items-center gap-3">
        <button className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all relative cursor-pointer">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>
        <button className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all cursor-pointer">
          <MessageSquare className="h-5 w-5" />
        </button>
        <button className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all cursor-pointer hidden sm:block">
          <HelpCircle className="h-5 w-5" />
        </button>
        
        <div className="h-8 w-px bg-slate-200 mx-2"></div>
        
        <button className="flex items-center gap-3 cursor-pointer p-1.5 hover:bg-slate-100 rounded-full transition-all pr-4">
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white">
            {user?.name ? user.name.charAt(0) : 'JD'}
          </div>
          <span className="text-sm font-medium text-slate-700 hidden sm:block">
            {user?.name || 'John Doe'}
          </span>
        </button>
        
        <button className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all cursor-pointer">
          <Settings className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
