import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="bg-irctc-blue text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold">
            🚂 Indian Railway
          </Link>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span>Welcome, {user.name}</span>
                <Link to="/bookings" className="hover:text-irctc-orange">My Bookings</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="hover:text-irctc-orange">Admin</Link>
                )}
                <button onClick={handleLogout} className="hover:text-irctc-orange">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-irctc-orange">Login</Link>
                <Link to="/register" className="hover:text-irctc-orange">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;