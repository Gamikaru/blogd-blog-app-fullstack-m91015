// // src/services/newsService.js
// // Install node-fetch: npm install node-fetch

// import fetch from 'node-fetch'; // Import node-fetch
// import { logger } from '@utils';

// const NEWS_API_KEY = '3afd5da4debb40b29e42bc06f59637f1'; // Temporary direct reference
// const BASE_URL = 'https://newsapi.org/v2';

// export const fetchTrendingArticles = async () => {
//     try {
//         const response = await fetch(
//             `${BASE_URL}/everything?q=environment AND (sustainability OR "green technology")&sortBy=popularity&pageSize=5&language=en&apiKey=${NEWS_API_KEY}`
//         );

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
//         console.log('API response:', data); // Debug log

//         if (!data.articles || !Array.isArray(data.articles)) {
//             throw new Error('Invalid articles data');
//         }

//         return data.articles.map(article => ({
//             title: article.title || 'No title',
//             excerpt: article.description || 'No description available',
//             image: article.urlToImage || '/placeholder-image.jpg',
//             date: new Date(article.publishedAt),
//             url: article.url
//         }));
//     } catch (error) {
//         logger.error('Error fetching news:', error);
//         return [];
//     }
// };