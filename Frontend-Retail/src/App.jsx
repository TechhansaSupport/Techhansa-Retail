import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Component/Layout/header';
import Footer from './Component/Layout/footer';
import Homepage from './Pages/homepage';
import About from './Pages/about';
import Contact from './Pages/contact';
import Partners from './Pages/partners';
import OemPartner from './Pages/Partners/OEM';
import ChannelPartner from './Pages/Partners/Channel';
import FranchisePartner from './Pages/Partners/Franchise';
import Investers from './Pages/investers';


function App() {
  return (
    <Router>
    

      {/* 2. Main Application Wrapper (z-10) */}
      {/* relative aur z-10 lagane se aapka content pattern ke upar aayega */}
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
    </Router>
  );
}

export default App;