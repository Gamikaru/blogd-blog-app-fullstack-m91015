import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Record from "./components/Record";
import RecordList from "./components/RecordList";
import "./index.css";
import LoginPage from "./components/LoginPage";
import "./loginPage.css";
import RegisterPage from "./components/RegisterPage";
import "./registerPage.css";

const router = createBrowserRouter([
	{
		path: "/record",
		element: <App />,
		children: [
			{
				path: "/record",
				element: <RecordList />,
			},
		],
	},
	{
		path: "/edit/:id",
		element: <App />,
		children: [
			{
				path: "/edit/:id",
				element: <Record />,
			},
		],
	},
	{
		path: "/create",
		element: <App />,
		children: [
			{
				path: "/create",
				element: <Record />,
			},
		],
	},
	{
		path: "/",
		element: <App />,
		children: [
			{
				path: "/",
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
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
