import { Link } from 'react-router-dom';
import { FiUser, FiPackage, FiHeart, FiMapPin, FiLogOut, FiShield } from 'react-icons/fi';
import useAuthStore from '../store/authStore';
import './Account.css';

export default function Account() {
  const { user, logout } = useAuthStore();

  const menuItems = [
    { icon: <FiPackage size={28} />, title: 'Your Orders', desc: 'Track, return, or buy things again', link: '/account/orders' },
    { icon: <FiShield size={28} />, title: 'Login & Security', desc: 'Edit name, email, phone, and password', link: '/account/profile' },
    { icon: <FiMapPin size={28} />, title: 'Your Addresses', desc: 'Edit, remove or set default address', link: '/account/addresses' },
    { icon: <FiHeart size={28} />, title: 'Your Wishlist', desc: 'View your saved items', link: '/wishlist' },
  ];

  return (
    <div className="account-page container">
      <h1>Your Account</h1>

      {user && (
        <div className="account-profile-banner card">
          <div className="account-avatar">
            {user.name?.[0]?.toUpperCase()}
          </div>
          <div className="account-user-details">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            {user.phone && <p className="account-phone">{user.phone}</p>}
          </div>
        </div>
      )}

      <div className="account-menu-grid">
        {menuItems.map((item, i) => (
          <Link key={i} to={item.link} className="account-menu-card card">
            <div className="account-menu-icon">{item.icon}</div>
            <div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <button onClick={logout} className="btn btn-secondary account-signout">
        <FiLogOut size={16} /> Sign Out
      </button>
    </div>
  );
}
