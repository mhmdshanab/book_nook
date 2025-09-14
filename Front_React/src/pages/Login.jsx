import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const authUser = await login(formData.username, formData.password);
      const role = authUser.role || 'user';
      navigate(role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(/NetworkError|Failed to fetch/i.test(err.message) ? 
        'Cannot reach the server. Please check your API URL or CORS.' : 
        (err.message || 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="bg-faded rounded p-5">
              <h2 className="section-heading mb-4 text-center">
                <span className="section-heading-upper">Welcome Back</span>
                <span className="section-heading-lower">Login</span>
              </h2>

              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">👤 Username</label>
                  <input type="text" className="form-control" id="username" name="username"
                         value={formData.username} onChange={handleChange} required autoComplete="username" />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">🔑 Password</label>
                  <input type="password" className="form-control" id="password" name="password"
                         value={formData.password} onChange={handleChange} required autoComplete="current-password" />
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? 'Logging in...' : '🔓 Login'}
                </button>
              </form>

              <div className="text-center mt-3">
                <span>Don't have an account?</span><br/>
                <Link to="/register" className="btn btn-outline-secondary mt-2">📝 Sign up here</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
