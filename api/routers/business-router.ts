import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createRouter, businessQuery } from "../middleware";
import { getDb } from "../queries/connection";
import {
  businesses,
  businessStaff,
  businessServices,
  bookings,
  services,
  users,
  providerProfiles,
  withdrawals,
} from "@db/schema";

// Resolve the business owned by the current user, or throw.
async function requireOwnedBusiness(userId: number) {
  const db = getDb();
  const [biz] = await db
    .select()
    .from(businesses)
    .where(eq(businesses.ownerId, userId))
    .limit(1);
  if (!biz) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "No business is linked to this account.",
    });
  }
  return biz;
}

const num = (s: string | null | undefined) => parseFloat(s || "0");

export const businessRouter = createRouter({
  // ── Current owner's business ────────────────────────────────────
  myBusiness: businessQuery.query(async ({ ctx }) => {
    return requireOwnedBusiness(ctx.user.id);
  }),

  // ── Dashboard: KPIs + chart series scoped to the business ───────
  dashboard: businessQuery.query(async ({ ctx }) => {
    const db = getDb();
    const biz = await requireOwnedBusiness(ctx.user.id);

    const bizBookings = await db
      .select()
      .from(bookings)
      .where(eq(bookings.businessId, biz.id));

    const completed = bizBookings.filter((b) => b.status === "completed");
    const revenue = completed.reduce((s, b) => s + num(b.totalAmount), 0);
    const earnings = completed.reduce((s, b) => s + num(b.providerEarnings), 0);

    const staff = await db
      .select()
      .from(businessStaff)
      .where(eq(businessStaff.businessId, biz.id));

    // Status distribution
    const statusDistribution: Record<string, number> = {};
    for (const b of bizBookings) {
      statusDistribution[b.status] = (statusDistribution[b.status] || 0) + 1;
    }

    // Revenue over the last 6 months
    const revenueByMonth = monthlySeries(completed);

    return {
      business: { name: biz.name, verificationStatus: biz.verificationStatus },
      kpis: {
        totalBookings: bizBookings.length,
        completed: completed.length,
        active: bizBookings.filter((b) =>
          ["confirmed", "provider_assigned", "in_progress"].includes(b.status)
        ).length,
        revenue: revenue.toFixed(2),
        earnings: earnings.toFixed(2),
        walletBalance: biz.walletBalance ?? "0.00",
        staffCount: staff.length,
        rating: biz.overallRating ?? "0.00",
      },
      statusDistribution,
      revenueByMonth,
    };
  }),

  // ── Profile / business management ───────────────────────────────
  updateProfile: businessQuery
    .input(
      z.object({
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        website: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        registrationNumber: z.string().optional(),
        logo: z.string().optional(),
        bankName: z.string().optional(),
        accountNumber: z.string().optional(),
        accountName: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const biz = await requireOwnedBusiness(ctx.user.id);
      await db.update(businesses).set(input).where(eq(businesses.id, biz.id));
      return { success: true };
    }),

  // ── Staff management ────────────────────────────────────────────
  listStaff: businessQuery.query(async ({ ctx }) => {
    const db = getDb();
    const biz = await requireOwnedBusiness(ctx.user.id);
    return db
      .select({
        id: businessStaff.id,
        userId: businessStaff.userId,
        providerProfileId: providerProfiles.id,
        role: businessStaff.role,
        status: businessStaff.status,
        joinedAt: businessStaff.joinedAt,
        name: users.name,
        email: users.email,
        phone: users.phone,
        avatar: users.avatar,
        rating: providerProfiles.overallRating,
        jobsCompleted: providerProfiles.totalJobsCompleted,
      })
      .from(businessStaff)
      .leftJoin(users, eq(users.id, businessStaff.userId))
      .leftJoin(providerProfiles, eq(providerProfiles.userId, businessStaff.userId))
      .where(eq(businessStaff.businessId, biz.id))
      .orderBy(desc(businessStaff.createdAt));
  }),

  inviteStaff: businessQuery
    .input(
      z.object({
        email: z.string().email(),
        role: z.enum(["manager", "cleaner"]).default("cleaner"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const biz = await requireOwnedBusiness(ctx.user.id);

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No user found with that email. They must sign up first.",
        });
      }

      const [existing] = await db
        .select()
        .from(businessStaff)
        .where(
          and(
            eq(businessStaff.businessId, biz.id),
            eq(businessStaff.userId, user.id)
          )
        )
        .limit(1);
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "That person is already on your staff list.",
        });
      }

      await db.insert(businessStaff).values({
        businessId: biz.id,
        userId: user.id,
        role: input.role,
        status: "invited",
        invitedAt: new Date(),
      });
      return { success: true };
    }),

  updateStaff: businessQuery
    .input(
      z.object({
        staffId: z.number(),
        role: z.enum(["manager", "cleaner"]).optional(),
        status: z.enum(["invited", "active", "suspended"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const biz = await requireOwnedBusiness(ctx.user.id);
      const { staffId, ...data } = input;
      const patch: Record<string, unknown> = { ...data };
      if (data.status === "active") patch.joinedAt = new Date();
      await db
        .update(businessStaff)
        .set(patch)
        .where(
          and(
            eq(businessStaff.id, staffId),
            eq(businessStaff.businessId, biz.id)
          )
        );
      return { success: true };
    }),

  removeStaff: businessQuery
    .input(z.object({ staffId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const biz = await requireOwnedBusiness(ctx.user.id);
      await db
        .delete(businessStaff)
        .where(
          and(
            eq(businessStaff.id, input.staffId),
            eq(businessStaff.businessId, biz.id)
          )
        );
      return { success: true };
    }),

  // ── Services offered by the business ────────────────────────────
  listServices: businessQuery.query(async ({ ctx }) => {
    const db = getDb();
    const biz = await requireOwnedBusiness(ctx.user.id);
    const offered = await db
      .select({
        id: businessServices.id,
        serviceId: businessServices.serviceId,
        customPrice: businessServices.customPrice,
        isActive: businessServices.isActive,
        name: services.name,
        basePrice: services.basePrice,
        icon: services.icon,
      })
      .from(businessServices)
      .leftJoin(services, eq(services.id, businessServices.serviceId))
      .where(eq(businessServices.businessId, biz.id));

    const all = await db
      .select()
      .from(services)
      .where(eq(services.isActive, true));

    return { offered, catalogue: all };
  }),

  addService: businessQuery
    .input(z.object({ serviceId: z.number(), customPrice: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const biz = await requireOwnedBusiness(ctx.user.id);
      const [existing] = await db
        .select()
        .from(businessServices)
        .where(
          and(
            eq(businessServices.businessId, biz.id),
            eq(businessServices.serviceId, input.serviceId)
          )
        )
        .limit(1);
      if (existing) {
        await db
          .update(businessServices)
          .set({ isActive: true, customPrice: input.customPrice })
          .where(eq(businessServices.id, existing.id));
        return { success: true };
      }
      await db.insert(businessServices).values({
        businessId: biz.id,
        serviceId: input.serviceId,
        customPrice: input.customPrice,
        isActive: true,
      });
      return { success: true };
    }),

  removeService: businessQuery
    .input(z.object({ serviceId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const biz = await requireOwnedBusiness(ctx.user.id);
      await db
        .delete(businessServices)
        .where(
          and(
            eq(businessServices.businessId, biz.id),
            eq(businessServices.serviceId, input.serviceId)
          )
        );
      return { success: true };
    }),

  // ── Bookings routed to the business ─────────────────────────────
  listBookings: businessQuery
    .input(
      z
        .object({
          status: z.string().optional(),
          limit: z.number().default(50),
          offset: z.number().default(0),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const biz = await requireOwnedBusiness(ctx.user.id);
      const conditions = [eq(bookings.businessId, biz.id)];
      if (input?.status) {
        conditions.push(eq(bookings.status, input.status as never));
      }
      const rows = await db
        .select({
          id: bookings.id,
          status: bookings.status,
          scheduledDate: bookings.scheduledDate,
          totalAmount: bookings.totalAmount,
          providerId: bookings.providerId,
          paymentStatus: bookings.paymentStatus,
          createdAt: bookings.createdAt,
          customerName: users.name,
        })
        .from(bookings)
        .leftJoin(users, eq(users.id, bookings.customerId))
        .where(and(...conditions))
        .orderBy(desc(bookings.scheduledDate))
        .limit(input?.limit || 50)
        .offset(input?.offset || 0);
      return rows;
    }),

  // Assign a staff member (provider profile id) to one of the business's bookings.
  assignBooking: businessQuery
    .input(z.object({ bookingId: z.number(), providerId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const biz = await requireOwnedBusiness(ctx.user.id);
      await db
        .update(bookings)
        .set({ providerId: input.providerId, status: "provider_assigned" })
        .where(
          and(
            eq(bookings.id, input.bookingId),
            eq(bookings.businessId, biz.id)
          )
        );
      return { success: true };
    }),

  // ── Earnings + withdrawals (business side) ──────────────────────
  earnings: businessQuery.query(async ({ ctx }) => {
    const db = getDb();
    const biz = await requireOwnedBusiness(ctx.user.id);
    const completed = await db
      .select()
      .from(bookings)
      .where(
        and(eq(bookings.businessId, biz.id), eq(bookings.status, "completed"))
      );
    const gross = completed.reduce((s, b) => s + num(b.totalAmount), 0);
    const net = completed.reduce((s, b) => s + num(b.providerEarnings), 0);
    const myWithdrawals = await db
      .select()
      .from(withdrawals)
      .where(eq(withdrawals.businessId, biz.id))
      .orderBy(desc(withdrawals.createdAt));
    return {
      walletBalance: biz.walletBalance ?? "0.00",
      grossRevenue: gross.toFixed(2),
      netEarnings: net.toFixed(2),
      monthly: monthlySeries(completed),
      withdrawals: myWithdrawals,
    };
  }),

  requestWithdrawal: businessQuery
    .input(z.object({ amount: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const biz = await requireOwnedBusiness(ctx.user.id);
      if (num(input.amount) <= 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid amount." });
      }
      if (num(input.amount) > num(biz.walletBalance)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Amount exceeds your available balance.",
        });
      }
      // Payout requires a bank account on file (set under Profile → Bank account).
      if (!biz.bankName || !biz.accountNumber) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Add a bank account in your profile before requesting a payout.",
        });
      }
      await db.insert(withdrawals).values({
        businessId: biz.id,
        amount: input.amount,
        status: "pending",
        bankName: biz.bankName,
        accountNumber: biz.accountNumber,
        accountName: biz.accountName,
      });
      return { success: true };
    }),
});

// ── helpers ───────────────────────────────────────────────────────
function monthlySeries(rows: { createdAt: Date; totalAmount: string }[]) {
  const months: { key: string; label: string; revenue: number; jobs: number }[] =
    [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleString("en", { month: "short" }),
      revenue: 0,
      jobs: 0,
    });
  }
  const index = new Map(months.map((m) => [m.key, m]));
  for (const r of rows) {
    const d = new Date(r.createdAt);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const bucket = index.get(key);
    if (bucket) {
      bucket.revenue += parseFloat(r.totalAmount || "0");
      bucket.jobs += 1;
    }
  }
  return months.map((m) => ({
    month: m.label,
    revenue: Math.round(m.revenue),
    jobs: m.jobs,
  }));
}
