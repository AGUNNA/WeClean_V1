import "dotenv/config";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import { hashPassword } from "../api/lib/password";

// Every seeded account uses this password so the email/password form works.
const DEMO_PASSWORD = "password123";
const DEMO_PASSWORD_HASH = hashPassword(DEMO_PASSWORD);

const {
  users,
  serviceCategories,
  services,
  serviceAddons,
  providerProfiles,
  providerServices,
  businesses,
  businessStaff,
  addresses,
  bookings,
  bookingItems,
  bookingStatusHistory,
  reviews,
  withdrawals,
  disputes,
  platformSettings,
  coupons,
  notifications,
} = schema;

const sqlite = new Database(process.env.DATABASE_URL || "./data/weclean.db");
sqlite.pragma("foreign_keys = OFF");
const db = drizzle(sqlite, { schema });

// ── helpers ─────────────────────────────────────────────────────
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);
const money = (n: number) => n.toFixed(2);
const weighted = <T>(entries: [T, number][]): T => {
  const total = entries.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * total;
  for (const [v, w] of entries) {
    if ((r -= w) < 0) return v;
  }
  return entries[0][0];
};

const FIRST = ["Amara", "Tunde", "Ngozi", "Ibrahim", "Chioma", "Emeka", "Aisha", "Bola", "Yusuf", "Funke", "Kelechi", "Zainab", "Obinna", "Halima", "Segun", "Ada", "Musa", "Ifeoma", "Tochi", "Maryam", "Femi", "Uche", "Sani", "Grace", "Daniel"];
const LAST = ["Okafor", "Bakare", "Eze", "Suleiman", "Adeyemi", "Okonkwo", "Mohammed", "Balogun", "Nwosu", "Abubakar", "Olawale", "Chukwu", "Lawal", "Obi", "Ighodalo"];
const CITIES: [string, string][] = [
  ["Lagos", "Lagos"], ["Ikeja", "Lagos"], ["Lekki", "Lagos"], ["Abuja", "FCT"],
  ["Port Harcourt", "Rivers"], ["Ibadan", "Oyo"], ["Kano", "Kano"], ["Enugu", "Enugu"],
];
const fullName = () => `${pick(FIRST)} ${pick(LAST)}`;

async function insertOne(table: any, values: Record<string, unknown>): Promise<number> {
  const [row] = await db.insert(table).values(values as any).returning({ id: table.id });
  return Number((row as { id: number }).id);
}

async function clearAll() {
  // Child rows before parents (FKs are OFF, but keep it tidy).
  for (const t of [
    notifications, disputes, withdrawals, reviews, bookingStatusHistory,
    bookingItems, bookings, addresses, businessStaff, businesses,
    providerServices, providerProfiles, serviceAddons, services,
    serviceCategories, coupons, platformSettings, users,
  ]) {
    await db.delete(t);
  }
  sqlite.prepare("DELETE FROM sqlite_sequence").run();
}

async function main() {
  console.log("Clearing existing data…");
  await clearAll();

  // ── Service categories + services ─────────────────────────────
  console.log("Seeding services…");
  const categoryDefs = [
    { name: "Home Cleaning", slug: "home-cleaning", icon: "home" },
    { name: "Commercial", slug: "commercial", icon: "building" },
    { name: "Specialized", slug: "specialized", icon: "sparkles" },
    { name: "Laundry & Care", slug: "laundry", icon: "shirt" },
  ];
  const categoryIds: number[] = [];
  for (const [i, c] of categoryDefs.entries()) {
    categoryIds.push(
      await insertOne(serviceCategories, { ...c, displayOrder: i, isActive: true })
    );
  }

  const serviceDefs = [
    { cat: 0, name: "Standard House Cleaning", base: 12000, popular: true },
    { cat: 0, name: "Deep Cleaning", base: 25000, popular: true },
    { cat: 0, name: "Move-in / Move-out Cleaning", base: 35000 },
    { cat: 1, name: "Office Cleaning", base: 45000, popular: true },
    { cat: 1, name: "Retail Store Cleaning", base: 30000 },
    { cat: 2, name: "Fumigation & Pest Control", base: 15000, emergency: true },
    { cat: 2, name: "Post-Construction Cleaning", base: 60000 },
    { cat: 2, name: "Upholstery & Carpet Cleaning", base: 18000 },
    { cat: 3, name: "Laundry & Ironing", base: 5500 },
    { cat: 3, name: "Dry Cleaning Pickup", base: 8000 },
  ];
  const serviceIds: number[] = [];
  for (const s of serviceDefs) {
    const id = await insertOne(services, {
      categoryId: categoryIds[s.cat],
      name: s.name,
      slug: s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      shortDescription: `Professional ${s.name.toLowerCase()} by vetted cleaners.`,
      description: `Book trusted professionals for ${s.name.toLowerCase()}. Satisfaction guaranteed.`,
      basePrice: money(s.base),
      priceType: "fixed",
      isPopular: !!(s as { popular?: boolean }).popular,
      isEmergency: !!(s as { emergency?: boolean }).emergency,
      isActive: true,
      estimatedDuration: randInt(60, 240),
    });
    serviceIds.push(id);
    await db.insert(serviceAddons).values([
      { serviceId: id, name: "Eco-friendly products", price: money(2000), priceType: "fixed", isActive: true },
      { serviceId: id, name: "Inside fridge", price: money(3500), priceType: "fixed", isActive: true },
    ]);
  }

  // ── Admin ─────────────────────────────────────────────────────
  console.log("Seeding users…");
  const adminId = await insertOne(users, {
    unionId: "dev-admin", name: "Platform Admin", email: "admin@weclean.ng",
    phone: "+2348000000000", passwordHash: DEMO_PASSWORD_HASH, role: "admin", isActive: true, isVerified: true,
    emailVerified: true, city: "Lagos", state: "Lagos",
  });

  // ── Customers (+ one address each) ────────────────────────────
  const customerIds: number[] = [];
  const customerAddress: Record<number, number> = {};
  for (let i = 1; i <= 25; i++) {
    const [city, state] = pick(CITIES);
    const uid = await insertOne(users, {
      unionId: `dev-cust-${i}`, name: fullName(),
      email: `customer${i}@example.com`, phone: `+23480${randInt(10000000, 99999999)}`,
      passwordHash: DEMO_PASSWORD_HASH, role: "user", isActive: true, emailVerified: Math.random() > 0.3,
      city, state, loyaltyPoints: randInt(0, 500),
      createdAt: daysAgo(randInt(1, 120)),
    });
    customerIds.push(uid);
    customerAddress[uid] = await insertOne(addresses, {
      userId: uid, label: pick(["Home", "Office", "Apartment"]),
      address: `${randInt(1, 80)} ${pick(LAST)} Street`, city, state, isDefault: true,
    });
  }

  // ── Providers (+ provider profiles) ───────────────────────────
  const providerProfileIds: number[] = [];
  const providerUserIds: number[] = [];
  for (let i = 1; i <= 12; i++) {
    const [city, state] = pick(CITIES);
    const uid = await insertOne(users, {
      unionId: `dev-prov-${i}`, name: fullName(),
      email: `provider${i}@example.com`, phone: `+23481${randInt(10000000, 99999999)}`,
      passwordHash: DEMO_PASSWORD_HASH, role: "provider", isActive: true, isVerified: true, emailVerified: true, city, state,
      createdAt: daysAgo(randInt(20, 150)),
    });
    providerUserIds.push(uid);
    const status = weighted([["verified", 7], ["pending", 3], ["unverified", 1]]) as any;
    const pid = await insertOne(providerProfiles, {
      userId: uid, bio: "Experienced, reliable cleaning professional.",
      yearsOfExperience: randInt(1, 12), city, state,
      verificationStatus: status, isAvailable: Math.random() > 0.2,
      overallRating: money(randInt(35, 50) / 10), totalReviews: randInt(0, 80),
      totalJobsCompleted: randInt(0, 200), completionRate: money(randInt(80, 100)),
      responseTime: randInt(5, 60), walletBalance: money(randInt(0, 250000)),
      badge: pick(["none", "bronze", "silver", "gold"]),
      bankName: "GTBank", accountNumber: `0${randInt(100000000, 999999999)}`, accountName: "Provider Account",
    });
    providerProfileIds.push(pid);
    const svcCount = randInt(2, 4);
    const chosen = new Set<number>();
    while (chosen.size < svcCount) chosen.add(pick(serviceIds));
    for (const sid of chosen) {
      await db.insert(providerServices).values({ providerId: pid, serviceId: sid, isActive: true });
    }
  }

  // ── Businesses (each owns a slice of 4 providers) ─────────────
  console.log("Seeding businesses…");
  const businessDefs = [
    { name: "Sparkle Clean Ltd", slug: "sparkle-clean" },
    { name: "FreshSpaces NG", slug: "freshspaces-ng" },
    { name: "PrimeCare Facilities", slug: "primecare-facilities" },
  ];
  const businessIds: number[] = [];
  for (let b = 0; b < businessDefs.length; b++) {
    const [city, state] = pick(CITIES);
    const ownerId = await insertOne(users, {
      unionId: `dev-biz-${b + 1}`, name: fullName(),
      email: `owner@${businessDefs[b].slug}.ng`, phone: `+23470${randInt(10000000, 99999999)}`,
      passwordHash: DEMO_PASSWORD_HASH, role: "business", isActive: true, isVerified: true, emailVerified: true, city, state,
      createdAt: daysAgo(randInt(30, 200)),
    });
    const bizId = await insertOne(businesses, {
      ownerId, name: businessDefs[b].name, slug: businessDefs[b].slug,
      registrationNumber: `RC${randInt(100000, 999999)}`,
      description: `${businessDefs[b].name} provides premium cleaning services across Nigeria.`,
      email: `hello@${businessDefs[b].slug}.ng`, phone: `+23470${randInt(10000000, 99999999)}`,
      city, state, address: `${randInt(1, 40)} Industrial Way`,
      verificationStatus: weighted([["verified", 2], ["pending", 1]]) as any,
      commissionRate: money(15), walletBalance: money(randInt(50000, 800000)),
      totalJobsCompleted: randInt(20, 300), overallRating: money(randInt(38, 49) / 10),
      totalReviews: randInt(10, 120), isActive: true,
    });
    businessIds.push(bizId);
    for (let s = 0; s < 4; s++) {
      const staffUid = providerUserIds[b * 4 + s];
      if (!staffUid) continue;
      await db.insert(businessStaff).values({
        businessId: bizId, userId: staffUid,
        role: s === 0 ? "manager" : "cleaner",
        status: weighted([["active", 4], ["invited", 1]]) as any,
        invitedAt: daysAgo(randInt(10, 60)),
        joinedAt: daysAgo(randInt(0, 9)),
      });
    }
  }

  // ── Bookings (~130 over last 90 days) ─────────────────────────
  console.log("Seeding bookings…");
  const statusDist: [string, number][] = [
    ["completed", 50], ["pending", 8], ["confirmed", 10], ["provider_assigned", 6],
    ["in_progress", 5], ["cancelled", 7], ["disputed", 3], ["refunded", 2],
  ];
  const completedBookings: { id: number; customerId: number; providerProfileId: number }[] = [];
  const BOOKING_COUNT = 130;
  for (let i = 0; i < BOOKING_COUNT; i++) {
    const customerId = pick(customerIds);
    const providerIdx = randInt(0, providerProfileIds.length - 1);
    const providerProfileId = providerProfileIds[providerIdx];
    const businessId = businessIds[Math.floor(providerIdx / 4)];
    const svcIdx = randInt(0, serviceIds.length - 1);
    const sid = serviceIds[svcIdx];
    const svc = serviceDefs[svcIdx];
    const status = weighted(statusDist) as any;
    const created = daysAgo(randInt(0, 90));
    const qty = randInt(1, 2);
    const subtotal = svc.base * qty;
    const addon = Math.random() > 0.5 ? 2000 : 0;
    const platformFee = Math.round(subtotal * 0.05);
    const total = subtotal + addon + platformFee;
    const isPaid = ["completed", "in_progress", "disputed", "refunded"].includes(status);

    const bookingId = await insertOne(bookings, {
      customerId, providerId: providerProfileId, businessId,
      addressId: customerAddress[customerId], status,
      bookingType: weighted([["scheduled", 6], ["instant", 3], ["emergency", 1]]) as any,
      scheduledDate: created, propertyType: pick(["apartment", "house", "office", "commercial"]),
      propertySize: pick(["1_bedroom", "2_bedroom", "3_bedroom", "500_sqm"]),
      numberOfRooms: randInt(1, 5),
      subtotal: money(subtotal), addonTotal: money(addon), platformFee: money(platformFee),
      totalAmount: money(total),
      paymentStatus: status === "refunded" ? "refunded" : isPaid ? "paid" : "pending",
      paymentMethod: pick(["card", "transfer", "wallet"]),
      paidAt: isPaid ? created : null,
      providerEarnings: money(total - platformFee), commissionRate: money(15),
      source: pick(["web", "ios", "android"]), createdAt: created,
    });
    await db.insert(bookingItems).values({
      bookingId, serviceId: sid, serviceName: svc.name, quantity: qty,
      unitPrice: money(svc.base), totalPrice: money(subtotal),
    });
    await db.insert(bookingStatusHistory).values({
      bookingId, status, notes: "Seeded", changedBy: customerId, createdAt: created,
    });
    if (status === "completed") {
      completedBookings.push({ id: bookingId, customerId, providerProfileId });
    }
  }

  // ── Reviews for ~70% of completed bookings ────────────────────
  console.log("Seeding reviews…");
  for (const b of completedBookings) {
    if (Math.random() > 0.7) continue;
    const rating = weighted([[5, 5], [4, 4], [3, 2], [2, 1]]) as number;
    await db.insert(reviews).values({
      bookingId: b.id, customerId: b.customerId, providerId: b.providerProfileId,
      overallRating: rating, qualityRating: rating, punctualityRating: randInt(3, 5),
      professionalismRating: randInt(3, 5), communicationRating: randInt(3, 5),
      reviewText: pick([
        "Excellent service, very thorough!", "Punctual and professional.",
        "House looked spotless. Will book again.", "Good job overall.",
        "Friendly cleaner, great attention to detail.",
      ]),
      isVerified: true, isVisible: true, isFlagged: Math.random() > 0.95,
      createdAt: daysAgo(randInt(0, 80)),
    });
  }

  // ── Withdrawals ───────────────────────────────────────────────
  console.log("Seeding withdrawals…");
  for (const pid of providerProfileIds.slice(0, 8)) {
    const n = randInt(1, 2);
    for (let k = 0; k < n; k++) {
      const status = weighted([["completed", 3], ["pending", 2], ["processing", 1]]) as any;
      await db.insert(withdrawals).values({
        providerId: pid, amount: money(randInt(20000, 150000)), status,
        bankName: "GTBank", accountNumber: `0${randInt(100000000, 999999999)}`,
        accountName: "Provider Account",
        processedAt: status === "completed" ? daysAgo(randInt(1, 30)) : null,
        processedBy: status === "completed" ? adminId : null,
        createdAt: daysAgo(randInt(1, 45)),
      });
    }
  }

  // ── A few disputes ────────────────────────────────────────────
  console.log("Seeding disputes…");
  for (let i = 0; i < 4 && i < completedBookings.length; i++) {
    const b = completedBookings[i];
    await db.insert(disputes).values({
      bookingId: b.id, customerId: b.customerId, providerId: b.providerProfileId,
      reason: pick(["incomplete_service", "no_show", "quality_issue", "overcharged"]),
      description: "Customer reported an issue with the completed service.",
      status: weighted([["open", 3], ["under_review", 2], ["resolved_customer", 1]]) as any,
      createdAt: daysAgo(randInt(1, 40)),
    });
  }

  // ── Platform settings + coupons ───────────────────────────────
  await db.insert(platformSettings).values([
    { key: "platform_commission_rate", value: "15", description: "Default commission percentage", updatedBy: adminId },
    { key: "min_withdrawal_amount", value: "5000", description: "Minimum provider withdrawal (NGN)", updatedBy: adminId },
    { key: "support_email", value: "support@weclean.ng", description: "Customer support email", updatedBy: adminId },
  ]);
  await db.insert(coupons).values([
    { code: "WELCOME10", description: "10% off first booking", discountType: "percentage", discountValue: "10", minOrderAmount: money(5000), startsAt: daysAgo(30), expiresAt: daysAgo(-60), usageLimit: 1000, usageCount: randInt(50, 400), createdBy: adminId, isActive: true },
    { code: "CLEAN5000", description: "₦5,000 off orders above ₦30,000", discountType: "fixed_amount", discountValue: "5000", minOrderAmount: money(30000), startsAt: daysAgo(10), expiresAt: daysAgo(-30), createdBy: adminId, isActive: true },
  ]);

  console.log("\n✅ Seed complete:");
  console.log(`   users:      ${(await db.select().from(users)).length}`);
  console.log(`   businesses: ${(await db.select().from(businesses)).length}`);
  console.log(`   providers:  ${(await db.select().from(providerProfiles)).length}`);
  console.log(`   bookings:   ${(await db.select().from(bookings)).length}`);
  console.log(`   reviews:    ${(await db.select().from(reviews)).length}`);
  console.log("\nDev logins (use the Login page “Dev login” or auth.devLogin):");
  console.log("   admin    → unionId: dev-admin");
  console.log("   business → unionId: dev-biz-1 (also dev-biz-2, dev-biz-3)");
  console.log("   customer → unionId: dev-cust-1");
}

main()
  .then(() => sqlite.close())
  .catch((e) => {
    console.error(e);
    sqlite.close();
    process.exit(1);
  });
