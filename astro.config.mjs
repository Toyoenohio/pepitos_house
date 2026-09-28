import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

// ⚠️ Un solo lugar para el dominio de producción.
// Todavía no está comprado, así que se configura por entorno: en Cloudflare Pages
// → Settings → Environment variables → SITE_URL=https://tudominio.com y redesplegar.
// De acá salen el canonical, el og:image absoluto, el sitemap y el robots.txt.
const SITE = process.env.SITE_URL || 'https://pepitos-house-251.pages.dev';

export default defineConfig({
  site: SITE,
  output: 'server',
  adapter: cloudflare({
    platformProxy: {
      enabled: true
    }
  }),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        // El runtime de Cloudflare Workers no expone `MessageChannel`, y el build
        // por defecto de react-dom/server (`.browser`) lo necesita para el
        // scheduler → el deploy falla con "MessageChannel is not defined".
        // `.edge` es el build pensado para runtimes de edge/Workers.
        'react-dom/server': 'react-dom/server.edge'
      }
    }
  }
});
