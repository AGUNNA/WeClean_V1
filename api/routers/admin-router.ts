import { z } from "zod";
import { eq, and, desc, gte, lte, sql, count } from "drizzle-orm";
import { createRouter, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import {
  users,
  providerProfiles,
  bookings,
  reviews,
  disputes,
  withdrawals,
  activityLogs,
  platformSettings,
  coupons,
} from "@db/schema";

export const adminRouter = createRouter({
  // ── Dashboard Overview ──────────────────────────────────────────
  dashboard: adminQuery.query(async () => {
    const db = getDb();

    const allUsers = await db.select().from(users);
    const allProviders = await db.select().from(providerProfiles);
    const allBookings = await db.select().from(bookings);
    const allReviews = await db.select().from(reviews);
    const allDisputes = await db.select().from(disputes);

    const totalRevenue = allBookings
      .filter((b) => b.status === "completed")
      .reduce((sum, b) => sum + parseFloat(b.totalAmount), 0);

    const totalCommission = allBookings
      .filter((b) => b.status === "completed")
      .reduce((sum, b) => {
        const amount = parseFloat(b.totalAmount);
        const rate = parseFloat(b.commissionRate || "15");
        return sum + amount * (rate / 100);
      }, 0);

    const pendingVerifications = allProviders.filter(
      (p) => p.verificationStatus === "pending"
    ).length;

    const pendingWithdrawals = await db
      .select()
      .from(withdrawals)
      .where(eq(withdrawals.status, "pending"));

    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const monthlyBookings = allBookings.filter(
      (b) => b.createdAt >= thisMonth
    );

    return {
      users: {
        total: allUsers.length,
        customers: allUsers.filter((u) => u.role === "user").length,
        providers: allUsers.filter((u) => u.role === "provider").length,
        admins: allUsers.filter((u) => ["admin", "superadmin"].includes(u.role)).length,
        newThisMonth: allUsers.filter((u) => u.createdAt >= thisMonth).length,
      },
      providers: {
        total: allProviders.length,
        verified: allProviders.filter((p) => p.verificationStatus === "verified").length,
        pending: pendingVerifications,
        active: allProviders.filter((p) => p.isAvailable).length,
      },
      bookings: {
        total: allBookings.length,
        completed: allBookings.filter((b) => b.status === "completed").length,
        pending: allBookings.filter((b) =>
          !["completed", "cancelled", "refunded"].includes(b.status)
        ).length,
        cancelled: allBookings.filter((b) => b.status === "cancelled").length,
        disputed: allBookings.filter((b) => b.status === "disputed").length,
        thisMonth: monthlyBookings.length,
      },
      finance: {
        totalRevenue: totalRevenue.toFixed(2),
        totalCommission: totalCommission.toFixed(2),
        pendingWithdrawals: pendingWithdrawals.length,
        pendingWithdrawalAmount: pendingWithdrawals
          .reduce((sum, w) => sum + parseFloat(w.amount), 0)
          .toFixed(2),
      },
      reviews: {
        total: allReviews.length,
        averageRating: allReviews.length > 0
          ? (allReviews.reduce((sum, r) => sum + r.overallRating, 0) / allReviews.length).toFixed(1)
          : "0",
        flagged: allReviews.filter((r) => r.isFlagged).length,
      },
      disputes: {
        total: allDisputes.length,
        open: allDisputes.filter((d) => d.status === "open").length,
        underReview: allDisputes.filter((d) => d.status === "under_review").length,
      },
    };
  }),

  // ── User Management ─────────────────────────────────────────────
  listUsers: adminQuery
    .input(
      z.object({
        role: z.string().optional(),
        search: z.string().optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [];

      if (input?.role) {
        conditions.push(eq(users.role, input.role as any));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      return db
        .select()
        .from(users)
        .where(whereClause)
        .orderBy(desc(users.createdAt))
        .limit(input?.limit || 50)
        .offset(input?.offset || 0);
    }),

  // ── Update User ─────────────────────────────────────────────────
  updateUser: adminQuery
    .input(
      z.object({
        userId: z.number(),
        role: z.enum(["user", "provider", "company", "admin", "superadmin"]).optional(),
        isActive: z.boolean().optional(),
        isVerified: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const { userId, ...data } = input;

      await db.update(users).set(data).where(eq(users.id, userId));

      // Log activity
      await db.insert(activityLogs).values({
        adminId: ctx.user.id,
        action: "update_user",
        entityType: "user",
        entityId: userId,
        details: data,
      });

      return { success: true };
    }),

  // ── Booking Analytics ───────────────────────────────────────────
  bookingAnalytics: adminQuery
    .input(
      z.object({
        dateFrom: z.string().optional(),
        dateTo: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const allBookings = await db.select().from(bookings);

      // Status distribution
      const statusCounts: Record<string, number> = {};
      for (const b of allBookings) {
        statusCounts[b.status] = (statusCounts[b.status] || 0) + 1;
      }

      // Revenue by service type (using booking items)
      // Simplified - in production would join with booking items

      return {
        totalBookings: allBookings.length,
        statusDistribution: statusCounts,
        totalRevenue: allBookings
          .filter((b) => b.status === "completed")
          .reduce((sum, b) => sum + parseFloat(b.totalAmount), 0)
          .toFixed(2),
        averageOrderValue: allBookings.length > 0
          ? (allBookings.reduce((sum, b) => sum + parseFloat(b.totalAmount), 0) / allBookings.length).toFixed(2)
          : "0",
      };
    }),

  // ── Revenue Report ──────────────────────────────────────────────
  revenueReport: adminQuery
    .input(
      z.object({
        period: z.enum(["daily", "weekly", "monthly", "yearly"]).default("monthly"),
        dateFrom: z.string().optional(),
        dateTo: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const completedBookings = await db
        .select()
        .from(bookings)
        .where(eq(bookings.status, "completed"));

      const totalRevenue = completedBookings.reduce(
        (sum, b) => sum + parseFloat(b.totalAmount),
        0
      );

      const totalCommission = completedBookings.reduce(
        (sum, b) => {
          const amount = parseFloat(b.totalAmount);
          const rate = parseFloat(b.commissionRate || "15");
          return sum + amount * (rate / 100);
        },
        0
      );

      const totalTips = completedBookings.reduce(
        (sum, b) => sum + parseFloat(b.tipAmount || "0"),
        0
      );

      return {
        totalRevenue: totalRevenue.toFixed(2),
        totalCommission: totalCommission.toFixed(2),
        totalProviderPayouts: (totalRevenue - totalCommission).toFixed(2),
        totalTips: totalTips.toFixed(2),
        completedBookings: completedBookings.length,
        averageCommissionRate: completedBookings.length > 0
          ? (completedBookings.reduce(
              (sum, b) => sum + parseFloat(b.commissionRate || "15"),
              0
            ) / completedBookings.length).toFixed(1)
          : "0",
      };
    }),

  // ── Dispute Management ──────────────────────────────────────────
  listDisputes: adminQuery
    .input(
      z.object({
        status: z.string().optional(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [];

      if (input?.status) {
        conditions.push(eq(disputes.status, input.status as any));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      return db
        .select()
        .from(disputes)
        .where(whereClause)
        .orderBy(desc(disputes.createdAt))
        .limit(input?.limit || 20)
        .offset(input?.offset || 0);
    }),

  // ── Resolve Dispute ─────────────────────────────────────────────
  resolveDispute: adminQuery
    .input(
      z.object({
        disputeId: z.number(),
        status: z.enum(["resolved_customer", "resolved_provider", "resolved_split", "rejected"]),
        resolution: z.string(),
        refundAmount: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db
        .update(disputes)
        .set({
          status: input.status,
          resolution: input.resolution,
          refundAmount: input.refundAmount,
          resolvedBy: ctx.user.id,
          resolvedAt: new Date(),
        })
        .where(eq(disputes.id, input.disputeId));

      return { success: true };
    }),

  // ── Activity Logs ───────────────────────────────────────────────
  activityLogs: adminQuery
    .input(
      z.object({
        limit: z.number().default(50),
        offset: z.number().default(0),
      }).optional()
    )
    .query(async () => {
      const db = getDb();
      return db
        .select()
        .from(activityLogs)
        .orderBy(desc(activityLogs.createdAt))
        .limit(50);
    }),

  // ── Platform Settings ───────────────────────────────────────────
  getSettings: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(platformSettings);
  }),

  updateSetting: adminQuery
    .input(
      z.object({
        key: z.string(),
        value: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();

      const [existing] = await db
        .select()
        .from(platformSettings)
        .where(eq(platformSettings.key, input.key))
        .limit(1);

      if (existing) {
        await db
          .update(platformSettings)
          .set({
            value: input.value,
            description: input.description || existing.description,
            updatedBy: ctx.user.id,
          })
          .where(eq(platformSettings.id, existing.id));
      } else {
        await db.insert(platformSettings).values({
          key: input.key,
          value: input.value,
          description: input.description,
          updatedBy: ctx.user.id,
        });
      }

      return { success: true };
    }),

  // ── Create Coupon ───────────────────────────────────────────────
  createCoupon: adminQuery
    .input(
      z.object({
        code: z.string().min(1),
        description: z.string().optional(),
        discountType: z.enum(["percentage", "fixed_amount"]),
        discountValue: z.string(),
        maxDiscount: z.string().optional(),
        minOrderAmount: z.string().optional(),
        usageLimit: z.number().optional(),
        perUserLimit: z.number().default(1),
        startsAt: z.string(),
        expiresAt: z.string(),
        applicableServices: z.array(z.number()).optional(),
        applicableCategories: z.array(z.number()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const result = await db.insert(coupons).values({
        ...input,
        startsAt: new Date(input.startsAt),
        expiresAt: new Date(input.expiresAt),
        applicableServices: input.applicableServices as any,
        applicableCategories: input.applicableCategories as any,
        createdBy: ctx.user.id,
      });

      return { success: true, id: Number((result as any).insertId) };
    }),
});
