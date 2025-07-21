import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import { Menu } from "lucide-react";

const DashboardLayout = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-gray-50">
      {/* Mobile Menu Button */}
      {isMobileView && (
        <div className="bg-white p-4 flex items-center justify-between shadow-sm w-full">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg text-primary-700">
              FeedbackHub
            </span>
          </div>
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-md bg-gray-100 text-secondary-700"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* Sidebar - hidden on mobile unless toggled */}
      <div
        className={`${
          isMobileView ? (isMobileMenuOpen ? "block" : "hidden") : "block"
        } md:block`}
      >
        <Sidebar onLogout={handleLogout} />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 w-full">
        <div className="w-full max-w-[1600px] mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
