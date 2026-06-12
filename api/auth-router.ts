import { z } from "zod";
import * as cookie from "cookie";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { TRPCError } from "@trpc/server";
import { Session } from "@contracts/constants";
import { users, businesses, providerProfiles } from "@db/schema";
import { getSessionCookieOptions } from "./lib/cookies";
import { createRouter, authedQuery, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { signSessionToken } from "./lib/session";
import { hashPassword, verifyPassword } from "./lib/password";
import { findUserByUnionId, findUserByEmail, upsertUser } from "./queries/users";
import type { TrpcContext } from "./context";

// Seeded demo accounts (see db/seed.ts). Quick-access sign-in options.
const DEMO_ACCOUNTS = {
  admin: { unionId: "dev-admin", name: "Platform Admin", role: "admin" as const },
  business: { unionId: "dev-biz-1", name: "Business Owner", role: "business" as const },
  provider: { unionId: "dev-prov-1", name: "Cleaning Provider", role: "provider" as const },
  customer: { unionId: "dev-cust-1", name: "Customer", role: "user" as const },
};

// Set (or clear) the session cookie on the response.
function writeSessionCookie(ctx: TrpcContext, token: string, maxAge: number) {
  const opts = getSessionCookieOptions(ctx.req.headers);
  ctx.resHeaders.append(
    "set-cookie",
    cookie.serialize(Session.cookieName, token, {
      httpOnly: opts.httpOnly,
      path: opts.path,
      sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
      secure: opts.secure,
      maxAge,
    })
  );
}

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 40);

export const authRouter = createRouter({
  me: authedQuery.query((opts) => opts.ctx.user),

  // ── Register with email + password ─────────────────────────────
  register: publicQuery
    .input(
      z.object({
        name: z.string().min(1).max(255),
        email: z.string().email(),
        password: z.string().min(6, "Password must be at least 6 characters"),
        role: z.enum(["user", "business", "provider"]).default("user"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const email = input.email.trim().toLowerCase();

      const existing = await findUserByEmail(email);
      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: "An account with that email already exists." });
      }

      const unionId = `usr_${nanoid(16)}`;
      await db.insert(users).values({
        unionId,
        name: input.name,
        email,
        passwordHash: hashPassword(input.password),
        role: input.role,
        emailVerified: false,
        lastSignInAt: new Date(),
      });
      const user = await findUserByUnionId(unionId);

      // Provision the role-specific record so their dashboard works immediately.
      if (user && input.role === "business") {
        await db.insert(businesses).values({
          ownerId: user.id,
          name: input.name,
          slug: `${slugify(input.name) || "business"}-${nanoid(5).toLowerCase()}`,
          email,
          verificationStatus: "pending",
        });
      }
      if (user && input.role === "provider") {
        await db.insert(providerProfiles).values({
          userId: user.id,
          verificationStatus: "pending",
        });
      }

      const token = await signSessionToken({ unionId });
      writeSessionCookie(ctx, token, Session.maxAgeMs / 1000);
      return { success: true, role: input.role };
    }),

  // ── Login with email + password ────────────────────────────────
  login: publicQuery
    .input(z.object({ email: z.string().email(), password: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const email = input.email.trim().toLowerCase();
      const user = await findUserByEmail(email);
      if (!user || !verifyPassword(input.password, user.passwordHash)) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password." });
      }
      if (!user.isActive) {
        throw new TRPCError({ code: "FORBIDDEN", message: "This account is disabled." });
      }
      await getDb().update(users).set({ lastSignInAt: new Date() }).where(eq(users.id, user.id));

      const token = await signSessionToken({ unionId: user.unionId });
      writeSessionCookie(ctx, token, Session.maxAgeMs / 1000);
      return { success: true, role: user.role };
    }),

  // ── Change password (for Settings) ─────────────────────────────
  updatePassword: authedQuery
    .input(
      z.object({
        currentPassword: z.string().optional(),
        newPassword: z.string().min(6, "Password must be at least 6 characters"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      // If a password is already set, the current one must match.
      if (ctx.user.passwordHash) {
        if (!input.currentPassword || !verifyPassword(input.currentPassword, ctx.user.passwordHash)) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Current password is incorrect." });
        }
      }
      await db
        .update(users)
        .set({ passwordHash: hashPassword(input.newPassword) })
        .where(eq(users.id, ctx.user.id));
      return { success: true };
    }),

  // Update the current user's own profile (shared across all roles).
  updateProfile: authedQuery
    .input(
      z.object({
        name: z.string().min(1).max(255).optional(),
        phone: z.string().max(20).optional(),
        avatar: z.string().optional(),
        city: z.string().max(100).optional(),
        state: z.string().max(100).optional(),
        notificationsEnabled: z.boolean().optional(),
        smsEnabled: z.boolean().optional(),
        preferredLanguage: z.string().max(10).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await getDb().update(users).set(input).where(eq(users.id, ctx.user.id));
      return { success: true };
    }),

  logout: authedQuery.mutation(async ({ ctx }) => {
    writeSessionCookie(ctx, "", 0);
    return { success: true };
  }),

  // ── Demo login: sign in as one of the seeded demo accounts ─────
  demoLogin: publicQuery
    .input(z.object({ account: z.enum(["admin", "business", "provider", "customer"]) }))
    .mutation(async ({ ctx, input }) => {
      const demo = DEMO_ACCOUNTS[input.account];
      let user = await findUserByUnionId(demo.unionId);
      if (!user) {
        await upsertUser({
          unionId: demo.unionId,
          name: demo.name,
          role: demo.role,
          lastSignInAt: new Date(),
        });
        user = await findUserByUnionId(demo.unionId);
      }
      const token = await signSessionToken({ unionId: demo.unionId });
      writeSessionCookie(ctx, token, Session.maxAgeMs / 1000);
      return { success: true, role: user?.role ?? "user" };
    }),
});
