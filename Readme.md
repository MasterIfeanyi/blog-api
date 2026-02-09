# Blog REST API

A comprehensive RESTful API for a blog platform built with Node.js, Express, and MongoDB. Features include JWT authentication, user authorization, CRUD operations for blog posts, advanced filtering, and soft delete functionality.


## Features

- User registration and login with JWT
- Create, read, update, and delete blog posts
- Draft and published post states

## 🛠 Tech Stack

- **Runtime**: `Node.js`
- **Framework**: `Express.js`
- **Database**: `MongoDB`
- **ODM**: `Mongoose`
- **Authentication**: `JWT (JSON Web Tokens)`
- **Password Hashing**: `bcryptjs`
- **Validation**: `express-validator`
- **Slug Generation**: `slugify`


## Installation

1. **Clone the repository** (or extract the files)

```bash
cd blog-api
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

4. **Configure your environment variables** (see below)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
    # Server Configuration
    PORT=5000
    NODE_ENV=development

    # Database
    MONGODB_URI=mongodb://localhost:27017/blog-api
    # For MongoDB Atlas, use: mongodb+srv://username:password@cluster.mongodb.net/blog-api

    # JWT
    JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars
    JWT_EXPIRE=7d
```

## Running the Application

### Development Mode (with auto-restart)

```bash
    npm run dev
```

### Production Mode

```bash
    npm start
```

The API will be available at `http://localhost:5000`


## Sample API Requests

### 1. Register User

- **Endpoint**: `POST /api/auth/register`
- **Request Body**:

    ```javascript
        {
            "name": "John Doe",
            "email": "john@example.com",
            "password": "password123"
        }
    ```

### 2. Login User

- **Endpoint**: `POST /api/auth/login`
- **Request Body**:

    ```javascript
        {
            "email": "john@example.com",
            "password": "password123"
        }
    ```

### 3. Create Post

- **Endpoint**: `POST /api/posts`
- **Headers**: Authorization: Bearer <your_jwt_token>
- **Request Body**:

    ```javascript
        {
            "title": "My First Post",
            "content": "This is the description of my first post.",
            "status": "published",
            "tags": ["nodejs", "express", "mongodb"]
        }
    ```

### 4. Get All Posts

- **Endpoint**: `GET /api/posts`
- **Headers**: `Authorization: Bearer <token>` (optional)
- **Query Parameters**:
    `page` (default: 1): Page number for pagination
    `limit` (default: 10, max: 100): Number of posts per page
- **Examples**:
  
```javascript
    GET /api/posts?page=1&limit=10
    GET /api/posts?search=nodejs
```

### 5. Delete Post (Soft Delete)

- **Endpoint**: `DELETE /api/posts/:id`
- **Headers**: `Authorization: Bearer <token>`
