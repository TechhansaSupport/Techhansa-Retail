import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';

// --- Auth Context ---
import { AuthContext, AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

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
import AdminLayout from './portal/Admin/Layout/AdminLayout';
import AdminDashboard from './portal/Admin/Pages/Dashboard';
import EntityManagement from './portal/Admin/Pages/EntityManagement';
import CentralCatalog from './portal/Admin/Pages/CentralCatalog';
import AuditLogs from './portal/Admin/Pages/AuditLogs';
import FranchiseLayout from './portal/franchiseportal/storeadmin/Layout/FranchiseLayout';
import FranchiseDashboard from './portal/franchiseportal/storeadmin/Pages/Dashboard';
import FranchiseProfile from './portal/franchiseportal/storeadmin/Pages/StoreProfile';
import FranchiseInventory from './portal/franchiseportal/storeadmin/Pages/Inventory';
import FranchiseCart from './portal/franchiseportal/storeadmin/Pages/Cart';
import FranchiseSales from './portal/franchiseportal/storeadmin/Pages/Sales';
import FranchiseBilling from './portal/franchiseportal/storeadmin/Pages/Billing';
import Procurement from './portal/franchiseportal/storeadmin/Pages/Procurement';
import Wallet from './portal/franchiseportal/storeadmin/Pages/Wallet';
import Employees from './portal/franchiseportal/storeadmin/Pages/Employees';
import { FranchiseProvider } from './portal/franchiseportal/storeadmin/context/FranchiseContext';
import EmployeeLayout from './portal/franchiseportal/employeeportal/Layout/EmployeeLayout';
import EmployeeDashboard from './portal/franchiseportal/employeeportal/Pages/Dashboard';
import EmployeeBilling from './portal/franchiseportal/employeeportal/Pages/Billing';
import EmployeeCart from './portal/franchiseportal/employeeportal/Pages/Cart';
import EmployeeInventory from './portal/franchiseportal/employeeportal/Pages/Inventory';
import EmployeeOrders from './portal/franchiseportal/employeeportal/Pages/Orders';
import { EmployeeProvider } from './portal/franchiseportal/employeeportal/context/EmployeeContext';
import ChannelLayout from './portal/chnnelportal/Layout';
import ChannelDashboard from './portal/chnnelportal/Dashboard';
import CreateRFP from './portal/chnnelportal/CreateRFP';
import RfpManagement from './portal/chnnelportal/Pages/RfpManagement';
import Quotations from './portal/chnnelportal/Pages/Quotations';
import Checkout from './portal/chnnelportal/Pages/Checkout';
import Orders from './portal/chnnelportal/Pages/Orders';
import CreditHistory from './portal/chnnelportal/Pages/CreditHistory';
import DeliveryTracking from './portal/chnnelportal/Pages/DeliveryTracking';
import Reports from './portal/chnnelportal/Pages/Reports';
import SupportCenter from './portal/chnnelportal/Pages/SupportCenter';
import Profile from './portal/chnnelportal/Pages/Profile';
import Settings from './portal/chnnelportal/Pages/Settings';
import Invoices from './portal/chnnelportal/Pages/Invoices';


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
      <Toaster position="top-right" />
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
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="entities" element={<EntityManagement />} />
            <Route path="catalog" element={<CentralCatalog />} />
            <Route path="audit" element={<AuditLogs />} />
          </Route>

          {/* Franchise Portal */}
          <Route path="/franchise" element={
            <ProtectedRoute allowedRole="franchise">
              <FranchiseProvider>
                <FranchiseLayout />
              </FranchiseProvider>
            </ProtectedRoute>
          }>
            <Route index element={<FranchiseDashboard />} />
            <Route path="billing" element={<FranchiseBilling />} />
            <Route path="cart" element={<FranchiseCart />} />
            <Route path="profile" element={<FranchiseProfile />} />
            <Route path="inventory" element={<FranchiseInventory />} />
            <Route path="sales" element={<FranchiseSales />} />
            <Route path="procurement" element={<Procurement />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="employees" element={<Employees />} />
          </Route>

          {/* Employee Portal */}
          <Route path="/employee" element={
            <ProtectedRoute allowedRole="employee">
              <EmployeeProvider>
                <EmployeeLayout />
              </EmployeeProvider>
            </ProtectedRoute>
          }>
            <Route index element={<EmployeeDashboard />} />
            <Route path="billing" element={<EmployeeBilling />} />
            <Route path="cart" element={<EmployeeCart />} />
            <Route path="inventory" element={<EmployeeInventory />} />
            <Route path="orders" element={<EmployeeOrders />} />
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
          {/* Channel Partner Portal */}
          <Route path="/channel" element={
            <ProtectedRoute allowedRole="channel">
              <ChannelLayout />
            </ProtectedRoute>
          }>
            <Route index element={<ChannelDashboard />} />
            <Route path="rfp" element={<RfpManagement />} />
            <Route path="rfp/create" element={<CreateRFP />} />
            <Route path="quotations" element={<Quotations />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="credit-history" element={<CreditHistory />} />
            <Route path="orders" element={<Orders />} />
            <Route path="tracking" element={<DeliveryTracking />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="reports" element={<Reports />} />
            <Route path="support" element={<SupportCenter />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
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