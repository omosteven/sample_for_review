# Software Engineering Task: User Profile and Social Media Feed

## Overview

Objective: Implement a basic backend system for a user profile and social media feed using any programming language and database of your choice. You are encouraged to be creative and may add additional features to enhance the functionality and user experience.

## Features

- User registration
- User login with JWT authentication
- Profile management (view, update, delete profile picture)
- Account deactivation and deletion
- Making posts with text content and/or picture
- Like/Unlike post
- Add/remove comments on a post
- View all posts
- View all post comments
- Search posts by tags
- General user authentication and authorization
- Logging of user errors
- Realtime updates on posts and comments
- Media Upload

## Technologies Used

- Node.js
- Express
- MongoDB
- Mongoose
- JWT (JSON Web Token)
- TypeScript
- Bcrypt
- SocketIO

## Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:

- Node.js (version >= 14.x.x)
- MongoDB

### Installation

1. Clone the repository:

```bash
git clone https://github.com/omosteven/voltrox_engineering_task.git
cd auth-nodejs-app
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env` file in the root of the project and add the following:

```plaintext
PROD_DATABASE=mongodb://localhost:27017/auth-app
DEV_DATABASE=mongodb://localhost:27017/auth-app
JWT_SECRET_KEY=your_jwt_secret_key
NODE_ENV=development
PORT=3000
```

### Running the App

Start the MongoDB server if it's not already running:

```bash
mongod
```
Build the app:

```bash
npm run build
```

Run the app:

```bash
npm run dev
```

or

```bash
nodemon
```

The server should be running on `http://localhost:3000`.

## API Endpoints

### Auth Routes

- **POST** `/auth/register`: Register a new user
- **POST** `/auth/login`: Login and get a JWT token

### User Routes

- **GET** `/user/me`: Get user profile (requires JWT)
- **PATCH** `/user/me`: Update user profile (requires JWT)
- **DELETE** `/user/me`: Delete user account (requires JWT)
- **PATCH** `/user/me/deactivate`: Deactivate user account (requires JWT)
- **DELETE** `/user/me/picture`: Delete user profile picture (requires JWT)

## Posts Routes

- **GET** `/posts`: Get all posts with pagination and search (requires JWT)
- **GET** `/posts/mine`: Get my only posts (requires JWT)
- **POST** `/posts/create`: Make a new post (requires JWT)
- **GET** `/posts/:postId`: Get a particular post info (requires JWT)
- **PATCH** `/posts/:postId`: update my own post content (requires JWT)
- **DELETE** `/posts/:postId`: Delete my post (requires JWT)
- **PUT** `/posts/like/:postId`: Like a post (requires JWT)
- **GET** `/posts/tags`:Search posts by tag (requires JWT)
- **GET** `/tags`: Fetch all Tags (requires JWT)
- **POST** `/posts/comments/:postId`: Add comment to a post (requires JWT)
- **PUT** `/posts/comments/:commentId`: Edit a post comment (requires JWT)
- **DELETE** `/posts/comments/:commentId`: Delete a post comment (requires JWT)
- **GET** `/posts/comments/:postId`: Fetch all post comments (requires JWT)

## Utiliy Routes

- **GET** `/media/upload`: To upload a file to cloudinary

## Socket Events

- **POST_UPDATE** : Triggers real time update such as new like, new comment on any post
- **NEW_POST_CREATION** : Triggers  when a new post is created
- **POST_REMOVAL** : Triggers when a post is deleted
- **NEW_POST_COMMENT** : Triggers when a comment is added to a post. It returns the comment and respective postId
- **POST_COMMENT_UPDATE** : Triggers when a comment is updated
- **POST_COMMENT_REMOVAL** - Triggers when a comment is deleted

## Note
The data returned from each socket event are not full (because of optimization) but enough for to use to make update on the client

## Note
The path alias is not recognized. It will be fixed soon

## Sample Usage

### Register a New User

```bash
curl -X POST http://localhost:8000/auth/register -H "Content-Type: application/json" -d '{"email": "user@example.com", "password": "password123", "firstName": "John", "lastName": "Doe"}'
```

### Login

```bash
curl -X POST http://localhost:8000/auth/login -H "Content-Type: application/json" -d '{"email": "user@example.com", "password": "password123"}'
```

### Get User Profile

```bash
curl -X GET http://localhost:8000/user/me -H "Authorization: Bearer <your_jwt_token>"
```

It is recommended to test with postman

## Project Structure

```
.
├── dist
├── node_modules
├── src
│   ├── app
│   │   ├── controllers
│   │   │   ├── users
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── profile.controller.ts
│   │   │   ├── posts
│   │   │   │   ├── posts.controller.ts
│   │   │   │   ├── comments.controller.ts
│   │   │   │   ├── tags.controller.ts
│   │   ├── hooks
│   │   │   │   ├── comments.model.hook.ts
│   │   │   │   ├── posts.model.hook.ts
│   │   ├── middleware
│   │   │   ├── auth.middleware.ts
│   │   ├── models
│   │   │   ├── users
│   │   │   │   ├── users.model.ts
│   │   │   ├── posts
│   │   │   │   ├── posts.model.ts
│   │   │   │   ├── comments.model.ts
│   │   │   │   ├── tags.model.ts
│   │   │   ├── logs
│   │   │   │   ├── errors.logs.model.ts
│   │   ├── enums
│   │   │   ├── index.ts
│   │   ├── helpers
│   │   │   ├── index.ts
│   │   ├── routes
│   │   │   ├── index.ts
│   │   ├── utils
│   │   │   ├── resp-handlers
│   │   │   ├── ├── resp-handlers.ts
│   │   ├── services
│   │   │   ├── media
│   │   │   ├── ├── index.ts
│   │   ├── types
│   │   ├── ├── users
│   │   │   │   ├── users.types.ts
│   │   ├── ├── posts
│   │   │   │   ├── posts.types.ts
│   │   ├── ├── helpers
│   │   │   │   ├── helpers.types.ts
│   │   ├── utils
│   │   ├── ├── resp-handlers
│   │   │   │   ├── index.ts
│   ├── config
│   │   ├── config.ts
│   │   ├── database.ts
│   ├── socket
│   │   ├── events
│   │   ├── ├── index.ts
│   │   ├── middlewares
│   │   ├── ├── socketAuth.middleware.ts
│   │   ├── index.ts
│   ├── server.ts
├── package.json
├── tsconfig.json
├── package-lock.json
├── .env
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any questions or feedback, please contact [omosteven123@gmail.com](mailto:omosteven123@gmail.com).

Name - Steven Omole-Adebomi
Github - https://github.com/omosteven

---

Feel free to customize this README to fit your project's specific needs and details.
