// import { createContext, useContext, useState } from 'react';
// import Logger from '../utils/Logger';

// // Create ModalContext
// const ModalContext = createContext();

// // Custom hook to use ModalContext
// export const useModalContext = () => useContext(ModalContext);

// // Provider component to wrap the app or components that need modal management
// export const ModalProvider = ({ children }) => {
//    // Maintain state for multiple modals
//    const [modalState, setModalState] = useState({
//       showModal: false,
//       modalType: null, // Can be 'post' or 'register'
//    });

//    // Function to toggle the modal visibility and specify its type
//    const toggleModal = (modalType = null) => {
//       if (!modalState.showModal && modalType) {
//          Logger.info(`Opening ${modalType} modal`);
//       } else if (modalState.showModal && modalType) {
//          Logger.info(`Closing ${modalType} modal`);
//       }

//       setModalState((prev) => ({
//          showModal: !prev.showModal,
//          modalType: !prev.showModal ? modalType : null,
//       }));
//    };


//    return (
//       <ModalContext.Provider value={{ ...modalState, toggleModal }}>
//          {children}
//       </ModalContext.Provider>
//    );
// };