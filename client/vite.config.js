import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@components': path.resolve(__dirname, 'src/components'),
            '@services': path.resolve(__dirname, 'src/services'),
            '@utils': path.resolve(__dirname, 'src/utils'),
            '@contexts': path.resolve(__dirname, 'src/contexts'),
            '@scss': path.resolve(__dirname, 'src/scss')
        },
    },
    optimizeDeps: {
        include: ['swiper/react'], // Include only JavaScript dependencies
    },
});
