CREATE TABLE "products" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"price" integer NOT NULL,
	"sizes" jsonb DEFAULT '[]' NOT NULL,
	"in_stock" boolean DEFAULT true NOT NULL,
	"desc" text DEFAULT '',
	"image" text DEFAULT '',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "site_config" (
	"id" text PRIMARY KEY DEFAULT 'default',
	"color_red" text DEFAULT '#E32126' NOT NULL,
	"color_ink" text DEFAULT '#17181A' NOT NULL,
	"color_paper" text DEFAULT '#F7F5F2' NOT NULL,
	"wa_number" text DEFAULT '94771234567' NOT NULL,
	"social_tiktok" text DEFAULT 'https://tiktok.com/@sarathkumarasons',
	"social_facebook" text DEFAULT 'https://facebook.com/sarathkumarasons',
	"social_instagram" text DEFAULT 'https://instagram.com/sarathkumarasons',
	"social_whatsapp" text DEFAULT 'https://wa.me/94771234567',
	"updated_at" timestamp DEFAULT now()
);
