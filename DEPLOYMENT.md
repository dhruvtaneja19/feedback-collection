# Vercel Deployment Guide

## Prerequisites
- Vercel account (https://vercel.com)
- GitHub repository with your code
- MongoDB Atlas database

## Deployment Strategy

### Option 1: Deploy as Separate Projects (Recommended)

#### 1. Deploy Backend First

1. **Import Backend to Vercel:**
   - Go to Vercel Dashboard
   - Click "New Project"
   - Import from GitHub: `feedback-collection` repository
   - Set **Root Directory** to `backend`
   - Framework Preset: **Other**

2. **Backend Environment Variables:**
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key_here
   CLIENT_URL=https://your-frontend-domain.vercel.app
   ```

3. **Deploy Backend**
   - Note the deployed backend URL (e.g., `https://feedback-backend-xyz.vercel.app`)

#### 2. Deploy Frontend

1. **Import Frontend to Vercel:**
   - Create new project in Vercel
   - Import same GitHub repository
   - Set **Root Directory** to `frontend`
   - Framework Preset: **Vite**

2. **Frontend Environment Variables:**
   ```
   VITE_API_URL=https://your-backend-domain.vercel.app
   ```

3. **Deploy Frontend**

### Option 2: Deploy from Root (Alternative)

1. **Use root vercel.json configuration**
2. **Deploy backend separately first**
3. **Update the proxy URL in root vercel.json**
4. **Deploy frontend from root**

## Environment Variables Setup

### Backend (.env)
```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/feedback-db
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
CLIENT_URL=https://your-frontend-domain.vercel.app
PORT=5000
```

### Frontend (.env)
```bash
VITE_API_URL=https://your-backend-domain.vercel.app
```

## Post-Deployment Steps

1. **Test API endpoints:**
   - `GET https://your-backend-domain.vercel.app/api/health`

2. **Test frontend:**
   - Visit your frontend URL
   - Try registration/login
   - Test feedback submission

3. **Update CORS settings:**
   - Ensure backend CORS allows your frontend domain

## Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Add your frontend domain to backend CORS config
   - Check CLIENT_URL environment variable

2. **Database Connection:**
   - Verify MongoDB Atlas connection string
   - Check IP whitelist (allow all: 0.0.0.0/0 for Vercel)

3. **Environment Variables:**
   - Ensure all env vars are set in Vercel dashboard
   - No quotes around values in Vercel

4. **Build Failures:**
   - Check build logs in Vercel dashboard
   - Verify all dependencies in package.json

## File Structure for Deployment
```
feedback-collection/
├── backend/
│   ├── vercel.json          # Backend Vercel config
│   ├── package.json         # Backend dependencies
│   └── src/                 # Backend source code
├── frontend/
│   ├── vercel.json          # Frontend Vercel config
│   ├── package.json         # Frontend dependencies
│   ├── .env.example         # Environment template
│   └── src/                 # Frontend source code
└── vercel.json              # Root config (optional)
```
