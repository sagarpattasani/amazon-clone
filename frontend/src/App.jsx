import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { FiX } from 'react-icons/fi';
import { lazy, Suspense, useEffect } from 'react';
import useAuthStore from './store/authStore';
import useComparisonStore from './store/comparisonStore';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import OfflineBanner from './components/OfflineBanner';
import './App.css';

// ── Lazy-loaded Pages (Code Splitting) ──
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ProductList = lazy(() => import('./pages/ProductList'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const CartPage = lazy(() => import('./pages/CartPage'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderDetail = lazy(() => import('./pages/OrderDetail'));
const Account = lazy(() => import('./pages/Account'));
const ProfileEdit = lazy(() => import('./pages/ProfileEdit'));
const AddressBook = lazy(() => import('./pages/AddressBook'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const ReturnRequest = lazy(() => import('./pages/ReturnRequest'));
const ComparisonPage = lazy(() => import('./pages/ComparisonPage'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const SellerDashboard = lazy(() => import('./pages/SellerDashboard'));
import ScrollToTop from './components/ScrollToTop';

// ── Page Loading Fallback ──
function PageLoader() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '80px 20px', minHeight: '50vh',
    }}>
      <div className="loading-spinner" />
    </div>
  );
}

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN') return <Navigate to="/" />;
  return children;
}

function FloatingCompareBar() {
  const { items, removeItem, clearAll } = useComparisonStore();
  if (items.length === 0) return null;
  return (
    <div className="compare-float-bar">
      <div className="compare-float-items">
        {items.map((p) => (
          <div key={p.id} className="compare-float-item">
            <img src={p.primaryImage || ''} alt="" />
            <span>{p.title?.slice(0, 25)}...</span>
            <button onClick={() => removeItem(p.id)}><FiX size={14} /></button>
          </div>
        ))}
      </div>
      <div className="compare-float-actions">
        <Link to="/compare" className="btn btn-primary btn-sm">Compare ({items.length})</Link>
        <button className="btn btn-secondary btn-sm" onClick={clearAll}>Clear</button>
      </div>
    </div>
  );
}

function RouteScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <RouteScrollToTop />
        <OfflineBanner />
        <Toaster position="top-center" toastOptions={{
          style: { fontFamily: 'Inter, sans-serif', fontSize: '14px' },
          success: { duration: 3000 },
          error: { duration: 4000 },
        }} />
        <div className="app">
          <Header />
          <main className="main-content">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/search" element={<ProductList />} />
                <Route path="/category/:slug" element={<ProductList />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/compare" element={<ComparisonPage />} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/account/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                <Route path="/account/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
                <Route path="/account/orders/:id/return" element={<ProtectedRoute><ReturnRequest /></ProtectedRoute>} />
                <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
                <Route path="/account/profile" element={<ProtectedRoute><ProfileEdit /></ProtectedRoute>} />
                <Route path="/account/addresses" element={<ProtectedRoute><AddressBook /></ProtectedRoute>} />
                <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/seller" element={<ProtectedRoute><SellerDashboard /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <FloatingCompareBar />
          <ScrollToTop />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
