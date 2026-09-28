import type { APIRoute } from 'astro';

export const prerender = true;

/**
 * Sitemap escrito a mano y no con @astrojs/sitemap: el proyecto está en
 * `output: 'server'`, así que las páginas NO son estáticas y el integrador
 * generaría un sitemap vacío. Acá se listan las rutas públicas, con el dominio
 * real resuelto en build desde `site`.
 */
const ROUTES: Array<{ path: string; priority: string; changefreq: string }> = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/menu', priority: '0.9', changefreq: 'weekly' },
  { path: '/membresia', priority: '0.7', changefreq: 'monthly' },
  { path: '/checkout', priority: '0.3', changefreq: 'monthly' },
];

export const GET: APIRoute = ({ site }) => {
  const base = (site?.href || 'https://pepitos-house-251.pages.dev/').replace(/\/+$/, '');
  const lastmod = new Date().toISOString().split('T')[0];

  const urls = ROUTES.map(
    (r) =>
      `  <url>\n` +
      `    <loc>${base}${r.path}</loc>\n` +
      `    <lastmod>${lastmod}</lastmod>\n` +
      `    <changefreq>${r.changefreq}</changefreq>\n` +
      `    <priority>${r.priority}</priority>\n` +
      `  </url>`
  ).join('\n');

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(xml, {
    headers: { 'content-type': 'application/xml; charset=utf-8' },
  });
};
