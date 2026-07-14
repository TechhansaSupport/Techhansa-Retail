import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

// --- COMPONENT: FLOATING BACKGROUND SHAPES ---
const FloatingShapes = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Gold Ring */}
      <motion.div
        className="absolute top-[10%] left-[5%] w-32 h-32 rounded-full border-[3px] border-[var(--premium-gold)]/20"
        animate={{ y: [0, -30, 0], rotate: [0, 90, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Blue Square */}
      <motion.div
        className="absolute top-[30%] right-[10%] w-24 h-24 bg-[var(--tech-blue)]/5 rounded-xl"
        animate={{ y: [0, 40, 0], rotate: [0, -45, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Pentagon (using clip-path) */}
      <motion.div
        className="absolute bottom-[20%] left-[15%] w-40 h-40 bg-[var(--premium-gold)]/5"
        style={{ clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }}
        animate={{ y: [0, -50, 0], rotate: [0, 60, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Secondary Ring */}
      <motion.div
        className="absolute bottom-[40%] right-[5%] w-48 h-48 rounded-full border-[2px] border-[var(--tech-blue)]/10"
        animate={{ y: [0, 30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

export default function About() {
  // --- ANIMATION VARIANTS ---
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  // --- TOP BANNER SCROLL-LINKED 3D ELEMENT ---
  const bannerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: bannerRef,
    offset: ['start start', 'end start']
  });
  const cubeRotateY = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const cubeY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const cubeOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.15]);

  const tickerItems = [
    'Verified Suppliers', 'Transparent Bidding', 'Bulk IT Procurement',
    'PAN India Delivery', 'Franchise Opportunities Open', 'Trusted Business Partners'
  ];

  // --- CONTENT DATA ARRAYS ---
  const products = [
    "Business Laptops", "Desktop Computers", "Workstations", "Enterprise Servers", 
    "Networking Solutions", "Monitors", "Printers & Scanners", "Storage Devices", 
    "CCTV & Security Systems", "UPS & Power Backup Solutions", "IT Accessories & Peripherals", "Custom Enterprise IT Solutions"
  ];

  const industries = [
    "Corporate Offices", "IT Companies", "Educational Institutions", "Universities & Colleges", 
    "Schools", "Hospitals & Healthcare", "Government Departments", "Public Sector Enterprises", 
    "Banking & Financial", "Manufacturing Industries", "Startups", "MSMEs", "System Integrators", "Business Consultants"
  ];

  const whyChooseUs = [
    { title: "Trusted Procurement Platform", desc: "We simplify enterprise IT purchasing through a reliable and transparent procurement process." },
    { title: "Competitive Pricing", desc: "Our bidding model encourages healthy competition among verified suppliers, helping buyers secure the best value." },
    { title: "Verified Vendor Network", desc: "We collaborate with trusted suppliers and business partners committed to quality and professionalism." },
    { title: "End-to-End Support", desc: "From requirement analysis to quotation management, procurement coordination, and after-sales assistance." },
    { title: "Quality Assurance", desc: "We focus on delivering genuine products backed by manufacturer warranty and trusted service support." },
    { title: "Customer-Centric Approach", desc: "Every solution we offer is designed around our customers' business goals and operational requirements." }
  ];

  const coreValues = [
    { title: "Integrity", desc: "We conduct every business interaction with honesty, transparency, and accountability." },
    { title: "Excellence", desc: "We continuously improve our services to deliver exceptional customer experiences." },
    { title: "Innovation", desc: "Technology drives our platform, enabling smarter procurement and better business outcomes." },
    { title: "Partnership", desc: "We believe long-term relationships are built through collaboration, trust, and shared success." },
    { title: "Customer Success", desc: "Our success is measured by the growth and satisfaction of our customers, partners, and franchise associates." }
  ];

  const steps = [
    { title: "Register", desc: "Create your business account on the Techhansa Retail platform." },
    { title: "Submit Requirements", desc: "Share your bulk IT hardware requirements with complete specifications." },
    { title: "Receive Competitive Bids", desc: "Verified suppliers submit quotations through our transparent bidding system." },
    { title: "Compare & Select", desc: "Evaluate pricing, product specifications, and supplier offerings before making your decision." },
    { title: "Procure with Confidence", desc: "Complete your purchase through a secure and streamlined procurement process." }
  ];

  const whoCanJoin = [
    { type: "Buyers", list: ["Corporate Companies", "Educational Institutions", "Government Organizations", "Hospitals", "Enterprises", "MSMEs", "Startups"] },
    { type: "Business Partners", list: ["IT Distributors", "Authorized Dealers", "OEM Partners", "Suppliers", "System Integrators"] },
    { type: "Franchise Partners", list: ["Entrepreneurs", "Existing Business Owners", "IT Professionals", "Technology Consultants", "Regional Business Developers"] }
  ];

  return (
    // MAIN WRAPPER: Removed bg-white, changed to bg-transparent so global pattern shows
    <div className="bg-transparent min-h-screen text-[var(--text-dark)] font-['Inter',sans-serif] overflow-hidden relative z-10">

      {/* 0. TOP SCROLLING BANNER WITH SMALL 3D ELEMENT */}
      <section ref={bannerRef} className="relative bg-transparent overflow-hidden z-20">
        <div className="relative flex items-center h-11 border-b border-white/10">
          <div className="flex animate-marquee">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex items-center flex-none">
                {tickerItems.map((t, i) => (
                  <span key={`${dup}-${i}`} className="mx-6 text-[11px] font-semibold tracking-[0.15em] uppercase text-[var(--premium-gold)] flex items-center whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--tech-blue)] mr-6 flex-none"></span>
                    {t}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[var(--text-dark)] to-transparent"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[var(--text-dark)] to-transparent"></div>
          
          <div className="pointer-events-none absolute right-4 md:right-10 top-1/2 -translate-y-1/2 hidden sm:block" style={{ perspective: '500px' }}>
            <motion.div style={{ rotateY: cubeRotateY, y: cubeY, opacity: cubeOpacity, transformStyle: 'preserve-3d' }} animate={{ rotateX: [0, 360] }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} className="relative w-6 h-6">
              <div className="absolute inset-0 bg-[var(--tech-blue)]" style={{ transform: 'translateZ(12px)' }} />
              <div className="absolute inset-0 bg-[#2A85D1]/70" style={{ transform: 'rotateY(180deg) translateZ(12px)' }} />
              <div className="absolute inset-0 bg-[var(--premium-gold)]" style={{ transform: 'rotateY(90deg) translateZ(12px)' }} />
              <div className="absolute inset-0 bg-[#DDA73C]/70" style={{ transform: 'rotateY(-90deg) translateZ(12px)' }} />
              <div className="absolute inset-0 bg-white/40" style={{ transform: 'rotateX(90deg) translateZ(12px)' }} />
              <div className="absolute inset-0 bg-white/20" style={{ transform: 'rotateX(-90deg) translateZ(12px)' }} />
            </motion.div>
          </div>
        </div>
        <style>{`
          @keyframes ttr-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          .animate-marquee { width: max-content; animation: ttr-marquee 24s linear infinite; }
          @media (prefers-reduced-motion: reduce) { .animate-marquee { animation: none; } }
        `}</style>
      </section>

      {/* 1. HERO & INTRO SECTION (Glassmorphism applied) */}
     {/* 1. HERO & INTRO SECTION (Glassmorphism applied) */}
      <section className="relative pt-32 pb-20 px-6 bg-gradient-to-b from-white/80 to-[#E4EBF4]/80 backdrop-blur-md z-10 overflow-hidden">
        <FloatingShapes /> 
        
        {/* Changed max-w-4xl to max-w-7xl to accommodate the two-column layout */}
        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div 
            className="grid lg:grid-cols-2 gap-12 items-center" 
            initial="hidden" 
            animate="visible" 
            variants={staggerContainer}
          >
            
            {/* Left Column: Text Content */}
            <div className="text-center lg:text-left">
              <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#835e2e] mb-6 tracking-tight leading-tight">
                Empowering Businesses with <br className="hidden lg:block" />
                <span className="text-[var(--premium-gold)]">Smarter IT Procurement</span>
              </motion.h1>
              <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-600 leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0">
                Welcome to Techhansa Retail, a next-generation B2B IT hardware procurement platform dedicated to simplifying how organizations purchase technology in bulk. We bridge the gap between buyers and trusted suppliers by offering a transparent, efficient, and competitive procurement ecosystem.
              </motion.p>
            </div>

            {/* Right Column: Big Image with Modern Animations */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, x: 50 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } }
              }}
              className="relative"
            >
              {/* Image Container with subtle border and shadow */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-white/60 group">
                
                {/* The Image: Replace the src with your actual company image path */}
                <motion.img 
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  src="https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&q=80&w=1200" 
                  alt="Bulk IT Hardware Procurement" 
                  className="w-full h-auto object-cover md:h-[450px]"
                />
                
                {/* Modern subtle color overlay to tie into your theme */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--tech-blue)]/20 to-transparent pointer-events-none mix-blend-overlay"></div>
                
                {/* Floating animated badge for extra modern feel */}
                <motion.div 
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-white/50 flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-[var(--premium-gold)]/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[var(--premium-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Bulk Hardware</p>
                    <p className="text-xs text-slate-500 font-medium">Ready for Dispatch</p>
                  </div>
                </motion.div>

              </div>
            </motion.div>

          </motion.div>
        </div>

        {/* Background decorative circles */}
        <div className="absolute top-20 left-10 w-72 h-72 border-[1px] border-[var(--premium-gold)]/10 rounded-full blur-sm pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-[30rem] h-[30rem] border-[2px] border-[var(--premium-gold)]/5 rounded-full blur-md pointer-events-none"></div>
      </section>

      {/* 3. WHAT WE DO (PRODUCTS) & SMART BIDDING (Glassmorphism applied) */}
      {/* <section className="py-20 px-6 bg-[#E4EBF4]/80 backdrop-blur-md relative z-10">
        <div className="container mx-auto max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[var(--text-dark)] mb-4">What We Do</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                We specialize in bulk IT hardware procurement. Whether your organization requires ten devices or thousands, Techhansa Retail is equipped to manage procurement efficiently.
              </p>
            </motion.div>
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3 mb-20">
              {products.map((item, idx) => (
                <span key={idx} className="px-5 py-2 bg-white/90 border border-[#2A85D1]/20 text-slate-700 rounded-full text-sm font-medium shadow-sm hover:border-[var(--tech-blue-hover)] hover:text-[var(--tech-blue-hover)] hover:bg-[#E4EBF4] transition-all cursor-default">
                  {item}
                </span>
              ))}
            </motion.div>
            <motion.div variants={fadeUp} className="relative group max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-[var(--tech-blue)] rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-500"></div>
              <div className="relative bg-white/90 p-10 md:p-14 rounded-3xl border border-[#2A85D1]/20 shadow-[0_8px_30px_rgba(42,133,209,0.08)] text-center">
                <h3 className="text-2xl md:text-3xl font-bold text-[var(--tech-blue)] mb-6">Smart Bidding Platform</h3>
                <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
                  Instead of contacting multiple vendors individually, buyers submit requirements on our platform. Verified suppliers participate in a competitive bidding process by offering their best quotations.
                </p>
                <div className="flex flex-wrap justify-center gap-6">
                  {['Transparent Pricing', 'Competitive Quotations', 'Reduced Costs', 'Faster Selection', 'Time-Saving', 'Better Decisions'].map((item, idx) => (
                    <div key={idx} className="flex items-center text-slate-700 font-medium">
                      <span className="w-2 h-2 bg-[var(--premium-gold)] rounded-full mr-2"></span> {item}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section> */}

      {/* 4. OPPORTUNITIES (PARTNER & FRANCHISE) (Glassmorphism applied) */}
      {/* <section className="py-20 px-6 bg-white/80 backdrop-blur-md relative z-10">
        <div className="container mx-auto max-w-6xl">
          <motion.div className="grid md:grid-cols-2 gap-10" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}>
            <motion.div variants={fadeUp} className="bg-[#E4EBF4]/80 p-10 rounded-3xl border border-transparent hover:border-[#2A85D1]/30 transition-colors">
              <h3 className="text-2xl font-bold text-[var(--text-dark)] mb-4">Partner Portal</h3>
              <p className="text-slate-600 mb-6 min-h-[80px]">
                Built for IT distributors, suppliers, OEMs, authorized dealers, and system integrators looking to expand their business through Techhansa Retail.
              </p>
              <ul className="space-y-3">
                {['Live Bidding Opportunities', 'Qualified Business Leads', 'Submit Competitive Quotations', 'Manage Orders Efficiently', 'Build Corporate Relationships'].map((item, idx) => (
                  <li key={idx} className="flex items-start text-slate-700 text-sm">
                    <span className="text-[var(--tech-blue)] mr-3 font-bold">✓</span> {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={fadeUp} className="bg-[#E4EBF4]/80 p-10 rounded-3xl border border-transparent hover:border-[#2A85D1]/30 transition-colors">
              <h3 className="text-2xl font-bold text-[var(--text-dark)] mb-4">Franchise Opportunities</h3>
              <p className="text-slate-600 mb-6 min-h-[80px]">
                We invite entrepreneurs, IT professionals, and business owners to become part of our growing family and expand our presence across India.
              </p>
              <ul className="space-y-3">
                {['Established Business Model', 'Strong Brand Support', 'Technical & Business Training', 'Marketing & Promo Support', 'Continuous Operational Support'].map((item, idx) => (
                  <li key={idx} className="flex items-start text-slate-700 text-sm">
                    <span className="text-[var(--tech-blue)] mr-3 font-bold">✓</span> {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section> */}

      {/* 5. WHY CHOOSE US & CORE VALUES (Glassmorphism applied) */}
      {/* <section className="py-20 px-6 bg-[#E4EBF4]/80 backdrop-blur-md relative z-10">
        <div className="container mx-auto max-w-6xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}>
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-[var(--text-dark)] mb-12">Why Choose Techhansa Retail?</motion.h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {whyChooseUs.map((reason, idx) => (
                <motion.div key={idx} variants={fadeUp} className="bg-white/90 p-8 rounded-2xl shadow-sm border border-slate-100 text-left hover:shadow-md transition-shadow">
                  <h4 className="text-lg font-bold text-[var(--tech-blue)] mb-2">{reason.title}</h4>
                  <p className="text-slate-600 text-sm">{reason.desc}</p>
                </motion.div>
              ))}
            </div>
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-[var(--text-dark)] mb-12">Our Core Values</motion.h2>
            <div className="grid md:grid-cols-5 gap-6">
              {coreValues.map((value, idx) => (
                <motion.div key={idx} variants={fadeUp} className="bg-white/90 p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-[#DDA73C]/50 transition-colors">
                  <h4 className="text-md font-bold text-[var(--text-dark)] mb-2">{value.title}</h4>
                  <p className="text-slate-600 text-xs">{value.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section> */}

      {/* 6. HOW IT WORKS & WHO CAN JOIN (Glassmorphism applied) */}
      {/* <section className="py-20 px-6 bg-white/80 backdrop-blur-md relative z-10">
        <div className="container mx-auto max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}>
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-[var(--text-dark)] text-center mb-16">How Techhansa Retail Works</motion.h2>
            <div className="flex flex-col space-y-6 relative max-w-4xl mx-auto mb-24">
              <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#2A85D1]/10 via-[var(--tech-blue)] to-[#2A85D1]/10"></div>
              {steps.map((step, index) => (
                <motion.div key={index} variants={fadeUp} className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="w-full md:w-1/2"></div>
                  <div className="absolute left-6 md:left-1/2 w-5 h-5 bg-white border-[3px] border-[var(--premium-gold)] rounded-full transform -translate-x-[9px] md:-translate-x-2.5 z-10 shadow-sm"></div>
                  <div className={`w-full md:w-1/2 pl-14 md:pl-0 ${index % 2 === 0 ? 'md:pr-12 text-left md:text-right' : 'md:pl-12 text-left'}`}>
                    <div className="bg-[#E4EBF4]/80 p-6 rounded-2xl border border-transparent hover:border-[#2A85D1]/20 transition-all">
                      <span className="text-[var(--tech-blue)] font-bold text-xs uppercase tracking-wider">Step {index + 1}</span>
                      <h4 className="text-lg font-bold text-[var(--text-dark)] mt-1 mb-2">{step.title}</h4>
                      <p className="text-slate-600 text-sm">{step.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-[var(--text-dark)] text-center mb-12">Who Can Join?</motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {whoCanJoin.map((group, idx) => (
                <motion.div key={idx} variants={fadeUp} className="bg-[#E4EBF4]/80 p-8 rounded-2xl border border-transparent hover:border-[#DDA73C]/40 text-center transition-all">
                  <h3 className="text-xl font-bold text-[var(--text-dark)] mb-6 pb-4 border-b border-[#2A85D1]/20">{group.type}</h3>
                  <ul className="space-y-2">
                    {group.list.map((item, i) => (
                      <li key={i} className="text-slate-600 text-sm font-medium">{item}</li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section> */}

      {/* 7. COMMITMENT & CTA */}
      {/* <section className="py-24 px-6 bg-gradient-to-b from-white/80 to-[#E4EBF4]/80 backdrop-blur-md border-t border-slate-100 relative z-10">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-[var(--text-dark)] mb-6">Our Commitment</motion.h2>
            <motion.p variants={fadeUp} className="text-slate-600 mb-10 leading-relaxed">
              At Techhansa Retail, we are committed to building long-lasting relationships based on trust, transparency, quality, and customer satisfaction. Every product we source, every quotation we process, and every partnership we establish reflects our dedication to helping businesses procure technology more efficiently. We don't just supply IT hardware—we enable organizations to build stronger digital infrastructure with confidence.
            </motion.p>
            <motion.div variants={fadeUp} className="bg-[var(--tech-blue)] p-10 rounded-3xl shadow-xl shadow-[#2A85D1]/20 transform transition duration-300 hover:scale-[1.02]">
              <h3 className="text-2xl font-bold text-white mb-4">Join the Techhansa Retail Network</h3>
              <p className="text-[#E4EBF4] mb-8">
                Whether you're looking to procure IT hardware in bulk, become a trusted supplier, or establish your own franchise business, Techhansa Retail is your reliable partner for growth.
              </p>
              <p className="text-[var(--premium-gold)] font-bold uppercase tracking-widest text-sm bg-white/10 py-3 rounded-lg inline-block px-6">
                Smart Procurement. Trusted Partnerships. Sustainable Growth.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section> */}

    </div>
  );
}