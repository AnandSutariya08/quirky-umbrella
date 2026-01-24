# Blog Seed Data

This directory contains seed data and scripts to populate your Firestore database with sample blog posts.

## Files

- `seed-blogs.json` - JSON file containing all blog post data
- `seed-blogs.js` - Node.js script to upload the seed data to Firestore

## Quick Start

### Option 1: Using Firebase Console (Easiest)

1. Open your Firebase Console
2. Go to Firestore Database
3. Create a collection named `blogs` (if it doesn't exist)
4. For each blog in `seed-blogs.json`:
   - Click "Add document"
   - Choose "Auto ID" for document ID
   - Copy the blog object from the JSON file
   - Convert date strings to Timestamps:
     - `publishedDate`: Convert to Timestamp
     - `createdAt`: Set to current Timestamp
     - `updatedAt`: Set to current Timestamp
   - Add `views: 0` and `likes: 0`
   - Save the document

### Option 2: Using Firebase CLI

1. Install Firebase CLI if you haven't: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Use the import command (if you have a backup file)
4. Or use the Node.js script below

### Option 3: Using Node.js Script

1. Install Firebase Admin SDK:
   ```bash
   npm install firebase-admin
   ```

2. Set up authentication:
   - **For local development**: Use Firebase Emulator or service account
   - **For production**: Download service account key from Firebase Console
     - Go to Project Settings > Service Accounts
     - Click "Generate new private key"
     - Save the JSON file securely

3. Update `seed-blogs.js` with your authentication method

4. Run the script:
   ```bash
   node scripts/seed-blogs.js
   ```

## Data Structure

Each blog post in the seed file contains:

- `title` - Blog post title
- `slug` - URL-friendly identifier
- `excerpt` - Short description for listings
- `contentHtml` - Full blog content in HTML
- `thumbnailUrl` - Image for blog listings
- `thumbnailAlt` - Alt text for thumbnail
- `featuredImage` - Large image for blog detail page
- `featuredImageAlt` - Alt text for featured image
- `category` - Blog category
- `tags` - Array of tags
- `author` - Author object with name, avatar, avatarAlt
- `readTime` - Estimated reading time in minutes
- `isFeatured` - Boolean for featured posts
- `status` - "published", "draft", or "scheduled"
- `metaTitle` - SEO meta title
- `metaDescription` - SEO meta description
- `publishedDate` - ISO date string (will be converted to Timestamp)

## Notes

- The script automatically adds:
  - `createdAt` - Current timestamp
  - `updatedAt` - Current timestamp
  - `views` - Initialized to 0
  - `likes` - Initialized to 0

- Date strings in the JSON are converted to Firestore Timestamps automatically

- Make sure your Firestore security rules allow writes (for seeding only, restrict in production)

## Firestore Security Rules

After seeding, make sure your Firestore rules are secure:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access for published blogs
    match /blogs/{blogId} {
      allow read: if resource.data.status == 'published';
      allow write: if false; // Only allow writes from admin panel
    }
  }
}
```

## Troubleshooting

### "Permission denied" error
- Check your Firestore security rules
- Ensure you're authenticated properly
- For local development, use Firebase Emulator

### "Firebase not initialized" error
- Make sure Firebase Admin SDK is installed
- Check your authentication setup
- Verify environment variables are set correctly

### Date conversion issues
- Ensure date strings are in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)
- The script automatically converts them to Firestore Timestamps
