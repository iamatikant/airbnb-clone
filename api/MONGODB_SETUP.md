# MongoDB Atlas Setup Guide - Step by Step

Based on your API models (User, Place, Booking), here's the exact setup process:

## 📋 Your Database Schema Overview

Your app uses 3 collections:
- **users** - Stores user accounts (name, email, password)
- **places** - Stores property listings (references User as owner)
- **bookings** - Stores reservations (references User and Place)

MongoDB will automatically create these collections when you first use them - no manual setup needed!

---

## 🚀 Step-by-Step MongoDB Atlas Setup

### **Step 1: Create MongoDB Atlas Account**

1. Go to: **https://www.mongodb.com/cloud/atlas/register**
2. Click **"Try Free"** or **"Sign Up"**
3. Fill in:
   - Email address
   - Password
   - First/Last name
   - Company (optional - can skip)
4. Click **"Create your Atlas account"**
5. Verify your email if prompted

---

### **Step 2: Create Your First Cluster**

1. After logging in, you'll see **"Deploy a cloud database"**
2. Click **"Build a Database"** button
3. Choose **"M0 FREE"** tier (Free Forever)
   - This gives you 512MB storage - perfect for development
4. **Cloud Provider & Region:**
   - Choose AWS, Google Cloud, or Azure (doesn't matter for free tier)
   - Select a region closest to you (e.g., `N. Virginia (us-east-1)` for US)
   - Click **"Create"**
5. **Cluster Name:** Leave default `Cluster0` or rename to `airbnb-cluster`
6. Click **"Create Cluster"** (takes 3-5 minutes)

---

### **Step 3: Create Database User**

**This user will connect your app to MongoDB**

1. While cluster is building, you'll see **"Create Database User"** screen
2. **Authentication Method:** Choose **"Password"**
3. **Username:** Create a username (e.g., `airbnb-admin` or `yourname`)
   - ⚠️ **Save this username!**
4. **Password:** Click **"Autogenerate Secure Password"** or create your own
   - ⚠️ **Copy and save this password immediately!** (You won't see it again)
   - Example: `MySecurePass123!`
5. **Database User Privileges:** Select **"Atlas admin"** (full access)
6. Click **"Create Database User"**

**💡 Tip:** Save credentials in a secure place:
```
Username: airbnb-admin
Password: MySecurePass123!
```

---

### **Step 4: Configure Network Access**

**Allow your app to connect to MongoDB**

1. You'll see **"Where would you like to connect from?"**
2. For **development/testing**, choose:
   - **"My Local Environment"** - Adds your current IP
   - OR **"Allow Access from Anywhere"** - `0.0.0.0/0` (less secure but easier)
3. Click **"Finish and Close"**

**⚠️ Security Note:** 
- For production, use specific IP addresses
- For development, `0.0.0.0/0` is fine

---

### **Step 5: Get Your Connection String**

1. After cluster is created, click **"Connect"** button (green button)
2. Choose **"Connect your application"**
3. **Driver:** Select **"Node.js"** (version doesn't matter)
4. **Connection String:** You'll see something like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **Copy this connection string**

---

### **Step 6: Format Connection String for Your App**

Your app expects: `MONGO_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/airbnb-clone`

**Replace these parts:**

1. Replace `<username>` with your database username (from Step 3)
2. Replace `<password>` with your database password (from Step 3)
   - ⚠️ If password has special characters, URL-encode them:
     - `@` becomes `%40`
     - `#` becomes `%23`
     - `$` becomes `%24`
     - `%` becomes `%25`
     - `&` becomes `%26`
     - `+` becomes `%2B`
     - `=` becomes `%3D`
     - `?` becomes `%3F`
3. Replace the `?retryWrites=true&w=majority` part with `/airbnb-clone`
   - This sets your database name to `airbnb-clone`

**Example:**
```
Original: mongodb+srv://<username>:<password>@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority

After replacement: mongodb+srv://airbnb-admin:MySecurePass123%21@cluster0.abc123.mongodb.net/airbnb-clone
```

**Final format:**
```
MONGO_URL=mongodb+srv://airbnb-admin:MySecurePass123%21@cluster0.abc123.mongodb.net/airbnb-clone
```

---

### **Step 7: Create .env File**

1. Navigate to your `api` folder:
   ```bash
   cd /Users/atikant/Desktop/Atikant/repo/airbnb-clone/api
   ```

2. Create `.env` file:
   ```bash
   touch .env
   ```

3. Open `.env` in your editor and add:
   ```env
   MONGO_URL=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/airbnb-clone
   PORT=4000
   ```

4. Replace with your actual connection string from Step 6

**Example .env file:**
```env
MONGO_URL=mongodb+srv://airbnb-admin:MySecurePass123%21@cluster0.abc123.mongodb.net/airbnb-clone
PORT=4000
```

---

### **Step 8: Test the Connection**

1. Start your backend server:
   ```bash
   cd api
   npm start
   ```

2. You should see the server start without errors

3. Test the connection:
   ```bash
   curl http://localhost:4000/test
   ```
   Should return: `{"test":"working fine"}`

4. **Check MongoDB Atlas:**
   - Go back to Atlas dashboard
   - Click **"Browse Collections"**
   - You should see your database `airbnb-clone` appear
   - Collections (`users`, `places`, `bookings`) will be created automatically when you use them

---

## ✅ Verification Checklist

- [ ] MongoDB Atlas account created
- [ ] Free cluster (M0) created and running
- [ ] Database user created (username + password saved)
- [ ] Network access configured (IP whitelisted)
- [ ] Connection string copied and formatted correctly
- [ ] `.env` file created with `MONGO_URL`
- [ ] Backend server starts without errors
- [ ] `/test` endpoint returns success

---

## 🔍 Troubleshooting

### **Error: "authentication failed"**
- Double-check username and password in connection string
- Make sure special characters in password are URL-encoded
- Verify database user exists in Atlas

### **Error: "IP not whitelisted"**
- Go to Atlas → Network Access
- Add your current IP address
- Or temporarily allow `0.0.0.0/0` for development

### **Error: "connection timeout"**
- Check your internet connection
- Verify cluster is running (not paused) in Atlas
- Check firewall settings

### **Collections not appearing**
- This is normal! Collections are created automatically when you:
  - Register a user (creates `users` collection)
  - Create a place (creates `places` collection)
  - Make a booking (creates `bookings` collection)

---

## 📊 Your Database Structure (Auto-Created)

Once you start using the app, MongoDB will create:

### **users** collection
```javascript
{
  _id: ObjectId("..."),
  name: "John Doe",
  email: "john@example.com",  // unique index
  password: "hashed_password"
}
```

### **places** collection
```javascript
{
  _id: ObjectId("..."),
  owner: ObjectId("..."),  // references User
  title: "Beautiful Apartment",
  address: "123 Main St",
  photos: ["photo1.jpg", "photo2.jpg"],
  description: "Lovely place...",
  perks: ["wifi", "parking"],
  extraInfo: "Check-in after 3pm",
  checkIn: 14,
  checkOut: 11,
  maxGuest: 4,
  price: 100
}
```

### **bookings** collection
```javascript
{
  _id: ObjectId("..."),
  place: ObjectId("..."),  // references Place
  user: ObjectId("..."),    // references User
  checkIn: ISODate("2024-01-15"),
  checkOut: ISODate("2024-01-20"),
  name: "John Doe",
  phone: "123-456-7890",
  numberOfGuests: 2,
  price: 500
}
```

---

## 🎯 Quick Reference

**Database Name:** `airbnb-clone`  
**Collections:** `users`, `places`, `bookings` (auto-created)  
**Connection:** Uses Mongoose ODM  
**Port:** 4000 (backend), 5173 (frontend)

---

## 🚀 Next Steps

After MongoDB is set up:
1. Start backend: `cd api && npm start`
2. Start frontend: `cd client && npm run dev`
3. Register a user to create your first document
4. View data in Atlas → Browse Collections

