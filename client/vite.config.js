import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@components': path.resolve(__dirname, 'src/components'),
            '@scss': path.resolve(__dirname, 'src/scss'),
            // Add other aliases as needed
        },
    },
    optimizeDeps: {
        include: ['swiper/react'], // Include only JavaScript dependencies
    },
});
