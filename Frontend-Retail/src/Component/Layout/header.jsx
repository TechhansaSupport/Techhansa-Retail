import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobilePartnersOpen, setIsMobilePartnersOpen] = useState(false); 

  const searchContainerRef = useRef(null);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { 
      name: 'Partners', 
      path: '/partners',
      subLinks: [
        { 
          name: 'OEM Partner', 
          path: '/partner/oem',
          desc: 'Direct manufacturing alliances',
          icon: <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        },
        { 
          name: 'Channel Partner', 
          path: '/partner/channel',
          desc: 'B2B distribution networks',
          icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        },
        { 
          name: 'Franchise Partner', 
          path: '/partner/franchise',
          desc: 'Retail storefront opportunities',
          icon: <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        },
      ]
    },
    { name: 'Investors', path: '/investors' },
    { name: 'Contact Us', path: '/contact' },
  ];

  // Click outside to close the search bar
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm px-4 lg:px-10 py-3 w-full overflow-x-clip">
      <div className="flex justify-between items-center w-full relative">
        
        {/* 1. Logo Section */}
        <div className="flex-shrink-0 z-20">
          <a href="/" className="flex items-center gap-2 lg:gap-3">
            <img src={logo} alt="Techhansa Retail" className="h-12 lg:h-24 w-auto object-contain" />
            <span className="text-[var(--premium-gold)] font-extrabold text-lg lg:text-[26px] tracking-wide whitespace-nowrap">
              Techhansa Retail
            </span>
          </a>
        </div>

        {/* 2. Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 ml-12 xl:ml-20">
          {navLinks.map((link) => (
            link.subLinks ? (
              // === DROPDOWN PARENT ===
              <div key={link.name} className="relative group">
                <Link 
                  to={link.path} 
                  className="relative flex items-center gap-1 font-medium text-[16px] py-4 hover:text-[var(--tech-blue)] transition-colors duration-300 whitespace-nowrap"
                >
                  {link.name}
                  {/* Chevron Icon that rotates on hover */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transform group-hover:rotate-180 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                  <span className="absolute left-0 bottom-3 w-0 h-[2px] bg-[var(--premium-gold)] transition-all duration-300 group-hover:w-full"></span>
                </Link>

                {/* === DROPDOWN MENU === */}
                <div className="absolute top-full left-0 w-[300px] pt-1 opacity-0 invisible translate-y-4 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out z-50">
                  <div className="bg-white border border-gray-100 rounded-2xl p-3 shadow-[0_20px_40px_rgba(13,56,99,0.12)] relative">
                    
                    {/* Top small arrow pointer */}
                    <div className="absolute -top-1.5 left-8 w-3 h-3 bg-white border-t border-l border-gray-100 rotate-45"></div>

                    <div className="flex flex-col gap-1 relative z-10">
                      {link.subLinks.map((sub, idx) => (
                        <Link 
                          key={idx} 
                          to={sub.path}
                          className="group/item flex items-center gap-4 p-3 rounded-xl hover:bg-[var(--soft-bg)] transition-colors duration-300"
                        >
                          {/* Icon Container */}
                          <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-[var(--tech-blue)]/5 flex items-center justify-center text-[var(--tech-blue)] group-hover/item:bg-white group-hover/item:shadow-sm border border-transparent group-hover/item:border-gray-100 transition-all duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              {sub.icon}
                              {/* If channel partner, draw second shape for Users icon */}
                              {sub.name === 'Channel Partner' && <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a3 3 0 11-6 0 3 3 0 016 0z" />}
                            </svg>
                          </div>
                          
                          {/* Text Container */}
                          <div>
                            <h4 className="text-[14.5px] font-bold text-[var(--text-dark)] group-hover/item:text-[var(--tech-blue)] transition-colors duration-300 mb-0.5">
                              {sub.name}
                            </h4>
                            <p className="text-[12px] text-gray-500 font-medium">
                              {sub.desc}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // === NORMAL LINKS ===
              <Link 
                key={link.name} 
                to={link.path} 
                className="relative font-medium text-[16px] py-4 hover:text-[var(--tech-blue)] transition-colors duration-300 group whitespace-nowrap"
              >
                {link.name}
                <span className="absolute left-0 bottom-3 w-0 h-[2px] bg-[var(--premium-gold)] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            )
          ))}
        </nav>

        {/* 3. Action & Search Section */}
        <div className="flex items-center gap-3 lg:gap-6 z-20">
          
          <div ref={searchContainerRef} className="relative flex items-center justify-end h-10 w-auto lg:w-[320px]">
            
            {/* === SEARCH BAR === */}
            <div 
              className={`absolute right-0 flex items-center transition-all duration-500 ease-in-out origin-right ${
                isSearchOpen ? 'w-[200px] lg:w-full opacity-100 visible' : 'w-0 opacity-0 invisible'
              }`}
            >
              <input 
                type="text" 
                placeholder="Search products..." 
                autoFocus={isSearchOpen}
                className="w-full border-2 border-[var(--tech-blue)] rounded-full px-4 py-2 outline-none focus:shadow-md text-[15px] pr-10 bg-white"
              />
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-3 text-gray-400 hover:text-red-500 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* === DEFAULT ACTIONS === */}
            <div 
              className={`flex items-center gap-4 xl:gap-6 transition-all duration-400 ease-in-out ${
                isSearchOpen ? 'opacity-0 invisible absolute right-0 scale-90' : 'opacity-100 visible relative scale-100'
              }`}
            >
              {/* Search Icon */}
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-1.5 lg:p-2 rounded-full hover:bg-[var(--soft-bg)] text-[var(--text-dark)] hover:text-[var(--tech-blue)] transition-colors duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 lg:h-6 lg:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Contact & Login Section */}
              <div className="hidden xl:flex flex-col -mt-8 items-end gap-0.5">
                <div className="flex items-center gap-1 font-semibold text-[14px] whitespace-nowrap">
                  <span className="text-lg">📞</span>
                  <a href="tel:+919711888951" className="hover:text-[var(--tech-blue)] transition-colors">+91 9711888951</a>
                </div>
                
                <Link 
                  to="/login"
                  className="bg-[var(--tech-blue)] hover:bg-[var(--techgolden-hover)] text-white px-5 lg:px-7 py-1.5 rounded-md font-semibold text-[13px] lg:text-[14px] transition-all duration-300 active:scale-95 shadow-md hover:shadow-lg whitespace-nowrap"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Hamburger Menu Icon */}
          <button 
            className="lg:hidden p-1 text-[var(--text-dark)]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
            </svg>
          </button>
        </div>
      </div>

      {/* === MOBILE MENU DROPDOWN === */}
      <div className={`lg:hidden transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-[500px] mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
        <nav className="flex flex-col gap-3 bg-[var(--soft-bg)] rounded-lg p-4 shadow-inner">
          {navLinks.map((link) => (
            link.subLinks ? (
              <div key={link.name} className="flex flex-col border-b border-gray-200 pb-2">
                <div 
                  className="flex items-center justify-between font-medium text-[16px] text-[var(--text-dark)] hover:text-[var(--tech-blue)] cursor-pointer"
                  onClick={() => setIsMobilePartnersOpen(!isMobilePartnersOpen)}
                >
                  {link.name}
                  <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 transform transition-transform duration-300 ${isMobilePartnersOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
                {/* Mobile Sub-links (Accordion style) */}
                <div className={`flex flex-col gap-2 pl-4 overflow-hidden transition-all duration-300 ${isMobilePartnersOpen ? 'max-h-40 mt-3 opacity-100' : 'max-h-0 opacity-0'}`}>
                  {link.subLinks.map((sub, idx) => (
                    <Link 
                      key={idx} 
                      to={sub.path} 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-[14.5px] font-medium text-gray-600 hover:text-[var(--tech-blue)] flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--premium-gold)]"></span>
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link 
                key={link.name} 
                to={link.path} 
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-medium text-[16px] text-[var(--text-dark)] hover:text-[var(--tech-blue)] border-b border-gray-200 pb-2"
              >
                {link.name}
              </Link>
            )
          ))}
          
          <div className="flex flex-col gap-3 mt-3">
            <a href="tel:+919711888951" className="font-semibold text-sm hover:text-[var(--tech-blue)] transition-colors">📞 +91 9711888951</a>
            <Link 
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="bg-[var(--tech-blue)] text-white px-4 py-2 rounded-md font-semibold text-center w-full sm:hidden hover:bg-[#0a294b]"
            >
              Login
            </Link>
          </div>
        </nav>
      </div>

    </header>
  );
}