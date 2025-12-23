# Cloudinary Setup Guide

## Step 1: Create Cloudinary Account

1. Go to **https://cloudinary.com/users/register/free**
2. Sign up for a **free account** (no credit card required)
3. Verify your email address

## Step 2: Get Your Cloudinary Credentials

1. After logging in, you'll see your **Dashboard**
2. Look for the **"Account Details"** section or click on your account name
3. You'll see three important values:
   - **Cloud Name** (e.g., `dxyz123abc`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

**⚠️ Important:** Keep your API Secret secure! Never commit it to git.

## Step 3: Add Credentials to .env File

Add these three lines to your `api/.env` file:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**Example:**
```env
MONGO_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/airbnb-clone
PORT=4000
CLOUDINARY_CLOUD_NAME=dxyz123abc
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

## Step 4: Restart Your Server

```bash
cd api
npm start
```

## Step 5: Test the Integration

1. **Upload an image** through your app
2. Check that the image URL in the database is a Cloudinary URL (starts with `https://res.cloudinary.com/`)
3. Verify images load correctly in your frontend

## What Changed?

### Before (Local Storage):
- Images stored in `api/uploads/` directory
- Database stored filenames: `"photos123.jpg"`
- URLs: `http://localhost:4000/uploads/photos123.jpg`

### After (Cloudinary):
- Images stored in Cloudinary cloud
- Database stores full URLs: `"https://res.cloudinary.com/your-cloud/image/upload/v1234567890/airbnb-clone/photos123.jpg"`
- URLs: Direct Cloudinary CDN URLs (faster, global)

## Benefits

✅ **Scalable:** Unlimited storage (25GB free tier)  
✅ **Fast:** CDN delivery worldwide  
✅ **Reliable:** Automatic backups and redundancy  
✅ **Optimized:** Automatic image optimization  
✅ **Easy Deployment:** No file sync issues  

## Free Tier Limits

- **Storage:** 25GB
- **Bandwidth:** 25GB/month
- **Transformations:** 25,000/month

Perfect for small to medium applications!

## Troubleshooting

### Error: "Invalid API Key"
- Double-check your credentials in `.env`
- Make sure there are no extra spaces
- Restart your server after updating `.env`

### Error: "Upload failed"
- Check your internet connection
- Verify Cloudinary account is active
- Check Cloudinary dashboard for usage limits

### Images not showing
- Verify the URL in database starts with `https://res.cloudinary.com/`
- Check browser console for errors
- Ensure Image component handles `https://` URLs (it should!)

## Migration from Local Storage

If you have existing local images:

1. **Option 1:** Re-upload through the app (easiest)
2. **Option 2:** Bulk upload script (for many images):
   ```javascript
   // Run this once to migrate existing images
   const cloudinary = require('cloudinary').v2;
   const fs = require('fs');
   const path = require('path');
   
   const uploadsDir = path.join(__dirname, 'uploads');
   const files = fs.readdirSync(uploadsDir);
   
   for (const file of files) {
     const filePath = path.join(uploadsDir, file);
     const result = await cloudinary.uploader.upload(filePath, {
       folder: 'airbnb-clone'
     });
     console.log(`Uploaded: ${file} -> ${result.secure_url}`);
   }
   ```

## Next Steps

- ✅ Images now stored in cloud
- ✅ No more local file management
- ✅ Better performance with CDN
- ✅ Ready for production deployment

Your app is now using industry-standard cloud storage! 🎉

