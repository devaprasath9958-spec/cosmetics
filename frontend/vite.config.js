import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => {
  // Vercel deployment exposes VERCEL="1"
  const isVercel = process.env.VERCEL === '1';
  
  return {
    plugins: [react()],
    // Use /cosmetics/ only for GitHub Pages production build, not Vercel
    base: command === 'build' && !isVercel ? '/cosmetics/' : '/',
  };
});