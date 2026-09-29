import type { APIRoute } from 'astro';
import { getDb } from '../../db/client';
import { orders, loyaltyMembers, loyaltyStamps } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { runtimeEnv } from '../../lib/env';
import { INITIAL_PRODUCTS, CATEGORY_MODIFIERS, type MenuItem, type ProductGroup } from '../../lib/productsData';

export const prerender = false;

/**
 * Alta de pedido.
 *
 * Antes: se guardaba TODO lo que mandaba el cliente (nombre, precios, totales) sin
 * validar nada, y se regalaba un sello de fidelidad por cualquier POST con un email.
 * Eso permitía (a) inventar pedidos y (b) inflar sellos hasta el pepito gratis.
 *
 * Ahora:
 *  - se valida y acota cada campo;
 *  - el precio se **recalcula en el servidor** contra el catálogo (el cliente no
 *    puede elegir cuánto paga);
 *  - si algo no se puede verificar, el pedido se acepta pero queda en
 *    `pending_review` y **no otorga sello**.
 */

const ZONES = ['Barcelona', 'Lechería', 'Puerto La Cruz'];
const MAX_ITEMS = 50;
const MAX_QTY = 50;
const MAX_TOTAL = 10000;
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[a-zA-Z]{2,}$/;
const PHONE_RE = /^[0-9+()\-\s.]{6,25}$/;

const byId = new Map<string, MenuItem>(INITIAL_PRODUCTS.map((p) => [p.id, p]));

function groupsFor(product: MenuItem): ProductGroup[] {
  if (product.groups && product.groups.length) return product.groups;
  return CATEGORY_MODIFIERS[product.category] || [];
}

/** Precio unitario teórico según catálogo. `null` = no verificable. */
function expectedUnitPrice(item: any): number | null {
  const product = byId.get(String(item?.productId ?? item?.id ?? ''));
  if (!product) return null;
  const groups = groupsFor(product);
  const deltas = new Map<string, number>();
  for (const g of groups) for (const o of g.options || []) deltas.set(o.id, Number(o.priceDelta) || 0);

  let total = Number(product.price) || 0;
  for (const m of item?.modifiers || []) {
    if (!deltas.has(m?.optionId)) return null; // opción desconocida → no verificable
    total += deltas.get(m.optionId)!;
  }
  return Math.round(total * 100) / 100;
}

const str = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max);
const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : NaN);

export const POST: APIRoute = async (context) => {
  const env = runtimeEnv(context.locals);

  let body: any;
  try {
    body = await context.request.json();
  } catch {
    return Response.json({ error: 'Cuerpo inválido.' }, { status: 400 });
  }

  // ---------------------------------------------------------- validación
  const c = body?.customer ?? {};
  const name = str(c.name, 80);
  const phone = str(c.phone, 25);
  const email = str(c.email, 120).toLowerCase();
  const zone = str(c.zone, 40);
  const address = str(c.address, 200);
  const reference = str(c.reference, 200);
  const notes = str(c.notes, 250);
  const fullReference = notes ? (reference ? `${reference} | Nota: ${notes}` : `Nota: ${notes}`) : reference;
  const paymentMethod = str(c.paymentMethod, 40) || 'Por confirmar';

  const errors: string[] = [];
  if (name.length < 2) errors.push('nombre');
  if (!PHONE_RE.test(phone)) errors.push('teléfono');
  if (email && !EMAIL_RE.test(email)) errors.push('email');
  if (!ZONES.includes(zone)) errors.push('zona de entrega');
  if (address.length < 5) errors.push('dirección');

  const rawItems = Array.isArray(body?.items) ? body.items : [];
  if (rawItems.length === 0) errors.push('carrito vacío');
  if (rawItems.length > MAX_ITEMS) errors.push('demasiados ítems');

  if (errors.length) {
    return Response.json({ error: `Revisá: ${errors.join(', ')}.` }, { status: 400 });
  }

  // --------------------------------------------- recálculo de precios
  let verified = true;
  const items = rawItems.map((it: any) => {
    const qty = Math.min(Math.max(Math.floor(num(it?.quantity) || 0), 1), MAX_QTY);
    const clientPrice = Math.max(num(it?.unitPrice) || 0, 0);
    const expected = expectedUnitPrice(it);
    if (expected === null) verified = false;
    const unitPrice = expected === null ? clientPrice : expected;
    return {
      id: str(it?.id, 80),
      productId: str(it?.productId ?? it?.id, 80),
      name: str(it?.name, 120),
      size: str(it?.size, 40),
      quantity: qty,
      unitPrice: Math.round(unitPrice * 100) / 100,
      lineTotal: Math.round(unitPrice * qty * 100) / 100,
      modifiers: Array.isArray(it?.modifiers)
        ? it.modifiers.slice(0, 20).map((m: any) => ({
            groupName: str(m?.groupName, 60),
            optionName: str(m?.optionName, 80),
            priceDelta: Number(m?.priceDelta) || 0,
          }))
        : [],
    };
  });

  const subtotal = Math.round(items.reduce((s: number, i: { lineTotal: number }) => s + i.lineTotal, 0) * 100) / 100;
  const deliveryFee = Math.min(Math.max(num(body?.deliveryFee) || 0, 0), 50);
  const total = Math.round((subtotal + deliveryFee) * 100) / 100;

  if (total <= 0 || total > MAX_TOTAL) {
    return Response.json({ error: 'Total fuera de rango.' }, { status: 400 });
  }

  // Si el cliente mandó un total distinto al recalculado, el pedido es sospechoso.
  const clientTotal = num(body?.total);
  if (Number.isFinite(clientTotal) && Math.abs(clientTotal - total) > 0.5) verified = false;

  const status = verified ? 'pending_whatsapp' : 'pending_review';

  const db = getDb(env?.DATABASE_URL);
  if (!db) {
    // Sin base: no se pierde el pedido, el front igual manda el WhatsApp.
    return Response.json({ success: true, mode: 'fallback', subtotal, total }, { status: 201 });
  }

  try {
    const [n] = await db.insert(orders).values({
      customerName: name,
      customerPhone: phone,
      customerEmail: email || 'sin-email@pepitos.local',
      deliveryZone: zone,
      deliveryAddress: address,
      referencePoint: fullReference || '',
      paymentMethod,
      items,
      subtotal: String(subtotal),
      deliveryFee: String(deliveryFee),
      total: String(total),
      status,
    }).returning();

    // Sello SOLO si el pedido se pudo verificar contra el catálogo.
    if (verified && email) {
      const existing = await db.select().from(loyaltyMembers).where(eq(loyaltyMembers.email, email));
      if (existing.length > 0) {
        const m = existing[0];
        const newStamps = Math.min(m.currentStamps + 1, 10);
        await db.update(loyaltyMembers)
          .set({ currentStamps: newStamps, totalStamps: m.totalStamps + 1, lastStampAt: new Date() })
          .where(eq(loyaltyMembers.id, m.id));
      } else {
        await db.insert(loyaltyMembers).values({
          email, name, phone, currentStamps: 1, totalStamps: 1, cardsCompleted: 0, lastStampAt: new Date(),
        });
      }
      await db.insert(loyaltyStamps).values({
        memberEmail: email, orderId: n.id,
        note: existing.length > 0 ? 'Pedido registrado' : 'Primer pedido',
      });
    }

    return Response.json({ success: true, orderId: n.id, subtotal, total, status }, { status: 201 });
  } catch {
    return Response.json({ error: 'No se pudo guardar el pedido.' }, { status: 500 });
  }
};
