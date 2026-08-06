import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Truck, CheckCircle, Package, MapPin, Clock, FileCheck } from 'lucide-react';
import { AuthContext } from '../../../context/AuthContext';

export default function DeliveryTracking() {
  const { user } = useContext(AuthContext) || { user: null };
  const location = useLocation();
  const passedOrder = location.state?.order;

  const [trackingId, setTrackingId] = useState(passedOrder ? (passedOrder.orderNumber || passedOrder.orderId) : '');
  const [searched, setSearched] = useState(!!passedOrder);
  const [order, setOrder] = useState(passedOrder || null);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (trackingId.trim()) {
      try {
        const url = user?.userId ? `http://localhost:5000/api/procurement/orders?userId=${user.userId}` : 'http://localhost:5000/api/procurement/orders';
        const res = await fetch(url);
        const data = await res.json();
        const found = data.find(o => (o.orderNumber === trackingId.trim() || o.orderId === trackingId.trim()));
        if (found) {
          setOrder(found);
          setSearched(true);
          setError('');
        } else {
          setError('Order not found');
          setSearched(false);
        }
      } catch (err) {
        setError('Error fetching order');
      }
    }
  };

  const statusLevels = { 'Pending': 0, 'Confirmed': 1, 'Processing': 2, 'Shipped': 3, 'Delivered': 4 };
  const currentLevel = order ? (statusLevels[order.status] || 0) : -1;

  const steps = [
    {
      title: 'Admin Approval',
      desc: currentLevel >= 1 ? 'Admin has approved the RFP and Order.' : 'Pending approval from Admin.',
      completed: currentLevel >= 1,
      icon: FileCheck,
      date: order ? new Date(order.createdAt).toLocaleDateString() : ''
    },
    {
      title: 'Order Placed',
      desc: currentLevel >= 1 ? 'We have received your order and confirmed it.' : 'Awaiting confirmation.',
      completed: currentLevel >= 1,
      icon: CheckCircle,
      date: ''
    },
    {
      title: 'Packed',
      desc: currentLevel >= 2 ? 'Your items are packed and ready for shipping.' : 'Pending packaging.',
      completed: currentLevel >= 2,
      icon: Package,
      date: ''
    },
    {
      title: 'In Transit',
      desc: currentLevel >= 3 ? 'Dispatched and out for delivery.' : 'Pending dispatch.',
      completed: currentLevel >= 3,
      icon: Truck,
      date: ''
    },
    {
      title: 'Delivered',
      desc: currentLevel >= 4 ? 'Order has been delivered successfully.' : 'Pending delivery.',
      completed: currentLevel >= 4,
      icon: MapPin,
      date: ''
    }
  ];

  return (
    <div className="max-w-4xl mx-auto pb-12 p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Delivery Tracking</h1>
      <p className="text-gray-500 text-sm mb-8">Enter your Order ID or Tracking ID to see the live status.</p>
      
      <form onSubmit={handleSearch} className="mb-10 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input 
            type="text" 
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="e.g. ORD-RFP-2024-001" 
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
        <button type="submit" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors h-fit">
          Track
        </button>
      </form>

      {searched && order && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Truck className="w-48 h-48" />
          </div>
          <div className="relative z-10">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Tracking Details for {trackingId}</h2>
            
            <div className="relative pl-8 space-y-8 before:absolute before:inset-0 before:ml-10 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
              
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = step.completed;
                const isCurrent = currentLevel === index; // Highlight current step differently?
                
                // Color logic
                let iconWrapperClass = "border-white shadow ";
                let iconClass = "w-3 h-3 ";
                let boxClass = "p-4 rounded border shadow-sm ";
                let titleClass = "font-bold text-sm mb-1 ";
                let descClass = "text-sm ";

                if (isCompleted) {
                  iconWrapperClass += "bg-blue-500 text-white";
                  boxClass += "border-gray-100 bg-gray-50";
                  titleClass += "text-gray-800";
                  descClass += "text-slate-500";
                } else {
                  iconWrapperClass += "bg-gray-200 text-gray-400";
                  boxClass += "border-transparent";
                  titleClass += "text-gray-400";
                  descClass += "text-gray-400";
                }

                // If it's the exact current step, maybe make it stand out a bit
                if (isCompleted && currentLevel === index) {
                  iconWrapperClass = iconWrapperClass.replace("bg-blue-500", "bg-amber-500");
                  boxClass = "p-4 rounded border shadow-sm border-blue-200 bg-blue-50/50";
                  titleClass = titleClass.replace("text-gray-800", "text-blue-800");
                  descClass = descClass.replace("text-slate-500", "text-blue-700");
                }

                return (
                  <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full border shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ${iconWrapperClass}`}>
                      <Icon className={iconClass} />
                    </div>
                    <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] ${boxClass}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={titleClass}>{step.title}</span>
                        {step.date && <span className="text-xs font-medium text-gray-500">{step.date}</span>}
                      </div>
                      <div className={descClass}>{step.desc}</div>
                    </div>
                  </div>
                );
              })}
              
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
