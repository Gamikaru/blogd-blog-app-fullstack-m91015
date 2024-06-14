import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Bloggs from "./components/Bloggs";
import "./Bloggs.css";
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
import UserManager from "./components/userManager";
import "./userManager.css";
import ContentManager from "./components/contentManager";
import "./contentManager.css";
import EditUser from "./components/editUser";
import "./EditUser.css";

const router = createBrowserRouter([
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
		path: "/bloggs",
		element: <App />,
		children: [
			{
				path: "/bloggs",
				element: <Bloggs />,
			},
		],
	},
	{
		path: "/edit",
		element: <App />,
		children: [
			{
				path: "/edit",
				element: <EditUser />,
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
	{
		path: "/user-manager",
		element: <App />,
		children: [
			{
				path: "/user-manager",
				element: <UserManager />,
			},
		],
	},
	{
		path: "/content-manager",
		element: <App />,
		children: [
			{
				path: "/content-manager",
				element: <ContentManager />,
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
