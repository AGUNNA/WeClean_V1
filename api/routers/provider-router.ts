import { z } from "zod";
import { eq, and, desc, sql } from "drizzle-orm";
import { createRouter, publicQuery, authedQuery, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import {
  providerProfiles,
  providerServices,
  providerSchedules,
  users,
  reviews,
  favoriteProviders,
} from "@db/schema";
import { TRPCError } from "@trpc/server";

export const providerRouter = createRouter({
  // ── Search Providers ────────────────────────────────────────────
  search: publicQuery
    .input(
      z.object({
        serviceId: z.number().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        minRating: z.number().optional(),
        isAvailable: z.boolean().optional(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [
        eq(providerProfiles.verificationStatus, "verified"),
        eq(providerProfiles.isAvailable, true),
      ];

      if (input?.city) {
        conditions.push(eq(providerProfiles.city, input.city));
      }
      if (input?.state) {
        conditions.push(eq(providerProfiles.state, input.state));
      }
      if (input?.minRating) {
        conditions.push(
          sql`${providerProfiles.overallRating} >= ${input.minRating}`
        );
      }
      if (input?.isAvailable !== undefined) {
        conditions.push(eq(providerProfiles.isAvailable, input.isAvailable));
      }

      const query = db
        .select({
          id: providerProfiles.id,
          userId: providerProfiles.userId,
          bio: providerProfiles.bio,
          yearsOfExperience: providerProfiles.yearsOfExperience,
          companyName: providerProfiles.companyName,
          city: providerProfiles.city,
          state: providerProfiles.state,
          overallRating: providerProfiles.overallRating,
          totalReviews: providerProfiles.totalReviews,
          totalJobsCompleted: providerProfiles.totalJobsCompleted,
          completionRate: providerProfiles.completionRate,
          subscriptionTier: providerProfiles.subscriptionTier,
          badge: providerProfiles.badge,
          verificationStatus: providerProfiles.verificationStatus,
          isAvailable: providerProfiles.isAvailable,
          createdAt: providerProfiles.createdAt,
          name: users.name,
          avatar: users.avatar,
        })
        .from(providerProfiles)
        .innerJoin(users, eq(providerProfiles.userId, users.id))
        .where(and(...conditions))
        .orderBy(desc(providerProfiles.overallRating))
        .limit(input?.limit || 20)
        .offset(input?.offset || 0);

      const providers = await query;

      // If serviceId is specified, filter providers who offer that service
      if (input?.serviceId) {
        const serviceProviders = await db
          .select()
          .from(providerServices)
          .where(
            and(
              eq(providerServices.serviceId, input.serviceId),
              eq(providerServices.isActive, true)
            )
          );

        const providerIds = new Set(serviceProviders.map((sp) => sp.providerId));
        return providers.filter((p) => providerIds.has(p.id));
      }

      return providers;
    }),

  // ── Get Provider Profile ────────────────────────────────────────
  getProfile: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [profile] = await db
        .select()
        .from(providerProfiles)
        .where(eq(providerProfiles.id, input.id))
        .limit(1);

      if (!profile) return null;

      const [user] = await db
        .select({
          name: users.name,
          email: users.email,
          avatar: users.avatar,
          phone: users.phone,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(eq(users.id, profile.userId))
        .limit(1);

      // Get services offered
      const services = await db
        .select()
        .from(providerServices)
        .where(eq(providerServices.providerId, input.id));

      // Get recent reviews
      const recentReviews = await db
        .select()
        .from(reviews)
        .where(and(eq(reviews.providerId, input.id), eq(reviews.isVisible, true)))
        .orderBy(desc(reviews.createdAt))
        .limit(10);

      return { ...profile, user, services, recentReviews };
    }),

  // ── Get My Provider Profile ─────────────────────────────────────
  myProfile: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const [profile] = await db
      .select()
      .from(providerProfiles)
      .where(eq(providerProfiles.userId, ctx.user.id))
      .limit(1);

    if (!profile) return null;

    const services = await db
      .select()
      .from(providerServices)
      .where(eq(providerServices.providerId, profile.id));

    const schedule = await db
      .select()
      .from(providerSchedules)
      .where(eq(providerSchedules.providerId, profile.id));

    return { ...profile, services, schedule };
  }),

  // ── Create/Update Provider Profile ──────────────────────────────
  upsertProfile: authedQuery
    .input(
      z.object({
        bio: z.string().optional(),
        yearsOfExperience: z.number().optional(),
        companyName: z.string().optional(),
        companyRegistrationNumber: z.string().optional(),
        idType: z.enum(["nin", "drivers_license", "passport", "voters_card"]).optional(),
        idNumber: z.string().optional(),
        bvn: z.string().optional(),
        bankName: z.string().optional(),
        accountNumber: z.string().optional(),
        accountName: z.string().optional(),
        serviceRadius: z.number().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        certifications: z.array(z.any()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const userId = ctx.user.id;

      // Check if profile exists
      const [existing] = await db
        .select()
        .from(providerProfiles)
        .where(eq(providerProfiles.userId, userId))
        .limit(1);

      if (existing) {
        await db
          .update(providerProfiles)
          .set({
            ...input,
            certifications: input.certifications as any,
            updatedAt: new Date(),
          })
          .where(eq(providerProfiles.userId, userId));

        // Update user role to provider
        await db
          .update(users)
          .set({ role: "provider" })
          .where(eq(users.id, userId));

        return { success: true, id: existing.id };
      } else {
        const result = await db.insert(providerProfiles).values({
          userId,
          ...input,
          certifications: input.certifications as any,
          verificationStatus: "pending",
        });

        await db
          .update(users)
          .set({ role: "provider" })
          .where(eq(users.id, userId));

        return { success: true, id: Number((result as any).lastInsertRowid) };
      }
    }),

  // ── Update Availability ─────────────────────────────────────────
  updateAvailability: authedQuery
    .input(
      z.object({
        isAvailable: z.boolean(),
        isOnVacation: z.boolean().optional(),
        vacationUntil: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db
        .update(providerProfiles)
        .set({
          isAvailable: input.isAvailable,
          ...(input.isOnVacation !== undefined && { isOnVacation: input.isOnVacation }),
          ...(input.vacationUntil && { vacationUntil: new Date(input.vacationUntil) }),
          updatedAt: new Date(),
        })
        .where(eq(providerProfiles.userId, ctx.user.id));

      return { success: true };
    }),

  // ── Set Schedule ────────────────────────────────────────────────
  setSchedule: authedQuery
    .input(
      z.array(
        z.object({
          dayOfWeek: z.number().min(0).max(6),
          startTime: z.string(),
          endTime: z.string(),
          isAvailable: z.boolean(),
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();

      const [profile] = await db
        .select()
        .from(providerProfiles)
        .where(eq(providerProfiles.userId, ctx.user.id))
        .limit(1);

      if (!profile) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Provider profile not found" });
      }

      // Delete existing schedule
      await db
        .delete(providerSchedules)
        .where(eq(providerSchedules.providerId, profile.id));

      // Insert new schedule
      for (const entry of input) {
        await db.insert(providerSchedules).values({
          providerId: profile.id,
          ...entry,
        });
      }

      return { success: true };
    }),

  // ── Add Service ─────────────────────────────────────────────────
  addService: authedQuery
    .input(
      z.object({
        serviceId: z.number(),
        customPrice: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const [profile] = await db
        .select()
        .from(providerProfiles)
        .where(eq(providerProfiles.userId, ctx.user.id))
        .limit(1);

      if (!profile) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Provider profile not found" });
      }

      await db.insert(providerServices).values({
        providerId: profile.id,
        serviceId: input.serviceId,
        customPrice: input.customPrice,
      });

      return { success: true };
    }),

  // ── Toggle Favorite ─────────────────────────────────────────────
  toggleFavorite: authedQuery
    .input(z.object({ providerId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const [existing] = await db
        .select()
        .from(favoriteProviders)
        .where(
          and(
            eq(favoriteProviders.customerId, ctx.user.id),
            eq(favoriteProviders.providerId, input.providerId)
          )
        )
        .limit(1);

      if (existing) {
        await db
          .delete(favoriteProviders)
          .where(eq(favoriteProviders.id, existing.id));
        return { success: true, action: "removed" };
      } else {
        await db.insert(favoriteProviders).values({
          customerId: ctx.user.id,
          providerId: input.providerId,
        });
        return { success: true, action: "added" };
      }
    }),

  getFavorites: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    return db
      .select()
      .from(favoriteProviders)
      .where(eq(favoriteProviders.customerId, ctx.user.id))
      .orderBy(desc(favoriteProviders.createdAt));
  }),

  // ── Admin: List All Providers ───────────────────────────────────
  adminList: adminQuery
    .input(
      z.object({
        status: z.string().optional(),
        verificationStatus: z.string().optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [];

      if (input?.verificationStatus) {
        conditions.push(eq(providerProfiles.verificationStatus, input.verificationStatus as any));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      return db
        .select()
        .from(providerProfiles)
        .where(whereClause)
        .orderBy(desc(providerProfiles.createdAt))
        .limit(input?.limit || 50)
        .offset(input?.offset || 0);
    }),

  // ── Admin: Verify Provider ──────────────────────────────────────
  verifyProvider: adminQuery
    .input(
      z.object({
        providerId: z.number(),
        status: z.enum(["verified", "rejected"]),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(providerProfiles)
        .set({
          verificationStatus: input.status,
          updatedAt: new Date(),
        })
        .where(eq(providerProfiles.id, input.providerId));

      return { success: true };
    }),

  // ── Stats ───────────────────────────────────────────────────────
  stats: publicQuery.query(async () => {
    const db = getDb();
    const allProviders = await db.select().from(providerProfiles);

    return {
      total: allProviders.length,
      verified: allProviders.filter((p) => p.verificationStatus === "verified").length,
      pending: allProviders.filter((p) => p.verificationStatus === "pending").length,
      active: allProviders.filter((p) => p.isAvailable).length,
    };
  }),
});
