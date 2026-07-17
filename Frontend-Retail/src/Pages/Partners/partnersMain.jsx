import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import PartnerEcosystemHero from '../../assets/Partners.jpg';
import OemImg from '../../assets/OEM.jpg';
import ChannelImg from '../../assets/Channel-hero.jpg';
import FranchiseImg from '../../assets/Franchise.jpg';

export default function PartnersMain() {
  // Initialize AOS animations
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
    });
  }, []);

  const partnerCategories = [
    {
      id: "oem",
      title: "OEM Partner",
      subtitle: "Manufacturers",
      desc: "Direct alliances with global manufacturers to deliver genuine enterprise IT hardware with official warranties.",
      link: "/partner/oem",
      img: OemImg
    },
    {
      id: "channel",
      title: "Channel Partner",
      subtitle: "Distributors & Resellers",
      desc: "Procure IT hardware in bulk and distribute products to regional markets with competitive business pricing.",
      link: "/partner/channel",
      img: ChannelImg
    },
    {
      id: "franchise",
      title: "Franchise Partner",
      subtitle: "Retail Storefronts",
      desc: "Establish a highly profitable IT retail storefront with factory pricing, marketing support, and exclusive territories.",
      link: "/partner/franchise",
      img: FranchiseImg
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[var(--soft-bg)] pb-20">
      
      {/* ================= 1. HERO SECTION ================= */}
      <section className="relative w-full h-[350px] md:h-[310px] flex items-center justify-center overflow-hidden bg-slate-900">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-60"
   
       style={{ backgroundImage: `url(${PartnerEcosystemHero})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 to-slate-900/80"></div>
        </div>

        {/* Hero Content with AOS */}
        <div className="relative z-10 text-center px-6" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
            <span className="text-[12px] font-bold text-[var(--premium-gold)] uppercase tracking-widest">
              Join Our Network
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-[4.5rem] font-black text-white mb-6 tracking-tight drop-shadow-md leading-tight">
            Partner <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--premium-gold)] to-yellow-300">Ecosystem</span>
          </h1>
          <p className="text-gray-300 text-[16px] md:text-[20px] font-medium max-w-2xl mx-auto">
            Collaborate, Grow, and Succeed with Techhansa Retail
          </p>
        </div>
      </section>

      {/* ================= 2. CONTENT SECTION ================= */}
      <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-12 text-center z-10" data-aos="fade-up" data-aos-delay="100">
        
        <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--text-dark)] leading-tight mb-6">
          Choose Your Path to <span className="text-[var(--tech-blue)]">Growth</span>
        </h2>
        
        <p className="text-gray-600 text-[16.5px] md:text-[18px] leading-relaxed font-medium mb-6">
          At Techhansa Retail, we believe in building strong, mutually beneficial relationships. Whether you manufacture world-class hardware, distribute to regional markets, or want to build your own retail business, we have a tailored partnership model for you.
        </p>
        
        <div className="w-24 h-1 bg-[var(--premium-gold)] mx-auto rounded-full mt-8"></div>
      </div>

      {/* ================= 3. PARTNERSHIP CARDS GRID ================= */}
      <div className="relative max-w-[1300px] mx-auto px-6 pt-8 pb-10 z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          
          {partnerCategories.map((partner, index) => (
            <div 
              key={partner.id}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="group h-full cursor-pointer block"
            >
              <Link 
                to={partner.link}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col h-full"
              >
              {/* Card Image Container */}
              <div className="h-56 overflow-hidden relative">
                 <img 
                    src={partner.img} 
                    alt={partner.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                 />
                 
                 {/* Standard dark gradient overlay */}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>

                 {/* CENTER-OUT SHUTTER EFFECT */}
                 <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 origin-center transition-transform duration-500 ease-in-out pointer-events-none"></div>
              </div>
              
              {/* Card Content Area */}
              <div className="p-8 relative z-10 bg-white flex flex-col h-full">
                 <h3 className="text-2xl font-bold text-[var(--premium-gold)] mb-2 tracking-tight group-hover:text-[var(--tech-blue)] transition-colors duration-300">
                    {partner.title}
                 </h3>
                 <p className="text-[var(--tech-blue)] font-semibold text-[15px] italic mb-4">
                    {partner.subtitle}
                 </p>
                 <p className="text-gray-600 leading-relaxed text-[15px]">
                    {partner.desc}
                 </p>
              </div>
              </Link>
            </div>
          ))}
          
        </div>
      </div>

    </div>
  );
}