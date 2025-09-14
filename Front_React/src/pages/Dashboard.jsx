import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <section className="page-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="bg-faded rounded p-5 text-center">
              <h2 className="section-heading mb-4">
                <span className="section-heading-upper">Welcome Back</span>
                <span className="section-heading-lower">{user?.firstName || user?.username || 'Reader'}</span>
              </h2>

              <p className="lead mb-4">Browse books, manage your cart, and enjoy reading!</p>

              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Link to="/products" className="btn btn-outline-success">📚 View Books</Link>
                <Link to="/cart" className="btn btn-outline-warning">🛒 Your Cart</Link>
                <button onClick={logout} className="btn btn-outline-danger">🔐 Logout</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
