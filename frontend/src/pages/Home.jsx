import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { productAPI, categoryAPI } from '../services/api';
import useRecentlyViewed from '../hooks/useRecentlyViewed';
import ProductCard from '../components/ProductCard';
import CountdownTimer from '../components/CountdownTimer';
import './Home.css';

const heroSlides = [
  {
    title: 'Great Freedom Festival',
    subtitle: 'Incredible deals on top brands — Up to 70% off',
    cta: 'Shop the Deals',
    link: '/products?sort=discount',
    gradient: 'linear-gradient(135deg, #131921 0%, #232f3e 40%, #37475a 70%, #f08804 100%)',
  },
  {
    title: 'Electronics Mega Sale',
    subtitle: 'Latest smartphones, laptops & accessories at best prices',
    cta: 'Explore Electronics',
    link: '/products?category=1',
    gradient: 'linear-gradient(135deg, #0a1628 0%, #1b3a5c 40%, #1b7acd 80%, #56b5c4 100%)',
  },
  {
    title: 'Fashion Fiesta',
    subtitle: 'Trending styles from Nike, Levi\'s, Raymond & more',
    cta: 'Shop Fashion',
    link: '/products?category=2',
    gradient: 'linear-gradient(135deg, #1a0a1e 0%, #4a1942 40%, #cc0c39 80%, #ff6b6b 100%)',
  },
  {
    title: 'Home & Kitchen Deals',
    subtitle: 'Transform your space — Starting at ₹199',
    cta: 'Shop Now',
    link: '/products?category=3',
    gradient: 'linear-gradient(135deg, #0a1e0a 0%, #067d62 40%, #0f9b58 80%, #34d399 100%)',
  },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [deals, setDeals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { recentProducts } = useRecentlyViewed(null);
  const slideTimer = useRef(null);

  const goToSlide = useCallback((index) => {
    setCurrentSlide((index + heroSlides.length) % heroSlides.length);
  }, []);

  const nextSlide = useCallback(() => goToSlide(currentSlide + 1), [currentSlide, goToSlide]);
  const prevSlide = useCallback(() => goToSlide(currentSlide - 1), [currentSlide, goToSlide]);

  // Auto-rotate hero
  useEffect(() => {
    slideTimer.current = setInterval(nextSlide, 5000);
    return () => clearInterval(slideTimer.current);
  }, [nextSlide]);

  // Pause on hover
  const pauseSlider = () => clearInterval(slideTimer.current);
  const resumeSlider = () => {
    slideTimer.current = setInterval(nextSlide, 5000);
  };

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
      {/* ── Hero Carousel ── */}
      <div
        className="hero-carousel"
        onMouseEnter={pauseSlider}
        onMouseLeave={resumeSlider}
      >
        <div
          className="hero-slides"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {heroSlides.map((slide, i) => (
            <div key={i} className="hero-slide" style={{ background: slide.gradient }}>
              <div className="hero-content">
                <h1>{slide.title}</h1>
                <p>{slide.subtitle}</p>
                <Link to={slide.link} className="btn btn-primary btn-lg">{slide.cta}</Link>
              </div>
              <div className="hero-overlay" />
            </div>
          ))}
        </div>
        <button className="hero-arrow hero-arrow-left" onClick={prevSlide} aria-label="Previous slide">
          <FiChevronLeft size={32} />
        </button>
        <button className="hero-arrow hero-arrow-right" onClick={nextSlide} aria-label="Next slide">
          <FiChevronRight size={32} />
        </button>
        <div className="hero-indicators">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              className={`hero-dot ${i === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ── Category Cards ── */}
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

      {/* ── Deals of the Day — with Countdown ── */}
      {deals.length > 0 && (
        <section className="home-section">
          <div className="container">
            <div className="section-header">
              <div className="section-header-left">
                <h2>Today's Deals</h2>
                <CountdownTimer />
              </div>
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

      {/* ── Recently Viewed ── */}
      {recentProducts.length > 0 && (
        <section className="home-section">
          <div className="container">
            <div className="section-header">
              <h2>Your Recently Viewed Items</h2>
            </div>
            <div className="scroll-row">
              {recentProducts.map(product => (
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
