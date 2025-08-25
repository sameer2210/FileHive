
# 📂 Backend Drive_Ai


Built using **Node.js, Express, MongoDB, AWS S3, JWT Authentication**.

---

##  Features
- User authentication (signup, login, JWT auth)
- Folder CRUD operations
- Image upload (with Multer + AWS S3 storage)
- Secure routes with middleware
- Centralized error handling
- MongoDB integration with Mongoose

---

##  Tech Stack
- **Node.js** + **Express.js**
- **MongoDB + Mongoose**
- **AWS S3** (for file storage)
- **JWT** (for authentication)
- **Multer** (for file upload)
- **dotenv, cors, morgan, cookie-parser**



## API Routes
🔑 Auth

POST /api/auth/signup → Register user

POST /api/auth/login → Login user

📁 Folders

POST /api/folders → Create folder

GET /api/folders → Get all folders

DELETE /api/folders/:id → Delete folder

🖼️ Images

POST /api/images/upload → Upload image

GET /api/images/search?query= → Search images

DELETE /api/images/:id → Delete image



## Backend Folder Structure

Backend/
│── server.js
│── .env
│── package.json
│── README.md
│
├── src/
│   ├── app.js
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── folder.controller.js
│   │   └── image.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── error.middleware.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── folder.model.js
│   │   └── image.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── folder.routes.js
│   │   └── image.routes.js
│   ├── services/
│   │   ├── s3.service.js
│   │   └── token.service.js
│   └── utils/
│       └── generateToken.js
