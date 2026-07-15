import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png'; 

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchContainerRef = useRef(null);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Partners', path: '/partners' },
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
    // overflow-x-clip add kiya hai taaki future me bhi horizontal scroll na aaye
    <header className="sticky top-0 z-50 bg-white shadow-sm px-4 lg:px-10 py-3 w-full overflow-x-clip">
      <div className="flex justify-between items-center w-full relative">
        
        {/* 1. Logo Section */}
        <div className="flex-shrink-0 z-20">
          <Link to="/" className="flex items-center gap-2 lg:gap-3">
            <img src={logo} alt="Techhansa Retail" className="h-12 lg:h-24 w-auto object-contain" />
            <span className="text-[var(--premium-gold)] font-extrabold text-lg lg:text-[26px] tracking-wide whitespace-nowrap">
              Techhansa Retail
            </span>
          </Link>
        </div>

      
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 ml-12 xl:ml-20">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              className="relative font-medium text-[16px] hover:text-[var(--tech-blue)] transition-colors duration-300 group whitespace-nowrap"
            >
              {link.name}
              <span className="absolute left-0 -bottom-1.5 w-0 h-[2px] bg-[var(--premium-gold)] transition-all duration-300 group-hover:w-full"></span>
            </Link>
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

            {/* === DEFAULT ACTIONS (Contact, Login, Search Icon) === */}
           
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

              {/* Contact & Login Section - Stacked Vertically */}
              <div className="hidden xl:flex flex-col -mt-8 items-end gap-0.5">
                {/* Contact Details */}
                <div className="flex items-center gap-1 font-semibold text-[14px] whitespace-nowrap">
                  <span className="text-lg">📞</span>
                  <span>+91 98765 43210</span>
                </div>
                
                {/* Login Button */}
                <button className="bg-[var(--tech-blue)] hover:bg-[var(--techgolden-hover)] text-white px-5 lg:px-7 py-1.5 rounded-md font-semibold text-[13px] lg:text-[14px] transition-all duration-300 active:scale-95 shadow-md hover:shadow-lg whitespace-nowrap">
                  Login
                </button>
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
      <div className={`lg:hidden transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-96 mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
        <nav className="flex flex-col gap-4 bg-[var(--soft-bg)] rounded-lg p-4 shadow-inner">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-medium text-[16px] text-[var(--text-dark)] hover:text-[var(--tech-blue)] border-b border-gray-200 pb-2"
            >
              {link.name}
            </Link>
          ))}
          <div className="flex flex-col gap-3 mt-2">
            <span className="font-semibold text-sm">📞 +91 98765 43210</span>
            <button className="bg-[var(--tech-blue)] text-white px-4 py-2 rounded-md font-semibold text-center w-full sm:hidden">
              Login
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}