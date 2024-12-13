# Blogd Backend Documentation

## Table of Contents

- [Blogd Backend Documentation](#blogd-backend-documentation)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Server Setup](#server-setup)
  - [Dependencies](#dependencies)
  - [Configuration](#configuration)
  - [Project Structure](#project-structure)
  - [Models](#models)
    - [User Model](#user-model)
    - [Session Model](#session-model)
    - [Post Model](#post-model)
    - [Comment Model](#comment-model)
  - [Middleware](#middleware)
    - [Authentication Middleware](#authentication-middleware)
    - [Sanitize Middleware](#sanitize-middleware)
    - [Upload Middleware](#upload-middleware)
  - [Controllers](#controllers)
    - [User Controller](#user-controller)
    - [Session Controller](#session-controller)
    - [Post Controller](#post-controller)
    - [Comment Controller](#comment-controller)
    - [Auth Controller](#auth-controller)
  - [Routes](#routes)
    - [Authentication Routes](#authentication-routes)
    - [User Management Routes](#user-management-routes)
    - [Post Management Routes](#post-management-routes)
    - [Comment Management Routes](#comment-management-routes)
    - [Session Management Routes](#session-management-routes)
  - [Validators](#validators)
    - [Post Validators](#post-validators)
    - [Comment Validators](#comment-validators)
  - [Utilities](#utilities)
    - [Sanitize Content](#sanitize-content)
    - [Logger](#logger)
    - [Image Helpers](#image-helpers)
  - [Configuration Files](#configuration-files)
    - [Cloudinary Configuration](#cloudinary-configuration)
    - [Environment Variables](#environment-variables)
  - [Database Connection](#database-connection)

## Introduction

**Blogd** is a hypothetical blogging platform built as a full-stack MERN (MongoDB, Express.js, React.js, Node.js) application. This documentation covers the backend server setup, models, middleware, controllers, routes, validators, utilities, and configuration files used in the application.

## Server Setup

The backend server is initialized in `server.js` and is responsible for:

- **Environment Variables**: Loads using `dotenv` to manage configurations like `PORT`, `MONGO_URI`, and `JWT_SECRET`.
- **Database Connection**: Establishes a connection to MongoDB using Mongoose in `db/connection.js`.
- **Middleware Setup**: Configures middleware for CORS (`cors`), security headers (`helmet`), logging (`morgan`), JSON parsing (`express.json()`), and custom middleware.
- **API Routes**: Defines routes with appropriate prefixes for authentication, user management, posts, comments, and sessions.
- **Global Error Handling**: Implements a global error handler to catch and log errors using a custom logger.
- **Server Initialization**: Starts the Express server on the specified port.

## Dependencies

The backend relies on various npm packages:

- **Express.js**: Web framework for Node.js.
- **Mongoose**: MongoDB object modeling tool.
- **dotenv**: For environment variable management.
- **Helmet**: Secures Express apps by setting various HTTP headers.
- **Morgan**: HTTP request logger middleware.
- **Winston**: Logging library with support for multiple transports.
- **bcrypt**: For password hashing.
- **jsonwebtoken**: Implements JWT-based authentication.
- **express-validator**: Middleware for validating request bodies.
- **sanitize-html**: Sanitizes user input to prevent XSS attacks.
- **multer**: Middleware for handling `multipart/form-data`, primarily for file uploads.
- **Cloudinary**: Cloud-based image and video management.
- **sharp**: High-performance image processing library.

## Configuration

- **Environment Variables**: Managed using a `.env` file, including settings for the database connection, JWT secrets, Cloudinary credentials, and other sensitive information.
- **Database Connection**: Established in `db/connection.js` using Mongoose, connecting to MongoDB.
- **Cloudinary Configuration**: Set up in `config/cloudinaryConfig.js`, handling image uploads and deletions.

## Project Structure

The server-side project is organized as follows:

```
server
├── config
│   └── cloudinaryConfig.js
├── controllers
│   ├── authController.js
│   ├── commentController.js
│   ├── postController.js
│   ├── sessionController.js
│   └── userController.js
├── db
│   ├── connection.js
│   ├── migrateBase64Images.js
│   ├── migrateImages.js
│   ├── migrateUsers.js
│   └── migration.js
├── logs
│   ├── combined.log
│   ├── error.log
│   ├── exceptions.log
│   └── rejections.log
├── middleware
│   ├── authMiddleware.js
│   ├── sanitizeMiddleware.js
│   └── uploadMiddleware.js
├── models
│   ├── comment.js
│   ├── post.js
│   ├── session.js
│   └── user.js
├── routes
│   ├── authRoutes.js
│   ├── commentRoutes.js
│   ├── postRoutes.js
│   ├── sessionRoutes.js
│   └── userRoutes.js
├── server.js
├── services
│   └── emailService.js
├── utils
│   ├── commentHelpers.js
│   ├── imageHelpers.js
│   ├── logger.js
│   └── sanitizeContent.js
└── validators
    ├── commentValidator.js
    └── postValidators.js
```

## Models

### User Model

Located in `models/user.js`, the User model represents the users of the platform. Key features include:

- **Fields**:
  - `firstName`, `lastName`: User's personal names.
  - `birthDate`: Date of birth.
  - `email`: Unique and indexed, used for authentication.
  - `password`: Hashed password using bcrypt.
  - `location`, `occupation`: Additional profile information.
  - `authLevel`: Authorization level, either 'basic' or 'admin'.
  - `status`: User's status message or bio.
  - `emailVerified`: Boolean indicating if the user's email is verified.
  - `verificationToken`: Token used for email verification.
  - `resetPasswordToken`, `resetPasswordExpires`: For password reset functionality.
  - `profilePicture`, `coverPicture`: URLs to the user's profile and cover images.

- **Virtual Fields**:
  - `userId`: Aliases `_id` for easier reference.

- **Middleware**:
  - Pre-save middleware to hash the password before saving to the database.

### Session Model

Located in `models/session.js`, the Session model manages user sessions. Key features include:

- **Fields**:
  - `sessionId`: Unique identifier for the session.
  - `token`: JWT token associated with the session.
  - `sessionDate`: Timestamp of the session creation, with an expiration time (e.g., 24 hours).
  - `user`: Reference to the User model, establishing a relationship.

- **Virtual Fields**:
  - `userId`: Aliases the `user` field for convenience.

### Post Model

Located in `models/post.js`, the Post model represents blog posts created by users. Key features include:

- **Fields**:
  - `title`: Title of the post, required and trimmed.
  - `slug`: Unique slug generated from the title for SEO-friendly URLs.
  - `content`: Main content of the post.
  - `userId`: Reference to the User who created the post.
  - `likes`, `likesBy`: Number of likes and array of Users who liked the post.
  - `views`: Number of times the post has been viewed.
  - `category`: Category from predefined valid categories.
  - `tags`: Array of tags associated with the post.
  - `status`: Status of the post, e.g., 'draft', 'published', or 'archived'.
  - `scheduledAt`: Date when the post is scheduled to be published.
  - `comments`: Array of references to Comment models.
  - `imageUrls`: URLs of images associated with the post.
  - `editHistory`: Records of edits made to the post, including timestamps and content snapshots.

- **Virtual Fields**:
  - `excerpt`: Generates a short summary from the content.
  - `postId`: Aliases `_id` for easier reference.

- **Middleware**:
  - Pre-save middleware to generate a unique slug from the title.
  - Checks for slug uniqueness and appends a timestamp if necessary.

### Comment Model

Located in `models/comment.js`, the Comment model represents comments made on posts. Key features include:

- **Fields**:
  - `content`: Text content of the comment.
  - `postId`: Reference to the Post the comment belongs to.
  - `userId`: Reference to the User who made the comment.
  - `parentId`: Reference to another Comment for nested replies.
  - `likes`, `likesBy`: Number of likes and array of Users who liked the comment.
  - `replies`: Array of references to other Comment models (for replies).
  - `timeStamp`: Timestamp of when the comment was created.

- **Virtual Fields**:
  - `commentId`: Aliases `_id` for easier reference.

## Middleware

### Authentication Middleware

Located in `middleware/authMiddleware.js`, this middleware authenticates users using JWT tokens. Key features include:

- **Token Extraction**: Extracts the JWT from the `Authorization` header in the format `Bearer <token>`.
- **Token Verification**: Uses `jsonwebtoken` to verify the token's validity and checks for required payload fields like `userId`, `email`, and `authLevel`.
- **Error Handling**: Provides meaningful error messages for missing tokens, invalid formats, expired tokens, and invalid tokens.
- **Request Augmentation**: Attaches the authenticated user's information to `req.user` for use in subsequent middleware and route handlers.
- **Logging**: Logs authentication successes and failures using the custom logger.

### Sanitize Middleware

Located in `middleware/sanitizeMiddleware.js`, this middleware sanitizes user input to prevent XSS attacks. Key features include:

- **Field Sanitization**: Sanitizes specified fields in the request body using the `sanitizeContent` utility.
- **Usage**: Applied to routes that handle user-generated content, such as post creation and updates.
- **Error Handling**: Catches and responds to errors during sanitization.
- **Logging**: Logs the sanitization process and any errors encountered.

### Upload Middleware

Located in `middleware/uploadMiddleware.js`, this middleware handles file uploads securely. Key features include:

- **Storage Configuration**: Uses `multer` with in-memory storage for handling file uploads.
- **File Validation**:
  - **Allowed Types**: Accepts only image files with MIME types like `image/jpeg`, `image/png`, `image/gif`, and `image/webp`.
  - **Allowed Extensions**: Validates file extensions to match the allowed image types.
- **Size Limits**: Sets a maximum file size limit, defaulting to 5 MB, configurable via environment variables.
- **Error Handling**: Provides clear error messages for invalid file types or sizes, leveraging `multer`'s built-in error handling.
- **Logging**: Logs details about the file upload process and any validation failures.

## Controllers

The controllers contain the business logic for handling requests and manipulating data models. They interact with the models to perform CRUD operations and other functionalities required by the application.

### User Controller

Located in `controllers/userController.js`, this controller handles user-related operations such as:

- **Verify Email**: Confirms the user's email address using a verification token sent during registration.
- **Get User by ID**: Retrieves a user's information by their ID, excluding sensitive data like the password.
- **Update User**: Updates a user's profile information, including handling profile and cover photo uploads. It sanitizes input fields and checks for proper authorization.
- **List Users**: Retrieves a list of all users except the current user, useful for displaying user lists in the application.
- **Get All Users**: Retrieves a list of all users in the system, typically for administrative purposes.
- **Delete User by ID**: Deletes a user account by their ID, with appropriate authorization checks.
- **Delete User by Email**: Deletes a user account using their email address.
- **Update User Status**: Updates the status message or bio of a user, allowing them to share a personal message.
- **Delete Profile Picture**: Deletes a user's profile picture from both the database and Cloudinary.

**Key Aspects:**

- **Authorization Checks**: Ensures that only authorized users (themselves or admins) can perform certain actions like updating or deleting profiles.
- **Validation**: Utilizes `express-validator` to validate incoming request data, ensuring data integrity.
- **Sanitization**: Sanitizes user input to prevent security vulnerabilities such as XSS attacks.
- **Error Handling**: Provides detailed error messages and logs errors using the custom logger for easier debugging.
- **Image Handling**: Manages profile and cover photo uploads using Cloudinary, including deletion and updates.

### Session Controller

Located in `controllers/sessionController.js`, this controller manages user sessions.

- **Validate Token**: Validates the session token provided by the user and returns basic user information if the token is valid.

**Key Aspects:**

- **Authentication**: Relies on JWT tokens for session validation to ensure secure access.
- **Error Handling**: Returns appropriate error messages for invalid or expired tokens, improving user experience.

### Post Controller

Located in `controllers/postController.js`, this controller handles operations related to blog posts.

- **Get Top Liked Posts**: Retrieves the top 5 most liked posts. If there are fewer than 5 liked posts, it fills the remainder with the latest posts to ensure a consistent number of posts are displayed.
- **Get User Posts**: Retrieves all posts made by a specific user, with pagination support for efficient data retrieval.
- **Get Post by ID**: Retrieves a single post by its ID, including author information for display purposes.
- **Get All Posts**: Retrieves all posts in the system, with pagination to manage large datasets.
- **Create Post**: Allows a user to create a new post, handling image uploads to Cloudinary and sanitizing content to prevent security issues.
- **Update Post**: Updates an existing post, including replacing images and updating content, while maintaining edit history.
- **Delete Post**: Deletes a post by its ID, ensuring that only authorized users can perform this action.
- **Like Post**: Increments the like count of a post and adds the user to the `likesBy` array to track who liked the post.
- **Unlike Post**: Decrements the like count and removes the user from the `likesBy` array.

**Key Aspects:**

- **Image Handling**: Manages image uploads and deletions using Cloudinary, ensuring that images are stored efficiently and securely.
- **Authorization**: Ensures that only authorized users can perform certain actions, such as updating or deleting a post.
- **Pagination**: Supports pagination for fetching posts, which is essential for performance in applications with large amounts of data.
- **Populating References**: Uses Mongoose's `populate` method to include related user information in responses, enhancing the richness of data provided to the client.
- **Edit History**: Maintains an edit history for posts, allowing users to track changes over time.

### Comment Controller

Located in `controllers/commentController.js`, this controller manages comments on posts.

- **Create Comment**: Allows users to add comments to posts, with validation and sanitization to ensure data integrity and security.
- **Get Comment by ID**: Retrieves a specific comment, including user information, for display or further actions.
- **Update Comment**: Updates an existing comment, ensuring only the comment author can update it, maintaining data integrity.
- **Delete Comment**: Deletes a comment and all its child replies recursively, cleaning up nested comment structures.
- **Like Comment**: Increments the like count of a comment, tracking user engagement.
- **Unlike Comment**: Decrements the like count of a comment.
- **Reply to Comment**: Allows users to reply to comments, creating a nested comment structure for discussions.
- **Get Comments by Post**: Retrieves all comments associated with a specific post, including nested replies.

**Key Aspects:**

- **Nested Comments**: Supports nested replies, creating a threaded comment system that enhances user interaction.
- **Authorization**: Ensures that only the comment author can update or delete the comment, protecting user content.
- **Error Handling**: Provides detailed error messages and uses the `sendError` utility for consistency across the application.
- **Performance**: Efficiently handles recursive deletion of comments and their replies.

### Auth Controller

Located in `controllers/authController.js`, this controller handles user authentication and account-related actions.

- **Register User**: Registers a new user, handling profile and cover photo uploads, email verification (if enabled), and password hashing for security.
- **Login User**: Authenticates a user and generates a JWT token for session management, allowing access to protected routes.
- **Logout User**: Logs out the user by deleting their session, invalidating their JWT token.
- **Forgot Password**: Initiates the password reset process by sending a reset email with a secure token.
- **Reset Password**: Resets the user's password using a valid reset token, ensuring that only authorized password changes occur.

**Key Aspects:**

- **Email Verification**: Optionally requires users to verify their email address before accessing the platform, enhancing security.
- **Password Reset**: Implements secure password reset functionality using tokens that expire after a set period.
- **Session Management**: Manages user sessions using JWT tokens and a Session model, maintaining secure user authentication.
- **Security**: Hashes passwords using bcrypt and sanitizes user inputs to prevent security vulnerabilities.
- **Error Handling**: Provides meaningful error messages and logs errors for better maintainability.

## Routes

### Authentication Routes

Located in `routes/authRoutes.js`, these routes handle user authentication and account management.

- **Register User** (`POST /auth/register`): Registers a new user with optional profile and cover photos. Validates input fields like `firstName`, `lastName`, `email`, `password`, etc.
- **Login User** (`POST /auth/login`): Authenticates a user and returns a JWT token.
- **Logout User** (`POST /auth/logout`): Logs out the user and invalidates the session.
- **Forgot Password** (`POST /auth/forgot-password`): Sends a password reset email to the user.
- **Reset Password** (`POST /auth/reset-password`): Resets the user's password using a valid token.

### User Management Routes

Located in `routes/userRoutes.js`, these routes manage user profiles and account settings.

- **Verify Email** (`GET /user/verify-email`): Verifies the user's email address.
- **Get User by ID** (`GET /user/:userId`): Retrieves user information by user ID.
- **Update User** (`PATCH /user/:userId`): Updates user profile information, including profile and cover photos.
- **List Users** (`GET /user/list/:userId`): Lists all users except the current user.
- **Get All Users** (`GET /user/`): Retrieves a list of all users.
- **Delete User by ID** (`DELETE /user/:userId`): Deletes a user account by user ID.
- **Delete User by Email** (`DELETE /user/email/:email`): Deletes a user account by email.
- **Update User Status** (`PUT /user/:userId/status`): Updates the status message of a user.
- **Delete Profile Picture** (`DELETE /user/:userId/profile-picture`): Deletes the user's profile picture.

### Post Management Routes

Located in `routes/postRoutes.js`, these routes handle blog post operations.

- **Get Top Liked Posts** (`GET /post/top-liked`): Retrieves the top 5 most liked posts or the latest posts if none have likes.
- **Get User Posts** (`GET /post/user/:userId/posts`): Retrieves all posts made by a specific user.
- **Get Post by ID** (`GET /post/specific/:postId`): Retrieves a single post by its ID.
- **Get All Posts** (`GET /post/`): Retrieves all posts with pagination support.
- **Create Post** (`POST /post/`): Creates a new post with optional images. Validates input and sanitizes content.
- **Update Post** (`PATCH /post/:postId`): Updates an existing post. Supports image uploads and content sanitization.
- **Delete Post** (`DELETE /post/:postId`): Deletes a post by ID.
- **Like Post** (`PUT /post/like/:postId`): Likes a post.
- **Unlike Post** (`PUT /post/unlike/:postId`): Unlikes a post.

### Comment Management Routes

Located in `routes/commentRoutes.js`, these routes handle comments on posts.

- **Create Comment** (`POST /comment/`): Adds a new comment to a post. Validates input.
- **Get Comment by ID** (`GET /comment/:commentId`): Retrieves a single comment by its ID.
- **Update Comment** (`PATCH /comment/:commentId`): Updates an existing comment.
- **Delete Comment** (`DELETE /comment/:commentId`): Deletes a comment by ID.
- **Like Comment** (`PUT /comment/like/:commentId`): Likes a comment.
- **Unlike Comment** (`PUT /comment/unlike/:commentId`): Unlikes a comment.
- **Reply to Comment** (`POST /comment/reply/:commentId`): Adds a reply to an existing comment.
- **Get Comments by Post** (`GET /comment/comments/:postId`): Retrieves all comments for a specific post.

### Session Management Routes

Located in `routes/sessionRoutes.js`, these routes handle session validation.

- **Validate Token** (`GET /session/validate_token`): Validates the session token and returns user information.

## Validators

### Post Validators

Located in `validators/postValidators.js`, these middleware functions validate post data.

- **Valid Categories**: An array of predefined categories (e.g., 'Health and Fitness', 'Technology', 'Art') to maintain consistency.
- **validatePostCreation**: Validates data when creating a new post, ensuring required fields are present and correctly formatted.
- **validatePostUpdate**: Validates data when updating an existing post, allowing optional updates with proper validation.
- **handleValidationErrors**: Middleware to handle and format validation errors, returning meaningful messages to the client.

### Comment Validators

Located in `validators/commentValidator.js`, these middleware functions validate comment data.

- **validateCreateComment**: Validates data when creating a new comment, ensuring `content` and `postId` are provided and correctly formatted.
- **handleValidationErrors**: Middleware to handle and format validation errors.

## Utilities

### Sanitize Content

Located in `utils/sanitizeContent.js`, this utility sanitizes HTML content to prevent XSS attacks.

- **sanitizeContent(content)**: Sanitizes the provided HTML content using `sanitize-html` with a custom configuration.
- **Configuration**:
  - **Allowed Tags**: Specifies which HTML tags are permitted.
  - **Allowed Attributes**: Defines which attributes are allowed on specific tags.
  - **Allowed Styles**: Permits certain inline styles for flexibility while maintaining security.
  - **Schemes**: Allows specific URL schemes like `http`, `https`, and `data`.

### Logger

Located in `utils/logger.js`, this utility sets up application-wide logging using `winston`.

- **Transports**:
  - **Console**: Outputs logs to the console with colorization.
  - **File**: Writes logs to `error.log` for error-level messages.
  - **Daily Rotate File**: Archives logs daily, managing file sizes and retention.
- **Formats**:
  - Includes timestamps, error stacks, and JSON formatting.
- **Exception Handling**: Captures unhandled exceptions and rejections, logging them for debugging.
- **Configuration**: Log levels and formats can be adjusted based on the environment.

### Image Helpers

Located in `utils/imageHelpers.js`, this utility provides helper functions for image processing.

- **extractPublicIdFromURL(url)**: Extracts the `publicId` from a Cloudinary URL to facilitate image management tasks like deletion.
- **sendError(res, error, message, statusCode)**: A helper function to standardize error responses sent to the client, including logging the error.

## Configuration Files

### Cloudinary Configuration

Located in `config/cloudinaryConfig.js`, this file configures Cloudinary for image management.

**Key Aspects:**

- **Cloudinary Setup**: Uses environment variables to securely set up Cloudinary credentials, including `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.
- **Helper Functions**:
  - **uploadToCloudinary(buffer, filename, folderName)**: Uploads an image buffer to Cloudinary, assigning a unique public ID and storing it in the specified folder.
  - **deleteFromCloudinary(publicId)**: Deletes an image from Cloudinary using its public ID.
- **Usage**: These helper functions are used in controllers to manage image uploads and deletions for user profiles, posts, and other media.

### Environment Variables

Sensitive configuration details are stored in a `.env` file, which is not committed to version control to protect secrets.

**Environment Variables Include:**

- **Database URI**: `ATLAS_URI`, the connection string for MongoDB Atlas.
- **Server Port**: `PORT`, the port on which the server runs.
- **Node Environment**: `NODE_ENV`, specifying the environment (e.g., `development`, `production`).
- **JWT Secret**: `JWT_SECRET`, used for signing JWT tokens.
- **Cloudinary Credentials**:
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
- **Email Verification**: `ENABLE_EMAIL_VERIFICATION`, a boolean flag to enable or disable email verification during registration.

**Note**: In this documentation, placeholder values are used instead of actual secrets to maintain security.

**Example `.env` File (Using Placeholders):**

```
ATLAS_URI="your_mongodb_connection_string"
PORT=5050
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

ENABLE_EMAIL_VERIFICATION=false
```

**Important**: Never commit your `.env` file to version control. Always use environment variables or secure configuration management in production environments.

## Database Connection

Located in `db/connection.js`, this module establishes a connection to the MongoDB database using Mongoose.

**Key Aspects:**

- **Environment Configuration**: Reads the MongoDB URI from environment variables (`process.env.ATLAS_URI`).
- **Connection Handling**: Connects to the database and logs the connection status, ensuring that the application is connected before handling requests.
- **Error Handling**: Checks for invalid URIs and logs connection errors. If the URI is invalid, it logs the error and exits the process to prevent further issues.
- **Export**: Exports the Mongoose connection to be used in other parts of the application, allowing models and controllers to interact with the database.

---

