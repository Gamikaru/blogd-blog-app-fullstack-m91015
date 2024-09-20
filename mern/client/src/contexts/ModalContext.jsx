// src/ModalContext.js
import { createContext, useState, useContext } from 'react';

// Create ModalContext
const ModalContext = createContext();

// Custom hook to use ModalContext
export const useModalContext = () => useContext(ModalContext);

// Provider component to wrap the app or components that need modal management
export const ModalProvider = ({ children }) => {
   const [showModal, setShowModal] = useState(false);

   // Toggle the modal visibility
   const toggleModal = () => {
      setShowModal(prev => !prev);
   };

   return (
      <ModalContext.Provider value={{ showModal, toggleModal }}>
         {children}
      </ModalContext.Provider>
   );
};
