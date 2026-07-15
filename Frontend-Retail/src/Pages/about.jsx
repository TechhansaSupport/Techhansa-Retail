import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import { 
  ArrowRight, ShieldCheck, Award, Zap, Users, Target, 
  Briefcase, Server, TrendingUp, CheckCircle2
} from 'lucide-react';

// --- DATA ARRAYS ---
const coreValues = [
  { title: "Integrity", desc: "Honesty, transparency, and accountability in every interaction.", icon: ShieldCheck },
  { title: "Excellence", desc: "Continuously improving to deliver exceptional customer experiences.", icon: Award },
  { title: "Innovation", desc: "Technology driving smarter procurement and better outcomes.", icon: Zap },
  { title: "Partnership", desc: "Building long-term relationships through trust and shared success.", icon: Users },
  { title: "Customer Success", desc: "Measured by the growth and satisfaction of our ecosystem.", icon: Target }
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

// --- ANIMATED WORD REVEAL HELPER ---
// This handles the smooth text appearance animation in the Hero section.
const WordReveal = ({ text, className }) => {
  return (
    <motion.h1 
      initial="hidden" animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
      className={className}
    >
      {text.split(" ").map((word, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 15, filter: "blur(6px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", damping: 20, stiffness: 100 } }
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.h1>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function AboutPage() {
  const containerRef = useRef(null);
  
  // Ref for the Timeline section to track scroll accurately
  const timelineRef = useRef(null);

  // Scroll Progress ONLY tracks when the timeline section is in view
  const { scrollYProgress } = useScroll({ 
    target: timelineRef, 
    offset: ["start center", "end center"] 
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

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
    <div ref={containerRef} className="relative min-h-screen text-slate-900 font-sans bg-transparent overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* --- TOP BANNER SECTION --- */}
      <section className="relative w-full h-[300px] flex items-center justify-center overflow-hidden bg-slate-900">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('./src/assets/about-banner.jpg')" }}
        >
          {/* Lighter gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 to-slate-900/50"></div>
        </div>

        {/* Animated Banner Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-6xl font-extrabold text-white tracking-tight"
          >
            About us
          </motion.h1>
          
          {/* Animated Orange Underline */}
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "80px", opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "anticipate" }}
            className="h-1.5 bg-orange-500 rounded-full my-8"
          ></motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
            className="text-lg md:text-xl text-slate-100 leading-relaxed font-medium"
          >
             {/* We are more than just an IT vendor; we are the architects of your digital future. 
             Techhansa Solution bridges the gap between complex technological ecosystems and seamless business operations. */}
          </motion.p>
        </div>
      </section>

      {/* --- HERO SECTION --- */}
      <section 
        onMouseMove={handleMouseMove}
        className="relative z-10 pt-10 pb-12 px-6 lg:px-12 w-full min-h-[90vh] flex items-center"
      >
        {/* HERO CONTENT: TWO COLUMN GRID */}
        <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text Content */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <WordReveal 
              text="Empowering Businesses with Smarter IT Procurement"
              className="text-4xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6"
            />

            <motion.p 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-lg md:text-base text-slate-500 max-w-xl leading-relaxed mb-10 font-light"
            >
              Welcome to Techhansa Retail. We bridge the gap between buyers and trusted suppliers by offering a transparent, efficient, and competitive procurement ecosystem designed for modern enterprises.
            </motion.p>
          </div>

          {/* Right Column: Premium Image with Animations */}
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
              
              {/* Overlay Gradient for contrast */}
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/20 to-transparent pointer-events-none mix-blend-overlay"></div>
              
              {/* Floating Glass Badge */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-6 left-6 md:bottom-8 md:left-8 bg-white/90 backdrop-blur-md p-4 pr-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/50 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Bulk Hardware</p>
                  <p className="text-xs text-slate-500 font-medium">Verified Network</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* --- CORE VALUES --- */}
      <section className="relative z-10 py-32 px-6 lg:px-12 bg-white/40 backdrop-blur-lg border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Principles That Drive Us</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">Built on a foundation of trust, our platform is designed to align with the highest standards of enterprise procurement.</p>
        </div>
        
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {coreValues.map((val, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="group relative p-8 bg-white rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50/50 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <val.icon strokeWidth={1.5} className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{val.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{val.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- HOW IT WORKS (Timeline Journey) --- */}
      <section className="relative z-10 py-32 px-6 lg:px-12 max-w-5xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">The Procurement Journey</h2>
          <p className="text-slate-500 text-lg">A seamless, five-step workflow designed for modern business velocity.</p>
        </div>

        <div className="relative" ref={timelineRef}>
          
          {/* Central Line Background */}
          <div className="absolute left-[24px] md:left-1/2 top-0 bottom-0 w-[2px] bg-slate-200/50 transform md:-translate-x-1/2 rounded-full"></div>
          
          {/* Animated Progress Line */}
          <motion.div 
            className="absolute left-[24px] md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-500 to-indigo-500 transform md:-translate-x-1/2 rounded-full origin-top"
            style={{ scaleY }}
          ></motion.div>

          <div className="space-y-16">
            {steps.map((step, i) => (
              <div key={i} className={`relative flex items-center ${i % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                <div className="hidden md:block w-1/2"></div>
                
                <motion.div 
                  initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true, margin: "-100px" }} transition={{ type: "spring" }}
                  className="absolute left-[24px] md:left-1/2 w-4 h-4 rounded-full bg-white border-[3px] border-indigo-500 transform -translate-x-1/2 z-10 shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                ></motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: i % 2 === 0 ? 40 : -40 }} 
                  whileInView={{ opacity: 1, x: 0 }} 
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, type: "spring" }}
                  className={`w-full md:w-1/2 pl-16 md:pl-0 ${i % 2 === 0 ? 'md:pr-16 text-left md:text-right' : 'md:pl-16 text-left'}`}
                >
                  <div className="p-8 bg-white/60 backdrop-blur-md rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300">
                    <div className="text-xs font-bold tracking-widest text-indigo-500 uppercase mb-2">Step 0{i + 1}</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- WHO CAN JOIN --- */}
      <section className="relative z-10 py-32 px-6 lg:px-12 bg-white/40 backdrop-blur-lg border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-16">An Ecosystem For Everyone</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {whoCanJoin.map((group, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="group relative bg-white p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 mb-8 group-hover:scale-110 group-hover:border-blue-200 group-hover:text-blue-600 transition-all duration-300">
                    <group.icon strokeWidth={1.5} className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">{group.type}</h3>
                  <ul className="space-y-4">
                    {group.list.map((item, idx) => (
                      <li key={idx} className="flex items-center text-slate-500 font-medium group-hover:text-slate-700 transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mr-3 group-hover:bg-blue-500 transition-colors"></span>
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

      {/* --- CTA / COMMITMENT SECTION --- */}
      <section className="relative z-10 py-40 px-6 lg:px-12 flex justify-center text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="relative max-w-4xl w-full bg-white rounded-[3rem] p-12 md:p-20 shadow-2xl overflow-hidden"
        >
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-4  00 mb-6 tracking-tight">Ready to transform your IT procurement?</h2>
            <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Join thousands of organizations building stronger digital infrastructure through smart, transparent, and competitive purchasing.
            </p>
            
            <button className="group relative inline-flex items-center justify-center px-10 py-5 bg-white text-slate-900 rounded-2xl font-bold text-lg overflow-hidden transition-transform hover:scale-105 active:scale-95">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-100 to-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity"></span>
              <span className="relative flex items-center gap-2">
                Join The Network <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        </motion.div>
      </section>

    </div>
  );
}