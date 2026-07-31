import { Link } from 'react-router-dom';
import CorporateImg from '../../assets/Corporate-procurement.jpg';
import EducationImg from '../../assets/Educational-institution.jpg';
import IntegratorsImg from '../../assets/system-integrator.jpg';
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function EnterpriseSolutions() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
    });
  }, []);

  const solutions = [
    {
      id: 1,
      title: "Corporate Procurement",
      subtitle: "Streamline your IT purchasing",
      desc: "Streamline your organization's IT purchasing with bulk pricing, dedicated account management, and simplified procurement.",
      img: CorporateImg
    },
    {
      id: 2,
      title: "Educational Institutions",
      subtitle: "Modern learning environments",
      desc: "Equip schools, colleges, and universities with reliable technology solutions tailored to modern learning environments.",
      img: EducationImg
    },
    {
      id: 3,
      title: "System Integrators",
      subtitle: "Dependable hardware sourcing",
      desc: "Partner with us for dependable hardware sourcing and competitive pricing for your large-scale client projects.",
      img: IntegratorsImg
    }
  ];

  return (
    <section className="relative w-full py-24 bg-[var(--soft-bg)] overflow-hidden">
      
      {/* Background Styling */}
      <div className="absolute top-0 right-0 w-full h-full opacity-30 pointer-events-none"
           style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, #d4a22e 0%, transparent 15%)' }}>
      </div>

      <div className="max-w-[1300px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* ================= HEADER SECTION ================= */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20" data-aos="fade-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-0.5 bg-[var(--premium-gold)]"></span>
            <span className="text-[12.5px] md:text-[14px] font-extrabold text-[var(--tech-blue)] uppercase tracking-[0.2em]">
              Enterprise Solutions
            </span>
            <span className="w-8 h-0.5 bg-[var(--premium-gold)]"></span>
          </div>

          <h2 className="text-4xl md:text-[2.75rem] font-extrabold text-[var(--text-dark)] leading-tight mb-6">
            Empowering <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--tech-blue)] to-[#0a294b]">Every Sector</span>
          </h2>
          
          <p className="text-gray-600 text-[16px] md:text-[17px] leading-relaxed font-medium">
            Tailored IT hardware solutions designed to meet the unique scale, compliance, and budget requirements of your specific industry.
          </p>
        </div>

        {/* ================= EXACT ABOUT-OVERVIEW STYLE CARDS GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {solutions.map((item, index) => (
            <div 
              key={item.id}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="group h-full cursor-pointer block"
            >
              <Link 
                to="/contact" 
                className="bg-white rounded-2xl shadow-sm border border-gray-100 group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col h-full"
              >
              {/* Card Image Container */}
              <div className="h-56 overflow-hidden relative">
                 <img 
                    src={item.img} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                 />
                 
                 {/* Standard dark gradient overlay */}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>

                 
                 <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 origin-center transition-transform duration-500 ease-in-out pointer-events-none"></div>
              </div>
              
              {/* Card Content Area */}
              <div className="p-8 relative z-10 bg-white flex flex-col h-full">
                 <h3 className="text-2xl font-bold text-[var(--premium-gold)] mb-2 tracking-tight group-hover:text-[var(--tech-blue)] transition-colors duration-300">
                    {item.title}
                 </h3>
                 <p className="text-[var(--tech-blue)] font-semibold text-[15px] italic mb-4">
                    {item.subtitle}
                 </p>
                 <p className="text-gray-600 leading-relaxed text-[15px]">
                    {item.desc}
                 </p>
              </div>
              </Link>
            </div>
          ))}
          
        </div>

      </div>
    </section>
  );
}