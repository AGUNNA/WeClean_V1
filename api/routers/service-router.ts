import { z } from "zod";
import { eq, and, asc } from "drizzle-orm";
import { createRouter, publicQuery, authedQuery } from "../middleware";
import { getDb } from "../queries/connection";
import {
  serviceCategories,
  services,
  serviceAddons,
} from "@db/schema";

export const serviceRouter = createRouter({
  // ── Categories ──────────────────────────────────────────────────
  listCategories: publicQuery.query(async () => {
    const db = getDb();
    const categories = await db
      .select()
      .from(serviceCategories)
      .where(eq(serviceCategories.isActive, true))
      .orderBy(asc(serviceCategories.displayOrder));
    return categories;
  }),

  getCategoryBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [category] = await db
        .select()
        .from(serviceCategories)
        .where(eq(serviceCategories.slug, input.slug))
        .limit(1);
      return category || null;
    }),

  // ── Services ────────────────────────────────────────────────────
  listServices: publicQuery
    .input(
      z.object({
        categoryId: z.number().optional(),
        isPopular: z.boolean().optional(),
        search: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [eq(services.isActive, true)];
      if (input?.categoryId) {
        conditions.push(eq(services.categoryId, input.categoryId));
      }
      if (input?.isPopular) {
        conditions.push(eq(services.isPopular, true));
      }

      const results = await db
        .select()
        .from(services)
        .where(and(...conditions))
        .orderBy(asc(services.name));

      return results;
    }),

  getServiceBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [service] = await db
        .select()
        .from(services)
        .where(and(eq(services.slug, input.slug), eq(services.isActive, true)))
        .limit(1);
      return service || null;
    }),

  getServiceById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [service] = await db
        .select()
        .from(services)
        .where(eq(services.id, input.id))
        .limit(1);
      return service || null;
    }),

  // ── Addons ──────────────────────────────────────────────────────
  listAddons: publicQuery
    .input(z.object({ serviceId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(serviceAddons)
        .where(
          and(
            eq(serviceAddons.serviceId, input.serviceId),
            eq(serviceAddons.isActive, true)
          )
        );
    }),

  // ── Admin: Create Category ──────────────────────────────────────
  createCategory: authedQuery
    .input(
      z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().optional(),
        icon: z.string().optional(),
        image: z.string().optional(),
        displayOrder: z.number().default(0),
        parentId: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(serviceCategories).values(input);
      return { success: true, id: Number((result as any).lastInsertRowid) };
    }),

  // ── Admin: Create Service ───────────────────────────────────────
  createService: authedQuery
    .input(
      z.object({
        categoryId: z.number(),
        name: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().optional(),
        shortDescription: z.string().optional(),
        image: z.string().optional(),
        icon: z.string().optional(),
        basePrice: z.string(),
        priceType: z.enum(["fixed", "per_hour", "per_sqm", "per_room", "custom"]),
        minPrice: z.string().optional(),
        maxPrice: z.string().optional(),
        estimatedDuration: z.number().optional(),
        requiresPropertySize: z.boolean().default(false),
        requiresRoomCount: z.boolean().default(false),
        allowsMaterialsChoice: z.boolean().default(true),
        isPopular: z.boolean().default(false),
        isEmergency: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(services).values(input);
      return { success: true, id: Number((result as any).lastInsertRowid) };
    }),

  // ── Admin: Create Addon ─────────────────────────────────────────
  createAddon: authedQuery
    .input(
      z.object({
        serviceId: z.number(),
        name: z.string().min(1),
        description: z.string().optional(),
        price: z.string(),
        priceType: z.enum(["fixed", "per_unit"]).default("fixed"),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(serviceAddons).values(input);
      return { success: true, id: Number((result as any).lastInsertRowid) };
    }),
});
