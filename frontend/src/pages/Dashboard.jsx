import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  MessageSquare,
  Trash2,
  Eye,
  EyeOff,
  Share2,
  RefreshCcw,
  Clock,
  Bell,
  ArrowUp,
  Filter,
  Users,
} from "lucide-react";
import api from "../utils/api";
import DashboardLayout from "../components/DashboardLayout";

const Dashboard = () => {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterView, setFilterView] = useState("all"); // all, unread, read

  useEffect(() => {
    if (user) {
      fetchFeedback();
    }
  }, [user]);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/feedback");
      console.log("📊 Feedback API response:", response.data);
      
      // Ensure feedback is always an array
      const feedbackData = response.data.feedback || response.data || [];
      const statsData = response.data.stats || {};
      
      setFeedback(Array.isArray(feedbackData) ? feedbackData : []);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to fetch feedback:", error);
      // Set empty array on error to prevent filter issues
      setFeedback([]);
      setStats({});
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id, isRead) => {
    try {
      await api.put(`/api/feedback/${id}/read`, { isRead });
      fetchFeedback();
    } catch (error) {
      console.error("Failed to update read status:", error);
    }
  };

  const deleteFeedback = async (id) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      try {
        await api.delete(`/api/feedback/${id}`);
        fetchFeedback();
      } catch (error) {
        console.error("Failed to delete feedback:", error);
      }
    }
  };

  const copyProfileLink = () => {
    const profileUrl = `${window.location.origin}/${user.username}`;
    navigator.clipboard.writeText(profileUrl);
    alert("Profile link copied to clipboard!");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter feedback based on selected filter
  const filteredFeedback = (feedback || []).filter((item) => {
    if (filterView === "unread") return !item.isRead;
    if (filterView === "read") return item.isRead;
    return true; // "all" filter
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Welcome back, {user.name}!</p>
        </div>
        <button
          onClick={fetchFeedback}
          className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 flex items-center space-x-2 transition-colors w-full md:w-auto justify-center"
        >
          <RefreshCcw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white rounded-lg shadow-md border border-gray-100 p-4 md:p-6 transition-all hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Feedback
              </p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
                {stats.total || 0}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <MessageSquare className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>All time</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-100 p-4 md:p-6 transition-all hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Unread Feedback
              </p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
                {stats.unread || 0}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Bell className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500 flex items-center">
            <Eye className="h-3 w-3 mr-1" />
            <span>Awaiting review</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-100 p-4 md:p-6 transition-all hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">This Month</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
                {stats.thisMonth || 0}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <ArrowUp className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 text-xs text-green-600 flex items-center">
            <ArrowUp className="h-3 w-3 mr-1" />
            <span>{stats.monthlyGrowth || 0}% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-100 p-4 md:p-6 transition-all hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Profile Views</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
                {stats.profileViews || 0}
              </p>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <Users className="h-5 w-5 md:h-6 md:w-6 text-amber-600" />
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>Last 30 days</span>
          </div>
        </div>
      </div>

      {/* Share Profile Link */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg md:text-xl font-bold mb-2">
              Share Your Profile
            </h3>
            <p className="text-blue-100 mb-3">
              Let others leave feedback on your profile
            </p>
            <div className="mt-2 bg-white/20 rounded-md p-2 md:p-3 backdrop-blur-sm">
              <p className="text-white font-medium break-all text-sm md:text-base">
                {window.location.origin}/{user.username}
              </p>
            </div>
          </div>
          <div>
            <button
              onClick={copyProfileLink}
              className="flex items-center space-x-2 px-4 py-2 md:px-5 md:py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors shadow-sm w-full md:w-auto justify-center"
            >
              <Share2 className="h-4 w-4" />
              <span>Copy Link</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200">
        <div className="p-4 md:p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <h2 className="text-lg md:text-xl font-bold text-gray-900">
            Recent Feedback
          </h2>

          {/* Filter controls */}
          <div className="flex items-center space-x-2">
            <div className="text-sm text-gray-500 flex items-center mr-2">
              <Filter className="h-4 w-4 mr-1" />
              <span>Filter:</span>
            </div>
            <div className="flex rounded-md overflow-hidden border border-gray-300">
              <button
                onClick={() => setFilterView("all")}
                className={`px-3 py-1 text-sm ${
                  filterView === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterView("unread")}
                className={`px-3 py-1 text-sm ${
                  filterView === "unread"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                } border-x border-gray-300`}
              >
                Unread
              </button>
              <button
                onClick={() => setFilterView("read")}
                className={`px-3 py-1 text-sm ${
                  filterView === "read"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Read
              </button>
            </div>
          </div>
        </div>

        {filteredFeedback.length === 0 ? (
          <div className="p-8 md:p-12 text-center">
            <MessageSquare className="h-12 w-12 md:h-16 md:w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {feedback.length === 0
                ? "No feedback yet"
                : "No feedback matches your filter"}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {feedback.length === 0
                ? "Share your profile link to start receiving feedback!"
                : "Try changing your filter to see more feedback"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredFeedback.map((item) => (
              <div
                key={item._id}
                className={`p-4 md:p-6 ${
                  !item.isRead ? "bg-primary-50" : ""
                } hover:bg-gray-50 transition-colors`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="bg-primary-100 h-8 w-8 md:h-10 md:w-10 rounded-full flex items-center justify-center text-primary-600 font-bold">
                        {item.senderName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-gray-900">
                            {item.senderName}
                          </span>
                          {!item.isRead && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                              New
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatDate(item.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4 mb-3 shadow-sm">
                      <p className="text-gray-800 whitespace-pre-line text-sm md:text-base">
                        {item.message}
                      </p>
                    </div>
                    {item.senderEmail && (
                      <div className="text-sm text-gray-500">
                        Contact: {item.senderEmail}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end space-x-2 md:space-x-0 md:space-y-2">
                    <button
                      onClick={() => markAsRead(item._id, !item.isRead)}
                      className={`p-2 rounded-full ${
                        item.isRead
                          ? "hover:bg-gray-100"
                          : "bg-primary-100 hover:bg-primary-200"
                      }`}
                      title={item.isRead ? "Mark as unread" : "Mark as read"}
                    >
                      {item.isRead ? (
                        <EyeOff className="h-5 w-5 text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-primary-600" />
                      )}
                    </button>
                    <button
                      onClick={() => deleteFeedback(item._id)}
                      className="p-2 rounded-full hover:bg-red-100"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
