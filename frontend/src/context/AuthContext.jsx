import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";
import { createApiUrl } from "../utils/corsProxy";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Auth token is now handled in the api utility's interceptors
  useEffect(() => {
    // No need to set up interceptors here as they're handled in the api utility
    console.log("Auth token updated:", token ? "Token exists" : "No token");
  }, [token]);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      if (token) {
        const response = await api.get("/api/auth/me");
        setUser(response.data.user);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // Determine if we're in production or development
      const isProd = import.meta.env.PROD || false;
      const apiUrl = isProd
        ? "https://feedback-collection-t8g8-dhruv-tanejas-projects.vercel.app"
        : "";

      console.log(
        "Attempting login, environment:",
        isProd ? "production" : "development"
      );

      // Create the complete URL for login
      const loginUrl = isProd ? `${apiUrl}/api/auth/login` : "/api/auth/login";

      console.log("Login URL:", loginUrl);

      // Make the login request with appropriate config
      const response = await axios({
        method: "post",
        url: loginUrl,
        data: { email, password },
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: false,
      });

      const { token: newToken, user: userData } = response.data;

      setToken(newToken);
      setUser(userData);
      localStorage.setItem("token", newToken);

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post("/api/auth/register", userData);
      const { token: newToken, user: newUser } = response.data;

      setToken(newToken);
      setUser(newUser);
      localStorage.setItem("token", newToken);

      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    // Authorization headers are handled by the api utility
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put("/api/auth/profile", profileData);
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      console.error("Profile update error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Profile update failed",
      };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
