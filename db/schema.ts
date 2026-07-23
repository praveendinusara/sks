import { pgTable, text, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  sizes: jsonb("sizes").$type<string[]>().notNull().default([]),
  inStock: boolean("in_stock").notNull().default(true),
  desc: text("desc").default(""),
  image: text("image").default(""),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const siteConfig = pgTable("site_config", {
  id: text("id").primaryKey().default("default"),
  colorRed: text("color_red").notNull().default("#E32126"),
  colorInk: text("color_ink").notNull().default("#17181A"),
  colorPaper: text("color_paper").notNull().default("#F7F5F2"),
  waNumber: text("wa_number").notNull().default("94771234567"),
  socialTiktok: text("social_tiktok").default("https://tiktok.com/@sarathkumarasons"),
  socialFacebook: text("social_facebook").default("https://facebook.com/sarathkumarasons"),
  socialInstagram: text("social_instagram").default("https://instagram.com/sarathkumarasons"),
  socialWhatsapp: text("social_whatsapp").default("https://wa.me/94771234567"),
  updatedAt: timestamp("updated_at").defaultNow(),
});
