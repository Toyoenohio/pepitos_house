CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"emoji" text DEFAULT '🥖' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "loyalty_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"current_stamps" integer DEFAULT 0 NOT NULL,
	"total_stamps" integer DEFAULT 0 NOT NULL,
	"cards_completed" integer DEFAULT 0 NOT NULL,
	"last_stamp_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "loyalty_members_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "loyalty_stamps" (
	"id" serial PRIMARY KEY NOT NULL,
	"member_email" text NOT NULL,
	"order_id" integer,
	"note" text DEFAULT 'Compra completada',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "menu_items" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category_slug" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"badge_type" text DEFAULT 'Clásico',
	"highlight" text DEFAULT 'FAVORITO',
	"stats" text DEFAULT '🥖 30cm • Sabor Guaro',
	"description" text NOT NULL,
	"dressing" text DEFAULT 'Salsa de la casa',
	"image_url" text NOT NULL,
	"bg_accent" text DEFAULT 'bg-brandBlue',
	"is_available" boolean DEFAULT true NOT NULL,
	"is_archived" boolean DEFAULT false NOT NULL,
	"available_days" jsonb DEFAULT '["thu","fri","sat","sun","mon"]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "modifier_groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_slug" text NOT NULL,
	"name" text NOT NULL,
	"type" text DEFAULT 'multiple' NOT NULL,
	"min_select" integer DEFAULT 0 NOT NULL,
	"max_select" integer DEFAULT 10 NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "modifier_options" (
	"id" serial PRIMARY KEY NOT NULL,
	"group_id" integer NOT NULL,
	"name" text NOT NULL,
	"price_delta" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_name" text NOT NULL,
	"customer_phone" text NOT NULL,
	"customer_email" text NOT NULL,
	"delivery_zone" text NOT NULL,
	"delivery_address" text NOT NULL,
	"reference_point" text,
	"payment_method" text NOT NULL,
	"items" jsonb NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL,
	"delivery_fee" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"status" text DEFAULT 'pending_whatsapp' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "store_settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "loyalty_stamps" ADD CONSTRAINT "loyalty_stamps_member_email_loyalty_members_email_fk" FOREIGN KEY ("member_email") REFERENCES "public"."loyalty_members"("email") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loyalty_stamps" ADD CONSTRAINT "loyalty_stamps_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_category_slug_categories_slug_fk" FOREIGN KEY ("category_slug") REFERENCES "public"."categories"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "modifier_groups" ADD CONSTRAINT "modifier_groups_category_slug_categories_slug_fk" FOREIGN KEY ("category_slug") REFERENCES "public"."categories"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "modifier_options" ADD CONSTRAINT "modifier_options_group_id_modifier_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."modifier_groups"("id") ON DELETE no action ON UPDATE no action;