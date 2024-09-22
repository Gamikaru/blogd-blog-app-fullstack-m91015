import { createContext, useContext, useState } from 'react';
import Logger from '../utils/Logger';

// Create PublicModalContext
const PublicModalContext = createContext();

// Custom hook to use PublicModalContext
export const usePublicModalContext = () => useContext(PublicModalContext);

// Provider component to wrap the app or components that need public modal management
export const PublicModalProvider = ({ children }) => {
   const [publicModalState, setPublicModalState] = useState({
      showModal: false,
      modalType: null, // Can be 'register', 'login', etc.
   });

   // Function to toggle public modal visibility
   const togglePublicModal = (modalType = null) => {
      Logger.info(`Toggling public modal: ${modalType}`);
      setPublicModalState((prev) => ({
         showModal: !prev.showModal,
         modalType: !prev.showModal ? modalType : null,
      }));
   };

   return (
      <PublicModalContext.Provider value={{ ...publicModalState, togglePublicModal }}>
         {children}
      </PublicModalContext.Provider>
   );
};
