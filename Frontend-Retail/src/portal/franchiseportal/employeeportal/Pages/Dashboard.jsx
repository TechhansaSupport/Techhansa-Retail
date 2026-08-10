import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { IndianRupee, Target, TrendingUp, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthContext } from '../../../../context/AuthContext';

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [salesToday, setSalesToday] = useState(0);
  const [targetToday, setTargetToday] = useState(100000);

  useEffect(() => {
    if (user?.userId) {
      fetch(`http://localhost:5000/api/sales/dashboard/${user.userId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setSalesToday(data.salesToday || 0);
            setTargetToday(data.targetToday || 100000);
          }
        })
        .catch(err => console.error("Error fetching dashboard data:", err));
    }
  }, [user]);

  const progressPercentage = Math.min((salesToday / targetToday) * 100, 100);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Overview</h1>
          <p className="text-slate-500">Track your daily targets and sales.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Module A - My Target / Sales */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm font-medium text-slate-500">Sales Today</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1 flex items-center">
                <IndianRupee size={28} className="mr-1" />
                {salesToday.toLocaleString()}
              </h3>
            </div>
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <TrendingUp size={24} />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-slate-600">Daily Target</span>
              <span className="text-slate-500">₹{targetToday.toLocaleString()}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 mb-2">
              <div 
                className="bg-indigo-600 h-3 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-400 mt-2 flex items-center">
              <Target size={14} className="mr-1" />
              {progressPercentage.toFixed(1)}% achieved today
            </p>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-2xl shadow-sm text-white relative overflow-hidden flex flex-col justify-center items-center"
        >
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
          
          <h3 className="text-xl font-bold mb-2">Ready for a sale?</h3>
          <p className="text-indigo-100 text-center mb-6 max-w-xs text-sm">
            Start a new customer checkout process instantly.
          </p>
          
          <button 
            onClick={() => navigate('/employee/billing')}
            className="flex items-center gap-2 bg-white text-indigo-700 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 hover:scale-105 transition-all shadow-lg w-full max-w-sm justify-center"
          >
            <PlusCircle size={20} />
            New Billing
          </button>
        </motion.div>
      </div>

    </div>
  );
}
