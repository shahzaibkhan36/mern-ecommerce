import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-col footer-brand">
          <div className="footer-logo">
            <span className="logo-icon">🛍️</span>
            <span className="logo-text">ShopNest</span>
          </div>
          <p>Curated goods, fair prices, and fast delivery — everything you need, all in one place.</p>
          <div className="social-links">
            <a href="/" aria-label="Facebook">📘</a>
            <a href="/" aria-label="Instagram">📷</a>
            <a href="/" aria-label="Twitter">🐦</a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Shop</h4>
          <Link to="/products">All Products</Link>
          <Link to="/products?category=Electronics">Electronics</Link>
          <Link to="/products?category=Clothing">Clothing</Link>
          <Link to="/products?sort=newest">New Arrivals</Link>
        </div>

        <div className="footer-col">
          <h4>Account</h4>
          <Link to="/profile">My Profile</Link>
          <Link to="/orders">Order History</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/cart">Shopping Cart</Link>
        </div>

        <div className="footer-col">
          <h4>Get in touch</h4>
          <p>support@shopnest.example</p>
          <p>+1 (555) 010-0199</p>
          <p>Mon–Fri, 9am–6pm</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} ShopNest. All rights reserved.</p>
        <p>Built with the MERN stack</p>
      </div>
    </footer>
  );
}
