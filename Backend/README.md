### Backend – Drive_Ai

Built using Node.js, Express, MongoDB, Cloudinary, JWT Authentication.

## deployment link base url

[ Backend deployment ](https://drive-ai.onrender.com/)

but /api also need in frontend

## Features

User authentication (Signup, Login, JWT-based sessions)
Create nested folders (like Google Drive)
Upload images (with Multer + Cloudinary)
User-specific access → users can only access their own folders & images
Search images by name
Secure routes with authentication middleware
Centralized error handling with middleware
MongoDB integration with Mongoose

## Tech Stack

Node.js + Express.js
MongoDB + Mongoose
Cloudinary (for image storage)
JWT (for authentication)
Multer (for file handling)
dotenv, cors, morgan, cookie-parser

📌 API Routes
🔑 Auth

POST /api/auth/signup → Register a new user
POST /api/auth/login → Login user

## Folders

POST /api/folders → Create a folder (nested supported)
GET /api/folders → Get all folders of logged-in user
DELETE /api/folders/:id → Delete a folder

🖼️ Images

POST /api/images/upload → Upload an image to Cloudinary
GET /api/images/search?query= → Search images by name
DELETE /api/images/:id → Delete an image

📂 Backend Folder Structure
Backend/
│── server.js
│── .env
│── package.json
│── README.md
│
├── src/
│ ├── app.js
│ ├── config/
│ │ └── db.js
│ ├── controllers/
│ │ ├── auth.controller.js
│ │ ├── folder.controller.js
│ │ └── image.controller.js
│ ├── middleware/
│ │ ├── auth.middleware.js
│ │ └── error.middleware.js
│ ├── models/
│ │ ├── user.model.js
│ │ ├── folder.model.js
│ │ └── image.model.js
│ ├── routes/
│ │ ├── auth.routes.js
│ │ ├── folder.routes.js
│ │ └── image.routes.js
│ └── utils/
│ ├── cloudinary.js
│ └── generateToken.js
