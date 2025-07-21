import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Layers,
  MessageSquare,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  HelpCircle,
  Shield,
  Users,
} from "lucide-react";

const Sidebar = ({ onLogout }) => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    {
      name: "Dashboard",
      icon: Layers,
      path: "/dashboard",
    },
    {
      name: "Feedback",
      icon: MessageSquare,
      path: "/dashboard/feedback",
    },
    {
      name: "Profile",
      icon: User,
      path: `/${user?.username}`,
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/dashboard/settings",
    },
  ];

  if (isAdmin) {
    navItems.push({
      name: "Admin Panel",
      icon: Shield,
      path: "/admin",
    });
  }

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-white border-r border-gray-200 min-h-screen h-full overflow-y-auto transition-all duration-300 z-10`}
    >
      {/* Sidebar Header */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200 justify-between">
        {!collapsed && (
          <Link to="/" className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-primary-600" />
            <span className="font-bold text-lg text-gray-900">FeedbackHub</span>
          </Link>
        )}
        {collapsed && (
          <MessageSquare className="h-6 w-6 text-primary-600 mx-auto" />
        )}
        {!isMobileView && (
          <button
            onClick={toggleSidebar}
            className="p-1 rounded hover:bg-gray-100"
          >
            {collapsed ? (
              <Menu className="h-5 w-5 text-gray-600" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            )}
          </button>
        )}
      </div>

      {/* User Profile */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <img
            src={
              user?.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user?.name || "User"
              )}&background=3b4ff0&color=ffffff`
            }
            alt={user?.name}
            className="h-10 w-10 rounded-full"
          />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-medium text-gray-900 truncate">
                {user?.name}
              </h2>
              <p className="text-xs text-gray-500 truncate">
                @{user?.username}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-3 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-3 py-3 rounded-md transition-colors ${
                isActive
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <item.icon
                className={`h-5 w-5 ${isActive ? "text-primary-600" : ""}`}
              />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto px-3 py-6 border-t border-gray-200">
        <button
          onClick={onLogout}
          className={`flex items-center space-x-3 w-full px-3 py-3 text-left rounded-md text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors`}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Logout</span>}
        </button>
        <Link
          to="/help"
          className={`mt-2 flex items-center space-x-3 px-3 py-3 rounded-md text-gray-700 hover:bg-gray-100 transition-colors`}
        >
          <HelpCircle className="h-5 w-5" />
          {!collapsed && <span>Help & Support</span>}
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
