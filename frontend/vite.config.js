import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react'

export default ({ mode }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};
  return defineConfig({
    root: './',
    base: '/',
    server: {
      port: 3001,
      open: true,
    },
    plugins: [react()]
  })
}
