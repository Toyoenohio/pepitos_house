import type { APIRoute } from 'astro';
import {
  ADMIN_COOKIE, cookieOptions, issueToken, json, runtimeEnv, verifyPassword,
} from '../../../lib/admin';

export const prerender = false;

/**
 * Login del panel admin.
 *
 * La contraseña se compara contra ADMIN_PASSWORD del entorno (variable de
 * Cloudflare Pages). Nunca viaja al navegador ni queda en el bundle.
 * Devuelve una cookie HttpOnly firmada; el token no es adivinable sin el secreto.
 */

// Freno de fuerza bruta best-effort: vive por instancia (el runtime de Workers
// tiene muchas), así que NO reemplaza una regla de rate limiting en Cloudflare.
const attempts = new Map<string, { n: number; until: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 5 * 60 * 1000;

function clientIp(request: Request): string {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

export const POST: APIRoute = async ({ request, cookies, locals }) => {
  const env = runtimeEnv(locals);
  const ip = clientIp(request);
  const now = Date.now();

  const rec = attempts.get(ip);
  if (rec && rec.until > now && rec.n >= MAX_ATTEMPTS) {
    const secs = Math.ceil((rec.until - now) / 1000);
    return json({ error: `Demasiados intentos. Probá en ${secs}s.` }, 429);
  }

  let password = '';
  try {
    const body = await request.json();
    password = String(body?.password ?? '');
  } catch {
    return json({ error: 'Cuerpo inválido.' }, 400);
  }

  if (!password) return json({ error: 'Falta la contraseña.' }, 400);

  if (!env?.ADMIN_PASSWORD) {
    return json({ error: 'El panel no está configurado (falta ADMIN_PASSWORD).' }, 503);
  }

  if (!(await verifyPassword(password, env))) {
    const next = rec && rec.until > now ? { n: rec.n + 1, until: rec.until } : { n: 1, until: now + WINDOW_MS };
    attempts.set(ip, next);
    return json({ error: 'Contraseña incorrecta.' }, 401);
  }

  attempts.delete(ip);
  const token = await issueToken(env);
  if (!token) return json({ error: 'No se pudo crear la sesión.' }, 500);

  cookies.set(ADMIN_COOKIE, token, cookieOptions);
  return json({ ok: true });
};
