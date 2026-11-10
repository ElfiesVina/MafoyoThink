import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' supaya jalan di Capacitor (APK) maupun GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: './',
});
