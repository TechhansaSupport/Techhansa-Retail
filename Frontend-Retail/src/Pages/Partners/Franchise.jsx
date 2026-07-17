import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import FranchiseHero from '../../assets/Franchise.jpg';

export default function FranchisePartner() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
    });
  }, []);

  // 8 Benefits Data mapped with highly professional SVG Icons
  const benefits = [
    {
      title: "Business Setup Assistance",
      desc: "End-to-end guidance from store layout design to IT infrastructure deployment.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
        </svg>
      )
    },
    {
      title: "Factory Pricing",
      desc: "Direct access to OEM-level margins ensuring highly competitive retail pricing.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Exclusive Territory",
      desc: "Protected geographical rights to ensure zero internal conflict and max footfall.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      )
    },
    {
      title: "Inventory Planning",
      desc: "Data-driven stock management for optimized capital rotation and zero dead stock.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
        </svg>
      )
    },
    {
      title: "Marketing Support",
      desc: "Backed by national digital campaigns, local promo collateral, and branding kits.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
      )
    },
    {
      title: "Technical Training",
      desc: "Comprehensive staff enablement on product specs, sales pitching, and support.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
        </svg>
      )
    },
    {
      title: "Dedicated Manager",
      desc: "Your personal business expert for seamless daily operations and strategic growth.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      )
    },
    {
      title: "Continuous Support",
      desc: "24/7 operational assistance, IT backend support, and continuous strategy reviews.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
        </svg>
      )
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[var(--soft-bg)] pb-0">
      
      {/* ================= 1. HERO SECTION ================= */}
      <section className="relative w-full h-[250px] md:h-[300px] flex items-center justify-center overflow-hidden bg-slate-900">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-50"
          
        style={{ backgroundImage: `url(${FranchiseHero})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 to-slate-900/80"></div>
        </div>

        {/* Hero Content with AOS */}
        <div className="relative z-10 text-center px-6" data-aos="fade-up">
          <h1 className="text-4xl md:text-[4rem] font-black text-white mb-6 tracking-tight drop-shadow-md">
            Franchise Partners
          </h1>
          <div className="w-24 h-1.5 bg-[#D4A22E] mx-auto rounded-full shadow-lg" data-aos="zoom-in" data-aos-delay="200"></div>
        </div>
      </section>

      {/* ================= 2. CONTENT & VALUE SECTION ================= */}
      <div className="relative max-w-[1300px] mx-auto px-6 pt-20 lg:pt-28 pb-10 overflow-hidden">
        
        {/* Subtle Background Glow */}
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-[var(--premium-gold)]/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
          
          {/* Left Side: Bold Statement & CTA */}
          <div className="lg:col-span-5 text-center lg:text-left flex flex-col" data-aos="fade-right">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-gray-100 mb-6 w-max mx-auto lg:mx-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--tech-blue)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--tech-blue)]"></span>
              </span>
              <span className="text-[12px] font-bold text-[var(--tech-blue)] uppercase tracking-widest">
                The Blueprint to Success
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-[var(--text-dark)] leading-[1.15] mb-6">
              Become a Techhansa Retail <br className="hidden lg:block"/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--tech-blue)] to-[#0a294b]">
                Franchise Partner
              </span>
            </h2>
            <div className="hidden lg:block w-16 h-1.5 bg-[var(--tech-blue)] rounded-full mb-8"></div>

            {/* Desktop CTA Button hidden on mobile to show in text block below */}
            <div className="hidden lg:block">
              <Link 
                to="/franchise-apply"
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-[var(--tech-blue)] rounded-xl font-bold text-white text-[15px] overflow-hidden shadow-[0_8px_20px_rgba(13,56,99,0.25)] hover:shadow-[0_15px_30px_rgba(13,56,99,0.4)] hover:-translate-y-1 transition-all duration-300"
              >
                <span className="absolute inset-0 w-full h-full -ml-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-sweep pointer-events-none"></span>
                Become a Franchise Partner
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:translate-x-1.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right Side: Description */}
          <div className="lg:col-span-7 flex flex-col justify-center" data-aos="fade-left" data-aos-delay="100">
            <p className="text-gray-600 text-[16.5px] md:text-[18px] leading-relaxed font-medium mb-6 text-justify">
              Our Franchise Program is designed for entrepreneurs and business owners who want to establish a successful IT hardware business with the robust support of an established brand.
            </p>
            
            <div className="relative pl-6 border-l-4 border-[var(--premium-gold)] bg-white p-6 rounded-r-xl shadow-sm">
              <p className="text-gray-600 text-[16px] md:text-[17px] leading-relaxed font-medium">
                As a Techhansa Retail Franchise Partner, you'll gain exclusive access to premium technology brands, factory pricing, extensive business guidance, powerful marketing support, and an exclusive territory to grow your business confidently.
              </p>
            </div>

            {/* Mobile CTA Button */}
            <div className="mt-8 lg:hidden flex justify-center">
              <Link 
                to="/franchise-apply"
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--tech-blue)] rounded-xl font-bold text-white text-[15px] shadow-lg w-full"
              >
                Become a Franchise Partner
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 3. 8-CARD BENEFITS GRID ================= */}
      <div className="relative max-w-[1300px] mx-auto px-6 pt-10 pb-20 z-10">
        
        <div className="text-center mb-16" data-aos="fade-up">
          <h3 className="text-3xl font-extrabold text-[var(--text-dark)]">
            Exclusive Franchise <span className="text-[var(--premium-gold)]">Benefits</span>
          </h3>
        </div>

        {/* 4-Column Grid for perfect symmetry of 8 items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              data-aos="fade-up" 
              data-aos-delay={index * 50}
              className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_15px_rgba(0,0,0,0.02)] hover:border-[var(--premium-gold)]/40 hover:shadow-[0_15px_30px_rgba(13,56,99,0.08)] transition-all duration-300 hover:-translate-y-1.5 flex flex-col items-start relative overflow-hidden"
            >
              {/* Subtle top border highlight on hover */}
              <div className="absolute top-0 left-0 w-full h-1 bg-[var(--premium-gold)] transform scale-x-0 group-hover:scale-x-100 origin-center transition-transform duration-500"></div>

              {/* Icon Container */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--soft-bg)] to-gray-50 flex items-center justify-center text-[var(--tech-blue)] mb-5 group-hover:bg-[var(--tech-blue)] group-hover:text-white transition-colors duration-300 shadow-sm border border-gray-100 group-hover:border-transparent">
                {benefit.icon}
              </div>
              
              {/* Content */}
              <h4 className="text-[17px] font-extrabold text-[var(--text-dark)] mb-2 tracking-tight group-hover:text-[var(--tech-blue)] transition-colors duration-300">
                {benefit.title}
              </h4>
              <p className="text-[13.5px] text-gray-500 leading-relaxed font-medium">
                {benefit.desc}
              </p>
            </div>
          ))}
          
        </div>
      </div>


      {/* Required Animation Style */}
      <style>{`
        @keyframes sweep {
          0% { transform: translateX(-150%); }
          100% { transform: translateX(150%); }
        }
        .animate-sweep {
          animation: sweep 2s ease-in-out infinite;
        }
      `}</style>

    </div>
  );
}