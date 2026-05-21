import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { createRouter, authedQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { addresses } from "@db/schema";
import { TRPCError } from "@trpc/server";

export const addressRouter = createRouter({
  // ── List My Addresses ───────────────────────────────────────────
  list: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    return db
      .select()
      .from(addresses)
      .where(eq(addresses.userId, ctx.user.id))
      .orderBy(addresses.isDefault);
  }),

  // ── Get Address by ID ───────────────────────────────────────────
  getById: authedQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const [address] = await db
        .select()
        .from(addresses)
        .where(and(eq(addresses.id, input.id), eq(addresses.userId, ctx.user.id)))
        .limit(1);

      return address || null;
    }),

  // ── Create Address ──────────────────────────────────────────────
  create: authedQuery
    .input(
      z.object({
        label: z.string().min(1),
        address: z.string().min(1),
        city: z.string().min(1),
        state: z.string().min(1),
        country: z.string().default("Nigeria"),
        postalCode: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        isDefault: z.boolean().default(false),
        accessInstructions: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();

      // If setting as default, unset other defaults
      if (input.isDefault) {
        const existingDefaults = await db
          .select()
          .from(addresses)
          .where(and(eq(addresses.userId, ctx.user.id), eq(addresses.isDefault, true)));

        for (const addr of existingDefaults) {
          await db
            .update(addresses)
            .set({ isDefault: false })
            .where(eq(addresses.id, addr.id));
        }
      }

      const result = await db.insert(addresses).values({
        userId: ctx.user.id,
        ...input,
      });

      return { success: true, id: Number((result as any).insertId) };
    }),

  // ── Update Address ──────────────────────────────────────────────
  update: authedQuery
    .input(
      z.object({
        id: z.number(),
        label: z.string().min(1).optional(),
        address: z.string().min(1).optional(),
        city: z.string().min(1).optional(),
        state: z.string().min(1).optional(),
        country: z.string().optional(),
        postalCode: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        isDefault: z.boolean().optional(),
        accessInstructions: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const { id, ...data } = input;

      // Verify ownership
      const [existing] = await db
        .select()
        .from(addresses)
        .where(and(eq(addresses.id, id), eq(addresses.userId, ctx.user.id)))
        .limit(1);

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Address not found" });
      }

      // If setting as default, unset others
      if (data.isDefault) {
        const existingDefaults = await db
          .select()
          .from(addresses)
          .where(
            and(
              eq(addresses.userId, ctx.user.id),
              eq(addresses.isDefault, true)
            )
          );

        for (const addr of existingDefaults) {
          if (addr.id !== id) {
            await db
              .update(addresses)
              .set({ isDefault: false })
              .where(eq(addresses.id, addr.id));
          }
        }
      }

      await db
        .update(addresses)
        .set(data)
        .where(eq(addresses.id, id));

      return { success: true };
    }),

  // ── Delete Address ──────────────────────────────────────────────
  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();

      const [existing] = await db
        .select()
        .from(addresses)
        .where(and(eq(addresses.id, input.id), eq(addresses.userId, ctx.user.id)))
        .limit(1);

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Address not found" });
      }

      await db.delete(addresses).where(eq(addresses.id, input.id));
      return { success: true };
    }),
});
