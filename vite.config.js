import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 커스텀 도메인(templete03.dreamitbiz.com)을 쓰므로 base는 '/'
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: { outDir: 'dist', sourcemap: false },
})
