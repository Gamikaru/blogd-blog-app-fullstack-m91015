
// import React, { useEffect, useState } from "react";
// import { Button, Card, Form, Toast } from "react-bootstrap";
// import { useCookies } from "react-cookie";
// import { useNavigate, useParams } from "react-router-dom";

// export default function EditUser() {
//   const { userId } = useParams();
//   const [cookie] = useCookies();
//   const [editForm, setEditForm] = useState({
//     first_name: "",
//     last_name: "",
//     email: "",
//     password: "",
//     birthdate: "",
//     occupation: "",
//     location: "",
//     status: "",
//   });
//   const [showSuccessToast, setShowSuccessToast] = useState(false);
//   const [showErrorToast, setShowErrorToast] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (userId) {
//       fetchUser(userId); // Fetch user data on component mount
//     }
//   }, [userId]);

//   const fetchUser = async (id) => {
//     const token = cookie.PassBloggs;
//     if (!token) {
//       console.error("Token not found");
//       return;
//     }
//     try {
//       const response = await fetch(`http://localhost:5050/user/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (!response.ok) {
//         throw new Error(`Failed to fetch user data: ${response.statusText}`);
//       }
//       const data = await response.json();
//       setEditForm(data); // Populate form with user data
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//     }
//   };

//   const updateEditForm = (value) => {
//     setEditForm((prev) => ({ ...prev, ...value }));
//   };

//   const handleEdit = async (e) => {
//     e.preventDefault();
//     const token = cookie.PassBloggs;
//     if (!token) {
//       console.error("Token not found");
//       return;
//     }
//     try {
//       const response = await fetch(`http://localhost:5050/user/${userId}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(editForm),
//       });
//       if (!response.ok) {
//         throw new Error(`Failed to update user: ${response.statusText}`);
//       }
//       setShowSuccessToast(true);
//       setTimeout(() => {
//         navigate("/user-manager"); // Redirect after success
//       }, 3000);
//     } catch (error) {
//       setShowErrorToast(true);
//     }
//   };

//   return (
//     <div className="edit-user-container">
//       <Toast
//         show={showSuccessToast}
//         onClose={() => setShowSuccessToast(false)}
//         className="edit-toast-success"
//         autohide
//         delay={6000}
//       >
//         <Toast.Body>Successful User Update!</Toast.Body>
//       </Toast>

//       <Toast
//         show={showErrorToast}
//         onClose={() => setShowErrorToast(false)}
//         className="edit-toast-error"
//         autohide
//         delay={6000}
//       >
//         <Toast.Body>Failed to update user!</Toast.Body>
//       </Toast>

//       <Card className="edit-user-card">
//         <Card.Body>
//           <h1 className="edit-user-header">Manage User Information</h1>
//           <Form onSubmit={handleEdit} className="edit-user-form">
//             <div className="edit-form-columns">
//               <div className="edit-form-column">
//                 <Form.Group controlId="editFirstName" className="mb-3">
//                   <Form.Label>First Name</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={editForm.first_name}
//                     onChange={(e) =>
//                       updateEditForm({ first_name: e.target.value })
//                     }
//                     required
//                   />
//                 </Form.Group>

//                 <Form.Group controlId="editEmail" className="mb-3">
//                   <Form.Label>Email</Form.Label>
//                   <Form.Control
//                     type="email"
//                     value={editForm.email}
//                     onChange={(e) => updateEditForm({ email: e.target.value })}
//                     required
//                   />
//                 </Form.Group>

//                 <Form.Group controlId="editPassword" className="mb-3">
//                   <Form.Label>Password</Form.Label>
//                   <Form.Control
//                     type="password"
//                     value={editForm.password}
//                     onChange={(e) =>
//                       updateEditForm({ password: e.target.value })
//                     }
//                     required
//                   />
//                 </Form.Group>

//                 <Form.Group controlId="editLocation" className="mb-3">
//                   <Form.Label>Location</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={editForm.location}
//                     onChange={(e) =>
//                       updateEditForm({ location: e.target.value })
//                     }
//                     required
//                   />
//                 </Form.Group>
//               </div>

//               <div className="edit-form-column">
//                 <Form.Group controlId="editLastName" className="mb-3">
//                   <Form.Label>Last Name</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={editForm.last_name}
//                     onChange={(e) =>
//                       updateEditForm({ last_name: e.target.value })
//                     }
//                     required
//                   />
//                 </Form.Group>

//                 <Form.Group controlId="editBirthdate" className="mb-3">
//                   <Form.Label>Birthdate</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={editForm.birthdate}
//                     onChange={(e) =>
//                       updateEditForm({ birthdate: e.target.value })
//                     }
//                     placeholder="yyyy-MM-dd"
//                     required
//                   />
//                 </Form.Group>

//                 <Form.Group controlId="editOccupation" className="mb-3">
//                   <Form.Label>Occupation</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={editForm.occupation}
//                     onChange={(e) =>
//                       updateEditForm({ occupation: e.target.value })
//                     }
//                     required
//                   />
//                 </Form.Group>

//                 <Form.Group controlId="editStatus" className="mb-3">
//                   <Form.Label>Status</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={editForm.status}
//                     onChange={(e) =>
//                       updateEditForm({ status: e.target.value })
//                     }
//                     required
//                   />
//                 </Form.Group>
//               </div>
//             </div>

//             <div className="edit-form-group">
//               <Button type="submit" className="btn-primary w-100">
//                 Update
//               </Button>
//             </div>
//           </Form>
//         </Card.Body>
//       </Card>
//     </div>
//   );
// }
