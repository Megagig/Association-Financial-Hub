import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Header = () => {
  const { isAuthenticated, logout, showToast } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      showToast({
        message: 'Logged out successfully',
        type: 'success',
      });
      navigate('/');
    } catch (error) {
      showToast({
        message: 'Error logging out',
        type: 'error',
      });
    }
  };

  return (
    <header className="bg-blue-600 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white text-xl font-bold">
              Savio 96 Alumni Financial Hub
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="text-white hover:text-gray-200">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-purple-600 px-4 py-2 rounded-md hover:bg-gray-100"
                >
                  Register
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="text-white hover:text-gray-200"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
