import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export default function UserManager() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [cookie, setCookie, removeCookie] = useCookies();
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, [searchQuery]); 

const fetchUsers = async () => {
    const token = cookie.PassBloggs;
    if (!token) {
        navigate("/login");
        return;
    }

    setLoading(true);
    try {
        let url = "http://localhost:5050/users";
        const params = new URLSearchParams();
        if (searchQuery) {
            params.append("filter", searchQuery);
        }

        const response = await fetch(`http://localhost:5050/user`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

        if (!response.ok) {
            throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setUsers(data);
        setLoading(false);
    } catch (error) {
        console.error("Error fetching users:", error.message);
        setLoading(false);
    }
};

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

	const handleEdit = async (userId) => {
  	const token = cookie.PassBloggs;
  if (!token) {
    navigate("/user/${userId");
    return;
  }

  try {
    const response = await fetch(`http://localhost:5050/user/${userId.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch user");
	}
    const userData = await response.json();
    navigate(`/id`);
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

    const handleDelete = async (userId) => {
        const token = cookie.PassBloggs;
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5050/user/${userId.toString()}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to delete user");
            }
            setUsers(users.filter((user) => user._id !== userId));
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    return (
        <div className="user-manager-container">
            <h1 className="user-content-title">User Manager</h1>
            <input
                type="text"
                placeholder="Search by first or last name"
                value={searchQuery}
                onChange={handleSearch}
            />
            {loading ? (
                <div className="skeleton-loader">
                    {[...Array(5)].map((_, index) => (
                        <div key={index} className="skeleton-row"></div>
                    ))}
                </div>
            ) : (
                <div>
                    <Table striped bordered hover className="user-content-table">
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.first_name}</td>
                                    <td>{user.last_name}</td>
                                    <td>
                                        <Button variant="primary" onClick={() => handleEdit(user._id)}>
                                            Edit
                                        </Button>
                                    </td>
                                    <td>
                                        <Button variant="danger" onClick={() => handleDelete(user._id)}>
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}
        </div>
    );
}
