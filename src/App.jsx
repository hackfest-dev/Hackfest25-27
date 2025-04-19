import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import Login from './components/auth/Login';
import AdminSignup from './components/auth/AdminSignup';
import ManagerDashboard from './components/dashboard/ManagerDashboard';
import SupplierDashboard from './components/dashboard/SupplierDashboard';
import WarehouseDashboard from './components/dashboard/WarehouseDashboard';
import NotAuthorized from './components/auth/NotAuthorized';
import LoadingSpinner from './components/common/LoadingSpinner';
import PrivateRoute from './components/auth/PrivateRoute';
import RouteOptimizer from './components/RouteOptimizer'
import ShipmentTracker from './components/ShipmentTracker'
import ChatSystem from './components/ChatSystem'
import HomePage from './components/HomePage'
import Header from './components/common/Header'
import ManufacturerDashboard from './components/dashboard/ManufacturerDashboard';
import DistributorDashboard from './components/dashboard/DistributorDashboard';
import RetailerDashboard from './components/dashboard/RetailerDashboard';
import BlockchainPage from './pages/BlockchainPage';
import ProductDetails from './components/blockchain/ProductDetails';
import ChatBot from './components/ChatBot';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role);
          } else {
            setUserRole(null);
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Header />
          <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
            <LoadingSpinner />
          </div>
        </div>
      </Router>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              user ? (
                userRole === 'supplier' ? <Navigate to="/supplier" /> :
                userRole === 'manufacturer' ? <Navigate to="/manufacturer" /> :
                userRole === 'distributor' ? <Navigate to="/distributor" /> :
                userRole === 'retailer' ? <Navigate to="/retailer" /> :
                <Navigate to="/login" />
              ) : (
                <HomePage />
              )
            } />
            
            <Route path="/login" element={
              user ? (
                userRole === 'supplier' ? <Navigate to="/supplier" /> :
                userRole === 'manufacturer' ? <Navigate to="/manufacturer" /> :
                userRole === 'distributor' ? <Navigate to="/distributor" /> :
                userRole === 'retailer' ? <Navigate to="/retailer" /> :
                <Navigate to="/login" />
              ) : (
                <Login />
              )
            } />
            
            <Route path="/admin/signup" element={!user ? <AdminSignup /> : <Navigate to="/" />} />
            <Route path="/not-authorized" element={<NotAuthorized />} />
            
            {/* Protected Chat Route */}
            <Route
              path="/chat"
              element={
                <PrivateRoute>
                  <div className="min-h-screen bg-gray-50 py-8">
                    <ChatBot />
                  </div>
                </PrivateRoute>
              }
            />

            <Route
              path="/blockchain"
              element={
                <PrivateRoute requiredRole={['manufacturer', 'distributor', 'retailer']}>
                  <BlockchainPage />
                </PrivateRoute>
              }
            />
            
            {/* Protected Routes */}
            <Route
              path="/manager/*"
              element={
                <PrivateRoute requiredRole="manager">
                  <ManagerDashboard />
                </PrivateRoute>
              }
            />
            
            <Route
              path="/supplier/*"
              element={
                <PrivateRoute requiredRole="supplier">
                  <SupplierDashboard />
                </PrivateRoute>
              }
            />
            
            <Route
              path="/warehouse/*"
              element={
                <PrivateRoute requiredRole="warehouse">
                  <WarehouseDashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/manufacturer/*"
              element={
                <PrivateRoute requiredRole="manufacturer">
                  <ManufacturerDashboard />
                </PrivateRoute>
              }
            />
            
            <Route
              path="/distributor/*"
              element={
                <PrivateRoute requiredRole="distributor">
                  <DistributorDashboard />
                </PrivateRoute>
              }
            />
            
            <Route
              path="/retailer/*"
              element={
                <PrivateRoute requiredRole="retailer">
                  <RetailerDashboard />
                </PrivateRoute>
              }
            />

            {/* Product Details Route */}
            <Route path="/product/:productId" element={<ProductDetails />} />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
