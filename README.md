# Codeblogs

Codeblogs is a full-stack web application designed for users to create, share, and interact with blog posts. It features a React frontend and an Express.js backend with MongoDB as the database.

## Table of Contents

- [Codeblogs](#codeblogs)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
    - [Frontend](#frontend)
    - [Backend](#backend)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
    - [Clone the Repository](#clone-the-repository)
    - [Backend Setup](#backend-setup)
    - [Frontend Setup](#frontend-setup)
  - [Usage](#usage)
    - [Running the Backend Server](#running-the-backend-server)
    - [Running the Frontend Application](#running-the-frontend-application)
  - [Project Structure](#project-structure)
  - [Scripts](#scripts)
    - [Backend Scripts (in `/backend/package.json`)](#backend-scripts-in-backendpackagejson)
    - [Frontend Scripts (in `/client/package.json`)](#frontend-scripts-in-clientpackagejson)
  - [Contributing](#contributing)
  - [License](#license)

## Features

- **User Authentication**: Secure login and registration with JWT authentication.
- **Post Creation**: Users can create, edit, and delete blog posts.
- **Commenting System**: Comment on posts and interact with other users.
- **Real-Time Updates**: Instant updates on new posts and comments.
- **Admin Panel**: Manage users and content with different authorization levels.

## Technologies Used

### Frontend

- **React**: JavaScript library for building user interfaces.
- **Vite**: Next-generation frontend tooling.
- **Axios**: Promise-based HTTP client for the browser.
- **React Router**: Declarative routing for React applications.
- **Bootstrap & React-Bootstrap**: Styling and responsive design.
- **SCSS**: Enhanced CSS with variables and mixins.
- **React Toastify**: Notifications and alerts.
- **Selenium WebDriver**: For end-to-end testing.

### Backend

- **Node.js & Express.js**: Server-side JavaScript environment and web framework.
- **MongoDB & Mongoose**: NoSQL database and object modeling.
- **JWT (jsonwebtoken)**: Secure authentication tokens.
- **bcrypt**: Password hashing.
- **dotenv**: Environment variable management.
- **CORS**: Cross-Origin Resource Sharing.

## Prerequisites

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **MongoDB** instance (local or cloud-based)

## Installation

### Clone the Repository

```bash
git clone https://github.com/yourusername/Codeblogs.git
cd Codeblogs
```

### Backend Setup

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
   ```

   Replace `your_mongodb_connection_string` with your actual MongoDB URI and `your_jwt_secret` with a secure secret string.

### Frontend Setup

1. Navigate to the client directory:

   ```bash
   cd ../client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## Usage

### Running the Backend Server

1. Start the backend server:

   ```bash
   npm start
   ```

   The server will run on `http://localhost:5050`.

### Running the Frontend Application

1. Start the frontend development server:

   ```bash
   npm run dev
   ```

2. Open your browser and navigate to:

   ```
   http://localhost:5173
   ```

## Project Structure

```bash
Codeblogs/
├── backend/
│   ├── db/
│   │   └── connection.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── user.js
│   │   ├── post.js
│   │   └── session.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── postRoutes.js
│   │   └── sessionRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── client/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── scss/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── ApiClient.js
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Scripts

### Backend Scripts (in `/backend/package.json`)

- **Start Server**: `npm start`

### Frontend Scripts (in `/client/package.json`)

- **Start Development Server**: `npm run dev`
- **Build for Production**: `npm run build`
- **Preview Production Build**: `npm run serve`
- **Run Tests**: `npm run test`

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Commit your changes:

   ```bash
   git commit -m "Add your message"
   ```

4. Push to the branch:

   ```bash
   git push origin feature/your-feature-name
   ```

5. Open a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

---

Feel free to customize this README to better suit your project's needs.