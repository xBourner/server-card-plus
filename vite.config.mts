import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/server-card-plus.ts',
      formats: ['es'],
      fileName: () => `server-card-plus.js`,
    },
    outDir: 'dist',
    rolldownOptions: {
      output: {
        codeSplitting: false,
      },
      external: [],
    },
  },
});
