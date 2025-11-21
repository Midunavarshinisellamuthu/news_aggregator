# NewsHub - Database & Authentication Setup Guide

## Overview
This guide will help you set up MongoDB and the authentication/bookmarks features in NewsHub.

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- MongoDB Compass (for database management)

## Step 1: Install MongoDB

### Option A: Local MongoDB Installation
1. Download MongoDB Community Edition from https://www.mongodb.com/try/download/community
2. Follow the installation instructions for your operating system
3. MongoDB will run on `localhost:27017` by default

### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Get your connection string (it will look like `mongodb+srv://username:password@cluster.mongodb.net/dbname`)

## Step 2: Set Up MongoDB Compass

1. Download MongoDB Compass from https://www.mongodb.com/products/tools/compass
2. Open MongoDB Compass
3. Connect to your MongoDB instance:
   - For local: `mongodb://localhost:27017`
   - For Atlas: Paste your connection string from Step 1B

## Step 3: Configure Environment Variables

Create a `.env.local` file in your project root with the following:

```env
# MongoDB Connection (Local)
MONGODB_URI=mongodb://localhost:27017/newshub

# OR for MongoDB Atlas (Cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/newshub

# JWT Secret (Change this to a strong random string in production!)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345

# API URL
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Step 4: Install Dependencies

All required dependencies have been installed:
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT token generation

## Step 5: Start Your Application

```bash
npm run dev
```

The application will start on `http://localhost:3000`

## Features Implemented

### 1. User Authentication
- **Sign Up**: `/signup`
- **Login**: `/login`
- **Logout**: Available in the UI

Users are stored in MongoDB with:
- Email (unique, lowercase)
- Hashed password (bcryptjs)
- Full name
- Created/Updated timestamps

### 2. Bookmarks/Save Feature
- Click the bookmark button on any news article to save it
- Saved articles are stored in MongoDB linked to the user account
- View all saved articles on the `/bookmarks` page
- Bookmarks persist across sessions

### 3. API Endpoints

#### Authentication Endpoints
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Sign in
- `POST /api/auth/logout` - Sign out

#### Bookmarks Endpoints
- `GET /api/bookmarks` - Fetch user's bookmarks
- `POST /api/bookmarks` - Add a bookmark
- `DELETE /api/bookmarks?id={bookmarkId}` - Remove a bookmark

All bookmark endpoints require:
```
Authorization: Bearer {JWT_TOKEN}
```

## Database Schema

### Users Collection
```
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  fullName: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Bookmarks Collection
```
{
  _id: ObjectId,
  userId: ObjectId (reference to User),
  title: String,
  description: String,
  link: String,
  image: String,
  source: String,
  category: String,
  sentiment: String,
  createdAt: Date,
  updatedAt: Date
}
```

Note: There's a compound unique index on `(userId, link)` to prevent duplicate bookmarks.

## Monitoring Database with MongoDB Compass

1. Open MongoDB Compass
2. Connect to your database
3. Navigate to the database:
   - Click on `newshub` database
   - You'll see collections: `users`, `bookmarks`
4. View and manage data directly in Compass

## Testing the Features

### Sign Up
1. Go to `http://localhost:3000/signup`
2. Fill in Full Name, Email, and Password
3. Click "Create Account"

### Log In
1. Go to `http://localhost:3000/login`
2. Enter your email and password
3. Click "Sign In"

### Save/Bookmark Articles
1. On the home page, look for articles
2. Click the bookmark icon on any article card
3. You should see a success toast notification
4. The article is now saved to your account

### View Bookmarks
1. Click "Bookmarks" in the navigation
2. All your saved articles will be displayed
3. Click the bookmark icon again to remove an article

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check the connection string in `.env.local`
- For local MongoDB: `mongod` command should be running
- For Atlas: Ensure your IP is whitelisted

### Login/Signup Not Working
- Check browser console for errors
- Ensure `.env.local` has `JWT_SECRET` set
- Verify MongoDB is accessible

### Bookmarks Not Saving
- Ensure you're logged in
- Check that JWT token is being sent (see browser Network tab)
- Verify MongoDB has the `bookmarks` collection

### JWT Token Expired
- Default expiration is 7 days
- Users will need to log in again after 7 days

## Security Notes

### For Development
- Current setup is fine for local development
- JWT tokens are stored in localStorage (not optimal but works)

### For Production
1. Use strong `JWT_SECRET` (generate: `openssl rand -base64 32`)
2. Use HTTPS only (set `secure: true` in cookie settings)
3. Use environment-specific `.env` files
4. Implement refresh token rotation
5. Add rate limiting on auth endpoints
6. Use MongoDB Atlas with VPC peering
7. Enable MongoDB encryption at rest

## Next Steps

You can further enhance this system with:
1. Email verification on signup
2. Password reset functionality
3. Social authentication (Google, GitHub)
4. Two-factor authentication
5. Admin dashboard for analytics
6. Export bookmarks as PDF
7. Share bookmarks with others
8. Bookmark categories/tags
9. Search within bookmarks
10. Bookmark sync across devices

## Support

If you encounter issues:
1. Check MongoDB connection logs
2. Review browser console for JavaScript errors
3. Check `/app/api/` route handlers for server-side errors
4. Ensure all dependencies are installed (`npm install`)
5. Clear browser cache and localStorage if needed
