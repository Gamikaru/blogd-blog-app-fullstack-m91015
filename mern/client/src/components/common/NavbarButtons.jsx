// src/components/NavbarButtons.jsx
import React from 'react';
import { Button } from 'react-bootstrap';
import { useModalContext } from '../../contexts';
import UserDropdown from './UserDropdown';

const NavbarButtons = ({ handleAccountModal, handleLogout }) => {
   const { toggleModal } = useModalContext(); // Hook to control PostModal visibility

   return (
      <div className="navbar-buttons">
         {/* Post Button to trigger PostModal */}
         <Button aria-label="Create Post" className="post-button" onClick={toggleModal}>
            POST
         </Button>
         <UserDropdown handleAccountModal={handleAccountModal} handleLogout={handleLogout} />
      </div>
   );
};

export default NavbarButtons;
