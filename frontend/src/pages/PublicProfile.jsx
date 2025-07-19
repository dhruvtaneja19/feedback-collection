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
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            User Not Found
          </h1>
          <p className="text-gray-600">
            The profile you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="max-w-md w-full mx-auto text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h1>
          <p className="text-gray-600 mb-8">
            Your feedback has been submitted successfully to {user.name}.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Submit Another Feedback
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* User Profile Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8 text-center">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
          <p className="text-gray-600 mb-4">@{user.username}</p>
          {user.bio && (
            <p className="text-gray-700 mb-4 max-w-md mx-auto">{user.bio}</p>
          )}

          <div className="flex justify-center text-sm text-gray-600">
            <div className="text-center">
              <div className="font-semibold text-lg text-gray-900">
                {user.feedbackCount || 0}
              </div>
              <div>Feedback Received</div>
            </div>
          </div>
        </div>

        {/* Feedback Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <MessageSquare className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Give Feedback to {user.name}
            </h2>
            <p className="text-gray-600">
              Share your thoughts, appreciation, or suggestions
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Anonymous Toggle */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isAnonymous"
                name="isAnonymous"
                checked={formData.isAnonymous}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isAnonymous"
                className="ml-2 text-sm text-gray-700"
              >
                Submit anonymously
              </label>
            </div>

            {/* Sender Information */}
            {!formData.isAnonymous && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="senderName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="senderName"
                    name="senderName"
                    value={formData.senderName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required={!formData.isAnonymous}
                  />
                </div>
                <div>
                  <label
                    htmlFor="senderEmail"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Your Email *
                  </label>
                  <input
                    type="email"
                    id="senderEmail"
                    name="senderEmail"
                    value={formData.senderEmail}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required={!formData.isAnonymous}
                  />
                </div>
              </div>
            )}

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Your Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={6}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  formData.message.trim().length > 0 &&
                  formData.message.trim().length < 10
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="Share your thoughts, feedback, or suggestions... (minimum 10 characters)"
                required
              />
              <div className="flex justify-between text-sm mt-1">
                <span
                  className={`${
                    formData.message.trim().length < 10
                      ? "text-red-500"
                      : "text-green-600"
                  }`}
                >
                  {formData.message.trim().length < 10
                    ? `${
                        10 - formData.message.trim().length
                      } more characters needed`
                    : "✓ Minimum length met"}
                </span>
                <span className="text-gray-500">
                  {formData.message.length}/500
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || formData.message.trim().length < 10}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Send Feedback</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>This feedback will be sent privately to {user.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
