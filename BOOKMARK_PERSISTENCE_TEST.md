# Bookmark Persistence Testing Guide

## ✅ Test That Bookmarks Don't Get Deleted

### Prerequisites
- MongoDB running (`mongod`)
- App running (`npm run dev`)
- Browser DevTools open (F12)

---

## 🧪 Test 1: Save Bookmark and Check Database

**Step 1: Create Account**
1. Go to `http://localhost:3000/signup`
2. Create account with email: `test@example.com`
3. Password: `password123`

**Step 2: Save an Article**
1. Find any news article
2. Click bookmark icon
3. See "Article saved!" notification
4. Icon becomes filled/highlighted

**Step 3: Check MongoDB**
1. Open MongoDB Compass
2. Go to `newshub` → `bookmarks`
3. **You should see 1 bookmark** ✓
4. Note the bookmark document

**Step 4: Refresh Page**
1. Refresh browser (F5)
2. Go to `/bookmarks`
3. **Bookmark still there** ✓

---

## 🔄 Test 2: Logout and Login Again

**Step 1: Logout**
1. Click "Logout" button (top-right)
2. Redirected to login page ✓

**Step 2: Check Console**
1. Press F12 → Console tab
2. You should see: `"Clearing bookmarks - user not authenticated"`

**Step 3: Login Again**
1. Enter same email: `test@example.com`
2. Password: `password123`
3. Click "Sign In"

**Step 4: Check Console**
1. You should see: `"Fetching bookmarks for authenticated user"`
2. Then bookmarks data logs (array of bookmarks)

**Step 5: Go to Bookmarks Page**
1. Click "Bookmarks" in navigation
2. **Bookmark still there!** ✓
3. You should see the same article you saved

---

## 📊 Test 3: Multiple Users

**Step 1: Create User 1**
- Email: `user1@example.com`
- Save 2 articles

**Step 2: Check MongoDB**
- Go to `newshub` → `bookmarks`
- Filter: `{"userId": ObjectId("...")}`  (user1's ID)
- Should see 2 bookmarks

**Step 3: Logout User 1**
- Click Logout

**Step 4: Create User 2**
- Go to `/signup`
- Email: `user2@example.com`
- Save 1 different article

**Step 5: Check MongoDB**
- Filter by user2's ID
- Should see only 1 bookmark (different article)
- User1's bookmarks still in database with different userId

**Step 6: Login as User 1 Again**
- Go to `/login`
- Email: `user1@example.com`
- Go to `/bookmarks`
- **See only user1's 2 articles** ✓
- User2's article NOT visible

---

## 🐛 Debugging If Bookmarks Disappear

**Check Console (F12)**
```
✓ "Fetching bookmarks for authenticated user" - Good
✗ No log = Hook not running
```

**Check Network Tab**
1. Go to `/bookmarks`
2. Open DevTools → Network tab
3. Look for `bookmarks` request
4. Status should be `200`
5. Response should have bookmarks array

**Check MongoDB**
1. Open MongoDB Compass
2. Click `bookmarks` collection
3. Search for your userId
4. Bookmarks should be there

**Common Issues:**

| Issue | Check |
|-------|-------|
| Bookmarks empty after login | Verify token is being sent in API request |
| "Please sign in" on bookmarks | User not authenticated - login again |
| MongoDB showing no data | Save an article first |
| Can't find your userId | Go to `users` collection and find it |

---

## ✅ Expected Behavior

```
Timeline of User1:
├── 1. Sign up
├── 2. Save Article A
├── 3. Save Article B (both in DB now)
├── 4. Logout
│   └── Bookmarks cleared from browser memory only
├── 5. Login as User1
│   └── Bookmarks fetched from database
└── 6. See Article A & B in /bookmarks ✓

Bookmarks ALWAYS in MongoDB:
- Never deleted on logout
- Fetched fresh when logging back in
```

---

## 🔍 What's Happening Behind the Scenes

```
User Logout:
  ↓
Local state cleared (bookmarks = {})
  ↓
JWT token removed from localStorage
  ↓
MongoDB still has all bookmarks ✓

User Login:
  ↓
JWT token created and stored
  ↓
useBookmarksDB detects authentication
  ↓
Fetches bookmarks from /api/bookmarks endpoint
  ↓
Server queries MongoDB for this user's bookmarks
  ↓
Returns bookmarks to frontend
  ↓
State updated with bookmarks
  ↓
UI shows bookmarks on /bookmarks page ✓
```

---

## 📝 Database Verification

**View all bookmarks:**
MongoDB Compass → `newshub` → `bookmarks` → See all documents

**View by user:**
Click "Filter" and enter:
```json
{"userId": ObjectId("PUT_USER_ID_HERE")}
```

**Count bookmarks:**
Click "Count" → Shows how many bookmarks this user has

---

## ✨ Everything Should Work!

- ✅ Bookmarks never deleted from database
- ✅ Only cleared from browser memory on logout
- ✅ Refetched from MongoDB on login
- ✅ Each user sees only their bookmarks
- ✅ Data persists forever in database

If bookmarks are disappearing, check the console for errors and verify MongoDB is running!
