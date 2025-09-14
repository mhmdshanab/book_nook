import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { apiFetch } from '../api/client';

const Cart = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) fetchCartItems();
    else setLoading(false);
  }, [user]);

  const fetchCartItems = async () => {
    setError('');
    try {
      const data = await apiFetch('/api/cart');
      const items = Array.isArray(data.items) ? data.items : [];
      // طبيع هيكل العنصر ليكون book بشكل مباشر
      const normalized = items.map((it) => ({
        book: it.bookId || it.book || {},
        quantity: it.quantity || 1
      }));
      setCartItems(normalized);
    } catch (err) {
      setError(err.message || 'Failed to load cart items');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (bookId) => {
    setError('');
    try {
      await apiFetch(`/api/cart/item/${bookId}`, { method: 'DELETE' });
      setCartItems(prev => prev.filter(item => (item.book._id || item.book.id) !== bookId));
    } catch (err) {
      setError(err.message || 'Failed to remove item from cart');
    }
  };

  const updateQuantity = async (bookId, nextQuantity) => {
    const q = Number.isFinite(nextQuantity) ? Math.trunc(nextQuantity) : NaN;
    if (!Number.isFinite(q)) return;
    if (q <= 0) return removeFromCart(bookId);

    setError('');
    try {
      await apiFetch(`/api/cart/item/${bookId}`, { method: 'PUT', body: JSON.stringify({ quantity: q }) });
      await fetchCartItems();
    } catch (err) {
      setError(err.message || 'Failed to update quantity');
      await fetchCartItems();
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + Number(item.book?.price || 0) * Number(item.quantity || 0), 0
  );

  if (!user) {
    return (
      <section className="page-section">
        <div className="container">
          <div className="alert alert-danger text-center">❌ Please login to view your cart.</div>
          <div className="text-center"><Link to="/login" className="btn btn-primary">🔐 Login</Link></div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="page-section">
        <div className="container text-center">
          <div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>
        </div>
      </section>
    );
  }

  return (
    <section className="page-section">
      <div className="container">
        <h2 className="section-heading mb-4 text-center">
          <span className="site-heading-upper text-primary mb-3r">Your Shopping </span>
          <span className="site-heading-upper text-primary mb-3">Cart</span>
        </h2>

        {error && <div className="alert alert-danger">{error}</div>}

        {cartItems.length === 0 ? (
          <div className="text-center">
            <p className="site-heading-upper text-primary mb-3">Your cart is empty</p>
            <Link to="/products" className="btn btn-primary">Browse Books</Link>
          </div>
        ) : (
          <div className="row">
            <div className="col-lg-8">
              {cartItems.map((item) => (
                <div key={item.book._id} className="card mb-3">
                  <div className="card-body">
                    <div className="row align-items-center">
                      <div className="col-md-6">
                        <h5 className="card-title">{item.book.title}</h5>
                        <p className="card-text">${Number(item.book.price).toFixed(2)}</p>
                      </div>
                      <div className="col-md-3">
                        <div className="input-group">
                          <button className="btn btn-outline-secondary" disabled={Number(item.quantity) <= 1} onClick={() => updateQuantity(item.book._id || item.book.id, item.quantity - 1)}>-</button>
                          <input type="number" className="form-control text-center" value={item.quantity}
                                 onChange={(e) => updateQuantity(item.book._id || item.book.id, parseInt(e.target.value, 10))}
                                 min="1"/>
                          <button className="btn btn-outline-secondary" disabled={Number(item.book?.stock || 0) <= 0} onClick={() => updateQuantity(item.book._id || item.book.id, item.quantity + 1)}>+</button>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <p className="card-text fw-bold">
                          ${(Number(item.book.price) * Number(item.quantity)).toFixed(2)}
                        </p>
                      </div>
                      <div className="col-md-1">
                        <button className="btn btn-outline-danger btn-sm" onClick={() => removeFromCart(item.book._id || item.book.id)}>🗑️</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="col-lg-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Order Summary</h5>
                  <p className="card-text">Total: <strong>${totalPrice.toFixed(2)}</strong></p>
                  <button
                    className="btn btn-primary w-100 mb-2"
                    onClick={async () => {
                      try {
                        const data = await apiFetch('/api/payment/create-session', { method: 'POST' });
                        if (data?.url) {
                          window.location.href = data.url;
                        }
                      } catch (err) {
                        setError(err.message || 'Failed to create checkout session');
                      }
                    }}
                  >
                    Proceed to Checkout
                  </button>
                  <Link to="/products" className="btn btn-outline-secondary w-100">Show Books</Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Cart;
