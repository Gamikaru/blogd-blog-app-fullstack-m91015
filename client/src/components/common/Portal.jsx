import PropTypes from 'prop-types';
import { memo, useMemo } from 'react';
import { createPortal } from 'react-dom';


const Portal = ({ children }) => {
    const portalRoot = useMemo(() => document.getElementById('portal-root'), []);

    if (!portalRoot) {
        console.error("portal-root not found!");
        return null;
    }

    return createPortal(children, portalRoot);
};

Portal.propTypes = {
    children: PropTypes.node.isRequired,
};

export default memo(Portal);
