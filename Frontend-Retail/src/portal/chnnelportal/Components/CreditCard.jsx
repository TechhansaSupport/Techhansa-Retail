import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, TrendingUp, AlertTriangle, ExternalLink } from 'lucide-react';
import { AuthContext } from '../../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function CreditCard() {
  const { user } = useContext(AuthContext) || {};
  
  if (!user || user.role !== 'channel') return null;

  const total = user.totalCredit || 0;
  const used = user.usedCredit || 0;
  const reserved = user.reservedCredit || 0;
  const available = total - used - reserved;

  const percentage = total > 0 ? (available / total) * 100 : 0;
  
  let statusColor = 'text-emerald-600';
  let bgColor = 'bg-emerald-50';
  let barColor = 'bg-emerald-500';
  let icon = <TrendingUp className="w-5 h-5 text-emerald-600" />;

  if (percentage <= 20) {
    statusColor = 'text-red-600';
    bgColor = 'bg-red-50';
    barColor = 'bg-red-500';
    icon = <AlertTriangle className="w-5 h-5 text-red-600" />;
  } else if (percentage <= 50) {
    statusColor = 'text-amber-600';
    bgColor = 'bg-amber-50';
    barColor = 'bg-amber-500';
    icon = <AlertTriangle className="w-5 h-5 text-amber-600" />;
  }

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between relative group"
    >
      <Link to="/channel/credit-history" className="absolute top-4 right-4 p-2 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100" title="View Credit History">
        <ExternalLink className="w-4 h-4" />
      </Link>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Credit Limit</h2>
          <div className="text-3xl font-bold text-gray-900">{formatCurrency(available)}</div>
          <p className="text-sm text-gray-500 mt-1">Available to spend</p>
        </div>
        <div className={`p-3 rounded-xl ${bgColor}`}>
          {icon}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1.5">
            <span className="font-medium text-gray-700">Usage</span>
            <span className={`font-semibold ${statusColor}`}>{percentage.toFixed(0)}% Left</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden flex">
            {used > 0 && (
              <div className={`${barColor} h-2.5`} style={{ width: `${(used / total) * 100}%` }} title="Used Credit"></div>
            )}
            {reserved > 0 && (
              <div className="bg-blue-300 h-2.5" style={{ width: `${(reserved / total) * 100}%` }} title="Reserved for pending orders"></div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div>
            <div className="text-xs text-gray-500 mb-1">Total Limit</div>
            <div className="font-semibold text-gray-800">{formatCurrency(total)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Used & Reserved</div>
            <div className="font-semibold text-gray-800">{formatCurrency(used + reserved)}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
