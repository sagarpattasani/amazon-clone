import { useState, useEffect } from 'react';
import { FiPackage, FiShoppingBag, FiDollarSign, FiStar, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import ProductCard from '../components/ProductCard';
import './AdminDashboard.css';

export default function SellerDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [registerForm, setRegisterForm] = useState({ businessName: '', gstNumber: '', description: '' });
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.role === 'SELLER' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') {
      api.get('/api/seller/dashboard').then(res => {
        setDashboard(res.data.data);
        setLoading(false);
      }).catch(() => { setShowRegister(true); setLoading(false); });
    } else {
      setShowRegister(true);
      setLoading(false);
    }
  }, [user]);

  const loadProducts = (page = 0) => {
    api.get(`/api/seller/products?page=${page}`).then(res => setProducts(res.data.data)).catch(() => {});
  };

  const loadOrders = (page = 0) => {
    api.get(`/api/seller/orders?page=${page}`).then(res => setOrders(res.data.data)).catch(() => {});
  };

  useEffect(() => {
    if (activeTab === 'products') loadProducts();
    if (activeTab === 'orders') loadOrders();
  }, [activeTab]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/seller/register', registerForm);
      toast.success('Seller registration successful! Please re-login.');
      setShowRegister(false);
      window.location.reload();
    } catch (err) { toast.error(err.response?.data?.message || 'Registration failed'); }
  };

  if (loading) return <div className="loading-spinner" />;

  if (showRegister) return (
    <div className="container" style={{ padding: '40px 16px', maxWidth: 500 }}>
      <div className="card">
        <h1 style={{ fontSize: 24, marginBottom: 16 }}>Become a Seller</h1>
        <p style={{ color: '#555', marginBottom: 20 }}>Register your business to start selling on Amazon Clone.</p>
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label>Business Name</label>
            <input value={registerForm.businessName} onChange={e => setRegisterForm({...registerForm, businessName: e.target.value})} required />
          </div>
          <div className="input-group">
            <label>GST Number</label>
            <input value={registerForm.gstNumber} onChange={e => setRegisterForm({...registerForm, gstNumber: e.target.value})} placeholder="Optional" />
          </div>
          <div className="input-group">
            <label>Business Description</label>
            <textarea value={registerForm.description} onChange={e => setRegisterForm({...registerForm, description: e.target.value})} rows={3} />
          </div>
          <button type="submit" className="btn btn-primary btn-full btn-lg">Register as Seller</button>
        </form>
      </div>
    </div>
  );

  const stats = [
    { icon: <FiPackage size={28} />, label: 'Total Products', value: dashboard?.totalProducts || 0, color: '#1b7acd' },
    { icon: <FiShoppingBag size={28} />, label: 'Total Orders', value: dashboard?.totalOrders || 0, color: '#ff9900' },
    { icon: <FiDollarSign size={28} />, label: 'Total Earnings', value: `₹${(dashboard?.totalEarnings || 0).toLocaleString()}`, color: '#067d62' },
    { icon: <FiStar size={28} />, label: 'Rating', value: dashboard?.rating || '0.0', color: '#f0ad4e' },
  ];

  return (
    <div className="admin-page container">
      <h1>Seller Dashboard</h1>

      <div className="admin-tabs">
        {['overview', 'products', 'orders'].map(tab => (
          <button key={tab} className={`admin-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="stats-grid">
            {stats.map((stat, i) => (
              <div key={i} className="stat-card card" style={{ borderLeft: `4px solid ${stat.color}` }}>
                <div className="stat-icon" style={{ color: stat.color }}>{stat.icon}</div>
                <div>
                  <p className="stat-label">{stat.label}</p>
                  <p className="stat-value">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="card" style={{ marginTop: 20 }}>
            <h3 style={{ marginBottom: 16 }}>Recent Orders</h3>
            <table className="admin-table">
              <thead><tr><th>Order #</th><th>Product</th><th>Qty</th><th>Total</th><th>Status</th></tr></thead>
              <tbody>
                {(dashboard?.recentOrders || []).map((o, i) => (
                  <tr key={i}>
                    <td>{o.orderNumber}</td>
                    <td>{o.productTitle}</td>
                    <td>{o.quantity}</td>
                    <td>₹{Number(o.total).toLocaleString()}</td>
                    <td><span className={`status-badge status-${o.status?.toLowerCase()}`}>{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'products' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3>My Products ({products?.totalElements || 0})</h3>
          </div>
          <div className="product-grid">
            {(products?.content || []).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>My Orders ({orders?.totalElements || 0})</h3>
          <table className="admin-table">
            <thead><tr><th>Order #</th><th>Customer</th><th>Product</th><th>Qty</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>
              {(orders?.content || []).map(o => (
                <tr key={o.id}>
                  <td>{o.orderNumber}</td>
                  <td>{o.customerName}</td>
                  <td>{o.productTitle}</td>
                  <td>{o.quantity}</td>
                  <td>₹{Number(o.total).toLocaleString()}</td>
                  <td><span className={`status-badge status-${o.status?.toLowerCase()}`}>{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
