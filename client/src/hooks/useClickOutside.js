// src/hooks/useClickOutside.js
import { useEffect } from 'react';

/**
 * Hook that alerts clicks outside of the specified element.
 * @param {React.RefObject} ref - The ref of the element to detect outside clicks.
 * @param {Function} handler - The function to call on outside click.
 */
const useClickOutside = (ref, handler) => {
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                handler();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, handler]);
};

export default useClickOutside;