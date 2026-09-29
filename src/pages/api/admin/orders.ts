import type { APIRoute } from 'astro';
import { getDb } from '../../../db/client';
import { orders } from '../../../db/schema';
import { eq, desc } from 'drizzle-orm';
import { ADMIN_COOKIE, json, runtimeEnv, verifyToken } from '../../../lib/admin';

export const prerender = false;

export const VALID_ORDER_STATUSES = [
  'pending_whatsapp',
  'pending_review',
  'in_preparation',
  'ready_to_dispatch',
  'dispatched',
  'delivered',
  'cancelled'
] as const;

export type OrderStatus = typeof VALID_ORDER_STATUSES[number];

/**
 * GET /api/admin/orders
 * Retorna la lista de pedidos ordenada por fecha descendente.
 * Requiere sesión de admin válida.
 */
export const GET: APIRoute = async ({ cookies, locals, url }) => {
  const env = runtimeEnv(locals);

  if (!(await verifyToken(cookies.get(ADMIN_COOKIE)?.value, env))) {
    return json({ error: 'No autorizado.' }, 401);
  }

  const db = getDb(env?.DATABASE_URL);
  if (!db) {
    return json({ error: 'Sin conexión a la base de datos.' }, 503);
  }

  try {
    const limit = Math.min(Number(url.searchParams.get('limit')) || 100, 200);
    const rows = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(limit);

    return json({ orders: rows });
  } catch (err) {
    return json({ error: 'Error al consultar los pedidos.', details: String(err) }, 500);
  }
};

/**
 * PATCH /api/admin/orders
 * Actualiza el estado de un pedido (ej: in_preparation, ready_to_dispatch, delivered).
 * Requiere sesión de admin válida.
 */
export const PATCH: APIRoute = async ({ request, cookies, locals }) => {
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

  const orderId = Number(body?.orderId);
  const status = String(body?.status ?? '').trim() as OrderStatus;

  if (!orderId || !Number.isFinite(orderId)) {
    return json({ error: 'ID de pedido inválido.' }, 400);
  }

  if (!VALID_ORDER_STATUSES.includes(status)) {
    return json({ error: `Estado inválido: "${status}".` }, 400);
  }

  const db = getDb(env?.DATABASE_URL);
  if (!db) {
    return json({ error: 'Sin conexión a la base de datos.' }, 503);
  }

  try {
    const [updated] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, orderId))
      .returning();

    if (!updated) {
      return json({ error: 'Pedido no encontrado.' }, 404);
    }

    return json({ success: true, order: updated });
  } catch (err) {
    return json({ error: 'Error al actualizar el pedido.', details: String(err) }, 500);
  }
};

// Soporte POST como alias de PATCH para compatibilidad
export const POST: APIRoute = PATCH;
