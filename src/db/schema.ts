import { pgTable, text, serial, numeric, timestamp, boolean, integer, jsonb } from 'drizzle-orm/pg-core';

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  emoji: text('emoji').notNull().default('🥖'),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const menuItems = pgTable('menu_items', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  categoryId: text('category_slug').notNull().references(() => categories.slug),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  badgeType: text('badge_type').default('Clásico'),
  highlight: text('highlight').default('FAVORITO'),
  stats: text('stats').default('🥖 30cm • Sabor Guaro'),
  description: text('description').notNull(),
  dressing: text('dressing').default('Salsa de la casa'),
  imageUrl: text('image_url').notNull(),
  bgAccent: text('bg_accent').default('bg-brandBlue'),
  isAvailable: boolean('is_available').notNull().default(true),
  isArchived: boolean('is_archived').notNull().default(false),
  // Days of availability: e.g. [1, 2, 3, 4, 5, 6, 7] or custom object
  availableDays: jsonb('available_days').default(['thu', 'fri', 'sat', 'sun', 'mon']),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const modifierGroups = pgTable('modifier_groups', {
  id: serial('id').primaryKey(),
  categorySlug: text('category_slug').notNull().references(() => categories.slug),
  name: text('name').notNull(), // Ej: Elige el Tamaño o Salsas y Toppings Extra
  type: text('type').notNull().default('multiple'), // 'single' (radio) o 'multiple' (checkbox)
  minSelect: integer('min_select').notNull().default(0),
  maxSelect: integer('max_select').notNull().default(10),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
});

export const modifierOptions = pgTable('modifier_options', {
  id: serial('id').primaryKey(),
  groupId: integer('group_id').notNull().references(() => modifierGroups.id),
  name: text('name').notNull(), // Ej: 50 cm (+ .00), Aguacate Cremoso de Sanare
  priceDelta: numeric('price_delta', { precision: 10, scale: 2 }).notNull().default('0.00'),
  isDefault: boolean('is_default').notNull().default(false),
  isAvailable: boolean('is_available').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  customerEmail: text('customer_email').notNull(),
  deliveryZone: text('delivery_zone').notNull(), // 'Barcelona', 'Lechería', 'Puerto La Cruz'
  deliveryAddress: text('delivery_address').notNull(),
  referencePoint: text('reference_point'),
  paymentMethod: text('payment_method').notNull(),
  items: jsonb('items').notNull(),
  subtotal: numeric('subtotal', { precision: 10, scale: 2 }).notNull(),
  deliveryFee: numeric('delivery_fee', { precision: 10, scale: 2 }).notNull().default('0.00'),
  total: numeric('total', { precision: 10, scale: 2 }).notNull(),
  status: text('status').notNull().default('pending_whatsapp'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const loyaltyMembers = pgTable('loyalty_members', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  currentStamps: integer('current_stamps').notNull().default(0),
  totalStamps: integer('total_stamps').notNull().default(0),
  cardsCompleted: integer('cards_completed').notNull().default(0),
  lastStampAt: timestamp('last_stamp_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const loyaltyStamps = pgTable('loyalty_stamps', {
  id: serial('id').primaryKey(),
  memberEmail: text('member_email').notNull().references(() => loyaltyMembers.email),
  orderId: integer('order_id').references(() => orders.id),
  note: text('note').default('Compra completada'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const storeSettings = pgTable('store_settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
