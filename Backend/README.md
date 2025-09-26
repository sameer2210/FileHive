# Backend – FileHive

Built using Node.js, Express, MongoDB, Cloudinary, JWT Authentication.

## Deployment

**Backend Base URL:** https://drive-ai.onrender.com/

**Important:** Frontend should use the full URL including `/api` prefix:

- Correct: `https://drive-ai.onrender.com/api/auth/login`
- Wrong: `https://drive-ai.onrender.com/auth/login`

## 🛠️ Features

- **User Authentication**: Signup, Login with JWT-based sessions
- **Folder Management**: Create nested folders (like Google Drive)
- **Image Upload**: Upload images to Cloudinary with Multer
- **User Isolation**: Users can only access their own folders & images
- **Image Search**: Search images by name
- **Secure Routes**: Protected with authentication middleware
- **Error Handling**: Centralized error handling with middleware
- **Database**: MongoDB integration with Mongoose

## 🏗️ Tech Stack

- **Runtime**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
- **File Storage**: Cloudinary (for image storage)
- **Authentication**: JWT (JSON Web Tokens)
- **File Handling**: Multer (multipart/form-data)
- **Utilities**: dotenv, cors, morgan, cookie-parser, streamifier

## 📡 API Routes

### 🔑 Authentication

```
POST /api/auth/signup → Register a new user
POST /api/auth/login → Login user
```

### 📁 Folders

```
POST /api/folders → Create a folder (nested supported)
GET /api/folders → Get all folders of logged-in user
DELETE /api/folders/:id → Delete a folder
```

### 🖼️ Images

```
POST /api/images/upload → Upload an image to Cloudinary
GET /api/images/search?query= → Search images by name
DELETE /api/images/:id → Delete an image
```

## ⚙️ Environment Variables

Create a `.env` file in the root directory with:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key

# Cloudinary (Required for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Server
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend-domain.com
```

## Quick Start

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Set Environment Variables**

   - Copy `.env.example` to `.env` (if exists)
   - Fill in your MongoDB and Cloudinary credentials

3. **Start Development Server**

   ```bash
   npm run dev
   ```

4. **Start Production Server**
   ```bash
   npm start
   ```

## 📁 Project Structure

```
Backend/
│
├── server.js              # Entry point
├── .env                   # Environment variables
├── package.json           # Dependencies
└── README.md             # This file
│
└── src/
    ├── app.js            # Express app configuration
    ├── config/
    │   └── db.js        # MongoDB connection
    ├── controllers/
    │   ├── auth.controller.js    # User authentication logic
    │   ├── folder.controller.js  # Folder CRUD operations
    │   └── image.controller.js   # Image upload/management
    ├── middleware/
    │   ├── auth.middleware.js    # JWT verification
    │   └── error.middleware.js   # Global error handling
    ├── models/
    │   ├── user.model.js         # User schema
    │   ├── folder.model.js       # Folder schema
    │   └── image.model.js        # Image schema
    ├── routes/
    │   ├── auth.routes.js        # Authentication endpoints
    │   ├── folder.routes.js      # Folder endpoints
    │   └── image.routes.js       # Image endpoints
    └── utils/
        ├── cloudinary.js         # Cloudinary configuration
        └── generateToken.js      # JWT token generation
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **User Isolation**: Users can only access their own data
- **CORS Protection**: Configured to allow specific origins only
- **Input Validation**: Multer file size limits (10MB max)
- **Error Handling**: No sensitive information leaked in errors

## 📝 Important Notes

- **Image Upload**: Requires Cloudinary credentials to be set
- **File Size Limit**: Maximum 10MB per image
- **Supported Formats**: PNG, JPG, GIF, and other image formats
- **Authentication**: All routes except `/api/auth/*` require valid JWT token
- **CORS**: Configured for both local development and production frontends

## 🐛 Troubleshooting

- **Upload Fails**: Check Cloudinary environment variables
- **Database Connection**: Verify MongoDB URI in `.env`
- **CORS Issues**: Ensure frontend URL is in `FRONTEND_URL` env var
- **JWT Errors**: Check `JWT_SECRET` is set and consistent

## 📚 Dependencies

- **bcryptjs**: Password hashing
- **cloudinary**: Image storage service
- **cookie-parser**: Cookie parsing middleware
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management
- **express**: Web framework
- **jsonwebtoken**: JWT implementation
- **mongoose**: MongoDB ODM
- **morgan**: HTTP request logger
- **multer**: File upload middleware
- **streamifier**: Buffer to stream conversion
