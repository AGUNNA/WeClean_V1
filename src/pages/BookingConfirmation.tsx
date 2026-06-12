import { useParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import ReceiptDialog from "@/components/ReceiptDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  Home,
  Star,
  Share2,
  Download,
} from "lucide-react";

const naira = (v: string | number | null | undefined) =>
  "₦" + Number(v || 0).toLocaleString("en-NG", { maximumFractionDigits: 0 });

const statusColors: Record<string, string> = {
  confirmed: "bg-brand-100 text-brand-700",
  completed: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  provider_assigned: "bg-cyan-100 text-cyan-700",
  in_progress: "bg-purple-100 text-purple-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function BookingConfirmation() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const id = Number(bookingId);

  const { data: booking, isLoading } = trpc.booking.getById.useQuery(
    { id },
    { enabled: !!id }
  );

  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Booking Confirmed!</h1>
          <p className="text-slate-500 mt-2">
            Your booking{" "}
            <span className="font-semibold text-brand">
              #{id || bookingId}
            </span>{" "}
            has been placed.
          </p>
        </div>

        {/* Booking Card */}
        <Card className="border-ink/12 shadow-hard mb-6">
          <CardContent className="p-6 space-y-6">
            {isLoading ? (
              <Skeleton className="h-72 w-full" />
            ) : !booking ? (
              <p className="text-center text-slate-500 py-8">
                Booking not found.
              </p>
            ) : (
              <>
                {/* Status */}
                <div className="flex items-center justify-between">
                  <Badge
                    className={`text-sm px-3 py-1 ${
                      statusColors[booking.status] ?? "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {booking.status.replace(/_/g, " ")}
                  </Badge>
                  <span className="text-sm text-slate-500">
                    Ref: WC-{String(booking.id).padStart(5, "0")}
                  </span>
                </div>

                <Separator />

                {/* Services */}
                <div>
                  <p className="text-sm text-slate-500 mb-1">Service</p>
                  {booking.items?.length ? (
                    booking.items.map((it) => (
                      <h2 key={it.id} className="text-lg font-bold text-slate-900">
                        {it.serviceName}
                        <span className="text-slate-400 font-normal"> ×{it.quantity ?? 1}</span>
                      </h2>
                    ))
                  ) : (
                    <h2 className="text-lg font-bold text-slate-900">Cleaning service</h2>
                  )}
                  {booking.propertySize && (
                    <p className="text-sm text-slate-500 mt-1 capitalize">
                      {booking.propertySize.replace(/_/g, " ")}
                      {booking.numberOfRooms ? ` · ${booking.numberOfRooms} rooms` : ""}
                    </p>
                  )}
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-brand mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-500">Date</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {booking.scheduledDate
                          ? new Date(booking.scheduledDate).toLocaleDateString(undefined, {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-brand mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-500">Time</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {booking.preferredTimeStart || "To be confirmed"}
                        {booking.preferredTimeEnd ? ` - ${booking.preferredTimeEnd}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 col-span-2">
                    <MapPin className="w-5 h-5 text-brand mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-500">Address</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {booking.address
                          ? [
                              booking.address.address,
                              booking.address.city,
                              booking.address.state,
                            ]
                              .filter(Boolean)
                              .join(", ")
                          : "—"}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="text-slate-700">{naira(booking.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Add-ons</span>
                    <span className="text-slate-700">{naira(booking.addonTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Platform Fee</span>
                    <span className="text-slate-700">{naira(booking.platformFee)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-900">Total</span>
                    <span className="text-xl font-bold text-brand">
                      {naira(booking.totalAmount)}
                    </span>
                  </div>
                </div>

                <Separator />

                {/* Provider */}
                <div>
                  <p className="text-sm text-slate-500 mb-3">Assigned Provider</p>
                  {booking.provider?.name ? (
                    <div className="flex items-center gap-3 p-3 bg-cream rounded-md">
                      <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-brand">
                          {booking.provider.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{booking.provider.name}</p>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {booking.provider.overallRating ?? "—"}
                          </span>
                          <span>{booking.provider.totalJobsCompleted ?? 0} jobs completed</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-cream rounded-md text-sm text-slate-500">
                      A provider will be assigned shortly. You'll be notified.
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Bottom Actions */}
        <div className="flex flex-col gap-3">
          <Button
            className="w-full bg-brand hover:bg-brand-700 text-white h-12"
            onClick={() => navigate("/dashboard")}
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Dashboard
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <div className="flex gap-3">
            <ReceiptDialog bookingId={id}>
              <Button variant="outline" className="flex-1 h-10" disabled={!id}>
                <Download className="w-4 h-4 mr-2" />
                Receipt
              </Button>
            </ReceiptDialog>
            <Button
              variant="outline"
              className="flex-1 h-10"
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                toast.success("Link copied");
              }}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
