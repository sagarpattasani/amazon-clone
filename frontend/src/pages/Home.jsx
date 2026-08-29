import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI, categoryAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import './Home.css';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [deals, setDeals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      productAPI.getFeatured(),
      productAPI.getDeals(),
      categoryAPI.getCategories(),
      productAPI.getProducts({ sort: 'newest', size: 8 }),
    ]).then(([featuredRes, dealsRes, catRes, newRes]) => {
      if (featuredRes.status === 'fulfilled') setFeatured(featuredRes.value.data.data || []);
      if (dealsRes.status === 'fulfilled') setDeals(dealsRes.value.data.data || []);
      if (catRes.status === 'fulfilled') setCategories(catRes.value.data.data || []);
      if (newRes.status === 'fulfilled') setNewArrivals(newRes.value.data.data?.content || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="loading-spinner" />;

  return (
    <div className="home">
      {/* ── Hero Banner ── */}
      <div className="hero-banner">
        <div className="hero-content">
          <h1>Great Freedom Festival</h1>
          <p>Incredible deals on top brands</p>
          <Link to="/products?sort=discount" className="btn btn-primary btn-lg">Shop the Deals</Link>
        </div>
        <div className="hero-overlay" />
      </div>

      {/* ── Category Cards (overlapping hero) ── */}
      <div className="container">
        <div className="category-cards-grid">
          {categories.slice(0, 8).map(cat => (
            <Link key={cat.id} to={`/products?category=${cat.id}`} className="category-card">
              <h3>{cat.name}</h3>
              <div className="category-card-img">
                <img src={cat.imageUrl || `https://via.placeholder.com/300x200?text=${cat.name}`} alt={cat.name} />
              </div>
              <span className="category-card-link">See more</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Deals of the Day ── */}
      {deals.length > 0 && (
        <section className="home-section">
          <div className="container">
            <div className="section-header">
              <h2>Today's Deals</h2>
              <Link to="/products?sort=discount">See all deals</Link>
            </div>
            <div className="scroll-row">
              {deals.map(product => (
                <div key={product.id} className="scroll-item">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Products ── */}
      {featured.length > 0 && (
        <section className="home-section">
          <div className="container">
            <div className="section-header">
              <h2>Featured Products</h2>
              <Link to="/products">See more</Link>
            </div>
            <div className="product-grid">
              {featured.slice(0, 8).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── New Arrivals ── */}
      {newArrivals.length > 0 && (
        <section className="home-section">
          <div className="container">
            <div className="section-header">
              <h2>New Arrivals</h2>
              <Link to="/products?sort=newest">See more</Link>
            </div>
            <div className="scroll-row">
              {newArrivals.map(product => (
                <div key={product.id} className="scroll-item">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Promo Banners ── */}
      <section className="promo-section container">
        <div className="promo-grid">
          <div className="promo-card promo-electronics">
            <h3>Up to 60% off</h3>
            <p>Electronics & Accessories</p>
            <Link to="/products?category=1" className="btn btn-sm btn-secondary">Shop now</Link>
          </div>
          <div className="promo-card promo-fashion">
            <h3>Min. 50% off</h3>
            <p>Fashion & Clothing</p>
            <Link to="/products?category=2" className="btn btn-sm btn-secondary">Shop now</Link>
          </div>
          <div className="promo-card promo-home">
            <h3>Starting ₹199</h3>
            <p>Home & Kitchen</p>
            <Link to="/products?category=3" className="btn btn-sm btn-secondary">Shop now</Link>
          </div>
          <div className="promo-card promo-beauty">
            <h3>Under ₹499</h3>
            <p>Beauty & Health</p>
            <Link to="/products?category=6" className="btn btn-sm btn-secondary">Shop now</Link>
          </div>
        </div>
      </section>

      {/* ── Sign In Banner ── */}
      <section className="home-section">
        <div className="container">
          <div className="signin-banner">
            <h3>Sign in for the best experience</h3>
            <Link to="/login" className="btn btn-primary btn-lg">Sign in securely</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
