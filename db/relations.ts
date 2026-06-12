import { relations } from "drizzle-orm";
import {
  users,
  serviceCategories,
  services,
  serviceAddons,
  providerProfiles,
  businesses,
  businessStaff,
  providerServices,
  addresses,
  bookings,
  bookingItems,
  bookingStatusHistory,
  reviews,
  messages,
  notifications,
  coupons,
  couponRedemptions,
  providerSchedules,
  providerBlockedDates,
  withdrawals,
  disputes,
  activityLogs,
  referrals,
  providerPortfolio,
  favoriteProviders,
} from "./schema";

// ── USER RELATIONS ──────────────────────────────────────────────
export const usersRelations = relations(users, ({ one, many }) => ({
  providerProfile: one(providerProfiles, {
    fields: [users.id],
    references: [providerProfiles.userId],
  }),
  addresses: many(addresses),
  bookingsAsCustomer: many(bookings, { relationName: "customerBookings" }),
  reviewsAsCustomer: many(reviews, { relationName: "customerReviews" }),
  notifications: many(notifications),
  favoriteProviders: many(favoriteProviders),
  ownedBusiness: one(businesses, {
    fields: [users.id],
    references: [businesses.ownerId],
  }),
  staffMemberships: many(businessStaff),
}));

// ── BUSINESS RELATIONS ──────────────────────────────────────────
export const businessesRelations = relations(businesses, ({ one, many }) => ({
  owner: one(users, {
    fields: [businesses.ownerId],
    references: [users.id],
  }),
  staff: many(businessStaff),
  bookings: many(bookings),
}));

// ── BUSINESS STAFF RELATIONS ────────────────────────────────────
export const businessStaffRelations = relations(businessStaff, ({ one }) => ({
  business: one(businesses, {
    fields: [businessStaff.businessId],
    references: [businesses.id],
  }),
  user: one(users, {
    fields: [businessStaff.userId],
    references: [users.id],
  }),
}));

// ── SERVICE CATEGORY RELATIONS ──────────────────────────────────
export const serviceCategoriesRelations = relations(
  serviceCategories,
  ({ one, many }) => ({
    parent: one(serviceCategories, {
      fields: [serviceCategories.parentId],
      references: [serviceCategories.id],
      relationName: "categoryParent",
    }),
    children: many(serviceCategories, { relationName: "categoryParent" }),
    services: many(services),
  })
);

// ── SERVICE RELATIONS ───────────────────────────────────────────
export const servicesRelations = relations(services, ({ one, many }) => ({
  category: one(serviceCategories, {
    fields: [services.categoryId],
    references: [serviceCategories.id],
  }),
  addons: many(serviceAddons),
  providerServices: many(providerServices),
  bookingItems: many(bookingItems),
  portfolioItems: many(providerPortfolio),
}));

// ── SERVICE ADDON RELATIONS ─────────────────────────────────────
export const serviceAddonsRelations = relations(serviceAddons, ({ one }) => ({
  service: one(services, {
    fields: [serviceAddons.serviceId],
    references: [services.id],
  }),
}));

// ── PROVIDER PROFILE RELATIONS ──────────────────────────────────
export const providerProfilesRelations = relations(
  providerProfiles,
  ({ one, many }) => ({
    user: one(users, {
      fields: [providerProfiles.userId],
      references: [users.id],
    }),
    services: many(providerServices),
    schedules: many(providerSchedules),
    blockedDates: many(providerBlockedDates),
    withdrawals: many(withdrawals),
    portfolio: many(providerPortfolio),
    reviews: many(reviews, { relationName: "providerReviews" }),
    bookings: many(bookings, { relationName: "providerBookings" }),
  })
);

// ── PROVIDER SERVICE RELATIONS ──────────────────────────────────
export const providerServicesRelations = relations(
  providerServices,
  ({ one }) => ({
    provider: one(providerProfiles, {
      fields: [providerServices.providerId],
      references: [providerProfiles.id],
    }),
    service: one(services, {
      fields: [providerServices.serviceId],
      references: [services.id],
    }),
  })
);

// ── ADDRESS RELATIONS ───────────────────────────────────────────
export const addressesRelations = relations(addresses, ({ one, many }) => ({
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id],
  }),
  bookings: many(bookings),
}));

// ── BOOKING RELATIONS ───────────────────────────────────────────
export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  customer: one(users, {
    fields: [bookings.customerId],
    references: [users.id],
    relationName: "customerBookings",
  }),
  provider: one(providerProfiles, {
    fields: [bookings.providerId],
    references: [providerProfiles.id],
    relationName: "providerBookings",
  }),
  business: one(businesses, {
    fields: [bookings.businessId],
    references: [businesses.id],
  }),
  address: one(addresses, {
    fields: [bookings.addressId],
    references: [addresses.id],
  }),
  items: many(bookingItems),
  statusHistory: many(bookingStatusHistory),
  review: one(reviews),
  messages: many(messages),
  dispute: one(disputes),
}));

// ── BOOKING ITEM RELATIONS ──────────────────────────────────────
export const bookingItemsRelations = relations(bookingItems, ({ one }) => ({
  booking: one(bookings, {
    fields: [bookingItems.bookingId],
    references: [bookings.id],
  }),
  service: one(services, {
    fields: [bookingItems.serviceId],
    references: [services.id],
  }),
}));

// ── BOOKING STATUS HISTORY RELATIONS ────────────────────────────
export const bookingStatusHistoryRelations = relations(
  bookingStatusHistory,
  ({ one }) => ({
    booking: one(bookings, {
      fields: [bookingStatusHistory.bookingId],
      references: [bookings.id],
    }),
  })
);

// ── REVIEW RELATIONS ────────────────────────────────────────────
export const reviewsRelations = relations(reviews, ({ one }) => ({
  booking: one(bookings, {
    fields: [reviews.bookingId],
    references: [bookings.id],
  }),
  customer: one(users, {
    fields: [reviews.customerId],
    references: [users.id],
    relationName: "customerReviews",
  }),
  provider: one(providerProfiles, {
    fields: [reviews.providerId],
    references: [providerProfiles.id],
    relationName: "providerReviews",
  }),
}));

// ── MESSAGE RELATIONS ───────────────────────────────────────────
export const messagesRelations = relations(messages, ({ one }) => ({
  booking: one(bookings, {
    fields: [messages.bookingId],
    references: [bookings.id],
  }),
}));

// ── NOTIFICATION RELATIONS ──────────────────────────────────────
export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

// ── COUPON RELATIONS ────────────────────────────────────────────
export const couponsRelations = relations(coupons, ({ many }) => ({
  redemptions: many(couponRedemptions),
}));

// ── COUPON REDEMPTION RELATIONS ─────────────────────────────────
export const couponRedemptionsRelations = relations(
  couponRedemptions,
  ({ one }) => ({
    coupon: one(coupons, {
      fields: [couponRedemptions.couponId],
      references: [coupons.id],
    }),
  })
);

// ── PROVIDER SCHEDULE RELATIONS ─────────────────────────────────
export const providerSchedulesRelations = relations(
  providerSchedules,
  ({ one }) => ({
    provider: one(providerProfiles, {
      fields: [providerSchedules.providerId],
      references: [providerProfiles.id],
    }),
  })
);

// ── PROVIDER BLOCKED DATE RELATIONS ─────────────────────────────
export const providerBlockedDatesRelations = relations(
  providerBlockedDates,
  ({ one }) => ({
    provider: one(providerProfiles, {
      fields: [providerBlockedDates.providerId],
      references: [providerProfiles.id],
    }),
  })
);

// ── WITHDRAWAL RELATIONS ────────────────────────────────────────
export const withdrawalsRelations = relations(withdrawals, ({ one }) => ({
  provider: one(providerProfiles, {
    fields: [withdrawals.providerId],
    references: [providerProfiles.id],
  }),
}));

// ── DISPUTE RELATIONS ───────────────────────────────────────────
export const disputesRelations = relations(disputes, ({ one }) => ({
  booking: one(bookings, {
    fields: [disputes.bookingId],
    references: [bookings.id],
  }),
}));

// ── ACTIVITY LOG RELATIONS ──────────────────────────────────────
export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  admin: one(users, {
    fields: [activityLogs.adminId],
    references: [users.id],
  }),
}));

// ── REFERRAL RELATIONS ──────────────────────────────────────────
export const referralsRelations = relations(referrals, ({ one }) => ({
  referrer: one(users, {
    fields: [referrals.referrerId],
    references: [users.id],
  }),
  referred: one(users, {
    fields: [referrals.referredId],
    references: [users.id],
  }),
}));

// ── PORTFOLIO RELATIONS ─────────────────────────────────────────
export const providerPortfolioRelations = relations(
  providerPortfolio,
  ({ one }) => ({
    provider: one(providerProfiles, {
      fields: [providerPortfolio.providerId],
      references: [providerProfiles.id],
    }),
    service: one(services, {
      fields: [providerPortfolio.serviceId],
      references: [services.id],
    }),
  })
);

// ── FAVORITE PROVIDER RELATIONS ─────────────────────────────────
export const favoriteProvidersRelations = relations(
  favoriteProviders,
  ({ one }) => ({
    customer: one(users, {
      fields: [favoriteProviders.customerId],
      references: [users.id],
    }),
    provider: one(providerProfiles, {
      fields: [favoriteProviders.providerId],
      references: [providerProfiles.id],
    }),
  })
);
