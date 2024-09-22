import React from "react";
import { Button } from "react-bootstrap";
import { useModalContext } from "../../contexts"; // Import useModalContext to handle PostModal
import UserDropdown from "./UserDropdown"; // Import the UserDropdown component

const NavbarButtons = ({ handleAccountModal, handleLogout }) => {
   const { toggleModal } = useModalContext(); // Access the context for toggling PostModal visibility

   return (
      <div className="navbar-buttons">
         {/* Button to create a new post */}
         <Button aria-label="Create Post" className="post-button" onClick={toggleModal}>
            POST
         </Button>

         {/* UserDropdown for account settings and logout */}
         <UserDropdown handleAccountModal={handleAccountModal} handleLogout={handleLogout} />
      </div>
   );
};

export default NavbarButtons;
