import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import { 
  ArrowRight, ShieldCheck, Award, Zap, Users, Target, 
  Briefcase, Server, TrendingUp, CheckCircle2
} from 'lucide-react';

// --- DATA ARRAYS ---
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
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800"
  },
  { 
    title: "Partnership", 
    desc: "Building long-term relationships through trust and shared success. We believe in collaborative growth with both our buyers and suppliers.", 
    icon: Users,
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800"
  },
  { 
    title: "Customer Success", 
    desc: "Measured strictly by the growth, efficiency, and satisfaction of our ecosystem. Your operational success is our primary benchmark.", 
    icon: Target,
    image: "src/assets/customer-success.jpg"
  }
];

const steps = [
  { title: "Register Account", desc: "Create your verified business profile on the Techhansa platform." },
  { title: "Submit Requirements", desc: "Share your bulk hardware needs with complete specifications." },
  { title: "Receive Bids", desc: "Verified suppliers submit competitive quotations transparently." },
  { title: "Compare & Select", desc: "Evaluate pricing and offerings before making your decision." },
  { title: "Procure Confidently", desc: "Complete purchases through our secure, streamlined workflow." }
];

const whoCanJoin = [
  { type: "Buyers", icon: Briefcase, list: ["Corporates", "Institutions", "Government", "Hospitals", "Enterprises", "Startups"] },
  { type: "Business Partners", icon: Server, list: ["IT Distributors", "Authorized Dealers", "OEM Partners", "System Integrators"] },
  { type: "Franchise Partners", icon: TrendingUp, list: ["Entrepreneurs", "Business Owners", "IT Professionals", "Consultants"] }
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
        className="relative z-10 pt-10 pb-12 px-6 lg:px-12 w-full min-h-[90vh] flex items-center"
      >
        <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            
            {/* WordReveal removed, replaced with standard motion.h1 and text */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#929292] to-[#0d3863] leading-[1.1] mb-6"
            >
              Empowering Businesses with Smarter IT Procurement
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-lg md:text-base text-gray-500 max-w-xl leading-relaxed mb-10 font-light"
            >
              Welcome to Techhansa Retail. We bridge the gap between buyers and trusted suppliers by offering a transparent, efficient, and competitive procurement ecosystem designed for modern enterprises.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
            className="relative w-full h-full flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-md lg:max-w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-[4px] border-white/60 group">
              <motion.img 
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                src="https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&q=80&w=1200" 
                alt="Bulk Enterprise IT Hardware" 
                className="w-full h-auto md:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0d3863]/20 to-transparent pointer-events-none mix-blend-overlay"></div>
              
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-6 left-6 md:bottom-8 md:left-8 bg-white/90 backdrop-blur-md p-4 pr-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/50 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-[#0d3863]/10 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-[#0d3863]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0d3863]">Bulk Hardware</p>
                  <p className="text-xs text-gray-500 font-medium">Verified Network</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- REDESIGNED ZIGZAG CORE VALUES SECTION --- */}
      <section className="relative z-10 py-32 px-6 lg:px-12 bg-white/60 backdrop-blur-lg border-y border-gray-200/50">
        <div className="max-w-7xl mx-auto text-center mb-24">
          {/* Dual Color Heading */}
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            <span className="text-[#6d6c6c]">What Guides</span> <span className="text-[#0d3863]">Us</span>
          </h2>
          <p className="text-[#6d6c6c] text-lg max-w-2xl mx-auto">
            Built on a foundation of trust, our platform is designed to align with the highest standards of enterprise procurement.
          </p>
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
                  className={`w-full md:w-1/2 pl-14 md:pl-0 ${i % 2 === 0 ? 'md:pr-12 lg:pr-20' : 'md:pl-12 lg:pl-20'} mb-10 md:mb-0 relative group`}
                >
                  <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(13,56,99,0.07)] aspect-[4/3]">
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.8 }}
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

      {/* --- PROCUREMENT JOURNEY --- */}
      <section className="relative z-10 py-32 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-24">
          {/* Dual Color Heading */}
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
              className="group relative bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-22px)]"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-gray-400 to-[#0d3863] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-[#0d3863] font-bold text-lg mb-8 group-hover:bg-[#0d3863] group-hover:text-white transition-all duration-300">
                  0{i + 1}
                </div>
                
                <h3 className="text-2xl font-bold text-[#0d3863] mb-4">{step.title}</h3>
                
                <p className="text-gray-600 leading-relaxed font-medium">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- WHO CAN JOIN --- */}
      <section className="relative z-10 py-32 px-6 lg:px-12 bg-gray-50/50 backdrop-blur-lg border-y border-gray-200/50">
        <div className="max-w-7xl mx-auto">
          {/* Dual Color Heading */}
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-16">
            <span className="text-gray-500">One Ecosystem,</span> <span className="text-[#0d3863]">Endless Possibilities</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {whoCanJoin.map((group, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="group relative bg-white p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0d3863]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-[#0d3863] mb-8 group-hover:scale-110 group-hover:border-[#0d3863]/20 group-hover:bg-[#0d3863] group-hover:text-white transition-all duration-300">
                    <group.icon strokeWidth={1.5} className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0d3863] mb-6">{group.type}</h3>
                  <ul className="space-y-4">
                    {group.list.map((item, idx) => (
                      <li key={idx} className="flex items-center text-gray-600 font-medium group-hover:text-[#0d3863] transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mr-3 group-hover:bg-[#0d3863] transition-colors"></span>
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

    </div>
  );
}