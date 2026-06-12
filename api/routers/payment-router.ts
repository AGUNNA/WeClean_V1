import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { createRouter, authedQuery, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { bookings, withdrawals, providerProfiles, coupons } from "@db/schema";
import { TRPCError } from "@trpc/server";

export const paymentRouter = createRouter({
  // ── Initiate Payment ────────────────────────────────────────────
  initiate: authedQuery
    .input(
      z.object({
        bookingId: z.number(),
        paymentMethod: z.enum(["paystack", "flutterwave", "wallet"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
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

      // Generate transaction reference
      const txRef = `CLP${Date.now()}${Math.floor(Math.random() * 1000)}`;

      await db
        .update(bookings)
        .set({
          paymentStatus: "authorized",
          paymentMethod: input.paymentMethod,
          transactionReference: txRef,
        })
        .where(eq(bookings.id, input.bookingId));

      // Return payment initialization data
      return {
        success: true,
        transactionReference: txRef,
        amount: booking.totalAmount,
        email: ctx.user.email,
        bookingId: input.bookingId,
        // These would be actual Paystack/Flutterwave config
        paystackPublicKey: "pk_test_placeholder",
        flutterwavePublicKey: "FLWPUBK_TEST_placeholder",
      };
    }),

  // ── Verify Payment ──────────────────────────────────────────────
  verify: authedQuery
    .input(
      z.object({
        bookingId: z.number(),
        transactionReference: z.string(),
        status: z.enum(["success", "failed"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      if (input.status === "success") {
        await db
          .update(bookings)
          .set({
            paymentStatus: "paid",
            status: "confirmed",
            paidAt: new Date(),
          })
          .where(eq(bookings.id, input.bookingId));

        return { success: true, message: "Payment verified" };
      } else {
        await db
          .update(bookings)
          .set({ paymentStatus: "failed" })
          .where(eq(bookings.id, input.bookingId));

        return { success: false, message: "Payment failed" };
      }
    }),

  // ── Request Withdrawal ──────────────────────────────────────────
  requestWithdrawal: authedQuery
    .input(
      z.object({
        amount: z.string(),
        bankName: z.string(),
        accountNumber: z.string(),
        accountName: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
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

      const amount = parseFloat(input.amount);
      const balance = parseFloat(profile.walletBalance || "0");

      if (amount > balance) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Insufficient balance" });
      }

      // Create withdrawal request
      await db.insert(withdrawals).values({
        providerId: profile.id,
        amount: input.amount,
        bankName: input.bankName,
        accountNumber: input.accountNumber,
        accountName: input.accountName,
      });

      // Deduct from wallet
      await db
        .update(providerProfiles)
        .set({
          walletBalance: (balance - amount).toFixed(2),
        })
        .where(eq(providerProfiles.id, profile.id));

      return { success: true };
    }),

  // ── Get Withdrawals ─────────────────────────────────────────────
  myWithdrawals: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const [profile] = await db
      .select()
      .from(providerProfiles)
      .where(eq(providerProfiles.userId, ctx.user.id))
      .limit(1);

    if (!profile) return [];

    return db
      .select()
      .from(withdrawals)
      .where(eq(withdrawals.providerId, profile.id))
      .orderBy(desc(withdrawals.createdAt));
  }),

  // ── Wallet Balance ──────────────────────────────────────────────
  walletBalance: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const [profile] = await db
      .select()
      .from(providerProfiles)
      .where(eq(providerProfiles.userId, ctx.user.id))
      .limit(1);

    return {
      balance: profile?.walletBalance || "0.00",
      currency: "NGN",
    };
  }),

  // ── Earnings Summary ────────────────────────────────────────────
  earningsSummary: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const [profile] = await db
      .select()
      .from(providerProfiles)
      .where(eq(providerProfiles.userId, ctx.user.id))
      .limit(1);

    if (!profile) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Provider profile not found" });
    }

    // Get completed bookings for this provider
    const providerBookings = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.providerId, profile.id),
          eq(bookings.status, "completed"),
          eq(bookings.paymentStatus, "paid")
        )
      );

    const totalEarnings = providerBookings.reduce(
      (sum, b) => sum + parseFloat(b.providerEarnings || "0"),
      0
    );

    const totalTips = providerBookings.reduce(
      (sum, b) => sum + parseFloat(b.tipAmount || "0"),
      0
    );

    const pendingBookings = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.providerId, profile.id),
          eq(bookings.status, "service_completed"),
          eq(bookings.paymentStatus, "paid"),
          eq(bookings.otpVerified, true)
        )
      );

    const pendingPayout = pendingBookings.reduce(
      (sum, b) => sum + parseFloat(b.providerEarnings || "0"),
      0
    );

    return {
      totalEarnings: totalEarnings.toFixed(2),
      totalTips: totalTips.toFixed(2),
      walletBalance: profile.walletBalance,
      pendingPayout: pendingPayout.toFixed(2),
      totalJobs: profile.totalJobsCompleted,
      rating: profile.overallRating,
    };
  }),

  // ── Process Withdrawal (Admin) ──────────────────────────────────
  processWithdrawal: adminQuery
    .input(
      z.object({
        withdrawalId: z.number(),
        status: z.enum(["processing", "completed", "rejected"]),
        rejectionReason: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db
        .update(withdrawals)
        .set({
          status: input.status,
          processedAt: new Date(),
          processedBy: ctx.user.id,
          ...(input.rejectionReason && { rejectionReason: input.rejectionReason }),
        })
        .where(eq(withdrawals.id, input.withdrawalId));

      return { success: true };
    }),

  // ── List Pending Withdrawals (Admin) ────────────────────────────
  pendingWithdrawals: adminQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(withdrawals)
      .where(eq(withdrawals.status, "pending"))
      .orderBy(desc(withdrawals.createdAt));
  }),

  // ── Validate Coupon ─────────────────────────────────────────────
  validateCoupon: authedQuery
    .input(
      z.object({
        code: z.string(),
        bookingAmount: z.string(),
        serviceId: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const now = new Date();

      const [coupon] = await db
        .select()
        .from(coupons)
        .where(and(eq(coupons.code, input.code), eq(coupons.isActive, true)))
        .limit(1);

      if (!coupon) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Invalid coupon code" });
      }

      if (now < coupon.startsAt || now > coupon.expiresAt) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Coupon expired" });
      }

      if (coupon.usageLimit && (coupon.usageCount || 0) >= coupon.usageLimit) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Coupon usage limit reached" });
      }

      const bookingAmount = parseFloat(input.bookingAmount);
      if (coupon.minOrderAmount && bookingAmount < parseFloat(coupon.minOrderAmount)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Minimum order amount is ${coupon.minOrderAmount}`,
        });
      }

      // Calculate discount
      let discount = 0;
      if (coupon.discountType === "percentage") {
        discount = bookingAmount * (parseFloat(coupon.discountValue) / 100);
        if (coupon.maxDiscount && discount > parseFloat(coupon.maxDiscount)) {
          discount = parseFloat(coupon.maxDiscount);
        }
      } else {
        discount = parseFloat(coupon.discountValue);
      }

      return {
        valid: true,
        discount: discount.toFixed(2),
        couponId: coupon.id,
      };
    }),

  // ── Apply Tip ───────────────────────────────────────────────────
  addTip: authedQuery
    .input(
      z.object({
        bookingId: z.number(),
        amount: z.string(),
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

      const newTotal = (
        parseFloat(booking.totalAmount) + parseFloat(input.amount)
      ).toFixed(2);

      await db
        .update(bookings)
        .set({
          tipAmount: input.amount,
          totalAmount: newTotal,
        })
        .where(eq(bookings.id, input.bookingId));

      return { success: true };
    }),
});
