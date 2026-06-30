import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🛍️</span>
          <span className="logo-text">ShopNest</span>
        </Link>

        <form className="navbar-search" onSubmit={handleSearch}>
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-btn">Search</button>
        </form>

        <div className="navbar-actions">
          <Link to="/wishlist" className="nav-icon-btn" title="Wishlist">
            <span>♡</span>
            {wishlist.length > 0 && <span className="badge-count">{wishlist.length}</span>}
          </Link>

          <Link to="/cart" className="nav-icon-btn" title="Cart">
            <span>🛒</span>
            {cartCount > 0 && <span className="badge-count">{cartCount}</span>}
          </Link>

          {user ? (
            <div className="user-dropdown" ref={dropdownRef}>
              <button className="user-avatar-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <div className="avatar">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="user-name">{user.name?.split(' ')[0]}</span>
                <span className="chevron">{dropdownOpen ? '▲' : '▼'}</span>
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                  </div>
                  <Link to="/profile" className="dropdown-item">👤 My Profile</Link>
                  <Link to="/orders" className="dropdown-item">📦 My Orders</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="dropdown-item admin-link">⚙️ Admin Panel</Link>
                  )}
                  <div className="dropdown-divider" />
                  <button className="dropdown-item logout" onClick={logout}>🚪 Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}

          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Categories bar */}
      <div className="categories-bar">
        <div className="categories-container">
          {['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty'].map(cat => (
            <Link key={cat} to={`/products?category=${cat}`} className="cat-link">
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <form className="mobile-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">🔍</button>
          </form>
          <div className="mobile-links">
            <Link to="/products">All Products</Link>
            <Link to="/cart">🛒 Cart ({cartCount})</Link>
            <Link to="/wishlist">♡ Wishlist ({wishlist.length})</Link>
            {user ? (
              <>
                <Link to="/profile">👤 Profile</Link>
                <Link to="/orders">📦 Orders</Link>
                {user.role === 'admin' && <Link to="/admin">⚙️ Admin</Link>}
                <button onClick={logout} className="mobile-logout">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
