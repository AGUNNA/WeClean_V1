import { useParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  Clock,
  Shield,
  CheckCircle2,
  ChevronLeft,
  ArrowRight,
  Sparkles,
  Heart,
  Share2,
} from "lucide-react";
import { useState } from "react";

const servicesMap: Record<string, any> = {
  "house-cleaning": {
    title: "House Cleaning",
    price: "5,000",
    priceUnit: "per session",
    rating: 4.9,
    reviews: 2341,
    duration: "2-3 hours",
    description: "Our professional house cleaning service covers every aspect of your home. From dusting and vacuuming to mopping and sanitizing, we ensure your living space is spotless and fresh.",
    includes: [
      "Dusting all surfaces and furniture",
      "Vacuuming carpets and rugs",
      "Mopping all hard floors",
      "Cleaning and sanitizing bathrooms",
      "Kitchen countertop and appliance wipe-down",
      "Trash removal",
      "Bed making (upon request)",
    ],
    addons: [
      { name: "Inside Fridge", price: "2,000" },
      { name: "Inside Oven", price: "2,500" },
      { name: "Window Cleaning", price: "3,000" },
      { name: "Laundry Service", price: "5,000" },
    ],
    image: "/hero-cleaning.jpg",
  },
};

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);

  const service = servicesMap[slug || ""] || servicesMap["house-cleaning"];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate("/services")}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Services
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <div className="relative rounded-2xl overflow-hidden aspect-video">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-900/20" />
            </div>

            {/* Title */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl font-bold text-slate-900">
                  {service.title}
                </h1>
                <Badge className="bg-blue-100 text-blue-700">Popular</Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {service.rating} ({service.reviews.toLocaleString()} reviews)
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {service.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  Insured
                </span>
              </div>
            </div>

            {/* Description */}
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-3">
                  About This Service
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>

            {/* What's Included */}
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                  What's Included
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {service.includes.map((item: string) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-600">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Add-ons */}
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                  Available Add-ons
                </h2>
                <div className="space-y-3">
                  {service.addons.map((addon: any) => (
                    <div
                      key={addon.name}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
                    >
                      <span className="text-sm text-slate-700">
                        {addon.name}
                      </span>
                      <span className="text-sm font-semibold text-blue-600">
                        +N{addon.price}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <Card className="border-0 shadow-xl sticky top-24">
              <CardContent className="p-6 space-y-6">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Starting from</p>
                  <p className="text-3xl font-bold text-slate-900">
                    N{service.price}
                  </p>
                  <p className="text-sm text-slate-500">
                    {service.priceUnit}
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base"
                    onClick={() => navigate(`/book/1`)}
                  >
                    Book Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button variant="outline" className="w-full h-12">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Get Custom Quote
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setLiked(!liked)}
                  >
                    <Heart
                      className={`w-4 h-4 mr-2 ${
                        liked ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                    Save
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-slate-900">
                      Satisfaction Guaranteed
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Not happy with the service? We'll re-clean for free or
                    refund your money.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
