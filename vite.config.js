import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  base: './',
  build: {
    rollupOptions: {
      input: {
        home: 'index.html',
        kitchen: 'ayomasak-dapur.html',
        destination: 'ayomasak-destinasi.html',
        recipes: 'ayomasak-index-masakan.html',
        settings: 'ayomasak-pengaturan.html'
      }
    }
  }
});
