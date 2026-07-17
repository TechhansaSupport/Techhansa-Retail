import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

/* 
  Bhai, yahan par apni actual images import kar lena.
*/
import ChannelHero from '../../assets/Channel-hero.jpg';
import ChannelContentImg from '../../assets/Channel-content.jpg';

export default function ChannelPartner() {
  // Initialize AOS animations
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
    });
  }, []);

  // 6 Benefits Data with highly professional SVG Icons
  const benefits = [
    {
      title: "Bulk Procurement",
      desc: "Purchase enterprise IT hardware in large quantities with competitive business pricing.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      )
    },
    {
      title: "Better Profit Margins",
      desc: "Access special partner pricing that enables sustainable and scalable business growth.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
      )
    },
    {
      title: "Verified Products",
      desc: "Receive genuine hardware directly from trusted OEMs and authorized distribution channels.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      )
    },
    {
      title: "Pan India Supply",
      desc: "Reliable, insured logistics and timely deliveries across all regions in India.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
      )
    },
    {
      title: "Business Growth",
      desc: "Expand your customer base with a wide portfolio of premium enterprise technology products.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
        </svg>
      )
    },
    {
      title: "Dedicated Support",
      desc: "Dedicated account managers to assist with procurement, quotations, and after-sales support.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[var(--soft-bg)] pb-10">
      
      {/* ================= 1. HERO SECTION ================= */}
      <section className="relative w-full h-[250px] md:h-[300px] flex items-center justify-center overflow-hidden bg-slate-900">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-60"
          style={{ backgroundImage: `url(${ChannelHero})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 to-slate-900/70"></div>
        </div>

        {/* Hero Content with AOS */}
        <div className="relative z-10 text-center px-6" data-aos="fade-up">
          <h1 className="text-5xl md:text-[4.5rem] font-black text-white mb-6 tracking-tight drop-shadow-md">
            Our Channel Partners
          </h1>
          <div className="w-24 h-1.5 bg-[#D4A22E] mx-auto rounded-full shadow-lg" data-aos="zoom-in" data-aos-delay="200"></div>
        </div>
      </section>

      {/* ================= 2. CONTENT & VALUE SECTION (UPDATED WITH IMAGE) ================= */}
      <div className="relative max-w-[1300px] mx-auto px-6 pt-20 lg:pt-28 pb-10 overflow-hidden">
        
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--tech-blue)]/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start relative z-10">
          
          {/* Left Side: Bold Statement & Nayi Image */}
          <div className="lg:col-span-5 text-center lg:text-left flex flex-col" data-aos="fade-right">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-gray-100 mb-6 mx-auto lg:mx-0 w-max">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--tech-blue)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--tech-blue)]"></span>
              </span>
              <span className="text-[12px] font-bold text-[var(--tech-blue)] uppercase tracking-widest">
                The Channel Advantage
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-[var(--text-dark)] leading-tight mb-6">
              Expanding the Ecosystem <br className="hidden lg:block"/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--tech-blue)] to-[var(--premium-gold)]">Together</span>
            </h2>
            <div className="hidden lg:block w-16 h-1.5 bg-[var(--tech-blue)] rounded-full mb-10"></div>

            {/* ---> YAHAN IMAGE ADD KI GAYI HAI <--- */}
            <div className="relative w-full rounded-2xl overflow-hidden shadow-[0_15px_40px_rgba(13,56,99,0.15)] group mt-4 lg:mt-0">
              <img 
                src={ChannelContentImg}
                alt="Channel Partner Ecosystem" 
                className="w-full h-[150px] md:h-[250px] object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              {/* Premium overlay jo hover pe dikhega */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a294b]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          </div>

          {/* Right Side: Description */}
          <div className="lg:col-span-7 flex flex-col justify-center h-full" data-aos="fade-left" data-aos-delay="100">
            <p className="text-gray-600 text-[16.5px] md:text-[17.5px] leading-relaxed font-medium mb-6 text-justify">
              Channel Partners play a vital role in expanding the Techhansa Retail ecosystem. They procure IT hardware in bulk through our procurement platform and distribute products to businesses, retailers, institutions, and end customers across different regions.
            </p>
            <p className="text-gray-600 text-[16.5px] md:text-[17.5px] leading-relaxed font-medium mb-6 text-justify">
              Our Channel Partner program is designed for organizations looking to grow their business with competitive pricing, genuine products, and reliable supply chain support.
            </p>
            
            {/* The 'Perfect Sentence' Highlight Box */}
            <div className="relative pl-6 border-l-4 border-[var(--premium-gold)] bg-white p-6 rounded-r-xl shadow-sm mt-6 lg:mt-16">
              <p className="text-[var(--tech-blue)] text-[16px] md:text-[17px] leading-relaxed font-bold italic">
                "Channel Partners purchase IT hardware in bulk from Techhansa Retail and further distribute or resell these products to corporate clients, retailers, institutions, and regional markets while benefiting from competitive pricing and dedicated business support."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 3. BENEFITS GRID SECTION ================= */}
      <div className="relative max-w-[1300px] mx-auto px-6 pt-10 pb-24 z-10">
        
        <div className="text-center mb-16" data-aos="fade-up">
          <h3 className="text-3xl font-extrabold text-[var(--text-dark)]">
            Program <span className="text-[var(--premium-gold)]">Benefits</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              data-aos="fade-up" 
              data-aos-delay={index * 100}
              className="group h-full"
            >
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] group-hover:border-[var(--tech-blue)]/20 group-hover:shadow-[0_15px_30px_rgba(13,56,99,0.1)] transition-all duration-300 group-hover:-translate-y-1 flex flex-col items-start relative overflow-hidden h-full">
              {/* Subtle hover background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--tech-blue)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

              {/* Icon Container */}
              <div className="w-14 h-14 rounded-xl bg-[var(--soft-bg)] flex items-center justify-center text-[var(--tech-blue)] mb-6 group-hover:bg-[var(--tech-blue)] group-hover:text-white transition-colors duration-300 shadow-sm relative z-10">
                {benefit.icon}
              </div>
              
              {/* Content */}
              <div className="relative z-10">
                <h4 className="text-[19px] font-extrabold text-[var(--text-dark)] mb-3 group-hover:text-[var(--tech-blue)] transition-colors duration-300">
                  {benefit.title}
                </h4>
                <p className="text-[15px] text-gray-500 leading-relaxed font-medium">
                  {benefit.desc}
                </p>
              </div>

              {/* Bottom expanding line */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[var(--tech-blue)] transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></div>
              </div>
            </div>
          ))}
          
        </div>
      </div>

    </div>
  );
}