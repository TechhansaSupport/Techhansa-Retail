import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Truck, CheckCircle, Package, MapPin, Search, Calendar, PackageOpen, FileCheck, ArrowRight, Check, XCircle } from 'lucide-react';
import { AuthContext } from '../../../context/AuthContext';

export default function DeliveryTracking() {
  const { user } = useContext(AuthContext) || { user: null };
  const location = useLocation();
  const passedOrder = location.state?.order;

  const [trackingId, setTrackingId] = useState(passedOrder ? (passedOrder.orderNumber || passedOrder.orderId) : '');
  const [searched, setSearched] = useState(!!passedOrder);
  const [order, setOrder] = useState(passedOrder || null);
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!trackingId.trim()) return;
    
    setIsSearching(true);
    setSearched(false);
    setError('');

    try {
      const url = user?.userId ? `http://localhost:5000/api/procurement/orders?userId=${user.userId}` : 'http://localhost:5000/api/procurement/orders';
      const res = await fetch(url);
      const data = await res.json();
      const found = data.find(o => (o.orderNumber === trackingId.trim() || o.orderId === trackingId.trim()));
      
      // Artificial delay for smooth animation experience
      setTimeout(() => {
        if (found) {
          setOrder(found);
          setSearched(true);
        } else {
          setError('We could not find an order with that tracking ID.');
        }
        setIsSearching(false);
      }, 600);
    } catch (err) {
      setError('An error occurred while fetching tracking details.');
      setIsSearching(false);
    }
  };

  const statusLevels = { 'Pending': -1, 'Confirmed': 0, 'Processing': 1, 'Dispatched': 2, 'Out for Delivery': 3, 'Delivered': 4 };
  const currentLevel = order ? (statusLevels[order.status] ?? -1) : -1;

  const steps = [
    { title: 'Confirmed', subtitle: 'Order confirmed', icon: FileCheck },
    { title: 'Processing', subtitle: 'Preparing items', icon: PackageOpen },
    { title: 'Dispatched', subtitle: 'Handed to courier', icon: Package },
    { title: 'Out for Delivery', subtitle: 'Arriving soon', icon: Truck },
    { title: 'Delivered', subtitle: 'Successfully delivered', icon: MapPin }
  ];

  // Calculate progress percentage for the connecting line
  const progressPercentage = Math.max(0, Math.min(100, (currentLevel / (steps.length - 1)) * 100));

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50/50 pb-20">
      
      {/* Hero Section */}
    

      {/* Floating Search Bar */}
      <div className="max-w-3xl mx-auto px-6 mt-8 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-2 md:p-3 border border-slate-100 flex flex-col md:flex-row gap-2"
        >
          <div className="relative flex-1 flex items-center">
            <Search className="absolute left-4 w-2 h-5 text-slate-400" />
            <input 
              type="text" 
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
              placeholder="Enter Tracking or Order ID (e.g., ORD-2024...)" 
              className="w-full pl-12 pr-4 py-4 text-slate-900 bg-transparent text-lg placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          <button 
            onClick={handleSearch}
            disabled={isSearching}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 group shrink-0"
          >
            {isSearching ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Track Order</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </motion.div>
        
        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center justify-center gap-2 font-medium shadow-sm"
            >
              <XCircle className="w-5 h-5" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tracking Results Area */}
      <AnimatePresence>
        {searched && order && !isSearching && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-6xl mx-auto px-6 mt-16 space-y-8"
          >
            {/* Order Quick Summary Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/60 flex flex-col md:flex-row gap-6 relative overflow-hidden">
              {/* Decorative gradient blob */}
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-50 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="relative flex-1">
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Order Number</p>
                <p className="text-xl font-bold text-slate-900">{order.orderNumber || order.orderId}</p>
              </div>
              <div className="relative flex-1 md:border-l md:border-slate-100 md:pl-6">
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Order Date</p>
                <div className="flex items-center gap-2 text-slate-900">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <p className="text-lg font-semibold">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
              <div className="relative flex-1 md:border-l md:border-slate-100 md:pl-6">
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Current Status</p>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-bold">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                  </span>
                  {order.status || 'Pending'}
                </div>
              </div>
            </div>

            {/* Main Tracking Timeline */}
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/20 border border-slate-200/60 overflow-hidden">
              <h3 className="text-xl font-bold text-slate-900 mb-12">Tracking Progress</h3>
              
              {/* Horizontal Stepper (Desktop) */}
              <div className="hidden md:block relative px-4">
                {/* Background Line */}
                <div className="absolute top-8 left-8 right-8 h-1 bg-slate-100 rounded-full"></div>
                
                {/* Animated Progress Line */}
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute top-8 left-8 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                ></motion.div>

                <div className="relative flex justify-between">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = currentLevel >= index;
                    const isCurrent = currentLevel === index;

                    return (
                      <div key={index} className="flex flex-col items-center relative w-32">
                        {/* Icon Node */}
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.2, type: "spring" }}
                          className={`
                            relative z-10 flex items-center justify-center w-16 h-16 rounded-2xl mb-4 transition-all duration-500
                            ${isCompleted ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white border-2 border-slate-200 text-slate-300'}
                            ${isCurrent ? 'ring-4 ring-blue-100 scale-110' : ''}
                          `}
                        >
                          <Icon className={`w-6 h-6 ${isCompleted ? 'text-white' : 'text-slate-300'}`} />
                          
                          {/* Status Badge */}
                          {isCompleted && (
                            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${(!isCurrent || index === steps.length - 1) ? 'bg-emerald-500' : 'bg-blue-500'}`}>
                              <Check className="w-3 h-3 text-white" strokeWidth={3} />
                            </div>
                          )}
                        </motion.div>

                        {/* Text Content */}
                        <div className="text-center">
                          <p className={`font-bold text-base mb-1 ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                            {step.title}
                          </p>
                          <p className={`text-xs ${isCompleted ? 'text-slate-500' : 'text-slate-300'}`}>
                            {step.subtitle}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Vertical Stepper (Mobile) */}
              <div className="block md:hidden relative pl-6 space-y-10">
                {/* Vertical Background Line */}
                <div className="absolute top-0 bottom-0 left-[2.4rem] w-1 bg-slate-100 rounded-full -translate-x-1/2"></div>
                
                {/* Vertical Progress Line */}
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${progressPercentage}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute top-0 left-[2.4rem] w-1 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full -translate-x-1/2"
                ></motion.div>

                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = currentLevel >= index;
                  const isCurrent = currentLevel === index;

                  return (
                    <div key={index} className="relative flex items-center gap-6">
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.2 }}
                        className={`
                          relative z-10 flex items-center justify-center w-14 h-14 rounded-2xl shrink-0
                          ${isCompleted ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white border-2 border-slate-200 text-slate-300'}
                          ${isCurrent ? 'ring-4 ring-blue-100' : ''}
                        `}
                      >
                        <Icon className="w-6 h-6" />
                        {isCompleted && (
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${(!isCurrent || index === steps.length - 1) ? 'bg-emerald-500' : 'bg-blue-500'}`}>
                            <Check className="w-2 h-2 text-white" strokeWidth={3} />
                          </div>
                        )}
                      </motion.div>
                      
                      <div>
                        <p className={`font-bold text-lg mb-1 ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                          {step.title}
                        </p>
                        <p className={`text-sm ${isCompleted ? 'text-slate-500' : 'text-slate-300'}`}>
                          {step.subtitle}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
