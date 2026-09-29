import type { APIRoute } from 'astro';
import { getDb } from '../../../db/client';
import { storeSettings } from '../../../db/schema';
import { ADMIN_COOKIE, json, runtimeEnv, verifyToken } from '../../../lib/admin';
import { getEffectiveStoreStatus, type StoreMode } from '../../../lib/storeStatus';

export const prerender = false;

/**
 * GET /api/admin/store-status
 * Obtiene el estado y configuración actual de la tienda.
 */
export const GET: APIRoute = async ({ cookies, locals }) => {
  const env = runtimeEnv(locals);

  if (!(await verifyToken(cookies.get(ADMIN_COOKIE)?.value, env))) {
    return json({ error: 'No autorizado.' }, 401);
  }

  try {
    const status = await getEffectiveStoreStatus(locals);
    return json(status);
  } catch (err) {
    return json({ error: 'Error al consultar estado de la tienda.' }, 500);
  }
};

/**
 * POST /api/admin/store-status
 * Guarda el modo de apertura del local: 'open' | 'closed' | 'auto', y nota personalizada.
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

  const mode = String(body?.mode ?? '').toLowerCase().trim() as StoreMode;
  if (mode !== 'open' && mode !== 'closed' && mode !== 'auto') {
    return json({ error: 'Modo inválido. Debe ser: open, closed o auto.' }, 400);
  }

  const notice = typeof body?.notice === 'string' ? body.notice.trim().slice(0, 300) : '';

  const db = getDb(env?.DATABASE_URL);
  if (!db) {
    return json({ error: 'Sin conexión a la base de datos.' }, 503);
  }

  try {
    // Upsert store_mode
    await db
      .insert(storeSettings)
      .values({ key: 'store_mode', value: mode, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: storeSettings.key,
        set: { value: mode, updatedAt: new Date() },
      });

    // Upsert store_notice
    await db
      .insert(storeSettings)
      .values({ key: 'store_notice', value: notice, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: storeSettings.key,
        set: { value: notice, updatedAt: new Date() },
      });

    const status = await getEffectiveStoreStatus(locals);
    return json({ success: true, ...status });
  } catch (err) {
    return json({ error: 'Error al guardar la configuración.', details: String(err) }, 500);
  }
};
