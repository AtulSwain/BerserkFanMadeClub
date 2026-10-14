import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

const imagesDir = fileURLToPath(new URL('../images', import.meta.url));

/** Watch ../images so a picture dropped in shows up without restarting the dev server. */
function watchImages(): Plugin {
  return {
    name: 'watch-images',
    configureServer(server) {
      server.watcher.add(imagesDir);
      const reload = (file: string) => {
        if (!file.startsWith(imagesDir)) return;
        const mod = server.moduleGraph.getModuleById(fileURLToPath(new URL('./src/data/assets.ts', import.meta.url)));
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('add', reload);
      server.watcher.on('unlink', reload);
    },
  };
}

export default defineConfig({
  // BASE_PATH lets the same build serve from a sub-path, e.g. /BerserkFanMadeClub/ on GitHub Pages.
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), watchImages()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  // Pictures live in ../images (outside this app folder) so they are easy to find.
  server: { fs: { allow: ['..'] } },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
  },
});
