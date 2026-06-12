import { authRouter } from "./auth-router";
import { createRouter, publicQuery } from "./middleware";
import { serviceRouter } from "./routers/service-router";
import { bookingRouter } from "./routers/booking-router";
import { providerRouter } from "./routers/provider-router";
import { paymentRouter } from "./routers/payment-router";
import { reviewRouter } from "./routers/review-router";
import { messageRouter } from "./routers/message-router";
import { notificationRouter } from "./routers/notification-router";
import { addressRouter } from "./routers/address-router";
import { adminRouter } from "./routers/admin-router";
import { businessRouter } from "./routers/business-router";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  service: serviceRouter,
  booking: bookingRouter,
  provider: providerRouter,
  payment: paymentRouter,
  review: reviewRouter,
  message: messageRouter,
  notification: notificationRouter,
  address: addressRouter,
  admin: adminRouter,
  business: businessRouter,
});

export type AppRouter = typeof appRouter;
