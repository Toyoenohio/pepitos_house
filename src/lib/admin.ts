/**
 * Sesión del panel admin — server-side.
 *
 * Antes la contraseña estaba escrita en el componente React, que se compila y se
 * sirve al navegador: cualquiera podía leerla del bundle o de GitHub (el repo es
 * público) y entrar. Ahora la contraseña vive SOLO en el entorno de Cloudflare y
 * se valida en el servidor; el navegador recibe una cookie HttpOnly firmada que
 * no puede leer ni falsificar sin el secreto.
 *
 * Solo APIs web (crypto.subtle): funciona tanto en el runtime de Cloudflare como
 * en Node, sin imports de node:*.
 */

export const ADMIN_COOKIE = 'ph251_admin';

/** Cuánto dura la sesión (segundos). */
const SESSION_TTL = 60 * 60 * 12; // 12 h

const enc = new TextEncoder();

function b64url(bytes: ArrayBuffer | Uint8Array): string {
  const b = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = '';
  for (const x of b) s += String.fromCharCode(x);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Comparación en tiempo constante sobre bytes UTF-8. */
function safeEqual(a: string, b: string): boolean {
  const A = enc.encode(a);
  const B = enc.encode(b);
  // Comparar siempre la misma cantidad de bytes para no filtrar el largo.
  let diff = A.length ^ B.length;
  const n = Math.max(A.length, B.length);
  for (let i = 0; i < n; i++) diff |= (A[i] ?? 0) ^ (B[i] ?? 0);
  return diff === 0;
}

async function hmac(secret: string, msg: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(msg));
  return b64url(sig);
}

/** El secreto de firma: dedicado si existe, si no derivado de la contraseña admin. */
function sessionSecret(env: Record<string, any>): string | null {
  const s = env?.ADMIN_SESSION_SECRET || env?.SESSION_SECRET;
  if (s) return String(s);
  const p = env?.ADMIN_PASSWORD;
  // Derivar de la contraseña evita exigir dos variables para arrancar, pero
  // ADMIN_SESSION_SECRET es lo recomendado (rotar la sesión sin cambiar la clave).
  return p ? `derived:${String(p)}` : null;
}

export function adminPassword(env: Record<string, any>): string | null {
  const p = env?.ADMIN_PASSWORD;
  return p ? String(p) : null;
}

export async function verifyPassword(candidate: string, env: Record<string, any>): Promise<boolean> {
  const expected = adminPassword(env);
  if (!expected) return false; // sin contraseña configurada no se entra (fail-closed)
  return safeEqual(candidate, expected);
}

/** Firma un token de sesión: `<exp>.<hmac>` */
export async function issueToken(env: Record<string, any>): Promise<string | null> {
  const secret = sessionSecret(env);
  if (!secret) return null;
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL;
  const sig = await hmac(secret, String(exp));
  return `${exp}.${sig}`;
}

/** Valida el token: firma correcta y sin vencer. */
export async function verifyToken(token: string | undefined | null, env: Record<string, any>): Promise<boolean> {
  if (!token) return false;
  const secret = sessionSecret(env);
  if (!secret) return false;
  const [expPart, sig] = String(token).split('.');
  if (!expPart || !sig) return false;
  const exp = Number(expPart);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return false;
  const expected = await hmac(secret, expPart);
  return safeEqual(sig, expected);
}

/** Env del runtime (Cloudflare) o process.env como fallback en local. */
export function runtimeEnv(locals: any): Record<string, any> {
  const ru = locals?.runtime?.env;
  return ru || (typeof process !== 'undefined' ? process.env : {}) || {};
}

export const cookieOptions = {
  httpOnly: true,
  sameSite: 'strict' as const,
  secure: true,
  path: '/',
  maxAge: SESSION_TTL,
};

export function json(body: unknown, status = 200, extraHeaders: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...extraHeaders },
  });
}
