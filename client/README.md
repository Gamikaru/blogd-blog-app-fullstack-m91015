# Blogd Frontend

Welcome to the **Blogd** frontend repository!

**Blogd** is a conceptual full-stack blogging platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js). This application is a **work in progress** and demonstrates a modern, responsive, and interactive user interface. While some features are still under development, and certain files like `useAnimation` may be commented out if not intended for use in the current version, the codebase is designed to be integrable and updatable for future enhancements.

This README provides an overview of the frontend architecture, key features, technologies used, installation instructions, project structure, and more.

## Table of Contents

- [Blogd Frontend](#blogd-frontend)
  - [Table of Contents](#table-of-contents)
  - [Demo](#demo)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running the Application](#running-the-application)
  - [Project Structure](#project-structure)
  - [Key Components](#key-components)
    - [Authentication](#authentication)
    - [Posts Management](#posts-management)
    - [User Profiles](#user-profiles)
    - [Comments and Interactions](#comments-and-interactions)
    - [Responsive Design](#responsive-design)
  - [Contexts and State Management](#contexts-and-state-management)
  - [Custom Hooks](#custom-hooks)
  - [Styles and Theming](#styles-and-theming)
  - [API Services](#api-services)
  - [Utilities and Helpers](#utilities-and-helpers)
  - [Testing](#testing)
  - [Scripts](#scripts)
  - [Contributing](#contributing)
  - [License](#license)
  - [Contact](#contact)

## Demo

![Home Page Screenshot](path/to/homepage-screenshot.png)

*Screenshot: Blogd Home Page*

[Live Demo](#) (Link to the deployed application, if available)

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

## Technologies Used

- **Frontend**:
  - React.js
  - Vite
  - React Router DOM
  - Axios
  - Framer Motion
  - React Icons
  - Sass (SCSS)
  - React Bootstrap
  - React Quill
  - Lodash
  - Date-fns
  - DOMPurify
  - Universal Cookie
  - Swiper
- **State Management**:
  - React Context API
- **Form Management**:
  - Formik
  - Yup

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- NPM or Yarn
- Backend server for API integration (Ensure the backend is running and accessible)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/blogd-frontend.git
   cd blogd-frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

   or with Yarn:

   ```bash
   yarn install
   ```

### Running the Application

3. **Start the development server**:

   ```bash
   npm run dev
   ```

   or with Yarn:

   ```bash
   yarn dev
   ```

4. **Open the app**:

   Visit `http://localhost:3000` in your browser to view the application.

## Project Structure

```
client
├── public
│   └── assets
│       ├── fonts
│       └── images
├── src
│   ├── App.jsx
│   ├── components
│   │   ├── auth
│   │   ├── common
│   │   ├── layout
│   │   ├── modals
│   │   ├── nav
│   │   ├── pages
│   │   └── ...
│   ├── constants
│   ├── contexts
│   ├── hooks
│   ├── main.jsx
│   ├── scss
│   ├── services
│   └── utils
├── test-runner.js
├── vite.config.js
└── package.json
```

## Key Components

### Authentication

- **`LoginPage.jsx`**: Handles user authentication with form validation, error handling, and redirects. Utilizes custom hooks and components like `InputField`, `Button`, and `Spinner`.

  ![Login Page Component Screenshot](path/to/login-component-screenshot.png)

  *Screenshot: Login Page Component*

- **`RegisterModal.jsx`**: Modal for user registration with validation and integration with the user context.

  ![Register Modal Screenshot](path/to/register-modal-screenshot.png)

  *Screenshot: Register Modal*

### Posts Management

- **`PostModal.jsx`**: Modal for creating new posts, including a rich text editor, media uploads, and post settings.

  ![Post Modal Screenshot](path/to/post-modal-screenshot.png)

  *Screenshot: Post Creation Modal*

- **`EditPostModal.jsx`**: Modal for editing existing posts, pre-populating fields, and handling updates.

  ![Edit Post Modal Screenshot](path/to/edit-post-modal-screenshot.png)

  *Screenshot: Edit Post Modal*

- **`Blogs.jsx`**: Displays a list of blog posts fetched from the server.

  ![Blogs List Screenshot](path/to/blogs-list-screenshot.png)

  *Screenshot: Blogs List*

- **`BlogCard.jsx`**: Individual blog post card displaying title, excerpt, author, and metadata.

  ![Blog Card Screenshot](path/to/blog-card-screenshot.png)

  *Screenshot: Blog Card Component*

### User Profiles

- **`UserProfile.jsx`**: Displays the user's profile information, posts, and statistics.

  ![User Profile Component Screenshot](path/to/user-profile-component-screenshot.png)

  *Screenshot: User Profile Component*

- **`ProfileHeader.jsx`**: Header section showing profile picture, name, and status.

  ![Profile Header Screenshot](path/to/profile-header-screenshot.png)

  *Screenshot: Profile Header*

- **`ProfileSidebar.jsx`**: Sidebar with user information, statistics, and quick actions.

  ![Profile Sidebar Screenshot](path/to/profile-sidebar-screenshot.png)

  *Screenshot: Profile Sidebar*

- **`PostsSection.jsx`**: Displays user's posts with options to filter and search.

  ![Posts Section Screenshot](path/to/posts-section-screenshot.png)

  *Screenshot: Posts Section in Profile*

### Comments and Interactions

- **`Comment.jsx`**: Manages comments on a post, including replies, likes, and editing.

  ![Comment Component Screenshot](path/to/comment-component-screenshot.png)

  *Screenshot: Comment Component*

- **`FullBlogView.jsx`**: Displays a full blog post with content, images, and author information.

  ![Full Blog View Screenshot](path/to/full-blog-view-screenshot.png)

  *Screenshot: Full Blog View*

### Responsive Design

- **`Navbar.jsx`**: Main navigation bar with responsive design for mobile views.

  ![Navbar Screenshot](path/to/navbar-screenshot.png)

  *Screenshot: Responsive Navbar*

- **`HamburgerMenu.jsx`**: Mobile navigation menu icon that toggles the sidebar.

  ![Hamburger Menu Screenshot](path/to/hamburger-menu-screenshot.png)

  *Screenshot: Hamburger Menu Icon*

- **`Sidebar.jsx`**: Sidebar navigation for mobile views with account options and settings.

  ![Sidebar Screenshot](path/to/sidebar-screenshot.png)

  *Screenshot: Sidebar Navigation*

## Contexts and State Management

- **User Context (`UserContext.jsx`)**: Manages user authentication and data, providing functions for login, logout, registration, and updates.
- **Post Context (`PostContext.jsx`)**: Manages posts data, including fetching, adding, updating, and deleting posts.
- **Comment Context (`CommentContext.jsx`)**: Handles comments data, providing functions to fetch, add, update, and delete comments.
- **Notification Context (`NotificationContext.jsx`)**: Manages notifications and toasts, allowing components to display messages to the user.
- **Modal Contexts**:
  - **`PublicModalContext.jsx`**: Manages modals accessible to unauthenticated users, like the registration modal.
  - **`PrivateModalContext.jsx`**: Manages modals accessible to authenticated users, such as creating or editing posts.

All context providers are wrapped together in `Providers.jsx` and included at the root of the app.

## Custom Hooks

- **`useClickOutside.js`**: Detects clicks outside a specified element, useful for closing dropdowns or modals when clicking outside.

- **`useAnimation.js`**: Manages animations for components. *(Note: Some custom hooks like `useAnimation` may be commented out if not intended for use in the current version but are designed to be integrable and updatable in future enhancements.)*

## Styles and Theming

- **SCSS Structure**:
  - **Abstracts**: Variables, mixins, functions (`_variables.scss`, `_mixins.scss`, `_functions.scss`).
  - **Base**: Resets, typography, utilities.
  - **Components**: Styles for individual components.
  - **Layout**: Styles for the grid and layout components.
  - **Pages**: Styles specific to pages.
  - **Themes**: Light and dark mode theming.
  - **Vendors**: Overrides for third-party libraries.

Styles are imported and managed through `main.scss`.

## API Services

API interactions are handled in `src/services/api`.

- **API Client (`ApiClient.js`)**: Configures Axios with base URL, interceptors, and token handling.
- **User Service (`userService.js`)**: Handles user-related API calls like registration, login, profile updates.
- **Post Service (`postService.js`)**: Manages blog posts, including CRUD operations and likes.
- **Comment Service (`commentService.js`)**: Handles comments, replies, and likes.

## Utilities and Helpers

- **Logger (`logger.js`)**: Simplified logging utility.
- **Form Validation (`formValidation.js`)**: Validates form data for various forms.
- **Sanitize Content (`sanitizeContent.js`)**: Sanitizes HTML content to prevent XSS attacks.
- **Text Analytics (`textAnalytics.js`)**: Provides functions like word count and reading time estimation.

## Testing

Tests are run using Mocha and Selenium WebDriver (`test-runner.js`), allowing for automated testing of components and user interactions.

## Scripts

Scripts defined in `package.json` automate tasks:

- **`dev`**: Runs the development server.
- **`build`**: Builds the application for production.
- **`serve`**: Serves the built app.
- **`test`**: Runs tests.
- **`lint`**: Checks code for linting issues.
- **`lint:fix`**: Fixes linting issues automatically.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add new feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

Please ensure your code adheres to the project's coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any inquiries or feedback, please contact:

- **Name**: [Your Name]
- **Email**: [your.email@example.com]
- **LinkedIn**: [Your LinkedIn Profile](https://www.linkedin.com/in/yourprofile)

---

Thank you for exploring the Blogd frontend project! We hope this documentation provides a clear understanding of the application's structure and capabilities. If you're a potential employer or client, please note that this application is a **concept** and a **work in progress**. Some features are still under development, and certain files, such as `useAnimation`, may be commented out but are designed to be easily integrated and updated in the future.

Feel free to reach out with any questions or to discuss potential collaborations.

---
