import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { siteConfig } from "../../db/schema.js";
import { eq } from "drizzle-orm";

const DEFAULT_CONFIG = {
  id: "default",
  colorRed: "#E32126",
  colorInk: "#17181A",
  colorPaper: "#F7F5F2",
  waNumber: "94771234567",
  socialTiktok: "https://tiktok.com/@sarathkumarasons",
  socialFacebook: "https://facebook.com/sarathkumarasons",
  socialInstagram: "https://instagram.com/sarathkumarasons",
  socialWhatsapp: "https://wa.me/94771234567"
};

export default async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }

  const corsHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-cache, no-store, must-revalidate"
  };

  try {
    if (req.method === "GET") {
      let configs = await db.select().from(siteConfig).where(eq(siteConfig.id, "default"));
      if (configs.length === 0) {
        await db.insert(siteConfig).values(DEFAULT_CONFIG).onConflictDoNothing();
        configs = await db.select().from(siteConfig).where(eq(siteConfig.id, "default"));
      }

      const cfg = configs[0] || DEFAULT_CONFIG;
      return new Response(JSON.stringify(cfg), {
        status: 200,
        headers: corsHeaders
      });
    }

    if (req.method === "POST") {
      const body = await req.json();
      const newConfig = {
        id: "default",
        colorRed: body.colorRed || DEFAULT_CONFIG.colorRed,
        colorInk: body.colorInk || DEFAULT_CONFIG.colorInk,
        colorPaper: body.colorPaper || DEFAULT_CONFIG.colorPaper,
        waNumber: body.waNumber || DEFAULT_CONFIG.waNumber,
        socialTiktok: body.socialTiktok != null ? body.socialTiktok : DEFAULT_CONFIG.socialTiktok,
        socialFacebook: body.socialFacebook != null ? body.socialFacebook : DEFAULT_CONFIG.socialFacebook,
        socialInstagram: body.socialInstagram != null ? body.socialInstagram : DEFAULT_CONFIG.socialInstagram,
        socialWhatsapp: body.socialWhatsapp != null ? body.socialWhatsapp : DEFAULT_CONFIG.socialWhatsapp,
        updatedAt: new Date()
      };

      const existing = await db.select().from(siteConfig).where(eq(siteConfig.id, "default"));
      if (existing.length > 0) {
        await db.update(siteConfig).set(newConfig).where(eq(siteConfig.id, "default"));
      } else {
        await db.insert(siteConfig).values(newConfig);
      }

      return new Response(JSON.stringify({ success: true, config: newConfig }), {
        status: 200,
        headers: corsHeaders
      });
    }

    return new Response("Method not allowed", { status: 405 });
  } catch (err: any) {
    console.error("Config API error:", err);
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
      status: 500,
      headers: corsHeaders
    });
  }
};

export const config: Config = {
  path: "/api/config"
};
