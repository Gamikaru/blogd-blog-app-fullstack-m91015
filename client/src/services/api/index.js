// src/services/api/index.js

export { default as ApiClient } from './ApiClient';
export { fetchTrendingArticles } from './newsService';
export { fetchPostsByUser } from './PostService';
export * from './PostService';
export { default as UserService } from './UserService';

