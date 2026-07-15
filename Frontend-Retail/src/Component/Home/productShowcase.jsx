import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Import all product images
import LaptopImg from '../../assets/buisness-laptops.jpg';
import DesktopImg from '../../assets/desktop-computers.jpg';
import WorkstationImg from '../../assets/pro-workstation.jpg';
import MonitorImg from '../../assets/LED monitor.jpg';
import MotherboardImg from '../../assets/motherboard.jpg';
import ProcessorImg from '../../assets/processor.jpg';
import RAMImg from '../../assets/RAM.jpg';
import StorageImg from '../../assets/SSD.jpg';
import NetworkingImg from '../../assets/Networking devices.jpg';
import PrinterImg from '../../assets/Printer.jpg';
import KeyboardImg from '../../assets/Keyboard.jpg';
import AccessoriesImg from '../../assets/Accessories.jpg';

const categories = [
  { name: "Business Laptops", imageSrc: LaptopImg }, 
  { name: "Desktop Computers", imageSrc: DesktopImg },
  { name: "Pro Workstations", imageSrc: WorkstationImg },
  { name: "LED Monitors", imageSrc: MonitorImg },
  { name: "Motherboards", imageSrc: MotherboardImg },
  { name: "Processors", imageSrc: ProcessorImg },
  { name: "RAM Modules", imageSrc: RAMImg },
  { name: "SSD & HDD Storage", imageSrc: StorageImg },
  { name: "Networking Devices", imageSrc: NetworkingImg },
  { name: "Printers & Scanners", imageSrc: PrinterImg },
  { name: "Keyboards & Mice", imageSrc: KeyboardImg },
  { name: "Accessories", imageSrc: AccessoriesImg }
];

export default function ProductShowcase() {
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-scroll loop logic
  useEffect(() => {
    let interval;
    if (!isHovered) {
      interval = setInterval(() => {
        if (scrollRef.current) {
          // Move right continuously
          scrollRef.current.scrollLeft += 1;
          
          // Seamless infinite scroll reset
          if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth / 2) {
            scrollRef.current.scrollLeft = 0;
          }
        }
      }, 20); // Speed control (lower is faster)
    }
    return () => clearInterval(interval);
  }, [isHovered]);

  // Manual Arrow Scroll Logic
  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 350; 
      scrollRef.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  // Duplicate array to create the infinite seamless loop
  const extendedCategories = [...categories, ...categories];

  return (
    // Background pure white kar diya gaya hai (bg-white)
    <section className="relative w-full py-20 lg:py-28 bg-white overflow-hidden">
      
      {/* --- Custom CSS for Hiding Scrollbar --- */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;  
          scrollbar-width: none;  
        }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        
        {/* ================= HEADER SECTION ================= */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-0.5 bg-[var(--premium-gold)]"></span>
            <span className="text-[12.5px] md:text-[14px] font-extrabold text-[var(--tech-blue)] uppercase tracking-[0.2em]">
              Bulk Product Showcase
            </span>
            <span className="w-8 h-0.5 bg-[var(--premium-gold)]"></span>
          </div>

          <h2 className="text-4xl md:text-[2.75rem] font-extrabold text-[var(--text-dark)] leading-tight mb-6">
            Everything Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--tech-blue)] to-[#0a294b]">Business Needs</span>
          </h2>
          
          <p className="text-gray-600 text-[15.5px] md:text-[17px] leading-relaxed font-medium">
            Browse an extensive range of enterprise-grade IT hardware designed for businesses of every size.
          </p>
        </div>

        {/* ================= SCROLLABLE CAROUSEL CONTAINER ================= */}
        <div 
          className="relative w-full py-4 group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          
          {/* Left Navigation Arrow */}
          <button 
            onClick={() => handleScroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 md:-ml-6 z-20 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-100 text-[var(--text-dark)] hover:text-[var(--premium-gold)] hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100"
            aria-label="Scroll Left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right Navigation Arrow */}
          <button 
            onClick={() => handleScroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-2 md:-mr-6 z-20 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-100 text-[var(--text-dark)] hover:text-[var(--premium-gold)] hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100"
            aria-label="Scroll Right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* White Fade Masks (Edges par fade effect lane ke liye taaki text achanak se na kate) */}
          <div className="absolute top-0 left-0 h-full w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 right-0 h-full w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

          {/* Cards Track (Hidden Scrollbar) */}
          <div 
            ref={scrollRef}
            className="flex items-center gap-6 overflow-x-auto no-scrollbar py-6 px-12 md:px-24 w-full"
          >
            {extendedCategories.map((cat, index) => (
              <Link 
                key={index} 
                to="/catalog"
                className="group/card flex-shrink-0 flex items-center gap-5 w-[300px] md:w-[320px] bg-white rounded-2xl p-4 border border-gray-200/80 shadow-[0_4px_15px_rgba(0,0,0,0.02)] hover:border-[var(--premium-gold)]/50 hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                {/* Product Image Box */}
                <div className="w-16 h-16 rounded-lg bg-gray-50 flex items-center justify-center p-2 group-hover/card:bg-white transition-colors duration-300 shadow-sm border border-gray-100 flex-shrink-0 overflow-hidden">
                  <img 
                    src={cat.imageSrc} 
                    alt={cat.name} 
                    // mix-blend-multiply images ka white background hata kar usko clean dikhata hai
                    className="w-full h-full object-contain mix-blend-multiply group-hover/card:scale-110 transition-transform duration-300"
                  />
                </div>
                
                {/* Category Text */}
                <h3 className="text-[16px] md:text-[17px] font-extrabold text-[#111827] tracking-tight group-hover/card:text-[var(--tech-blue)] transition-colors duration-300">
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>

        </div>

        {/* View Full Catalog CTA */}
        <div className="mt-12 text-center relative z-20">
          <Link 
            to="/catalog"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white border-2 border-gray-200 rounded-xl font-bold text-[var(--text-dark)] hover:border-[var(--tech-blue)] hover:bg-[var(--tech-blue)] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md group"
          >
            View Full Catalog
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}