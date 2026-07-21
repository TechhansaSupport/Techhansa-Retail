import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './Component/Layout/header';
import Footer from './Component/Layout/footer';
import Homepage from './Pages/homepage';
import About from './Pages/about';
import Contact from './Pages/contact';
import Partners from './Pages/Partners/partnersMain';
import OemPartner from './Pages/Partners/OEM';
import ChannelPartner from './Pages/Partners/Channel';
import FranchisePartner from './Pages/Partners/Franchise';
import Investers from './Pages/investers';
import LoginPage from './Pages/LoginPage';
import FranchiseForm from './Pages/Partners/FranchiseForm';

// --- Scroll To Top Component ---  
// Yeh component route change hone par instantly page ko top par bhej dega
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // window.scrollTo(0, 0) instantly top par scroll karta hai (smooth scroll nahi karega)
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <Router>
      {/* ScrollToTop component ko yahan Router ke andar add kiya gaya hai */}
      <ScrollToTop />

      <Routes>
        {/* Login page — standalone, no header/footer */}
        <Route path="/login" element={<LoginPage />} />

        {/* All other pages with header & footer */}
        <Route path="*" element={
          <div className="app-container relative z-10 bg-transparent min-h-screen flex flex-col">
            <Header />
            
            {/* Main Content Area */}
            <main className="main-content flex-grow">
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/partners" element={<Partners />} />
                <Route path="/partner/oem" element={<OemPartner />} />
                <Route path="/partner/channel" element={<ChannelPartner />} />
                <Route path="/partner/franchise" element={<FranchisePartner />} />
                <Route path="/investors" element={<Investers />} />
              </Routes>
            </main>

            <Footer />
          </div>
        } />
      </Routes>
      {/* 2. Main Application Wrapper (z-10) */}
      <div className="app-container relative z-10 bg-transparent min-h-screen flex flex-col">
        <Header />
        
        {/* Main Content Area */}
        <main className="main-content flex-grow">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/partner/oem" element={<OemPartner />} />
            <Route path="/partner/channel" element={<ChannelPartner />} />
            <Route path="/partner/franchise" element={<FranchisePartner />} />
            <Route path="/investors" element={<Investers />} />
            <Route path="/franchise/form" element={<FranchiseForm />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;