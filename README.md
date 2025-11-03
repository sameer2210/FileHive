📂 FileHive – Cloud Storage

A modern React + Vite front-end for the Cloud Storage Assignment.
This project follows industry-level folder structure, uses Redux Toolkit for state management, Axios for API calls, and Tailwind CSS for styling.

https://drive-ai-seven.vercel.app/

## Features

- Authentication (Login & Signup with Redux)
- Folder Management (Create & List Folders)
- Image Management (Upload & Search Images)
- Responsive UI with Tailwind CSS
- Modern project structure with feature-based organization
- Fast build and dev server using Vite

## How It Works

## Auth

LoginForm.jsx and SignupForm.jsx handle forms
authSlice.js manages auth state (token, user)
authService.js communicates with backend APIs

## Folders

CreateFolder.jsx creates new folders
FolderList.jsx lists all folders
folderSlice.js manages folder state

## Images

UploadImage.jsx uploads images
SearchImages.jsx filters/searches images
imageSlice.js manages image state

## Global State

Configured inside redux/store.js using Redux Toolkit

## API Calls

Centralized in services/ using Axios
axiosInstance.js manages baseURL + interceptors

🎨 Styling
Tailwind CSS for utility-first styling
Custom components inside components/
Layouts (AuthLayout, MainLayout) wrap pages

🔑 Scripts
npm run dev → Run development server
npm run build → Build production-ready app
npm run preview → Preview production build

✅ Best Practices Followed
Feature-based folder structure
Separation of services (API) and state (Redux slices)
Centralized axiosInstance for cleaner API calls
Clean UI with Tailwind
Easy-to-understand auth, folders, images feature separation

## FrontEnd folder Stracture

FrontEnd/
│── index.html
│── package.json
│── vite.config.js
│── src/
│ │── main.jsx
│ │── App.jsx
│ │── index.css
│ │
│ ├── assets/ # Static images, icons, svgs
│ │
│ ├── components/ # Reusable UI components
│ │ ├── Navbar.jsx
│ │ ├── FolderCard.jsx
│ │ ├── ImageCard.jsx
| | ├── SideBar.jsx
│ │ └── Loader.jsx
│ │
│ ├── features/ # Feature based structure (Redux slices / hooks)
│ │ ├── auth/
│ │ │ └── authSlice.js
│ │ │
│ │ ├── folders/
│ │ │ ├── FolderList.jsx
│ │ │ ├── CreateFolder.jsx
│ │ │ └── folderSlice.js
│ │ │
│ │ ├── images/
│ │ │ ├── UploadImage.jsx
│ │ │ ├── SearchImages.jsx
│ │ │ └── imageSlice.js
│ │
│ ├── layouts/ # Common layouts
│ │ ├── AuthLayout.jsx
│ │ └── MainLayout.jsx
│ │
│ ├── pages/ # Full pages
│ │ ├── Home.jsx
│ │ ├── Dashboard.jsx
│ │ ├── Login.jsx
│ │ ├── Signup.jsx
│ │ └── NotFound.jsx
│ │
│ ├── redux/ # Redux store config
│ │ └── store.js
│ │
│ ├── services/ # API calls (Axios)
│ │ ├── authService.js
│ │ ├── folderService.js
│ │ └── imageService.js
│ │
│ └── utils/ # Helper functions
│ └── axiosInstance.js

🔄 Data Flow
User Action (Create Folder/Upload Image)
↓
Component dispatches action
↓
Redux Thunk makes API call
↓
Success: Update Redux state
↓
Component callback fires (onFolderCreated/onImageUploaded)
↓
Fetch updated data from server
↓
useMemo hooks recompute (recentFolders, recentImages, activity)
↓
UI updates automatically with fresh data

# Backend – FileHive

Built using Node.js, Express, MongoDB, Cloudinary, JWT Authentication.

## Deployment

**Backend Base URL:** https://drive-ai.onrender.com/

**Important:** Frontend should use the full URL including `/api` prefix:

- Correct: `https://drive-ai.onrender.com/api/auth/login`
- Wrong: `https://drive-ai.onrender.com/auth/login`

## 🛠️ Features

- **User Authentication**: Signup, Login with JWT-based sessions
- **OTP System**: Email verification with One-Time Password
- **Folder Management**: Create nested folders (like Google Drive)
- **Image Upload**: Upload images to Cloudinary with Multer
- **User Isolation**: Users can only access their own folders & images
- **Image Search**: Search images by name
- **Secure Routes**: Protected with authentication middleware
- **Error Handling**: Centralized error handling with middleware
- **Database**: MongoDB integration with Mongoose
- **Caching**: Redis integration for improved performance

## 🏗️ Tech Stack

- **Runtime**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
- **Caching**: Redis
- **Email Service**: Resend for OTP delivery
- **File Storage**: Cloudinary (for image storage)
- **Authentication**: JWT (JSON Web Tokens)
- **File Handling**: Multer (multipart/form-data)
- **Utilities**: dotenv, cors, morgan, cookie-parser, streamifier

## 📁 Project Structure

```
Backend/
│
├── server.js              # Entry point
├── .env                   # Environment variables
├── package.json           # Dependencies
├── FileHive_postman_collection.json  # API collection for Postman
└── src/
    ├── app.js            # Express app configuration
    ├── testRedis.js      # Redis testing utilities
    ├── config/
    │   ├── db.js        # MongoDB connection
    │   └── redis.js     # Redis configuration
    ├── controllers/
    │   ├── auth.controller.js    # User authentication logic
    │   ├── folder.controller.js  # Folder CRUD operations
    │   ├── image.controller.js   # Image upload/management
    │   └── otp.controller.js     # OTP verification logic
    ├── middleware/
    │   ├── auth.middleware.js    # JWT verification
    │   └── error.middleware.js   # Global error handling
    ├── models/
    │   ├── user.model.js         # User schema
    │   ├── folder.model.js       # Folder schema
    │   ├── image.model.js        # Image schema
    │   └── otp.model.js          # OTP schema
    ├── routes/
    │   ├── auth.routes.js        # Authentication endpoints
    │   ├── folder.routes.js      # Folder endpoints
    │   ├── image.routes.js       # Image endpoints
    │   └── otp.routes.js         # OTP endpoints
    └── utils/
        ├── cloudinary.js         # Cloudinary configuration
        ├── generateToken.js      # JWT token generation
        └── sendEmail.js          # Email service configuration
```

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
