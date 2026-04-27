import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', skill: '', location: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await registerUser(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-b from-cyan-50 to-white px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md border border-cyan-100 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-2 text-center text-cyan-800">Create Account</h2>
        <p className="text-center text-sm text-gray-500 mb-6">Join volunteers helping real communities.</p>
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        
        {['username', 'email', 'password', 'skill', 'location'].map((field) => (
          <input
            key={field}
            type={field === 'password' ? 'password' : 'text'}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            className="w-full border p-2 mb-4 rounded-lg"
            value={formData[field]}
            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
            required
          />
        ))}
        <button disabled={loading} className="w-full bg-cyan-600 text-white p-2 rounded-lg hover:bg-cyan-700">
          {loading ? 'Registering...' : 'Register'}
        </button>
        <p className="mt-4 text-sm text-center">
          Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
