import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Component/Layout/header';
import Footer from './Component/Layout/footer';
import Homepage from './Pages/homepage';
import About from './Pages/about';
import Contact from './Pages/contact';
import Partners from './Pages/partners';
import Investers from './Pages/investers';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        
        {/* Main Content Area */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/investors" element={<Investers />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;