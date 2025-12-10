# Strateg.In test techniques - API

A RESTful API backend for user authentication and profile management built with Node.js, Express, MongoDB, and JWT authentication.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Authentication Endpoints](#authentication-endpoints)
- [User Endpoints](#user-endpoints)
- [Project Structure](#project-structure)
- [Security](#security)
- [Future Improvements](#future-improvements)

## Features

- **User Registration**: Create new user accounts with secure password hashing
- **User Authentication**: JWT-based authentication system
- **Profile Management**: View and update your own user profile
- **User List**: Fetch all registered users
- **Password Security**: Bcrypt password hashing
- **Token-based Authorization**: Protected routes using JWT middleware

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js v5.2.1
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcrypt
- **Environment Variables**: dotenv
- **Development**: nodemon for auto-reload

## Installation

- Node.js (v14 or higher)
- MongoDB instance (local or cloud-based like MongoDB Atlas)
- npm or yarn package manager

```bash
git clone git@github.com:GigiJuliette/register-login-API.git
cd register-login-API
```

```bash
npm install
```

### Production Mode

```bash
npm start
```

### Development Mode (with auto-reload)

```bash
npm run dev
```

## API Documentation

### Authentication Endpoints

#### Register a New User

**POST** `/register`

Creates a new user account with hashed password.

**Request Body:**

```json
{
  "nickname": "Gigi",
  "email": "gigialiasjuliette@gmail.com",
  "password": "SecurePassword123",
  "name": "",
  "surname": "",
  "bio": "",
  "profileIcon_id": 0
}
```

_At register, unrequired field are empty string (or 0 for number fields). It allowed me set up /update easily_
_In my opinion, it's also better for UX to have a quick sign up form_

**Note**: Input validation is handled on the frontend.

---

#### Login

**POST** `/logIn`

Authenticates a user and returns a JWT token.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Success Response (200):**

```json
{
  "message": "Successfull login",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**

- **401 Unauthorized** - "Invalid email or password"
- **500 Internal Server Error**: "An error has occurred"

---

### User Endpoints

**All user endpoints require authentication. Include the JWT token in the Authorization header.**

#### Get All Users

**GET** `/users`

Retrieves a list of all registered users.

**Success Response (200):**

```json
[
  {
    "nickname": "Sonia",
    "bio": "Developer",
    "profileIcon_id": 4
  },
  {
    "nickname": "Noémie",
    "bio": "Web Designer",
    "profileIcon_id": 2
  }
]
```

**Error Responses:**

- **401 Unauthorized** - "Token missing"
- **403 Forbidden** - "Invalid or expired token"

---

#### Get Current User

**GET** `/myUser`

Retrieves the authenticated user's profile.

**Success Response (200):**

```json
{
  "nickname": "Gigi",
  "email": "gigialiasjuliette@gmail.com",
  "name": "Juliette",
  "surname": "De Meo",
  "bio": "Software developer at Strateg.In",
  "profileIcon_id": 5
}
```

**Error Responses:**

- **401 Unauthorized** - Missing token
- **403 Forbidden** - Invalid or expired token

---

#### Update User Profile

**PUT** `/update`

Updates the authenticated user's profile information.

**Request Body** (partial updates allowed):

```json
{
  "name": "New Value",
  "bio": "New value",
  "profileIcon_id": 3
}
```

**Success Response (200):**

```json
{
  "nickname": "Unchanged value",
  "email": "Unchanged value",
  "name": "New & updated value",
  "surname": "Unchanged value",
  "bio": "New & updated value",
  "profileIcon_id": "New & updated value"
}
```

**Error Responses:**

- **401 Unauthorized** - Missing token
- **403 Forbidden** - Invalid or expired token
- **404 Not Found** - User not found:

---

## Project Structure

```
strateg.In_tests-BACK/
├── index.js                    # Main application entry point
├── models/
│   └── User.js                 # User schema
├── middleware/
│   ├── auth.js                 # JWT authentication middleware
│   └── passwordsMethods.js     # Password hashing
├── .env                        # Environment variables
├── .env.sample                 # Environment variables template
├── package.json                # Project dependencies
└── README.md                   # This file
```

### File Descriptions

#### [index.js](index.js)

Main application file containing:

- Express server configuration
- CORS middleware setup
- All API route definitions
- MongoDB connection
- Server initialization

**Key Routes:**

- `POST /register` - User registration
- `POST /logIn` - User login
- `GET /users` - List all users (protected)
- `GET /myUser` - Get current user (protected)
- `PUT /update` - Update user profile (protected)

#### [models/User.js](models/User.js)

MongoDB user schema definition with Mongoose.

#### [middleware/auth.js](middleware/auth.js)

JWT authentication middleware (`authenticateToken`):

- Extracts JWT token from Authorization header
- Verifies token validity and expiration
- Attaches decoded user data to `req.user`
- Returns 401 if token is missing
- Returns 403 if token is invalid or expired

#### [middleware/passwordsMethods.js](middleware/passwordsMethods.js)

Password security utilities:

- `hashPassword(password)`: Hashes password with bcrypt
- `comparePassword(password, hashedPassword)`: Compares plain password with hash

## Security

### Password Security

- Passwords are hashed using **bcrypt** with 10 salt rounds
- Plain text passwords are never stored in the database
- Password comparison is done using secure bcrypt.compare()

### JWT Authentication

- Tokens are signed with a secret key from environment variables
- Tokens include user ID and email in the payload
- Token expiration time is configurable via `JWT_EXPIRES_IN`
- Protected routes require valid, non-expired tokens

### Data Privacy

- Passwords, MongoDB `_id`, and `__v` fields are excluded from all API responses
- User data is sanitized before being sent to clients

## Future Improvements

#### Password Reset with Email Verification

- Implement `POST /forgot-password` and `POST /reset-password` endpoints
- Generate unique JWT reset token with short expiration (15-30 minutes)
- Send password reset email with token link using nodemailer
- Verify token and update password securely

#### Get User by ID

- Create `GET /users/:id` protected endpoint
- Fetch detailed user profile information by ID
- Return full user data (excluding password)
- Useful for viewing profiles when clicking users from frontend

#### Email Verification on Registration

- Send verification email after registration
- User must verify email before accessing protected routes
- Add `isEmailVerified` field to User schema

#### User Roles and Permissions

- Add role-based access control
- Different user types: admin, moderator, user
- Restrict certain endpoints based on user role

#### Account Deletion

- Add `DELETE /myAccount` endpoint
- Soft delete option
- Require password confirmation before deletion

---

**Note**: This is a backend API only. A frontend application is required to interact with these endpoints.
