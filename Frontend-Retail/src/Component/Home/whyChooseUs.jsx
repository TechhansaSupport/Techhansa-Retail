export default function WhyChooseUs() {
  const features = [
    {
      id: 1,
      title: "100% Genuine Products",
      desc: "Every product is sourced directly from authorized manufacturers and distributors with official warranty support.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      id: 2,
      title: "Competitive Bulk Pricing",
      desc: "Special pricing designed specifically for businesses, institutions, resellers, and corporate procurement teams.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 3,
      title: "Pan-India Delivery",
      desc: "Fast, secure, and insured logistics ensuring timely delivery across India, straight to your facility.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
      )
    },
    {
      id: 4,
      title: "Dedicated Account Managers",
      desc: "Get personalized assistance from procurement consultation to reliable after-sales support.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      id: 5,
      title: "Large Inventory",
      desc: "Access thousands of ready-to-dispatch IT products with consistent stock availability for large orders.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    {
      id: 6,
      title: "Trusted Business Partner",
      desc: "Helping organizations build reliable IT infrastructure with quality products and transparent service.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ];

  return (
    <section className="relative w-full py-24 bg-gradient-to-b from-white to-[var(--soft-bg)] overflow-hidden">
      
      {/* --- Background Decorations --- */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[var(--tech-blue)]/5 to-transparent z-0 pointer-events-none"></div>
      <div className="absolute -left-32 bottom-0 w-96 h-96 bg-[var(--premium-gold)]/5 rounded-full blur-[100px] z-0 pointer-events-none"></div>

      <div className="max-w-[1300px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* ================= HEADER SECTION ================= */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-0.5 bg-[var(--premium-gold)]"></span>
            <span className="text-[12.5px] md:text-[14px] font-extrabold text-[var(--tech-blue)] uppercase tracking-[0.2em]">
              Our Advantage
            </span>
            <span className="w-8 h-0.5 bg-[var(--premium-gold)]"></span>
          </div>

          <h2 className="text-4xl md:text-[2.75rem] font-extrabold text-[var(--text-dark)] leading-tight mb-6">
            Why Businesses Choose <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--tech-blue)] to-[#0a294b]">Techhansa Retail</span>
          </h2>
        </div>

        {/* ================= FEATURES GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
          
          {features.map((feature) => (
            <div 
              key={feature.id} 
              className="group relative bg-white rounded-2xl p-8 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_-10px_rgba(13,56,99,0.15)] transition-all duration-500 ease-out hover:-translate-y-2 overflow-hidden flex flex-col h-full"
            >
              {/* Subtle Tech Glow inside card on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--tech-blue)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              
              {/* Icon Container with Floating Animation */}
              <div className="relative mb-8 w-16 h-16 flex-shrink-0">
                {/* Background blob behind icon */}
                <div className="absolute inset-0 bg-[var(--soft-bg)] rounded-xl transform rotate-3 group-hover:-rotate-3 group-hover:bg-[var(--tech-blue)] transition-all duration-500"></div>
                
                {/* Icon itself */}
                <div className="absolute inset-0 flex items-center justify-center text-[var(--tech-blue)] group-hover:text-white transition-colors duration-500 w-8 h-8 m-auto">
                  {feature.icon}
                </div>
              </div>

              {/* Title & Description */}
              <div className="relative z-10 flex-grow">
                <h3 className="text-[20px] font-extrabold text-[var(--text-dark)] mb-4 tracking-tight group-hover:text-[var(--tech-blue)] transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-[15.5px] text-gray-600 leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </div>

              {/* Expanding Bottom Border Line */}
              <div className="absolute bottom-0 left-0 w-full h-1.5 bg-[var(--tech-blue)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              
            </div>
          ))}
          
        </div>

      </div>
    </section>
  );
}