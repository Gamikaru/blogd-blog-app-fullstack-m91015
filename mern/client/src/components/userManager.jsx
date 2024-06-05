import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function UserManager() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		try {
			const response = await fetch("http://localhost:5050/users");
			const data = await response.json();
			setUsers(data);
			setLoading(false);
		} catch (error) {
			console.error("Error fetching users:", error);
		}
	};

	const handleSearch = (event) => {
		setSearchQuery(event.target.value);
	};

	const handleEdit = (userId) => {
		navigate(`/user/${userId}`);
	};

	const handleDelete = async (userId) => {
		try {
			await fetch(`http://localhost:5050/users/${userId}`, {
				method: "DELETE",
			});
			setUsers(users.filter((user) => user.id !== userId));
		} catch (error) {
			console.error("Error deleting user:", error);
		}
	};

	const filteredUsers = users.filter(
		(user) =>
			user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			user.last_name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="user-manager-container">
			<h1 className="user-title">User Manager</h1>
			<input
				type="text"
				placeholder="Search by first or last name"
				value={searchQuery}
				onChange={handleSearch}
			/>
			{loading ? (
				<div className="skeleton-loader">
					<div className="skeleton-row"></div>
					<div className="skeleton-row"></div>
					<div className="skeleton-row"></div>
					<div className="skeleton-row"></div>
					<div className="skeleton-row"></div>
				</div>
			) : (
				<Table striped bordered hover>
					<thead>
						<tr>
							<th>First Name</th>
							<th>Last Name</th>
							<th>Edit</th>
							<th>Delete</th>
						</tr>
					</thead>
					<tbody>
						{filteredUsers.map((user) => (
							<tr key={user.id}>
								<td>{user.first_name}</td>
								<td>{user.last_name}</td>
								<td>
									<Button variant="primary" onClick={() => handleEdit(user.id)}>
										Edit
									</Button>
								</td>
								<td>
									<Button
										variant="danger"
										onClick={() => handleDelete(user.id)}
									>
										Delete
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			)}
		</div>
	);
}
