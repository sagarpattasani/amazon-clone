import { Link } from 'react-router-dom';
import { FiUser, FiPackage, FiHeart, FiMapPin, FiLogOut } from 'react-icons/fi';
import useAuthStore from '../store/authStore';

export default function Account() {
  const { user, logout } = useAuthStore();

  const menuItems = [
    { icon: <FiPackage size={28} />, title: 'Your Orders', desc: 'Track, return, or buy things again', link: '/account/orders' },
    { icon: <FiUser size={28} />, title: 'Login & Security', desc: 'Edit name, email, phone, and password', link: '/account' },
    { icon: <FiMapPin size={28} />, title: 'Your Addresses', desc: 'Edit, remove or set default address', link: '/account' },
    { icon: <FiHeart size={28} />, title: 'Your Wishlist', desc: 'View your saved items', link: '/wishlist' },
  ];

  return (
    <div className="container" style={{ padding: '20px 16px', maxWidth: 960 }}>
      <h1 style={{ fontSize: 28, fontWeight: 400, marginBottom: 24 }}>Your Account</h1>

      {user && (
        <div className="card" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16, padding: 20 }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--amazon-dark-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 24, fontWeight: 700 }}>
            {user.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: 20 }}>{user.name}</h2>
            <p style={{ fontSize: 14, color: '#555' }}>{user.email}</p>
            {user.phone && <p style={{ fontSize: 13, color: '#555' }}>{user.phone}</p>}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {menuItems.map((item, i) => (
          <Link key={i} to={item.link} className="card" style={{ display: 'flex', gap: 16, padding: 20, color: 'var(--amazon-text)', textDecoration: 'none' }}>
            <div style={{ color: 'var(--amazon-blue)' }}>{item.icon}</div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>{item.title}</h3>
              <p style={{ fontSize: 13, color: '#555' }}>{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <button onClick={logout} className="btn btn-secondary" style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
        <FiLogOut size={16} /> Sign Out
      </button>
    </div>
  );
}
