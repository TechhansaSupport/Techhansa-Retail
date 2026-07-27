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
import Policies from './Pages/Policies';
import LoginPage from './Pages/LoginPage';
import PartnerApplicationPage from './Pages/Partners/partnerpage';

// --- Scroll To Hash / Top Component ---  
// Yeh component route change hone par instantly page ko top par bhej dega, ya hash par scroll karega
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100); // Small delay to let the page render first
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

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
                <Route path="/partnerpage" element={<PartnerApplicationPage />} />
                <Route path="/partner/channel" element={<ChannelPartner />} />
                <Route path="/partner/franchise" element={<FranchisePartner />} />
                <Route path="/investors" element={<Investers />} />
                <Route path="/policies" element={<Policies />} />
              </Routes>
            </main>

            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;