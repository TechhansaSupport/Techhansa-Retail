import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import { 
  ArrowRight, ShieldCheck, Award, Zap, Users, Target, 
  Briefcase, Server, TrendingUp, CheckCircle2, Eye, Building2,
  CheckCircle, Globe, HeadphonesIcon, ThumbsUp, HeartHandshake, Shield
} from 'lucide-react';

// --- DATA ARRAYS ---

const productPortfolio = [
  "Business Laptops", "Desktop Computers", "Workstations", 
  "Enterprise Servers", "Networking Solutions", "Monitors", 
  "Printers & Scanners", "Storage Devices", "CCTV & Security Systems", 
  "UPS & Power Backup Solutions", "IT Accessories & Peripherals", "Custom Enterprise IT Solutions"
];

const pillars = [
  { 
    title: "Solutions for Every Industry", 
    icon: Building2, 
    desc: "We proudly serve Corporate Offices, IT Companies, Educational Institutions, Universities & Colleges, Schools, Hospitals, Public Sector Enterprises, Banking & Financial Institutions, Manufacturing Industries, Startups, MSMEs, System Integrators, and Business Consultants." 
  },
  { 
    title: "Partner Portal", 
    icon: Users, 
    desc: "Designed for IT distributors, suppliers, OEMs, authorized dealers, and system integrators. Partners can participate in live bidding opportunities, receive qualified leads, submit quotations, manage orders, and expand their customer base." 
  },
  { 
    title: "Franchise Opportunities", 
    icon: Globe, 
    desc: "Our nationwide franchise program offers an established business model, brand support, technical assistance, business training, marketing support, lead generation, sales guidance, and continuous operational support." 
  }
];

const whyChooseUs = [
  { title: "Trusted Procurement Platform", icon: Shield },
  { title: "Competitive Pricing", icon: Zap },
  { title: "Verified Vendor Network", icon: CheckCircle2 },
  { title: "End-to-End Support", icon: HeadphonesIcon },
  { title: "Quality Assurance", icon: ThumbsUp },
  { title: "Customer-Centric Approach", icon: HeartHandshake }
];

const coreValues = [
  { 
    title: "Integrity", 
    desc: "Honesty, transparency, and accountability in every interaction. We build trust by delivering on our promises and maintaining the highest ethical standards.", 
    icon: ShieldCheck,
    image: "/src/assets/integrity.jpg" 
  },
  { 
    title: "Excellence", 
    desc: "Continuously improving to deliver exceptional customer experiences. We settle for nothing less than superior quality in our network and services.", 
    icon: Award,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800"
  },
  { 
    title: "Innovation", 
    desc: "Technology driving smarter procurement and better outcomes. We constantly adapt our platform to meet the evolving needs of modern enterprises.", 
    icon: Zap,
    image: "/src/assets/innovation.jpg"
  },
  { 
    title: "Partnership", 
    desc: "Building long-term relationships through trust and shared success. We believe in collaborative growth with both our buyers and suppliers.", 
    icon: Users,
    image: "/src/assets/partnership.jpg"
  },
  { 
    title: "Customer Success", 
    desc: "Measured strictly by the growth, efficiency, and satisfaction of our ecosystem. Your operational success is our primary benchmark.", 
    icon: Target,
    image: "/src/assets/customer-success.jpg"
  }
];

const steps = [
  { title: "Register", desc: "Create your verified business profile on the Techhansa platform." },
  { title: "Submit Requirements", desc: "Share your bulk hardware needs with complete specifications." },
  { title: "Receive Competitive Bids", desc: "Verified suppliers submit competitive quotations transparently." },
  { title: "Compare & Select", desc: "Evaluate pricing and offerings before making your decision." },
  { title: "Procure with Confidence", desc: "Complete purchases through our secure, streamlined workflow." }
];

const whoCanJoin = [
  { type: "Buyers", icon: Briefcase, list: ["Corporate Companies", "Educational Institutions", "Hospitals", "Enterprises", "MSMEs", "Startups"] },
  { type: "Business Partners", icon: Server, list: ["IT Distributors", "Authorized Dealers", "OEM Partners", "Suppliers", "System Integrators"] },
  { type: "Franchise Partners", icon: TrendingUp, list: ["Entrepreneurs", "Existing Business Owners", "IT Professionals", "Technology Consultants", "Regional Business Developers"] }
];

// --- MAIN PAGE COMPONENT ---
export default function AboutPage() {
  const containerRef = useRef(null);
  
  // Ref and Scroll Tracker for the Principles (Zigzag) Section
  const principlesRef = useRef(null);
  const { scrollYProgress: principlesScroll } = useScroll({
    target: principlesRef,
    offset: ["start center", "end center"]
  });
  const principlesScaleY = useSpring(principlesScroll, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Parallax Mouse Tracking for Hero
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 2; 
    const y = (clientY / window.innerHeight - 0.5) * 2; 
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <div ref={containerRef} className="relative min-h-screen text-gray-600 font-sans bg-transparent overflow-hidden selection:bg-[#0d3863]/20 selection:text-[#0d3863]">
      
      {/* --- TOP BANNER SECTION --- */}
      <section className="relative w-full h-[300px] flex items-center justify-center overflow-hidden bg-slate-900">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('./src/assets/about-banner.jpg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 to-slate-900/50"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-6xl font-extrabold text-white tracking-tight"
          >
            About us
          </motion.h1>
          
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "80px", opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "anticipate" }}
            className="h-1.5 bg-[#0d3863] rounded-full my-8"
          ></motion.div>
        </div>
      </section>

      {/* --- HERO SECTION --- */}
      <section 
        onMouseMove={handleMouseMove}
        className="relative z-10 pt-16 pb-12 px-6 lg:px-12 w-full flex items-center"
      >
        <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#929292] to-[#0d3863] leading-[1.1] mb-6"
            >
              Empowering Businesses with Smarter IT Procurement
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-lg text-gray-600 max-w-xl leading-relaxed mb-6 font-medium"
            >
              Welcome to Techhansa Retail, a next-generation B2B IT hardware procurement platform dedicated to simplifying enterprise technology purchasing. We connect organizations with trusted suppliers through a transparent, efficient, and competitive procurement ecosystem.
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-lg text-gray-600 max-w-xl leading-relaxed mb-6 font-medium"
            >
              Whether you are a corporate enterprise, educational institution, healthcare provider, startup, or reseller, we help you source high-quality IT hardware. Beyond procurement, we are building a nationwide network of partners and franchise associates to make enterprise IT solutions more accessible across India.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
            className="relative w-full h-full flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-md lg:max-w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-[4px] border-white/60">
              <img 
                src="/src/assets/procurment.jpg" 
                alt="IT Hardware Procurement" 
                className="w-full h-auto md:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0d3863]/20 to-transparent pointer-events-none mix-blend-overlay"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- WHO WE ARE & MISSION / VISION (VIDEO OVERLAY EFFECT APPLIED) --- */}
      <section className="relative z-10 py-24 px-6 lg:px-12 bg-gray-50/50 backdrop-blur-lg border-y border-gray-200/50">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              <span className="text-gray-600">Who We</span> <span className="text-[#0d3863]">Are</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              At Techhansa Retail, we believe technology procurement should be simple, transparent, and value-driven. Our centralized marketplace enables verified suppliers to compete for your business, helping organizations make smarter purchasing decisions while creating new opportunities for suppliers, partners, and entrepreneurs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission Card */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="group relative bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden h-[300px] cursor-pointer">
              {/* Default View */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-10 group-hover:opacity-0">
                <div className="w-20 h-20 rounded-2xl bg-[#0d3863]/5 flex items-center justify-center text-[#0d3863] mb-6">
                  <Eye className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-bold text-[#0d3863]">Our Vision</h3>
              </div>
              {/* Hover View (Video Style Slide-up) */}
              <div className="absolute inset-0 bg-[#0d3863] p-10 flex flex-col justify-center translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
                <h3 className="text-2xl font-bold text-white mb-4">Our mission</h3>
                <p className="text-blue-100 leading-relaxed md:text-lg">
                 To revolutionize B2B IT hardware procurement through a transparent, technology-driven platform connecting buyers, suppliers, partners, and franchise businesses while making procurement smarter, faster, and more cost-effective.
                </p>
              </div>
            </motion.div>

            {/* Vision Card */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="group relative bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden h-[300px] cursor-pointer">
              {/* Default View */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-10 group-hover:opacity-0">
                <div className="w-20 h-20 rounded-2xl bg-[#0d3863]/5 flex items-center justify-center text-[#0d3863] mb-6">
                  <Eye className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-bold text-[#0d3863]">Our Vision</h3>
              </div>
              {/* Hover View (Video Style Slide-up) */}
              <div className="absolute inset-0 bg-[#0d3863] p-10 flex flex-col justify-center translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
                <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
                <p className="text-blue-100 leading-relaxed md:text-lg">
                  To become India's most trusted B2B IT hardware procurement ecosystem by enabling seamless collaboration between organizations, suppliers, partners, and franchise entrepreneurs.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- WHAT WE DO & PRODUCT PORTFOLIO --- */}
      <section className="relative z-10 py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
            <span className="text-gray-600">What We</span> <span className="text-[#0d3863]">Do</span>
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">
            We specialize in bulk IT hardware procurement through a smart bidding platform. Organizations submit requirements, receive competitive quotations, compare offers, and select the best solution for their operational and budget needs.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <h3 className="text-xl font-bold text-[#0d3863] mb-8 text-center uppercase tracking-wider">Product Portfolio</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {productPortfolio.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-sm border border-gray-100 text-gray-600 font-medium hover:bg-[#0d3863] hover:text-white transition-colors cursor-default"
              >
                <CheckCircle className="w-4 h-4" /> {item}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SOLUTIONS, PARTNER PORTAL, FRANCHISE (VIDEO OVERLAY EFFECT APPLIED) --- */}
      <section className="relative z-10 py-24 px-6 lg:px-12 bg-gray-50/50 border-y border-gray-200/50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {pillars.map((pillar, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              className="group relative bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden h-[380px] md:h-[420px] cursor-pointer"
            >
              {/* Default View */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-10 group-hover:opacity-0">
                <div className="w-20 h-20 rounded-2xl bg-[#0d3863]/5 flex items-center justify-center text-[#0d3863] mb-8">
                  <pillar.icon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-[#0d3863] text-center px-4">{pillar.title}</h3>
              </div>
              
              {/* Hover View (Video Style Slide-up) */}
              <div className="absolute inset-0 bg-[#0d3863] p-10 flex flex-col justify-center translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
                <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/20 pb-4">{pillar.title}</h3>
                <p className="text-blue-100 leading-relaxed md:text-lg">
                  {pillar.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- WHY CHOOSE US (VIDEO OVERLAY EFFECT APPLIED) --- */}
      <section className="relative z-10 py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-16">
            <span className="text-gray-600">Why Choose</span> <span className="text-[#0d3863]">Techhansa Retail</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-10">
            {whyChooseUs.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group relative bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden h-[220px] cursor-pointer"
              >
                {/* Default View */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-8 group-hover:opacity-0">
                  <div className="w-16 h-16 rounded-full bg-[#0d3863]/5 flex items-center justify-center text-[#0d3863] mb-4">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-700">{item.title}</h3>
                </div>

                {/* Hover View (Video Style Slide-up) */}
                <div className="absolute inset-0 bg-[#0d3863] p-6 flex flex-col items-center justify-center translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white mb-4">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- ZIGZAG CORE VALUES SECTION (Removed Zooming) --- */}
      <section className="relative z-10 py-32 px-6 lg:px-12 bg-white/60 backdrop-blur-lg border-y border-gray-200/50">
        <div className="max-w-7xl mx-auto text-center mb-24">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            <span className="text-[#6d6c6c]">Our Core</span> <span className="text-[#0d3863]">Values</span>
          </h2>
        </div>
        
        <div className="relative max-w-6xl mx-auto" ref={principlesRef}>
          <div className="absolute left-[24px] md:left-1/2 top-0 bottom-0 w-[2px] bg-gray-200/20 transform md:-translate-x-1/2 rounded-full z-0"></div>
          
          <motion.div 
            className="absolute left-[24px] md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-gray-700 to-[#0d3863] transform md:-translate-x-1/2 rounded-full origin-top z-0"
            style={{ scaleY: principlesScaleY }}
          ></motion.div>

          <div className="flex flex-col gap-20 md:gap-32">
            {coreValues.map((val, i) => (
              <div key={i} className={`relative flex flex-col md:flex-row items-center w-full ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                
                <motion.div 
                  initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true, margin: "-100px" }} transition={{ type: "spring" }}
                  className="absolute left-[24px] md:left-1/2 w-5 h-5 rounded-full bg-white border-[4px] border-[#0d3863] transform -translate-x-1/2 z-10 shadow-[0_0_15px_rgba(13,56,99,0.4)]"
                ></motion.div>

                <motion.div
                  initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`w-full md:w-1/2 pl-14 md:pl-0 ${i % 2 === 0 ? 'md:pr-12 lg:pr-20' : 'md:pl-12 lg:pl-20'} mb-10 md:mb-0 relative`}
                >
                  <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(13,56,99,0.07)] aspect-[4/3]">
                    <img
                      src={val.image}
                      alt={val.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d3863]/20 to-transparent pointer-events-none"></div>
                  </div>
                  
                  <div className={`absolute top-6 ${i % 2 === 0 ? 'right-6 md:-right-6 lg:-right-8' : 'left-6 md:-left-6 lg:-left-8'} bg-white/90 backdrop-blur-md p-3.5 rounded-2xl shadow-xl z-20`}>
                    <val.icon strokeWidth={2} className="w-6 h-6 text-[#0d3863]" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: i % 2 === 0 ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`w-full md:w-1/2 pl-14 md:pl-0 ${i % 2 === 0 ? 'md:pl-12 lg:pl-20 text-left items-start' : 'md:pr-12 lg:pr-20 md:text-right text-left md:items-end items-start'} flex flex-col`}
                >
                  <div className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-4">
                    0{i + 1}
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold text-[#0d3863] mb-6">
                    {val.title}
                  </h3>
                  <p className={`text-lg text-gray-600 leading-relaxed max-w-lg ${i % 2 === 0 ? '' : 'md:ml-auto'}`}>
                    {val.desc}
                  </p>
                  <div className={`mt-8 h-1 w-12 bg-[#0d3863] rounded-full ${i % 2 === 0 ? '' : 'md:ml-auto'}`}></div>
                </motion.div>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS (VIDEO OVERLAY EFFECT APPLIED) --- */}
      <section className="relative z-10 py-32 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            <span className="text-gray-500">Purchasing</span> <span className="text-[#0d3863]">Process</span>
          </h2>
          <p className="text-gray-500 text-lg">A seamless, five-step workflow designed for modern business velocity.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 lg:gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group relative bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-22px)] h-[320px] cursor-pointer"
            >
              {/* Default View */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-10 group-hover:opacity-0">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-[#0d3863] font-bold text-2xl mb-6">
                  0{i + 1}
                </div>
                <h3 className="text-2xl font-bold text-[#0d3863] text-center">{step.title}</h3>
              </div>

              {/* Hover View (Video Style Slide-up) */}
              <div className="absolute inset-0 bg-[#0d3863] p-10 flex flex-col justify-center translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
                <div className="text-blue-300 font-bold text-sm tracking-widest uppercase mb-3">Step 0{i + 1}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-blue-100 leading-relaxed font-medium">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- WHO CAN JOIN (VIDEO OVERLAY EFFECT APPLIED) --- */}
      <section className="relative z-10 py-32 px-6 lg:px-12 bg-gray-50/50 backdrop-blur-lg border-y border-gray-200/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-16">
            <span className="text-gray-500">One Ecosystem,</span> <span className="text-[#0d3863]">Endless Possibilities</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {whoCanJoin.map((group, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="group relative bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden h-[450px] cursor-pointer"
              >
                {/* Default View */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-10 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-10 group-hover:opacity-0">
                  <div className="w-24 h-24 rounded-[2rem] bg-gray-50 border border-gray-100 flex items-center justify-center text-[#0d3863] mb-8">
                    <group.icon strokeWidth={1.5} className="w-12 h-12" />
                  </div>
                  <h3 className="text-3xl font-bold text-[#0d3863] text-center">{group.type}</h3>
                </div>

                {/* Hover View (Video Style Slide-up) */}
                <div className="absolute inset-0 bg-[#0d3863] p-10 flex flex-col justify-center translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
                  <h3 className="text-3xl font-bold text-white mb-6 border-b border-white/20 pb-4">{group.type}</h3>
                  <ul className="space-y-4">
                    {group.list.map((item, idx) => (
                      <li key={idx} className="flex items-center text-blue-100 font-medium md:text-lg">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-400 mr-4 shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- OUR COMMITMENT & CTA SECTION (No Zoom) --- */}
      <section className="relative z-10 py-20 px-6 lg:px-12 flex justify-center text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-20 bg-[#0d3863]/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="relative max-w-5xl w-full bg-white rounded-[3rem] p-12 md:p-20 shadow-2xl overflow-hidden border border-gray-100"
        >
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
              <span className="text-gray-600">Our</span> <span className="text-[#0d3863]">Commitment</span>
            </h2>
            <p className="text-gray-600 text-lg md:text-xl mb-12 max-w-3xl mx-auto font-light leading-relaxed">
              We are committed to building long-lasting relationships based on trust, transparency, quality, and customer satisfaction. Every product, quotation, and partnership reflects our dedication to helping businesses procure technology more efficiently.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="group relative inline-flex items-center justify-center px-10 py-5 bg-[#0d3863] text-white rounded-2xl font-bold text-lg overflow-hidden transition-colors hover:bg-[#154c82] shadow-lg shadow-[#0d3863]/20">
                <span className="relative flex items-center gap-2">
                  Join the Techhansa Retail Network <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>
            
            <p className="mt-8 text-sm font-semibold text-[#0d3863] uppercase tracking-widest opacity-80">
              Smart Procurement • Trusted Partnerships • Sustainable Growth
            </p>
          </div>
        </motion.div>
      </section>

    </div>
  );
}