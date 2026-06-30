import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState('description');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchProduct = () => {
    setLoading(true);
    axios.get(`/api/products/${id}`)
      .then(res => { setProduct(res.data); setActiveImg(0); setQuantity(1); })
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProduct(); }, [id]); // eslint-disable-line

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${quantity} × ${product.name} added to cart`);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.info('Please log in to leave a review');
    setSubmitting(true);
    try {
      await axios.post(`/api/products/${id}/reviews`, reviewForm);
      toast.success('Review submitted!');
      setReviewForm({ rating: 5, comment: '' });
      fetchProduct();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="spinner" />;
  if (!product) return <div className="container"><p>Product not found.</p></div>;

  const wishlisted = isWishlisted(product._id);

  return (
    <div className="container product-detail-page">
      <div className="breadcrumb">
        <Link to="/">Home</Link> / <Link to="/products">Products</Link> / <Link to={`/products?category=${product.category}`}>{product.category}</Link> / <span>{product.name}</span>
      </div>

      <div className="product-detail-grid">
        <div className="detail-images">
          <div className="main-image">
            <img src={product.images[activeImg]} alt={product.name} />
          </div>
          {product.images.length > 1 && (
            <div className="thumbnail-row">
              {product.images.map((img, i) => (
                <button key={i} className={`thumb ${activeImg === i ? 'active' : ''}`} onClick={() => setActiveImg(i)}>
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="detail-info">
          <span className="detail-brand">{product.brand}</span>
          <h1>{product.name}</h1>
          <div className="detail-rating">
            <span className="stars">{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
            <span>{product.rating.toFixed(1)} ({product.numReviews} reviews)</span>
            <span className="divider">|</span>
            <span className={product.stock > 0 ? 'in-stock' : 'no-stock'}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <div className="detail-price">
            <span className="price">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <>
                <span className="original-price">${product.originalPrice.toFixed(2)}</span>
                <span className="badge badge-success">
                  Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              </>
            )}
          </div>

          <p className="detail-desc">{product.description}</p>

          <div className="detail-actions">
            <div className="qty-selector">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
            </div>
            <button className="btn btn-primary btn-lg" onClick={handleAddToCart} disabled={product.stock === 0}>
              🛒 Add to Cart
            </button>
            <button className={`btn-wishlist-detail ${wishlisted ? 'active' : ''}`} onClick={() => toggleWishlist(product)}>
              {wishlisted ? '♥' : '♡'}
            </button>
          </div>

          <div className="detail-tags">
            {product.tags?.map(t => <span key={t} className="badge badge-primary">#{t}</span>)}
          </div>
        </div>
      </div>

      <div className="detail-tabs">
        <div className="tabs-nav">
          <button className={tab === 'description' ? 'active' : ''} onClick={() => setTab('description')}>Description</button>
          <button className={tab === 'reviews' ? 'active' : ''} onClick={() => setTab('reviews')}>Reviews ({product.numReviews})</button>
        </div>

        {tab === 'description' && (
          <div className="tab-content">
            <p>{product.description}</p>
          </div>
        )}

        {tab === 'reviews' && (
          <div className="tab-content">
            <form className="review-form" onSubmit={handleReviewSubmit}>
              <h4>Write a review</h4>
              <div className="rating-input">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n} type="button"
                    className={n <= reviewForm.rating ? 'star-active' : ''}
                    onClick={() => setReviewForm({ ...reviewForm, rating: n })}
                  >★</button>
                ))}
              </div>
              <textarea
                className="form-input"
                placeholder="Share your experience with this product..."
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                required
                rows={3}
              />
              <button className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>

            <div className="reviews-list">
              {product.reviews.length === 0 ? (
                <p className="no-reviews">No reviews yet. Be the first to share your thoughts!</p>
              ) : (
                product.reviews.slice().reverse().map((r, i) => (
                  <div key={i} className="review-item">
                    <div className="review-header">
                      <div className="avatar">{r.name?.charAt(0).toUpperCase()}</div>
                      <div>
                        <strong>{r.name}</strong>
                        <div className="stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                      </div>
                    </div>
                    <p>{r.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
