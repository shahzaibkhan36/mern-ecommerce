import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './Home.css';

const categories = [
  { name: 'Electronics', icon: '📱', color: '#6C63FF' },
  { name: 'Clothing', icon: '👕', color: '#FF6584' },
  { name: 'Books', icon: '📚', color: '#10B981' },
  { name: 'Home & Garden', icon: '🏡', color: '#F59E0B' },
  { name: 'Sports', icon: '⚽', color: '#3B82F6' },
  { name: 'Beauty', icon: '💄', color: '#EC4899' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/products/featured')
      .then(res => setFeatured(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-text">
            <span className="hero-eyebrow">New Season Arrivals</span>
            <h1>Find things<br />you'll <span className="highlight">actually love</span></h1>
            <p>Carefully chosen products, honest prices, and shipping that doesn't keep you waiting. Start exploring our curated catalog.</p>
            <div className="hero-cta">
              <Link to="/products" className="btn btn-primary btn-lg">Shop Now</Link>
              <Link to="/products?sort=newest" className="btn btn-outline btn-lg">New Arrivals</Link>
            </div>
            <div className="hero-stats">
              <div><strong>50K+</strong><span>Happy customers</span></div>
              <div><strong>10K+</strong><span>Products</span></div>
              <div><strong>4.8★</strong><span>Average rating</span></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-blob" />
            <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=700&q=80" alt="Shopping" />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section categories-section">
        <div className="container">
          <h2 className="section-title">Shop by category</h2>
          <p className="section-sub">Jump straight to what you're looking for</p>
          <div className="category-grid">
            {categories.map(cat => (
              <Link key={cat.name} to={`/products?category=${cat.name}`} className="category-card" style={{ '--cat-color': cat.color }}>
                <span className="category-icon">{cat.icon}</span>
                <span className="category-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="section">
        <div className="container">
          <div className="section-header-row">
            <div>
              <h2 className="section-title">Featured products</h2>
              <p className="section-sub">Hand-picked favorites our customers love</p>
            </div>
            <Link to="/products" className="btn btn-ghost">View all →</Link>
          </div>
          {loading ? (
            <div className="spinner" />
          ) : (
            <div className="products-grid">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Promo banner */}
      <section className="promo-banner">
        <div className="container promo-content">
          <div>
            <span className="promo-eyebrow">Limited time</span>
            <h2>Up to 40% off select electronics</h2>
            <p>Premium audio, wearables, and smart home — while stocks last.</p>
            <Link to="/products?category=Electronics" className="btn btn-accent btn-lg">Shop the sale</Link>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="section trust-section">
        <div className="container trust-grid">
          <div className="trust-item"><span>🚚</span><div><strong>Free shipping</strong><p>On orders over $50</p></div></div>
          <div className="trust-item"><span>↩️</span><div><strong>Easy returns</strong><p>30-day return policy</p></div></div>
          <div className="trust-item"><span>🔒</span><div><strong>Secure checkout</strong><p>SSL encrypted payments</p></div></div>
          <div className="trust-item"><span>💬</span><div><strong>24/7 support</strong><p>We're here to help</p></div></div>
        </div>
      </section>
    </div>
  );
}
