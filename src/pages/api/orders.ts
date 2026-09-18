import type { APIRoute } from 'astro';
import { getDb } from '../../db/client';
import { orders, loyaltyMembers, loyaltyStamps } from '../../db/schema';
import { eq } from 'drizzle-orm';

export const POST: APIRoute = async (context) => {
  try {
    const body = await context.request.json();
    const { customer, items, subtotal, deliveryFee, total } = body;

    const ru = (context.locals as any)?.runtime;
    const dburl = ru?.env?.DATABASE_URL || process.env.DATABASE_URL;
    const db = getDb(dburl);

    if (!db) {
      return new Response(JSON.stringify({ success: true, mode: 'fallback' }), { status: 201 });
    }

    const [n] = await db.insert(orders).values({
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      deliveryZone: customer.zone,
      deliveryAddress: customer.address,
      referencePoint: customer.reference || '',
      paymentMethod: customer.paymentMethod,
      items,
      subtotal: String(subtotal),
      deliveryFee: String(deliveryFee || 0),
      total: String(total),
      status: 'pending_whatsapp'
    }).returning();

    if (customer.email) {
      const cleanEmail = customer.email.toLowerCase().trim();
      const existing = await db.select().from(loyaltyMembers).where(eq(loyaltyMembers.email, cleanEmail));

      if (existing.length > 0) {
        const m = existing[0];
        const newStamps = m.currentStamps + 1;
        await db.update(loyaltyMembers)
          .set({
            currentStamps: newStamps >= 10 ? 10 : newStamps,
            totalStamps: m.totalStamps + 1,
            lastStampAt: new Date()
          })
          .where(eq(loyaltyMembers.id, m.id));
        await db.insert(loyaltyStamps).values({
          memberEmail: cleanEmail,
          orderId: n.id,
          note: 'Pedido registrado'
        });
      } else {
        await db.insert(loyaltyMembers).values({
          email: cleanEmail,
          name: customer.name,
          phone: customer.phone,
          currentStamps: 1,
          totalStamps: 1,
          cardsCompleted: 0,
          lastStampAt: new Date()
        });
        await db.insert(loyaltyStamps).values({
          memberEmail: cleanEmail,
          orderId: n.id,
          note: 'Primer pedido'
        });
      }
    }

    return new Response(JSON.stringify({ success: true, orderId: n.id }), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed' }), { status: 500 });
  }
};
