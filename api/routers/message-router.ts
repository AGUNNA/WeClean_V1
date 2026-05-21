import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { createRouter, authedQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { messages, bookings } from "@db/schema";
import { TRPCError } from "@trpc/server";

export const messageRouter = createRouter({
  // ── Send Message ────────────────────────────────────────────────
  send: authedQuery
    .input(
      z.object({
        bookingId: z.number(),
        content: z.string().min(1),
        messageType: z.enum(["text", "image", "voice", "location"]).default("text"),
        attachmentUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();

      // Verify user is part of this booking
      const [booking] = await db
        .select()
        .from(bookings)
        .where(eq(bookings.id, input.bookingId))
        .limit(1);

      if (!booking) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Booking not found" });
      }

      const isParticipant =
        booking.customerId === ctx.user.id ||
        booking.providerId === ctx.user.id;

      if (!isParticipant) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not a participant in this booking" });
      }

      const senderType = booking.customerId === ctx.user.id ? "customer" : "provider";

      const result = await db.insert(messages).values({
        bookingId: input.bookingId,
        senderId: ctx.user.id,
        senderType,
        content: input.content,
        messageType: input.messageType,
        attachmentUrl: input.attachmentUrl,
      });

      return { success: true, id: Number((result as any).insertId) };
    }),

  // ── Get Messages for Booking ────────────────────────────────────
  listByBooking: authedQuery
    .input(
      z.object({
        bookingId: z.number(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = getDb();

      // Verify user is part of this booking
      const [booking] = await db
        .select()
        .from(bookings)
        .where(eq(bookings.id, input.bookingId))
        .limit(1);

      if (!booking) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Booking not found" });
      }

      const isParticipant =
        booking.customerId === ctx.user.id ||
        booking.providerId === ctx.user.id;

      if (!isParticipant) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
      }

      // Mark messages as read
      await db
        .update(messages)
        .set({ isRead: true, readAt: new Date() })
        .where(
          and(
            eq(messages.bookingId, input.bookingId),
            eq(messages.isRead, false)
          )
        );

      return db
        .select()
        .from(messages)
        .where(eq(messages.bookingId, input.bookingId))
        .orderBy(desc(messages.createdAt))
        .limit(input.limit)
        .offset(input.offset);
    }),

  // ── Mark as Read ────────────────────────────────────────────────
  markRead: authedQuery
    .input(z.object({ messageIds: z.array(z.number()) }))
    .mutation(async ({ input }) => {
      const db = getDb();
      for (const id of input.messageIds) {
        await db
          .update(messages)
          .set({ isRead: true, readAt: new Date() })
          .where(eq(messages.id, id));
      }
      return { success: true };
    }),
});
