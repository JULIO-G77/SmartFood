// Configuración de Vite (empaquetador) y de Vitest (pruebas unitarias).
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // En desarrollo, las peticiones a /api se envían al backend de SmartFood.
    proxy: { '/api': 'http://localhost:3000' }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js'
  }
});
