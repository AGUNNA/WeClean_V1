import {
  sqliteTable,
  text,
  integer,
  index,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

// ── Shared column helpers ───────────────────────────────────────
// Money is stored as TEXT (e.g. "1200.00") so the existing router math
// (parseFloat / toFixed) keeps working unchanged. Timestamps are stored as
// unix epoch integers and surfaced as JS Date via mode: "timestamp".
const createdAt = () =>
  integer("createdAt", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull();

const updatedAt = () =>
  integer("updatedAt", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date())
    .notNull();

// ── 1. USERS (extended from base auth) ──────────────────────────
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  unionId: text("unionId").notNull().unique(),
  name: text("name"),
  email: text("email"),
  passwordHash: text("passwordHash"),
  phone: text("phone"),
  avatar: text("avatar"),
  role: text("role", {
    enum: ["user", "provider", "business", "company", "admin", "superadmin"],
  })
    .default("user")
    .notNull(),
  // Profile
  dateOfBirth: integer("dateOfBirth", { mode: "timestamp" }),
  gender: text("gender", { enum: ["male", "female", "other"] }),
  // Location
  city: text("city"),
  state: text("state"),
  country: text("country").default("Nigeria"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  // Status
  isActive: integer("isActive", { mode: "boolean" }).default(true),
  isVerified: integer("isVerified", { mode: "boolean" }).default(false),
  emailVerified: integer("emailVerified", { mode: "boolean" }).default(false),
  phoneVerified: integer("phoneVerified", { mode: "boolean" }).default(false),
  // Metadata
  referralCode: text("referralCode"),
  referredBy: integer("referredBy"),
  loyaltyPoints: integer("loyaltyPoints").default(0),
  // Preferences
  preferredLanguage: text("preferredLanguage").default("en"),
  notificationsEnabled: integer("notificationsEnabled", {
    mode: "boolean",
  }).default(true),
  smsEnabled: integer("smsEnabled", { mode: "boolean" }).default(true),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
  lastSignInAt: integer("lastSignInAt", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ── 2. SERVICE CATEGORIES ───────────────────────────────────────
export const serviceCategories = sqliteTable("service_categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  icon: text("icon"),
  image: text("image"),
  displayOrder: integer("displayOrder").default(0),
  isActive: integer("isActive", { mode: "boolean" }).default(true),
  parentId: integer("parentId"),
  createdAt: createdAt(),
});

// ── 3. SERVICES ─────────────────────────────────────────────────
export const services = sqliteTable("services", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  categoryId: integer("categoryId").notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  shortDescription: text("shortDescription"),
  image: text("image"),
  icon: text("icon"),
  // Pricing
  basePrice: text("basePrice").notNull(),
  priceType: text("priceType", {
    enum: ["fixed", "per_hour", "per_sqm", "per_room", "custom"],
  })
    .default("fixed")
    .notNull(),
  minPrice: text("minPrice"),
  maxPrice: text("maxPrice"),
  estimatedDuration: integer("estimatedDuration"), // in minutes
  // Service config
  requiresPropertySize: integer("requiresPropertySize", {
    mode: "boolean",
  }).default(false),
  requiresRoomCount: integer("requiresRoomCount", { mode: "boolean" }).default(
    false
  ),
  allowsMaterialsChoice: integer("allowsMaterialsChoice", {
    mode: "boolean",
  }).default(true),
  isPopular: integer("isPopular", { mode: "boolean" }).default(false),
  isEmergency: integer("isEmergency", { mode: "boolean" }).default(false),
  // Status
  isActive: integer("isActive", { mode: "boolean" }).default(true),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

// ── 4. SERVICE ADD-ONS ──────────────────────────────────────────
export const serviceAddons = sqliteTable("service_addons", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  serviceId: integer("serviceId").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  price: text("price").notNull(),
  priceType: text("priceType", { enum: ["fixed", "per_unit"] })
    .default("fixed")
    .notNull(),
  isActive: integer("isActive", { mode: "boolean" }).default(true),
  createdAt: createdAt(),
});

// ── 5. PROVIDER PROFILES ────────────────────────────────────────
export const providerProfiles = sqliteTable("provider_profiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull().unique(),
  // Profile info
  bio: text("bio"),
  yearsOfExperience: integer("yearsOfExperience").default(0),
  companyName: text("companyName"),
  companyRegistrationNumber: text("companyRegistrationNumber"),
  website: text("website"),
  // Verification
  idType: text("idType", {
    enum: ["nin", "drivers_license", "passport", "voters_card"],
  }),
  idNumber: text("idNumber"),
  idDocumentUrl: text("idDocumentUrl"),
  bvn: text("bvn"),
  bvnVerified: integer("bvnVerified", { mode: "boolean" }).default(false),
  backgroundCheckStatus: text("backgroundCheckStatus", {
    enum: ["pending", "in_progress", "verified", "failed"],
  }).default("pending"),
  backgroundCheckDate: integer("backgroundCheckDate", { mode: "timestamp" }),
  // Insurance
  hasInsurance: integer("hasInsurance", { mode: "boolean" }).default(false),
  insuranceProvider: text("insuranceProvider"),
  insuranceDocumentUrl: text("insuranceDocumentUrl"),
  // Certifications (JSON array)
  certifications: text("certifications", { mode: "json" }),
  // Work area
  serviceRadius: integer("serviceRadius").default(10), // km
  city: text("city"),
  state: text("state"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  // Financial
  bankName: text("bankName"),
  accountNumber: text("accountNumber"),
  accountName: text("accountName"),
  walletBalance: text("walletBalance").default("0.00"),
  // Performance
  overallRating: text("overallRating").default("0.00"),
  totalReviews: integer("totalReviews").default(0),
  totalJobsCompleted: integer("totalJobsCompleted").default(0),
  completionRate: text("completionRate").default("0.00"),
  responseTime: integer("responseTime"), // average in minutes
  // Subscription
  subscriptionTier: text("subscriptionTier", {
    enum: ["free", "basic", "premium", "enterprise"],
  }).default("free"),
  subscriptionExpiry: integer("subscriptionExpiry", { mode: "timestamp" }),
  // Status
  verificationStatus: text("verificationStatus", {
    enum: ["unverified", "pending", "verified", "rejected"],
  }).default("unverified"),
  isAvailable: integer("isAvailable", { mode: "boolean" }).default(true),
  isOnVacation: integer("isOnVacation", { mode: "boolean" }).default(false),
  vacationUntil: integer("vacationUntil", { mode: "timestamp" }),
  // Badge
  badge: text("badge", {
    enum: ["none", "bronze", "silver", "gold", "platinum"],
  }).default("none"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

// ── 5b. BUSINESSES (company employing provider staff) ───────────
export const businesses = sqliteTable("businesses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ownerId: integer("ownerId").notNull().unique(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  registrationNumber: text("registrationNumber"),
  logo: text("logo"),
  description: text("description"),
  email: text("email"),
  phone: text("phone"),
  website: text("website"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  country: text("country").default("Nigeria"),
  verificationStatus: text("verificationStatus", {
    enum: ["unverified", "pending", "verified", "rejected"],
  })
    .default("unverified")
    .notNull(),
  commissionRate: text("commissionRate").default("15.00"),
  walletBalance: text("walletBalance").default("0.00"),
  // Payout / bank account
  bankName: text("bankName"),
  accountNumber: text("accountNumber"),
  accountName: text("accountName"),
  totalJobsCompleted: integer("totalJobsCompleted").default(0),
  overallRating: text("overallRating").default("0.00"),
  totalReviews: integer("totalReviews").default(0),
  isActive: integer("isActive", { mode: "boolean" }).default(true),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export type Business = typeof businesses.$inferSelect;
export type InsertBusiness = typeof businesses.$inferInsert;

// ── 5c. BUSINESS STAFF (providers employed by a business) ───────
export const businessStaff = sqliteTable(
  "business_staff",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    businessId: integer("businessId").notNull(),
    userId: integer("userId").notNull(),
    role: text("role", { enum: ["owner", "manager", "cleaner"] })
      .default("cleaner")
      .notNull(),
    status: text("status", { enum: ["invited", "active", "suspended"] })
      .default("invited")
      .notNull(),
    invitedAt: integer("invitedAt", { mode: "timestamp" }),
    joinedAt: integer("joinedAt", { mode: "timestamp" }),
    createdAt: createdAt(),
  },
  (table) => [
    uniqueIndex("idx_business_staff_unique").on(
      table.businessId,
      table.userId
    ),
    index("idx_business_staff_business").on(table.businessId),
  ]
);

export type BusinessStaff = typeof businessStaff.$inferSelect;

// ── 5d. BUSINESS SERVICES (services a business offers) ──────────
export const businessServices = sqliteTable(
  "business_services",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    businessId: integer("businessId").notNull(),
    serviceId: integer("serviceId").notNull(),
    customPrice: text("customPrice"),
    isActive: integer("isActive", { mode: "boolean" }).default(true),
    createdAt: createdAt(),
  },
  (table) => [
    uniqueIndex("idx_business_service_unique").on(
      table.businessId,
      table.serviceId
    ),
  ]
);

// ── 6. PROVIDER SERVICES (what services a provider offers) ──────
export const providerServices = sqliteTable("provider_services", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  providerId: integer("providerId").notNull(),
  serviceId: integer("serviceId").notNull(),
  customPrice: text("customPrice"),
  isActive: integer("isActive", { mode: "boolean" }).default(true),
  createdAt: createdAt(),
});

// ── 7. SAVED ADDRESSES ──────────────────────────────────────────
export const addresses = sqliteTable("addresses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  label: text("label").notNull(), // Home, Office, etc.
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  country: text("country").default("Nigeria"),
  postalCode: text("postalCode"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  isDefault: integer("isDefault", { mode: "boolean" }).default(false),
  accessInstructions: text("accessInstructions"),
  createdAt: createdAt(),
});

// ── 8. BOOKINGS ─────────────────────────────────────────────────
export const bookings = sqliteTable(
  "bookings",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    // References
    customerId: integer("customerId").notNull(),
    providerId: integer("providerId"),
    businessId: integer("businessId"),
    addressId: integer("addressId").notNull(),
    // Status
    status: text("status", {
      enum: [
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
      ],
    })
      .default("draft")
      .notNull(),
    // Booking type
    bookingType: text("bookingType", {
      enum: ["instant", "scheduled", "emergency", "recurring"],
    })
      .default("instant")
      .notNull(),
    recurringFrequency: text("recurringFrequency", {
      enum: ["daily", "weekly", "bi_weekly", "monthly"],
    }),
    recurringEndDate: integer("recurringEndDate", { mode: "timestamp" }),
    parentBookingId: integer("parentBookingId"),
    // Scheduling
    scheduledDate: integer("scheduledDate", { mode: "timestamp" }).notNull(),
    preferredTimeStart: text("preferredTimeStart"), // e.g., "09:00"
    preferredTimeEnd: text("preferredTimeEnd"), // e.g., "12:00"
    actualStartTime: integer("actualStartTime", { mode: "timestamp" }),
    actualEndTime: integer("actualEndTime", { mode: "timestamp" }),
    // Property details
    propertyType: text("propertyType", {
      enum: [
        "apartment",
        "house",
        "office",
        "commercial",
        "industrial",
        "vehicle",
        "event_venue",
        "other",
      ],
    }),
    propertySize: text("propertySize"), // e.g., "2_bedroom", "500_sqm"
    numberOfRooms: integer("numberOfRooms"),
    numberOfBathrooms: integer("numberOfBathrooms"),
    // Instructions
    specialInstructions: text("specialInstructions"),
    customerAttachments: text("customerAttachments", { mode: "json" }),
    // Pricing
    subtotal: text("subtotal").notNull(),
    addonTotal: text("addonTotal").default("0.00"),
    platformFee: text("platformFee").default("0.00"),
    surgePrice: text("surgePrice").default("0.00"),
    discountAmount: text("discountAmount").default("0.00"),
    tipAmount: text("tipAmount").default("0.00"),
    totalAmount: text("totalAmount").notNull(),
    // Payment
    paymentStatus: text("paymentStatus", {
      enum: [
        "pending",
        "authorized",
        "paid",
        "failed",
        "refunded",
        "partially_refunded",
      ],
    })
      .default("pending")
      .notNull(),
    paymentMethod: text("paymentMethod"),
    transactionReference: text("transactionReference"),
    paidAt: integer("paidAt", { mode: "timestamp" }),
    // Provider earnings
    providerEarnings: text("providerEarnings"),
    commissionRate: text("commissionRate"),
    // OTP confirmation
    completionOtp: text("completionOtp"),
    otpVerified: integer("otpVerified", { mode: "boolean" }).default(false),
    otpVerifiedAt: integer("otpVerifiedAt", { mode: "timestamp" }),
    // Cancellation
    cancelledBy: text("cancelledBy", {
      enum: ["customer", "provider", "system"],
    }),
    cancellationReason: text("cancellationReason"),
    cancelledAt: integer("cancelledAt", { mode: "timestamp" }),
    // Metadata
    source: text("source", { enum: ["web", "ios", "android", "admin"] }).default(
      "web"
    ),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    index("idx_booking_customer").on(table.customerId),
    index("idx_booking_provider").on(table.providerId),
    index("idx_booking_business").on(table.businessId),
    index("idx_booking_status").on(table.status),
    index("idx_booking_date").on(table.scheduledDate),
    index("idx_booking_created").on(table.createdAt),
  ]
);

// ── 9. BOOKING ITEMS (individual services in a booking) ─────────
export const bookingItems = sqliteTable("booking_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  bookingId: integer("bookingId").notNull(),
  serviceId: integer("serviceId").notNull(),
  serviceName: text("serviceName").notNull(),
  quantity: integer("quantity").default(1),
  unitPrice: text("unitPrice").notNull(),
  totalPrice: text("totalPrice").notNull(),
  // Customization
  propertySize: text("propertySize"),
  numberOfRooms: integer("numberOfRooms"),
  specialRequests: text("specialRequests"),
  useEcoProducts: integer("useEcoProducts", { mode: "boolean" }).default(false),
  addons: text("addons", { mode: "json" }), // array of {addonId, name, price}
  createdAt: createdAt(),
});

// ── 10. BOOKING STATUS HISTORY ──────────────────────────────────
export const bookingStatusHistory = sqliteTable("booking_status_history", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  bookingId: integer("bookingId").notNull(),
  status: text("status").notNull(),
  notes: text("notes"),
  changedBy: integer("changedBy"),
  createdAt: createdAt(),
});

// ── 11. REVIEWS ─────────────────────────────────────────────────
export const reviews = sqliteTable(
  "reviews",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    bookingId: integer("bookingId").notNull(),
    customerId: integer("customerId").notNull(),
    providerId: integer("providerId").notNull(),
    // Ratings
    overallRating: integer("overallRating").notNull(), // 1-5
    punctualityRating: integer("punctualityRating"),
    qualityRating: integer("qualityRating"),
    professionalismRating: integer("professionalismRating"),
    communicationRating: integer("communicationRating"),
    valueRating: integer("valueRating"),
    // Content
    reviewText: text("reviewText"),
    photos: text("photos", { mode: "json" }), // array of image URLs
    isVerified: integer("isVerified", { mode: "boolean" }).default(false),
    // Moderation
    isFlagged: integer("isFlagged", { mode: "boolean" }).default(false),
    flagReason: text("flagReason"),
    moderatorNotes: text("moderatorNotes"),
    isVisible: integer("isVisible", { mode: "boolean" }).default(true),
    // Response
    providerResponse: text("providerResponse"),
    providerRespondedAt: integer("providerRespondedAt", { mode: "timestamp" }),
    helpfulCount: integer("helpfulCount").default(0),
    createdAt: createdAt(),
  },
  (table) => [
    uniqueIndex("idx_review_booking").on(table.bookingId),
    index("idx_review_provider").on(table.providerId),
    index("idx_review_customer").on(table.customerId),
  ]
);

// ── 12. MESSAGES / CHAT ─────────────────────────────────────────
export const messages = sqliteTable(
  "messages",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    bookingId: integer("bookingId").notNull(),
    senderId: integer("senderId").notNull(),
    senderType: text("senderType", {
      enum: ["customer", "provider", "system", "admin"],
    }).notNull(),
    content: text("content").notNull(),
    messageType: text("messageType", {
      enum: ["text", "image", "voice", "location", "system"],
    }).default("text"),
    attachmentUrl: text("attachmentUrl"),
    isRead: integer("isRead", { mode: "boolean" }).default(false),
    readAt: integer("readAt", { mode: "timestamp" }),
    createdAt: createdAt(),
  },
  (table) => [index("idx_message_booking").on(table.bookingId)]
);

// ── 13. NOTIFICATIONS ───────────────────────────────────────────
export const notifications = sqliteTable(
  "notifications",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("userId").notNull(),
    type: text("type", {
      enum: [
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
      ],
    }).notNull(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    data: text("data", { mode: "json" }), // extra payload
    image: text("image"),
    actionUrl: text("actionUrl"),
    isRead: integer("isRead", { mode: "boolean" }).default(false),
    readAt: integer("readAt", { mode: "timestamp" }),
    sentVia: text("sentVia", {
      enum: ["push", "sms", "email", "in_app"],
    }).default("in_app"),
    createdAt: createdAt(),
  },
  (table) => [index("idx_notif_user").on(table.userId)]
);

// ── 14. COUPONS / PROMO CODES ───────────────────────────────────
export const coupons = sqliteTable("coupons", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  code: text("code").notNull().unique(),
  description: text("description"),
  discountType: text("discountType", {
    enum: ["percentage", "fixed_amount"],
  }).notNull(),
  discountValue: text("discountValue").notNull(),
  maxDiscount: text("maxDiscount"),
  minOrderAmount: text("minOrderAmount").default("0.00"),
  // Limits
  usageLimit: integer("usageLimit"),
  usageCount: integer("usageCount").default(0),
  perUserLimit: integer("perUserLimit").default(1),
  // Scope
  applicableServices: text("applicableServices", { mode: "json" }), // null = all
  applicableCategories: text("applicableCategories", { mode: "json" }), // null = all
  userSpecific: integer("userSpecific", { mode: "boolean" }).default(false),
  // Validity
  startsAt: integer("startsAt", { mode: "timestamp" }).notNull(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  isActive: integer("isActive", { mode: "boolean" }).default(true),
  createdBy: integer("createdBy"),
  createdAt: createdAt(),
});

// ── 15. COUPON REDEMPTIONS ──────────────────────────────────────
export const couponRedemptions = sqliteTable("coupon_redemptions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  couponId: integer("couponId").notNull(),
  userId: integer("userId").notNull(),
  bookingId: integer("bookingId"),
  discountAmount: text("discountAmount").notNull(),
  createdAt: createdAt(),
});

// ── 16. PROVIDER AVAILABILITY SCHEDULE ──────────────────────────
export const providerSchedules = sqliteTable("provider_schedules", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  providerId: integer("providerId").notNull(),
  dayOfWeek: integer("dayOfWeek").notNull(), // 0=Sunday, 6=Saturday
  startTime: text("startTime").notNull(), // "08:00"
  endTime: text("endTime").notNull(), // "18:00"
  isAvailable: integer("isAvailable", { mode: "boolean" }).default(true),
  createdAt: createdAt(),
});

// ── 17. PROVIDER BLOCKED DATES ──────────────────────────────────
export const providerBlockedDates = sqliteTable("provider_blocked_dates", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  providerId: integer("providerId").notNull(),
  date: integer("date", { mode: "timestamp" }).notNull(),
  reason: text("reason"),
  createdAt: createdAt(),
});

// ── 18. EARNINGS / WITHDRAWALS ──────────────────────────────────
export const withdrawals = sqliteTable(
  "withdrawals",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    providerId: integer("providerId"),
    businessId: integer("businessId"),
    amount: text("amount").notNull(),
    status: text("status", {
      enum: ["pending", "processing", "completed", "rejected"],
    })
      .default("pending")
      .notNull(),
    bankName: text("bankName"),
    accountNumber: text("accountNumber"),
    accountName: text("accountName"),
    processedAt: integer("processedAt", { mode: "timestamp" }),
    processedBy: integer("processedBy"),
    rejectionReason: text("rejectionReason"),
    createdAt: createdAt(),
  },
  (table) => [index("idx_withdrawal_provider").on(table.providerId)]
);

// ── 19. DISPUTES ────────────────────────────────────────────────
export const disputes = sqliteTable("disputes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  bookingId: integer("bookingId").notNull(),
  customerId: integer("customerId").notNull(),
  providerId: integer("providerId").notNull(),
  // Dispute details
  reason: text("reason", {
    enum: [
      "no_show",
      "incomplete_service",
      "damaged_property",
      "overcharged",
      "rude_behavior",
      "quality_issue",
      "safety_concern",
      "other",
    ],
  }).notNull(),
  description: text("description").notNull(),
  evidencePhotos: text("evidencePhotos", { mode: "json" }),
  // Resolution
  status: text("status", {
    enum: [
      "open",
      "under_review",
      "resolved_customer",
      "resolved_provider",
      "resolved_split",
      "rejected",
    ],
  })
    .default("open")
    .notNull(),
  resolution: text("resolution"),
  refundAmount: text("refundAmount"),
  resolvedBy: integer("resolvedBy"),
  resolvedAt: integer("resolvedAt", { mode: "timestamp" }),
  // Communication
  messages: text("messages", { mode: "json" }), // thread of messages
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

// ── 20. ADMIN ACTIVITY LOGS ─────────────────────────────────────
export const activityLogs = sqliteTable("activity_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  adminId: integer("adminId").notNull(),
  action: text("action").notNull(), // e.g., "verify_provider", "refund_booking"
  entityType: text("entityType").notNull(), // e.g., "provider", "booking"
  entityId: integer("entityId"),
  details: text("details", { mode: "json" }),
  ipAddress: text("ipAddress"),
  createdAt: createdAt(),
});

// ── 21. PLATFORM CONFIG / SETTINGS ──────────────────────────────
export const platformSettings = sqliteTable("platform_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
  updatedBy: integer("updatedBy"),
  updatedAt: updatedAt(),
});

// ── 22. REFERRALS ───────────────────────────────────────────────
export const referrals = sqliteTable("referrals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  referrerId: integer("referrerId").notNull(),
  referredId: integer("referredId").notNull(),
  referralCode: text("referralCode").notNull(),
  status: text("status", { enum: ["pending", "completed", "rewarded"] })
    .default("pending")
    .notNull(),
  rewardAmount: text("rewardAmount").default("0.00"),
  completedAt: integer("completedAt", { mode: "timestamp" }),
  createdAt: createdAt(),
});

// ── 23. PROVIDER PORTFOLIO / BEFORE-AFTER PHOTOS ────────────────
export const providerPortfolio = sqliteTable("provider_portfolio", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  providerId: integer("providerId").notNull(),
  bookingId: integer("bookingId"),
  title: text("title"),
  description: text("description"),
  beforeImageUrl: text("beforeImageUrl"),
  afterImageUrl: text("afterImageUrl"),
  serviceId: integer("serviceId"),
  isPublic: integer("isPublic", { mode: "boolean" }).default(true),
  createdAt: createdAt(),
});

// ── 24. FAVORITE PROVIDERS ──────────────────────────────────────
export const favoriteProviders = sqliteTable(
  "favorite_providers",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    customerId: integer("customerId").notNull(),
    providerId: integer("providerId").notNull(),
    createdAt: createdAt(),
  },
  (table) => [
    uniqueIndex("idx_fav_customer_provider").on(
      table.customerId,
      table.providerId
    ),
  ]
);
