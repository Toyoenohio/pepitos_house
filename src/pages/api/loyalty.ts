import type { APIRoute } from 'astro';
import { getDb } from '../../db/client';
import { loyaltyMembers } from '../../db/schema';
import { eq } from 'drizzle-orm';

export const GET: APIRoute = async (context) => {
  const email = context.url.searchParams.get('email');
  if (!email) {
    return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400 });
  }

  const ru = (context.locals as any)?.runtime;
  const dburl = ru?.env?.DATABASE_URL || process.env.DATABASE_URL;
  const db = getDb(dburl);

  if (!db) {
    return new Response(JSON.stringify({
      member: {
        email,
        name: 'Cliente Guaro',
        phone: '0424-0000000',
        currentStamps: 3,
        totalStamps: 3,
        cardsCompleted: 0
      }
    }), { status: 200 });
  }

  try {
    const rows = await db.select().from(loyaltyMembers).where(eq(loyaltyMembers.email, email.toLowerCase().trim()));
    if (rows.length > 0) {
      return new Response(JSON.stringify({ member: rows[0] }), { status: 200 });
    }
    return new Response(JSON.stringify({ member: null }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed' }), { status: 500 });
  }
};

export const POST: APIRoute = async (context) => {
  try {
    const body = await context.request.json();
    const { email, name, phone } = body;
    if (!email || !name) {
      return new Response(JSON.stringify({ error: 'Required' }), { status: 400 });
    }

    const ru = (context.locals as any)?.runtime;
    const dburl = ru?.env?.DATABASE_URL || process.env.DATABASE_URL;
    const db = getDb(dburl);

    if (!db) {
      return new Response(JSON.stringify({
        member: {
          email,
          name,
          phone: phone || 'N/A',
          currentStamps: 1,
          totalStamps: 1,
          cardsCompleted: 0
        }
      }), { status: 200 });
    }

    const clean = email.toLowerCase().trim();
    const res = await db.select().from(loyaltyMembers).where(eq(loyaltyMembers.email, clean));
    if (res.length > 0) {
      return new Response(JSON.stringify({ member: res[0] }), { status: 200 });
    }

    const [newMember] = await db.insert(loyaltyMembers).values({
      email: clean,
      name,
      phone: phone || 'N/A',
      currentStamps: 1,
      totalStamps: 1,
      cardsCompleted: 0
    }).returning();

    return new Response(JSON.stringify({ member: newMember }), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Error' }), { status: 500 });
  }
};
