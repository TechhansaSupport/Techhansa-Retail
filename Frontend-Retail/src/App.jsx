import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';

// --- Auth Context ---
import { AuthContext, AuthProvider } from './context/AuthContext';

// --- Public Website Layout & Pages ---
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

// --- Portal Dashboard Pages ---
import AdminDashboard from './portal/Admin/Components/Admin';
import FranchiseDashboard from './portal/franchiseportal/Components/Layout/franchiseowner';
import ChannelLayout from './portal/chnnelportal/Layout';
import ChannelDashboard from './portal/chnnelportal/Dashboard';
import CreateRFP from './portal/chnnelportal/CreateRFP';


// --- Scroll To Hash / Top Component ---  
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
      }, 100); 
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

// --- Role-Based Protection Wrapper ---
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  
  // If not logged in, redirect to login page
  if (!user) return <Navigate to="/login" replace />;
  
  // If logged in but trying to access the wrong portal
  if (user.role !== allowedRole) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h2 className="text-2xl font-bold text-red-600">Unauthorized: You do not have permission to view this portal.</h2>
      </div>
    );
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />

      <Routes>
        {/* ==========================================
            1. STANDALONE ROUTES (No Headers/Footers)
            ========================================== */}
        <Route path="/login" element={<LoginPage />} />

        {/* ==========================================
            2. SECURE PORTAL ROUTES (Role Protected)
            ========================================== */}
        
        {/* Admin Portal */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRole="admin">
            <Outlet />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          {/* Add more admin routes here later: <Route path="users" element={<UsersPage />} /> */}
        </Route>

        {/* Franchise Portal */}
        <Route path="/franchise" element={
          <ProtectedRoute allowedRole="franchise">
            <Outlet />
          </ProtectedRoute>
        }>
          <Route index element={<FranchiseDashboard />} />
        </Route>

        {/* Channel Partner Portal */}
        <Route path="/channel" element={
          <ProtectedRoute allowedRole="channel">
            <ChannelLayout />
          </ProtectedRoute>
        }>
          <Route index element={<ChannelDashboard />} />
          <Route path="rfp/create" element={<CreateRFP />} />
        </Route>


        {/* ==========================================
            3. PUBLIC WEBSITE ROUTES (With Header & Footer)
            ========================================== */}
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
    </AuthProvider>
  );
}

export default App;