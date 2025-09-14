import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const Home = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <section className="page-section">
        <div className="container text-center">
          <div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>
        </div>
      </section>
    );
  }

  if (user) {
    return <Navigate to={(user.role === 'admin') ? '/admin' : '/dashboard'} replace />;
  }

  // ... محتوى الهوم للزائر
  return (
    <>
      {/* نفس محتوى Home العادي عندك */}
      <section className="page-section clearfix">
        <div className="container">
          <div className="intro">
            <img className="intro-img img-fluid mb-3 mb-lg-0 rounded" src="/assets/img/intro.png?v=3" alt="..." />
            <div className="intro-text left-0 text-center bg-faded p-5 rounded">
              <h2 className="section-heading mb-4">
                <span className="section-heading-upper">New Arrivals</span>
                <span className="section-heading-lower">Stories Worth Reading</span>
              </h2>
              <p className="mb-3">Discover a curated selection of books…</p>
              <div className="intro-button mx-auto">
                <Link className="btn btn-primary btn-xl" to="/products">Browse Books</Link>
              </div>
              <div className="intro-buttons mt-3">
                <Link className="btn btn-outline-secondary btn-lg me-3" to="/login">Login</Link>
                <Link className="btn btn-outline-secondary btn-lg" to="/register">Sign Up</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
