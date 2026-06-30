import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product._id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product);
    toast.info(wishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <Link to={`/products/${product._id}`} className="product-card card">
      <div className="product-image-wrap">
        <img src={product.images?.[0]} alt={product.name} loading="lazy" />
        {discount > 0 && <span className="discount-badge">-{discount}%</span>}
        <button
          className={`wishlist-btn ${wishlisted ? 'active' : ''}`}
          onClick={handleWishlist}
          aria-label="Toggle wishlist"
        >
          {wishlisted ? '♥' : '♡'}
        </button>
        {product.stock === 0 && <div className="out-of-stock-overlay">Out of Stock</div>}
      </div>
      <div className="product-info">
        <span className="product-brand">{product.brand}</span>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-rating">
          <span className="stars">{'★'.repeat(Math.round(product.rating || 0))}{'☆'.repeat(5 - Math.round(product.rating || 0))}</span>
          <span className="rating-count">({product.numReviews || 0})</span>
        </div>
        <div className="product-price-row">
          <div className="price-group">
            <span className="price">${product.price.toFixed(2)}</span>
            {product.originalPrice && <span className="original-price">${product.originalPrice.toFixed(2)}</span>}
          </div>
          <button
            className="add-cart-btn"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            aria-label="Add to cart"
          >
            +
          </button>
        </div>
      </div>
    </Link>
  );
}
