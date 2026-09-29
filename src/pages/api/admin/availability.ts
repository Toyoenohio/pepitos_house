import type { APIRoute } from 'astro';
import { getDb } from '../../../db/client';
import { menuItems } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { ADMIN_COOKIE, json, runtimeEnv, verifyToken } from '../../../lib/admin';

export const prerender = false;

const VALID_DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

/**
 * Guarda el estado de disponibilidad de un plato (86 / días activos) en la base.
 * Requiere sesión de admin válida: antes esto vivía en localStorage del navegador
 * (cualquiera podía "cambiarlo" y no le afectaba a nadie).
 */
export const POST: APIRoute = async ({ request, cookies, locals }) => {
  const env = runtimeEnv(locals);

  if (!(await verifyToken(cookies.get(ADMIN_COOKIE)?.value, env))) {
    return json({ error: 'No autorizado.' }, 401);
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Cuerpo inválido.' }, 400);
  }

  const id = String(body?.id ?? '').trim();
  if (!id || id.length > 64) return json({ error: 'id inválido.' }, 400);

  const isAvailable = body?.isAvailable !== false; // default: disponible
  const days = Array.isArray(body?.availableDays)
    ? body.availableDays.filter((d: unknown) => VALID_DAYS.includes(String(d)))
    : VALID_DAYS;

  const db = getDb(env?.DATABASE_URL);
  if (!db) return json({ error: 'Sin conexión a la base de datos.' }, 503);

  try {
    const updated = await db
      .update(menuItems)
      .set({ isAvailable, availableDays: days, updatedAt: new Date() })
      .where(eq(menuItems.id, id))
      .returning({ id: menuItems.id });

    if (updated.length === 0) {
      // El catálogo vive en src/lib/productsData.ts y se siembra en la base con
      // npm run db:seed. Sin esa fila no hay dónde guardar el estado.
      return json({ error: 'Plato no encontrado en la base. Corré `npm run db:seed`.' }, 404);
    }

    return json({ ok: true, id, isAvailable, availableDays: days });
  } catch {
    return json({ error: 'No se pudo guardar.' }, 500);
  }
};
