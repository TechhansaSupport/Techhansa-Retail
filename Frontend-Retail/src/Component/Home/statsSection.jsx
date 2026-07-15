import { useState, useEffect, useRef } from 'react';

// Custom Hook for Animated Counting on Scroll
const AnimatedCounter = ({ endValue, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef(null);

  useEffect(() => {
    // Ye observer check karega ki element screen par aaya ya nahi
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );
    
    if (counterRef.current) {
      observer.observe(counterRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime = null;
    const startValue = 0;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth slowdown at the end
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      setCount(Math.floor(easeOutQuart * (endValue - startValue) + startValue));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(endValue);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [isVisible, endValue, duration]);

  return <span ref={counterRef}>{count}</span>;
};

export default function StatsSection() {
  const stats = [
    { id: 1, number: 5000, suffix: "+", label: "Products Available" },
    { id: 2, number: 100, suffix: "+", label: "Corporate Clients" },
    { id: 3, number: 50, suffix: "+", label: "Franchise Partners" },
    { id: 4, number: 25, suffix: "+", label: "Premium Brands" },
    // 5th item has no number, so we use a special layout for it
    { id: 5, isIcon: true, label: "Pan India Delivery Network" } 
  ];

  return (
    // Dark Blue background strip to create a premium contrast against the light pages
    <section className="relative w-full py-12 bg-gradient-to-r from-[var(--tech-blue)] to-[#07162c] overflow-hidden">
      
      {/* Subtle Background Overlay for Depth */}
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-4 divide-x-0 lg:divide-x lg:divide-white/10 text-center">
          
          {stats.map((stat, index) => (
            <div key={stat.id} className={`flex flex-col items-center justify-center p-4 ${index !== 0 ? 'lg:pl-4' : ''}`}>
              
              {/* If it's a number stat */}
              {!stat.isIcon ? (
                <div className="flex items-baseline justify-center mb-2">
                  <span className="text-4xl md:text-5xl font-extrabold text-[var(--premium-gold)] drop-shadow-md">
                    <AnimatedCounter endValue={stat.number} duration={2500} />
                  </span>
                  <span className="text-3xl md:text-4xl font-extrabold text-[var(--premium-gold)] ml-1">
                    {stat.suffix}
                  </span>
                </div>
              ) : (
                <div className="mb-3 text-[var(--premium-gold)] flex items-center justify-center h-[48px] md:h-[60px] animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}

              {/* Stat Label */}
              <p className="text-[13px] md:text-[14px] font-semibold text-white/90 uppercase tracking-widest max-w-[150px] mx-auto leading-snug">
                {stat.label}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}