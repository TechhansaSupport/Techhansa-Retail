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
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-10 shrink-0">
      <div className="flex items-center gap-3">
        {/* Hamburger Menu (Mobile Only) */}
        <button 
          onClick={toggleSidebar}
          className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-xl"
        >
          <Menu size={24} />
        </button>
        <h2 className="text-lg md:text-xl font-semibold text-slate-800 hidden sm:block">
          Welcome back, {user?.name || user?.userId || 'Partner'}
        </h2>
      </div>
      
      <div className="flex items-center gap-4 md:gap-6">
        <div className="relative border-l border-slate-200 pl-6 flex items-center gap-2">
          <button onClick={() => navigate('/channel/profile')} className="flex items-center gap-3 hover:bg-slate-50 p-2 rounded-xl transition-colors text-left">
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 overflow-hidden">
              {user?.profilePhoto ? (
                <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="font-bold text-sm">{user?.name ? user.name.charAt(0) : 'C'}</span>
              )}
            </div>
            <div className="text-sm hidden md:block">
              <p className="font-semibold text-slate-700">{user?.name || 'Channel Partner'}</p>
              <p className="text-slate-500 text-xs">ID: {user?.userId}</p>
            </div>
          </button>
          
          <button onClick={() => navigate('/channel/settings')} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors rounded-full hover:bg-slate-50 hidden sm:block">
            <Settings size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
