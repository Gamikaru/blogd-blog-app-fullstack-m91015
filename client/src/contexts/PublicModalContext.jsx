// src/contexts/PublicModalContext.jsx

import PropTypes from 'prop-types';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import logger from '../utils/logger';


export const PublicModalContext = createContext();

export const usePublicModalContext = () => {
    const context = useContext(PublicModalContext);
    if (!context) {
        throw new Error('usePublicModalContext must be used within a PublicModalProvider');
    }
    return context;
};

export const PublicModalProvider = ({ children }) => {
    const [publicModalState, setPublicModalState] = useState({
        showModal: false,
        modalType: null,
    });

    const togglePublicModal = useCallback((modalType = null) => {
        logger.info(`Toggling public modal: ${modalType}`);
        setPublicModalState((prev) => ({
            showModal: !prev.showModal,
            modalType: !prev.showModal ? modalType : null,
        }));
    }, []);

    const contextValue = useMemo(
        () => ({
            ...publicModalState,
            togglePublicModal,
        }),
        [publicModalState, togglePublicModal]
    );

    return (
        <PublicModalContext.Provider value={contextValue}>
            {children}
        </PublicModalContext.Provider>
    );
};

// Define PropTypes for PublicModalProvider
PublicModalProvider.propTypes = {
    children: PropTypes.node.isRequired,
};


// src/contexts/PrivateModalContext.jsx
