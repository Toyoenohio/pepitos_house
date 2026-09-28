import type { APIRoute } from 'astro';
import { ADMIN_COOKIE, json, runtimeEnv, verifyToken } from '../../../lib/admin';

export const prerender = false;

/** ¿Hay sesión de admin válida? La usa el panel para decidir qué mostrar. */
export const GET: APIRoute = async ({ cookies, locals }) => {
  const env = runtimeEnv(locals);
  const ok = await verifyToken(cookies.get(ADMIN_COOKIE)?.value, env);
  return json({ authenticated: ok, configured: !!env?.ADMIN_PASSWORD });
};
