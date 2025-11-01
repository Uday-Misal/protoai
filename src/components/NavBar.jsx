import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src="/logo.svg" alt="WorkFlow" className="h-8 w-8" />
              <span className="ml-2 text-xl font-semibold">ProtoAI</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/features" className="text-gray-600 hover:text-gray-900">Features</Link>
            <Link to="/how-it-works" className="text-gray-600 hover:text-gray-900">How It Works</Link>
            <Link to="/testimonials" className="text-gray-600 hover:text-gray-900">Testimonials</Link>
            
            {user ? (
              <button 
                onClick={logout}
                className="ml-4 px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Log Out
              </button>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Log In
                </Link>
                <Link 
                  to="/signup"
                  className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Get Started →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;