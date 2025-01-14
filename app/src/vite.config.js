import { defineConfig } from 'vite';

export default defineConfig({
  base: "./",
  build: {
    minify: false,
    terserOptions: {
      compress: false,
      mangle: false
    }
  }
})