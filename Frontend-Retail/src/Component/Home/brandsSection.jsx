import HPLogo from '../../assets/hp.webp';
import DellLogo from '../../assets/dell.webp';
import LenovoLogo from '../../assets/lenovo.webp';
import AppleLogo from '../../assets/apple.webp';
import AsusLogo from '../../assets/asus.webp';
import AcerLogo from '../../assets/acer.webp';
import SamsungLogo from '../../assets/samsung.webp';
import EpsonLogo from '../../assets/Epson.jpg';
// import LogitechLogo from '../../assets/logitech.webp';
// import IntelLogo from '../../assets/intel.webp';
// import MsiLogo from '../../assets/msi.webp';
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function BrandsSection() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
    });
  }, []);

  const brands = [
    { name: 'HP', logoSrc: HPLogo },
    { name: 'Dell', logoSrc: DellLogo },
    { name: 'Lenovo', logoSrc: LenovoLogo },
    { name: 'Apple', logoSrc: AppleLogo },
    { name: 'ASUS', logoSrc: AsusLogo },
    { name: 'Acer', logoSrc: AcerLogo },
    { name: 'Samsung', logoSrc: SamsungLogo },
     { name: 'Logitech', logoSrc: HPLogo }, // Replace with actual Logitech import
        { name: 'Intel', logoSrc: DellLogo },  // Replace with actual Intel import
        { name: 'MSI', logoSrc: LenovoLogo },
    { name: 'Epson', logoSrc: EpsonLogo }
  ];

  return (
    <section className="relative w-full py-24 bg-[var(--soft-bg)] overflow-hidden">
      
      {/* --- In-built CSS for 3D Carousel Animation --- */}
      <style>{`
        @keyframes rotate-carousel {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(-360deg); }
        }
        .carousel-3d-wrapper {
          perspective: 1600px;
          transform: rotateX(-4deg); 
          transform-style: preserve-3d;
        }
        .carousel-track {
          transform-style: preserve-3d;
          animation: rotate-carousel 35s linear infinite;
        }
        .carousel-track:hover {
          animation-play-state: paused;
        }
        .carousel-card {
          backface-visibility: hidden;
        }
      `}</style>

      {/* ================= BACKGROUND DECORATION ================= */}
      <div className="absolute inset-0 z-0 opacity-50" 
           style={{ backgroundImage: 'radial-gradient(circle at center, #cbd5e1 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-white rounded-full mix-blend-overlay filter blur-[100px] opacity-60 pointer-events-none z-0"></div>

      {/* ================= TEXT CONTENT SECTION ================= */}
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10 mb-20 md:mb-28" data-aos="fade-up">
        
        <div className="flex items-center justify-center gap-3 mb-5">
          <span className="w-10 h-0.5 bg-gradient-to-r from-transparent to-[var(--premium-gold)]"></span>
          <span className="text-[12.5px] md:text-[14px] font-extrabold text-[var(--tech-blue)] uppercase tracking-[0.2em]">
            Brands We Deal In
          </span>
          <span className="w-10 h-0.5 bg-gradient-to-l from-transparent to-[var(--premium-gold)]"></span>
        </div>

        <h2 className="text-4xl lg:text-[3rem] font-extrabold text-[var(--text-dark)] leading-tight mb-6 drop-shadow-sm">
          Trusted Global <br className="md:hidden"/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--tech-blue)] to-[#0a294b]">
            Technology Brands
          </span>
        </h2>

        <p className="text-gray-600 text-[16px] md:text-[18px] leading-relaxed font-medium max-w-2xl mx-auto">
          Partnering with the world's leading technology manufacturers to bring you authentic products backed by official warranties and reliable after-sales support.
        </p>
      </div>

      {/* ================= 3D CAROUSEL SECTION ================= */}
      <div className="relative w-full h-[320px] md:h-[450px] flex justify-center items-center transform scale-[0.6] sm:scale-75 md:scale-100 z-10 mt-[-3rem] md:mt-0" data-aos="zoom-in" data-aos-delay="200">
        
        <div className="relative w-[240px] h-[300px] carousel-3d-wrapper">
          <div className="absolute inset-0 carousel-track">
            
            {brands.map((brand, index) => {
              const angle = 45 * index; 
              
              return (
                <div 
                  key={index}
                  className="carousel-card absolute inset-0"
                  style={{
                    transform: `rotateY(${angle}deg) translateZ(400px)`
                  }}
                >
                  <div className="group w-full h-full cursor-pointer">
                    <div className="w-full h-full bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgba(13,56,99,0.08)] border border-white/60 flex flex-col items-center justify-center p-8 overflow-hidden transition-all duration-500 group-hover:shadow-[0_0_40px_rgba(221,167,60,0.15)] group-hover:border-[var(--premium-gold)]/40 group-hover:-translate-y-2 relative">
                      
                      {/* Subtle Inner Glow on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--premium-gold)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      {/* FULL COLOR LOGO: Adding 3D Drop Shadow & Scale on Hover */}
                      <img
                        src={brand.logoSrc}
                        alt={brand.name}
                        className="w-full h-full object-contain relative z-10 p-2 drop-shadow-sm transition-all duration-500 ease-out group-hover:scale-110 group-hover:drop-shadow-2xl"
                      />
                      
                      {/* Glowing Bottom Line Effect */}
                      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gray-200/50 group-hover:bg-[var(--premium-gold)] transition-colors duration-500 shadow-[0_-2px_15px_rgba(221,167,60,0.6)] opacity-0 group-hover:opacity-100"></div>
                    </div>
                  </div>
                </div>
              );
            })}

          </div>
          
          {/* Virtual Floor Reflection (Lightized for clean theme) */}
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[100px] bg-[var(--tech-blue)]/5 rounded-[100%] blur-xl transform rotateX(60deg) pointer-events-none"></div>

        </div>
      </div>

    </section>
  );
}