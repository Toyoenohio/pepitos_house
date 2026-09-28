import type { APIRoute } from 'astro';
import { getDb } from '../../db/client';
import { loyaltyMembers } from '../../db/schema';
import { eq } from 'drizzle-orm';

export const prerender = false;

/**
 * Tarjeta de sellos.
 *
 * Antes el GET devolvía el registro COMPLETO del miembro — incluido el teléfono —
 * a cualquiera que pasara un email por query string. Con un email conocido se
 * sacaba nombre y teléfono: filtración de datos personales y enumeración.
 * Ahora solo se devuelven los campos de la tarjeta, sin teléfono.
 *
 * Nota honesta: el email es la única credencial de esta consulta (es una tarjeta
 * de sellos, no una cuenta). La mitigación real del scraping es una regla de
 * rate limiting en Cloudflare sobre /api/loyalty.
 */

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[a-zA-Z]{2,}$/;

/** Proyección pública: sin teléfono, sin id interno, sin fechas. */
const card = (m: any) => ({
  email: m.email,
  name: m.name,
  currentStamps: m.currentStamps,
  totalStamps: m.totalStamps,
  cardsCompleted: m.cardsCompleted,
});

// Fallback en memoria para dev local sin base.
const localMembers = new Map<string, any>();

export const GET: APIRoute = async (context) => {
  const raw = context.url.searchParams.get('email') || '';
  const email = raw.toLowerCase().trim();
  if (!EMAIL_RE.test(email)) {
    return Response.json({ error: 'Email inválido.' }, { status: 400 });
  }

  const ru = (context.locals as any)?.runtime;
  const env = ru?.env || (typeof process !== 'undefined' ? process.env : {}) || {};
  const db = getDb(env?.DATABASE_URL);

  if (!db) {
    const m = localMembers.get(email);
    return Response.json({ member: m ? card(m) : null }, { status: 200 });
  }

  try {
    const rows = await db.select().from(loyaltyMembers).where(eq(loyaltyMembers.email, email));
    return Response.json({ member: rows.length ? card(rows[0]) : null }, { status: 200 });
  } catch {
    return Response.json({ error: 'No se pudo consultar la tarjeta.' }, { status: 500 });
  }
};

export const POST: APIRoute = async (context) => {
  let body: any;
  try {
    body = await context.request.json();
  } catch {
    return Response.json({ error: 'Cuerpo inválido.' }, { status: 400 });
  }

  const email = String(body?.email ?? '').toLowerCase().trim().slice(0, 120);
  const name = String(body?.name ?? '').trim().slice(0, 80);
  const phone = String(body?.phone ?? '').trim().slice(0, 25);

  if (!EMAIL_RE.test(email) || name.length < 2) {
    return Response.json({ error: 'Email y nombre son obligatorios.' }, { status: 400 });
  }

  const ru = (context.locals as any)?.runtime;
  const env = ru?.env || (typeof process !== 'undefined' ? process.env : {}) || {};
  const db = getDb(env?.DATABASE_URL);

  if (!db) {
    const existing = localMembers.get(email);
    if (existing) return Response.json({ member: card(existing) }, { status: 200 });
    const m = { email, name, phone: phone || 'N/A', currentStamps: 0, totalStamps: 0, cardsCompleted: 0 };
    localMembers.set(email, m);
    return Response.json({ member: card(m) }, { status: 201 });
  }

  try {
    const res = await db.select().from(loyaltyMembers).where(eq(loyaltyMembers.email, email));
    if (res.length > 0) return Response.json({ member: card(res[0]) }, { status: 200 });

    const [created] = await db.insert(loyaltyMembers).values({
      email, name, phone: phone || 'N/A', currentStamps: 0, totalStamps: 0, cardsCompleted: 0,
    }).returning();

    return Response.json({ member: card(created) }, { status: 201 });
  } catch {
    return Response.json({ error: 'No se pudo registrar la tarjeta.' }, { status: 500 });
  }
};
