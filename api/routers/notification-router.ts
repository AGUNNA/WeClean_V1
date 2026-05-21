import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { createRouter, authedQuery, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { notifications } from "@db/schema";

export const notificationRouter = createRouter({
  // ── Get My Notifications ────────────────────────────────────────
  myNotifications: authedQuery
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
        unreadOnly: z.boolean().default(false),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const conditions = [eq(notifications.userId, ctx.user.id)];

      if (input?.unreadOnly) {
        conditions.push(eq(notifications.isRead, false));
      }

      return db
        .select()
        .from(notifications)
        .where(and(...conditions))
        .orderBy(desc(notifications.createdAt))
        .limit(input?.limit || 20)
        .offset(input?.offset || 0);
    }),

  // ── Mark as Read ────────────────────────────────────────────────
  markRead: authedQuery
    .input(z.object({ notificationId: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(notifications)
        .set({ isRead: true, readAt: new Date() })
        .where(eq(notifications.id, input.notificationId));

      return { success: true };
    }),

  // ── Mark All as Read ────────────────────────────────────────────
  markAllRead: authedQuery.mutation(async ({ ctx }) => {
    const db = getDb();
    await db
      .update(notifications)
      .set({ isRead: true, readAt: new Date() })
      .where(eq(notifications.userId, ctx.user.id));

    return { success: true };
  }),

  // ── Get Unread Count ────────────────────────────────────────────
  unreadCount: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const unreadNotifications = await db
      .select()
      .from(notifications)
      .where(
        and(eq(notifications.userId, ctx.user.id), eq(notifications.isRead, false))
      );

    return { count: unreadNotifications.length };
  }),

  // ── Admin: Send Notification ────────────────────────────────────
  send: adminQuery
    .input(
      z.object({
        userIds: z.array(z.number()).optional(), // If empty, send to all
        type: z.enum([
          "booking_confirmed",
          "booking_reminder",
          "provider_assigned",
          "provider_arriving",
          "service_completed",
          "payment_received",
          "payment_failed",
          "review_request",
          "promo",
          "system",
          "chat",
          "dispute_update",
          "withdrawal_processed",
        ]),
        title: z.string().min(1),
        body: z.string().min(1),
        data: z.record(z.string(), z.any()).optional(),
        image: z.string().optional(),
        actionUrl: z.string().optional(),
        sentVia: z.enum(["push", "sms", "email", "in_app"]).default("in_app"),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      // For now, just create in-app notifications
      // In production, this would also trigger push/SMS via Firebase/Termii
      const targetUsers = input.userIds || [];

      if (targetUsers.length === 0) {
        // Broadcast - in production, get all active users
        return { success: true, sent: 0, note: "Broadcast not implemented in demo" };
      }

      let sent = 0;
      for (const userId of targetUsers) {
        await db.insert(notifications).values({
          userId,
          type: input.type,
          title: input.title,
          body: input.body,
          data: input.data,
          image: input.image,
          actionUrl: input.actionUrl,
          sentVia: input.sentVia,
        });
        sent++;
      }

      return { success: true, sent };
    }),
});
