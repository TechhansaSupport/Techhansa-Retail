import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios';
import { motion } from 'framer-motion';
import { Bell, Check, Trash2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      // Assuming Admin userId is 'admin123'
      const response = await axios.get('/api/notifications/admin123');
      setNotifications(response.data);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, unread: false } : n));
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put('/api/notifications/admin123/read-all');
      setNotifications(notifications.map(n => ({ ...n, unread: false })));
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
            <Bell size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Notifications</h1>
            <p className="text-slate-500 text-sm mt-1">Manage your alerts and system updates</p>
          </div>
        </div>
        <button
          onClick={markAllAsRead}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg font-medium transition-colors"
        >
          <Check size={18} />
          Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-h-[500px]">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <Bell size={48} className="mb-4 text-slate-300 opacity-50" />
            <p className="text-lg font-medium">No notifications yet</p>
            <p className="text-sm mt-1">You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((note, index) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={note._id}
                className={`p-5 transition-colors ${note.unread ? 'bg-indigo-50/30 hover:bg-indigo-50/60' : 'hover:bg-slate-50'}`}
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className={`w-3 h-3 rounded-full mt-1 ${note.unread ? 'bg-indigo-500 shadow-sm shadow-indigo-300' : 'bg-transparent'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-1 sm:gap-4 mb-1">
                      <h4 className={`text-base font-semibold ${note.unread ? 'text-slate-900' : 'text-slate-700'}`}>
                        {note.title}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 whitespace-nowrap">
                        <Clock size={14} />
                        {note.time}
                      </div>
                    </div>
                    <p className={`text-sm ${note.unread ? 'text-slate-700' : 'text-slate-500'}`}>
                      {note.message}
                    </p>
                    
                    {note.unread && (
                      <div className="mt-3">
                        <button
                          onClick={() => markAsRead(note._id)}
                          className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-2.5 py-1.5 rounded-md transition-colors"
                        >
                          <Check size={14} /> Mark as read
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
