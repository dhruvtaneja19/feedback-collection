# Feedback Collection Platform

A full-stack web application that allows users to collect feedback from the public through shareable profile links. Built with React, Node.js, Express, MongoDB, and OAuth authentication.

## 🚀 Features

### Core Features

- **OAuth Authentication** - Login with Google or GitHub
- **Unique User Profiles** - Create custom username for public profile URL
- **Public Feedback Collection** - Anyone can submit feedback via user's public link
- **Personal Dashboard** - View and manage received feedback
- **Admin Panel** - Manage all users and feedback system-wide

### User Roles

- **Visitor** - Can view public profiles and submit feedback without login
- **Registered User** - Can manage their profile and view received feedback
- **Admin** - Can manage all users and feedback across the platform

### Additional Features

- Feedback categorization (appreciation, suggestion, criticism, etc.)
- Anonymous feedback option
- Feedback rating system (1-5 stars)
- Read/unread status tracking
- Archive functionality
- Bulk operations on feedback
- Profile customization
- Real-time statistics
- Responsive design

## 🛠️ Tech Stack

### Frontend

- **React 19** - UI Library
- **Vite** - Build tool and development server
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Passport.js** - Authentication middleware
- **Express Session** - Session management

### Authentication

- **Google OAuth 2.0** - Google login
- **GitHub OAuth** - GitHub login
- **Passport strategies** - Authentication handling

## 📁 Project Structure

```
feedback-platform/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── passport.js
│   │   ├── controllers/
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Feedback.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── users.js
│   │   │   ├── feedback.js
│   │   │   └── admin.js
│   │   └── app.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── App.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Google OAuth credentials
- GitHub OAuth credentials (optional)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd feedback-platform
   ```

2. **Install dependencies**

   ```bash
   npm run setup
   ```

3. **Set up environment variables**

   ```bash
   cd backend
   cp .env.example .env
   ```

   Edit `.env` with your configuration:

   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/feedback-platform

   # Server
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000

   # Session
   SESSION_SECRET=your-super-secret-session-key

   # Google OAuth
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret

   # GitHub OAuth
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   ```

4. **Set up OAuth Applications**

   **Google OAuth:**

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`

   **GitHub OAuth:**

   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Create a new OAuth App
   - Set Authorization callback URL: `http://localhost:5000/api/auth/github/callback`

5. **Start the development servers**

   ```bash
   npm run dev
   ```

   This will start:

   - Backend server on http://localhost:5000
   - Frontend development server on http://localhost:3000

## 🎯 Usage

### For Users

1. **Registration/Login**

   - Visit the app and click "Login"
   - Choose Google or GitHub authentication
   - Set up your unique username after first login

2. **Profile Management**

   - Access your dashboard to view received feedback
   - Customize your profile settings
   - Share your public profile link: `yoursite.com/yourusername`

3. **Feedback Management**
   - View all received feedback in your dashboard
   - Mark feedback as read/unread
   - Archive or delete feedback
   - Use bulk operations for multiple feedback items

### For Visitors

1. **Submitting Feedback**
   - Visit any user's public profile: `yoursite.com/username`
   - Fill out the feedback form
   - Choose to submit anonymously or with your name
   - Optionally provide a rating (1-5 stars)

### For Admins

1. **Admin Panel Access**
   - Admins can access `/admin` route
   - View platform statistics
   - Manage all users and feedback
   - Perform administrative actions

## 🔗 API Routes

### Authentication Routes

- `GET /api/auth/google` - Start Google OAuth
- `GET /api/auth/github` - Start GitHub OAuth
- `GET /api/auth/me` - Get current user
- `POST /api/auth/setup-profile` - Complete profile setup
- `POST /api/auth/logout` - Logout user

### User Routes

- `GET /api/users/:username` - Get public profile
- `POST /api/users/:username/feedback` - Submit feedback

### Feedback Routes (Protected)

- `GET /api/feedback` - Get user's feedback
- `GET /api/feedback/:id` - Get specific feedback
- `PUT /api/feedback/:id/read` - Mark as read/unread
- `PUT /api/feedback/:id/archive` - Archive/unarchive
- `DELETE /api/feedback/:id` - Delete feedback

### Admin Routes (Admin Only)

- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/users` - All users
- `GET /api/admin/feedback` - All feedback
- `DELETE /api/admin/users/:id` - Delete user
- `DELETE /api/admin/feedback/:id` - Delete feedback

## 🔧 Configuration

### Environment Variables

| Variable               | Description                 | Required |
| ---------------------- | --------------------------- | -------- |
| `MONGODB_URI`          | MongoDB connection string   | Yes      |
| `PORT`                 | Server port (default: 5000) | No       |
| `CLIENT_URL`           | Frontend URL                | Yes      |
| `SESSION_SECRET`       | Session encryption key      | Yes      |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID      | Yes      |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret         | Yes      |
| `GITHUB_CLIENT_ID`     | GitHub OAuth client ID      | No       |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth secret         | No       |

### Database Schema

**User Model:**

- Authentication via OAuth providers
- Unique username for public profile
- Profile customization options
- Role-based access control

**Feedback Model:**

- Anonymous or named feedback
- Categorization and rating system
- Read/archive status tracking
- Metadata for analytics

## 🚀 Deployment

### Backend Deployment

1. Set environment variables for production
2. Ensure MongoDB is accessible
3. Update OAuth redirect URLs for production domain
4. Deploy to your preferred platform (Heroku, Railway, etc.)

### Frontend Deployment

1. Update API base URL in axios configuration
2. Build the project: `npm run build`
3. Deploy the `dist` folder to your hosting platform

### Production Considerations

- Use environment variables for all secrets
- Enable HTTPS for OAuth to work properly
- Set up proper CORS configuration
- Implement rate limiting
- Set up monitoring and logging
- Configure database backups

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the existing issues in the repository
2. Create a new issue with detailed information
3. Include error logs and steps to reproduce

## 🔄 Roadmap

- [ ] Email notifications for new feedback
- [ ] Export feedback to CSV/PDF
- [ ] Advanced analytics dashboard
- [ ] Custom themes for profiles
- [ ] Mobile app version
- [ ] Integration with social media platforms
- [ ] Multi-language support
- [ ] API rate limiting per user
- [ ] Webhook support for integrations
