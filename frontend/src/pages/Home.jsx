import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MessageSquare, Users, Shield, Zap } from "lucide-react";

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Collect Feedback from Anyone, Anywhere
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Create your unique profile and receive anonymous feedback from
          colleagues, friends, or anyone who wants to share their thoughts with
          you.
        </p>

        {isAuthenticated ? (
          <div className="space-x-4">
            <Link
              to="/dashboard"
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </Link>
            <Link
              to={`/${user.username}`}
              className="inline-block px-8 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              View My Profile
            </Link>
          </div>
        ) : (
          <div className="space-x-4">
            <Link
              to="/register"
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="inline-block px-8 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose FeedbackHub?
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Anonymous Feedback</h3>
            <p className="text-gray-600">
              Receive honest feedback without revealing the sender's identity.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Public Profiles</h3>
            <p className="text-gray-600">
              Share your unique link and let anyone submit feedback easily.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
            <p className="text-gray-600">
              Your data is protected with enterprise-grade security measures.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Dashboard</h3>
            <p className="text-gray-600">
              Manage and organize your feedback with powerful tools.
            </p>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="py-20 bg-gray-50 rounded-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              1
            </div>
            <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
            <p className="text-gray-600">
              Sign up and choose a unique username for your feedback profile.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2">Share Your Link</h3>
            <p className="text-gray-600">
              Share your unique profile link with anyone you want feedback from.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2">Receive Feedback</h3>
            <p className="text-gray-600">
              Get anonymous feedback and manage it all from your dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!isAuthenticated && (
        <div className="text-center py-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Collecting Feedback?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of users who are already using FeedbackHub.
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg"
          >
            Create Your Free Account
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
