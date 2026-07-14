import { Link } from 'react-router-dom';
import HeroSec from '../../assets/HeroSec.jpg'; // Ensure this image is in your assets folder

export default function Hero() {
  return (
    <section 
      className="relative w-full h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${HeroSec})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      
      {/* ================= DARK OVERLAY ================= */}
    
      <div className="absolute inset-0 bg-[#07162c]/60 z-0"></div>

      {/* ================= CENTERED CONTENT ================= */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto w-full mt-[-3rem]">
        
        {/* 1. Top Subheading (Uppercase, Spaced out) */}
        <p className="text-white/90 tracking-[0.25em] md:tracking-[0.3em] font-semibold text-sm md:text-base uppercase mb-4 md:mb-6">
          Trusted by Businesses Across India
        </p>

        {/* 2. Massive Main Heading */}
        <h1 className="text-white text-6xl md:text-7xl lg:text-[7rem] font-extrabold tracking-tight mb-2 md:mb-4 leading-none drop-shadow-lg">
          Your Growth.
        </h1>

        {/* 3. Tagline with Serif Golden Highlight (Matching the "Digital Transformation" style) */}
        <p className="text-white text-2xl md:text-4xl lg:text-[2.5rem] font-light mb-12 drop-shadow-md">
          powered by our <span className="text-[var(--premium-gold)] font-serif font-medium italic">IT Hardware</span> ecosystem
        </p>

        {/* 4. Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-5">
          
          {/* Primary CTA (Solid Gold with Arrow - Exact match to reference) */}
          <Link 
            to="/catalog"
            className="group bg-[var(--premium-gold)] hover:bg-[var(--techgolden-hover)] text-white px-8 py-3.5 rounded-[4px] text-[13px] md:text-[14px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Explore Catalog
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>

          {/* Secondary CTA (Outline White - Keeps focus on the primary button) */}
          <Link 
            to="/franchise"
            className="group bg-transparent border-2 border-white/70 hover:bg-white hover:text-[var(--text-dark)] text-white px-8 py-3.5 rounded-[4px] text-[13px] md:text-[14px] font-bold uppercase tracking-wider flex items-center justify-center transition-all duration-300"
          >
            Apply for Franchise
          </Link>

        </div>
      </div>

      {/* ================= SCROLL DOWN INDICATOR ================= */}
      {/* Absolute bottom par reference ki tarah */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-70 hover:opacity-100 cursor-pointer transition-opacity duration-300">
        <span className="text-white text-[11px] font-bold tracking-[0.2em] mb-2 uppercase">
          Scroll Down
        </span>
        <div className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

    </section>
  );
}