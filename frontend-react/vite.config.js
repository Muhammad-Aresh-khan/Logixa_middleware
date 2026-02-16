import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  // Load env from backend directory
  const env = loadEnv(mode, path.resolve(__dirname, '../backend'), '')
  const appPort = env.APP_PORT || '5000'
  const frontendPort = parseInt(env.FRONTEND_PORT) || 5174
  const target = `http://127.0.0.1:${appPort}`

  return {
    plugins: [react()],
    server: {
      port: frontendPort,
      proxy: {
        '/create_account': { target, changeOrigin: true },
        '/login': { target, changeOrigin: true },
        '/get_license_details': { target, changeOrigin: true },
        '/map_user': { target, changeOrigin: true },
        '/get_available_licenses': { target, changeOrigin: true },
      },
    },
  }
})
