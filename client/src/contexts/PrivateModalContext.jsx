// src/contexts/PrivateModalContext.jsx

import PropTypes from 'prop-types';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import logger from '../utils/logger';

export const PrivateModalContext = createContext();

export const usePrivateModalContext = () => {
    const context = useContext(PrivateModalContext);
    if (!context) {
        throw new Error('usePrivateModalContext must be used within a PrivateModalProvider');
    }
    return context;
};

export const PrivateModalProvider = ({ children }) => {
    const [privateModalState, setPrivateModalState] = useState({
        showModal: false,
        modalType: null,
    });

    const togglePrivateModal = useCallback((modalType = null) => {
        logger.info(`Toggling private modal: ${modalType}`);
        setPrivateModalState((prev) => ({
            showModal: !prev.showModal,
            modalType: !prev.showModal ? modalType : null,
        }));
    }, []);

    const contextValue = useMemo(
        () => ({
            ...privateModalState,
            togglePrivateModal,
        }),
        [privateModalState, togglePrivateModal]
    );

    return (
        <PrivateModalContext.Provider value={contextValue}>
            {children}
        </PrivateModalContext.Provider>
    );
};

PrivateModalProvider.propTypes = {
    children: PropTypes.node.isRequired,
};


