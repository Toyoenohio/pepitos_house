import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema.ts';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, CATEGORY_MODIFIERS } from '../lib/productsData.ts';

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_SXOlNg8Kre9T@ep-winter-rice-aeevvwyq-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';

async function seed() {
  console.log('🌱 Conectando a Neon Postgres...');
  const sql = neon(DATABASE_URL);
  const db = drizzle(sql, { schema });

  console.log('📦 Insertando Categorías...');
  for (let i = 0; i < INITIAL_CATEGORIES.length; i++) {
    const cat = INITIAL_CATEGORIES[i];
    await sql`
      INSERT INTO categories (slug, name, emoji, sort_order, is_active)
      VALUES (${cat.slug}, ${cat.name}, ${cat.emoji}, ${i + 1}, true)
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        emoji = EXCLUDED.emoji,
        sort_order = EXCLUDED.sort_order,
        is_active = EXCLUDED.is_active;
    `;
  }
  console.log(`✅ ${INITIAL_CATEGORIES.length} categorías sincronizadas.`);

  console.log('🌭 Insertando Productos del Menú...');
  for (const item of INITIAL_PRODUCTS) {
    const availableDaysJson = JSON.stringify(item.availableDays);
    await sql`
      INSERT INTO menu_items (
        id, name, category_slug, price, badge_type, highlight, stats,
        description, dressing, image_url, bg_accent, is_available, is_archived, available_days
      )
      VALUES (
        ${item.id}, ${item.name}, ${item.category}, ${item.price.toFixed(2)},
        ${item.badgeType}, ${item.highlight}, ${item.stats},
        ${item.description}, ${item.dressing}, ${item.image},
        ${item.bgAccent}, ${item.isAvailable}, false, ${availableDaysJson}::jsonb
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        category_slug = EXCLUDED.category_slug,
        price = EXCLUDED.price,
        badge_type = EXCLUDED.badge_type,
        highlight = EXCLUDED.highlight,
        stats = EXCLUDED.stats,
        description = EXCLUDED.description,
        dressing = EXCLUDED.dressing,
        image_url = EXCLUDED.image_url,
        bg_accent = EXCLUDED.bg_accent,
        is_available = EXCLUDED.is_available,
        available_days = EXCLUDED.available_days,
        updated_at = NOW();
    `;
  }
  console.log(`✅ ${INITIAL_PRODUCTS.length} productos insertados/actualizados.`);

  console.log('⚙️ Insertando Modificadores y Toppings...');
  for (const [categorySlug, groups] of Object.entries(CATEGORY_MODIFIERS)) {
    for (let gIdx = 0; gIdx < groups.length; gIdx++) {
      const group = groups[gIdx];
      // Insert or find group
      const existingGroup = await sql`
        SELECT id FROM modifier_groups 
        WHERE category_slug = ${categorySlug} AND name = ${group.name}
        LIMIT 1;
      `;

      let groupId: number;
      if (existingGroup.length > 0) {
        groupId = existingGroup[0].id;
      } else {
        const inserted = await sql`
          INSERT INTO modifier_groups (category_slug, name, type, sort_order, is_active)
          VALUES (${categorySlug}, ${group.name}, ${group.type}, ${gIdx + 1}, true)
          RETURNING id;
        `;
        groupId = inserted[0].id;
      }

      for (let oIdx = 0; oIdx < group.options.length; oIdx++) {
        const opt = group.options[oIdx];
        const existingOpt = await sql`
          SELECT id FROM modifier_options
          WHERE group_id = ${groupId} AND name = ${opt.name}
          LIMIT 1;
        `;

        if (existingOpt.length === 0) {
          await sql`
            INSERT INTO modifier_options (group_id, name, price_delta, sort_order, is_default, is_available)
            VALUES (${groupId}, ${opt.name}, ${opt.priceDelta.toFixed(2)}, ${oIdx + 1}, ${oIdx === 0 && group.type === 'single'}, true);
          `;
        } else {
          await sql`
            UPDATE modifier_options
            SET price_delta = ${opt.priceDelta.toFixed(2)}, sort_order = ${oIdx + 1}
            WHERE id = ${existingOpt[0].id};
          `;
        }
      }
    }
  }
  console.log('✅ Modificadores y opciones sincronizadas.');
  console.log('🎉 ¡Base de datos Neon poblada exitosamente!');
}

seed().catch(err => {
  console.error('❌ Error en seed:', err);
  process.exit(1);
});
