import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiShoppingBag, FiPackage, FiDollarSign, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../services/api';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [returns, setReturns] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/admin/dashboard').then(res => {
      setDashboard(res.data.data);
      setLoading(false);
    }).catch(err => { toast.error('Failed to load dashboard'); setLoading(false); });
  }, []);

  const loadUsers = (page = 0) => {
    api.get(`/api/admin/users?page=${page}&size=20`).then(res => setUsers(res.data.data)).catch(() => {});
  };

  const loadOrders = (page = 0) => {
    api.get(`/api/admin/orders?page=${page}&size=20`).then(res => setOrders(res.data.data)).catch(() => {});
  };

  const loadReturns = (page = 0) => {
    api.get(`/api/admin/returns?page=${page}&size=20`).then(res => setReturns(res.data.data)).catch(() => {});
  };

  useEffect(() => {
    if (activeTab === 'users') loadUsers();
    if (activeTab === 'orders') loadOrders();
    if (activeTab === 'returns') loadReturns();
  }, [activeTab]);

  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/api/admin/orders/${orderId}/status`, { status });
      toast.success('Order status updated');
      loadOrders();
    } catch (err) { toast.error('Failed to update'); }
  };

  const processReturn = async (returnId, action) => {
    try {
      await api.put(`/api/admin/returns/${returnId}/process`, { action });
      toast.success(`Return ${action.toLowerCase()}d`);
      loadReturns();
    } catch (err) { toast.error('Failed'); }
  };

  const toggleUserStatus = async (userId) => {
    try {
      await api.put(`/api/admin/users/${userId}/toggle-status`);
      toast.success('User status updated');
      loadUsers();
    } catch (err) { toast.error('Failed'); }
  };

  if (loading) return <div className="loading-spinner" />;

  const stats = [
    { icon: <FiUsers size={28} />, label: 'Total Users', value: dashboard?.totalUsers || 0, color: '#1b7acd' },
    { icon: <FiShoppingBag size={28} />, label: 'Total Orders', value: dashboard?.totalOrders || 0, color: '#ff9900' },
    { icon: <FiPackage size={28} />, label: 'Products', value: dashboard?.totalProducts || 0, color: '#067d62' },
    { icon: <FiDollarSign size={28} />, label: 'Total Revenue', value: `₹${(dashboard?.totalRevenue || 0).toLocaleString()}`, color: '#cc0c39' },
    { icon: <FiTrendingUp size={28} />, label: "Today's Revenue", value: `₹${(dashboard?.todayRevenue || 0).toLocaleString()}`, color: '#7b2d8e' },
    { icon: <FiAlertCircle size={28} />, label: 'Pending Orders', value: dashboard?.pendingOrders || 0, color: '#f0ad4e' },
  ];

  return (
    <div className="admin-page container">
      <h1>Admin Dashboard</h1>

      {/* Tabs */}
      <div className="admin-tabs">
        {['overview', 'users', 'orders', 'returns'].map(tab => (
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
              <thead>
                <tr><th>Order #</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr>
              </thead>
              <tbody>
                {(dashboard?.recentOrders || []).map((o, i) => (
                  <tr key={i}>
                    <td>{o.orderNumber}</td>
                    <td>{o.userName}</td>
                    <td>₹{Number(o.total).toLocaleString()}</td>
                    <td><span className={`status-badge status-${o.status?.toLowerCase()}`}>{o.status}</span></td>
                    <td>{new Date(o.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'users' && (
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>All Users ({users?.totalElements || 0})</h3>
          <table className="admin-table">
            <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Active</th><th>Actions</th></tr></thead>
            <tbody>
              {(users?.content || []).map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className="badge">{u.role}</span></td>
                  <td>{u.isActive ? '✅' : '❌'}</td>
                  <td><button className="btn btn-sm btn-secondary" onClick={() => toggleUserStatus(u.id)}>Toggle</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>All Orders ({orders?.totalElements || 0})</h3>
          <table className="admin-table">
            <thead><tr><th>Order #</th><th>Customer</th><th>Total</th><th>Status</th><th>Payment</th><th>Actions</th></tr></thead>
            <tbody>
              {(orders?.content || []).map(o => (
                <tr key={o.id}>
                  <td>{o.orderNumber}</td>
                  <td>{o.userName}</td>
                  <td>₹{Number(o.total).toLocaleString()}</td>
                  <td><span className={`status-badge status-${o.status?.toLowerCase()}`}>{o.status}</span></td>
                  <td>{o.paymentStatus}</td>
                  <td>
                    <select defaultValue="" onChange={(e) => { if (e.target.value) updateOrderStatus(o.id, e.target.value); }}
                      style={{ fontSize: 12, padding: '4px 8px' }}>
                      <option value="" disabled>Update</option>
                      {['CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].map(s => (
                        <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'returns' && (
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Return Requests ({returns?.totalElements || 0})</h3>
          <table className="admin-table">
            <thead><tr><th>ID</th><th>Product</th><th>Reason</th><th>Status</th><th>Refund</th><th>Actions</th></tr></thead>
            <tbody>
              {(returns?.content || []).map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.productTitle}</td>
                  <td>{r.reason}</td>
                  <td><span className={`status-badge status-${r.status?.toLowerCase()}`}>{r.status}</span></td>
                  <td>₹{r.refundAmount?.toLocaleString()}</td>
                  <td>
                    {r.status === 'REQUESTED' && (
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-sm btn-primary" onClick={() => processReturn(r.id, 'APPROVE')}>Approve</button>
                        <button className="btn btn-sm btn-danger" onClick={() => processReturn(r.id, 'REJECT')}>Reject</button>
                      </div>
                    )}
                    {r.status === 'APPROVED' && (
                      <button className="btn btn-sm btn-primary" onClick={() => processReturn(r.id, 'COMPLETE')}>Complete Refund</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
