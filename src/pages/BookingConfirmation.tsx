import { useParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  MessageSquare,
  Phone,
  ArrowRight,
  Home,
  Star,
  Share2,
  Download,
} from "lucide-react";

export default function BookingConfirmation() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Booking Confirmed!
          </h1>
          <p className="text-slate-500 mt-2">
            Your booking <span className="font-semibold text-blue-600">#{bookingId || "1284"}</span> has been confirmed.
          </p>
        </div>

        {/* Booking Card */}
        <Card className="border-0 shadow-xl mb-6">
          <CardContent className="p-6 space-y-6">
            {/* Status */}
            <div className="flex items-center justify-between">
              <Badge className="bg-blue-100 text-blue-700 text-sm px-3 py-1">
                Confirmed
              </Badge>
              <span className="text-sm text-slate-500">
                Ref: CLP{Date.now()}
              </span>
            </div>

            <Separator />

            {/* Service */}
            <div>
              <p className="text-sm text-slate-500 mb-1">Service</p>
              <h2 className="text-xl font-bold text-slate-900">
                House Cleaning - 2 Bedroom
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Includes: Dusting, Mopping, Bathroom Cleaning, Kitchen Wipe-down
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-500">Date</p>
                  <p className="text-sm font-semibold text-slate-900">
                    Thursday, May 15, 2026
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-500">Time</p>
                  <p className="text-sm font-semibold text-slate-900">
                    10:00 AM - 12:00 PM
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 col-span-2">
                <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-500">Address</p>
                  <p className="text-sm font-semibold text-slate-900">
                    15 Admiralty Way, Lekki Phase 1, Lagos
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Base Price</span>
                <span className="text-slate-700">N12,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Add-ons</span>
                <span className="text-slate-700">N0</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Platform Fee</span>
                <span className="text-slate-700">N600</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold text-slate-900">Total Paid</span>
                <span className="text-xl font-bold text-blue-600">
                  N12,600
                </span>
              </div>
            </div>

            <Separator />

            {/* Provider */}
            <div>
              <p className="text-sm text-slate-500 mb-3">Assigned Provider</p>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-blue-600">C</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Chioma A.</p>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      4.9
                    </span>
                    <span>156 jobs completed</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Button variant="outline" className="h-12">
            <MessageSquare className="w-4 h-4 mr-2" />
            Chat with Provider
          </Button>
          <Button variant="outline" className="h-12">
            <Phone className="w-4 h-4 mr-2" />
            Call Provider
          </Button>
        </div>

        {/* Next Steps */}
        <Card className="border-0 shadow-md mb-8">
          <CardContent className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4">What's Next?</h3>
            <div className="space-y-3">
              {[
                "Your provider will confirm arrival 30 mins before",
                "You'll receive an OTP to verify service completion",
                "Rate your experience after the cleaning is done",
                "Earn loyalty points for your next booking",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">
                      {i + 1}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{step}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bottom Actions */}
        <div className="flex flex-col gap-3">
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12"
            onClick={() => navigate("/dashboard")}
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Dashboard
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 h-10">
              <Download className="w-4 h-4 mr-2" />
              Receipt
            </Button>
            <Button variant="outline" className="flex-1 h-10">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
