import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";


export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [cookie] = useCookies();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);

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
        throw new Error(
          `Failed to fetch users: ${response.status} ${response.statusText}`
        );
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

  const handleEdit = (userId) => {
    navigate(`/edit-user/${userId}`); // Navigate to EditUser with userId as route param
  };

  const handleDelete = async (userId) => {
    console.log(`Deleting user: ${userId}`);
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
      console.log(`Response: ${response.status} ${response.statusText}`);
      if (!response.ok) {
        throw new Error(
          `Failed to delete user: ${response.status} ${response.statusText}`
        );
      }
      // Remove the deleted user from state or refetch users
    } catch (error) {
      console.error(`Error deleting user: ${error}`);
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
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
                <th>
                  <Button
                    className="user-back-bttn"
                    variant="secondary"
                    onClick={prevPage}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  First Name
                </th>
                <th>Last Name</th>
                <th>Edit</th>
                <th>
                  Delete
                  <Button
                    className="user-next-bttn"
                    variant="secondary"
                    onClick={nextPage}
                    disabled={indexOfLastUser >= users.length}
                  >
                    Next
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.first_name}</td>
                  <td>{user.last_name}</td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => handleEdit(user._id)} // Pass userId to handleEdit
                    >
                      Edit
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(user._id)}
                    >
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
