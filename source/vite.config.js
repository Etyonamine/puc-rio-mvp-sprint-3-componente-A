import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],  
  define:{
    'process.env.VITE_KEY': JSON.stringify(process.env.VITE_KEY)
  },
  preview: {              
    strictPort: true,
    port: 5173,
  },
  server:{
    port: 5173,
    strictPort: true,
    host: true,
    origin: "http://localhost:5173"
  }
});
