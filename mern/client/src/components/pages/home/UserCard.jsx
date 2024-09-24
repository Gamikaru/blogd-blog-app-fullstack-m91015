import React, { useCallback } from "react";
import { Card } from "react-bootstrap";
import { FaBirthdayCake, FaBriefcase, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const UserCard = React.memo(({ userInitials, user, updateUserStatus, status, setStatus }) => {
   // Format birthdate using user data
   const formattedBirthdate = new Date(user.birthDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
   });

   // Memoize event handler to avoid re-creation on each render
   const handleKeyDown = useCallback(
      (e) => {
         if (e.key === "Enter") {
            e.preventDefault();
            updateUserStatus(status); // Optimistically update the status
         }
      },
      [status, updateUserStatus]
   );

   return (
      <div className="user-card-container">
         <Card className="user-card">
            <div className="user-card-header">
               <div className="initials-title">{userInitials}</div>
               <label htmlFor="status-update" className="sr-only">Update Status</label>
               <input
                  id="status-update"
                  type="text"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)} // Update local state
                  onBlur={() => updateUserStatus(status)} // Optimistically update status on blur
                  onKeyDown={handleKeyDown}
                  placeholder="Update Status"
                  aria-label="Update your status"
               />
            </div>
            <Card.Body className="user-details">
               <div className="detail-item">
                  <FaEnvelope className="detail-icon" />
                  <span className="detail-text">{user.email}</span>
               </div>
               <div className="detail-item">
                  <FaBirthdayCake className="detail-icon" />
                  <span className="detail-text">{formattedBirthdate}</span>
               </div>
               <div className="detail-item">
                  <FaBriefcase className="detail-icon" />
                  <span className="detail-text">{user.occupation}</span>
               </div>
               <div className="detail-item">
                  <FaMapMarkerAlt className="detail-icon" />
                  <span className="detail-text">{user.location}</span>
               </div>
            </Card.Body>
         </Card>
      </div>
   );
});

export default UserCard;
