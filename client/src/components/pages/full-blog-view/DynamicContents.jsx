// // DynamicContents.jsx
// import PropTypes from 'prop-types';
// import { useEffect, useState } from 'react';

// const DynamicContents = ({ contentRef }) => {
//     const [headings, setHeadings] = useState([]);
//     const [activeId, setActiveId] = useState('');

//     useEffect(() => {
//         const content = contentRef.current;
//         if (!content) return;

//         const headingElements = Array.from(
//             content.querySelectorAll('h2, h3')
//         );

//         const newHeadings = headingElements.map(heading => ({
//             id: heading.id || heading.textContent.replace(/\s+/g, '-').toLowerCase(),
//             text: heading.textContent,
//             level: heading.tagName,
//         }));

//         // Assign IDs if they don't exist
//         headingElements.forEach((heading, index) => {
//             if (!heading.id) {
//                 heading.id = newHeadings[index].id;
//             }
//         });

//         setHeadings(newHeadings);
//     }, [contentRef]);

//     useEffect(() => {
//         const handleScroll = () => {
//             const scrollPosition = window.scrollY + 100;
//             let current = '';

//             headings.forEach(heading => {
//                 const element = document.getElementById(heading.id);
//                 if (element && element.offsetTop <= scrollPosition) {
//                     current = heading.id;
//                 }
//             });

//             setActiveId(current);
//         };

//         window.addEventListener('scroll', handleScroll);
//         handleScroll();

//         return () => {
//             window.removeEventListener('scroll', handleScroll);
//         };
//     }, [headings]);

//     return (
//         <nav className="dynamic-contents">
//             <h3>Contents</h3>
//             <ul>
//                 {headings.map(heading => (
//                     <li key={heading.id} className={`level-${heading.level.toLowerCase()}`}>
//                         <a
//                             href={`#${heading.id}`}
//                             className={activeId === heading.id ? 'active' : ''}
//                         >
//                             {heading.text}
//                         </a>
//                     </li>
//                 ))}
//             </ul>
//         </nav>
//     );
// };

// DynamicContents.propTypes = {
//     contentRef: PropTypes.object.isRequired,
// };

// export default DynamicContents;