// src/services/api/index.js

export { default as ApiClient } from './ApiClient';
// export { fetchTrendingArticles } from './newsService';
export * from './PostService';
export { fetchPostsByUser } from './PostService';
export { default as UserService } from './UserService';

