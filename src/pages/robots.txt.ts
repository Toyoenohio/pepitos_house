import type { APIRoute } from 'astro';

export const prerender = true;

/**
 * robots.txt generado, no estático: así el sitemap apunta siempre al dominio
 * real (Astro.site) y no a uno escrito a mano que puede no existir.
 *
 * Antes: public/robots.txt declaraba `https://pepitoshouse251.com/sitemap.xml`,
 * un dominio que no resuelve y un sitemap que no existía.
 */
export const GET: APIRoute = ({ site }) => {
  const base = (site?.href || 'https://pepitos-house-251.pages.dev/').replace(/\/+$/, '');
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    '# El panel administrativo no se indexa',
    'Disallow: /admin',
    'Disallow: /api/',
    '',
    `Sitemap: ${base}/sitemap.xml`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
};
