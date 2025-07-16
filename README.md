# Authentication-Only App

A minimal authentication system with user registration, login, profile management, and logout. Built with Node.js, Express, MongoDB, and React.

## Features

- 🔐 User Registration (username, email, password, photo)
- 🔑 User Login
- 👤 User Profile (view & update photo)
- 🚪 Logout

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Quick Start

### 1. Install Dependencies

```bash
# Install all dependencies (root, server, and client)
npm install
cd server && npm install && cd ../client && npm install && cd ..
```

### 2. Set Up Environment

Create a `.env` file in the `server` directory:

```env
MONGODB_URI=mongodb://localhost:27017/auth-demo
JWT_SECRET=your-secret-key-here
PORT=8080
```

### 3. Start the Application

```bash
# Start both server and client simultaneously (if you have a script)
npm run dev

# Or start them separately:
cd server && npm start
# In another terminal:
cd client && npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **API Documentation**: http://localhost:8080/api
- **Health Check**: http://localhost:8080/ping

## Project Structure

```
project-root/
├── client/                 # React frontend
│   ├── src/
│   │   ├── Authorisation/  # Auth context & config
│   │   ├── Pages/          # Register, Login, ProfilePage
│   └── package.json
├── server/                 # Node.js backend
│   ├── controllers/        # AuthController.js
│   ├── models/             # User.js
│   ├── routes/             # AuthRouter.js
│   ├── middlewares/        # Auth.js
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user (username, email, password, photo)
- `POST /api/auth/login` - Login user (email, password)
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (photo, protected)
- `POST /api/auth/logout` - Logout user (protected)
- `GET /api/auth/verify` - Verify JWT token (protected)

## Usage

1. **Register**: Create a new account with username, email, password, and optional photo.
2. **Login**: Sign in with your email and password.
3. **Profile**: View your profile and update your photo.
4. **Logout**: Log out securely.

## Troubleshooting

- **Port already in use**: Change the PORT in server/.env
- **MongoDB connection failed**: Check your MongoDB connection string
- **CORS errors**: Ensure the server is running on the correct port

## License

This project is licensed under the ISC License.
