import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  User,
  Mail,
  Lock,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle,
  MessageSquare,
  Shield,
  Zap,
  Check,
} from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [focusedField, setFocusedField] = useState("");
  const [isUsernameValid, setIsUsernameValid] = useState(false);

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate("/dashboard");
    return null;
  }

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    const checks = [
      password.length >= 8,
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /[0-9]/.test(password),
      /[^a-zA-Z0-9]/.test(password),
    ];
    strength = (checks.filter(Boolean).length / checks.length) * 100;
    return Math.round(strength);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError("");

    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    if (name === "username") {
      setIsUsernameValid(value.length >= 3 && /^[a-zA-Z0-9_-]+$/.test(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.username ||
      !formData.password
    ) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters long");
      return;
    }

    try {
      setLoading(true);
      await register(formData);
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 20) return "bg-red-500";
    if (passwordStrength < 40) return "bg-orange-500";
    if (passwordStrength < 60) return "bg-yellow-500";
    if (passwordStrength < 80) return "bg-blue-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 20) return "Very Weak";
    if (passwordStrength < 40) return "Weak";
    if (passwordStrength < 60) return "Fair";
    if (passwordStrength < 80) return "Good";
    return "Strong";
  };

  const passwordRequirements = [
    { met: formData.password.length >= 8, text: "At least 8 characters" },
    { met: /[a-z]/.test(formData.password), text: "Lowercase letter" },
    { met: /[A-Z]/.test(formData.password), text: "Uppercase letter" },
    { met: /[0-9]/.test(formData.password), text: "Number" },
    { met: /[^a-zA-Z0-9]/.test(formData.password), text: "Special character" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-200 to-pink-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="max-w-lg w-full relative z-10">
        {/* Header Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-t-3xl shadow-2xl border border-white/20 p-8 text-center">
          <div className="mx-auto h-24 w-24 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <MessageSquare className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-2">
            Create Your Account
          </h1>
          <p className="text-gray-600 text-lg font-medium">
            Join our platform to collect valuable feedback
          </p>

          {/* Feature highlights */}
          <div className="flex justify-center items-center space-x-6 mt-6 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Shield className="h-4 w-4 text-green-500" />
              <span>Secure</span>
            </div>
            <div className="flex items-center space-x-1">
              <Zap className="h-4 w-4 text-blue-500" />
              <span>Fast Setup</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-4 w-4 text-purple-500" />
              <span>Free</span>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-b-3xl shadow-2xl border-x border-b border-white/20 p-8">
          <div className="mb-8 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text hover:from-blue-700 hover:to-purple-700 transition-all duration-200 relative group"
              >
                Sign in here
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-200"></span>
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl animate-shake">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Full Name
              </label>
              <div className="relative group">
                <User
                  className={`absolute left-4 top-4 h-5 w-5 transition-colors duration-200 ${
                    focusedField === "name" ? "text-blue-500" : "text-gray-400"
                  }`}
                />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField("")}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-0 focus:border-blue-400 transition-all duration-300 bg-gray-50/50 focus:bg-white hover:border-gray-300 text-gray-900 placeholder-gray-500"
                  placeholder="Enter your full name"
                />
                <div
                  className={`absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none ${
                    focusedField === "name" ? "ring-4 ring-blue-100" : ""
                  }`}
                ></div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative group">
                <Mail
                  className={`absolute left-4 top-4 h-5 w-5 transition-colors duration-200 ${
                    focusedField === "email" ? "text-blue-500" : "text-gray-400"
                  }`}
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField("")}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-0 focus:border-blue-400 transition-all duration-300 bg-gray-50/50 focus:bg-white hover:border-gray-300 text-gray-900 placeholder-gray-500"
                  placeholder="Enter your email address"
                />
                <div
                  className={`absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none ${
                    focusedField === "email" ? "ring-4 ring-blue-100" : ""
                  }`}
                ></div>
              </div>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Username
              </label>
              <div className="relative group">
                <User
                  className={`absolute left-4 top-4 h-5 w-5 transition-colors duration-200 ${
                    focusedField === "username"
                      ? "text-blue-500"
                      : "text-gray-400"
                  }`}
                />
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("username")}
                  onBlur={() => setFocusedField("")}
                  className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-0 focus:border-blue-400 transition-all duration-300 bg-gray-50/50 focus:bg-white hover:border-gray-300 text-gray-900 placeholder-gray-500"
                  placeholder="Choose a unique username"
                  minLength={3}
                  maxLength={30}
                  pattern="[a-zA-Z0-9_-]+"
                />
                {formData.username && isUsernameValid && (
                  <CheckCircle className="absolute right-4 top-4 h-5 w-5 text-green-500" />
                )}
                <div
                  className={`absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none ${
                    focusedField === "username" ? "ring-4 ring-blue-100" : ""
                  }`}
                ></div>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 mt-2">
                <p className="text-xs text-blue-600 flex items-center">
                  <span className="font-medium">Profile URL:</span>
                  <span className="ml-2 font-mono bg-white px-2 py-1 rounded border">
                    /{formData.username || "username"}
                  </span>
                </p>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative group">
                <Lock
                  className={`absolute left-4 top-4 h-5 w-5 transition-colors duration-200 ${
                    focusedField === "password"
                      ? "text-blue-500"
                      : "text-gray-400"
                  }`}
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField("")}
                  className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-0 focus:border-blue-400 transition-all duration-300 bg-gray-50/50 focus:bg-white hover:border-gray-300 text-gray-900 placeholder-gray-500"
                  placeholder="Create a strong password"
                  minLength={8}
                />
                <button
                  type="button"
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
                <div
                  className={`absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none ${
                    focusedField === "password" ? "ring-4 ring-blue-100" : ""
                  }`}
                ></div>
              </div>

              {formData.password && (
                <div className="space-y-3 bg-gray-50 rounded-xl p-4 mt-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 font-medium">
                      Password strength:
                    </span>
                    <span
                      className={`font-semibold ${
                        passwordStrength >= 80
                          ? "text-green-600"
                          : passwordStrength >= 60
                          ? "text-blue-600"
                          : passwordStrength >= 40
                          ? "text-yellow-600"
                          : passwordStrength >= 20
                          ? "text-orange-600"
                          : "text-red-600"
                      }`}
                    >
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getPasswordStrengthColor()}`}
                      style={{ width: `${passwordStrength}%` }}
                    ></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {passwordRequirements.map((req, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 text-xs"
                      >
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            req.met ? "bg-green-100" : "bg-gray-200"
                          }`}
                        >
                          {req.met && (
                            <Check className="w-3 h-3 text-green-600" />
                          )}
                        </div>
                        <span
                          className={
                            req.met ? "text-green-600" : "text-gray-500"
                          }
                        >
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative group">
                <Lock
                  className={`absolute left-4 top-4 h-5 w-5 transition-colors duration-200 ${
                    focusedField === "confirmPassword"
                      ? "text-blue-500"
                      : "text-gray-400"
                  }`}
                />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("confirmPassword")}
                  onBlur={() => setFocusedField("")}
                  className="w-full pl-12 pr-16 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-0 focus:border-blue-400 transition-all duration-300 bg-gray-50/50 focus:bg-white hover:border-gray-300 text-gray-900 placeholder-gray-500"
                  placeholder="Confirm your password"
                />
                <div className="absolute right-4 top-4 flex items-center space-x-2">
                  {formData.confirmPassword &&
                    formData.password === formData.confirmPassword && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <div
                  className={`absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none ${
                    focusedField === "confirmPassword"
                      ? "ring-4 ring-blue-100"
                      : ""
                  }`}
                ></div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-4 px-6 rounded-2xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 active:translate-y-0 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              {loading ? (
                <div className="flex items-center justify-center relative z-10">
                  <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent mr-3"></div>
                  Creating your account...
                </div>
              ) : (
                <span className="relative z-10">Create Account</span>
              )}
            </button>
          </form>

          {/* Additional info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By creating an account, you agree to our{" "}
              <a
                href="#"
                className="text-blue-600 hover:text-blue-500 underline"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-blue-600 hover:text-blue-500 underline"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
