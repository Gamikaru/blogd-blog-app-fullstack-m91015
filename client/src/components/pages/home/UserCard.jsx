// //UserCard.jsx
// import { InputField } from '@components';
// import { UserService } from '@services/api';
// import { logger } from '@utils';
// import React, { useCallback } from "react";
// import { FaBirthdayCake, FaBriefcase, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

// const UserCard = React.memo(({ user }) => {
//     const [status, setStatus] = React.useState(user.status);

//     // Format birthdate using user data
//     const formattedBirthdate = new Date(user.birthDate).toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//     });

//     const handleKeyDown = useCallback(
//         async (e) => {
//             if (e.key === "Enter") {
//                 e.preventDefault();
//                 logger.info("Key pressed: Enter. Attempting to update status:", status);
//                 try {
//                     await UserService.updateUserStatus(user.userId, status);
//                     logger.info("Status updated successfully");
//                 } catch (error) {
//                     logger.error("Error updating status:", error);
//                 }
//             }
//         },
//         [status, user.userId]
//     );

//     const handleBlur = useCallback(async () => {
//         logger.info("Blur event triggered. Attempting to update status:", status);
//         try {
//             await UserService.updateUserStatus(user.userId, status);
//             logger.info("Status updated successfully");
//         } catch (error) {
//             logger.error("Error updating status:", error);
//         }
//     }, [status, user.userId]);

//     return (
//         <div className="user-card-container">
//             <div className="user-card">
//                 <div className="user-card-header">
//                     <div className="user-avatar">
//                         {user.profilePicture ? (
//                             <img src={user.profilePicture} alt="Profile" className="avatar-image" />
//                         ) : (
//                             <div className="initials-title">
//                                 {`${user.firstName[0]}${user.lastName[0]}`}
//                             </div>
//                         )}
//                     </div>
//                     <div className="status-update-container">
//                         <InputField
//                             label="Update Status"
//                             value={status}
//                             onChange={(e) => setStatus(e.target.value)} // Update local state
//                             onBlur={handleBlur} // Trigger update on blur
//                             onKeyDown={handleKeyDown} // Trigger update on Enter
//                             error={null}
//                             placeholder="Enter your status here!"
//                             className="status-update-input"
//                         />
//                     </div>
//                 </div>
//                 <div className="user-details">
//                     <div className="detail-item">
//                         <FaEnvelope className="detail-icon" />
//                         <span className="detail-text">{user.email}</span>
//                     </div>
//                     <div className="detail-item">
//                         <FaBirthdayCake className="detail-icon" />
//                         <span className="detail-text">{formattedBirthdate}</span>
//                     </div>
//                     <div className="detail-item">
//                         <FaBriefcase className="detail-icon" />
//                         <span className="detail-text">{user.occupation}</span>
//                     </div>
//                     <div className="detail-item">
//                         <FaMapMarkerAlt className="detail-icon" />
//                         <span className="detail-text">{user.location}</span>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// });

// export default UserCard;
