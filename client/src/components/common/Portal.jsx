// components/common/Portal.jsx
import { createPortal } from 'react-dom';

const Portal = ({ children }) => {
    const portalRoot = document.getElementById('portal-root');
    if (!portalRoot) {
        console.error("portal-root not found!");
        return null; // Return nothing if portal-root is missing
    }
    return createPortal(children, portalRoot);
};


export default Portal;