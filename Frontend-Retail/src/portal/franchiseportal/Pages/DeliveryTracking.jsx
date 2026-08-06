import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PackagePlus, CheckCircle2, Truck, PackageCheck, Clock, Search, ArrowRight } from 'lucide-react';
import { useFranchise } from '../context/FranchiseContext';
import { useLocation } from 'react-router-dom';

export default function DeliveryTracking() {
  const { orders } = useFranchise();
  const location = useLocation();
  const [searchId, setSearchId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [isSearched, setIsSearched] = useState(false);

  // If navigating from Orders page with an ID, track it immediately
  useEffect(() => {
    if (location.state?.orderId) {
      setSearchId(location.state.orderId);
      handleSearch(location.state.orderId);
    }
  }, [location.state]);

  const handleSearch = (idToSearch = searchId) => {
    if (!idToSearch) return;
    setIsSearched(true);
    const order = orders.find(o => o.id.toLowerCase() === idToSearch.toLowerCase());
    setTrackedOrder(order || null);
  };

  const trackingSteps = [
    { name: 'Pending', icon: <Clock size={18}/> },
    { name: 'Approved', icon: <CheckCircle2 size={18}/> },
    { name: 'Packed', icon: <PackageCheck size={18}/> },
    { name: 'Dispatched', icon: <Truck size={18}/> },
    { name: 'Delivered', icon: <PackagePlus size={18}/> }
  ];

  const getStepStatus = (currentStatus, stepName) => {
    const statusIndex = trackingSteps.findIndex(s => s.name === currentStatus);
    const stepIndex = trackingSteps.findIndex(s => s.name === stepName);
    
    if (stepIndex < statusIndex) return 'completed';
    if (stepIndex === statusIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Delivery Tracking</h1>
        <p className="text-slate-500">Track the real-time status of your shipments and orders.</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Enter Order ID (e.g. ORD-001)"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        </div>
        <button 
          onClick={() => handleSearch()}
          className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
        >
          Track Order
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Tracking Result */}
      <AnimatePresence mode="wait">
        {isSearched && trackedOrder ? (
          <motion.div
            key={trackedOrder.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-50/50 gap-4">
              <div>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-block">Order Found</span>
                <h2 className="text-3xl font-bold text-slate-800 tracking-tight">{trackedOrder.id}</h2>
                <p className="text-slate-500 mt-1 font-medium">Placed on: {trackedOrder.date}</p>
              </div>
              <div className="text-left md:text-right bg-white p-4 rounded-xl border border-slate-100 shadow-sm w-full md:w-auto">
                <p className="text-sm text-slate-500 font-medium">Expected Delivery</p>
                <p className="text-xl font-bold text-emerald-600 mt-1">{trackedOrder.expectedDelivery}</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="p-10">
              <h3 className="font-bold text-lg text-slate-800 mb-12">Tracking Timeline</h3>
              
              <div className="py-6 sm:py-8">
                <div className="relative flex flex-col sm:flex-row sm:justify-between px-6 sm:px-8 gap-8 sm:gap-0">
                  
                  {/* Desktop Progress Bars */}
                  <div className="hidden sm:block absolute top-6 left-[10%] right-[10%] h-1.5 bg-slate-100 rounded-full z-0"></div>
                  <div 
                    className="hidden sm:block absolute top-6 left-[10%] h-1.5 bg-indigo-500 rounded-full z-0 transition-all duration-1000"
                    style={{ 
                      width: `${(trackingSteps.findIndex(s => s.name === trackedOrder.status) / (trackingSteps.length - 1)) * 80}%` 
                    }}
                  ></div>

                  {/* Mobile Progress Bars */}
                  <div className="sm:hidden absolute top-8 bottom-8 left-[39px] w-1.5 bg-slate-100 rounded-full z-0"></div>
                  <div 
                    className="sm:hidden absolute top-8 left-[39px] w-1.5 bg-indigo-500 rounded-full z-0 transition-all duration-1000"
                    style={{ 
                      height: `${(trackingSteps.findIndex(s => s.name === trackedOrder.status) / (trackingSteps.length - 1)) * 100}%` 
                    }}
                  ></div>

                  {trackingSteps.map((step, idx) => {
                    const state = getStepStatus(trackedOrder.status, step.name);
                    return (
                      <div key={step.name} className="relative z-10 flex sm:flex-col items-center gap-6 sm:gap-4 sm:w-20">
                        <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center border-4 transition-colors duration-300 ${
                          state === 'completed' ? 'bg-indigo-500 border-indigo-200 text-white' :
                          state === 'current' ? 'bg-white border-indigo-500 text-indigo-600 shadow-[0_0_0_8px_rgba(99,102,241,0.1)]' :
                          'bg-white border-slate-100 text-slate-300'
                        }`}>
                          {step.icon}
                        </div>
                        <span className={`text-base sm:text-sm font-bold text-left sm:text-center ${
                          state === 'upcoming' ? 'text-slate-400' : 'text-slate-800'
                        }`}>
                          {step.name}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
              
              <div className="mt-12 p-6 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                 <div>
                    <h4 className="font-bold text-slate-800 mb-1">Order Summary</h4>
                    <p className="text-sm text-slate-500">{trackedOrder.items} items included in this shipment.</p>
                 </div>
                 <div className="text-right">
                    <p className="text-sm text-slate-500 font-medium mb-1">Total Value</p>
                    <p className="font-bold text-lg text-slate-800">₹{trackedOrder.total.toLocaleString()}</p>
                 </div>
              </div>
            </div>

          </motion.div>
        ) : isSearched && !trackedOrder ? (
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center"
          >
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <Search className="text-slate-400" size={24} />
             </div>
             <h3 className="text-lg font-bold text-slate-800">Order Not Found</h3>
             <p className="text-slate-500 mt-2">We couldn't find an order with the ID "{searchId}". Please check and try again.</p>
          </motion.div>
        ) : (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-16 text-center flex flex-col items-center justify-center">
            <Truck size={48} className="text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-700">Track your order</h3>
            <p className="text-slate-500 mt-2 max-w-md">Enter your Order ID above to see real-time updates on your shipment status and expected delivery date.</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
