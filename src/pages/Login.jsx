import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { loginUser, googleLoginUser } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import '../styles/Login.css'; // Import the custom styles

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await loginUser({ email, password });
      login(data.token, data.user); // Assumes backend returns { token, user }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');

    try {
      const idToken = credentialResponse?.credential;
      if (!idToken) {
        throw new Error('Google did not return a credential token');
      }

      const { data } = await googleLoginUser(idToken);
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google sign-in failed. Ensure this origin is allowed in Google Cloud OAuth settings.');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        
        <div className="login-header">
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Sign in to continue making an impact.</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <input 
            type="email" 
            placeholder="Email Address" 
            className="form-input"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="form-input"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button disabled={loading} className="btn-login">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="divider">
          <div className="divider-line"></div>
          <span className="divider-text">OR</span>
          <div className="divider-line"></div>
        </div>

        <div className="google-wrapper">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap={false}
          />
        </div>

        <div className="auth-links">
          <p>
            Need an account? <Link to="/register" className="auth-link-text">Register here</Link>
          </p>
          <p>
            Want to explore first? <Link to="/dashboard" className="auth-link-text">Continue as Guest</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;