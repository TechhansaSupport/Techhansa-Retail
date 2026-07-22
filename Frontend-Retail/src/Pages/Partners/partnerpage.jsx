import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Handshake, X, AlertCircle, ShieldCheck } from 'lucide-react';

// --- IMPORT YOUR TWO FORM COMPONENTS ---
import PartnerForm from './parntnerform';
import FranchiseForm from './FranchiseForm';

// --- IMAGE IMPORTS ---
// Make sure this path is correct according to your folder structure
import franchiseBannerImg from "../../assets/contact-banner.jpg";

export default function PartnerApplicationPage() {
  const containerRef = useRef(null);
  const location = useLocation();

  // --- PARTNER TYPE STATE (Tabs) ---
  // Auto-select franchise tab if user arrives from /partner/franchise route
  const [partnerType, setPartnerType] = useState(
    location.pathname.includes('franchise') ? 'franchise' : 'partnerform'
  );

  // --- TOAST NOTIFICATION STATE ---
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  // Ye function hum child form components ko as a prop pass karenge
  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    // Auto hide after 3.5 seconds
    setTimeout(() => setToast({ visible: false, message: '', type: 'success' }), 3500);
  };

  return (
    <div ref={containerRef} className="relative min-h-screen bg-transparent font-sans text-gray-600 selection:bg-[#0d3863]/20 selection:text-[#0d3863]">
      
      {/* ================= TOAST POPUP ================= */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className={`fixed top-8 left-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border bg-white min-w-[320px] max-w-md w-max ${toast.type === 'error' ? 'border-red-100' : 'border-emerald-100'}`}
          >
            {toast.type === 'error' ? (
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0"><AlertCircle className="w-5 h-5" /></div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0"><ShieldCheck className="w-5 h-5" /></div>
            )}
            <p className="text-gray-700 font-semibold text-sm flex-grow">{toast.message}</p>
            <button onClick={() => setToast({ ...toast, visible: false })} className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"><X className="w-5 h-5" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- TOP BANNER SECTION --- */}
      <section className="relative w-full h-[400px] flex items-center justify-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-80" style={{ backgroundImage: `url(${franchiseBannerImg})` }}></div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center pt-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white font-medium text-sm mb-6 border border-white/20">
            <Handshake className="w-4 h-4" /> Join The Network
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="text-4xl md:text-6xl font-extrabold text-[#fff] tracking-tight drop-shadow-sm">
            Partner Application
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl font-medium">
            Select your partnership model below and fill out the comprehensive form to start your journey with Techhansa Retail.
          </motion.p>
        </div>
      </section>

      {/* --- TABS & FORM CONTAINER --- */}
      <section className="relative z-10 pb-24 px-4 lg:px-12 -mt-16">
        <div className="max-w-5xl mx-auto">
          
          {/* ================= SMOOTH TAB SWITCHER ================= */}
          <div className="flex justify-center mb-10">
            <div className="relative flex bg-white rounded-full p-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100">
              {['partnerform', 'franchise'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setPartnerType(tab)}
                  className={`relative px-8 py-3.5 rounded-full text-sm md:text-base font-bold z-10 transition-colors duration-300 ${
                    partnerType === tab ? 'text-white' : 'text-gray-500 hover:text-[#0d3863]'
                  }`}
                >
                  {tab === 'partnerform' ? 'Channel Partner' : 'Franchise Partner'}
                  
                  {/* Sliding Blue Background Animation */}
                  {partnerType === tab && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-[#0d3863] rounded-full -z-10 shadow-md"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ================= DYNAMIC FORM RENDER WITH ANIMATION ================= */}
          <div className="w-full">
            <AnimatePresence mode="wait">
              {partnerType === 'partnerform' ? (
                <motion.div 
                  key="partnerform" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -20 }} 
                  transition={{ duration: 0.3 }}
                >
                  {/* Rendering the Component and passing the toast function */}
                  <PartnerForm showToast={showToast} />
                </motion.div>
              ) : (
                <motion.div 
                  key="franchise" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -20 }} 
                  transition={{ duration: 0.3 }}
                >
                  {/* Rendering the Component and passing the toast function */}
                  <FranchiseForm showToast={showToast} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>
    </div>
  );
}