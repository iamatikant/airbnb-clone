# MongoDB Setup Guide for Airbnb Clone API

## Step 1: Set Up MongoDB Atlas (Cloud Database)

### Option A: MongoDB Atlas (Recommended - Free Tier Available)

1. **Create a MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose the FREE tier (M0 Sandbox)
   - Select a cloud provider and region (choose closest to you)
   - Click "Create"

3. **Create Database User**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a username and password (save these!)
   - Set privileges to "Atlas admin" or "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development) or add your IP
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/`)
   - Replace `<username>` and `<password>` with your database user credentials
   - Add your database name at the end: `/airbnb-clone`

### Option B: Local MongoDB

If you prefer to run MongoDB locally:

1. **Install MongoDB**
   ```bash
   # macOS (using Homebrew)
   brew tap mongodb/brew
   brew install mongodb-community
   brew services start mongodb-community
   ```

2. **Connection String**
   ```
   MONGO_URL=mongodb://localhost:27017/airbnb-clone
   ```

## Step 2: Create .env File

1. Copy the example file:
   ```bash
   cd api
   cp .env.example .env
   ```

2. Edit `.env` and replace with your MongoDB connection string:
   ```env
   MONGO_URL=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/airbnb-clone
   PORT=4000
   ```

   **Important:** Replace:
   - `yourusername` - Your MongoDB Atlas database username
   - `yourpassword` - Your MongoDB Atlas database password
   - `cluster0.xxxxx.mongodb.net` - Your cluster URL from Atlas
   - Keep `/airbnb-clone` at the end (this is your database name)

## Step 3: Install Dependencies

Dependencies are already installed, but if you need to reinstall:

```bash
cd api
npm install
```

## Step 4: Run the Backend Server

```bash
cd api
npm start
```

The server will start on **http://localhost:4000**

You should see the server running. Test it by visiting:
- http://localhost:4000/test (should return `{"test":"working fine"}`)

## Troubleshooting

### Connection Error
- Make sure your MongoDB Atlas IP whitelist includes your current IP (or 0.0.0.0/0 for development)
- Verify your username and password are correct
- Check that your cluster is running (not paused)

### Port Already in Use
- Change PORT in `.env` to a different port (e.g., 4001)
- Or stop the process using port 4000

### Uploads Directory
- The `uploads/` directory is automatically created
- If you get errors about missing uploads folder, run: `mkdir -p uploads`

## API Endpoints

Once running, your API will be available at:
- `GET http://localhost:4000/test` - Test endpoint
- `POST http://localhost:4000/register` - User registration
- `POST http://localhost:4000/login` - User login
- `GET http://localhost:4000/profile` - Get user profile
- `GET http://localhost:4000/places` - Get all places
- `POST http://localhost:4000/places` - Create a place (requires auth)
- And more...

