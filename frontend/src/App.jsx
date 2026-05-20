import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Listings from './pages/Listings';
import ListingDetail from './pages/ListingDetail';
import AddListing from './pages/AddListing';
import Favorites from './pages/Favorites';
import Help from './pages/Help';
import StudentDashboard from './pages/StudentDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import DashboardBookings from './pages/DashboardBookings';
import DashboardPayments from './pages/DashboardPayments';
import DashboardMessages from './pages/DashboardMessages';
import DashboardSettings from './pages/DashboardSettings';

function Layout() {
  const location = useLocation();
  const hideNav = ['/login', '/register'].includes(location.pathname);
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      {!hideNav && !isDashboard && <Navbar />}
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/add-listing" element={<ProtectedRoute><AddListing /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
          <Route path="/help" element={<Help />} />
          <Route path="/dashboard/student" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/student/bookings" element={<ProtectedRoute><DashboardBookings role="student" /></ProtectedRoute>} />
          <Route path="/dashboard/student/payments" element={<ProtectedRoute><DashboardPayments role="student" /></ProtectedRoute>} />
          <Route path="/dashboard/student/messages" element={<ProtectedRoute><DashboardMessages role="student" /></ProtectedRoute>} />
          <Route path="/dashboard/student/settings" element={<ProtectedRoute><DashboardSettings role="student" /></ProtectedRoute>} />
          <Route path="/dashboard/owner" element={<ProtectedRoute><OwnerDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/owner/bookings" element={<ProtectedRoute><DashboardBookings role="owner" /></ProtectedRoute>} />
          <Route path="/dashboard/owner/payments" element={<ProtectedRoute><DashboardPayments role="owner" /></ProtectedRoute>} />
          <Route path="/dashboard/owner/messages" element={<ProtectedRoute><DashboardMessages role="owner" /></ProtectedRoute>} />
          <Route path="/dashboard/owner/settings" element={<ProtectedRoute><DashboardSettings role="owner" /></ProtectedRoute>} />
        </Routes>
      </main>
      {!hideNav && !isDashboard && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout />
        <Toaster
          position="top-right"
          toastOptions={{
            className: 'toast-custom',
            duration: 3000,
            style: { background: '#fff', color: '#0b1c30', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: '1px solid #c7c4d8', fontFamily: 'Inter, sans-serif', fontSize: '14px' },
            success: { iconTheme: { primary: '#3525cd', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ba1a1a', secondary: '#fff' } },
          }}
        />
      </AuthProvider>
    </Router>
  );
}
