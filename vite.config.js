import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@mediapipe/tasks-vision'],
  },
  server: {
    host: true,
    // Camera + Bluetooth require secure context; use https: true with a local cert
    // if accessing from a non-localhost origin.
  },
})
