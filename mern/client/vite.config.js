import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        // Add global SCSS imports here
        additionalData: `
          @import "src/styles/global/main.scss";
        `,
      },
    },
  },
});
