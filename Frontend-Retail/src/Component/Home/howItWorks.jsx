import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import BrowseImg from '../../assets/Browse.jpg';
import QuoteImg from '../../assets/Quote.jpg';
import OrderImg from '../../assets/Order.jpg';
import DeliveryImg from '../../assets/Delivery.jpg';

export default function HowItWorks() {
  // Initialize AOS animations
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
    });
  }, []);

  const steps = [
    {
      stepNum: "Step 1",
      title: "Browse Products",
      desc: "Explore thousands of genuine IT hardware products with updated specs tailored for your enterprise needs.",
      img: BrowseImg
    },
    {
      stepNum: "Step 2",
      title: "Request Bulk Quote",
      desc: "Share your business requirements and receive customized, factory-level pricing from our experts.",
      img: QuoteImg
    },
    {
      stepNum: "Step 3",
      title: "Approve & Order",
      desc: "Confirm your quotation and place your corporate order with complete confidence and transparency.",
      img: OrderImg
    },
    {
      stepNum: "Step 4",
      title: "Fast Delivery",
      desc: "Receive secure, insured, and timely delivery of your IT infrastructure anywhere across the country.",
      img: DeliveryImg
    }
  ];

  return (
    <section className="relative w-full py-20 lg:py-28 bg-[#f8fafc] overflow-hidden">
      
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ================= HEADER ================= */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20" data-aos="fade-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-0.5 bg-[var(--premium-gold)]"></span>
            <span className="text-[12.5px] md:text-[14px] font-extrabold text-[var(--tech-blue)] uppercase tracking-[0.2em]">
              Simple & Transparent
            </span>
            <span className="w-8 h-0.5 bg-[var(--premium-gold)]"></span>
          </div>

          <h2 className="text-4xl md:text-[3rem] font-extrabold text-[var(--text-dark)] leading-tight mb-6">
            Procurement <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--tech-blue)] to-[var(--premium-gold)]">Made Easy</span>
          </h2>
        </div>

        {/* ================= EXACT "WHY CHOOSE US" STYLE CARDS GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {steps.map((step, index) => (
            <div 
              key={index}
              data-aos="fade-up" 
              data-aos-delay={index * 100}
              className="bg-white rounded-xl shadow-md hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:-translate-y-2 transition-all duration-500 overflow-hidden group flex flex-col relative"
            >
              {/* Step Badge Overlay */}
              <div className="absolute top-4 left-4 bg-[var(--premium-gold)] text-white text-[12px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-md z-30 shadow-md">
                {step.stepNum}
              </div>

              {/* Tall Image Section with Smooth Hover Blur */}
              <div className="h-64 overflow-hidden relative bg-gray-900">
                <img 
                  src={step.img} 
                  alt={step.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 group-hover:blur-[3px] transition-all duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 z-10"></div>
              </div>
              
              {/* Content Details */}
              <div className="p-8 flex-grow flex flex-col bg-white relative z-20 border-t-4 border-transparent group-hover:border-[var(--tech-blue)] transition-colors duration-300">
                <h3 className="text-xl font-bold text-[#D4A22E] mb-3 group-hover:text-[var(--tech-blue)] transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-[15px] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}