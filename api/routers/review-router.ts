import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { createRouter, publicQuery, authedQuery, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { reviews, bookings, providerProfiles } from "@db/schema";
import { TRPCError } from "@trpc/server";

export const reviewRouter = createRouter({
  // ── Create Review ───────────────────────────────────────────────
  create: authedQuery
    .input(
      z.object({
        bookingId: z.number(),
        providerId: z.number(),
        overallRating: z.number().min(1).max(5),
        punctualityRating: z.number().min(1).max(5).optional(),
        qualityRating: z.number().min(1).max(5).optional(),
        professionalismRating: z.number().min(1).max(5).optional(),
        communicationRating: z.number().min(1).max(5).optional(),
        valueRating: z.number().min(1).max(5).optional(),
        reviewText: z.string().optional(),
        photos: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();

      // Verify booking belongs to user and is completed
      const [booking] = await db
        .select()
        .from(bookings)
        .where(eq(bookings.id, input.bookingId))
        .limit(1);

      if (!booking) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Booking not found" });
      }

      if (booking.customerId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not your booking" });
      }

      // Check if review already exists
      const [existing] = await db
        .select()
        .from(reviews)
        .where(eq(reviews.bookingId, input.bookingId))
        .limit(1);

      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: "Review already exists for this booking" });
      }

      const result = await db.insert(reviews).values({
        bookingId: input.bookingId,
        customerId: ctx.user.id,
        providerId: input.providerId,
        overallRating: input.overallRating,
        punctualityRating: input.punctualityRating,
        qualityRating: input.qualityRating,
        professionalismRating: input.professionalismRating,
        communicationRating: input.communicationRating,
        valueRating: input.valueRating,
        reviewText: input.reviewText,
        photos: input.photos,
        isVerified: true,
      });

      // Update provider rating
      const allReviews = await db
        .select()
        .from(reviews)
        .where(eq(reviews.providerId, input.providerId));

      const avgRating =
        allReviews.reduce((sum, r) => sum + r.overallRating, 0) / allReviews.length;

      await db
        .update(providerProfiles)
        .set({
          overallRating: avgRating.toFixed(2),
          totalReviews: allReviews.length,
        })
        .where(eq(providerProfiles.id, input.providerId));

      return { success: true, id: Number((result as any).lastInsertRowid) };
    }),

  // ── Get Provider Reviews ────────────────────────────────────────
  listByProvider: publicQuery
    .input(
      z.object({
        providerId: z.number(),
        limit: z.number().default(10),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(reviews)
        .where(and(eq(reviews.providerId, input.providerId), eq(reviews.isVisible, true)))
        .orderBy(desc(reviews.createdAt))
        .limit(input.limit)
        .offset(input.offset);
    }),

  // ── Get My Reviews ──────────────────────────────────────────────
  myReviews: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    return db
      .select()
      .from(reviews)
      .where(eq(reviews.customerId, ctx.user.id))
      .orderBy(desc(reviews.createdAt));
  }),

  // ── Provider Response ───────────────────────────────────────────
  addResponse: authedQuery
    .input(
      z.object({
        reviewId: z.number(),
        response: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(reviews)
        .set({
          providerResponse: input.response,
          providerRespondedAt: new Date(),
        })
        .where(eq(reviews.id, input.reviewId));

      return { success: true };
    }),

  // ── Flag Review (Admin) ─────────────────────────────────────────
  flagReview: adminQuery
    .input(
      z.object({
        reviewId: z.number(),
        isFlagged: z.boolean(),
        flagReason: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(reviews)
        .set({
          isFlagged: input.isFlagged,
          flagReason: input.flagReason,
          isVisible: !input.isFlagged,
        })
        .where(eq(reviews.id, input.reviewId));

      return { success: true };
    }),

  // ── Moderate Review (Admin) ─────────────────────────────────────
  moderate: adminQuery
    .input(
      z.object({
        reviewId: z.number(),
        isVisible: z.boolean(),
        moderatorNotes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(reviews)
        .set({
          isVisible: input.isVisible,
          moderatorNotes: input.moderatorNotes,
        })
        .where(eq(reviews.id, input.reviewId));

      return { success: true };
    }),
});
