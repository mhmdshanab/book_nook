import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const role = user?.role ? String(user.role).toLowerCase() : null;

  return (
    <>
      <header>
        <h1 className="site-heading text-center text-faded d-none d-lg-block">
          <span className="site-heading-upper text-primary mb-3">Your Neighborhood Bookstore</span>
          <span className="site-heading-lower">Book Nook</span>
        </h1>
      </header>

      <nav className="navbar navbar-expand-lg navbar-dark py-lg-4" id="mainNav">
        <div className="container">
          <Link className="navbar-brand text-uppercase fw-bold d-lg-none" to="/">Book Nook</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item px-lg-4">
                <Link className={`nav-link text-uppercase ${location.pathname === '/' ? 'active' : ''}`} to="/">Home</Link>
              </li>
              <li className="nav-item px-lg-4">
                <Link className={`nav-link text-uppercase ${location.pathname === '/about' ? 'active' : ''}`} to="/about">About</Link>
              </li>
              <li className="nav-item px-lg-4">
                <Link className={`nav-link text-uppercase ${location.pathname === '/products' ? 'active' : ''}`} to="/products">View Books</Link>
              </li>
              <li className="nav-item px-lg-4">
                <Link className={`nav-link text-uppercase ${location.pathname === '/store' ? 'active' : ''}`} to="/store">Visit</Link>
              </li>

              {user ? (
                <>
                  {role === 'admin' ? (
                    <>
                      <li className="nav-item px-lg-4">
                        <Link className={`nav-link text-uppercase ${location.pathname === '/admin' ? 'active' : ''}`} to="/admin">Admin Dashboard</Link>
                      </li>
                      <li className="nav-item px-lg-4">
                        <Link className={`nav-link text-uppercase ${location.pathname === '/admin/add-book' ? 'active' : ''}`} to="/admin/add-book">Add New Book</Link>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="nav-item px-lg-4">
                        <Link className={`nav-link text-uppercase ${location.pathname === '/dashboard' ? 'active' : ''}`} to="/dashboard">Dashboard</Link>
                      </li>
                    </>
                  )}
                  <li className="nav-item px-lg-4">
                    <Link className={`nav-link text-uppercase ${location.pathname === '/cart' ? 'active' : ''}`} to="/cart">Your Cart</Link>
                  </li>
                  <li className="nav-item px-lg-4">
                    <button className="nav-link text-uppercase btn btn-link text-decoration-none" onClick={logout}>
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item px-lg-4">
                    <Link className={`nav-link text-uppercase ${location.pathname === '/login' ? 'active' : ''}`} to="/login">Login</Link>
                  </li>
                  <li className="nav-item px-lg-4">
                    <Link className={`nav-link text-uppercase ${location.pathname === '/register' ? 'active' : ''}`} to="/register">Register</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <main>{children}</main>

      <footer className="footer text-faded text-center py-5">
        <div className="container">
          <p className="m-0 small">Copyright &copy; MhmdShanab 2025</p>
        </div>
      </footer>
    </>
  );
};

export default Layout;
