import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { MessageSquare, Trash2, Eye, EyeOff, Share2 } from "lucide-react";
import api from "../utils/api";

const Dashboard = () => {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFeedback();
    }
  }, [user]);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/feedback");
      setFeedback(response.data.feedback);
      setStats(response.data.stats);
    } catch (error) {
      console.error("Failed to fetch feedback:", error);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user.name}!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Feedback</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.total || 0}
              </p>
            </div>
            <MessageSquare className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unread Feedback</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.unread || 0}
              </p>
            </div>
            <Eye className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Share Profile Link */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Share Your Profile
            </h3>
            <p className="text-gray-600">
              Let others leave feedback on your profile
            </p>
            <p className="text-sm text-blue-600 mt-1">
              {window.location.origin}/{user.username}
            </p>
          </div>
          <button
            onClick={copyProfileLink}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Share2 className="h-4 w-4" />
            <span>Copy Link</span>
          </button>
        </div>
      </div>

      {/* Feedback List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Feedback
          </h2>
        </div>

        {feedback.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No feedback yet
            </h3>
            <p className="text-gray-600">
              Share your profile link to start receiving feedback!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {feedback.map((item) => (
              <div key={item._id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-gray-900">
                        {item.senderName}
                      </span>
                      {!item.isRead && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          New
                        </span>
                      )}
                      <span className="text-sm text-gray-500">
                        {formatDate(item.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-800 mb-2">{item.message}</p>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => markAsRead(item._id, !item.isRead)}
                      className="p-2 hover:bg-gray-100 rounded"
                      title={item.isRead ? "Mark as unread" : "Mark as read"}
                    >
                      {item.isRead ? (
                        <EyeOff className="h-4 w-4 text-gray-600" />
                      ) : (
                        <Eye className="h-4 w-4 text-blue-600" />
                      )}
                    </button>
                    <button
                      onClick={() => deleteFeedback(item._id)}
                      className="p-2 hover:bg-gray-100 rounded"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
