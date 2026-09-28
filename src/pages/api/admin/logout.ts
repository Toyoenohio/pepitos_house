import type { APIRoute } from 'astro';
import { ADMIN_COOKIE, json } from '../../../lib/admin';

export const prerender = false;

export const POST: APIRoute = async ({ cookies }) => {
  cookies.delete(ADMIN_COOKIE, { path: '/' });
  return json({ ok: true });
};
