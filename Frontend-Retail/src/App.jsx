import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Component/Layout/header';
import Footer from './Component/Layout/footer';
import Homepage from './Pages/homepage';
import About from './Pages/about';
import Contact from './Pages/contact';
import Partners from './Pages/partners';
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
            <Route path="/investors" element={<Investers />} />
            <Route path="/arpit" element={
              <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-5xl font-bold text-blue-600">from arpit</h1>
              </div>
            } />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;