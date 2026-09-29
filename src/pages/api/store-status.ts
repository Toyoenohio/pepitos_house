import type { APIRoute } from 'astro';
import { getEffectiveStoreStatus } from '../../lib/storeStatus';
import { json } from '../../lib/admin';

export const prerender = false;

/**
 * GET /api/store-status
 * Endpoint público que informa si el restaurante está abierto o cerrado para pedidos
 * considerando si el administrador forzó la apertura o cierre manual, o si opera en horario automático.
 */
export const GET: APIRoute = async ({ locals }) => {
  try {
    const status = await getEffectiveStoreStatus(locals);
    return json(status, 200, {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    });
  } catch (err) {
    return json({ error: 'Error al consultar estado del local' }, 500);
  }
};
