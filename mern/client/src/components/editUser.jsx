import React, { useState } from "react";
import { useNavigate } from "react-router";
import Card from "react-bootstrap/Card";
import Toast from "react-bootstrap/Toast";

export default function EditUser() {
	const [editForm, setEditForm] = useState({
		first_name: "",
		last_name: "",
		email: "",
		password: "",
		birthdate: "",
		occupation: "",
		location: "",
		status: "",
	});
	const [showSuccessToast, setShowSuccessToast] = useState(false);
	const [showErrorToast, setShowErrorToast] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
		fetchUser();
	}, []);

    const fetchUser = async () => {
		const token = cookie.PassBloggs;
		if (!token) {
			console.error("Token not found in localStorage");
			return;
		}
		try {
			const response = await fetch(`http://localhost:5050/user/${cookie.userID}`, {
				headers: {
				Authorization: `Bearer ${token}`,
				},
			});
			if (!response.ok) {
				throw new Error(`Failed to fetch user data: ${response.statusText}`);
			}
			const data = await response.json();
			console.log(data)
			setUser(data);
		} catch (error) {
			console.error("Error fetching user data:", error);
		}
    };
    
	function updateEditForm(value) {
		console.log("Updating form field:", value);
		setEditForm((prev) => ({ ...prev, ...value }));
	}

async function handleEdit(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
        console.error("Token not found in localStorage");
        return;
    }
    try {
        const response = await fetch(`http://localhost:5050/user/edit/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(editForm),
        });
        if (!response.ok) {
            throw new Error(`Failed to update user data: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data);
        // If the response is successful, reset the form fields
        setEditForm({
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            birthdate: "",
            occupation: "",
            location: "",
            status: "",
        });
        setShowSuccessToast(true);
        navigate("/user-manager");
    } catch (error) {
        console.error("Error occurred during user update:", error.message);
        alert("Update user failed. " + error.message);
        setShowErrorToast(true);
    }
}
	// Render the Edit form
	return (
		<div className="edit-container">
			<Toast
				show={showSuccessToast}
				onClose={() => setShowSuccessToast(false)}
				className="edit-success-toast"
				autohide
				delay={6000}
			>
				<Toast.Body className="edit-toast-body-success">
					Successful registration!
				</Toast.Body>
			</Toast>
			<Toast
				show={showErrorToast}
				onClose={() => setShowErrorToast(false)}
				className="edit-error-toast"
				autohide
				delay={6000}
			>
				<Toast.Body className="toast-body-error">
					Invalid update attempt
				</Toast.Body>
			</Toast>
			<div className="edit-card-container">
				<Card>
					<Card.Body>
						<h1 className="edit-card-header">Update User Info</h1>
						<form onSubmit={handleEdit}>
							<div className="edit-input-container">
								<div className="edit-input-column">
									<div className="edit-input-container">
										<label htmlFor="edit_first_name"></label>
										<input
											type="text"
											placeholder="First Name"
											id="edit_first_name"
											value={editForm.first_name}
											onChange={(e) =>
												updateEditForm({ first_name: e.target.value })
											}
											required
										/>
									</div>
									<div className="edit-input-container">
										<label htmlFor="edit_email"></label>
										<input
											type="text"
											placeholder="Email"
											id="edit_email"
											value={editForm.email}
											onChange={(e) =>
												updateEditForm({ email: e.target.value })
											}
											required
										/>
									</div>
									<div className="edit-input-container">
										<label htmlFor="edit_password"></label>
										<input
											type="password"
											placeholder="Password"
											id="edit_password"
											value={editForm.password}
											onChange={(e) =>
												updateEditForm({ password: e.target.value })
											}
											required
										/>
									</div>
									<div className="edit-input-container">
										<label htmlFor="edit_location"></label>
										<input
											type="text"
											placeholder="Location"
											id="edit_location"
											value={editForm.location}
											onChange={(e) =>
												updateEditForm({ location: e.target.value })
											}
											required
										/>
									</div>
								</div>
								<div className="edit-input-column">
									<div className="edit-input-container">
										<label htmlFor="edit_last_name"></label>
										<input
											type="text"
											placeholder="Last Name"
											id="edit_last_name"
											value={editForm.last_name}
											onChange={(e) =>
												updateEditForm({ last_name: e.target.value })
											}
											required
										/>
									</div>
									<div className="edit-input-container">
										<label htmlFor="edit_birthdate"></label>
										<input
											type="date"
											placeholder="Birthdate"
											id="edit_birthdate"
											value={editForm.birthdate}
											onChange={(e) =>
												updateEditForm({ birthdate: e.target.value })
											}
											required
										/>
									</div>
									<div className="edit-input-container">
										<label htmlFor="edit_occupation"></label>
										<input
											type="text"
											placeholder="Occupation"
											id="edit_occupation"
											value={editForm.occupation}
											onChange={(e) =>
												updateEditForm({ occupation: e.target.value })
											}
											required
										/>
									</div>
									<div className="edit-input-container">
										<label htmlFor="edit_status"></label>
										<input
											type="text"
											placeholder="Status"
											id="edit_status"
											value={editForm.status}
											onChange={(e) =>
												updateEditForm({ status: e.target.value })
											}
											required
										/>
									</div>
								</div>
							</div>
							<div className="edit-form-group">
								<input
									type="submit"
									value="UPDATE"
									className="btn btn-primary"
								/>
							</div>
						</form>
					</Card.Body>
				</Card>
			</div>
		</div>
	);
}
