import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

function googleApiProxy() {
  return {
    target: 'https://generativelanguage.googleapis.com',
    changeOrigin: true,
    secure: true,
    rewrite: (path) => path.replace(/^\/api\/google/, '/v1beta'),
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    proxy: {
      '/api/google': googleApiProxy(),
    },
  },
  preview: {
    proxy: {
      '/api/google': googleApiProxy(),
    },
  },
})
