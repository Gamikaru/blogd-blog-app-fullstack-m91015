import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Bloggs from "./components/Bloggs";
import "./Bloggs.css";
import BloggsList from "./components/BloggsList";
import "./index.css";
import LoginPage from "./components/LoginPage";
import "./loginPage.css";
import RegisterPage from "./components/RegisterPage";
import "./registerPage.css";
import "./Navbar.css"; 
import HomePage from "./components/HomePage";
import "./HomePage.css";
import PostModal from "./components/PostModal";
import "./PostModal.css";
import Network from "./components/Network";
import "./Network.css";
import Admin from "./components/Admin";
import "./Admin.css";

const router = createBrowserRouter([
	{
		path: "/bloggs",
		element: <App />,
		children: [
			{
				path: "/bloggs",
				element: <BloggsList />,
			},
		],
	},
	{
		path: "/edit/:id",
		element: <App />,
		children: [
			{
				path: "/edit/:id",
				element: <Bloggs />,
			},
		],
	},
	{
		path: "/create",
		element: <App />,
		children: [
			{
				path: "/create",
				element: <Bloggs />,
			},
		],
	},
	{
		path: "/login",
		element: <App />,
		children: [
			{
				path: "/login",
				element: <LoginPage />,
			},
		],
	},
	{
		path: "/register",
		element: <App />,
		children: [
			{
				path: "/register",
				element: <RegisterPage />,
			},
		],
	},
	{
		path: "/",
		element: <App />,
		children: [
			{
				path: "/",
				element: <HomePage />,
			},
		],
	},
	{
		path: "/post",
		element: <App />,
		children: [
			{
				path: "/post",
				element: <PostModal />,
			},
		],
	},
	{
		path: "network",
		element: <App />,
		children: [
			{
				path: "/network",
				element: <Network />,
			},
		],
	},
	{
		path: "admin",
		element: <App />,
		children: [
			{
				path: "/admin",
				element: <Admin />,
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
