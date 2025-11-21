# Bookmarks Not Showing - Troubleshooting Guide

## What Changed

Your bookmarks now work with the database:
1. **Login is required** - You must sign in first to see any news or save articles
2. **Bookmarks save to MongoDB** - Not just browser storage anymore
3. **Bookmarks persist forever** - They stay in the database until you delete them
4. **Real database storage** - Visible in MongoDB Compass

## Step-by-Step Troubleshooting

### Step 1: Verify You're Logged In

1. Check the top-right corner of the page
2. You should see:
   - Your full name
   - Your email
   - A "Logout" button

**If you don't see this:**
- Go to `/login`
- Sign in with your email and password
- You should be redirected to the home page

### Step 2: Verify MongoDB is Running

On your machine:

**Windows PowerShell:**
```powershell
Get-Process mongod

# If nothing appears, MongoDB isn't running
# Start it:
Start-Service MongoDB
```

**OR run MongoDB directly:**
```powershell
mongod
```

Wait 2-3 seconds for it to start.

### Step 3: Check Environment Variables

Open `.env.local` file in your project:

```env
MONGODB_URI=mongodb://localhost:27017/newshub
JWT_SECRET=your_secret_key_here
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Make sure:**
- MongoDB is set to `localhost:27017` (if using local)
- Database name is `newshub`
- `JWT_SECRET` is set (any value, but must exist)

### Step 4: Test Saving an Article

1. Go to home page (`http://localhost:3000`)
2. You should see news articles
3. Find any article card
4. Click the **bookmark icon** (heart or bookmark button)
5. **You should see:**
   - ✅ A green toast notification: "Article saved!"
   - ✅ The bookmark icon changes appearance (filled)

**If you don't see a notification:**
- Check browser console (F12 → Console tab)
- Look for red error messages
- Share the error message with me

### Step 5: Check MongoDB Compass

1. Open **MongoDB Compass**
2. Connection string: `mongodb://localhost:27017`
3. Click **Connect**
4. Left panel → Click **newshub** database
5. Click **bookmarks** collection
6. **You should see your saved articles here!**

### Step 6: Verify Your Bookmark in Database

Look for a document like this:

```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),  // Links to your user
  title: "Article Title",
  link: "https://news.example.com/article",
  source: "News Source Name",
  image: "https://...",
  description: "Article summary",
  category: "Technology",
  sentiment: "positive",
  createdAt: ISODate("2024-01-01T12:00:00.000Z"),
  updatedAt: ISODate("2024-01-01T12:00:00.000Z")
}
```

If you see this, **bookmarks ARE being saved correctly!**

### Step 7: View Bookmarks Page

1. Click **"Bookmarks"** in top navigation
2. **You should see:**
   - All your saved articles listed
   - Each article in a card format
   - Ability to click again to remove

**If you see:**
- "Please Sign In" message → Log back in (token expired)
- Empty page → No bookmarks saved yet (save one first)
- Articles from database ✅ → Everything is working!

## Common Issues & Solutions

| Issue | Cause | Fix |
|-------|-------|-----|
| "Article saved!" but not in bookmarks | Token expired | Refresh page, login again |
| Can't click bookmark button | Not logged in | Go to `/login` and sign in |
| Error: "Unauthorized" | JWT token missing | Log in again to get new token |
| Error: "MongoDB connection failed" | MongoDB not running | Run `mongod` in terminal |
| Bookmarks page empty | No bookmarks saved | Click bookmark on an article first |
| Can't see news articles | Not authenticated | Must log in first |

## How to Test Everything Works

### Complete Test Flow

1. **Sign Up**
   - Go to `/signup`
   - Fill: Full Name, Email, Password
   - Click "Create Account"
   - You're now logged in ✅

2. **Save an Article**
   - See article card on home page
   - Click bookmark icon
   - See "Article saved!" notification ✅

3. **Check MongoDB**
   - Open MongoDB Compass
   - View `newshub` → `bookmarks`
   - See your saved article ✅

4. **View Bookmarks**
   - Click "Bookmarks" in navigation
   - See your saved article listed ✅

5. **Remove Bookmark**
   - Click bookmark icon again
   - See "Article removed from bookmarks" ✅
   - Refresh page
   - Article gone from list ✅

6. **Log Out and Back In**
   - Click "Logout" button
   - Redirected to login page ✅
   - Log back in with same account
   - Go to bookmarks
   - Your saved articles are still there ✅

## Browser Console Debugging

If something isn't working:

1. Press **F12** to open Developer Tools
2. Click **Console** tab
3. Try to save an article
4. Look for any red error messages
5. Copy the full error and share it

**Common console errors:**

```javascript
// Error: "Cannot POST /api/bookmarks"
// Fix: Check JWT token is being sent in Authorization header

// Error: "Unauthorized"
// Fix: Log in again, JWT token expired

// Error: "Bookmark already exists"
// Fix: Article is already bookmarked, no duplicate
```

## Network Request Debugging

1. Press **F12** → **Network** tab
2. Clear network log
3. Click bookmark button
4. Look for `bookmarks` request
5. Click on it and check:
   - **Status**: Should be `201` (Created) or `200` (Updated)
   - **Request Headers**: Should have `Authorization: Bearer {token}`
   - **Response**: Should show `"success": true`

**Example successful response:**
```json
{
  "success": true,
  "message": "Bookmark added successfully",
  "bookmark": {
    "_id": "...",
    "userId": "...",
    "title": "...",
    "link": "...",
    "createdAt": "2024-01-01T12:00:00.000Z"
  }
}
```

## Still Not Working?

1. **Check all console errors** (F12 → Console)
2. **Verify MongoDB is running** (`mongod` in terminal)
3. **Check `.env.local` is configured** (with MongoDB URI and JWT_SECRET)
4. **Clear browser cache** (Ctrl+Shift+Delete)
5. **Restart dev server** (`npm run dev`)
6. **Check MongoDB Compass** - Is data in database?

## Reset Everything (Nuclear Option)

If everything is broken:

**In MongoDB Compass:**
1. Right-click `newshub` database
2. Click "Drop Database"
3. This deletes all users and bookmarks
4. Start fresh with new account

**OR in Terminal:**
```bash
# Stop dev server: Ctrl+C
# Delete database files (Windows)
# Restart: npm run dev
# Go to /signup and create new account
```

## API Testing (Advanced)

Test the API directly using PowerShell:

```powershell
# 1. Sign up
$signupResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/signup" `
  -Method POST `
  -Headers @{"Content-Type" = "application/json"} `
  -Body @{
    fullName = "Test User"
    email = "test@example.com"
    password = "password123"
  } | ConvertFrom-Json

# Save token
$token = $signupResponse.token

# 2. Save bookmark
$bookmarkResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/bookmarks" `
  -Method POST `
  -Headers @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
  } `
  -Body @{
    title = "Test Article"
    link = "https://example.com/article"
    source = "Example News"
  } | ConvertFrom-Json

# 3. Get bookmarks
$getResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/bookmarks" `
  -Method GET `
  -Headers @{"Authorization" = "Bearer $token"} | ConvertFrom-Json

$getResponse.bookmarks | Format-Table
```

## Still Need Help?

If nothing works:
1. Share console errors with me
2. Share MongoDB Compass screenshots
3. Share network request/response
4. Tell me the exact steps you took
