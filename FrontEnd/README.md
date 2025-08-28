📂 FrontEnd – Cloud Storage

A modern React + Vite front-end for the Cloud Storage Assignment.
This project follows industry-level folder structure, uses Redux Toolkit for state management, Axios for API calls, and Tailwind CSS for styling.

## Features
* Authentication (Login & Signup with Redux)
* Folder Management (Create & List Folders)
* Image Management (Upload & Search Images)
* Responsive UI with Tailwind CSS
* Modern project structure with feature-based organization
* Fast build and dev server using Vite

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
