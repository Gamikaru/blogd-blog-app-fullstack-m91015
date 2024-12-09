# Blogd

Welcome to **Blogd** – a full-stack blogging platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js). This application is a **concept project** and a **work in progress**, showcasing a modern, responsive, and interactive user interface for creating, sharing, and interacting with blog posts.

This README provides a comprehensive overview of the application, including key features, technologies used, installation instructions, project structure, and more. It combines both frontend and backend documentation to serve as a complete guide.

---

## Table of Contents

- [Blogd](#blogd)
  - [Table of Contents](#table-of-contents)
  - [Demo](#demo)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
    - [Frontend](#frontend)
    - [Backend](#backend)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
      - [Clone the Repository](#clone-the-repository)
      - [Backend Setup](#backend-setup)
      - [Frontend Setup](#frontend-setup)
  - [Running the Application](#running-the-application)
  - [Project Structure](#project-structure)
  - [Key Components](#key-components)
    - [Frontend Components](#frontend-components)
      - [Authentication](#authentication)
      - [Posts Management](#posts-management)
      - [User Profiles](#user-profiles)
      - [Comments and Interactions](#comments-and-interactions)
      - [Responsive Design](#responsive-design)
    - [Backend Components](#backend-components)
      - [Models](#models)
      - [Controllers](#controllers)
      - [Routes](#routes)
      - [Middleware](#middleware)
  - [API Documentation](#api-documentation)
  - [Testing](#testing)
  - [Scripts](#scripts)
  - [Contributing](#contributing)
  - [License](#license)
  - [Contact](#contact)
- [Additional Information](#additional-information)
- [Acknowledgments](#acknowledgments)
- [Next Steps](#next-steps)

---

## Demo

[Live Demo](#) *(Link to the deployed application, if available)*

[![Video Demo](path/to/video-thumbnail.png)](link/to/video)
*Click on the image above to watch a demo video.*

![Home Page Screenshot](path/to/homepage-screenshot.png)

*Screenshot: Blogd Home Page*

---

## Features

- **User Authentication**: Secure login and registration with form validation.

  ![Login Page Screenshot](path/to/login-page-screenshot.png)

  *Screenshot: Login Page*

- **Post Creation and Editing**: Rich text editor for creating and editing blog posts with media uploads.

  ![Post Creation Modal Screenshot](path/to/post-creation-modal-screenshot.png)

  *Screenshot: Post Creation Modal*

- **User Profiles**: Personalized profile pages with user information, posts, and statistics.

  ![User Profile Screenshot](path/to/user-profile-screenshot.png)

  *Screenshot: User Profile Page*

- **Comments and Replies**: Interactive commenting system with threading and likes.

  ![Comments Section Screenshot](path/to/comments-section-screenshot.png)

  *Screenshot: Comments Section*

- **Networking**: Connect with other users and view their profiles and posts.

  ![Network Page Screenshot](path/to/network-page-screenshot.png)

  *Screenshot: Network Page*

- **Responsive Design**: Mobile-friendly layout with a responsive navbar and sidebar.

  ![Responsive Design Screenshot](path/to/responsive-design-screenshot.png)

  *Screenshot: Mobile View of Navbar and Sidebar*

- **Search and Filtering**: Search posts and filter by categories.

  ![Search and Filtering Screenshot](path/to/search-filtering-screenshot.png)

  *Screenshot: Search and Filtering Options*

- **Notifications**: Custom toast notifications for user feedback.

  ![Notifications Screenshot](path/to/notifications-screenshot.png)

  *Screenshot: Custom Toast Notification*

- **Settings Management**: Update profile information, account settings, and preferences.

  ![Settings Modal Screenshot](path/to/settings-modal-screenshot.png)

  *Screenshot: Settings Modal with Tabs*

- **Error Handling**: Robust error boundaries and handling mechanisms.

  ![Error Boundary Screenshot](path/to/error-boundary-screenshot.png)

  *Screenshot: Error Boundary Fallback UI*

---

## Technologies Used

### Frontend

- **React.js**
- **Vite**
- **React Router DOM**
- **Axios**
- **Framer Motion**
- **React Icons**
- **Sass (SCSS)**
- **React Bootstrap**
- **React Quill**
- **Formik** and **Yup**
- **Lodash**
- **Date-fns**
- **DOMPurify**
- **Universal Cookie**
- **Swiper**
- **React Toastify**

### Backend

- **Node.js**
- **Express.js**
- **MongoDB** and **Mongoose**
- **JWT (jsonwebtoken)**
- **bcrypt**
- **dotenv**
- **CORS**
- **Helmet**
- **Multer**
- **Cloudinary**
- **Winston**
- **Express Validator**
- **Sanitize-HTML**

---

## Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **Yarn**
- **MongoDB** instance (local or cloud-based)
- **Cloudinary Account** (for image uploads)
- **Git**

### Installation

#### Clone the Repository

```bash
git clone https://github.com/yourusername/Blogd.git
cd Blogd
```

#### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory with the following content:

   ```env
   PORT=5050
   ATLAS_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ENABLE_EMAIL_VERIFICATION=false
   ```

   Replace the placeholder values with your actual credentials.

4. Start the backend server:

   ```bash
   npm start
   ```

   The server will run on `http://localhost:5050`.

#### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd ../frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   Create a `.env` file in the `frontend` directory (if required) to set up environment variables like API endpoints.

4. Start the frontend development server:

   ```bash
   npm run dev
   ```

5. Open your browser and navigate to:

   ```
   http://localhost:5173
   ```

---

## Running the Application

Ensure both the backend and frontend servers are running:

- Backend: `http://localhost:5050`
- Frontend: `http://localhost:5173`

You can now interact with the application, register a new user, create posts, and explore features.

---

## Project Structure

```bash
Blogd/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── db/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── validators/
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── scss/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── .env
└── README.md
```

---

## Key Components

### Frontend Components

#### Authentication

- **`LoginPage.jsx`**: Handles user authentication with form validation, error handling, and redirects.
- **`RegisterModal.jsx`**: Modal for user registration with validation and integration with the user context.

#### Posts Management

- **`PostModal.jsx`**: Modal for creating new posts, including a rich text editor, media uploads, and post settings.
- **`EditPostModal.jsx`**: Modal for editing existing posts.
- **`Blogs.jsx`**: Displays a list of blog posts fetched from the server.
- **`BlogCard.jsx`**: Individual blog post card displaying title, excerpt, author, and metadata.

#### User Profiles

- **`UserProfile.jsx`**: Displays the user's profile information, posts, and statistics.
- **`ProfileHeader.jsx`**: Header section showing profile picture, name, and status.
- **`ProfileSidebar.jsx`**: Sidebar with user information, statistics, and quick actions.
- **`PostsSection.jsx`**: Displays user's posts with options to filter and search.

#### Comments and Interactions

- **`Comment.jsx`**: Manages comments on a post, including replies, likes, and editing.
- **`FullBlogView.jsx`**: Displays a full blog post with content, images, and author information.

#### Responsive Design

- **`Navbar.jsx`**: Main navigation bar with responsive design for mobile views.
- **`HamburgerMenu.jsx`**: Mobile navigation menu icon that toggles the sidebar.
- **`Sidebar.jsx`**: Sidebar navigation for mobile views with account options and settings.

### Backend Components

#### Models

- **`User.js`**: Defines the user schema, including fields like name, email, password, profile picture, etc.
- **`Post.js`**: Defines the post schema, including title, content, author, likes, comments, etc.
- **`Comment.js`**: Defines the comment schema, including content, author, post reference, etc.
- **`Session.js`**: Manages user sessions with tokens.

#### Controllers

- **`authController.js`**: Handles user authentication and account-related actions like register, login, logout, password reset.
- **`userController.js`**: Manages user profiles, updates, and deletions.
- **`postController.js`**: Manages post creation, updates, deletions, and fetching.
- **`commentController.js`**: Manages comments on posts, including replies and likes.

#### Routes

- **`authRoutes.js`**: Routes for authentication-related endpoints.
- **`userRoutes.js`**: Routes for user management.
- **`postRoutes.js`**: Routes for post management.
- **`commentRoutes.js`**: Routes for comment management.
- **`sessionRoutes.js`**: Routes for session validation.

#### Middleware

- **`authMiddleware.js`**: Verifies JWT tokens and authenticates users.
- **`sanitizeMiddleware.js`**: Sanitizes user input to prevent XSS attacks.
- **`uploadMiddleware.js`**: Handles file uploads securely.

---

## API Documentation

For detailed API documentation, including request and response formats, authentication, and error handling, refer to the [API Documentation](path/to/api-documentation).

---

## Testing

**Backend Testing**

- Unit tests for controllers, models, and utilities.
- Run tests with:

  ```bash
  npm test
  ```

**Frontend Testing**

- End-to-end tests for user flows.
- Run tests with:

  ```bash
  npm run test
  ```

---

## Scripts

**Backend Scripts**

- **`start`**: Starts the backend server.
- **`dev`**: Runs the backend server in development mode with nodemon.
- **`test`**: Runs backend tests.

**Frontend Scripts**

- **`dev`**: Runs the development server.
- **`build`**: Builds the application for production.
- **`serve`**: Serves the built app.
- **`test`**: Runs tests.
- **`lint`**: Checks code for linting issues.
- **`lint:fix`**: Fixes linting issues automatically.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**.

2. **Create a new branch** for your feature:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Commit your changes**:

   ```bash
   git commit -m "Add your message"
   ```

4. **Push to the branch**:

   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a pull request**.

Please ensure your code adheres to the project's coding standards and includes appropriate tests.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contact

For any inquiries or feedback, please contact:

- **Name**: [Your Name]
- **Email**: [your.email@example.com]
- **LinkedIn**: [Your LinkedIn Profile](https://www.linkedin.com/in/yourprofile)

---

Thank you for exploring the Blogd project! We hope this documentation provides a clear understanding of the application's structure and capabilities. If you're a potential employer or client, please note that this application is a **concept** and a **work in progress**. Some features are still under development, and certain files, such as `useAnimation`, may be commented out but are designed to be easily integrated and updated in the future.

Feel free to reach out with any questions or to discuss potential collaborations.

---

*Note: The image paths in the screenshots and video are placeholders. Please update them with the correct paths to the images and video once they are available.*

---

# Additional Information

- **Tools Used**:
  - **Frontend Development**: React.js with Vite for rapid development.
  - **Backend Development**: Express.js for handling API requests.
  - **Database**: MongoDB with Mongoose for data modeling.
  - **Image Management**: Cloudinary for storing and serving images.
  - **Form Handling**: Formik and Yup for form state management and validation.
  - **Styling**: Sass (SCSS) for advanced styling capabilities.
  - **Testing**: Mocha and Selenium WebDriver for automated testing.

- **Key Features**:
  - **Security**: Utilizes JWT for authentication, bcrypt for password hashing, and sanitization middleware to prevent XSS attacks.
  - **Scalability**: Modular code structure with reusable components and middleware.
  - **User Experience**: Responsive design, animations with Framer Motion, and interactive components enhance the UX.
  - **API Integration**: Well-defined API endpoints with clear request and response structures.

---

Please note that this README serves as an overview of the entire application, combining both frontend and backend aspects. For more detailed information, you can refer to the individual READMEs located in the `frontend` and `backend` directories of the project.

---

# Acknowledgments

We would like to acknowledge all open-source libraries and tools that made this project possible. Special thanks to the communities of React, Node.js, MongoDB, and all other technologies used in this application.

---

# Next Steps

As this is a work in progress, future enhancements may include:

- **Email Verification**: Implementing email verification during user registration.
- **Password Reset**: Completing the password reset functionality.
- **Internationalization (i18n)**: Adding support for multiple languages.
- **Accessibility**: Ensuring the application meets WCAG standards for accessibility.
- **Social Networking**: Integrating social media login options for user authentication and sharing as well as friend /follow functionality.
- **Instant Messaging**: Implementing real-time messaging between users.

---

We appreciate your interest in the Blogd project and look forward to any feedback or contributions you may have!

---