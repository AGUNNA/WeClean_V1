import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  bigint,
  int,
  decimal,
  boolean,
  json,
  index,
  uniqueIndex,
} from "drizzle-orm/mysql-core";

// ── 1. USERS (extended from base auth) ──────────────────────────
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "provider", "company", "admin", "superadmin"])
    .default("user")
    .notNull(),
  // Profile
  dateOfBirth: timestamp("dateOfBirth"),
  gender: mysqlEnum("gender", ["male", "female", "other"]),
  // Location
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  country: varchar("country", { length: 100 }).default("Nigeria"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  // Status
  isActive: boolean("isActive").default(true),
  isVerified: boolean("isVerified").default(false),
  emailVerified: boolean("emailVerified").default(false),
  phoneVerified: boolean("phoneVerified").default(false),
  // Metadata
  referralCode: varchar("referralCode", { length: 20 }),
  referredBy: bigint("referredBy", { mode: "number", unsigned: true }),
  loyaltyPoints: int("loyaltyPoints").default(0),
  // Preferences
  preferredLanguage: varchar("preferredLanguage", { length: 10 }).default("en"),
  notificationsEnabled: boolean("notificationsEnabled").default(true),
  smsEnabled: boolean("smsEnabled").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ── 2. SERVICE CATEGORIES ───────────────────────────────────────
export const serviceCategories = mysqlTable("service_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }),
  image: text("image"),
  displayOrder: int("displayOrder").default(0),
  isActive: boolean("isActive").default(true),
  parentId: bigint("parentId", { mode: "number", unsigned: true }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ── 3. SERVICES ─────────────────────────────────────────────────
export const services = mysqlTable("services", {
  id: serial("id").primaryKey(),
  categoryId: bigint("categoryId", { mode: "number", unsigned: true })
    .notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull(),
  description: text("description"),
  shortDescription: varchar("shortDescription", { length: 255 }),
  image: text("image"),
  icon: varchar("icon", { length: 50 }),
  // Pricing
  basePrice: decimal("basePrice", { precision: 12, scale: 2 }).notNull(),
  priceType: mysqlEnum("priceType", [
    "fixed",
    "per_hour",
    "per_sqm",
    "per_room",
    "custom",
  ])
    .default("fixed")
    .notNull(),
  minPrice: decimal("minPrice", { precision: 12, scale: 2 }),
  maxPrice: decimal("maxPrice", { precision: 12, scale: 2 }),
  estimatedDuration: int("estimatedDuration"), // in minutes
  // Service config
  requiresPropertySize: boolean("requiresPropertySize").default(false),
  requiresRoomCount: boolean("requiresRoomCount").default(false),
  allowsMaterialsChoice: boolean("allowsMaterialsChoice").default(true), // eco-friendly option
  isPopular: boolean("isPopular").default(false),
  isEmergency: boolean("isEmergency").default(false),
  // Status
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// ── 4. SERVICE ADD-ONS ──────────────────────────────────────────
export const serviceAddons = mysqlTable("service_addons", {
  id: serial("id").primaryKey(),
  serviceId: bigint("serviceId", { mode: "number", unsigned: true }).notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  priceType: mysqlEnum("priceType", ["fixed", "per_unit"])
    .default("fixed")
    .notNull(),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ── 5. PROVIDER PROFILES ────────────────────────────────────────
export const providerProfiles = mysqlTable("provider_profiles", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true })
    .notNull()
    .unique(),
  // Profile info
  bio: text("bio"),
  yearsOfExperience: int("yearsOfExperience").default(0),
  companyName: varchar("companyName", { length: 255 }),
  companyRegistrationNumber: varchar("companyRegistrationNumber", {
    length: 100,
  }),
  website: varchar("website", { length: 255 }),
  // Verification
  idType: mysqlEnum("idType", [
    "nin",
    "drivers_license",
    "passport",
    "voters_card",
  ]),
  idNumber: varchar("idNumber", { length: 100 }),
  idDocumentUrl: text("idDocumentUrl"),
  bvn: varchar("bvn", { length: 11 }),
  bvnVerified: boolean("bvnVerified").default(false),
  backgroundCheckStatus: mysqlEnum("backgroundCheckStatus", [
    "pending",
    "in_progress",
    "verified",
    "failed",
  ]).default("pending"),
  backgroundCheckDate: timestamp("backgroundCheckDate"),
  // Insurance
  hasInsurance: boolean("hasInsurance").default(false),
  insuranceProvider: varchar("insuranceProvider", { length: 255 }),
  insuranceDocumentUrl: text("insuranceDocumentUrl"),
  // Certifications (JSON array)
  certifications: json("certifications"),
  // Work area
  serviceRadius: int("serviceRadius").default(10), // km
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  // Financial
  bankName: varchar("bankName", { length: 255 }),
  accountNumber: varchar("accountNumber", { length: 20 }),
  accountName: varchar("accountName", { length: 255 }),
  walletBalance: decimal("walletBalance", { precision: 12, scale: 2 }).default(
    "0.00"
  ),
  // Performance
  overallRating: decimal("overallRating", { precision: 3, scale: 2 }).default(
    "0.00"
  ),
  totalReviews: int("totalReviews").default(0),
  totalJobsCompleted: int("totalJobsCompleted").default(0),
  completionRate: decimal("completionRate", { precision: 5, scale: 2 }).default(
    "0.00"
  ),
  responseTime: int("responseTime"), // average in minutes
  // Subscription
  subscriptionTier: mysqlEnum("subscriptionTier", [
    "free",
    "basic",
    "premium",
    "enterprise",
  ]).default("free"),
  subscriptionExpiry: timestamp("subscriptionExpiry"),
  // Status
  verificationStatus: mysqlEnum("verificationStatus", [
    "unverified",
    "pending",
    "verified",
    "rejected",
  ]).default("unverified"),
  isAvailable: boolean("isAvailable").default(true),
  isOnVacation: boolean("isOnVacation").default(false),
  vacationUntil: timestamp("vacationUntil"),
  // Badge
  badge: mysqlEnum("badge", ["none", "bronze", "silver", "gold", "platinum"]).default("none"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// ── 6. PROVIDER SERVICES (what services a provider offers) ──────
export const providerServices = mysqlTable("provider_services", {
  id: serial("id").primaryKey(),
  providerId: bigint("providerId", { mode: "number", unsigned: true }).notNull(),
  serviceId: bigint("serviceId", { mode: "number", unsigned: true }).notNull(),
  customPrice: decimal("customPrice", { precision: 12, scale: 2 }),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ── 7. SAVED ADDRESSES ──────────────────────────────────────────
export const addresses = mysqlTable("addresses", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  label: varchar("label", { length: 50 }).notNull(), // Home, Office, etc.
  address: text("address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  country: varchar("country", { length: 100 }).default("Nigeria"),
  postalCode: varchar("postalCode", { length: 20 }),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  isDefault: boolean("isDefault").default(false),
  accessInstructions: text("accessInstructions"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ── 8. BOOKINGS ─────────────────────────────────────────────────
export const bookings = mysqlTable(
  "bookings",
  {
    id: serial("id").primaryKey(),
    // References
    customerId: bigint("customerId", { mode: "number", unsigned: true }).notNull(),
    providerId: bigint("providerId", { mode: "number", unsigned: true }),
    addressId: bigint("addressId", { mode: "number", unsigned: true }).notNull(),
    // Status
    status: mysqlEnum("status", [
      "draft",
      "pending",
      "confirmed",
      "provider_assigned",
      "in_progress",
      "provider_arrived",
      "service_started",
      "service_completed",
      "payment_pending",
      "completed",
      "cancelled",
      "disputed",
      "refunded",
    ])
      .default("draft")
      .notNull(),
    // Booking type
    bookingType: mysqlEnum("bookingType", [
      "instant",
      "scheduled",
      "emergency",
      "recurring",
    ])
      .default("instant")
      .notNull(),
    recurringFrequency: mysqlEnum("recurringFrequency", [
      "daily",
      "weekly",
      "bi_weekly",
      "monthly",
    ]),
    recurringEndDate: timestamp("recurringEndDate"),
    parentBookingId: bigint("parentBookingId", {
      mode: "number",
      unsigned: true,
    }),
    // Scheduling
    scheduledDate: timestamp("scheduledDate").notNull(),
    preferredTimeStart: varchar("preferredTimeStart", { length: 10 }), // e.g., "09:00"
    preferredTimeEnd: varchar("preferredTimeEnd", { length: 10 }), // e.g., "12:00"
    actualStartTime: timestamp("actualStartTime"),
    actualEndTime: timestamp("actualEndTime"),
    // Property details
    propertyType: mysqlEnum("propertyType", [
      "apartment",
      "house",
      "office",
      "commercial",
      "industrial",
      "vehicle",
      "event_venue",
      "other",
    ]),
    propertySize: varchar("propertySize", { length: 50 }), // e.g., "2_bedroom", "500_sqm"
    numberOfRooms: int("numberOfRooms"),
    numberOfBathrooms: int("numberOfBathrooms"),
    // Instructions
    specialInstructions: text("specialInstructions"),
    customerAttachments: json("customerAttachments"), // array of image URLs
    // Pricing
    subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
    addonTotal: decimal("addonTotal", { precision: 12, scale: 2 }).default(
      "0.00"
    ),
    platformFee: decimal("platformFee", { precision: 12, scale: 2 }).default(
      "0.00"
    ),
    surgePrice: decimal("surgePrice", { precision: 12, scale: 2 }).default(
      "0.00"
    ),
    discountAmount: decimal("discountAmount", { precision: 12, scale: 2 }).default(
      "0.00"
    ),
    tipAmount: decimal("tipAmount", { precision: 12, scale: 2 }).default(
      "0.00"
    ),
    totalAmount: decimal("totalAmount", { precision: 12, scale: 2 }).notNull(),
    // Payment
    paymentStatus: mysqlEnum("paymentStatus", [
      "pending",
      "authorized",
      "paid",
      "failed",
      "refunded",
      "partially_refunded",
    ])
      .default("pending")
      .notNull(),
    paymentMethod: varchar("paymentMethod", { length: 50 }),
    transactionReference: varchar("transactionReference", { length: 255 }),
    paidAt: timestamp("paidAt"),
    // Provider earnings
    providerEarnings: decimal("providerEarnings", { precision: 12, scale: 2 }),
    commissionRate: decimal("commissionRate", { precision: 5, scale: 2 }),
    // OTP confirmation
    completionOtp: varchar("completionOtp", { length: 6 }),
    otpVerified: boolean("otpVerified").default(false),
    otpVerifiedAt: timestamp("otpVerifiedAt"),
    // Cancellation
    cancelledBy: mysqlEnum("cancelledBy", ["customer", "provider", "system"]),
    cancellationReason: text("cancellationReason"),
    cancelledAt: timestamp("cancelledAt"),
    // Metadata
    source: mysqlEnum("source", ["web", "ios", "android", "admin"]).default(
      "web"
    ),
    ipAddress: varchar("ipAddress", { length: 45 }),
    userAgent: text("userAgent"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("idx_booking_customer").on(table.customerId),
    index("idx_booking_provider").on(table.providerId),
    index("idx_booking_status").on(table.status),
    index("idx_booking_date").on(table.scheduledDate),
    index("idx_booking_created").on(table.createdAt),
  ]
);

// ── 9. BOOKING ITEMS (individual services in a booking) ─────────
export const bookingItems = mysqlTable("booking_items", {
  id: serial("id").primaryKey(),
  bookingId: bigint("bookingId", { mode: "number", unsigned: true }).notNull(),
  serviceId: bigint("serviceId", { mode: "number", unsigned: true }).notNull(),
  serviceName: varchar("serviceName", { length: 200 }).notNull(),
  quantity: int("quantity").default(1),
  unitPrice: decimal("unitPrice", { precision: 12, scale: 2 }).notNull(),
  totalPrice: decimal("totalPrice", { precision: 12, scale: 2 }).notNull(),
  // Customization
  propertySize: varchar("propertySize", { length: 50 }),
  numberOfRooms: int("numberOfRooms"),
  specialRequests: text("specialRequests"),
  useEcoProducts: boolean("useEcoProducts").default(false),
  addons: json("addons"), // array of {addonId, name, price}
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ── 10. BOOKING STATUS HISTORY ──────────────────────────────────
export const bookingStatusHistory = mysqlTable("booking_status_history", {
  id: serial("id").primaryKey(),
  bookingId: bigint("bookingId", { mode: "number", unsigned: true }).notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  notes: text("notes"),
  changedBy: bigint("changedBy", { mode: "number", unsigned: true }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ── 11. REVIEWS ─────────────────────────────────────────────────
export const reviews = mysqlTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    bookingId: bigint("bookingId", { mode: "number", unsigned: true })
      .notNull(),
    customerId: bigint("customerId", { mode: "number", unsigned: true }).notNull(),
    providerId: bigint("providerId", { mode: "number", unsigned: true }).notNull(),
    // Ratings
    overallRating: int("overallRating").notNull(), // 1-5
    punctualityRating: int("punctualityRating"),
    qualityRating: int("qualityRating"),
    professionalismRating: int("professionalismRating"),
    communicationRating: int("communicationRating"),
    valueRating: int("valueRating"),
    // Content
    reviewText: text("reviewText"),
    photos: json("photos"), // array of image URLs
    isVerified: boolean("isVerified").default(false),
    // Moderation
    isFlagged: boolean("isFlagged").default(false),
    flagReason: text("flagReason"),
    moderatorNotes: text("moderatorNotes"),
    isVisible: boolean("isVisible").default(true),
    // Response
    providerResponse: text("providerResponse"),
    providerRespondedAt: timestamp("providerRespondedAt"),
    helpfulCount: int("helpfulCount").default(0),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("idx_review_booking").on(table.bookingId),
    index("idx_review_provider").on(table.providerId),
    index("idx_review_customer").on(table.customerId),
  ]
);

// ── 12. MESSAGES / CHAT ─────────────────────────────────────────
export const messages = mysqlTable(
  "messages",
  {
    id: serial("id").primaryKey(),
    bookingId: bigint("bookingId", { mode: "number", unsigned: true }).notNull(),
    senderId: bigint("senderId", { mode: "number", unsigned: true }).notNull(),
    senderType: mysqlEnum("senderType", ["customer", "provider", "system", "admin"]).notNull(),
    content: text("content").notNull(),
    messageType: mysqlEnum("messageType", [
      "text",
      "image",
      "voice",
      "location",
      "system",
    ]).default("text"),
    attachmentUrl: text("attachmentUrl"),
    isRead: boolean("isRead").default(false),
    readAt: timestamp("readAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [index("idx_message_booking").on(table.bookingId)]
);

// ── 13. NOTIFICATIONS ───────────────────────────────────────────
export const notifications = mysqlTable(
  "notifications",
  {
    id: serial("id").primaryKey(),
    userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
    type: mysqlEnum("type", [
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
    ]).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    body: text("body").notNull(),
    data: json("data"), // extra payload
    image: text("image"),
    actionUrl: varchar("actionUrl", { length: 500 }),
    isRead: boolean("isRead").default(false),
    readAt: timestamp("readAt"),
    sentVia: mysqlEnum("sentVia", ["push", "sms", "email", "in_app"]).default(
      "in_app"
    ),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [index("idx_notif_user").on(table.userId)]
);

// ── 14. COUPONS / PROMO CODES ───────────────────────────────────
export const coupons = mysqlTable("coupons", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  description: text("description"),
  discountType: mysqlEnum("discountType", ["percentage", "fixed_amount"]).notNull(),
  discountValue: decimal("discountValue", { precision: 10, scale: 2 }).notNull(),
  maxDiscount: decimal("maxDiscount", { precision: 12, scale: 2 }),
  minOrderAmount: decimal("minOrderAmount", { precision: 12, scale: 2 }).default(
    "0.00"
  ),
  // Limits
  usageLimit: int("usageLimit"),
  usageCount: int("usageCount").default(0),
  perUserLimit: int("perUserLimit").default(1),
  // Scope
  applicableServices: json("applicableServices"), // null = all
  applicableCategories: json("applicableCategories"), // null = all
  userSpecific: boolean("userSpecific").default(false),
  // Validity
  startsAt: timestamp("startsAt").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  isActive: boolean("isActive").default(true),
  createdBy: bigint("createdBy", { mode: "number", unsigned: true }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ── 15. COUPON REDEMPTIONS ──────────────────────────────────────
export const couponRedemptions = mysqlTable("coupon_redemptions", {
  id: serial("id").primaryKey(),
  couponId: bigint("couponId", { mode: "number", unsigned: true }).notNull(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  bookingId: bigint("bookingId", { mode: "number", unsigned: true }),
  discountAmount: decimal("discountAmount", { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ── 16. PROVIDER AVAILABILITY SCHEDULE ──────────────────────────
export const providerSchedules = mysqlTable("provider_schedules", {
  id: serial("id").primaryKey(),
  providerId: bigint("providerId", { mode: "number", unsigned: true }).notNull(),
  dayOfWeek: int("dayOfWeek").notNull(), // 0=Sunday, 6=Saturday
  startTime: varchar("startTime", { length: 10 }).notNull(), // "08:00"
  endTime: varchar("endTime", { length: 10 }).notNull(), // "18:00"
  isAvailable: boolean("isAvailable").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ── 17. PROVIDER BLOCKED DATES ──────────────────────────────────
export const providerBlockedDates = mysqlTable("provider_blocked_dates", {
  id: serial("id").primaryKey(),
  providerId: bigint("providerId", { mode: "number", unsigned: true }).notNull(),
  date: timestamp("date").notNull(),
  reason: varchar("reason", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ── 18. EARNINGS / WITHDRAWALS ──────────────────────────────────
export const withdrawals = mysqlTable(
  "withdrawals",
  {
    id: serial("id").primaryKey(),
    providerId: bigint("providerId", { mode: "number", unsigned: true }).notNull(),
    amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
    status: mysqlEnum("status", ["pending", "processing", "completed", "rejected"])
      .default("pending")
      .notNull(),
    bankName: varchar("bankName", { length: 255 }),
    accountNumber: varchar("accountNumber", { length: 20 }),
    accountName: varchar("accountName", { length: 255 }),
    processedAt: timestamp("processedAt"),
    processedBy: bigint("processedBy", { mode: "number", unsigned: true }),
    rejectionReason: text("rejectionReason"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [index("idx_withdrawal_provider").on(table.providerId)]
);

// ── 19. DISPUTES ────────────────────────────────────────────────
export const disputes = mysqlTable("disputes", {
  id: serial("id").primaryKey(),
  bookingId: bigint("bookingId", { mode: "number", unsigned: true }).notNull(),
  customerId: bigint("customerId", { mode: "number", unsigned: true }).notNull(),
  providerId: bigint("providerId", { mode: "number", unsigned: true }).notNull(),
  // Dispute details
  reason: mysqlEnum("reason", [
    "no_show",
    "incomplete_service",
    "damaged_property",
    "overcharged",
    "rude_behavior",
    "quality_issue",
    "safety_concern",
    "other",
  ]).notNull(),
  description: text("description").notNull(),
  evidencePhotos: json("evidencePhotos"),
  // Resolution
  status: mysqlEnum("status", [
    "open",
    "under_review",
    "resolved_customer",
    "resolved_provider",
    "resolved_split",
    "rejected",
  ])
    .default("open")
    .notNull(),
  resolution: text("resolution"),
  refundAmount: decimal("refundAmount", { precision: 12, scale: 2 }),
  resolvedBy: bigint("resolvedBy", { mode: "number", unsigned: true }),
  resolvedAt: timestamp("resolvedAt"),
  // Communication
  messages: json("messages"), // thread of messages
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// ── 20. ADMIN ACTIVITY LOGS ─────────────────────────────────────
export const activityLogs = mysqlTable("activity_logs", {
  id: serial("id").primaryKey(),
  adminId: bigint("adminId", { mode: "number", unsigned: true }).notNull(),
  action: varchar("action", { length: 100 }).notNull(), // e.g., "verify_provider", "refund_booking"
  entityType: varchar("entityType", { length: 50 }).notNull(), // e.g., "provider", "booking"
  entityId: bigint("entityId", { mode: "number", unsigned: true }),
  details: json("details"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ── 21. PLATFORM CONFIG / SETTINGS ──────────────────────────────
export const platformSettings = mysqlTable("platform_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
  updatedBy: bigint("updatedBy", { mode: "number", unsigned: true }),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// ── 22. REFERRALS ───────────────────────────────────────────────
export const referrals = mysqlTable("referrals", {
  id: serial("id").primaryKey(),
  referrerId: bigint("referrerId", { mode: "number", unsigned: true }).notNull(),
  referredId: bigint("referredId", { mode: "number", unsigned: true }).notNull(),
  referralCode: varchar("referralCode", { length: 20 }).notNull(),
  status: mysqlEnum("status", ["pending", "completed", "rewarded"])
    .default("pending")
    .notNull(),
  rewardAmount: decimal("rewardAmount", { precision: 12, scale: 2 }).default(
    "0.00"
  ),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ── 23. PROVIDER PORTFOLIO / BEFORE-AFTER PHOTOS ────────────────
export const providerPortfolio = mysqlTable("provider_portfolio", {
  id: serial("id").primaryKey(),
  providerId: bigint("providerId", { mode: "number", unsigned: true }).notNull(),
  bookingId: bigint("bookingId", { mode: "number", unsigned: true }),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  beforeImageUrl: text("beforeImageUrl"),
  afterImageUrl: text("afterImageUrl"),
  serviceId: bigint("serviceId", { mode: "number", unsigned: true }),
  isPublic: boolean("isPublic").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ── 24. FAVORITE PROVIDERS ──────────────────────────────────────
export const favoriteProviders = mysqlTable(
  "favorite_providers",
  {
    id: serial("id").primaryKey(),
    customerId: bigint("customerId", { mode: "number", unsigned: true }).notNull(),
    providerId: bigint("providerId", { mode: "number", unsigned: true }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("idx_fav_customer_provider").on(
      table.customerId,
      table.providerId
    ),
  ]
);
