import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Permite importar como 'src/...' en lugar de '../../'
  resolve: {
    alias: { src: fileURLToPath(new URL('./src', import.meta.url)) },
  },
})
