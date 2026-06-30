import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import './Wishlist.css';

export default function Wishlist() {
  const { wishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="container empty-wishlist">
        <span>♡</span>
        <h2>Your wishlist is empty</h2>
        <p>Save items you love by tapping the heart icon.</p>
        <Link to="/products" className="btn btn-primary btn-lg">Discover Products</Link>
      </div>
    );
  }

  return (
    <div className="container wishlist-page">
      <h1>My Wishlist</h1>
      <p className="wishlist-count">{wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved</p>
      <div className="products-grid">
        {wishlist.map(p => <ProductCard key={p._id} product={p} />)}
      </div>
    </div>
  );
}
