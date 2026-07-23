import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { products } from "../../db/schema.js";
import { eq, inArray } from "drizzle-orm";

export default async (req: Request) => {
  const url = new URL(req.url);

  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
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
      // Delete initial inbuilt seed products if present in DB
      await db.delete(products).where(inArray(products.id, ["p1", "p2", "p3"]));

      const allProducts = await db.select().from(products);

      return new Response(JSON.stringify(allProducts), {
        status: 200,
        headers: corsHeaders
      });
    }

    if (req.method === "POST") {
      const body = await req.json();
      const { id, name, price, sizes, inStock, desc, image } = body;

      if (!id || !name) {
        return new Response(JSON.stringify({ error: "Missing required fields" }), {
          status: 400,
          headers: corsHeaders
        });
      }

      const item = {
        id,
        name: String(name),
        price: Number(price) || 0,
        sizes: Array.isArray(sizes) ? sizes : [],
        inStock: Boolean(inStock),
        desc: desc != null ? String(desc) : "",
        image: image != null ? String(image) : "",
        updatedAt: new Date()
      };

      const existing = await db.select().from(products).where(eq(products.id, id));

      if (existing.length > 0) {
        await db.update(products).set(item).where(eq(products.id, id));
      } else {
        await db.insert(products).values({ ...item, createdAt: new Date() });
      }

      return new Response(JSON.stringify({ success: true, item }), {
        status: 200,
        headers: corsHeaders
      });
    }

    if (req.method === "DELETE") {
      const id = url.searchParams.get("id");
      if (!id) {
        return new Response(JSON.stringify({ error: "Missing product id" }), {
          status: 400,
          headers: corsHeaders
        });
      }

      await db.delete(products).where(eq(products.id, id));

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: corsHeaders
      });
    }

    return new Response("Method not allowed", { status: 405 });
  } catch (err: any) {
    console.error("Products API error:", err);
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
      status: 500,
      headers: corsHeaders
    });
  }
};

export const config: Config = {
  path: "/api/products"
};
