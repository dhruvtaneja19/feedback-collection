import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Star,
  Send,
  User,
  MessageSquare,
  Heart,
  CheckCircle,
  AlertCircle,
  Shield,
} from "lucide-react";
import api from "../utils/api";

const PublicProfile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    senderName: "",
    senderEmail: "",
    message: "",
    isAnonymous: false,
  });

  useEffect(() => {
    fetchUser();
  }, [username]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/users/${username}`);
      setUser(response.data.user);
    } catch (error) {
      setError("User not found");
      console.error("Failed to fetch user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setError("");

    // Client-side validation
    if (!formData.message.trim()) {
      setError("Please enter your feedback message");
      return;
    }

    if (formData.message.trim().length < 10) {
      setError("Feedback message must be at least 10 characters long");
      return;
    }

    if (formData.message.length > 500) {
      setError("Feedback message cannot exceed 500 characters");
      return;
    }

    if (
      !formData.isAnonymous &&
      (!formData.senderName.trim() || !formData.senderEmail.trim())
    ) {
      setError(
        "Please provide your name and email, or choose to submit anonymously"
      );
      return;
    }

    try {
      setSubmitting(true);

      const submitData = {
        ...formData,
      };

      if (formData.isAnonymous) {
        delete submitData.senderName;
        delete submitData.senderEmail;
      }

      await api.post(`/api/users/${username}/feedback`, submitData);

      setSubmitted(true);
      setFormData({
        senderName: "",
        senderEmail: "",
        message: "",
        isAnonymous: false,
      });
    } catch (error) {
      setError(error.response?.data?.message || "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex justify-center items-center px-4">
        <div className="max-w-md w-full mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100/50 p-12 text-center">
            <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Profile Not Found
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              The profile you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => (window.location.href = "/")}
              className="w-full py-4 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 font-bold text-lg"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100/50 overflow-hidden">
            {/* Success Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-12 text-center text-white">
              <div className="bg-white/20 backdrop-blur-sm rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-12 w-12" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Thank You!</h1>
              <p className="text-green-100 text-xl">
                Your feedback has been delivered successfully
              </p>
            </div>

            {/* Success Content */}
            <div className="px-8 py-12 text-center">
              <div className="bg-green-50 rounded-2xl p-6 mb-8 border border-green-200/50">
                <p className="text-gray-700 text-lg mb-2">
                  Your feedback has been sent to{" "}
                  <span className="font-bold text-green-700">{user.name}</span>
                </p>
                <p className="text-gray-600">
                  They will receive a notification about your message
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => setSubmitted(false)}
                  className="w-full flex items-center justify-center space-x-3 py-4 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  <MessageSquare className="h-6 w-6" />
                  <span>Send Another Feedback</span>
                </button>

                <button
                  onClick={() => (window.location.href = "/")}
                  className="w-full py-4 px-8 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-300 font-semibold text-lg"
                >
                  Return to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* User Profile Card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100/50 overflow-hidden">
            {/* Header with gradient */}
            <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-600">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            </div>

            {/* Profile Content */}
            <div className="relative px-8 pb-8 -mt-16">
              {/* Avatar */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
                    <User className="h-16 w-16 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
                </div>
              </div>

              {/* User Info */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                  {user.name}
                </h1>
                <p className="text-xl text-gray-600 mb-4">@{user.username}</p>
                {user.bio && (
                  <div className="max-w-2xl mx-auto">
                    <p className="text-gray-700 text-lg leading-relaxed bg-gray-50 rounded-2xl px-6 py-4">
                      {user.bio}
                    </p>
                  </div>
                )}
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-md mx-auto">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-blue-700 mb-1">
                        {user.feedbackCount || 0}
                      </div>
                      <div className="text-sm font-medium text-blue-600">
                        Feedback Received
                      </div>
                    </div>
                    <div className="bg-blue-200 p-3 rounded-xl">
                      <MessageSquare className="h-6 w-6 text-blue-700" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-green-700 mb-1">
                        {user.profileViews || 0}
                      </div>
                      <div className="text-sm font-medium text-green-600">
                        Profile Views
                      </div>
                    </div>
                    <div className="bg-green-200 p-3 rounded-xl">
                      <User className="h-6 w-6 text-green-700" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Form Card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100/50 overflow-hidden">
            {/* Form Header */}
            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-8">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative text-center text-white">
                <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8" />
                </div>
                <h2 className="text-3xl font-bold mb-3">
                  Send Feedback to {user.name}
                </h2>
                <p className="text-indigo-100 text-lg">
                  Share your thoughts, appreciation, or suggestions
                </p>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8 lg:p-12">
              {error && (
                <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-xl">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Anonymous Toggle Card */}
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200/50">
                  <div className="flex items-center">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        id="isAnonymous"
                        name="isAnonymous"
                        checked={formData.isAnonymous}
                        onChange={handleInputChange}
                        className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="ml-4">
                      <label
                        htmlFor="isAnonymous"
                        className="font-semibold text-gray-900 flex items-center cursor-pointer"
                      >
                        <Shield className="h-5 w-5 mr-2 text-gray-600" />
                        Submit feedback anonymously
                      </label>
                      <p className="text-sm text-gray-600 mt-1">
                        Your identity will be completely hidden from the
                        recipient
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sender Information Cards */}
                {!formData.isAnonymous && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label
                        htmlFor="senderName"
                        className="block text-sm font-bold text-gray-800 mb-2"
                      >
                        Your Name *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="senderName"
                          name="senderName"
                          value={formData.senderName}
                          onChange={handleInputChange}
                          className="block w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                          required={!formData.isAnonymous}
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label
                        htmlFor="senderEmail"
                        className="block text-sm font-bold text-gray-800 mb-2"
                      >
                        Your Email *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <MessageSquare className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="senderEmail"
                          name="senderEmail"
                          value={formData.senderEmail}
                          onChange={handleInputChange}
                          className="block w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                          required={!formData.isAnonymous}
                          placeholder="Enter your email address"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Message Card */}
                <div className="space-y-3">
                  <label
                    htmlFor="message"
                    className="block text-sm font-bold text-gray-800 mb-2"
                  >
                    Your Feedback Message *
                  </label>
                  <div className="relative">
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={8}
                      className={`block w-full px-6 py-4 border rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-all duration-200 ${
                        formData.message.trim().length > 0 &&
                        formData.message.trim().length < 10
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 bg-gray-50 hover:bg-white"
                      }`}
                      placeholder="Share your thoughts, feedback, suggestions, or appreciation... (minimum 10 characters)"
                      required
                    />
                    <div className="absolute bottom-4 right-4 text-xs text-gray-400 bg-white px-2 py-1 rounded-lg">
                      {formData.message.length}/500
                    </div>
                  </div>

                  {/* Message validation indicator */}
                  <div className="flex items-center justify-between text-sm mt-3">
                    <div className="flex items-center">
                      {formData.message.trim().length < 10 ? (
                        <>
                          <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                          <span className="text-red-600 font-medium">
                            {10 - formData.message.trim().length} more
                            characters needed
                          </span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-green-600 font-medium">
                            Message length requirement met ✓
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={submitting || formData.message.trim().length < 10}
                    className="w-full flex items-center justify-center space-x-3 py-5 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02]"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        <span>Sending your feedback...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-6 w-6" />
                        <span>Send Feedback</span>
                        <Heart className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Footer */}
              <div className="mt-10 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-gray-600 text-sm bg-gray-50 rounded-xl px-6 py-3 inline-block">
                    <Shield className="h-4 w-4 inline mr-2" />
                    This feedback will be sent privately and securely to{" "}
                    {user.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
