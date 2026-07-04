import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Checkout.css';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [shipping, setShipping] = useState({
    fullName: user?.name || '', street: '', city: '', state: '', zip: '', country: ''
  });
  const [payment, setPayment] = useState({ cardNumber: '', expiry: '', cvv: '', cardName: '' });

  const shippingCost = cartTotal > 50 ? 0 : 9.99;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shippingCost + tax;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const items = cart.map(i => ({
        product: i._id, name: i.name, image: i.images[0], price: i.price, quantity: i.quantity
      }));
      const { data } = await axios.post('/api/orders', {
        items, shippingAddress: shipping, paymentMethod,
        subtotal: cartTotal, shippingCost, tax, total
      });
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/orders/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container checkout-page">
      <h1>Checkout</h1>
      <div className="checkout-steps">
        <span className={step >= 1 ? 'active' : ''}>1. Shipping</span>
        <span className={step >= 2 ? 'active' : ''}>2. Payment</span>
        <span className={step >= 3 ? 'active' : ''}>3. Review</span>
      </div>

      <div className="checkout-layout">
        <div className="checkout-form-area">

          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="checkout-form">
              <h3>Shipping Address</h3>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" required value={shipping.fullName}
                  onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Street Address</label>
                <input className="form-input" required value={shipping.street}
                  onChange={(e) => setShipping({ ...shipping, street: e.target.value })} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input className="form-input" required value={shipping.city}
                    onChange={(e) => setShipping({ ...shipping, city: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input className="form-input" required value={shipping.state}
                    onChange={(e) => setShipping({ ...shipping, state: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">ZIP Code</label>
                  <input className="form-input" required value={shipping.zip}
                    onChange={(e) => setShipping({ ...shipping, zip: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input className="form-input" required value={shipping.country}
                    onChange={(e) => setShipping({ ...shipping, country: e.target.value })} />
                </div>
              </div>
              <button className="btn btn-primary btn-lg">Continue to Payment</button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={(e) => { e.preventDefault(); setStep(3); }} className="checkout-form">
              <h3>Payment Method</h3>

              <div className="payment-method-selector">
                <div
                  className={`payment-option ${paymentMethod === 'Card' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('Card')}
                >
                  <div className="payment-option-radio">
                    {paymentMethod === 'Card' && <div className="radio-dot" />}
                  </div>
                  <span className="payment-option-icon">&#128179;</span>
                  <div>
                    <strong>Pay by Card</strong>
                    <p>Credit or debit card</p>
                  </div>
                </div>

                <div
                  className={`payment-option ${paymentMethod === 'COD' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('COD')}
                >
                  <div className="payment-option-radio">
                    {paymentMethod === 'COD' && <div className="radio-dot" />}
                  </div>
                  <span className="payment-option-icon">&#128181;</span>
                  <div>
                    <strong>Cash on Delivery</strong>
                    <p>Pay when your order arrives</p>
                  </div>
                </div>
              </div>

              {paymentMethod === 'Card' && (
                <>
                  <p className="payment-note">This is a demo checkout - no real payment will be processed.</p>
                  <div className="form-group">
                    <label className="form-label">Cardholder Name</label>
                    <input className="form-input" required value={payment.cardName}
                      onChange={(e) => setPayment({ ...payment, cardName: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Card Number</label>
                    <input className="form-input" required placeholder="4242 4242 4242 4242" maxLength={19} value={payment.cardNumber}
                      onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })} />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Expiry</label>
                      <input className="form-input" required placeholder="MM/YY" value={payment.expiry}
                        onChange={(e) => setPayment({ ...payment, expiry: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">CVV</label>
                      <input className="form-input" required placeholder="123" maxLength={3} value={payment.cvv}
                        onChange={(e) => setPayment({ ...payment, cvv: e.target.value })} />
                    </div>
                  </div>
                </>
              )}

              {paymentMethod === 'COD' && (
                <div className="cod-notice">
                  <span>&#127968;</span>
                  <div>
                    <strong>Cash on Delivery selected</strong>
                    <p>Please have the exact amount ready when your order arrives. Our delivery agent will collect payment at your door.</p>
                  </div>
                </div>
              )}

              <div className="form-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>Back</button>
                <button className="btn btn-primary btn-lg">Review Order</button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handlePlaceOrder} className="checkout-form">
              <h3>Review Your Order</h3>
              <div className="review-block">
                <h4>Shipping to</h4>
                <p>{shipping.fullName}<br />{shipping.street}, {shipping.city}, {shipping.state} {shipping.zip}<br />{shipping.country}</p>
              </div>
              <div className="review-block">
                <h4>Payment</h4>
                <p>
                  {paymentMethod === 'COD'
                    ? 'Cash on Delivery - pay when order arrives'
                    : `Card ending in ${payment.cardNumber.slice(-4)}`}
                </p>
              </div>
              <div className="review-block">
                <h4>Items ({cart.length})</h4>
                {cart.map(item => (
                  <div key={item._id} className="review-item-row">
                    <span>{item.name} x {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setStep(2)}>Back</button>
                <button className="btn btn-primary btn-lg" disabled={loading}>
                  {loading ? 'Placing Order...' : `Place Order - $${total.toFixed(2)}`}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="checkout-summary">
          <h3>Order Summary</h3>
          {cart.map(item => (
            <div key={item._id} className="summary-item">
              <img src={item.images?.[0]} alt={item.name} />
              <div>
                <span className="summary-item-name">{item.name}</span>
                <span className="summary-item-qty">Qty: {item.quantity}</span>
              </div>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-row"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
          <div className="summary-row"><span>Shipping</span><span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span></div>
          <div className="summary-row"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
          <div className="summary-row total"><span>Total</span><span>${total.toFixed(2)}</span></div>
        </div>
      </div>
    </div>
  );
}