import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import envCompatible from 'vite-plugin-env-compatible'


// https://vitejs.dev/config/
export default defineConfig({
  envPrefix: ['BACKEND_URL', 'FRONTEND_URL','production_url'],
  plugins:[
    react(),
    envCompatible(),
  ],
  
})
