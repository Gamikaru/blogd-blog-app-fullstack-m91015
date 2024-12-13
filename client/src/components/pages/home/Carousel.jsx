// // Carousel.jsx
// import { Button, Spinner } from '@components';
// import { motion } from 'framer-motion';
// import React, { useState } from "react";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// const Carousel = ({ articles, loading }) => {
//     const [activeSlide, setActiveSlide] = useState(0);

//     const nextSlide = () => {
//         setActiveSlide((prev) => (prev + 1) % articles.length);
//     };

//     const prevSlide = () => {
//         setActiveSlide((prev) => (prev - 1 + articles.length) % articles.length);
//     };

//     if (loading) return <Spinner message="Loading trending articles..." />;
//     if (articles.length === 0) return <p>No trending articles available.</p>;

//     return (
//         <div className="carouselContainer">
//             <Button onClick={prevSlide} className="button button-edit" style={{ left: "10px" }}>
//                 <FaChevronLeft />
//             </Button>
//             <div className="carouselTrackContainer">
//                 <div
//                     className="carouselTrack"
//                     style={{
//                         transform: `translateX(-${activeSlide * 100}%)`,
//                         width: `${articles.length * 100}%`,
//                     }}
//                 >
//                     {articles.map((article, index) => (
//                         <div key={index} className="carouselItem">
//                             <div className="imageCol">
//                                 <div className="imagePlaceholder">
//                                     <img src={article.image || "/placeholder.jpg"} alt={article.title} />
//                                 </div>
//                             </div>
//                             <div className="contentCol">
//                                 <h3 className="title">{article.title}</h3>
//                                 <div className="quote">{article.excerpt}</div>
//                                 <p className="date">{article.date.toLocaleDateString()}</p>
//                                 <p className="text">{article.text}</p>
//                                 <a href={article.url} className="readMore" target="_blank" rel="noopener noreferrer">
//                                     Read the Blog
//                                 </a>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//             <Button onClick={nextSlide} className="button button-edit" style={{ right: "10px" }}>
//                 <FaChevronRight />
//             </Button>
//             <div className="indicators">
//                 {articles.map((_, index) => (
//                     <Button
//                         key={index}
//                         onClick={() => setActiveSlide(index)}
//                         className="indicator"
//                         style={{
//                             backgroundColor: index === activeSlide ? "#333" : "#ccc",
//                         }}
//                     />
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default Carousel;
