import { z } from "zod";
import { eq, and, desc, gte, lte } from "drizzle-orm";
import { createRouter, authedQuery, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import {
  bookings,
  bookingItems,
  bookingStatusHistory,
  providerProfiles,
  services,
  notifications,
  addresses,
  users,
} from "@db/schema";
import { TRPCError } from "@trpc/server";

export const bookingRouter = createRouter({
  // ── Create Booking ──────────────────────────────────────────────
  create: authedQuery
    .input(
      z.object({
        addressId: z.number(),
        scheduledDate: z.string().transform((str) => new Date(str)),
        preferredTimeStart: z.string().optional(),
        preferredTimeEnd: z.string().optional(),
        bookingType: z.enum(["instant", "scheduled", "emergency", "recurring"]).default("instant"),
        recurringFrequency: z.enum(["daily", "weekly", "bi_weekly", "monthly"]).optional(),
        propertyType: z.enum([
          "apartment", "house", "office", "commercial",
          "industrial", "vehicle", "event_venue", "other",
        ]).optional(),
        propertySize: z.string().optional(),
        numberOfRooms: z.number().optional(),
        numberOfBathrooms: z.number().optional(),
        specialInstructions: z.string().optional(),
        customerAttachments: z.array(z.string()).optional(),
        items: z.array(
          z.object({
            serviceId: z.number(),
            quantity: z.number().default(1),
            propertySize: z.string().optional(),
            numberOfRooms: z.number().optional(),
            specialRequests: z.string().optional(),
            useEcoProducts: z.boolean().default(false),
            addons: z.array(z.object({
              addonId: z.number(),
              name: z.string(),
              price: z.string(),
            })).optional(),
          })
        ),
        subtotal: z.string(),
        addonTotal: z.string().optional(),
        platformFee: z.string().optional(),
        surgePrice: z.string().optional(),
        discountAmount: z.string().optional(),
        totalAmount: z.string(),
        source: z.enum(["web", "ios", "android", "admin"]).default("web"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const customerId = ctx.user.id;

      // Generate OTP for completion
      const completionOtp = Math.floor(100000 + Math.random() * 900000).toString();

      // Create booking
      const bookingResult = await db.insert(bookings).values({
        customerId,
        addressId: input.addressId,
        status: "pending",
        bookingType: input.bookingType,
        recurringFrequency: input.recurringFrequency,
        scheduledDate: input.scheduledDate,
        preferredTimeStart: input.preferredTimeStart,
        preferredTimeEnd: input.preferredTimeEnd,
        propertyType: input.propertyType,
        propertySize: input.propertySize,
        numberOfRooms: input.numberOfRooms,
        numberOfBathrooms: input.numberOfBathrooms,
        specialInstructions: input.specialInstructions,
        customerAttachments: input.customerAttachments,
        subtotal: input.subtotal,
        addonTotal: input.addonTotal || "0.00",
        platformFee: input.platformFee || "0.00",
        surgePrice: input.surgePrice || "0.00",
        discountAmount: input.discountAmount || "0.00",
        totalAmount: input.totalAmount,
        commissionRate: "15.00",
        completionOtp,
        source: input.source,
      });

      const bookingId = Number(bookingResult.lastInsertRowid);

      // Create booking items
      if (input.items && input.items.length > 0) {
        for (const item of input.items) {
          const [service] = await db
            .select()
            .from(services)
            .where(eq(services.id, item.serviceId))
            .limit(1);

          if (!service) continue;

          const unitPrice = service.basePrice;
          const totalPrice = (
            parseFloat(unitPrice) * item.quantity
          ).toFixed(2);

          await db.insert(bookingItems).values({
            bookingId,
            serviceId: item.serviceId,
            serviceName: service.name,
            quantity: item.quantity,
            unitPrice,
            totalPrice,
            propertySize: item.propertySize,
            numberOfRooms: item.numberOfRooms,
            specialRequests: item.specialRequests,
            useEcoProducts: item.useEcoProducts,
            addons: item.addons,
          });
        }
      }

      // Create status history entry
      await db.insert(bookingStatusHistory).values({
        bookingId,
        status: "pending",
        notes: "Booking created",
        changedBy: customerId,
      });

      // Notify the customer
      await db.insert(notifications).values({
        userId: customerId,
        type: "booking_confirmed",
        title: "Booking placed",
        body: `Your booking #${bookingId} has been received and is pending confirmation.`,
        actionUrl: `/booking/confirmation/${bookingId}`,
      });

      return { success: true, bookingId };
    }),

  // ── Get Customer Bookings ───────────────────────────────────────
  myBookings: authedQuery
    .input(
      z.object({
        status: z.string().optional(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const conditions = [eq(bookings.customerId, ctx.user.id)];

      if (input?.status) {
        conditions.push(eq(bookings.status, input.status as any));
      }

      const results = await db
        .select()
        .from(bookings)
        .where(and(...conditions))
        .orderBy(desc(bookings.createdAt))
        .limit(input?.limit || 20)
        .offset(input?.offset || 0);

      return results;
    }),

  // ── Get Provider Bookings ───────────────────────────────────────
  providerBookings: authedQuery
    .input(
      z.object({
        status: z.string().optional(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const db = getDb();

      // Get provider profile
      const [profile] = await db
        .select()
        .from(providerProfiles)
        .where(eq(providerProfiles.userId, ctx.user.id))
        .limit(1);

      if (!profile) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Provider profile not found" });
      }

      const conditions = [eq(bookings.providerId, profile.id)];
      if (input?.status) {
        conditions.push(eq(bookings.status, input.status as any));
      }

      return db
        .select()
        .from(bookings)
        .where(and(...conditions))
        .orderBy(desc(bookings.scheduledDate))
        .limit(input?.limit || 20)
        .offset(input?.offset || 0);
    }),

  // ── Get Booking Details ─────────────────────────────────────────
  getById: authedQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [booking] = await db
        .select()
        .from(bookings)
        .where(eq(bookings.id, input.id))
        .limit(1);

      if (!booking) return null;

      // Get items
      const items = await db
        .select()
        .from(bookingItems)
        .where(eq(bookingItems.bookingId, input.id));

      // Get status history
      const history = await db
        .select()
        .from(bookingStatusHistory)
        .where(eq(bookingStatusHistory.bookingId, input.id))
        .orderBy(desc(bookingStatusHistory.createdAt));

      // Delivery address
      const [address] = await db
        .select()
        .from(addresses)
        .where(eq(addresses.id, booking.addressId))
        .limit(1);

      // Assigned provider (if any)
      let provider: {
        name: string | null;
        overallRating: string | null;
        totalJobsCompleted: number | null;
      } | null = null;
      if (booking.providerId) {
        const [p] = await db
          .select({
            name: users.name,
            overallRating: providerProfiles.overallRating,
            totalJobsCompleted: providerProfiles.totalJobsCompleted,
          })
          .from(providerProfiles)
          .leftJoin(users, eq(users.id, providerProfiles.userId))
          .where(eq(providerProfiles.id, booking.providerId))
          .limit(1);
        provider = p ?? null;
      }

      return { ...booking, items, history, address: address ?? null, provider };
    }),

  // ── Update Booking Status ───────────────────────────────────────
  updateStatus: authedQuery
    .input(
      z.object({
        bookingId: z.number(),
        status: z.enum([
          "pending", "confirmed", "provider_assigned", "in_progress",
          "provider_arrived", "service_started", "service_completed",
          "payment_pending", "completed", "cancelled", "disputed", "refunded",
        ]),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const now = new Date();

      const updateData: any = { status: input.status };

      // Track actual times
      if (input.status === "service_started") updateData.actualStartTime = now;
      if (input.status === "service_completed") updateData.actualEndTime = now;
      if (input.status === "cancelled") {
        updateData.cancelledBy = "customer";
        updateData.cancelledAt = now;
      }

      // Load the booking first (needed for provider crediting + notification)
      const [bk] = await db
        .select()
        .from(bookings)
        .where(eq(bookings.id, input.bookingId))
        .limit(1);

      await db
        .update(bookings)
        .set(updateData)
        .where(eq(bookings.id, input.bookingId));

      // Add status history
      await db.insert(bookingStatusHistory).values({
        bookingId: input.bookingId,
        status: input.status,
        notes: input.notes || `Status changed to ${input.status}`,
        changedBy: ctx.user.id,
      });

      // On completion, credit the provider: +1 completed job and add earnings
      // to their wallet (only once — guard against re-completing).
      if (
        input.status === "completed" &&
        bk &&
        bk.status !== "completed" &&
        bk.providerId
      ) {
        const [prof] = await db
          .select()
          .from(providerProfiles)
          .where(eq(providerProfiles.id, bk.providerId))
          .limit(1);
        if (prof) {
          await db
            .update(providerProfiles)
            .set({
              totalJobsCompleted: (prof.totalJobsCompleted ?? 0) + 1,
              walletBalance: (
                parseFloat(prof.walletBalance || "0") +
                parseFloat(bk.providerEarnings || "0")
              ).toFixed(2),
            })
            .where(eq(providerProfiles.id, bk.providerId));
        }
      }

      // Notify the booking's customer of the status change
      if (bk) {
        await db.insert(notifications).values({
          userId: bk.customerId,
          type: input.status === "completed" ? "service_completed" : "booking_reminder",
          title: `Booking #${input.bookingId} ${input.status.replace(/_/g, " ")}`,
          body: input.notes || `Your booking is now "${input.status.replace(/_/g, " ")}".`,
          actionUrl: `/dashboard`,
        });
      }

      return { success: true };
    }),

  // ── Assign Provider ─────────────────────────────────────────────
  assignProvider: authedQuery
    .input(
      z.object({
        bookingId: z.number(),
        providerId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();

      // Calculate provider earnings (85% after commission)
      const [booking] = await db
        .select()
        .from(bookings)
        .where(eq(bookings.id, input.bookingId))
        .limit(1);

      if (!booking) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Booking not found" });
      }

      const totalAmount = parseFloat(booking.totalAmount);
      const commissionRate = 0.15; // 15% platform fee
      const providerEarnings = (totalAmount * (1 - commissionRate)).toFixed(2);

      await db
        .update(bookings)
        .set({
          providerId: input.providerId,
          status: "provider_assigned",
          providerEarnings,
          commissionRate: "15.00",
        })
        .where(eq(bookings.id, input.bookingId));

      await db.insert(bookingStatusHistory).values({
        bookingId: input.bookingId,
        status: "provider_assigned",
        notes: `Provider assigned`,
        changedBy: ctx.user.id,
      });

      return { success: true };
    }),

  // ── Verify Completion OTP ───────────────────────────────────────
  verifyOtp: authedQuery
    .input(
      z.object({
        bookingId: z.number(),
        otp: z.string().length(6),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [booking] = await db
        .select()
        .from(bookings)
        .where(eq(bookings.id, input.bookingId))
        .limit(1);

      if (!booking) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Booking not found" });
      }

      if (booking.completionOtp !== input.otp) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid OTP" });
      }

      await db
        .update(bookings)
        .set({
          otpVerified: true,
          otpVerifiedAt: new Date(),
          status: "service_completed",
        })
        .where(eq(bookings.id, input.bookingId));

      return { success: true };
    }),

  // ── Cancel Booking ──────────────────────────────────────────────
  cancel: authedQuery
    .input(
      z.object({
        bookingId: z.number(),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const now = new Date();

      await db
        .update(bookings)
        .set({
          status: "cancelled",
          cancelledBy: "customer",
          cancellationReason: input.reason,
          cancelledAt: now,
        })
        .where(eq(bookings.id, input.bookingId));

      await db.insert(bookingStatusHistory).values({
        bookingId: input.bookingId,
        status: "cancelled",
        notes: input.reason || "Booking cancelled by customer",
        changedBy: ctx.user.id,
      });

      return { success: true };
    }),

  // ── Admin: List All Bookings ────────────────────────────────────
  adminList: adminQuery
    .input(
      z.object({
        status: z.string().optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
        dateFrom: z.string().optional(),
        dateTo: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [];

      if (input?.status) {
        conditions.push(eq(bookings.status, input.status as any));
      }
      if (input?.dateFrom) {
        conditions.push(gte(bookings.scheduledDate, new Date(input.dateFrom)));
      }
      if (input?.dateTo) {
        conditions.push(lte(bookings.scheduledDate, new Date(input.dateTo)));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      return db
        .select()
        .from(bookings)
        .where(whereClause)
        .orderBy(desc(bookings.createdAt))
        .limit(input?.limit || 50)
        .offset(input?.offset || 0);
    }),

  // ── Dashboard Stats ─────────────────────────────────────────────
  dashboardStats: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const customerId = ctx.user.id;

    const allBookings = await db
      .select()
      .from(bookings)
      .where(eq(bookings.customerId, customerId));

    const totalBookings = allBookings.length;
    const completedBookings = allBookings.filter((b) => b.status === "completed").length;
    const pendingBookings = allBookings.filter(
      (b) => !["completed", "cancelled", "refunded"].includes(b.status)
    ).length;
    const totalSpent = allBookings
      .filter((b) => b.status === "completed")
      .reduce((sum, b) => sum + parseFloat(b.totalAmount), 0);

    return {
      totalBookings,
      completedBookings,
      pendingBookings,
      totalSpent: totalSpent.toFixed(2),
    };
  }),
});
