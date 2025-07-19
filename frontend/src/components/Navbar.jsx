import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MessageSquare, User, LogOut, Settings, Shield } from "lucide-react";

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <MessageSquare className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">FeedbackHub</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                >
                  <User className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                  >
                    <Shield className="h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                )}

                <div className="relative group">
                  <button className="flex items-center space-x-1 px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100">
                    <img
                      src={
                        user.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user.name
                        )}&background=3b82f6&color=ffffff`
                      }
                      alt={user.name}
                      className="h-6 w-6 rounded-full"
                    />
                    <span>{user.name}</span>
                  </button>

                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      to={`/${user.username}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      View Public Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="inline h-4 w-4 mr-2" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="inline h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-blue-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
