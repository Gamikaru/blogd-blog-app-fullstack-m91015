
//UserCard.jsx
import { InputField, Logger, UserService } from '@components';
import React, { useCallback } from "react";
import { FaBirthdayCake, FaBriefcase, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const UserCard = React.memo(({ user }) => {
    const [status, setStatus] = React.useState(user.status);

    // Format birthdate using user data
    const formattedBirthdate = new Date(user.birthDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const handleKeyDown = useCallback(
        async (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                Logger.info("Key pressed: Enter. Attempting to update status:", status);
                try {
                    await UserService.updateUserStatus(user._id, status);
                    Logger.info("Status updated successfully");
                } catch (error) {
                    Logger.error("Error updating status:", error);
                }
            }
        },
        [status, user._id]
    );

    const handleBlur = useCallback(async () => {
        Logger.info("Blur event triggered. Attempting to update status:", status);
        try {
            await UserService.updateUserStatus(user._id, status);
            Logger.info("Status updated successfully");
        } catch (error) {
            Logger.error("Error updating status:", error);
        }
    }, [status, user._id]);

    return (
        <div className="user-card-container">
            <div className="user-card">
                <div className="user-card-header">
                    <div className="initials-title">{`${user.firstName[0]}${user.lastName[0]}`}</div>
                    <div className="status-update-container">
                        <InputField
                            label="Update Status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)} // Update local state
                            onBlur={handleBlur} // Trigger update on blur
                            onKeyDown={handleKeyDown} // Trigger update on Enter
                            error={null}
                            placeholder="Enter your status here!"
                            className="status-update-input"
                        />
                    </div>
                </div>
                <div className="user-details">
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
                </div>
            </div>
        </div>
    );
});

export default UserCard;
